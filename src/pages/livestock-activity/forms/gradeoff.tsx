import { Grade } from "@mui/icons-material";
import { Button, Divider, FormHelperText, ListSubheader, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import CustomConfirmation from "../../../components/framework/CustomConfirmation";
import CustomHeader from "../../../components/framework/CustomHeader";
import CustomNotice from "../../../components/framework/CustomNotice";
import LoadingSpinner from "../../../components/framework/LoadingSpinner";
import {
  DatePicker,
  EventNumberInput,
  TextArea,
  TextField,
  TypeAhead
} from "../../../components/inputs";
import CustomFormsLayout from "../../../layouts/forms";
import { useConfirmationStore } from "../../../store/confirmationStore";
import { useFormStorageStore } from "../../../store/formStorageStore";
import { FormData, useLivestockActivityStore } from "../../../store/livestockActivityStore";
import { usePostingGroupsStore } from "../../../store/postingGroupsStore";
import { formatDateToYYYYMMDDNoTimestamp, parseYYYYMMDDToLocalDate } from "../../../utils/date";
import { GRADEOFF_STORAGE_KEY } from "./constants-livestock.json";
import { livestockActivityApi } from "../../../services/livestockActivityApi";
import { useNavigate } from "react-router";
import { LivestockQuantity, Reason } from "../../../store/types/livestockActivity";

interface GradeOffFormData extends FormData {
  job: string | number | null;
  healthStatus: string | number | null;
  event: string | number | null;
  postingDate: string;
  quantities: LivestockQuantity[];
  livestockWeight: number | null;
  comments: string;
}

const defaultValues: GradeOffFormData = {
  form: "GRADEOFF",
  job: null,
  healthStatus: null,
  event: null,
  postingDate: formatDateToYYYYMMDDNoTimestamp(new Date()),
  quantities: [],
  livestockWeight: null,
  comments: ""
};

export default function GradeOffPage() {
  const navigate = useNavigate();
  const {
    getPostingGroups,
    postingGroups,
    getPostingGroupDetails,
    postingGroupDetails,
    isLoading: postingGroupsLoading
  } = usePostingGroupsStore();
  const {
    getEventTypes,
    eventTypes,
    healthStatuses,
    getHealthStatuses,
    isLoading: livestockActivityLoading
  } = useLivestockActivityStore();
  const showConfirmation = useConfirmationStore((state) => state.showConfirmation);
  const { saveForm } = useFormStorageStore();
  const [initLoading, setInitLoading] = useState(true);
  const [eventReasons, setEventReasons] = useState<Reason[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    getValues,
    formState: { errors }
  } = useForm<GradeOffFormData>({
    defaultValues: defaultValues,
    mode: "onSubmit"
  });

  useEffect(() => {
    setEventReasons(eventTypes.find((et) => et.code === watch("event"))?.reasons || []);
    setValue("quantities", []);
  }, [watch("event")]);

  useEffect(() => {
    const job = watch("job");
    job && getPostingGroupDetails(job);
  }, [watch("job")]);

  useEffect(() => {
    setInitLoading(true);
    const promises = [];
    if (!(eventTypes.length > 0 && eventTypes[0].journal_template_name == "GRADEOFF"))
      promises.push(getEventTypes("GRADEOFF"));
    if (!(postingGroups.length > 0)) promises.push(getPostingGroups());
    if (!(healthStatuses.length > 0)) promises.push(getHealthStatuses());

    Promise.all(promises).finally(() => {
      setInitLoading(false);
    });
  }, []);

  const onSubmit = async (data: GradeOffFormData) => {
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
          details: e.details || JSON.stringify(e, null, 2)
        };
        navigate("/post-error", { state: { ...state, error } });
      })
      .finally(() => {
        setInitLoading(false);
      });
  };

  const onSave = () => {
    const formData = getValues();
    saveForm(GRADEOFF_STORAGE_KEY, formData, 48);
  };

  const handleReset = () => {
    showConfirmation(
      "Are you sure?",
      "This will reset all form fields to their default values.",
      () => reset(defaultValues)
    );
  };

  return (
    <>
      {initLoading && <LoadingSpinner />}
      {!initLoading && (
        <>
          <CustomNotice<GradeOffFormData>
            formType={GRADEOFF_STORAGE_KEY}
            onLoad={(data) => reset(data)}
          />
          <CustomFormsLayout>
            <CustomHeader
              icon={Grade}
              title="Grade Off"
              button={{ label: "reset", onClick: handleReset }}
            />

            <form onSubmit={handleSubmit(onSubmit)}>
              <Stack spacing={2}>
                <Stack>
                  <TypeAhead
                    {...register("job", { required: "Job is required" })}
                    handleChange={(v) => setValue("job", v?.value ?? null)}
                    watch={watch}
                    fieldName={"job"}
                    labelKey={"description"}
                    valueKey={"number"}
                    valueList={postingGroups}
                    loading={postingGroupsLoading}
                    placeholder="Job"
                  />
                  {errors.job && <FormHelperText error>{errors.job.message}</FormHelperText>}
                </Stack>

                <Stack>
                  <TypeAhead
                    {...register("healthStatus", {
                      required: "Health Status is required"
                    })}
                    handleChange={(v) =>
                      setValue("healthStatus", v?.value ? String(v.value) : null)
                    }
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
                      (postingGroupDetails && postingGroupDetails.healthStatus?.Description) ||
                      healthStatuses.length
                        ? "Health Status"
                        : "Select a valid job"
                    }
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
                    handleChange={(v) => setValue("event", v?.value ?? null)}
                    watch={watch}
                    fieldName={"event"}
                    labelKey={"description"}
                    valueKey={"code"}
                    valueList={eventTypes}
                    placeholder="Event Name"
                  />
                  {errors.event && <FormHelperText error>{errors.event.message}</FormHelperText>}
                </Stack>

                <Stack>
                  <DatePicker
                    {...register("postingDate", {
                      required: "Activity Date is required"
                    })}
                    value={parseYYYYMMDDToLocalDate(watch("postingDate") || "")}
                    onChange={(v) => setValue("postingDate", formatDateToYYYYMMDDNoTimestamp(v))}
                    label="Activity Date"
                    error={!!errors.postingDate}
                    helperText={errors.postingDate?.message}
                  />
                </Stack>
                {watch("event") && (
                  <>
                    <Stack spacing={2}>
                      {eventReasons.map((reason, index) => (
                        <EventNumberInput
                          key={reason.code}
                          codeRegistration={{
                            ...register(`quantities.${index}.code`),
                            value: reason.code
                          }}
                          quantityRegistration={register(`quantities.${index}.quantity`, {
                            valueAsNumber: true
                          })}
                          value={watch("quantities")?.[index]?.quantity || ""}
                          label={reason?.description}
                          placeholder="Quantity"
                          type="number"
                        />
                      ))}
                    </Stack>
                    <Divider />

                    <Stack direction="row" spacing={2} alignItems="center">
                      <Typography variant="subtitle2" sx={{ fontWeight: 300 }}>
                        Total Quantity
                      </Typography>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        {watch("quantities")?.reduce((sum, q) => sum + (q?.quantity || 0), 0) ?? 0}
                      </Typography>
                    </Stack>

                    <Divider />
                  </>
                )}

                <Stack>
                  <TextField
                    {...register("livestockWeight", {
                      required: "Average weight per head is required",
                      min: {
                        value: 1,
                        message: "Weight must be greater than 0"
                      }
                    })}
                    placeholder="Ave Weight / Head"
                    type="number"
                    error={!!errors.livestockWeight}
                    helperText={errors.livestockWeight?.message}
                  />
                </Stack>
                <Divider />
                <TextArea
                  {...register("comments", {
                    maxLength: {
                      value: 50,
                      message: "Comments cannot exceed 50 characters"
                    }
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

            <CustomConfirmation />
          </CustomFormsLayout>
        </>
      )}
    </>
  );
}
