import { SwapVert } from "@mui/icons-material";
import { Button, Divider, FormHelperText, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import CustomConfirmation from "../../../components/framework/CustomConfirmation";
import CustomHeader from "../../../components/framework/CustomHeader";
import CustomNotice from "../../../components/framework/CustomNotice";
import LoadingSpinner from "../../../components/framework/LoadingSpinner";
import { DatePicker, TextArea, TextField, TypeAhead, TypeAheadOption } from "../../../components/inputs";
import DenseTable from "../../../components/table/DenseTable";
import CustomFormsLayout from "../../../layouts/forms";
import { PostingGroup } from "../../../services/postingGroupsApi";
import { useLivestockActivityStore } from "../../../store/livestockActivityStore";
import { usePostingGroupsStore } from "../../../store/postingGroupsStore";
import { useConfirmationStore } from "../../../store/confirmationStore";
import { saveWithTTL } from "../../../utils/localStorage";
import { MOVE_STORAGE_KEY } from "./constants-livestock.json";

interface MoveFormData {
  fromJob: string | number | null;
  toJob: string | number | null;
  event: string | number | null;
  postingDate: Date | null;
  quantity: number | "";
  smallLivestockQuantity: number | "";
  totalWeight: number | "";
  comments: string;
}

const defaultValues: MoveFormData = {
  fromJob: null,
  toJob: null,
  event: null,
  postingDate: null,
  quantity: "",
  smallLivestockQuantity: "",
  totalWeight: "",
  comments: "",
};

const columns = [
  { field: "postingGroup", headerName: "Posting Group", flex: 2 },
  { field: "inventory", headerName: "Inventory", flex: 1 },
  { field: "deads", headerName: "Deads", flex: 1 },
];

export default function MovePage() {
  const { getPostingGroups, postingGroups } = usePostingGroupsStore();
  const { getEventTypes, eventTypes } = useLivestockActivityStore();
  const showConfirmation = useConfirmationStore((state) => state.showConfirmation);
  const [deads, setDeads] = useState<{ toJob: number; fromJob: number }>({
    toJob: 0,
    fromJob: 0,
  });
  const [inventory, setInventory] = useState<{
    toJob: number;
    fromJob: number;
  }>({ toJob: 0, fromJob: 0 });
  const [loading, setLoading] = useState(true);
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
    setLoading(true);
    const promises = [];
    if (!(eventTypes.length > 0 && eventTypes[0].Journal_Template_Name == "MOVE")) promises.push(getEventTypes("MOVE"));
    if (!(postingGroups.length > 0)) promises.push(getPostingGroups());

    Promise.all(promises).then(() => {
      setLoading(false);
    });
  }, []);

  const onSubmit = (data: MoveFormData) => {
    console.log("Form submitted:", data);
    console.log("All required fields validated successfully!");
  };

  const onSave = () => {
    const formData = getValues();
    saveWithTTL(MOVE_STORAGE_KEY, formData, 48);
    console.log("Form saved to localStorage with 48-hour TTL:", formData);
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
      {loading && <LoadingSpinner />}
      {!loading && (
        <>
          <CustomNotice<MoveFormData> storageKey={MOVE_STORAGE_KEY} onLoad={(data) => reset(data)} />
          <CustomFormsLayout>
            <CustomHeader icon={SwapVert} title="Move" button={{ label: "reset", onClick: handleReset }} />

            <form onSubmit={handleSubmit(onSubmit)}>
              <Stack spacing={2}>
                <Stack>
                  <TypeAhead
                    {...register("fromJob", { required: "From Job is required" })}
                    handleChange={(v) => setJob(v, "fromJob")}
                    options={postingGroups.map(
                      (job) =>
                        ({
                          label: formatLabel(job),
                          value: job.number,
                          deads: job.deadQuantity,
                          inventory: job.inventory,
                        }) as TypeAheadOption
                    )}
                    placeholder="From"
                  />
                  {errors.fromJob && <FormHelperText error>{errors.fromJob.message}</FormHelperText>}
                </Stack>

                <Stack>
                  <TypeAhead
                    {...register("toJob", { required: "To Job is required" })}
                    handleChange={(v) => setJob(v, "toJob")}
                    options={postingGroups.map(
                      (job) =>
                        ({
                          label: formatLabel(job),
                          value: job.number,
                          deads: job.deadQuantity,
                          inventory: job.inventory,
                        }) as TypeAheadOption
                    )}
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
                    options={eventTypes.map((event) => ({
                      label: event.Description,
                      value: event.Code,
                    }))}
                    placeholder="Event Name"
                  />
                  {errors.event && <FormHelperText error>{errors.event.message}</FormHelperText>}
                </Stack>

                <Stack>
                  <DatePicker
                    {...register("postingDate", {
                      required: "Posting Date is required",
                    })}
                    onChange={(v) => setValue("postingDate", v)}
                    label="Posting Date"
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
