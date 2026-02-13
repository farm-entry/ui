import { Button, Divider, InputAdornment, Paper, Stack, Typography } from "@mui/material";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { useNavigate } from "react-router";
import LoadingSpinner from "../../components/framework/LoadingSpinner";
import { DatePicker, TextArea, TextField } from "../../components/inputs";
import { fuelService } from "../../services/fuelApi";
import { useFormStorageStore } from "../../store/formStorageStore";
import { useGlobalAlertStore } from "../../store/globalAlertStore";
import { formatDateToYYYYMMDDNoTimestamp, parseYYYYMMDDToLocalDate } from "../../utils/date";
import { FuelFormData } from "../../store/types/fuel";
import { useFuelStore } from "../../store/fuelStore";

const FUEL_STORAGE_KEY = "fuel-form";
const FORM_STORAGE_HOURS = 48;

export default function FuelEntryForm() {
  const navigate = useNavigate();
  const { selectedFuelAsset } = useFuelStore();
  const { setAlert } = useGlobalAlertStore();
  const { saveForm } = useFormStorageStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    watch,
    getValues,
    setValue,
    handleSubmit,
    formState: { errors }
  } = useFormContext<FuelFormData>();

  const onSave = () => {
    const formData = getValues();
    saveForm(FUEL_STORAGE_KEY, formData, FORM_STORAGE_HOURS);
  };

  const onSubmit = async (data: FuelFormData) => {
    if (process.env.NODE_ENV === "development") {
      console.log("All required fields validated successfully!");
    }
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
      .catch((error: Error) => {
        console.error("Unable to post form.");
        const errorInfo = {
          code: (error as any).code || "FUEL_SUBMISSION_ERROR",
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
    gallons && selectedFuelAsset ? (gallons * selectedFuelAsset.fuelCost).toFixed(2) : "0.00";

  return (
    <>
      {isSubmitting && <LoadingSpinner />}
      {!isSubmitting && (
        <Paper elevation={0}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={2}>
              <DatePicker
                {...register("postingDate", { required: "Posting date is required" })}
                value={parseYYYYMMDDToLocalDate(watch("postingDate") || "")}
                onChange={(v) => setValue("postingDate", formatDateToYYYYMMDDNoTimestamp(v))}
                label="Activity Date"
                error={!!errors.postingDate}
                helperText={errors.postingDate?.message}
              />

              <Divider />

              {!selectedFuelAsset && (
                <Typography align="center" sx={{ pt: 2 }}>
                  Select a fuel asset to enter details.
                </Typography>
              )}

              {selectedFuelAsset && (
                <>
                  <Typography>
                    Fuel Type: <strong>{selectedFuelAsset.fuelType}</strong>
                  </Typography>

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

                  <Typography variant="body2" color="text.secondary">
                    Total Cost: ${totalCost}
                  </Typography>

                  <TextField
                    value={watch("mileage")}
                    placeholder="Current Miles"
                    {...register("mileage", {
                      required: "Number of miles field is required.",
                      min: { value: 0, message: "Miles cannot be negative" },
                      valueAsNumber: true
                    })}
                    type="number"
                    error={!!errors.mileage}
                    helperText={errors.mileage?.message}
                  />

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

                  <Stack direction="row" spacing={2} justifyContent="flex-end">
                    <Button variant="outlined" color="primary" fullWidth onClick={onSave}>
                      Save
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                      type="submit"
                      disabled={isSubmitting}
                    >
                      Submit
                    </Button>
                  </Stack>
                </>
              )}
            </Stack>
          </form>
        </Paper>
      )}
    </>
  );
}
