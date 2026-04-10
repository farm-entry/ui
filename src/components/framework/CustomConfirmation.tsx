import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from "@mui/material";
import { useConfirmationStore } from "../../store/confirmationStore";

export default function CustomConfirmation() {
  const { open, title, message, handleConfirm, handleCancel } = useConfirmationStore();

  return (
    <Dialog open={open} onClose={handleCancel} disableRestoreFocus>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent sx={{ p: 2 }}>
        <DialogContentText>{message}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel} autoFocus color="error" variant="contained">
          Cancel
        </Button>
        <Button onClick={handleConfirm}>Confirm</Button>
      </DialogActions>
    </Dialog>
  );
}
