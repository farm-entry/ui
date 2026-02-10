import AgricultureIcon from "@mui/icons-material/Agriculture";
import AssessmentIcon from "@mui/icons-material/Assessment";
import BuildIcon from "@mui/icons-material/Build";
import InventoryIcon from "@mui/icons-material/Inventory";
import LocalGasStationIcon from "@mui/icons-material/LocalGasStation";
import UpdateIcon from "@mui/icons-material/Update";
import { Box, CardActionArea, Typography } from "@mui/material";
import { PageContainer } from "@toolpad/core/PageContainer";
import { useNavigate } from "react-router";
import { CustomCard } from "../components/framework";

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
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: 2
        }}
      >
        {dashboardOptions.map((option) => (
          <CustomCard key={option.label} variant="outlined" full>
            <CardActionArea onClick={() => navigate(option.href)} sx={{ p: 2 }}>
              <Box
                display="flex"
                flexDirection="row"
                alignItems="center"
                justifyContent="flex-start"
                height="100%"
                width="100%"
              >
                <Box sx={{ mr: 2, display: "flex", alignItems: "center" }}>{option.icon}</Box>
                <Box
                  display="flex"
                  flexDirection="column"
                  alignItems="flex-start"
                  justifyContent="center"
                  flex={1}
                >
                  <Typography variant="h6" sx={{ mb: 0.5 }}>
                    {option.label}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {option.description}
                  </Typography>
                </Box>
              </Box>
            </CardActionArea>
          </CustomCard>
        ))}
      </Box>
    </PageContainer>
  );
}
