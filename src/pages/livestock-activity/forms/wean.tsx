import { Celebration } from "@mui/icons-material";
import {
  Button,
  Divider,
  FormHelperText,
  Stack,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import CustomConfirmation from "../../../components/framework/CustomConfirmation";
import CustomHeader from "../../../components/framework/CustomHeader";
import CustomNotice from "../../../components/framework/CustomNotice";
import LoadingSpinner from "../../../components/framework/LoadingSpinner";
import {
  DatePicker,
  TextArea,
  TextField,
  TypeAhead,
  TypeAheadOption,
} from "../../../components/inputs";
import DenseTable from "../../../components/table/DenseTable";
import CustomFormsLayout from "../../../layouts/forms";
import { PostingGroup } from "../../../services/postingGroupsApi";
import { useLivestockActivityStore } from "../../../store/livestockActivityStore";
import { usePostingGroupsStore } from "../../../store/postingGroupsStore";
import { useConfirmationStore } from "../../../store/confirmationStore";
import { saveWithTTL } from "../../../utils/localStorage";

interface WeanFormData {
  fromJob: string | number | null;
  toJob: string | number | null;
  healthStatus: string | null;
  event: string | number | null;
  postingDate: Date | null;
  quantity: number | "";
  smallLivestockQuantity: number | "";
  totalWeight: number | "";
  comments: string;
}

const defaultValues: WeanFormData = {
  fromJob: null,
  toJob: null,
  healthStatus: null,
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

export default function WeanPage() {
  const { getPostingGroups, postingGroups } = usePostingGroupsStore();
  const { getEventTypes, eventTypes, healthStatuses } = useLivestockActivityStore();
  const showConfirmation = useConfirmationStore(
    (state) => state.showConfirmation
  );
  const [deads, setDeads] = useState<{ toJob: number; fromJob: number }>({
    toJob: 0,
    fromJob: 0,
  });
  const [inventory, setInventory] = useState<{
    toJob: number;
    fromJob: number;
  }>({ toJob: 0, fromJob: 0 });
  const [loading, setLoading] = useState(false);
  const [filteredEvents, setFilteredEvents] = useState<typeof eventTypes>([]);
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<WeanFormData>({
    defaultValues: defaultValues,
    mode: "onSubmit",
  });

  const selectedHealthStatus = watch("healthStatus");

  useEffect(() => {
    setLoading(!(postingGroups && eventTypes));
    Promise.all([getPostingGroups(), getEventTypes("wean")]).then((x) => {
      console.log("Fetched posting groups and event types:", x);
      setLoading(false);
    });
  }, []);

  // Filter events based on health status
  useEffect(() => {
    if (selectedHealthStatus) {
      // Filter events based on health status
      // For now, showing all events, but you can add filtering logic here
      setFilteredEvents(eventTypes);
    } else {
      setFilteredEvents([]);
    }
  }, [selectedHealthStatus, eventTypes]);

  const onSubmit = (data: WeanFormData) => {
    console.log("Form submitted:", data);
    console.log("All required fields validated successfully!");
  };

  const onSave = () => {
    const formData = getValues();
    saveWithTTL("livestock-wean-form", formData, 48);
    console.log("Form saved to localStorage with 48-hour TTL:", formData);
  };

  const handleReset = () => {
    showConfirmation(
      "Are you sure?",
      "This will reset all form fields to their default values.",
      () => reset(defaultValues)
    );
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
      <CustomNotice<WeanFormData>
        storageKey="livestock-wean-form"
        onLoad={(data) => reset(data)}
      />
      <CustomFormsLayout>
        <CustomHeader icon={Celebration} title="Wean" />

        {loading && <LoadingSpinner />}
        {!loading && (
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={2}>
              <Stack>
                <TypeAhead
                  {...register("fromJob", { required: "From Job is required" })}
                  onChange={(v) => setJob(v, "fromJob")}
                  options={postingGroups.map(
                    (job) =>
                      ({
                        label: formatLabel(job),
                        value: job.number,
                        deads: job.deadQuantity,
                        inventory: job.inventory,
                      }) as TypeAheadOption
                  )}
                  label="From"
                />
                {errors.fromJob && (
                  <FormHelperText error>
                    {errors.fromJob.message}
                  </FormHelperText>
                )}
              </Stack>

              <Stack>
                <TypeAhead
                  {...register("toJob", { required: "To Job is required" })}
                  onChange={(v) => setJob(v, "toJob")}
                  options={postingGroups.map(
                    (job) =>
                      ({
                        label: formatLabel(job),
                        value: job.number,
                        deads: job.deadQuantity,
                        inventory: job.inventory,
                      }) as TypeAheadOption
                  )}
                  label="To"
                />
                {errors.toJob && (
                  <FormHelperText error>{errors.toJob.message}</FormHelperText>
                )}
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

              <Stack>
                <TypeAhead
                  {...register("healthStatus", { required: "Health Status is required" })}
                  onChange={(v) => v && v.value && setValue("healthStatus", String(v.value))}
                  options={healthStatuses.map((status) => ({
                    label: status.description,
                    value: status.code,
                  }))}
                  label="Health Status"
                />
                {errors.healthStatus && (
                  <FormHelperText error>{errors.healthStatus.message}</FormHelperText>
                )}
              </Stack>

              <Divider />
              <Typography>Event Details</Typography>
              <Stack>
                <TypeAhead
                  {...register("event", { required: "Event is required" })}
                  onChange={(v) => v && v.value && setValue("event", v.value)}
                  options={filteredEvents.map((event) => ({
                    label: event.Description,
                    value: event.Code,
                  }))}
                  label="Event Name"
                />
                {errors.event && (
                  <FormHelperText error>{errors.event.message}</FormHelperText>
                )}
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
                    label="Total"
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
                    label="Smalls"
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
                  label="Total Weight"
                  type="number"
                  error={!!errors.totalWeight}
                  helperText={errors.totalWeight?.message}
                />
              </Stack>
              <Divider />
              <TextArea
                {...register("comments")}
                label="Comments"
                type="text"
              />
              <Button
                variant="text"
                color="primary"
                fullWidth
                onClick={handleReset}
              >
                Reset
              </Button>
              <Stack direction="row" spacing={2} justifyContent="flex-end">
                <Button
                  variant="outlined"
                  color="primary"
                  fullWidth
                  onClick={onSave}
                >
                  Save
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  type="submit"
                >
                  Submit
                </Button>
              </Stack>
            </Stack>
          </form>
        )}

        <CustomConfirmation />
      </CustomFormsLayout>
    </>
  );
}
