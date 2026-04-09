import { Stack, Typography } from "@mui/material";
import { MaintenanceAssetDetails } from "../../store/types/maintenance";
import MaintenanceHistoryDataTable from "./MaintenanceHistoryDataTable";
import MaintenanceHistorySummary from "./MaintenanceHistorySummary";

interface Props {
  selectedAsset: MaintenanceAssetDetails | null;
  isLoading: boolean;
}

export default function MaintenanceHistory({ selectedAsset, isLoading }: Props) {
  
  return (
    <Stack spacing={2}>
      <Typography variant="h6" gutterBottom>
        Maintenance Summary (Last 3 Years)
      </Typography>
      <MaintenanceHistorySummary selectedAsset={selectedAsset} />
      <Typography variant="h6" gutterBottom>
        Recent Entries
      </Typography>
      <MaintenanceHistoryDataTable selectedAsset={selectedAsset} isLoading={isLoading} />
    </Stack>
  );
}
