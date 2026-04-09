import { Button, Divider, FormHelperText, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import CustomConfirmation from "../../components/framework/CustomConfirmation";
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
import { MaintenanceAsset, MaintenanceAssetDetails, MaintenanceFormData } from "../../store/types/maintenance";
import { formatDateToYYYYMMDDNoTimestamp, parseYYYYMMDDToLocalDate } from "../../utils/date";
import MaintenanceHistory from "./MaintenanceHistory";

const MAINTENANCE_STORAGE_KEY = "maintenance-form";
const FORM_STORAGE_HOURS = 48;

const defaultValues: MaintenanceFormData = {
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
  const [selectedMaintenanceAsset, setSelectedMaintenanceAsset] = useState<MaintenanceAssetDetails | null>(null);
  const [isMaintenanceLoading, setIsMaintenanceLoading] = useState(false);

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
      setValue("asset", "");
      setValue("type", "");
      return;
    }

    if (value.value && value.value !== selectedMaintenanceAsset?.number) {
      setIsMaintenanceLoading(true);
      const asset = await maintenanceService.getMaintenanceAssetDetails(String(value.value));
      setIsMaintenanceLoading(false);
      if (asset) {
        setValue("asset", asset.number);
        setValue("type", asset.code);
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

  const unitLabel = selectedMaintenanceAsset?.unitType
    ? selectedMaintenanceAsset.unitType.charAt(0).toUpperCase() +
      selectedMaintenanceAsset.unitType.slice(1).toLowerCase()
    : "Miles";

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
                      min: { value: 0, message: "Cannot be negative" },
                      valueAsNumber: true
                    })}
                    label={`Current ${unitLabel}`}
                    placeholder="0"
                    type="number"
                    error={!!errors.mileage}
                    helperText={errors.mileage?.message}
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
        <MaintenanceHistory selectedAsset={selectedMaintenanceAsset} isLoading={isMaintenanceLoading} />
      </Overlay>

      <CustomConfirmation />
    </CustomFormsLayout>
  );
}
