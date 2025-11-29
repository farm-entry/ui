import { Alert, Button, Stack } from "@mui/material";
import { useEffect, useState } from "react";
import { useConfirmationStore } from "../../store/confirmationStore";
import { getWithTTL } from "../../utils/localStorage";

interface CustomNoticeProps<T> {
  storageKey: string;
  onLoad: (data: T) => void;
  message?: string;
}

export default function CustomNotice<T>({ storageKey, onLoad, message = "You have a saved form. Would you like to load it?" }: CustomNoticeProps<T>) {
  const [showAlert, setShowAlert] = useState(false);

  const showConfirmation = useConfirmationStore((state) => state.showConfirmation);

  useEffect(() => {
    const savedData = getWithTTL<T>(storageKey);
    if (savedData) {
      setShowAlert(true);
    }
  }, []);

  useEffect(() => {
    const savedData = getWithTTL<T>(storageKey);
    if (savedData) {
      setShowAlert(true);
    }
  }, [storageKey]);

  const handleLoad = () => {
    const savedData = getWithTTL<T>(storageKey);
    if (savedData) {
      onLoad(savedData);
      //   setShowAlert(false);
    }
  };

  const handleDelete = () => {
    showConfirmation("Are you sure?", "This will permanently delete your saved form data.", () => {
      localStorage.removeItem(storageKey);
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
