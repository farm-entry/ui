import { FormHelperText, Stack } from "@mui/material";
import { PageContainer } from "@toolpad/core";
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { TypeAhead } from "../../../components/inputs";
import { useGlobalAlertStore } from "../../../store/globalAlertStore";
import { usePostingGroupsStore } from "../../../store/postingGroupsStore";
import { useScorecardStore } from "../../../store/scorecardStore";

export default function ScorecardSetup() {
  const {
    register,
    setValue,
    watch,
    setError,
    clearErrors,
    trigger,
    formState: { errors }
  } = useFormContext();

  const { postingGroups, isLoading: postingGroupsLoading } = usePostingGroupsStore();
  const job: string = watch("job");

  const { scorecardTypes, getScorecardTypes, isLoading: isScorecardLoading } = useScorecardStore();
  const { setAlert } = useGlobalAlertStore();

  useEffect(() => {
    if (!job) {
      console.log("No job selected, skipping setup");
      return;
    }
    getScorecardTypes(job).then((result) => {
      if (result === undefined) {
        const { error } = useScorecardStore.getState();
        setAlert("error", error || "Failed to load scorecard types");
      } else if (result.length === 0) {
        setError("job", { type: "manual", message: "No scorecard types found for this job" });
      } else {
        clearErrors("job");
      }
    });
  }, [job]);

  return (
    <PageContainer>
      <Stack spacing={3}>
        <Stack>
          <TypeAhead
            {...register("job", { required: "Job selection is required" })}
            handleChange={(v) => {
              setValue("job", v?.value ?? null);
              setValue("postingGroup", null);
            }}
            watch={watch}
            fieldName={"job"}
            labelKey={"description"}
            valueKey={"number"}
            valueList={postingGroups}
            loading={postingGroupsLoading}
            placeholder="Select Job"
          />
          {errors.job && <FormHelperText error>{errors.job.message as string}</FormHelperText>}
        </Stack>

        <Stack spacing={2}>
          <TypeAhead
            {...register("postingGroup", { required: "Scorecard Type is required" })}
            handleChange={(v) => {
              setValue("postingGroup", v?.value ?? null);
              trigger(["job", "postingGroup"]);
            }}
            watch={watch}
            fieldName={"postingGroup"}
            labelKey={"description"}
            valueKey={"code"}
            valueList={scorecardTypes}
            loading={isScorecardLoading}
            placeholder="Scorecard Type"
            disabled={!watch("job") && isScorecardLoading}
          />
          {errors.postingGroup && (
            <FormHelperText error>{errors.postingGroup.message as string}</FormHelperText>
          )}
        </Stack>
      </Stack>
    </PageContainer>
  );
}
