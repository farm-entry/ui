import AssessmentIcon from "@mui/icons-material/Assessment";
import { Box, Typography } from "@mui/material";
import CustomFormsLayout from "../../layouts/forms";
import { scorecardPages } from "../../mock";
import { ScorecardPages } from "../../store/types/scorecards";
import ScorecardCaretaker from "./components/ScorecardCaretaker";
import ScorecardHealthInput from "./components/ScorecardHealthInput";
import ScorecardLivestockJob from "./components/ScorecardLivestockJob";
import ScorecardMortality from "./components/ScorecardMortality";
import ScorecardPassFail from "./components/ScorecardPassFail";
import ScorecardPostingDate from "./components/ScorecardPostingDate";
import ScorecardScores from "./components/ScorecardScores";
import ScorecardSupervisor from "./components/ScorecardSupervisor";
import ScorecardTargetTemp from "./components/ScorecardTargetTemp";
import ScorecardTempInput from "./components/ScorecardTemp";
import ScorecardWeeksOnFeed from "./components/ScorecardWeeksOnFeed";
import ScorecardYesNo from "./components/ScorecardYesNo";
import ScorecardRangeInput from "./components/ScorecardRange";
import ScorecardSlider from "./components/ScorecardSlider";

export default function ScorecardsPage() {
  const scorecardData = scorecardPages as ScorecardPages;

  const renderComponent = ({ props }: { props: any }) => {
    // Logic to render different components based on the code
    const codeArray = props.code.split("-");
    const codeMap = {
      title: codeArray[0],
      min: parseInt(codeArray[1]),
      max: parseInt(codeArray[2]),
      step: parseInt(codeArray[3] || "1")
    };

    if (codeMap.title === "RANGE") {
      return <ScorecardRangeInput {...props} min={codeMap.min} max={codeMap.max} />;
    } else if (codeMap.title === "SLIDER") {
      return <ScorecardSlider {...props} min={codeMap.min} max={codeMap.max} step={codeMap.step} />;
    } else {
      switch (props.code) {
        case "YN":
          return <ScorecardYesNo {...props} />;
        case "JOB": // N/A
          return <ScorecardLivestockJob {...props} />;
        case "CARETAKER": // N/A
          return <ScorecardCaretaker {...props} />;
        case "SUPERVISOR": // N/A
          return <ScorecardSupervisor {...props} />;
        case "SCORE5":
          return <ScorecardScores {...props} min={0} max={5} step={1} />;
        case "SCORE10":
          return <ScorecardScores {...props} min={0} max={10} step={1} />;
        case "HEALTH":
          return <ScorecardHealthInput {...props} min={0} max={100} />;
        case "WEEKSONFEED":
          return <ScorecardWeeksOnFeed {...props} />;
        case "MORTALITY":
          return <ScorecardMortality {...props} />;
        case "POSTDATE":
          return <ScorecardPostingDate {...props} />;
        case "TARGETTEMP":
          return <ScorecardTargetTemp {...props} />;
        case "TEMP":
          return <ScorecardTempInput {...props} />;
        case "PASSFAIL":
          return <ScorecardPassFail {...props} />;
        default:
          return <></>;
      }
    }
  };

  return renderComponent({ props: scorecardData });
}
