import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import { UserType } from "../../store/types/user";
import UserForm, { UserFormData } from "./UserForm";

export interface UserDialogSubmitData extends UserFormData {}

interface UserDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: UserDialogSubmitData) => Promise<void>;
  user?: UserType;
}

function toFormValues(user: UserType): Partial<UserFormData> {
  return {
    username: user.username,
    email: user.email,
    firstName: user.firstName ?? "",
    lastName: user.lastName ?? "",
    domains: user.domains ?? (user.domain ? [user.domain] : []),
    role: user.role ?? "user",
    isActive: (user as any).isActive ?? true,
    isEmailVerified: (user as any).isEmailVerified ?? false
  };
}

export default function UserDialog({ open, onClose, onSubmit, user }: UserDialogProps) {
  const editMode = Boolean(user);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{editMode ? `Edit — ${user!.username}` : "Add User"}</DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        <UserForm
          onSubmit={async (data) => {
            await onSubmit(data);
            onClose();
          }}
          onCancel={onClose}
          initialValues={user ? toFormValues(user) : undefined}
          editMode={editMode}
        />
      </DialogContent>
    </Dialog>
  );
}
