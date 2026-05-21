import { Button, Card, Stack } from "@mui/material";
import { LockOutlined } from "@mui/icons-material";
import { useForm } from "react-hook-form";
import { TextField } from "../../../components/inputs";
import CustomHeader from "../../../components/framework/CustomHeader";
import { useGlobalAlertStore } from "../../../store/globalAlertStore";
import { useUserStore } from "../../../store/userStore";

// ── Types ────────────────────────────────────────────────────────────────────

export interface PasswordFormData {
  newPassword: string;
  confirmPassword: string;
}

// ── Password Tab ─────────────────────────────────────────────────────────────

export function PasswordTab() {
  const { changePassword } = useUserStore();
  const { setAlert } = useGlobalAlertStore();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting, isDirty }
  } = useForm<PasswordFormData>({
    defaultValues: { newPassword: "", confirmPassword: "" }
  });

  const onSubmitPassword = async (data: PasswordFormData) => {
    try {
      await changePassword(data.newPassword);
      reset();
      setAlert("success", "Password updated successfully.");
    } catch {
      setAlert("error", "Failed to update password. Please try again.");
    }
  };

  return (
    <Card variant="outlined" sx={{ p: 3 }}>
      <form onSubmit={handleSubmit(onSubmitPassword)}>
        <CustomHeader icon={LockOutlined} title="Change Password" />
        <Stack spacing={3}>
          <TextField
            {...register("newPassword", {
              required: "Password is required",
              minLength: { value: 8, message: "Minimum 8 characters" }
            })}
            value={watch("newPassword")}
            placeholder="New Password"
            type="password"
            error={!!errors.newPassword}
            helperText={errors.newPassword?.message}
          />

          <TextField
            {...register("confirmPassword", {
              required: "Please confirm your password",
              validate: (v) => v === watch("newPassword") || "Passwords do not match"
            })}
            value={watch("confirmPassword")}
            placeholder="Confirm Password"
            type="password"
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword?.message}
          />

          <Button
            variant="contained"
            type="submit"
            disabled={isSubmitting || !isDirty}
            sx={{ alignSelf: "flex-end" }}
          >
            Update Password
          </Button>
        </Stack>
      </form>
    </Card>
  );
}
