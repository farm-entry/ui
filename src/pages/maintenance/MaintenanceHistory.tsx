import { Card, CardContent, Stack, Typography } from "@mui/material";
import { useFuelStore } from "../../store/fuelStore";
import FuelHistoryDataTable from "./MaintenanceHistoryDataTable";
import FuelHistorySummary from "./MaintenanceHistorySummary";

export default function FuelHistory() {
  return (
    <Stack spacing={2}>
      <Typography variant="h6" gutterBottom>
        Fuel Summary (Last 3 Years)
      </Typography>
      <FuelHistorySummary />
      <Typography variant="h6" gutterBottom>
        Recent Entries
      </Typography>
      <FuelHistoryDataTable />
    </Stack>
  );
}
