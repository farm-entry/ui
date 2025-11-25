import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { useConfirmationStore } from "../../store/confirmationStore";

export default function CustomConfirmation() {
  const { open, title, message, handleConfirm, handleCancel } = useConfirmationStore();

  return (
    <Dialog open={open} onClose={handleCancel}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{message}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel}>Cancel</Button>
        <Button onClick={handleConfirm} color="error" variant="contained">
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
}
