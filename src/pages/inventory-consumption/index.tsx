import {
  Button,
  Divider,
  FormHelperText,
  Stack
} from "@mui/material";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import CustomConfirmation from "../../components/framework/CustomConfirmation";
import InventoryItemList from "./InventoryItemList";
import LoadingSpinner from "../../components/framework/LoadingSpinner";
import {
  DatePicker,
  TextArea,
  TypeAhead
} from "../../components/inputs";
import CustomFormsLayout from "../../layouts/forms";
import { useConfirmationStore } from "../../store/confirmationStore";
import { useInventoryStore } from "../../store/inventoryStore";
import {
  InventoryConsumptionFormData,
  InventoryLineItem
} from "../../store/types/inventory";
import { formatDateToYYYYMMDDNoTimestamp, parseYYYYMMDDToLocalDate } from "../../utils/date";

const defaultValues: InventoryConsumptionFormData = {
  form: "INVENTORY",
  location: "",
  group: "",
  postingDate: formatDateToYYYYMMDDNoTimestamp(new Date()),
  lineItems: [],
  comments: ""
};

export default function InventoryConsumptionPage() {
  const [lineItems, setLineItems] = useState<InventoryLineItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const showConfirmation = useConfirmationStore((state) => state.showConfirmation);
  const { locations, jobs, items, isLoading, getLocationsAndJobs, getItems, setItems } =
    useInventoryStore();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors }
  } = useForm<InventoryConsumptionFormData>({ defaultValues });

  const selectedLocation = watch("location");
  const selectedGroup = watch("group");

  useEffect(() => {
    getLocationsAndJobs();
  }, []);

  useEffect(() => {
    if (selectedLocation && selectedGroup) {
      setItems([]);
      setLineItems([]);
      getItems(selectedLocation, selectedGroup);
    } else {
      setItems([]);
    }
  }, [selectedLocation, selectedGroup]);

  const handleReset = () => {
    showConfirmation(
      "Are you sure?",
      "This will reset all form fields to their default values.",
      () => {
        reset(defaultValues);
        setLineItems([]);
        setItems([]);
      }
    );
  };

  const handleAddLineItem = (lineItem: InventoryLineItem) => {
    setLineItems((prev) => [...prev, lineItem]);
  };

  const handleRemoveLineItem = (index: number) => {
    setLineItems((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = (data: InventoryConsumptionFormData) => {
    if (lineItems.length === 0) return;
    setIsSubmitting(true);
    // TODO: wire up to service/store
    console.log("Submit", { ...data, lineItems });
    setIsSubmitting(false);
  };

  return (
    <CustomFormsLayout<InventoryConsumptionFormData>
      headerOptions={{ button: { label: "reset", onClick: handleReset } }}
    >
      {isSubmitting && <LoadingSpinner />}
      {!isSubmitting && (
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={2}>
            <Stack>
              <TypeAhead
                {...register("location", { required: "Source location is required" })}
                handleChange={(v) => setValue("location", v ? String(v.value) : "")}
                watch={watch}
                fieldName="location"
                labelKey="name"
                valueKey="code"
                valueList={locations}
                placeholder="Source Location"
              />
              {errors.location && <FormHelperText error>{errors.location.message}</FormHelperText>}
            </Stack>

            <Stack>
              <TypeAhead
                {...register("group", { required: "Group is required" })}
                handleChange={(v) => setValue("group", v ? String(v.value) : "")}
                watch={watch}
                fieldName="group"
                labelKey="description"
                valueKey="number"
                valueList={jobs}
                placeholder="Group"
              />
              {errors.group && <FormHelperText error>{errors.group.message}</FormHelperText>}
            </Stack>

            <Stack>
              <DatePicker
                {...register("postingDate", { required: "Activity date is required" })}
                value={parseYYYYMMDDToLocalDate(watch("postingDate") || "")}
                onChange={(v) => setValue("postingDate", formatDateToYYYYMMDDNoTimestamp(v))}
                label="Activity Date"
                error={!!errors.postingDate}
                helperText={errors.postingDate?.message}
              />
            </Stack>

            <Divider />

            <InventoryItemList
              lineItems={lineItems}
              items={items}
              onAdd={handleAddLineItem}
              onRemove={handleRemoveLineItem}
            />

            <Divider />

            <TextArea
              {...register("comments", {
                maxLength: { value: 100, message: "Comments cannot exceed 100 characters" }
              })}
              value={watch("comments")}
              placeholder="Comments"
              label="Comments"
              error={!!errors.comments}
              helperText={errors.comments?.message}
            />

            <Stack direction="row" spacing={2}>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                type="submit"
                disabled={lineItems.length === 0}
              >
                Submit
              </Button>
            </Stack>
          </Stack>
        </form>
      )}

      <CustomConfirmation />
    </CustomFormsLayout>
  );
}
