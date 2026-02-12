import { History, Build } from "@mui/icons-material";
import { Box, FormHelperText, Paper, Stack, Tab, Tabs } from "@mui/material";
import * as React from "react";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import CustomHeader from "../../components/framework/CustomHeader";
import { TypeAhead, TypeAheadOption } from "../../components/inputs";
import CustomFormsLayout from "../../layouts/forms";
import { useMaintenanceStore } from "../../store/maintenanceStore";
import { MaintenanceFormData } from "../../store/types/maintenance";
import MaintenanceEntryForm from "./MaintenanceEntryForm";
import MaintenanceHistory from "./MaintenanceHistory";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const defaultValues: MaintenanceFormData = {
  maintenanceAsset: "",
  activityDate: new Date().toISOString().split("T")[0],
  gallons: 0,
  currentMiles: 0,
  comments: ""
};

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`maintenance-tabpanel-${index}`}
      aria-labelledby={`maintenance-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export default function MaintenancePage() {
  const [tabValue, setTabValue] = useState(0);

  const {
    maintenanceAssets,
    selectedMaintenanceAsset,
    getMaintenanceAssetDetails,
    setSelectedMaintenanceAsset,
    getMaintenanceAssets
  } = useMaintenanceStore();

  const formContext = useForm<MaintenanceFormData>();

  const {
    register,
    watch,
    reset,
    formState: { errors }
  } = formContext;

  useEffect(() => {
    // setInitLoading(true);

    const promises = [];
    if (!(maintenanceAssets.length > 0)) promises.push(getMaintenanceAssets());

    Promise.all(promises).finally(() => {
      // setInitLoading(false);
    });
  }, []);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const setMaintenanceAsset = (value: TypeAheadOption | null) => {
    console.log(
      "Selected maintenance asset changed:",
      value?.value,
      selectedMaintenanceAsset?.number
    );
    if (value?.value && value?.value !== selectedMaintenanceAsset?.number) {
      getMaintenanceAssetDetails(`${value.value}`).then((asset) =>
        setSelectedMaintenanceAsset(asset)
      );
    } else if (!value) {
      setSelectedMaintenanceAsset(null);
    }
  };

  const handleReset = () => {
    reset(defaultValues);
  };

  return (
    <CustomFormsLayout>
      <CustomHeader
        icon={Build}
        title="Record Maintenance Activity"
        button={{ label: "reset", onClick: handleReset }}
      />
      <FormProvider {...formContext}>
        <Paper elevation={0} sx={{ p: 3, mb: 2 }}>
          <Stack>
            <TypeAhead
              {...register("maintenanceAsset", { required: "Maintenance asset is required" })}
              handleChange={(v) => setMaintenanceAsset(v)}
              watch={watch}
              fieldName={"maintenanceAsset"}
              labelKey={"description"}
              valueKey={"number"}
              valueList={maintenanceAssets}
              placeholder="Select an Asset..."
            />
            {errors.maintenanceAsset && (
              <FormHelperText error>{errors.maintenanceAsset.message}</FormHelperText>
            )}
          </Stack>
        </Paper>

        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="maintenance management tabs"
          >
            <Tab
              icon={<Build />}
              label="Maintenance Entry"
              id="maintenance-tab-0"
              aria-controls="maintenance-tabpanel-0"
            />
            <Tab
              icon={<History />}
              label="Maintenance History"
              id="maintenance-tab-1"
              aria-controls="maintenance-tabpanel-1"
            />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          <MaintenanceEntryForm />
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <MaintenanceHistory />
        </TabPanel>
      </FormProvider>
    </CustomFormsLayout>
  );
}
