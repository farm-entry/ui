import React from "react";
import { Card, CardContent, Typography, Stack } from "@mui/material";
import { groupBy, map, maxBy, minBy, sumBy, takeRight, reverse } from "lodash";
import { FuelAssetDetails, FuelHistory } from "../../store/types/fuel";

interface Props {
  selectedAsset: FuelAssetDetails | null;
}

const FuelHistorySummary: React.FC<Props> = ({ selectedAsset: selectedFuelAsset }) => {

  if (!selectedFuelAsset?.history || selectedFuelAsset.history.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary" align="center" py={2}>
        No fuel history available for summary
      </Typography>
    );
  }

  const fuelHistoryAsset = selectedFuelAsset.history;
  const unitOfMeasureCode = selectedFuelAsset.unitOfMeasureCode || "GAL";

  const numberWithCommas = (num: string): string => {
    return num.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const fuelMeasurementUnitOfMeasurementLabel = selectedFuelAsset
    ? `${
        selectedFuelAsset.unitOfMeasureCode.charAt(0).toUpperCase() +
        selectedFuelAsset.unitOfMeasureCode.slice(1).toLowerCase() +
        (!selectedFuelAsset.unitOfMeasureCode.endsWith("S") ? "s" : "")
      }`
    : "miles";

  const getUoM = (calc: number) => {
    switch (unitOfMeasureCode.toUpperCase()) {
      case "MILES":
      case "MILE":
        return `${calc} mpg`;
      case "HOURS":
      case "HOUR":
        return `${calc} gph`;
      default:
        return "---";
    }
  };

  const calcAveRate = (asset: { meta: number; quantity: number }): number => {
    const { meta: m, quantity: q } = asset;
    if (unitOfMeasureCode === "HOUR") {
      return parseFloat((q / m).toFixed(1));
    } else {
      return parseFloat((m / q).toFixed(1));
    }
  };

  // Group by year and calculate totals
  const groupedByYear = groupBy(fuelHistoryAsset, (a) => a.postingDate.split("-")[0]);

  const yearlyTotals = takeRight(
    map(groupedByYear, (yearData, year) => {
      const milesHoursSum =
        (maxBy(yearData, "meta")?.meta || 0) - (minBy(yearData, "meta")?.meta || 0);
      const totalCost = sumBy(yearData, "amount");
      const totalQuantity = sumBy(yearData, "quantity");
      const avgCostPerGallon = totalCost / totalQuantity;

      return {
        year,
        milesHoursSum,
        totalCost: `$${numberWithCommas(totalCost.toFixed())}`,
        fuelSum: `${numberWithCommas(totalQuantity.toFixed())} gal`,
        aveFuelCost: `$${avgCostPerGallon.toFixed(2)}/gal`,
        efficiencySum: getUoM(
          calcAveRate({
            meta: milesHoursSum,
            quantity: totalQuantity
          })
        )
      };
    }),
    3
  );

  return (
    <Stack>
      {/* <Stack direction={{ xs: "column", sm: "row" }} spacing={1} justifyContent="space-between"> */}
      <Stack direction="row" spacing={1} justifyContent="space-between">
        {reverse(yearlyTotals).map((yearData, index) => (
          <Card key={index} sx={{ flex: 1 }}>
            <CardContent>
              <Typography variant="h6" component="div" gutterBottom color="primary">
                {yearData.year}
              </Typography>

              <Stack spacing={1}>
                <Stack
                  display="flex"
                  justifyContent="space-between"
                  direction={{ xs: "column", sm: "row" }}
                >
                  <Typography variant="body2" color="text.secondary">
                    Cost
                  </Typography>
                  <Typography variant="body2" fontWeight="medium">
                    {yearData.totalCost}
                  </Typography>
                </Stack>

                <Stack
                  display="flex"
                  justifyContent="space-between"
                  direction={{ xs: "column", sm: "row" }}
                >
                  <Typography variant="body2" color="text.secondary">
                    {fuelMeasurementUnitOfMeasurementLabel}
                  </Typography>
                  <Typography variant="body2" fontWeight="medium">
                    {numberWithCommas(yearData.milesHoursSum.toString())}
                  </Typography>
                </Stack>

                <Stack
                  display="flex"
                  justifyContent="space-between"
                  direction={{ xs: "column", sm: "row" }}
                >
                  <Typography variant="body2" color="text.secondary">
                    Quantity
                  </Typography>
                  <Typography variant="body2" fontWeight="medium">
                    {yearData.fuelSum}
                  </Typography>
                </Stack>

                <Stack
                  display="flex"
                  justifyContent="space-between"
                  direction={{ xs: "column", sm: "row" }}
                >
                  <Typography variant="body2" color="text.secondary">
                    Average
                  </Typography>
                  <Typography variant="body2" fontWeight="medium">
                    {yearData.aveFuelCost}
                  </Typography>
                </Stack>

                <Stack
                  display="flex"
                  justifyContent="space-between"
                  direction={{ xs: "column", sm: "row" }}
                >
                  <Typography variant="body2" color="text.secondary">
                    Efficiency
                  </Typography>
                  <Typography variant="body2" fontWeight="medium">
                    {yearData.efficiencySum}
                  </Typography>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Stack>
  );
};

export default FuelHistorySummary;
