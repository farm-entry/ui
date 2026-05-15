import { Button, Divider, FormHelperText, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
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
import {
  MaintenanceAsset,
  MaintenanceAssetDetails,
  MaintenanceFormData
} from "../../store/types/maintenance";
import { formatDateToYYYYMMDDNoTimestamp, parseYYYYMMDDToLocalDate } from "../../utils/date";
import { numberDescriptionPostingGroupFormatter } from "../../utils/strings";
import MaintenanceHistory from "./MaintenanceHistory";

declare const process: any;

const ODOMETER_WARN_MILES = 10_000;
const ODOMETER_WARN_HOURS = 5_000;

const MAINTENANCE_STORAGE_KEY = "maintenance-form";
const FORM_STORAGE_HOURS = 48;

const defaultValues: MaintenanceFormData = {
  form: "MAINTENANCE",
  asset: "",
  postingDate: new Date().toLocaleDateString("en-CA"),
  type: "",
  workHours: null,
  mileage: null,
  comments: ""
};

export default function MaintenancePage() {
  const navigate = useNavigate();
  const [initLoading, setInitLoading] = useState(true);
  const [overlayOpen, setOverlayOpen] = useState(false);
  const [maintenanceAssets, setMaintenanceAssets] = useState<MaintenanceAsset[]>([]);
  const [selectedMaintenanceAsset, setSelectedMaintenanceAsset] =
    useState<MaintenanceAssetDetails | null>(null);
  const [isMaintenanceLoading, setIsMaintenanceLoading] = useState(false);
  const [maintenanceCodes, setMaintenanceCodes] = useState<MaintenanceAsset[]>([]);
  const [selectedMaintenanceCode, setSelectedMaintenanceCode] = useState<MaintenanceAsset | null>(null);

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
    maintenanceService
      .getMaintenanceAssets()
      .then((assets) => {
        if (isMounted) {
          setMaintenanceAssets(assets);
          setInitLoading(false);
        }
      })
      .catch((error: unknown) => {
        setAlert("error", error as Error);
      })
      .finally(() => {
        setInitLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const setMaintenanceAsset = async (value: TypeAheadOption | null) => {
    if (!value) {
      setSelectedMaintenanceAsset(null);
      setMaintenanceCodes([]);
      setSelectedMaintenanceCode(null);
      setValue("asset", "");
      setValue("type", "");
      return;
    }

    if (value.value && value.value !== selectedMaintenanceAsset?.number) {
      setIsMaintenanceLoading(true);
      try {
        const [asset, codes] = await Promise.all([
          maintenanceService.getMaintenanceAssetDetails(String(value.value)),
          maintenanceService.getMaintenanceAssetsByFANo(String(value.value))
        ]);
        if (asset) {
          setValue("asset", asset.number);
          setSelectedMaintenanceAsset(asset);
        }
        setMaintenanceCodes(codes);
        if (codes.length === 1) {
          setSelectedMaintenanceCode(codes[0]);
          setValue("type", codes[0].code);
        } else {
          setSelectedMaintenanceCode(null);
          setValue("type", "");
        }
      } catch (error) {
        setAlert("error", error as Error);
      } finally {
        setIsMaintenanceLoading(false);
      }
    }
  };

  const handleReset = () => {
    showConfirmation(
      "Are you sure?",
      "This will reset all form fields to their default values.",
      () => {
        setSelectedMaintenanceAsset(null);
        setMaintenanceCodes([]);
        setSelectedMaintenanceCode(null);
        reset(defaultValues);
      }
    );
  };

  const onSave = () => {
    saveForm(MAINTENANCE_STORAGE_KEY, getValues(), FORM_STORAGE_HOURS);
  };

  const onSubmit = async (data: MaintenanceFormData) => {
    if (process.env.NODE_ENV === "development") {
      console.log("All required fields validated successfully!");
    }
    setInitLoading(true);
    const state = { formData: data, section: "maintenance" };
    maintenanceService
      .postMaintenance(data)
      .then(() => {
        if (process.env.NODE_ENV === "development") {
          console.log("Form submitted:", data);
        }
        navigate("/post-success", { state });
      })
      .catch((error: unknown) => {
        setAlert("error", error as Error);
      })
      .finally(() => {
        setInitLoading(false);
      });
  };

  const mileageLabel = (() => {
    const u = selectedMaintenanceCode?.unitType?.toUpperCase();
    if (u === "MILE" || u === "MILES") return "Current Mileage";
    if (u === "HOUR" || u === "HOURS") return "Current Hours";
    return "Current Mileage / Hours";
  })();

  const isFuelRelated = selectedMaintenanceCode?.code === "FUEL";
  const hasOdometer = ["MILE", "MILES", "HOUR", "HOURS"].includes(
    selectedMaintenanceCode?.unitType?.toUpperCase() ?? ""
  );
  const mileageRequired = isFuelRelated && hasOdometer;

  const odometerUnit = (() => {
    const u = selectedMaintenanceCode?.unitType?.toUpperCase();
    return u === "HOUR" || u === "HOURS" ? "hours" : "miles";
  })();
  const odometerWarnThreshold = odometerUnit === "hours" ? ODOMETER_WARN_HOURS : ODOMETER_WARN_MILES;

  const priorOdometer: number | null = (() => {
    if (!hasOdometer || !selectedMaintenanceAsset?.history?.length) return null;
    const sorted = [...selectedMaintenanceAsset.history].sort(
      (a, b) => new Date(b.postingDate).getTime() - new Date(a.postingDate).getTime()
    );
    const val = sorted[0]?.meta;
    return typeof val === "number" && val > 0 ? val : null;
  })();

  const mileageValue = watch("mileage");
  const showOdometerWarning =
    priorOdometer !== null &&
    typeof mileageValue === "number" &&
    !isNaN(mileageValue) &&
    mileageValue > priorOdometer + odometerWarnThreshold;

  return (
    <CustomFormsLayout<MaintenanceFormData>
      notice={{
        formType: MAINTENANCE_STORAGE_KEY,
        onLoad: (data) => reset(data)
      }}
      headerOptions={{ button: { label: "reset", onClick: handleReset } }}
    >
      {initLoading && <LoadingSpinner />}
      {!initLoading && (
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={2}>
            <Stack>
              <TypeAhead
                {...register("asset", { required: "Maintenance asset is required." })}
                handleChange={setMaintenanceAsset}
                watch={watch}
                fieldName="asset"
                labelKey="description"
                valueKey="number"
                labelFormatter={numberDescriptionPostingGroupFormatter}
                valueList={maintenanceAssets}
                placeholder="Select an Asset..."
              />
              {errors.asset && <FormHelperText error>{errors.asset.message}</FormHelperText>}
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
                {...register("postingDate", { required: "Posting date is required" })}
                value={parseYYYYMMDDToLocalDate(watch("postingDate") || "")}
                onChange={(v) => setValue("postingDate", formatDateToYYYYMMDDNoTimestamp(v))}
                label="Posting Date"
                error={!!errors.postingDate}
                helperText={errors.postingDate?.message}
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
                <Typography variant="body2" color="text.secondary">
                  {selectedMaintenanceAsset.maintenanceDesc} — every{" "}
                  {selectedMaintenanceAsset.interval} {selectedMaintenanceAsset.unitType}
                </Typography>

                <Stack>
                  <TypeAhead
                    {...register("type", { required: "Maintenance code is required." })}
                    fieldName="type"
                    placeholder="Select a Maintenance Code..."
                    labelKey="maintenanceDesc"
                    valueKey="code"
                    valueList={maintenanceCodes}
                    watch={watch}
                    noOptionsText="No maintenance codes found for this asset."
                    handleChange={(option) => {
                      if (!option) {
                        setSelectedMaintenanceCode(null);
                        setValue("type", "");
                        return;
                      }
                      const code = maintenanceCodes.find((c) => c.code === String(option.value)) ?? null;
                      setSelectedMaintenanceCode(code);
                      setValue("type", String(option.value));
                    }}
                  />
                  {errors.type && <FormHelperText error>{errors.type.message}</FormHelperText>}
                </Stack>

                <Stack>
                  <TextField
                    value={watch("workHours") ?? ""}
                    {...register("workHours", {
                      required: "Work hours is required.",
                      min: { value: 0.01, message: "Must be greater than 0" },
                      valueAsNumber: true
                    })}
                    label="Work Hours"
                    placeholder="0.0"
                    type="number"
                    error={!!errors.workHours}
                    helperText={errors.workHours?.message}
                  />
                </Stack>

                <Stack>
                  <TextField
                    value={watch("mileage") ?? ""}
                    {...register("mileage", {
                      required: mileageRequired ? "Current Mileage / Hours is required." : false,
                      min: { value: 0, message: "Cannot be negative" },
                      valueAsNumber: true,
                      validate: (value) => {
                        if (priorOdometer === null || value === null || value === undefined || isNaN(value as number)) return true;
                        if ((value as number) < priorOdometer)
                          return `Must be at or above prior reading of ${priorOdometer.toLocaleString()}.`;
                        return true;
                      }
                    })}
                    label={mileageLabel}
                    placeholder={mileageLabel}
                    type="number"
                    required={mileageRequired}
                    error={!!errors.mileage}
                    helperText={errors.mileage?.message}
                  />
                  {priorOdometer !== null && (
                    <FormHelperText>
                      Prior reading: {priorOdometer.toLocaleString()} {odometerUnit}
                    </FormHelperText>
                  )}
                  {showOdometerWarning && (
                    <FormHelperText sx={{ color: "warning.main" }}>
                      This reading seems high. Please verify before submitting.
                    </FormHelperText>
                  )}
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
        <MaintenanceHistory
          selectedAsset={selectedMaintenanceAsset}
          isLoading={isMaintenanceLoading}
        />
      </Overlay>
    </CustomFormsLayout>
  );
}
