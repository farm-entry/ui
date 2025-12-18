import { Alert, Button, Stack } from "@mui/material";
import { useEffect, useState } from "react";
import { useConfirmationStore } from "../../store/confirmationStore";
import { useFormStorageStore } from "../../store/formStorageStore";

interface CustomNoticeProps<T> {
  formType: string;
  onLoad: (data: T) => void;
  message?: string;
}

export default function CustomNotice<T>({ formType, onLoad, message = "You have a saved form. Would you like to load it?" }: CustomNoticeProps<T>) {
  const [showAlert, setShowAlert] = useState(false);
  const { forms, getForm, removeForm } = useFormStorageStore();
  const showConfirmation = useConfirmationStore((state) => state.showConfirmation);

  useEffect(() => {
    console.log("Checking for saved form data...");
    const savedData = getForm<T>(formType);
    if (savedData) {
      setShowAlert(true);
    }
  }, [forms, formType, getForm]);

  const handleLoad = () => {
    const savedData = getForm<T>(formType);
    if (savedData) {
      onLoad(savedData);
    }
  };

  const handleDelete = () => {
    showConfirmation("Are you sure?", "This will permanently delete your saved form data.", () => {
      removeForm(formType);
      setShowAlert(false);
    });
  };

  if (!showAlert) return null;

  return (
    <Alert
      severity="info"
      sx={{ mb: 2 }}
      action={
        <Stack direction="row" spacing={1}>
          <Button color="inherit" size="small" onClick={handleLoad}>
            Load
          </Button>
          <Button color="inherit" size="small" onClick={handleDelete}>
            Delete
          </Button>
        </Stack>
      }
    >
      {message}
    </Alert>
  );
}
