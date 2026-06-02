import { Button, Divider, FormHelperText, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import LoadingSpinner from "../../../components/framework/LoadingSpinner";
import { DatePicker, TextArea, TextField, TypeAhead } from "../../../components/inputs";
import DenseTable from "../../../components/table/DenseTable";
import CustomFormsLayout from "../../../layouts/forms";
import { useConfirmationStore } from "../../../store/confirmationStore";
import { useFormStorageStore } from "../../../store/formStorageStore";
import { useGlobalAlertStore } from "../../../store/globalAlertStore";
import { useLivestockActivityStore } from "../../../store/livestockActivityStore";
import { usePostingGroupsStore, useFilteredPostingGroups } from "../../../store/postingGroupsStore";
import { formatDateToYYYYMMDDNoTimestamp, parseYYYYMMDDToLocalDate } from "../../../utils/date";
import { MOVE_STORAGE_KEY } from "./constants-livestock.json";
import { livestockActivityApi } from "../../../services/livestockActivityApi";
import { useNavigate } from "react-router";
import { FormData } from "../../../store/types/forms";
import { numberDescriptionPostingGroupFormatter } from "../../../utils/strings";
const FORM_STORAGE_HOURS = 48;

interface MoveFormData extends FormData {
  fromJob: string | number | null;
  fromJobLabel: string | null;
  toJob: string | number | null;
  toJobLabel: string | null;
  event: string | number | null;
  eventLabel: string | null;
  postingDate: string;
  quantity: number | null;
  smallLivestockQuantity: number | null;
  totalWeight: number | null;
  unitAmount: number | null;
  comments: string;
}

const defaultValues: MoveFormData = {
  form: "MOVE",
  fromJob: null,
  fromJobLabel: null,
  toJob: null,
  toJobLabel: null,
  event: null,
  eventLabel: null,
  postingDate: formatDateToYYYYMMDDNoTimestamp(new Date()),
  quantity: null,
  smallLivestockQuantity: null,
  totalWeight: null,
  unitAmount: null,
  comments: ""
};

const columns = [
  { field: "postingGroup", headerName: "Posting Group", flex: 2 },
  { field: "inventory", headerName: "Inventory", flex: 1 },
  { field: "deads", headerName: "Deads", flex: 1 }
];

export default function MovePage() {
  const navigate = useNavigate();
  const { getPostingGroups, getPostingGroupDetails } = usePostingGroupsStore();
  const postingGroups = useFilteredPostingGroups();
  const { getEvents, eventTypes, currentTemplate } = useLivestockActivityStore();
  const showConfirmation = useConfirmationStore((state) => state.showConfirmation);
  const { setAlert } = useGlobalAlertStore();
  const { saveForm } = useFormStorageStore();
  const [deads, setDeads] = useState<{ toJob: number; fromJob: number }>({
    toJob: 0,
    fromJob: 0
  });
  const [inventory, setInventory] = useState<{
    toJob: number;
    fromJob: number;
  }>({ toJob: 0, fromJob: 0 });
  const [initLoading, setInitLoading] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    getValues,
    formState: { errors }
  } = useForm<MoveFormData>({
    defaultValues: defaultValues,
    mode: "onSubmit"
  });

  useEffect(() => {
    let isMounted = true;
    setInitLoading(true);
    const promises = [];
    if (!(eventTypes.length > 0 && currentTemplate === "MOVE")) promises.push(getEvents("MOVE"));
    if (!(postingGroups.length > 0)) promises.push(getPostingGroups());

    Promise.all(promises)
      .then(() => {
        if (isMounted) {
          setInitLoading(false);
        }
      })
      .catch((error: unknown) => {
        setAlert("error", error as Error);
      })
      .finally(() => {
        setInitLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const onSubmit = async (data: MoveFormData) => {
    if (process.env.NODE_ENV === "development") {
      console.log("All required fields validated successfully!");
    }
    setInitLoading(true);
    const state = { formData: data, section: "livestock-activity" };
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
    saveForm(MOVE_STORAGE_KEY, formData, FORM_STORAGE_HOURS);
  };

  const handleReset = () => {
    showConfirmation(
      "Are you sure?",
      "This will reset all form fields to their default values.",
      () => reset(defaultValues)
    );
  };

  const setJob = (value: any, label: "fromJob" | "toJob") => {
    const labelKey = `${label}Label` as "fromJobLabel" | "toJobLabel";
    if (!value || !value.value) {
      setValue(label, null);
      setValue(labelKey, null);
      setDeads({ ...deads, [label]: undefined } as any);
      setInventory({ ...inventory, [label]: undefined } as any);
      if (label === "fromJob") {
        setValue("unitAmount", null);
      }
      return;
    }

    const job = postingGroups.find((pg) => pg.number === value.value);
    if (job) {
      setValue(label, value.value);
      setValue(labelKey, value.label ?? null);
      setDeads({ ...deads, [label]: job.deadQuantity } as any);
      setInventory({ ...inventory, [label]: job.inventory } as any);
      if (label === "fromJob") {
        getPostingGroupDetails(value.value).then((details) =>
          setValue("unitAmount", details?.personResponsible?.Unit_Price ?? null)
        );
      }
    }
  };

  return (
    <CustomFormsLayout<MoveFormData>
      notice={{ formType: MOVE_STORAGE_KEY, onLoad: (data) => reset(data) }}
      headerOptions={{ button: { label: "reset", onClick: handleReset } }}
    >
      {initLoading && <LoadingSpinner />}
      {!initLoading && (
        <>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={2}>
              <Stack>
                <TypeAhead
                  {...register("fromJob", { required: "From Job is required" })}
                  handleChange={(v) => setJob(v, "fromJob")}
                  watch={watch}
                  label="From"
                  fieldName={"fromJob"}
                  labelFormatter={numberDescriptionPostingGroupFormatter}
                  labelKey={"description"}
                  valueKey={"number"}
                  valueList={postingGroups}
                  placeholder="From"
                />
                {errors.fromJob && <FormHelperText error>{errors.fromJob.message}</FormHelperText>}
              </Stack>

              <Stack>
                <TypeAhead
                  {...register("toJob", { required: "To Job is required" })}
                  handleChange={(v) => setJob(v, "toJob")}
                  watch={watch}
                  label="To"
                  fieldName={"toJob"}
                  labelFormatter={numberDescriptionPostingGroupFormatter}
                  labelKey={"description"}
                  valueKey={"number"}
                  valueList={postingGroups}
                  placeholder="To"
                />
                {errors.toJob && <FormHelperText error>{errors.toJob.message}</FormHelperText>}
              </Stack>
              {watch("fromJob") && watch("toJob") && (
                <DenseTable
                  rows={[
                    {
                      name: "fromJob",
                      postingGroup: watch("fromJobLabel") || watch("fromJob"),
                      inventory: inventory.fromJob,
                      deads: deads.fromJob
                    },
                    {
                      name: "toJob",
                      postingGroup: watch("toJobLabel") || watch("toJob"),
                      inventory: inventory.toJob,
                      deads: deads.toJob
                    }
                  ]}
                  columns={columns}
                />
              )}
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
                  valueList={[...eventTypes].sort((a, b) => Number(a.code) - Number(b.code))}
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
                    label="Total"
                    placeholder="Total"
                    type="number"
                    value={watch("quantity")}
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
                    label="Smalls"
                    placeholder="Smalls"
                    type="number"
                    value={watch("smallLivestockQuantity")}
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
                  {...register("totalWeight", {
                    required: "Total weight is required",
                    min: { value: 1, message: "Weight must be greater than 0" }
                  })}
                  label="Total Weight"
                  placeholder="Total Weight"
                  type="number"
                  value={watch("totalWeight")}
                  error={!!errors.totalWeight}
                  helperText={errors.totalWeight?.message}
                />
              </Stack>
              {watch("unitAmount") != null && (
                <Typography>
                  Unit Amount: <strong>${watch("unitAmount")}</strong>
                </Typography>
              )}
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

        </>
      )}
    </CustomFormsLayout>
  );
}
