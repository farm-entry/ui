import { History, LocalGasStation } from "@mui/icons-material";
import { Box, FormHelperText, Paper, Stack, Tab, Tabs } from "@mui/material";
import * as React from "react";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import CustomHeader from "../../components/framework/CustomHeader";
import { TypeAhead, TypeAheadOption } from "../../components/inputs";
import CustomFormsLayout from "../../layouts/forms";
import { useFuelStore } from "../../store/fuelStore";
import { FuelFormData } from "../../store/types/fuel";
import FuelEntryForm from "./FuelEntryForm";
import FuelHistory from "./FuelHistory";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const defaultValues: FuelFormData = {
  fuelAsset: "",
  activityDate: new Date().toLocaleDateString("en-CA"),
  gallons: 0,
  currentMiles: 0,
  comments: ""
};

console.log("Default values:", defaultValues);

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`fuel-tabpanel-${index}`}
      aria-labelledby={`fuel-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export default function FuelPage() {
  const [tabValue, setTabValue] = useState(0);

  const {
    fuelAssets,
    selectedFuelAsset,
    getFuelAssetDetails,
    setSelectedFuelAsset,
    getFuelAssets
  } = useFuelStore();

  const formContext = useForm<FuelFormData>({ defaultValues });

  const {
    register,
    watch,
    reset,
    setValue,
    formState: { errors }
  } = formContext;

  useEffect(() => {
    // setInitLoading(true);

    const promises = [];
    if (!(fuelAssets.length > 0)) promises.push(getFuelAssets());

    Promise.all(promises).finally(() => {
      // setInitLoading(false);
    });
  }, []);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const setFuelAsset = (value: TypeAheadOption | null) => {
    console.log("Selected fuel asset changed:", value?.value, selectedFuelAsset?.number);
    if (value?.value && value?.value !== selectedFuelAsset?.number) {
      getFuelAssetDetails(`${value.value}`).then((asset) => {
        setValue("fuelAsset", asset?.number || "");
        setSelectedFuelAsset(asset);
      });
    } else if (!value) {
      setSelectedFuelAsset(null);
    }
  };

  const handleReset = () => {
    setSelectedFuelAsset(null);
    reset(defaultValues);
  };

  return (
    <CustomFormsLayout>
      <CustomHeader
        icon={LocalGasStation}
        title="Record Fuel Activity"
        button={{ label: "reset", onClick: handleReset }}
      />
      <FormProvider {...formContext}>
        <Paper elevation={0} sx={{ p: 1 }}>
          <Stack>
            <TypeAhead
              {...register("fuelAsset", { required: "Fuel asset is required" })}
              handleChange={(v) => setFuelAsset(v)}
              watch={watch}
              fieldName={"fuelAsset"}
              labelKey={"description"}
              valueKey={"number"}
              valueList={fuelAssets}
              placeholder="Select an Asset..."
            />
            {errors.fuelAsset && <FormHelperText error>{errors.fuelAsset.message}</FormHelperText>}
          </Stack>
        </Paper>

        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="fuel management tabs">
            <Tab
              icon={<LocalGasStation />}
              label="Fuel Entry"
              id="fuel-tab-0"
              aria-controls="fuel-tabpanel-0"
            />
            <Tab
              icon={<History />}
              label="Fuel History"
              id="fuel-tab-1"
              aria-controls="fuel-tabpanel-1"
            />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          <FuelEntryForm />
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <FuelHistory />
        </TabPanel>
      </FormProvider>
    </CustomFormsLayout>
  );
}
