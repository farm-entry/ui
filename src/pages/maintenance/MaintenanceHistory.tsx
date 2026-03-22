import { Stack, Typography } from "@mui/material";
import MaintenanceHistoryDataTable from "./MaintenanceHistoryDataTable";
import MaintenanceHistorySummary from "./MaintenanceHistorySummary";

export default function MaintenanceHistory() {
  return (
    <Stack spacing={2}>
      <Typography variant="h6" gutterBottom>
        Maintenance Summary (Last 3 Years)
      </Typography>
      <MaintenanceHistorySummary />
      <Typography variant="h6" gutterBottom>
        Recent Entries
      </Typography>
      <MaintenanceHistoryDataTable />
    </Stack>
  );
}
