import {
  Button,
  Divider,
  FormHelperText,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography
} from "@mui/material";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import LoadingSpinner from "../../../components/framework/LoadingSpinner";
import { DatePicker, TextArea, TextField, TypeAhead } from "../../../components/inputs";
import DenseTable from "../../../components/table/DenseTable";
import CustomFormsLayout from "../../../layouts/forms";
import { livestockActivityApi } from "../../../services/livestockActivityApi";
import { useConfirmationStore } from "../../../store/confirmationStore";
import { useFormStorageStore } from "../../../store/formStorageStore";
import { useGlobalAlertStore } from "../../../store/globalAlertStore";
import { useLivestockActivityStore } from "../../../store/livestockActivityStore";
import { usePostingGroupsStore } from "../../../store/postingGroupsStore";
import { FormData } from "../../../store/types/forms";
import { formatDateToYYYYMMDDNoTimestamp, parseYYYYMMDDToLocalDate } from "../../../utils/date";
import { QTYADJ_STORAGE_KEY } from "./constants-livestock.json";
import { numberDescriptionPostingGroupFormatter } from "../../../utils/strings";

const FORM_STORAGE_HOURS = 48;

interface QuantityAdjFormData extends FormData {
  group: string | number | null;
  healthStatus: string | number | null;
  healthStatusLabel: string | null;
  event: string | number | null;
  eventLabel: string | null;
  postingDate: string | null;
  quantity: number | null;
  totalWeight: number | null;
  comments: string;
}

const defaultValues: QuantityAdjFormData = {
  form: "QTYADJ",
  group: null,
  healthStatus: null,
  healthStatusLabel: null,
  event: null,
  eventLabel: null,
  postingDate: formatDateToYYYYMMDDNoTimestamp(new Date()),
  quantity: null,
  totalWeight: null,
  comments: ""
};

const columns = [
  { field: "postingGroup", headerName: "Posting Group", flex: 2 },
  { field: "inventory", headerName: "Inventory", flex: 1 },
  { field: "deads", headerName: "Deads", flex: 1 }
];

