import React from "react";
import { Card, CardContent, Typography, Stack, Paper } from "@mui/material";
import { groupBy, map, maxBy, minBy, sumBy, takeRight, reverse } from "lodash";
import { MaintenanceAssetDetails, MaintenanceHistoryAsset } from "../../store/types/maintenance";

interface Props {
  selectedAsset: MaintenanceAssetDetails | null;
}

const MaintenanceHistorySummary: React.FC<Props> = ({ selectedAsset: selectedMaintenanceAsset }) => {
  if (!selectedMaintenanceAsset?.history || selectedMaintenanceAsset.history.length === 0) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6" color="text.secondary" align="center">
            No maintenance history available for summary
          </Typography>
        </CardContent>
      </Card>
    );
  }

  const history = selectedMaintenanceAsset.history;

  const numberWithCommas = (num: string): string => {
    return num.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const groupedByYear = groupBy(history, (a: MaintenanceHistoryAsset) =>
    a.postingDate.split("-")[0]
  );

  const yearlyTotals = takeRight(
    map(groupedByYear, (yearData, year) => {
      const odometerRange =
        (maxBy(yearData, "meta")?.meta || 0) - (minBy(yearData, "meta")?.meta || 0);
      const totalCost = sumBy(yearData, "amount");
      const totalHours = sumBy(yearData, "quantity");
      const avgCostPerHour = totalHours > 0 ? totalCost / totalHours : 0;

      return {
        year,
        odometerRange,
        totalCost: `$${numberWithCommas(totalCost.toFixed())}`,
        totalHours: `${numberWithCommas(totalHours.toFixed(1))} hrs`,
        avgCostPerHour: `$${avgCostPerHour.toFixed(2)}/hr`
      };
    }),
    3
  );

  return (
    <Stack>
      <Stack direction="row" spacing={1} justifyContent="space-between">
        {reverse(yearlyTotals).map((yearData, index) => (
          <Card key={index} sx={{ flex: 1 }}>
            <CardContent>
              <Typography variant="h6" component="div" gutterBottom color="primary">
                {yearData.year}
              </Typography>
              <Stack spacing={1}>
                <Stack display="flex" justifyContent="space-between" direction={{ xs: "column", sm: "row" }}>
                  <Typography variant="body2" color="text.secondary">Cost</Typography>
                  <Typography variant="body2" fontWeight="medium">{yearData.totalCost}</Typography>
                </Stack>
                <Stack display="flex" justifyContent="space-between" direction={{ xs: "column", sm: "row" }}>
                  <Typography variant="body2" color="text.secondary">Work Hours</Typography>
                  <Typography variant="body2" fontWeight="medium">{yearData.totalHours}</Typography>
                </Stack>
                <Stack display="flex" justifyContent="space-between" direction={{ xs: "column", sm: "row" }}>
                  <Typography variant="body2" color="text.secondary">Odometer Change</Typography>
                  <Typography variant="body2" fontWeight="medium">
                    {numberWithCommas(yearData.odometerRange.toString())}
                  </Typography>
                </Stack>
                <Stack display="flex" justifyContent="space-between" direction={{ xs: "column", sm: "row" }}>
                  <Typography variant="body2" color="text.secondary">Avg Cost/Hr</Typography>
                  <Typography variant="body2" fontWeight="medium">{yearData.avgCostPerHour}</Typography>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Stack>
  );
};

export default MaintenanceHistorySummary;
