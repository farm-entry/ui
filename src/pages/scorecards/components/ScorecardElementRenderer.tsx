import { Box, FormLabel, Stack, TextField, Typography } from "@mui/material";
import { useFormContext } from "react-hook-form";
import { ScorecardElement } from "../../../store/types/scorecards";
import { Slider } from "../../../components/inputs";
import ScoreCardSlider from "./ScorecardSlider";

interface ScorecardElementRendererProps {
  element: ScorecardElement;
  elementIndex: number;
}

export default function ScorecardElementRenderer({ element }: ScorecardElementRendererProps) {
  const {
    register,
    watch,
    formState: { errors }
  } = useFormContext();
  const formContext = useFormContext();

  // Parse the code to determine component type and parameters
  const parseElementCode = (code: string) => {
    const codeArray = code.split("-");
    return {
      type: codeArray[0],
      min: parseInt(codeArray[1]) || 0,
      max: parseInt(codeArray[2]) || element.max,
      step: parseInt(codeArray[3]) || 1
    };
  };

  const codeConfig = parseElementCode(element.code);

  // Render different input types based on the element code
  const renderInputComponent = () => {
    switch (codeConfig.type) {
      case "SLIDER":
        return (
          <ScoreCardSlider formContext={formContext} codeConfig={codeConfig} element={element} />
        );

      case "SUPERVISOR":
        return (
          <Typography variant="body2" color="text.secondary">
            Supervisor selection component is under development.
          </Typography>
          //   <Controller
          //     name={element.id}
          //     control={control}
          //     defaultValue=""
          //     rules={{ required: "Please select a supervisor" }}
          //     render={({ field, fieldState }) => (
          //       <FormControl fullWidth error={!!fieldState.error}>
          //         <InputLabel>Select Supervisor</InputLabel>
          //         <Select {...field} label="Select Supervisor">
          //           <MenuItem value="supervisor1">John Smith</MenuItem>
          //           <MenuItem value="supervisor2">Jane Doe</MenuItem>
          //           <MenuItem value="supervisor3">Mike Johnson</MenuItem>
          //           <MenuItem value="other">Other</MenuItem>
          //         </Select>
          //         {fieldState.error && (
          //           <Typography variant="caption" color="error" sx={{ mt: 1 }}>
          //             {fieldState.error.message}
          //           </Typography>
          //         )}
          //       </FormControl>
          //     )}
          //   />
        );

      case "YN":
        return (
          <Typography variant="body2" color="text.secondary">
            Yes/No selection component is under development.
          </Typography>
        );
      // return (
      //   <Controller
      //     name={element.id}
      //     control={control}
      //     defaultValue=""
      //     rules={{ required: "Please make a selection" }}
      //     render={({ field, fieldState }) => (
      //       <FormControl component="fieldset" error={!!fieldState.error}>
      //         <RadioGroup {...field} row>
      //           <FormControlLabel value="yes" control={<Radio />} label="Yes" />
      //           <FormControlLabel value="no" control={<Radio />} label="No" />
      //         </RadioGroup>
      //         {fieldState.error && (
      //           <Typography variant="caption" color="error" sx={{ mt: 1 }}>
      //             {fieldState.error.message}
      //           </Typography>
      //         )}
      //       </FormControl>
      //     )}
      //   />
      // );

      case "RANGE":
        return (
          <Typography variant="body2" color="text.secondary">
            Range input component is under development.
          </Typography>
        );
      // return (
      //   <Controller
      //     name={element.id}
      //     control={control}
      //     defaultValue=""
      //     rules={{
      //       required: "This field is required",
      //       min: { value: codeConfig.min, message: `Minimum value is ${codeConfig.min}` },
      //       max: { value: codeConfig.max, message: `Maximum value is ${codeConfig.max}` }
      //     }}
      //     render={({ field, fieldState }) => (
      //       <TextField
      //         {...field}
      //         type="number"
      //         fullWidth
      //         variant="outlined"
      //         error={!!fieldState.error}
      //         helperText={
      //           fieldState.error?.message ||
      //           `Enter a value between ${codeConfig.min} and ${codeConfig.max}`
      //         }
      //         InputProps={{
      //           inputProps: {
      //             min: codeConfig.min,
      //             max: codeConfig.max,
      //             step: codeConfig.step
      //           }
      //         }}
      //       />
      //     )}
      //   />
      // );

      default:
        // For any unrecognized codes, render a text input
        return (
          <TextField
            {...register(element.id, { required: "This field is required" })}
            fullWidth
            variant="outlined"
            error={!!errors[element.id]}
            // helperText={fieldError?.message}
            placeholder="Enter value..."
          />
        );
    }
  };

  return (
    <Stack>
      <FormLabel component="legend" sx={{ mb: 2, fontWeight: 600, color: "text.primary" }}>
        {element.label}
      </FormLabel>
      {renderInputComponent()}
    </Stack>
  );
}
