import { Button, Divider, FormHelperText, Stack, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import LoadingSpinner from "../../components/framework/LoadingSpinner";
import {
  DatePicker,
  TextField,
  TypeAhead,
  TypeAheadOption
} from "../../components/inputs";
import CustomFormsLayout from "../../layouts/forms";
import { tableEditService } from "../../services/tableEditApi";
import { useConfirmationStore } from "../../store/confirmationStore";
import { useGlobalAlertStore } from "../../store/globalAlertStore";
import {
  JOB_STATUSES,
  TableEditCodeOption,
  TableEditJob,
  TableEditJobDetailResponse,
  TableEditJobFormData,
  TableEditResource
} from "../../store/types/tableEdit";
import { formatDateToYYYYMMDDNoTimestamp, parseYYYYMMDDToLocalDate } from "../../utils/date";

const emptyFormValues: TableEditJobFormData = {
  form: "JOB HEADER UPDATE",
  jobNumber: "",
  status: "",
  startDate: "",
  endDate: "",
  description: "",
  healthStatus: "",
  pigSourceFlow: "",
  feedmill: "",
  nutrition: "",
  person: ""
};

const statusOptions: (TypeAheadOption & Record<string, unknown>)[] = JOB_STATUSES.map((s) => ({
  label: s,
  value: s
}));

export default function JobHeaderUpdatesPage() {
  const navigate = useNavigate();
  const [initLoading, setInitLoading] = useState(true);
  const [jobs, setJobs] = useState<TableEditJob[]>([]);
  const [isJobLoading, setIsJobLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [jobDetail, setJobDetail] = useState<TableEditJobDetailResponse | null>(null);

  // Keep the last-fetched form values so reset returns to API state, not blank defaults
  const lastFetchedValues = useRef<TableEditJobFormData | null>(null);

  const showConfirmation = useConfirmationStore((state) => state.showConfirmation);
  const { setAlert } = useGlobalAlertStore();

  const {
    watch,
    reset,
    register,
    setValue,
    handleSubmit,
    formState: { errors }
  } = useForm<TableEditJobFormData>({ defaultValues: emptyFormValues });

  useEffect(() => {
    let isMounted = true;
    setInitLoading(true);
    tableEditService
      .getJobs()
      .then((data) => {
        if (isMounted) {
          setJobs(data);
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

  const handleJobSelect = async (value: TypeAheadOption | null) => {
    if (!value) {
      setJobDetail(null);
      reset(emptyFormValues);
      lastFetchedValues.current = null;
      return;
    }

    const jobNumber = String(value.value);
    if (jobNumber === watch("jobNumber")) return;

    setIsJobLoading(true);
    try {
      const detail = await tableEditService.getJobDetail(jobNumber);
      if (detail) {
        const fetched: TableEditJobFormData = {
          form: "JOB HEADER UPDATE",
          jobNumber: detail.job.number,
          status: detail.job.status,
          startDate: detail.job.startDate,
          endDate: detail.job.endDate,
          description: detail.job.description,
          healthStatus: detail.job.healthStatus,
          pigSourceFlow: detail.job.pigSourceFlow,
          feedmill: detail.job.feedmill,
          nutrition: detail.job.nutrition,
          person: detail.job.personResponsible
        };
        lastFetchedValues.current = fetched;
        reset(fetched);
        setJobDetail(detail);
      }
    } catch (error) {
      setAlert("error", error as Error);
    } finally {
      setIsJobLoading(false);
    }
  };

  const handleReset = () => {
    showConfirmation(
      "Are you sure?",
      "This will reset all form fields back to the current saved values.",
      () => {
        if (lastFetchedValues.current) {
          reset(lastFetchedValues.current);
        } else {
          setJobDetail(null);
          reset(emptyFormValues);
        }
      }
    );
  };

  const onSubmit = async (data: TableEditJobFormData) => {
    setIsSubmitting(true);
    const { form: _form, jobNumber, ...patchFields } = data;
    tableEditService
      .patchJob(jobNumber, patchFields)
      .then(() => {
        navigate("/post-success", {
          state: {
            formData: { form: "JOB HEADER UPDATE", jobNumber },
            section: "job-header-updates"
          }
        });
      })
      .catch((error: unknown) => {
        setAlert("error", error as Error);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  // TypeAhead-compatible lists — TableEditJob extends Record<string, unknown>
  const jobsAsOptions: TableEditJob[] = jobs;
  const healthStatuses: (TableEditCodeOption & Record<string, unknown>)[] =
    jobDetail?.healthStatuses ?? [];
  const pigSourceFlowOptions: (TableEditCodeOption & Record<string, unknown>)[] =
    jobDetail?.pigSourceFlow ?? [];
  const nutritionOptions: (TableEditCodeOption & Record<string, unknown>)[] =
    jobDetail?.nutrition ?? [];
  const feedmillOptions: (TableEditCodeOption & Record<string, unknown>)[] =
    jobDetail?.feedmill ?? [];
  const resourceOptions: (TableEditResource & Record<string, unknown>)[] =
    jobDetail?.resources ?? [];

  const jobSelected = !!jobDetail;

  return (
    <CustomFormsLayout headerOptions={{ button: { label: "reset", onClick: handleReset } }}>
      {initLoading && <LoadingSpinner />}
      {!initLoading && (
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={2}>
            {/* Phase 1 — Job selection */}
            <Stack>
              <TypeAhead
                {...register("jobNumber", { required: "Job is required." })}
                handleChange={handleJobSelect}
                watch={watch}
                label="Job"
                fieldName="jobNumber"
                labelKey="description"
                valueKey="number"
                valueList={jobsAsOptions}
                placeholder="Search by job number or description..."
                noOptionsText="No jobs found."
              />
              {errors.jobNumber && (
                <FormHelperText error>{errors.jobNumber.message}</FormHelperText>
              )}
            </Stack>

            {/* Instructional state */}
            {!jobSelected && !isJobLoading && (
              <Typography align="center" sx={{ pt: 2 }}>
                Select a job to load its details.
              </Typography>
            )}

            {/* Phase 2 loading */}
            {isJobLoading && <LoadingSpinner />}

            {/* Phase 2 — Edit form */}
            {jobSelected && !isJobLoading && (
              <>
                <Divider />

                {/* 1. Status */}
                <Stack>
                  <TypeAhead
                    {...register("status", { required: "Status is required." })}
                    handleChange={(option) => {
                      setValue("status", option ? (option.value as "Planning" | "Open" | "Completed") : "");
                    }}
                    watch={watch}
                    label="Status"
                    fieldName="status"
                    labelKey="label"
                    valueKey="value"
                    valueList={statusOptions}
                    placeholder="Select a status..."
                  />
                  {errors.status && (
                    <FormHelperText error>{errors.status.message}</FormHelperText>
                  )}
                </Stack>

                {/* 2. Start Date */}
                <Stack>
                  <DatePicker
                    {...register("startDate", { required: "Start date is required." })}
                    value={parseYYYYMMDDToLocalDate(watch("startDate") || "")}
                    onChange={(v) => setValue("startDate", formatDateToYYYYMMDDNoTimestamp(v))}
                    label="Start Date"
                    error={!!errors.startDate}
                    helperText={errors.startDate?.message}
                  />
                </Stack>

                {/* 3. End Date */}
                <Stack>
                  <DatePicker
                    {...register("endDate", { required: "End date is required." })}
                    value={parseYYYYMMDDToLocalDate(watch("endDate") || "")}
                    onChange={(v) => setValue("endDate", formatDateToYYYYMMDDNoTimestamp(v))}
                    label="End Date"
                    error={!!errors.endDate}
                    helperText={errors.endDate?.message}
                  />
                </Stack>

                {/* 4. Group No. (read-only) */}
                <TextField
                  value={watch("jobNumber")}
                  label="Group No."
                  placeholder=""
                  disabled
                  slotProps={{ input: { readOnly: true } }}
                />

                {/* 5. Description */}
                <Stack>
                  <TextField
                    value={watch("description")}
                    {...register("description")}
                    label="Description"
                    placeholder="Description"
                  />
                </Stack>

                {/* 6. Health Status */}
                <Stack>
                  <TypeAhead
                    {...register("healthStatus")}
                    handleChange={(option) => {
                      setValue("healthStatus", option ? String(option.value) : "");
                    }}
                    watch={watch}
                    label="Health Status"
                    fieldName="healthStatus"
                    labelKey="description"
                    valueKey="code"
                    valueList={healthStatuses}
                    placeholder="Select a health status..."
                  />
                </Stack>

                {/* 7. Pig Source Flow */}
                <Stack>
                  <TypeAhead
                    {...register("pigSourceFlow")}
                    handleChange={(option) => {
                      setValue("pigSourceFlow", option ? String(option.value) : "");
                    }}
                    watch={watch}
                    label="Pig Source Flow"
                    fieldName="pigSourceFlow"
                    labelKey="description"
                    valueKey="code"
                    valueList={pigSourceFlowOptions}
                    placeholder="Select a pig source flow..."
                  />
                </Stack>

                {/* 8. Nutrition */}
                <Stack>
                  <TypeAhead
                    {...register("nutrition")}
                    handleChange={(option) => {
                      setValue("nutrition", option ? String(option.value) : "");
                    }}
                    watch={watch}
                    label="Nutrition"
                    fieldName="nutrition"
                    labelKey="description"
                    valueKey="code"
                    valueList={nutritionOptions}
                    placeholder="Select a nutrition..."
                  />
                </Stack>

                {/* 9. Feedmill */}
                <Stack>
                  <TypeAhead
                    {...register("feedmill")}
                    handleChange={(option) => {
                      setValue("feedmill", option ? String(option.value) : "");
                    }}
                    watch={watch}
                    label="Feedmill"
                    fieldName="feedmill"
                    labelKey="description"
                    valueKey="code"
                    valueList={feedmillOptions}
                    placeholder="Select a feedmill..."
                  />
                </Stack>

                {/* 10. Person Responsible */}
                <Stack>
                  <TypeAhead
                    {...register("person")}
                    handleChange={(option) => {
                      setValue("person", option ? String(option.value) : "");
                    }}
                    watch={watch}
                    label="Person Responsible"
                    fieldName="person"
                    labelKey="name"
                    valueKey="number"
                    valueList={resourceOptions}
                    placeholder="Select a person..."
                  />
                </Stack>

                {/* 11. Supervisor / Project Manager — read-only */}
                <Stack spacing={0.5}>
                  <Typography variant="caption" color="text.secondary">
                    Supervisor (Project Manager)
                  </Typography>
                  <Typography variant="body1">
                    {jobDetail.job.projectManager || "—"}
                  </Typography>
                </Stack>
              </>
            )}

            {/* Submit */}
            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button
                variant="contained"
                color="primary"
                fullWidth
                type="submit"
                disabled={isSubmitting || !jobSelected}
              >
                Submit
              </Button>
            </Stack>
          </Stack>
        </form>
      )}
    </CustomFormsLayout>
  );
}
