import { Card, CardContent, Stack, Typography } from "@mui/material";
import { FuelAssetDetails } from "../../store/types/fuel";
import FuelHistoryDataTable from "./FuelHistoryDataTable";
import FuelHistorySummary from "./FuelHistorySummary";

interface Props {
  selectedAsset: FuelAssetDetails | null;
  isLoading: boolean;
}

export default function FuelHistory({ selectedAsset, isLoading }: Props) {
  return (
    <Stack spacing={2}>
      <Typography variant="h6" gutterBottom>
        Fuel Summary (3 yr totals)
      </Typography>
      <FuelHistorySummary selectedAsset={selectedAsset} />
      <Typography variant="h6" gutterBottom>
        Recent Entries
      </Typography>
      <FuelHistoryDataTable selectedAsset={selectedAsset} isLoading={isLoading} />
    </Stack>
  );
}
