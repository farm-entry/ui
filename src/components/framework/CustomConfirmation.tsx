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
    <Dialog
      open={open}
      onClose={handleCancel}
      disableRestoreFocus
      aria-labelledby="confirmation-dialog-title"
      aria-describedby="confirmation-dialog-description"
      role="alertdialog"
    >
      <DialogTitle id="confirmation-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="confirmation-dialog-description">{message}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel} autoFocus>
          Cancel
        </Button>
        <Button onClick={handleConfirm} color="error" variant="outlined">
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
}
