import { Card, CardContent, Stack, Typography } from "@mui/material";
import { useFuelStore } from "../../store/fuelStore";
import FuelHistoryDataTable from "./FuelHistoryDataTable";
import FuelHistorySummary from "./FuelHistorySummary";

export default function FuelHistory() {
  return (
    <Stack spacing={2}>
      <Typography variant="h6" gutterBottom>
        Fuel Summary (3 yr totals)
      </Typography>
      <FuelHistorySummary />
      <Typography variant="h6" gutterBottom>
        Recent Entries
      </Typography>
      <FuelHistoryDataTable />
    </Stack>
  );
}
