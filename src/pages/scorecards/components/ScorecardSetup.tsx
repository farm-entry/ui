import { FormHelperText, Stack } from "@mui/material";
import { PageContainer } from "@toolpad/core";
import { useEffect } from "react";
import { UseFormRegister, UseFormSetValue, UseFormWatch } from "react-hook-form";
import { TypeAhead } from "../../../components/inputs";
import { usePostingGroupsStore } from "../../../store/postingGroupsStore";
import { useScorecardStore } from "../../../store/scorecardStore";

interface ScorecardSetupProps {
  register: UseFormRegister<any>;
  setValue: UseFormSetValue<any>;
  watch: UseFormWatch<any>;
  errors: any;
}

export default function ScorecardSetup({ register, setValue, watch, errors }: ScorecardSetupProps) {
  const { postingGroups, isLoading: postingGroupsLoading } = usePostingGroupsStore();
  const job: string = watch("job");

  const { scorecardTypes, getScorecardTypes, isLoading: isScorecardLoading } = useScorecardStore();

  useEffect(() => {
    if (!job) {
      console.log("No job selected, skipping setup");
      return;
    }
    getScorecardTypes(job);
  }, [job]);

  return (
    <PageContainer>
      <Stack spacing={3}>
        <Stack spacing={2}>
          <TypeAhead
            {...register("job", { required: "Job selection is required" })}
            handleChange={(v) => {
              setValue("job", v?.value ?? null);
              setValue("scorecardType", null);
            }}
            watch={watch}
            fieldName={"job"}
            labelKey={"description"}
            valueKey={"number"}
            valueList={postingGroups}
            loading={postingGroupsLoading}
            placeholder="Select Job"
          />
          {errors.job && <FormHelperText error>{errors.job.message}</FormHelperText>}
        </Stack>

        <Stack spacing={2}>
          <TypeAhead
            {...register("scorecardType", { required: "Scorecard Type is required" })}
            handleChange={(v) => setValue("scorecardType", v?.value ?? null)}
            watch={watch}
            fieldName={"scorecardType"}
            labelKey={"description"}
            valueKey={"code"}
            valueList={scorecardTypes}
            loading={isScorecardLoading}
            placeholder="Scorecard Type"
            disabled={!watch("job")}
          />
          {errors.scorecardType && (
            <FormHelperText error>{errors.scorecardType.message}</FormHelperText>
          )}
        </Stack>
      </Stack>
    </PageContainer>
  );
}

const TYPEVALUES = [
  {
    code: "SURVEYBIO",
    description: "Biosecurity Evaluation",
    __typename: "ScorecardType"
  },
  {
    code: "SURVEYNG",
    description: "Nursey & Finish Site Evaluation",
    __typename: "ScorecardType"
  },
  {
    code: "SURVEYPRE",
    description: "Pre-Fill Barn Checklist",
    __typename: "ScorecardType"
  }
];
