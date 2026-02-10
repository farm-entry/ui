import { Button, Divider, InputAdornment, Paper, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import LoadingSpinner from "../../components/framework/LoadingSpinner";
import { DatePicker, TextArea, TextField } from "../../components/inputs";
import { useFuelStore } from "../../store/fuelStore";
import { formatDateToYYYYMMDDNoTimestamp, parseYYYYMMDDToLocalDate } from "../../utils/date";

interface FuelFormData {
  activityDate: string;
  gallons: number;
  currentMiles: number;
  comments?: string;
}

export default function FuelEntryForm() {
  const [initLoading, setInitLoading] = useState(true);

  const { selectedFuelAsset, isLoading: isFuelLoading } = useFuelStore();

  const {
    register,
    watch,
    getValues,
    setValue,
    formState: { errors }
  } = useFormContext<FuelFormData>();

  useEffect(() => {
    setInitLoading(false);
  }, []);

  const onSave = () => {
    const formData = getValues();
    console.log("Form data saved:", formData);
  };

  const onSubmit = async (data: FuelFormData) => {
    console.log("Submitting fuel entry:", { data });
  };

  return (
    <>
      {initLoading && <LoadingSpinner />}
      {!initLoading && (
        <Paper elevation={0}>
          <Stack spacing={2}>
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

            <Divider />

            {!selectedFuelAsset && <Typography>Select a fuel asset to enter details.</Typography>}
            {isFuelLoading && <LoadingSpinner />}
            {selectedFuelAsset && !isFuelLoading && (
              <>
                <Typography>
                  Fuel Type: <strong>{selectedFuelAsset.fuelType}</strong>
                </Typography>

                <Stack>
                  <TextField
                    {...register("gallons", {
                      required: "Number of gallons field is required.",
                      min: { value: 0.01, message: "Must be greater than 0" }
                    })}
                    placeholder="# of Gallons"
                    type="number"
                    slotProps={{
                      input: {
                        endAdornment: (
                          <InputAdornment position="end">
                            {selectedFuelAsset.fuelCost.toFixed(2)}
                          </InputAdornment>
                        )
                      }
                    }}
                    error={!!errors.gallons}
                    helperText={errors.gallons?.message}
                  />

                  <Typography variant="body2" color="text.secondary">
                    Total Cost: ${(watch("gallons") * selectedFuelAsset.fuelCost).toFixed(2)}
                  </Typography>
                </Stack>

                <Stack>
                  <TextField
                    placeholder="Current Miles"
                    {...register("currentMiles", {
                      required: "Number of miles field is required.",
                      min: { value: 0, message: "Miles cannot be negative" }
                    })}
                    type="number"
                    error={!!errors.currentMiles}
                    helperText={errors.currentMiles?.message}
                  />
                </Stack>

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
        </Paper>
      )}
    </>
  );
}
