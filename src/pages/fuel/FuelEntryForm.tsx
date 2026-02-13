import { Button, Divider, InputAdornment, Paper, Stack, Typography } from "@mui/material";
import { useFormContext } from "react-hook-form";
import LoadingSpinner from "../../components/framework/LoadingSpinner";
import { DatePicker, TextArea, TextField } from "../../components/inputs";
import { useFuelStore } from "../../store/fuelStore";
import { formatDateToYYYYMMDDNoTimestamp, parseYYYYMMDDToLocalDate } from "../../utils/date";
import { FuelFormData } from "../../store/types/fuel";

export default function FuelEntryForm() {
  const { selectedFuelAsset, isLoading: isFuelLoading, postFuel } = useFuelStore();

  const {
    register,
    watch,
    getValues,
    setValue,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useFormContext<FuelFormData>();

  const onSave = () => {
    const formData = getValues();
    console.log("Form data saved:", formData);
  };

  const onSubmit = async (data: FuelFormData) => {
    try {
      await postFuel(data);
      reset();
    } catch (error) {
      console.error("Error submitting fuel entry:", error);
    }
  };

  const gallons = watch("gallons");
  const totalCost =
    gallons && selectedFuelAsset ? (gallons * selectedFuelAsset.fuelCost).toFixed(2) : "0.00";

  return (
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

          {isFuelLoading && <LoadingSpinner />}

          {selectedFuelAsset && !isFuelLoading && (
            <>
              <Typography>
                Fuel Type: <strong>{selectedFuelAsset.fuelType}</strong>
              </Typography>

              <TextField
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
                <Button variant="contained" color="primary" fullWidth type="submit">
                  Submit
                </Button>
              </Stack>
            </>
          )}
        </Stack>
      </form>
    </Paper>
  );
}
