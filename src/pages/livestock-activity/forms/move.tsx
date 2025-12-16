import { SwapVert } from "@mui/icons-material";
import { Button, Divider, FormHelperText, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import CustomConfirmation from "../../../components/framework/CustomConfirmation";
import CustomHeader from "../../../components/framework/CustomHeader";
import CustomNotice from "../../../components/framework/CustomNotice";
import LoadingSpinner from "../../../components/framework/LoadingSpinner";
import { DatePicker, TextArea, TextField, TypeAhead } from "../../../components/inputs";
import DenseTable from "../../../components/table/DenseTable";
import CustomFormsLayout from "../../../layouts/forms";
import { PostingGroup } from "../../../services/postingGroupsApi";
import { useConfirmationStore } from "../../../store/confirmationStore";
import { useFormStorageStore } from "../../../store/formStorageStore";
import { FormData, useLivestockActivityStore } from "../../../store/livestockActivityStore";
import { usePostingGroupsStore } from "../../../store/postingGroupsStore";
import { formatDateToYYYYMMDDNoTimestamp, parseYYYYMMDDToLocalDate } from "../../../utils/date";
import { MOVE_STORAGE_KEY } from "./constants-livestock.json";
import { livestockActivityApi } from "../../../services/livestockActivityApi";
import { useNavigate } from "react-router";

interface MoveFormData extends FormData {
  fromJob: string | number | null;
  toJob: string | number | null;
  event: string | number | null;
  postingDate: string;
  quantity: number | null;
  smallLivestockQuantity: number | null;
  totalWeight: number | null;
  comments: string;
}

const defaultValues: MoveFormData = {
  form: "MOVE",
  fromJob: null,
  toJob: null,
  event: null,
  postingDate: formatDateToYYYYMMDDNoTimestamp(new Date()),
  quantity: null,
  smallLivestockQuantity: null,
  totalWeight: null,
  comments: "",
};

const columns = [
  { field: "postingGroup", headerName: "Posting Group", flex: 2 },
  { field: "inventory", headerName: "Inventory", flex: 1 },
  { field: "deads", headerName: "Deads", flex: 1 },
];

export default function MovePage() {
  const navigate = useNavigate();
  const { getPostingGroups, postingGroups } = usePostingGroupsStore();
  const { getEventTypes, eventTypes } = useLivestockActivityStore();
  const showConfirmation = useConfirmationStore((state) => state.showConfirmation);
  const { saveForm } = useFormStorageStore();
  const [deads, setDeads] = useState<{ toJob: number; fromJob: number }>({
    toJob: 0,
    fromJob: 0,
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
    formState: { errors },
  } = useForm<MoveFormData>({
    defaultValues: defaultValues,
    mode: "onSubmit",
  });

  useEffect(() => {
    setInitLoading(true);
    const promises = [];
    if (!(eventTypes.length > 0 && eventTypes[0].Journal_Template_Name == "MOVE")) promises.push(getEventTypes("MOVE"));
    if (!(postingGroups.length > 0)) promises.push(getPostingGroups());

    Promise.all(promises).then(() => {
      setInitLoading(false);
    });
  }, []);

  const onSubmit = async (data: MoveFormData) => {
    console.log("All required fields validated successfully!");
    setInitLoading(true);
    const state = { formData: data, section: "livestock-activity" };
    livestockActivityApi
      .postLivestockEvent(data)
      .then(() => {
        console.log("Form submitted:", data);
        navigate("/post-success", { state });
      })
      .catch((e: any) => {
        console.error("Unable to post form.");
        const error = {
          code: e.code || data.form + "_SUBMISSION_ERROR",
          message: e.message || "Unable to submit form. Please try again.",
          details: e.details || JSON.stringify(e, null, 2),
        };
        navigate("/post-error", { state: { ...state, error } });
      })
      .finally(() => {
        setInitLoading(false);
      });
  };

  const onSave = () => {
    const formData = getValues();
    saveForm(MOVE_STORAGE_KEY, formData, 48);
  };

  const handleReset = () => {
    showConfirmation("Are you sure?", "This will reset all form fields to their default values.", () => reset(defaultValues));
  };

  const setJob = (value: any, label: "fromJob" | "toJob") => {
    const job = postingGroups.find((pg) => pg.number === value?.value);
    if (job && value && value.value) {
      setValue(label, value.value);
      setDeads({ ...deads, [label]: job.deadQuantity } as any);
      setInventory({ ...inventory, [label]: job.inventory } as any);
    }
  };

  const formatLabel = (job: PostingGroup) => `${job.number} ${job.description}`;

  return (
    <>
      {initLoading && <LoadingSpinner />}
      {!initLoading && (
        <>
          <CustomNotice<MoveFormData> formType={MOVE_STORAGE_KEY} onLoad={(data) => reset(data)} />
          <CustomFormsLayout>
            <CustomHeader icon={SwapVert} title="Move" button={{ label: "reset", onClick: handleReset }} />

            <form onSubmit={handleSubmit(onSubmit)}>
              <Stack spacing={2}>
                <Stack>
                  <TypeAhead
                    {...register("fromJob", { required: "From Job is required" })}
                    handleChange={(v) => setJob(v, "fromJob")}
                    watch={watch}
                    fieldName={"fromJob"}
                    labelFormatter={formatLabel}
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
                    fieldName={"toJob"}
                    labelFormatter={formatLabel}
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
                        postingGroup: watch("fromJob"),
                        inventory: inventory.fromJob,
                        deads: deads.fromJob,
                      },
                      {
                        name: "toJob",
                        postingGroup: watch("toJob"),
                        inventory: inventory.toJob,
                        deads: deads.toJob,
                      },
                    ]}
                    columns={columns}
                  />
                )}
                <Divider />
                <Typography>Event Details</Typography>
                <Stack>
                  <TypeAhead
                    {...register("event", { required: "Event is required" })}
                    handleChange={(v) => v && v.value && setValue("event", v.value)}
                    watch={watch}
                    fieldName={"event"}
                    labelKey={"Description"}
                    valueKey={"Code"}
                    valueList={eventTypes}
                    placeholder="Event Name"
                  />
                  {errors.event && <FormHelperText error>{errors.event.message}</FormHelperText>}
                </Stack>

                <Stack>
                  <DatePicker
                    {...register("postingDate", {
                      required: "Posting Date is required",
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
                      placeholder="Total"
                      type="number"
                      {...register("quantity", {
                        required: "Total quantity is required",
                        min: {
                          value: 1,
                          message: "Quantity must be greater than 0",
                        },
                      })}
                      error={!!errors.quantity}
                      helperText={errors.quantity?.message}
                    />
                  </Stack>
                  <Stack sx={{ width: "100%" }}>
                    <TextField
                      placeholder="Smalls"
                      type="number"
                      {...register("smallLivestockQuantity", {
                        required: "Small livestock quantity is required",
                        min: { value: 0, message: "Quantity cannot be negative" },
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
                      min: { value: 1, message: "Weight must be greater than 0" },
                    })}
                    placeholder="Total Weight"
                    type="number"
                    error={!!errors.totalWeight}
                    helperText={errors.totalWeight?.message}
                  />
                </Stack>
                <Divider />
                <TextArea
                  {...register("comments", { maxLength: { value: 50, message: "Comments cannot exceed 50 characters" } })}
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

            <CustomConfirmation />
          </CustomFormsLayout>
        </>
      )}
    </>
  );
}
