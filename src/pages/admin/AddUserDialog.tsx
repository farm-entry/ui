import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import AddUserForm, { AddUserFormData } from "./AddUserForm";

export type { AddUserFormData };

interface AddUserDialogProps {
  open: boolean;
  onClose: () => void;
  onAdd: (data: AddUserFormData) => Promise<void>;
}

export default function AddUserDialog({ open, onClose, onAdd }: AddUserDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add User</DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        <AddUserForm
          onSubmit={async (data) => { await onAdd(data); onClose(); }}
          onCancel={onClose}
        />
      </DialogContent>
    </Dialog>
  );
}
