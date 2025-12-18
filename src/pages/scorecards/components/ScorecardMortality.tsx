import React, { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { FormControl, FormLabel, Typography, Box } from "@mui/material";
import useLivestockJob from "./useLivestockJob";

export interface ScorecardMortalityProps {
  label: string;
  id: string;
}

const ScorecardMortality: React.FC<ScorecardMortalityProps> = ({
  label,
  id
}) => {
  const { job: livestockJob } = useLivestockJob();
  const { setValue, register, unregister, watch } = useFormContext();
  const name = `${id}.numericValue`;

  useEffect(() => {
    register({ name, type: "custom" });
    return () => unregister(name);
  }, [register, name, unregister]);

  useEffect(() => {
    if (
      livestockJob &&
      livestockJob.deadQuantity &&
      livestockJob.deadQuantity > 0
    ) {
      setValue(name, livestockJob.deadQuantity);
    } else {
      setValue(name, null);
    }
  }, [livestockJob, setValue, name]);

  let deadQuantity = watch(name);

  return (
    <FormControl fullWidth sx={{ mb: 3 }}>
      <FormLabel>{label}</FormLabel>
      <Box sx={{ mt: 1, p: 2, backgroundColor: "grey.100", borderRadius: 1 }}>
        <Typography variant="body1">
          {typeof deadQuantity === "number" ? `${deadQuantity} deads` : "None"}
        </Typography>
      </Box>
    </FormControl>
  );
};

export const isComplete = () => true;

export default ScorecardMortality;
