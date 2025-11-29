import { Celebration } from "@mui/icons-material";
import { Button, Divider, FormHelperText, Stack, Typography } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import CustomConfirmation from "../../../components/framework/CustomConfirmation";
import CustomHeader from "../../../components/framework/CustomHeader";
import CustomNotice from "../../../components/framework/CustomNotice";
import LoadingSpinner from "../../../components/framework/LoadingSpinner";
import { DatePicker, TextArea, TextField, TypeAhead, TypeAheadOption } from "../../../components/inputs";
import DenseTable from "../../../components/table/DenseTable";
import CustomFormsLayout from "../../../layouts/forms";
import { PostingGroup } from "../../../services/postingGroupsApi";
import { useConfirmationStore } from "../../../store/confirmationStore";
import { useLivestockActivityStore } from "../../../store/livestockActivityStore";
import { usePostingGroupsStore } from "../../../store/postingGroupsStore";
import { saveWithTTL } from "../../../utils/localStorage";
import { WEAN_STORAGE_KEY } from "./constants-livestock.json";
import useTypeAheadValue from "../../../hooks/useMemoTypeahead";

interface WeanFormData {
  group: string | number | null;
  healthStatus: string | number | null;
  event: string | number | null;
  postingDate: Date | null;
  quantity: number | "";
  smallLivestockQuantity: number | "";
  totalWeight: number | "";
  comments: string;
}

const defaultValues: WeanFormData = {
  group: null,
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
  const { isLoading: postingGroupsLoading, getPostingGroups, getPostingGroupDetails, postingGroups, postingGroupDetails } = usePostingGroupsStore();
  const { getEventTypes, eventTypes, healthStatuses, getHealthStatuses } = useLivestockActivityStore();
  const showConfirmation = useConfirmationStore((state) => state.showConfirmation);
  const [deads, setDeads] = useState<{ group: number }>({ group: 0 });
  const [inventory, setInventory] = useState<{ group: number }>({ group: 0 });
  const [loading, setLoading] = useState(false);

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

  useEffect(() => {
    setLoading(true);
    const promises = [];
    if (!(eventTypes.length > 0 && eventTypes[0].Journal_Template_Name === "WEAN")) promises.push(getEventTypes("WEAN"));
    if (!(postingGroups.length > 0)) promises.push(getPostingGroups());
    if (!(healthStatuses.length > 0)) promises.push(getHealthStatuses());

    Promise.all(promises).then(() => setLoading(false));
  }, []);

  useEffect(() => {
    const group = watch("group");
    group &&
      getPostingGroupDetails(group).then((details) => {
        console.log({ details });
        setInventory({ group: details?.inventory ?? 0 });
        setDeads({ group: details?.deadQuantity ?? 0 });
      });
  }, [watch("group")]);

  const onSubmit = (data: WeanFormData) => {
    console.log("Form submitted:", data);
    console.log("All required fields validated successfully!");
  };

  const onSave = () => {
    const formData = getValues();
    saveWithTTL(WEAN_STORAGE_KEY, formData, 48);
    console.log("Form saved to localStorage with 48-hour TTL:", formData);
  };

  const handleReset = () => {
    showConfirmation("Are you sure?", "This will reset all form fields to their default values.", () => reset(defaultValues));
  };

  const formatLabel = (group: PostingGroup) => `${group.No} ${group.Description}`;

  const selectedEventValue = useTypeAheadValue(watch, "event", eventTypes, "Description", "Code");
  const selectedGroupValue = useTypeAheadValue(watch, "group", postingGroups, "Description", "No");
  const selectedHealthStatusValue = useTypeAheadValue(
    watch,
    "healthStatus",
    healthStatuses,
    "description",
    "code",
    postingGroupDetails?.healthStatus?.Code
      ? {
          label: postingGroupDetails.healthStatus.Description,
          value: postingGroupDetails.healthStatus.Code,
        }
      : null
  );

  return (
    <>
      {loading && <LoadingSpinner />}
      {!loading && (
        <>
          <CustomNotice<WeanFormData> storageKey={WEAN_STORAGE_KEY} onLoad={(data) => reset({ ...getValues(), ...data })} />
          <CustomFormsLayout>
            <CustomHeader icon={Celebration} title="Wean" button={{ label: "reset", onClick: handleReset }} />

            {postingGroupsLoading && <LoadingSpinner />}
            {!postingGroupsLoading && (
              <form onSubmit={handleSubmit(onSubmit)}>
                <Stack spacing={2}>
                  <Stack>
                    <TypeAhead
                      {...register("group", { required: "Group is required" })}
                      value={selectedGroupValue}
                      handleChange={(v) => v && v.value && setValue("group", String(v.value))}
                      loading={postingGroupsLoading}
                      options={postingGroups.map((job) => ({ label: formatLabel(job), value: job.No }) as TypeAheadOption)}
                      placeholder="Group"
                    />
                    {errors.group && <FormHelperText error>{errors.group.message}</FormHelperText>}
                  </Stack>

                  {watch("group") && (
                    <DenseTable
                      rows={[
                        {
                          name: "group",
                          postingGroup: watch("group"),
                          inventory: inventory.group,
                          deads: deads.group,
                        },
                      ]}
                      columns={columns}
                    />
                  )}

                  <Stack>
                    <TypeAhead
                      {...register("healthStatus", {
                        required: "Health Status is required",
                      })}
                      handleChange={(v) => v && v.value && setValue("healthStatus", String(v.value))}
                      loading={postingGroupsLoading}
                      value={selectedHealthStatusValue}
                      options={healthStatuses.map(
                        (status) =>
                          ({
                            label: status.description,
                            value: status.code,
                          }) as TypeAheadOption
                      )}
                      placeholder={(postingGroupDetails && postingGroupDetails.healthStatus?.Description) || healthStatuses.length ? "Health Status" : "Select a valid group"}
                      // disabled={healthStatuses.length === 0}
                    />
                    {errors.healthStatus && <FormHelperText error>{errors.healthStatus.message}</FormHelperText>}
                  </Stack>

                  <Divider />
                  <Typography>Event Details</Typography>
                  <Stack>
                    <TypeAhead
                      {...register("event", { required: "Event is required" })}
                      handleChange={(v) => v && v.value && setValue("event", v.value)}
                      value={selectedEventValue}
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
                      defaultValue={new Date()}
                      onChange={(v) => setValue("postingDate", v)}
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
            )}

            <CustomConfirmation />
          </CustomFormsLayout>
        </>
      )}
    </>
  );
}
