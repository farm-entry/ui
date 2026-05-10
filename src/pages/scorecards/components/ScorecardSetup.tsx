import { FormHelperText, Stack } from "@mui/material";
import { PageContainer } from "@toolpad/core";
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { TypeAhead } from "../../../components/inputs";
import { useGlobalAlertStore } from "../../../store/globalAlertStore";
import { usePostingGroupsStore } from "../../../store/postingGroupsStore";
import { numberDescriptionPostingGroupFormatter } from "../../../utils/strings";
import { useScorecardStore } from "../../../store/scorecardStore";

export default function ScorecardSetup() {
  const {
    register,
    setValue,
    watch,
    setError,
    clearErrors,
    formState: { errors }
  } = useFormContext();

  const { postingGroups, isLoading: postingGroupsLoading } = usePostingGroupsStore();
  const {
    scorecardTypes,
    getScorecardTypes,
    clearScorecardTypes,
    isLoading: scorecardLoading
  } = useScorecardStore();
  const { setAlert } = useGlobalAlertStore();

  const job: string = watch("job");

  useEffect(() => {
    if (!job) return;
    getScorecardTypes(job).then((result) => {
      if (result === undefined) {
        setAlert("error", useScorecardStore.getState().error || "Failed to load scorecard types");
      } else if (result.length === 0) {
        setError("job", { type: "manual", message: "No scorecard types found for this job" });
      } else {
        clearErrors("job");
      }
    });
  }, [job]);

  return (
    <Stack spacing={3} pb={2}>
      <TypeAhead
        {...register("job", { required: "Job selection is required" })}
        handleChange={(v) => {
          setValue("job", v?.value ?? null);
          setValue("postingGroup", null);
          if (!v) {
            clearScorecardTypes();
            clearErrors("job");
          }
        }}
        watch={watch}
        fieldName="job"
        labelKey="description"
        valueKey="number"
        labelFormatter={numberDescriptionPostingGroupFormatter}
        valueList={postingGroups}
        loading={postingGroupsLoading}
        placeholder="Select Job"
      />
      {errors.job && <FormHelperText error>{errors.job.message as string}</FormHelperText>}

      <TypeAhead
        {...register("postingGroup", { required: "Scorecard Type is required" })}
        handleChange={(v) => setValue("postingGroup", v?.value ?? null)}
        watch={watch}
        fieldName="postingGroup"
        labelKey="description"
        valueKey="code"
        valueList={scorecardTypes}
        labelFormatter={(v) => `${v.code} ${v.description}`}
        loading={scorecardLoading}
        placeholder="Scorecard Type"
        disabled={!job || scorecardLoading}
      />
      {errors.postingGroup && (
        <FormHelperText error>{errors.postingGroup.message as string}</FormHelperText>
      )}
    </Stack>
  );
}
