import { Button, Divider, FormHelperText, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
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
import { WEAN_STORAGE_KEY } from "./constants-livestock.json";
import { useNavigate } from "react-router";
import { numberDescriptionPostingGroupFormatter } from "../../../utils/strings";

const FORM_STORAGE_HOURS = 48;

interface WeanFormData extends FormData {
  group: string | number | null;
  healthStatus: string | number | null;
  event: string | number | null;
  postingDate: string | null;
  quantity: number | null;
  smallLivestockQuantity: number | null;
  totalWeight: number | null;
  comments: string;
}

const defaultValues: WeanFormData = {
  form: "WEAN",
  group: null,
  healthStatus: null,
  event: null,
  postingDate: formatDateToYYYYMMDDNoTimestamp(new Date()),
  quantity: null,
  smallLivestockQuantity: null,
  totalWeight: null,
  comments: ""
};

const columns = [
  { field: "postingGroup", headerName: "Posting Group", flex: 2 },
  { field: "inventory", headerName: "Inventory", flex: 1 },
  { field: "deads", headerName: "Deads", flex: 1 }
];

export default function WeanPage() {
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

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    getValues,
    formState: { errors }
  } = useForm<WeanFormData>({
    defaultValues: defaultValues,
    mode: "onSubmit"
  });

  useEffect(() => {
    let isMounted = true;
    setInitLoading(true);
    const promises = [];

    if (!(healthStatuses.length > 0 && eventTypes.length > 0 && currentTemplate === "WEAN"))
      promises.push(getEvents("WEAN"));
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
        setInventory({ group: details?.inventory ?? 0 });
        setDeads({ group: details?.deadQuantity ?? 0 });
      });
    }
  }, [groupValue, getPostingGroupDetails]);

  const onSubmit = async (data: WeanFormData) => {
    if (process.env.NODE_ENV === "development") {
      console.log("All required fields validated successfully!");
    }
    setInitLoading(true);
    const state = {
      formData: data,
      section: "livestock-activity"
    };
    livestockActivityApi
      .postLivestockEvent(data)
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
    const formData = getValues();
    saveForm(WEAN_STORAGE_KEY, formData, FORM_STORAGE_HOURS);
  };

  const handleReset = () => {
    showConfirmation(
      "Are you sure?",
      "This will reset all form fields to their default values.",
      () => reset(defaultValues)
    );
  };

  return (
    <CustomFormsLayout<WeanFormData>
      notice={{ formType: WEAN_STORAGE_KEY, onLoad: (data) => reset({ ...getValues(), ...data }) }}
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
                handleChange={(v) => setValue("healthStatus", v?.value ? String(v.value) : null)}
                loading={postingGroupsLoading}
                watch={watch}
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
                handleChange={(v) => setValue("event", v?.value ?? null)}
                watch={watch}
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
            <Divider />
            <Typography>Quantity</Typography>
            <Stack spacing={2} direction="row">
              <Stack sx={{ width: "100%" }}>
                <TextField
                  value={watch("quantity")}
                  label="Total"
                  placeholder="Total"
                  type="number"
                  {...register("quantity", {
                    required: "Total quantity is required",
                    min: {
                      value: 1,
                      message: "Quantity must be greater than 0"
                    }
                  })}
                  error={!!errors.quantity}
                  helperText={errors.quantity?.message}
                />
              </Stack>
              <Stack sx={{ width: "100%" }}>
                <TextField
                  value={watch("smallLivestockQuantity")}
                  label="Smalls"
                  placeholder="Smalls"
                  type="number"
                  {...register("smallLivestockQuantity", {
                    required: "Small livestock quantity is required",
                    min: { value: 0, message: "Quantity cannot be negative" }
                  })}
                  error={!!errors.smallLivestockQuantity}
                  helperText={errors.smallLivestockQuantity?.message}
                />
              </Stack>
            </Stack>

            <Stack>
              <TextField
                value={watch("totalWeight")}
                {...register("totalWeight", {
                  required: "Total weight is required",
                  min: { value: 1, message: "Weight must be greater than 0" }
                })}
                label="Total Weight"
                placeholder="Total Weight"
                type="number"
                error={!!errors.totalWeight}
                helperText={errors.totalWeight?.message}
              />
            </Stack>
            <Divider />
            <TextArea
              value={watch("comments")}
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
