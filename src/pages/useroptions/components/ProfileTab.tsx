import { Button, Stack } from "@mui/material";
import { useForm } from "react-hook-form";
import { TextField } from "../../../components/inputs";
import { useGlobalAlertStore } from "../../../store/globalAlertStore";
import { useUserStore } from "../../../store/userStore";

// ── Types ────────────────────────────────────────────────────────────────────

export interface ProfileFormData {
  firstName: string;
  lastName: string;
  email: string;
}

// ── Profile Tab ──────────────────────────────────────────────────────────────

export function ProfileTab() {
  const { firstName, lastName, email, updateProfile } = useUserStore();
  const { setAlert } = useGlobalAlertStore();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting, isDirty }
  } = useForm<ProfileFormData>({
    defaultValues: {
      firstName: firstName ?? "",
      lastName: lastName ?? "",
      email: email ?? ""
    }
  });

  const onSubmitProfile = async (data: ProfileFormData) => {
    try {
      await updateProfile(data);
      setAlert("success", "Profile updated successfully.");
    } catch {
      setAlert("error", "Failed to update profile. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmitProfile)}>
      <Stack spacing={3}>
        <Stack direction="row" spacing={2}>
          <TextField
            {...register("firstName")}
            value={watch("firstName")}
            placeholder="First Name"
          />
          <TextField {...register("lastName")} value={watch("lastName")} placeholder="Last Name" />
        </Stack>

        <TextField
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Invalid email"
            }
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
  );
}
