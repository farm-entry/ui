import { FormHelperText, Stack } from "@mui/material";
import { PageContainer } from "@toolpad/core";
import { UseFormRegister, UseFormSetValue, UseFormWatch } from "react-hook-form";
import { TypeAhead } from "../../../components/inputs";

interface ScorecardSetupProps {
  register: UseFormRegister<any>;
  setValue: UseFormSetValue<any>;
  watch: UseFormWatch<any>;
  errors: any;
  postingGroups: any[];
  postingGroupsLoading: boolean;
}

export default function ScorecardSetup({
  register,
  setValue,
  watch,
  errors,
  postingGroups,
  postingGroupsLoading
}: ScorecardSetupProps) {
  return (
    <PageContainer>
      <Stack spacing={3}>
        <Stack spacing={2}>
          <TypeAhead
            {...register("postingGroup", { required: "Posting Group is required" })}
            handleChange={(v) => {
              setValue("postingGroup", v?.value ?? null);
              setValue("scorecardType", null);
            }}
            watch={watch}
            fieldName={"postingGroup"}
            labelKey={"description"}
            valueKey={"number"}
            valueList={postingGroups}
            loading={postingGroupsLoading}
            placeholder="Posting Group"
          />
          {errors.postingGroup && (
            <FormHelperText error>{errors.postingGroup.message}</FormHelperText>
          )}
        </Stack>

        <Stack spacing={2}>
          <TypeAhead
            {...register("scorecardType", { required: "Scorecard Type is required" })}
            handleChange={(v) => setValue("scorecardType", v?.value ?? null)}
            watch={watch}
            fieldName={"scorecardType"}
            labelKey={"description"}
            valueKey={"code"}
            valueList={TYPEVALUES}
            loading={postingGroupsLoading}
            placeholder="Scorecard Type"
            disabled={!watch("postingGroup")}
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
