import { LocalGasStation } from "@mui/icons-material";
import { Button, Divider, FormHelperText, InputAdornment, Stack, Typography } from "@mui/material";
import { PageContainer } from "@toolpad/core";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import CustomConfirmation from "../../components/framework/CustomConfirmation";
import CustomHeader from "../../components/framework/CustomHeader";
import LoadingSpinner from "../../components/framework/LoadingSpinner";
import Overlay from "../../components/framework/Overlay";
import {
  DatePicker,
  TextArea,
  TextField,
  TypeAhead,
  TypeAheadOption
} from "../../components/inputs";
import CustomFormsLayout from "../../layouts/forms";
import { maintenanceService } from "../../services/maintenanceApi";
import { useConfirmationStore } from "../../store/confirmationStore";
import { useFormStorageStore } from "../../store/formStorageStore";
import { useGlobalAlertStore } from "../../store/globalAlertStore";
import { useMaintenanceStore } from "../../store/maintenanceStore";
import { MaintenanceFormData } from "../../store/types/maintenance";
import { formatDateToYYYYMMDDNoTimestamp, parseYYYYMMDDToLocalDate } from "../../utils/date";
import MaintenanceHistory from "./MaintenanceHistory";

const MAINTENANCE_STORAGE_KEY = "maintenance-form";
const FORM_STORAGE_HOURS = 48;

const defaultValues: MaintenanceFormData = {
  maintenanceAsset: "",
  activityDate: new Date().toLocaleDateString("en-CA"),
  gallons: 0,
  currentMiles: 0,
  comments: ""
};

