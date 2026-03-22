import { Logout } from "@mui/icons-material";
import {
  Button,
  Divider,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Stack,
  Typography
} from "@mui/material";
import { PageContainer } from "@toolpad/core";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { TextField } from "../../components/inputs";
import { useAuth } from "../../hooks/useAuth";
import CustomFormsLayout from "../../layouts/forms";
import { useGlobalAlertStore } from "../../store/globalAlertStore";
import { useUserStore } from "../../store/userStore";
import CustomPageContainer from "../../components/framework/CustomPageContainer";

interface ProfileFormData {
  firstName: string;
  lastName: string;
  email: string;
}

interface PasswordFormData {
  newPassword: string;
  confirmPassword: string;
}

export default () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { firstName, lastName, email, updateProfile, changePassword } = useUserStore();
  const { setAlert } = useGlobalAlertStore();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting, isDirty }
  } = useForm<ProfileFormData>({
    defaultValues: { firstName: firstName ?? "", lastName: lastName ?? "", email: email ?? "" }
  });

  const {
    register: registerPw,
    handleSubmit: handleSubmitPw,
    watch: watchPw,
    reset: resetPw,
    formState: { errors: errorsPw, isSubmitting: isSubmittingPw, isDirty: isDirtyPw }
  } = useForm<PasswordFormData>({
    defaultValues: { newPassword: "", confirmPassword: "" }
  });

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const onSubmitProfile = async (data: ProfileFormData) => {
    try {
      await updateProfile(data);
      setAlert("success", "Profile updated successfully.");
    } catch {
      setAlert("error", "Failed to update profile. Please try again.");
    }
  };

  const onSubmitPassword = async (data: PasswordFormData) => {
    try {
      await changePassword(data.newPassword);
      resetPw();
      setAlert("success", "Password updated successfully.");
    } catch {
      setAlert("error", "Failed to update password. Please try again.");
    }
  };

  return (
    <CustomPageContainer>
      <CustomFormsLayout>
        <Stack spacing={3}>
          <form onSubmit={handleSubmit(onSubmitProfile)}>
            <Stack spacing={3}>
              <Typography variant="subtitle2" color="text.secondary">
                Profile
              </Typography>

              <Stack direction="row" spacing={2}>
                <TextField
                  {...register("firstName")}
                  value={watch("firstName")}
                  placeholder="First Name"
                />
                <TextField
                  {...register("lastName")}
                  value={watch("lastName")}
                  placeholder="Last Name"
                />
              </Stack>

              <TextField
                {...register("email", {
                  required: "Email is required",
                  pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email" }
                })}
                value={watch("email")}
                placeholder="Email"
                error={!!errors.email}
                helperText={errors.email?.message}
              />

              <Button
                variant="contained"
                type="submit"
                disabled={isSubmitting || !isDirty}
                sx={{ alignSelf: "flex-end" }}
              >
                Save Changes
              </Button>
            </Stack>
          </form>

          <Divider />

          <form onSubmit={handleSubmitPw(onSubmitPassword)}>
            <Stack spacing={3}>
              <Typography variant="subtitle2" color="text.secondary">
                Change Password
              </Typography>

              <TextField
                {...registerPw("newPassword", {
                  required: "Password is required",
                  minLength: { value: 8, message: "Minimum 8 characters" }
                })}
                value={watchPw("newPassword")}
                placeholder="New Password"
                type="password"
                error={!!errorsPw.newPassword}
                helperText={errorsPw.newPassword?.message}
              />

              <TextField
                {...registerPw("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (v) => v === watchPw("newPassword") || "Passwords do not match"
                })}
                value={watchPw("confirmPassword")}
                placeholder="Confirm Password"
                type="password"
                error={!!errorsPw.confirmPassword}
                helperText={errorsPw.confirmPassword?.message}
              />

              <Button
                variant="contained"
                type="submit"
                disabled={isSubmittingPw || !isDirtyPw}
                sx={{ alignSelf: "flex-end" }}
              >
                Update Password
              </Button>
            </Stack>
          </form>

          <Divider />

          <MenuItem onClick={handleLogout}>
            <ListItemIcon>
              <Logout fontSize="small" />
            </ListItemIcon>
            <ListItemText>Logout</ListItemText>
          </MenuItem>
        </Stack>
      </CustomFormsLayout>
    </CustomPageContainer>
  );
};
