import { Button, Divider, FormHelperText, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import LoadingSpinner from "../../../components/framework/LoadingSpinner";
import {
  DatePicker,
  EventNumberInput,
  TextArea,
  TextField,
  TypeAhead
} from "../../../components/inputs";
import CustomFormsLayout from "../../../layouts/forms";
import { livestockActivityApi } from "../../../services/livestockActivityApi";
import { useConfirmationStore } from "../../../store/confirmationStore";
import { useFormStorageStore } from "../../../store/formStorageStore";
import { useGlobalAlertStore } from "../../../store/globalAlertStore";
import { useLivestockActivityStore } from "../../../store/livestockActivityStore";
import { usePostingGroupsStore } from "../../../store/postingGroupsStore";
import { FormData } from "../../../store/types/forms";
import { LivestockQuantity, Reason } from "../../../store/types/livestockActivity";
import { formatDateToYYYYMMDDNoTimestamp, parseYYYYMMDDToLocalDate } from "../../../utils/date";
import { GRADEOFF_STORAGE_KEY } from "./constants-livestock.json";
import { numberDescriptionPostingGroupFormatter } from "../../../utils/strings";

const FORM_STORAGE_HOURS = 48;

interface GradeOffFormData extends FormData {
  group: string | number | null;
  healthStatus: string | number | null;
  event: string | number | null;
  postingDate: string;
  quantities: LivestockQuantity[];
  livestockWeight: number | null;
  comments: string;
}

const defaultValues: GradeOffFormData = {
  form: "GRADEOFF",
  group: null,
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
    getEvents,
    eventTypes,
    healthStatuses,
    isLoading: livestockActivityLoading,
    currentTemplate
  } = useLivestockActivityStore();
  const showConfirmation = useConfirmationStore((state) => state.showConfirmation);
  const { setAlert } = useGlobalAlertStore();
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

  const eventValue = watch("event");
  useEffect(() => {
    setEventReasons(eventTypes.find((et) => et.code === eventValue)?.reasons || []);
    setValue("quantities", []);
  }, [eventValue, eventTypes, setValue]);

  const groupValue = watch("group");
  useEffect(() => {
    if (groupValue) {
      getPostingGroupDetails(groupValue);
    }
  }, [groupValue, getPostingGroupDetails]);

  useEffect(() => {
    let isMounted = true;
    setInitLoading(true);
    const promises = [];
    if (!(healthStatuses.length > 0 && eventTypes.length > 0 && currentTemplate === "GRADEOFF"))
      promises.push(getEvents("GRADEOFF"));
    if (!(postingGroups.length > 0)) promises.push(getPostingGroups());

    Promise.all(promises).finally(() => {
      if (isMounted) {
        setInitLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const submitForm = (data: GradeOffFormData) => {
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

  const onSubmit = (data: GradeOffFormData) => {
    if (process.env.NODE_ENV === "development") {
      console.log("All required fields validated successfully!");
    }
    const hasNegativeQuantity = data.quantities.some(
      (q) => typeof q.quantity === "number" && q.quantity < 0
    );
    if (hasNegativeQuantity) {
      showConfirmation("Entered Negative Quantity", "Are you sure?", () => submitForm(data));
      return;
    }
    submitForm(data);
  };

  const onSave = () => {
    const formData = getValues();
    saveForm(GRADEOFF_STORAGE_KEY, formData, FORM_STORAGE_HOURS);
  };

  const handleReset = () => {
    showConfirmation(
      "Are you sure?",
      "This will reset all form fields to their default values.",
      () => reset(defaultValues)
    );
  };

  return (
    <CustomFormsLayout<GradeOffFormData>
      notice={{ formType: GRADEOFF_STORAGE_KEY, onLoad: (data) => reset(data) }}
      headerOptions={{ button: { label: "reset", onClick: handleReset } }}
    >
      {initLoading && <LoadingSpinner />}
      {!initLoading && (
        <>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={2}>
              <Stack>
                <TypeAhead
                  {...register("group", { required: "Group is required" })}
                  handleChange={(v) => setValue("group", v?.value ?? null)}
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
                  value={watch("livestockWeight")}
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
                value={watch("comments")}
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

        </>
      )}
    </CustomFormsLayout>
  );
}