export default function MaintenancePage() {
  const navigate = useNavigate();
  const [initLoading, setInitLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [overlayOpen, setOverlayOpen] = useState(false);

  const {
    isLoading: isMaintenanceLoading,
    maintenanceAssets,
    selectedMaintenanceAsset,
    getMaintenanceAssetDetails,
    setSelectedMaintenanceAsset,
    getMaintenanceAssets
  } = useMaintenanceStore();

  const showConfirmation = useConfirmationStore((state) => state.showConfirmation);
  const { setAlert } = useGlobalAlertStore();
  const { saveForm } = useFormStorageStore();

  const {
    watch,
    reset,
    register,
    getValues,
    setValue,
    handleSubmit,
    formState: { errors }
  } = useForm<MaintenanceFormData>({ defaultValues });

  useEffect(() => {
    let isMounted = true;
    setInitLoading(true);
    const promises = [];
    if (maintenanceAssets.length === 0) promises.push(getMaintenanceAssets());

    Promise.all(promises).then(() => {
      if (isMounted) {
        setInitLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const setMaintenanceAsset = async (value: TypeAheadOption | null) => {
    if (!value) {
      setSelectedMaintenanceAsset(null);
      setValue("maintenanceAsset", "");
      return;
    }

    if (value.value && value.value !== selectedMaintenanceAsset?.number) {
      const asset = await getMaintenanceAssetDetails(String(value.value));
      if (asset) {
        setValue("maintenanceAsset", asset.number);
        setSelectedMaintenanceAsset(asset);
      }
    }
  };

  const handleReset = () => {
    showConfirmation(
      "Are you sure?",
      "This will reset all form fields to their default values.",
      () => {
        setSelectedMaintenanceAsset(null);
        reset(defaultValues);
      }
    );
  };

  const onSave = () => {
    const formData = getValues();
    saveForm(MAINTENANCE_STORAGE_KEY, formData, FORM_STORAGE_HOURS);
  };

  const onSubmit = async (data: MaintenanceFormData) => {
    setIsSubmitting(true);
    const state = { formData: data, section: "maintenance" };
    maintenanceService
      .postMaintenance(data)
      .then(() => {
        if (process.env.NODE_ENV === "development") {
          console.log("Form submitted:", data);
        }
        navigate("/post-success", { state });
      })
      .catch((error: Error) => {
        console.error("Unable to post form.");
        const errorInfo = {
          code: (error as any).code || "MAINTENANCE_SUBMISSION_ERROR",
          message: error.message || "Unable to submit form. Please try again.",
          details: (error as any).details || JSON.stringify(error, null, 2)
        };
        const errorMessage = errorInfo.message || "Unable to submit form. Please try again.";
        const errorTitle = errorInfo.code || "Unable to submit your form.";
        setAlert("error", errorMessage, errorTitle);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  const gallons = watch("gallons");
  const totalCost =
    gallons && selectedMaintenanceAsset
      ? (gallons * selectedMaintenanceAsset.item.cost).toFixed(2)
      : "0.00";

  return (
    <CustomFormsLayout<MaintenanceFormData>
      notice={{
        formType: MAINTENANCE_STORAGE_KEY,
        onLoad: (data) => reset(data)
      }}
      headerOptions={{ button: { label: "reset", onClick: handleReset } }}
    >
      {(initLoading || isSubmitting) && <LoadingSpinner />}
      {!initLoading && !isSubmitting && (
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={2}>
            <Stack>
              <TypeAhead
                {...register("maintenanceAsset", { required: "Maintenance asset is required." })}
                handleChange={setMaintenanceAsset}
                watch={watch}
                fieldName="maintenanceAsset"
                labelKey="description"
                valueKey="number"
                valueList={maintenanceAssets}
                placeholder="Select an Asset..."
              />
              {errors.maintenanceAsset && (
                <FormHelperText error>{errors.maintenanceAsset.message}</FormHelperText>
              )}
            </Stack>
            {selectedMaintenanceAsset && (
              <Button variant="outlined" fullWidth onClick={() => setOverlayOpen(true)}>
                Maintenance History
              </Button>
            )}
            <Divider />
            <Typography>Activity Details</Typography>
            <Stack>
              <DatePicker
                {...register("activityDate", { required: "Activity date is required" })}
                value={parseYYYYMMDDToLocalDate(watch("activityDate") || "")}
                onChange={(v) => setValue("activityDate", formatDateToYYYYMMDDNoTimestamp(v))}
                label="Activity Date"
                error={!!errors.activityDate}
                helperText={errors.activityDate?.message}
              />
            </Stack>

            {!selectedMaintenanceAsset && !isMaintenanceLoading && (
              <Typography align="center" sx={{ pt: 2 }}>
                Select a maintenance asset to enter details.
              </Typography>
            )}

            {isMaintenanceLoading && <LoadingSpinner />}

            {selectedMaintenanceAsset && !isMaintenanceLoading && (
              <>
                <Divider />
                <Typography>
                  Asset: <strong>{selectedMaintenanceAsset.description}</strong>
                </Typography>

                <Stack>
                  <TextField
                    value={watch("gallons")}
                    {...register("gallons", {
                      required: "Number of gallons field is required.",
                      min: { value: 0.01, message: "Must be greater than 0" },
                      valueAsNumber: true
                    })}
                    placeholder="# of Gallons"
                    type="number"
                    slotProps={{
                      input: {
                        endAdornment: (
                          <InputAdornment position="end">
                            ${selectedMaintenanceAsset.item.cost.toFixed(2)}
                          </InputAdornment>
                        )
                      }
                    }}
                    error={!!errors.gallons}
                    helperText={errors.gallons?.message}
                  />
                </Stack>

                <Typography variant="body2" color="text.secondary">
                  Total Cost: ${totalCost}
                </Typography>

                <Stack>
                  <TextField
                    value={watch("currentMiles")}
                    placeholder="Current Mileage"
                    {...register("currentMiles", {
                      required: "Mileage field is required.",
                      min: {
                        value: 0,
                        message: "Mileage cannot be negative"
                      },
                      valueAsNumber: true
                    })}
                    type="number"
                    error={!!errors.currentMiles}
                    helperText={errors.currentMiles?.message}
                  />
                </Stack>

                <Divider />
                <TextArea
                  value={watch("comments")}
                  placeholder="Comments"
                  {...register("comments", {
                    maxLength: { value: 100, message: "Comments cannot exceed 100 characters" }
                  })}
                  label="Comments"
                  type="text"
                  error={!!errors.comments}
                  helperText={errors.comments?.message}
                />
              </>
            )}

            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button variant="outlined" color="primary" fullWidth onClick={onSave}>
                Save
              </Button>
              <Button variant="contained" color="primary" fullWidth type="submit">
                Submit
              </Button>
            </Stack>
          </Stack>
        </form>
      )}

      <Overlay open={overlayOpen} onClose={() => setOverlayOpen(false)} title="Maintenance History">
        <MaintenanceHistory />
      </Overlay>

      <CustomConfirmation />
    </CustomFormsLayout>
  );
}
