import { Button, Divider, FormHelperText, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import LoadingSpinner from "../../../components/framework/LoadingSpinner";
import { DatePicker, EventNumberInput, TextArea, TypeAhead } from "../../../components/inputs";
import CustomFormsLayout from "../../../layouts/forms";
import { livestockActivityApi } from "../../../services/livestockActivityApi";
import { useConfirmationStore } from "../../../store/confirmationStore";
import { useFormStorageStore } from "../../../store/formStorageStore";
import { useGlobalAlertStore } from "../../../store/globalAlertStore";
import { useLivestockActivityStore } from "../../../store/livestockActivityStore";
import { usePostingGroupsStore } from "../../../store/postingGroupsStore";
import { FormData } from "../../../store/types/forms";
import type { EventType } from "../../../store/types/livestockActivity";
import { LivestockQuantity, Reason } from "../../../store/types/livestockActivity";
import { formatDateToYYYYMMDDNoTimestamp, parseYYYYMMDDToLocalDate } from "../../../utils/date";
import { MORTALITY_STORAGE_KEY } from "./constants-livestock.json";
import { numberDescriptionPostingGroupFormatter } from "../../../utils/strings";

const FORM_STORAGE_HOURS = 48;

interface MortalityFormData extends FormData {
  job: string | number | null;
  healthStatus: string | number | null;
  postingDate: string;
  quantities: LivestockQuantity[];
  comments: string;
}

const defaultValues: MortalityFormData = {
  form: "MORTALITY",
  job: null,
  healthStatus: null,
  postingDate: formatDateToYYYYMMDDNoTimestamp(new Date()),
  quantities: [],
  comments: ""
};

export default function MortalityPage() {
  const navigate = useNavigate();
  const {
    getPostingGroups,
    postingGroups,
    getPostingGroupDetails,
    clearPostingGroupDetails,
    postingGroupDetails,
    isLoading: postingGroupsLoading
  } = usePostingGroupsStore();
  const {
    getEvents,
    healthStatuses,
    setHealthStatuses,
    isLoading: livestockActivityLoading
  } = useLivestockActivityStore();
  const showConfirmation = useConfirmationStore((state) => state.showConfirmation);
  const { setAlert, clearAlert } = useGlobalAlertStore();
  const { saveForm } = useFormStorageStore();
  const [initLoading, setInitLoading] = useState(true);
  const [eventsLoading, setEventsLoading] = useState(false);
  const [eventReasons, setEventReasons] = useState<Reason[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    getValues,
    formState: { errors }
  } = useForm<MortalityFormData>({
    defaultValues: defaultValues,
    mode: "onSubmit"
  });

  const jobValue = watch("job");

  // Fetch posting groups on mount
  useEffect(() => {
    let isMounted = true;
    setInitLoading(true);

    if (!(postingGroups.length > 0)) {
      getPostingGroups().then(() => {
        if (isMounted) {
          setInitLoading(false);
        }
      });
    } else {
      setInitLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, []);

  // Fetch events when job is selected
  useEffect(() => {
    if (!jobValue) {
      setEventReasons([]);
      return;
    }

    // Fetch posting group details
    getPostingGroupDetails(jobValue);

    // Fetch events for the selected job
    setEventsLoading(true);
    getEvents("MORTALITY", `${jobValue}`)
      .then((x) => {
        setEventReasons(filterEventReasons(x?.events));
        setEventsLoading(false);
      })
      .catch((error: unknown) => {
        setAlert("error", error as Error);
        setEventsLoading(false);
      });
  }, [jobValue]);

  const filterEventReasons = (ev: EventType[] = []) =>
    ev?.find((et) => et.code === "MORTALITY")?.reasons || ev[0]?.reasons || [];

  const onSubmit = async (data: MortalityFormData) => {
    if (process.env.NODE_ENV === "development") {
      console.log("All required fields validated successfully!");
    }
    setInitLoading(true);
    const state = { formData: data, section: "livestock-activity" };
    livestockActivityApi
      .postLivestockEvent(data)
      .then(() => {
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
    saveForm(MORTALITY_STORAGE_KEY, formData, FORM_STORAGE_HOURS);
  };

  useEffect(() => {
    clearAlert();
  }, [jobValue]);

  const handleReset = () => {
    showConfirmation(
      "Are you sure?",
      "This will reset all form fields to their default values.",
      () => {
        setHealthStatuses([]);
        clearPostingGroupDetails();
        reset(defaultValues);
      }
    );
  };

  return (
    <CustomFormsLayout<MortalityFormData>
      notice={{ formType: MORTALITY_STORAGE_KEY, onLoad: (data) => reset(data) }}
      headerOptions={{ button: { label: "reset", onClick: handleReset } }}
    >
      {initLoading && <LoadingSpinner />}
      {!initLoading && (
        <>
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
                  labelFormatter={numberDescriptionPostingGroupFormatter}
                  valueList={postingGroups}
                  loading={postingGroupsLoading}
                  placeholder="Job"
                />
                {errors.job && <FormHelperText error>{errors.job.message}</FormHelperText>}
              </Stack>

              {eventsLoading && (
                <Stack alignItems="center" py={2}>
                  <LoadingSpinner />
                </Stack>
              )}

              {!eventsLoading && (
                <>
                  <Stack>
                    <TypeAhead
                      {...register("healthStatus")}
                      handleChange={(v) =>
                        setValue("healthStatus", v?.value ? String(v.value) : null)
                      }
                      disabled={!jobValue || eventsLoading}
                      loading={eventsLoading}
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
                          : "Select a valid job"
                      }
                    />
                    {errors.healthStatus && (
                      <FormHelperText error>{errors.healthStatus.message}</FormHelperText>
                    )}
                  </Stack>

                  <Divider />
                  <Typography>Event</Typography>

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
                </>
              )}
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
