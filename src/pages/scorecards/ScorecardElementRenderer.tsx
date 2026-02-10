import { FormLabel, Stack, TextField } from "@mui/material";
import { useFormContext } from "react-hook-form";
import { ScorecardElement } from "../../store/types/scorecards";
import ScorecardSlider from "./components/ScorecardSlider";
import ScorecardSupervisor from "./components/ScorecardSupervisor";
import ScorecardYN from "./components/ScorecardYN";
import ScorecardPassFail from "./components/ScorecardPassFail";
import ScorecardScore from "./components/ScorecardScore";
import ScorecardHealth from "./components/ScorecardHealth";
import ScorecardRange from "./components/ScorecardRange";
import ScorecardWeeksOnFeed from "./components/ScorecardWeeksOnFeed";
import ScorecardMortality from "./components/ScorecardMortality";
import ScorecardPostDate from "./components/ScorecardPostDate";
import ScorecardTargetTemp from "./components/ScorecardTargetTemp";
import ScorecardTemp from "./components/ScorecardTemp";

interface ScorecardElementRendererProps {
  element: ScorecardElement;
  elementIndex: number;
}

export default function ScorecardElementRenderer({ element }: ScorecardElementRendererProps) {
  const {
    register,
    formState: { errors }
  } = useFormContext();

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

  const calcMarks = (min: number, max: number, step: number) => {
    const marks = [];
    for (let i = min; i <= max; i += step) {
      marks.push({ value: i, label: `${i}` });
    }
    return marks;
  };

  // Render different input types based on the element code
  const renderInputComponent = () => {
    switch (codeConfig.type) {
      case "SLIDER":
        return (
          <ScorecardSlider
            element={element}
            min={codeConfig.min}
            max={codeConfig.max}
            step={codeConfig.step}
            marks={calcMarks(codeConfig.min, codeConfig.max, codeConfig.step)}
          />
        );

      case "SUPERVISOR":
        return <ScorecardSupervisor element={element} />;

      case "YN":
        return <ScorecardYN element={element} />;

      case "PASSFAIL":
        return <ScorecardPassFail element={element} />;

      case "SCORE5":
      case "SCORE10":
        const scoreMin = 1;
        const scoreMax = codeConfig.type === "SCORE5" ? 5 : 10;
        return (
          <ScorecardScore
            element={element}
            scoreMax={scoreMax}
            marks={calcMarks(scoreMin, scoreMax, codeConfig.step)}
          />
        );

      case "HEALTH":
        return <ScorecardHealth element={element} />;

      case "RANGE":
        return <ScorecardRange element={element} min={codeConfig.min} max={codeConfig.max} />;

      case "WEEKSONFEED":
        return <ScorecardWeeksOnFeed element={element} />;

      case "MORTALITY":
        return <ScorecardMortality element={element} />;

      case "POSTDATE":
        return <ScorecardPostDate element={element} />;

      case "TARGETTEMP":
        return <ScorecardTargetTemp element={element} />;

      case "TEMP":
        return <ScorecardTemp element={element} />;

      default:
        // For any unrecognized codes, render a text input
        return (
          <TextField
            {...register(element.id, { required: "This field is required" })}
            fullWidth
            variant="outlined"
            error={!!errors[element.id]}
            placeholder="Enter value..."
          />
        );
    }
  };

  return (
    <Stack spacing={2}>
      <FormLabel component="legend" sx={{ fontWeight: 600, color: "text.primary" }}>
        {element.label}
      </FormLabel>
      {renderInputComponent()}
    </Stack>
  );
}
