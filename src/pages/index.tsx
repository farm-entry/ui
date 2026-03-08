import AgricultureIcon from "@mui/icons-material/Agriculture";
import AssessmentIcon from "@mui/icons-material/Assessment";
import BuildIcon from "@mui/icons-material/Build";
import InventoryIcon from "@mui/icons-material/Inventory";
import LocalGasStationIcon from "@mui/icons-material/LocalGasStation";
import UpdateIcon from "@mui/icons-material/Update";
import { Box, CardActionArea, Fab, Stack, Typography } from "@mui/material";
import { PageContainer } from "@toolpad/core/PageContainer";
import { useNavigate } from "react-router";
import { CustomCard } from "../components/framework";
import { FavoriteBorder } from "@mui/icons-material";

export default function DashboardPage() {
  const dashboardOptions = [
    {
      label: "Livestock Activity",
      icon: <AgricultureIcon color="primary" sx={{ fontSize: 21 }} />,
      href: "livestock-activity",
      description: "Track and manage livestock activities."
    },
    {
      label: "Scorecards",
      icon: <AssessmentIcon color="primary" sx={{ fontSize: 21 }} />,
      href: "scorecards",
      description: "View and manage scorecards."
    },
    {
      label: "Fuel",
      icon: <LocalGasStationIcon color="primary" sx={{ fontSize: 21 }} />,
      href: "fuel",
      description: "Monitor fuel usage and logs."
    },
    {
      label: "Maintenance",
      icon: <BuildIcon color="primary" sx={{ fontSize: 21 }} />,
      href: "maintenance",
      description: "Schedule and review maintenance tasks."
    },
    {
      label: "Inventory Consumption",
      icon: <InventoryIcon color="primary" sx={{ fontSize: 21 }} />,
      href: "inventory-consumption",
      description: "Track inventory consumption and usage."
    },
    {
      label: "Job Header Updates",
      icon: <UpdateIcon color="primary" sx={{ fontSize: 21 }} />,
      href: "job-header-updates",
      description: "Update job headers and details."
    }
  ];

  const navigate = useNavigate();
  return (
    <PageContainer>
      <Stack spacing={2}>
        {dashboardOptions.map((option) => (
          <CustomCard key={option.label} variant="outlined" full>
            <CardActionArea onClick={() => navigate(option.href)} sx={{ p: 2 }}>
              <Stack direction="row" spacing={2}>
                <Stack justifyContent="center">{option.icon}</Stack>
                <Stack direction="column">
                  <Typography variant="h6">{option.label}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {option.description}
                  </Typography>
                </Stack>
              </Stack>
            </CardActionArea>
          </CustomCard>
        ))}
      </Stack>
    </PageContainer>
  );
}
