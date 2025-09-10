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
  const navigate = useNavigate();
  return (
    <PageContainer>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: 2,
        }}
      >
        {dashboardOptions.map((option) => (
          <CustomCard key={option.title} variant="outlined" full>
            <CardActionArea onClick={() => navigate(option.segment)} sx={{ p: 2 }}>
              <Box display="flex" flexDirection="row" alignItems="center" justifyContent="flex-start" height="100%" width="100%">
                <Box sx={{ mr: 2, display: "flex", alignItems: "center" }}>{option.icon}</Box>
                <Box display="flex" flexDirection="column" alignItems="flex-start" justifyContent="center" flex={1}>
                  <Typography variant="h6" sx={{ mb: 0.5 }}>
                    {option.title}
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
