import { Grade, ReportProblem, ShoppingCart, SouthEast, SwapVert, Tune } from "@mui/icons-material";
import { Stack } from "@mui/material";
import { useNavigate } from "react-router";
import PageNavigationButton from "../../components/inputs/PageNavigationButton";

export default function LivestockActivityPage() {
  const navigate = useNavigate();
  return (
    <Stack spacing={2}>
      <PageNavigationButton
        option={{
          label: "Move",
          href: "move",
          icon: <SwapVert color="primary" />,
          description: "Transfer livestock between locations or pens"
        }}
        navigate={navigate}
      />
      <PageNavigationButton
        option={{
          label: "Wean Pigs",
          href: "wean",
          icon: <SouthEast color="primary" />,
          description: "Process weaning of piglets from sows"
        }}
        navigate={navigate}
      />
      <PageNavigationButton
        option={{
          label: "Grade Off",
          href: "gradeoff",
          icon: <Grade color="primary" />,
          description: "Note livestock by qualities"
        }}
        navigate={navigate}
      />
      <PageNavigationButton
        option={{
          label: "Mortality",
          href: "mortality",
          icon: <ReportProblem color="primary" />,
          description: "Record livestock mortality and health issues"
        }}
        navigate={navigate}
      />
      <PageNavigationButton
        option={{
          label: "Purchase Livestock",
          href: "purchase",
          icon: <ShoppingCart color="primary" />,
          description: "Add new livestock purchases to inventory"
        }}
        navigate={navigate}
      />
      <PageNavigationButton
        option={{
          label: "Quantity Adjustment",
          href: "quantityadj",
          icon: <Tune color="primary" />,
          description: "Adjust livestock counts and inventory numbers"
        }}
        navigate={navigate}
      />
    </Stack>
  );
}
