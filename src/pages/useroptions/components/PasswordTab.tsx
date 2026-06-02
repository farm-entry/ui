import { useState } from "react";
import { Box, Button, Card, CircularProgress, IconButton, LinearProgress, Stack, TextField, Typography } from "@mui/material";
import { LockOutlined, Visibility, VisibilityOff } from "@mui/icons-material";
import { useForm } from "react-hook-form";
import { useGlobalAlertStore } from "../../../store/globalAlertStore";
import { useUserStore } from "../../../store/userStore";

export interface PasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

function getPasswordStrength(pwd: string): {
  value: number;
  color: "error" | "warning" | "info" | "success";
  label: string;
} {
  let score = 0;
  if (pwd.length >= 8) score += 25;
  if (pwd.length >= 12) score += 25;
  if (/[A-Z]/.test(pwd) && /[a-z]/.test(pwd)) score += 25;
  if (/\d/.test(pwd) && /[^A-Za-z0-9]/.test(pwd)) score += 25;
  return {
    value: score,
    color: score <= 25 ? "error" : score <= 50 ? "warning" : score <= 75 ? "info" : "success",
    label: score <= 25 ? "Weak" : score <= 50 ? "Fair" : score <= 75 ? "Good" : "Strong",
  };
}

export function PasswordTab() {
  const { changePassword } = useUserStore();
  const { setAlert } = useGlobalAlertStore();

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<PasswordFormData>({
    defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
  });

  const newPasswordValue = watch("newPassword");
  const passwordStrength = newPasswordValue ? getPasswordStrength(newPasswordValue) : null;

  const onSubmitPassword = async (data: PasswordFormData) => {
    try {
      await changePassword({ currentPassword: data.currentPassword, newPassword: data.newPassword });
      reset();
      setAlert("success", "Password updated successfully.");
    } catch {
      setAlert("error", "Failed to update password. Please try again.");
    }
  };

  return (
    <Card variant="outlined" sx={{ p: 3 }}>
      <form onSubmit={handleSubmit(onSubmitPassword)}>
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
          <LockOutlined color="primary" sx={{ fontSize: 24 }} />
          <Typography variant="h6">Change Password</Typography>
        </Stack>
        <Stack spacing={3}>
          <TextField
            {...register("currentPassword", { required: "Current password is required" })}
            value={watch("currentPassword")}
            label="Current Password"
            placeholder=""
            type={showCurrent ? "text" : "password"}
            error={!!errors.currentPassword}
            helperText={errors.currentPassword?.message}
            fullWidth
            slotProps={{
              input: {
                endAdornment: (
                  <IconButton
                    aria-label="Toggle current password visibility"
                    onClick={() => setShowCurrent((prev) => !prev)}
                    edge="end"
                  >
                    {showCurrent ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                ),
              },
            }}
          />

          <TextField
            {...register("newPassword", {
              required: "Password is required",
              minLength: { value: 8, message: "Minimum 8 characters" },
            })}
            value={newPasswordValue}
            label="New Password"
            placeholder=""
            type={showNew ? "text" : "password"}
            error={!!errors.newPassword}
            helperText={errors.newPassword?.message}
            fullWidth
            slotProps={{
              input: {
                endAdornment: (
                  <IconButton
                    aria-label="Toggle new password visibility"
                    onClick={() => setShowNew((prev) => !prev)}
                    edge="end"
                  >
                    {showNew ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                ),
              },
            }}
          />

          {passwordStrength && (
            <Box sx={{ mt: 0.5 }}>
              <LinearProgress
                variant="determinate"
                value={passwordStrength.value}
                color={passwordStrength.color}
                sx={{ height: 4, borderRadius: 1 }}
              />
              <Typography variant="caption" color="text.secondary" sx={{ mt: 0.25, display: "block" }}>
                {passwordStrength.label}
              </Typography>
            </Box>
          )}

          <TextField
            {...register("confirmPassword", {
              required: "Please confirm your password",
              validate: (v) => v === watch("newPassword") || "Passwords do not match",
            })}
            value={watch("confirmPassword")}
            label="Confirm Password"
            placeholder=""
            type={showConfirm ? "text" : "password"}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword?.message}
            fullWidth
            slotProps={{
              input: {
                endAdornment: (
                  <IconButton
                    aria-label="Toggle confirm password visibility"
                    onClick={() => setShowConfirm((prev) => !prev)}
                    edge="end"
                  >
                    {showConfirm ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                ),
              },
            }}
          />

          <Button
            variant="contained"
            type="submit"
            disabled={!isDirty || isSubmitting}
            startIcon={isSubmitting ? <CircularProgress size={16} /> : undefined}
            sx={{ alignSelf: "flex-end" }}
          >
            {isSubmitting ? "Saving…" : "Update Password"}
          </Button>
        </Stack>
      </form>
    </Card>
  );
}
