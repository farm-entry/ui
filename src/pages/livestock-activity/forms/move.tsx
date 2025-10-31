import { SwapVert } from "@mui/icons-material";
import { Button, Divider, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import CustomHeader from "../../../components/framework/CustomHeader";
import { DatePicker, TextArea, TextField, TypeAhead, TypeAheadOption } from "../../../components/inputs";
import DenseTable from "../../../components/table/DenseTable";
import CustomFormsLayout from "../../../layouts/forms";
import { PostingGroup } from "../../../services/postingGroupsApi";
import { usePostingGroupsStore } from "../../../store/postingGroupsStore";
import { useLivestockActivityStore } from "../../../store/livestockActivityStore";

interface MoveFormData {
  fromJob: string | number | null;
  toJob: string | number | null;
  event: string | number | null;
  postingDate: Date | null;
  quantity: number | "";
  smallLivestockQuantity: number | "";
  totalWeight: number | "";
  comments: string;
}

const defaultValues: MoveFormData = {
  fromJob: null,
  toJob: null,
  event: null,
  postingDate: null,
  quantity: "",
  smallLivestockQuantity: "",
  totalWeight: "",
  comments: "",
};

const columns = [
  { field: "postingGroup", headerName: "Posting Group", flex: 2 },
  { field: "inventory", headerName: "Inventory", flex: 1 },
  { field: "deads", headerName: "Deads", flex: 1 },
];

export default function MovePage() {
  const { getPostingGroups, postingGroups } = usePostingGroupsStore();
  const { getEventTypes, eventTypes } = useLivestockActivityStore();
  const [deads, setDeads] = useState<{ toJob: number; fromJob: number }>({ toJob: 0, fromJob: 0 });
  const [inventory, setInventory] = useState<{ toJob: number; fromJob: number }>({ toJob: 0, fromJob: 0 });

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<MoveFormData>({
    defaultValues: defaultValues,
  });

  useEffect(() => {
    getPostingGroups();
    getEventTypes();
  }, []);

  const onSubmit = (data: MoveFormData) => {
    console.log("Form submitted:", data);
  };

  const setJob = (value: any, label: "fromJob" | "toJob") => {
    const job = postingGroups.find((pg) => pg.No === value?.value);
    if (job && value && value.value) {
      setValue(label, value.value);
      setDeads({ ...deads, [label]: job.Dead_Quantity } as any);
      setInventory({ ...inventory, [label]: job.Inventory_Left } as any);
    }
  };

  const formatLabel = (job: PostingGroup) => `${job.No} ${job.Description}`;
  return (
    <CustomFormsLayout>
      <CustomHeader icon={SwapVert} title="Move " />
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2}>
          <TypeAhead
            {...register("fromJob")}
            onChange={(v) => setJob(v, "fromJob")}
            options={postingGroups.map((job) => ({ label: formatLabel(job), value: job.No, deads: job.Dead_Quantity, inventory: job.Inventory_Left }) as TypeAheadOption)}
            label="From"
          />
          <TypeAhead
            {...register("toJob")}
            onChange={(v) => setJob(v, "toJob")}
            options={postingGroups.map((job) => ({ label: formatLabel(job), value: job.No, deads: job.Dead_Quantity, inventory: job.Inventory_Left }) as TypeAheadOption)}
            label="To"
          />
          {watch("fromJob") && watch("toJob") && (
            <DenseTable
              rows={[
                { name: "fromJob", postingGroup: watch("fromJob"), inventory: inventory.fromJob, deads: deads.fromJob },
                { name: "toJob", postingGroup: watch("toJob"), inventory: inventory.toJob, deads: deads.toJob },
              ]}
              columns={columns}
            />
          )}
          <Divider />
          <Typography>Event Details</Typography>
          <TypeAhead
            {...register("event")}
            onChange={(v) => v && v.value && setValue("event", v.value)}
            options={eventTypes.map((event) => ({ label: event.description, value: event.code }))}
            label="Event Name"
          />
          <DatePicker {...register("postingDate")} onChange={(v) => setValue("postingDate", v)} label="Posting Date" />
          <Divider />
          <Typography>Quantity</Typography>
          <Stack spacing={2} direction="row">
            <TextField label="Total" type="number" {...register("quantity")} />
            <TextField label="Smalls" type="number" {...register("smallLivestockQuantity")} />
          </Stack>
          <TextField {...register("totalWeight")} label="Total Weight" type="number" />
          <Divider />
          <TextArea {...register("comments")} label="Comments" type="text" />
          <Button variant="text" color="primary" fullWidth onClick={() => reset(defaultValues)}>
            Reset
          </Button>
          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button variant="outlined" color="primary" fullWidth>
              Save
            </Button>
            <Button variant="contained" color="primary" fullWidth type="submit">
              Submit
            </Button>
          </Stack>
        </Stack>
      </form>
    </CustomFormsLayout>
  );
}
