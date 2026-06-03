import { PercentOutlined, ShoppingBasket, SwapVert } from "@mui/icons-material";
import HealthAndSafetyOutlinedIcon from "@mui/icons-material/HealthAndSafetyOutlined";
import LibraryAddOutlinedIcon from "@mui/icons-material/LibraryAddOutlined";
import { Stack } from "@mui/material";
import { JSX } from "react";
import BabyBottleIcon from "../../assets/BabyBottleIcon";
import CustomPageContainer from "../../components/framework/CustomPageContainer";
import PageNavigationButton from "../../components/inputs/PageNavigationButton";
import { useUserStore } from "../../store/userStore";
import { makeInclusivityPredicate } from "../../utils/filterHelpers";

interface SubFormEntry {
  segment: string;
  label: string;
  href: string;
  icon: JSX.Element;
  description: string;
}

const SUB_FORMS: SubFormEntry[] = [
  {
    segment: "move",
    label: "Move",
    href: "move",
    icon: <SwapVert color="primary" />,
    description: "Transfer livestock between locations or pens"
  },
  {
    segment: "wean",
    label: "Wean Pigs",
    href: "wean",
    icon: <BabyBottleIcon color="primary" />,
    description: "Process weaning of piglets from sows"
  },
  {
    segment: "gradeoff",
    label: "Grade Off",
    href: "gradeoff",
    icon: <PercentOutlined color="primary" />,
    description: "Note livestock by qualities"
  },
  {
    segment: "mortality",
    label: "Mortality",
    href: "mortality",
    icon: <HealthAndSafetyOutlinedIcon color="primary" />,
    description: "Record livestock mortality and health issues"
  },
  {
    segment: "purchase",
    label: "Purchase Livestock",
    href: "purchase",
    icon: <ShoppingBasket color="primary" />,
    description: "Add new livestock purchases to inventory"
  },
  {
    segment: "quantityadj",
    label: "Quantity Adjustment",
    href: "quantityadj",
    icon: <LibraryAddOutlinedIcon color="primary" />,
    description: "Adjust livestock counts and inventory numbers"
  }
];

export default function LivestockActivityPage() {
  const menuOptionsFilter = useUserStore((state) => state.filters.menuOptions);

  const predicate = makeInclusivityPredicate(menuOptionsFilter, (f) => f.segment);

  const visibleForms = SUB_FORMS.filter((form) => predicate(form.segment));

  return (
    <>
      <CustomPageContainer>
        <Stack spacing={2}>
          {visibleForms.map((form) => (
            <PageNavigationButton
              key={form.segment}
              option={{
                label: form.label,
                href: form.href,
                icon: form.icon,
                description: form.description
              }}
            />
          ))}
        </Stack>
      </CustomPageContainer>
    </>
  );
}
