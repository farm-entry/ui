import { History, LocalGasStation } from "@mui/icons-material";
import { Box, FormHelperText, Paper, Stack, Tab, Tabs } from "@mui/material";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import CustomConfirmation from "../../components/framework/CustomConfirmation";
import CustomHeader from "../../components/framework/CustomHeader";
import CustomNotice from "../../components/framework/CustomNotice";
import LoadingSpinner from "../../components/framework/LoadingSpinner";
import { TypeAhead, TypeAheadOption } from "../../components/inputs";
import CustomFormsLayout from "../../layouts/forms";
import { useConfirmationStore } from "../../store/confirmationStore";
import { useFuelStore } from "../../store/fuelStore";
import { FuelFormData } from "../../store/types/fuel";
import FuelEntryForm from "./FuelEntryForm";
import FuelHistory from "./FuelHistory";

const FUEL_STORAGE_KEY = "fuel-form";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const defaultValues: FuelFormData = {
  form: "FUEL",
  asset: "",
  postingDate: new Date().toLocaleDateString("en-CA"),
  gallons: null,
  mileage: null,
  comments: ""
};

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
  const [initLoading, setInitLoading] = useState(true);

  const {
    fuelAssets,
    selectedFuelAsset,
    getFuelAssetDetails,
    setSelectedFuelAsset,
    getFuelAssets
  } = useFuelStore();

  const showConfirmation = useConfirmationStore((state) => state.showConfirmation);
  const formContext = useForm<FuelFormData>({ defaultValues });

  const {
    watch,
    reset,
    setValue,
    formState: { errors }
  } = formContext;

  useEffect(() => {
    let isMounted = true;
    setInitLoading(true);
    const promises = [];
    if (fuelAssets.length === 0) promises.push(getFuelAssets());

    Promise.all(promises).then(() => {
      if (isMounted) {
        setInitLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const setFuelAsset = async (value: TypeAheadOption | null) => {
    if (!value) {
      setSelectedFuelAsset(null);
      setValue("asset", "");
      return;
    }

    if (value.value && value.value !== selectedFuelAsset?.number) {
      const asset = await getFuelAssetDetails(String(value.value));
      if (asset) {
        setValue("asset", asset.number);
        setSelectedFuelAsset(asset);
      }
    }
  };

  const handleReset = () => {
    showConfirmation(
      "Are you sure?",
      "This will reset all form fields to their default values.",
      () => {
        setSelectedFuelAsset(null);
        reset(defaultValues);
      }
    );
  };

  return (
    <>
      {initLoading && <LoadingSpinner />}
      {!initLoading && (
        <>
          <CustomNotice<FuelFormData> formType={FUEL_STORAGE_KEY} onLoad={(data) => reset(data)} />
          <CustomFormsLayout>
            <CustomHeader
              icon={LocalGasStation}
              title="Fuel Activity"
              button={{ label: "reset", onClick: handleReset }}
            />
            <FormProvider {...formContext}>
              <Paper elevation={0} sx={{ p: 1 }}>
                <Stack>
                  <TypeAhead
                    handleChange={setFuelAsset}
                    watch={watch}
                    fieldName="asset"
                    labelKey="description"
                    valueKey="number"
                    valueList={fuelAssets}
                    placeholder="Select an Asset..."
                  />
                  {errors.asset && <FormHelperText error>{errors.asset.message}</FormHelperText>}
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

            <CustomConfirmation />
          </CustomFormsLayout>
        </>
      )}
    </>
  );
}
