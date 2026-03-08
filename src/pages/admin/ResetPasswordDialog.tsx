import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField
} from "@mui/material";
import { useState } from "react";
import { UserType } from "../../store/types/user";

interface ResetPasswordDialogProps {
  user: UserType | null;
  onClose: () => void;
  onReset: (username: string, password: string) => Promise<void>;
}

export default function ResetPasswordDialog({ user, onClose, onReset }: ResetPasswordDialogProps) {
  const [password, setPassword] = useState("");

  const handleReset = async () => {
    await onReset(user!.username, password);
    setPassword("");
    onClose();
  };

  return (
    <Dialog open={Boolean(user)} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Reset Password — {user?.username}</DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        <TextField
          label="New Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          size="small"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleReset} disabled={!password}>
          Reset
        </Button>
      </DialogActions>
    </Dialog>
  );
}