export default function QuantityAdjPage() {
  const navigate = useNavigate();
  const {
    isLoading: postingGroupsLoading,
    getPostingGroups,
    getPostingGroupDetails,
    postingGroups,
    postingGroupDetails
  } = usePostingGroupsStore();
  const {
    getEvents,
    eventTypes,
    healthStatuses,
    isLoading: livestockActivityLoading,
    currentTemplate
  } = useLivestockActivityStore();
  const showConfirmation = useConfirmationStore((state) => state.showConfirmation);
  const { setAlert } = useGlobalAlertStore();
  const [deads, setDeads] = useState<{ group: number }>({ group: 0 });
  const [inventory, setInventory] = useState<{ group: number }>({ group: 0 });
  const [initLoading, setInitLoading] = useState(false);
  const { saveForm } = useFormStorageStore();
  const [multiplier, setMultiplier] = useState<1 | -1>(1);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    getValues,
    formState: { errors }
  } = useForm<QuantityAdjFormData>({
    defaultValues: defaultValues,
    mode: "onSubmit"
  });

  useEffect(() => {
    let isMounted = true;
    setInitLoading(true);
    const promises = [];
    if (!(healthStatuses.length > 0 && eventTypes.length > 0 && currentTemplate === "QTYADJ"))
      promises.push(getEvents("QTYADJ", postingGroupDetails.number));
    if (!(postingGroups.length > 0)) promises.push(getPostingGroups());

    Promise.all(promises).then(() => {
      if (isMounted) {
        setInitLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const groupValue = watch("group");
  useEffect(() => {
    if (groupValue) {
      getPostingGroupDetails(groupValue).then((details) => {
        if (process.env.NODE_ENV === "development") {
          console.log({ details });
        }
        setInventory({ group: details?.inventory ?? 0 });
        setDeads({ group: details?.deadQuantity ?? 0 });
      });
    }
  }, [groupValue, getPostingGroupDetails]);

  const quantityValue = watch("quantity");
  useEffect(() => {
    if ((quantityValue ?? 0) < 0) setMultiplier(-1); //defaults to positive, so only set negative
    setValue("quantity", Math.abs(getValues("quantity") ?? 0) || null);
  }, [quantityValue, setValue, getValues]);

  const onSubmit = async (data: QuantityAdjFormData) => {
    if (process.env.NODE_ENV === "development") {
      console.log("All required fields validated successfully!");
    }
    setInitLoading(true);
    const formData = { ...getValues(), quantity: multiplier * (getValues("quantity") ?? 0) };
    const state = {
      formData,
      section: "livestock-activity"
    };
    livestockActivityApi
      .postLivestockEvent(formData)
      .then(() => {
        if (process.env.NODE_ENV === "development") {
          console.log("Form submitted:", data);
        }
        navigate("/post-success", { state });
      })
      .catch((error: unknown) => {
        setAlert("error", error as Error);
      })
      .finally(() => {
        setInitLoading(false);
      });
  };

  const onSave = () => {
    const formData = { ...getValues(), quantity: multiplier * (getValues("quantity") ?? 0) };
    saveForm(QTYADJ_STORAGE_KEY, formData, FORM_STORAGE_HOURS);
  };

  const handleReset = () => {
    showConfirmation(
      "Are you sure?",
      "This will reset all form fields to their default values.",
      () => {
        setMultiplier(1);
        reset(defaultValues);
      }
    );
  };

  return (
    <CustomFormsLayout<QuantityAdjFormData>
      notice={{
        formType: QTYADJ_STORAGE_KEY,
        onLoad: (data) => reset({ ...getValues(), ...data })
      }}
      headerOptions={{ button: { label: "reset", onClick: handleReset } }}
    >
      {initLoading && <LoadingSpinner />}
      {!initLoading && (
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={2}>
            <Stack>
              <TypeAhead
                {...register("group", { required: "Group is required" })}
                handleChange={(v) => setValue("group", v?.value ? String(v.value) : null)}
                watch={watch}
                label="Group"
                fieldName={"group"}
                labelKey={"description"}
                valueKey={"number"}
                labelFormatter={numberDescriptionPostingGroupFormatter}
                valueList={postingGroups}
                loading={postingGroupsLoading}
                placeholder="Group"
              />
              {errors.group && <FormHelperText error>{errors.group.message}</FormHelperText>}
            </Stack>

            {watch("group") && (
              <DenseTable
                loading={postingGroupsLoading}
                rows={[
                  {
                    name: "group",
                    postingGroup: watch("group"),
                    inventory: inventory.group,
                    deads: deads.group
                  }
                ]}
                columns={columns}
              />
            )}

            <Stack>
              <TypeAhead
                {...register("healthStatus")}
                handleChange={(v) => {
                  setValue("healthStatus", v?.value ? String(v.value) : null);
                  setValue("healthStatusLabel", v?.label ?? null);
                }}
                loading={postingGroupsLoading}
                watch={watch}
                label="Health Status"
                valueList={healthStatuses}
                fieldName={"healthStatus"}
                labelKey={"description"}
                valueKey={"code"}
                defaultValue={
                  postingGroupDetails?.healthStatus?.Code
                    ? {
                        label: postingGroupDetails.healthStatus.Description,
                        value: postingGroupDetails.healthStatus.Code
                      }
                    : null
                }
                placeholder={
                  postingGroupDetails?.healthStatus?.Description || healthStatuses.length > 0
                    ? "Health Status"
                    : "Select a valid group"
                }
              />
              {errors.healthStatus && (
                <FormHelperText error>{errors.healthStatus.message}</FormHelperText>
              )}
            </Stack>

            <Divider />
            <Typography>Event</Typography>
            <Stack>
              <TypeAhead
                {...register("event", { required: "Event is required" })}
                handleChange={(v) => {
                  setValue("event", v?.value ?? null);
                  setValue("eventLabel", v?.label ?? null);
                }}
                watch={watch}
                label="Event"
                fieldName={"event"}
                labelKey={"description"}
                valueKey={"code"}
                valueList={eventTypes}
                loading={livestockActivityLoading}
                placeholder="Event Name"
              />
              {errors.event && <FormHelperText error>{errors.event.message}</FormHelperText>}
            </Stack>

            <Stack>
              <DatePicker
                {...register("postingDate", {
                  required: "Posting Date is required"
                })}
                value={parseYYYYMMDDToLocalDate(watch("postingDate") || "")}
                onChange={(v) => setValue("postingDate", formatDateToYYYYMMDDNoTimestamp(v))}
                label="Posting Date"
                error={!!errors.postingDate}
                helperText={errors.postingDate?.message}
              />
            </Stack>
            <Stack>
              <ToggleButtonGroup
                fullWidth
                value={multiplier}
                exclusive
                onChange={(_, newValue) => setMultiplier(newValue)}
                aria-label="quantity addition or removal"
              >
                <ToggleButton value={1} aria-label="positive" color="primary">
                  + Add
                </ToggleButton>
                <ToggleButton value={-1} aria-label="negative" color="error">
                  - Remove
                </ToggleButton>
              </ToggleButtonGroup>
            </Stack>
            <Stack>
              <TextField
                label="Total Quantity"
                placeholder="Total Quantity"
                type="number"
                value={watch("quantity")}
                {...register("quantity", {
                  required: "Total quantity is required",
                  min: {
                    value: 1,
                    message: "Quantity must be greater than 0"
                  }
                })}
                onChange={(v) => setValue("quantity", Math.abs(Number(v.target.value)))}
                error={!!errors.quantity}
                helperText={errors.quantity?.message}
              />
            </Stack>

            <Stack>
              <TextField
                {...register("totalWeight", {
                  required: "Total weight is required"
                })}
                label="Total Weight"
                placeholder="Total Weight"
                type="number"
                value={watch("totalWeight")}
                error={!!errors.totalWeight}
                helperText={errors.totalWeight?.message}
              />
            </Stack>
            <Divider />
            <TextArea
              {...register("comments", {
                maxLength: { value: 50, message: "Comments cannot exceed 50 characters" }
              })}
              placeholder="Comments"
              type="text"
              error={!!errors.comments}
              helperText={errors.comments?.message}
            />
            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button variant="outlined" color="primary" fullWidth onClick={onSave}>
                Save
              </Button>
              <Button variant="contained" color="primary" fullWidth type="submit">
                Submit
              </Button>
            </Stack>
          </Stack>
        </form>
      )}

    </CustomFormsLayout>
  );
}
