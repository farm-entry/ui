import { Button, Divider, FormHelperText, InputAdornment, Stack, Typography } from "@mui/material";
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
import { fuelService } from "../../services/fuelApi";
import { useConfirmationStore } from "../../store/confirmationStore";
import { useFormStorageStore } from "../../store/formStorageStore";
import { useFuelStore } from "../../store/fuelStore";
import { useGlobalAlertStore } from "../../store/globalAlertStore";
import { FuelFormData } from "../../store/types/fuel";
import { formatDateToYYYYMMDDNoTimestamp, parseYYYYMMDDToLocalDate } from "../../utils/date";
import { toCamelCase } from "../../utils/strings";
import FuelHistory from "./FuelHistory";

const FUEL_STORAGE_KEY = "fuel-form";
const FORM_STORAGE_HOURS = 48;

const defaultValues: FuelFormData = {
  form: "FUEL",
  asset: "",
  postingDate: new Date().toLocaleDateString("en-CA"),
  gallons: null,
  mileage: null,
  comments: ""
};

export default function FuelPage() {
  const navigate = useNavigate();
  const [initLoading, setInitLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [overlayOpen, setOverlayOpen] = useState(false);

  const {
    isLoading: isFuelLoading,
    fuelAssets,
    selectedFuelAsset,
    getFuelAssetDetails,
    setSelectedFuelAsset,
    getFuelAssets
  } = useFuelStore();

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
  } = useForm<FuelFormData>({ defaultValues });

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

  const onSave = () => {
    const formData = getValues();
    saveForm(FUEL_STORAGE_KEY, formData, FORM_STORAGE_HOURS);
  };

  const onSubmit = async (data: FuelFormData) => {
    setIsSubmitting(true);
    const state = { formData: data, section: "fuel" };
    fuelService
      .postFuel(data)
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
        setIsSubmitting(false);
      });
  };

  const gallons = watch("gallons");
  const totalCost =
    gallons && selectedFuelAsset ? (gallons * selectedFuelAsset.fuelCost).toFixed(2) : "0.00";

  const mileageUnitLabel = () => {
    const label = toCamelCase(selectedFuelAsset?.unitOfMeasureCode || "miles");
    if (selectedFuelAsset?.unitOfMeasureCode.toLowerCase() === "gal") return "Gallons";
    return label + (label.endsWith("s") ? "" : "s");
  };

  return (
    <CustomFormsLayout<FuelFormData>
      notice={{
        formType: FUEL_STORAGE_KEY,
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
                {...register("asset", { required: "Fuel asset is required." })}
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
            {selectedFuelAsset && (
              <Button variant="outlined" fullWidth onClick={() => setOverlayOpen(true)}>
                Fuel History
              </Button>
            )}
            <Divider />
            <Typography>Activity Details</Typography>
            <Stack>
              <DatePicker
                {...register("postingDate", { required: "Posting date is required" })}
                value={parseYYYYMMDDToLocalDate(watch("postingDate") || "")}
                onChange={(v) => setValue("postingDate", formatDateToYYYYMMDDNoTimestamp(v))}
                label="Activity Date"
                error={!!errors.postingDate}
                helperText={errors.postingDate?.message}
              />
            </Stack>

            {!selectedFuelAsset && !isFuelLoading && (
              <Typography align="center" sx={{ pt: 2 }}>
                Select a fuel asset to enter details.
              </Typography>
            )}

            {isFuelLoading && <LoadingSpinner />}

            {selectedFuelAsset && !isFuelLoading && (
              <>
                <Divider />
                <Typography>
                  Fuel Type: <strong>{selectedFuelAsset.fuelType}</strong>
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
                            ${selectedFuelAsset.fuelCost.toFixed(2)}
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
                    value={watch("mileage")}
                    placeholder={`Current Mileage/${mileageUnitLabel()}`}
                    {...register("mileage", {
                      required: `Mileage/${mileageUnitLabel()} field is required.`,
                      min: {
                        value: 0,
                        message: `Mileage/${mileageUnitLabel()} cannot be negative`
                      },
                      valueAsNumber: true
                    })}
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

      <Overlay open={overlayOpen} onClose={() => setOverlayOpen(false)} title="Fuel History">
        <FuelHistory />
      </Overlay>

      <CustomConfirmation />
    </CustomFormsLayout>
  );
}
