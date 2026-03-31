import { PercentOutlined, ShoppingBasket, SwapVert } from "@mui/icons-material";
import HealthAndSafetyOutlinedIcon from "@mui/icons-material/HealthAndSafetyOutlined";
import LibraryAddOutlinedIcon from "@mui/icons-material/LibraryAddOutlined";
import { Stack } from "@mui/material";
import BabyBottleIcon from "../../assets/BabyBottleIcon";
import CustomPageContainer from "../../components/framework/CustomPageContainer";
import DomainNotice from "../../components/framework/DomainNotice";
import PageNavigationButton from "../../components/inputs/PageNavigationButton";

export default function LivestockActivityPage() {
  return (
    <>
      <DomainNotice />
      <CustomPageContainer>
        <Stack spacing={2}>
          <PageNavigationButton
            option={{
              label: "Move",
              href: "move",
              icon: <SwapVert color="primary" />,
              description: "Transfer livestock between locations or pens"
            }}
          />
          <PageNavigationButton
            option={{
              label: "Wean Pigs",
              href: "wean",
              icon: <BabyBottleIcon color="primary" />,
              description: "Process weaning of piglets from sows"
            }}
          />
          <PageNavigationButton
            option={{
              label: "Grade Off",
              href: "gradeoff",
              icon: <PercentOutlined color="primary" />,
              description: "Note livestock by qualities"
            }}
          />
          <PageNavigationButton
            option={{
              label: "Mortality",
              href: "mortality",
              icon: <HealthAndSafetyOutlinedIcon color="primary" />,
              description: "Record livestock mortality and health issues"
            }}
          />
          <PageNavigationButton
            option={{
              label: "Purchase Livestock",
              href: "purchase",
              icon: <ShoppingBasket color="primary" />,
              description: "Add new livestock purchases to inventory"
            }}
          />
          <PageNavigationButton
            option={{
              label: "Quantity Adjustment",
              href: "quantityadj",
              icon: <LibraryAddOutlinedIcon color="primary" />,
              description: "Adjust livestock counts and inventory numbers"
            }}
          />
        </Stack>
      </CustomPageContainer>
    </>
  );
}
