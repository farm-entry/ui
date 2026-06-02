import { Avatar, Button, Card, CircularProgress, Stack, TextField, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { useGlobalAlertStore } from "../../../store/globalAlertStore";
import { useUserStore } from "../../../store/userStore";

export interface ProfileFormData {
  firstName: string;
  lastName: string;
  email: string;
}

function deriveInitials(firstName: string, lastName: string, email: string): string {
  const first = firstName.trim();
  const last = lastName.trim();
  if (first && last) return `${first[0]}${last[0]}`.toUpperCase();
  if (first) return first[0].toUpperCase();
  const trimmedEmail = email.trim();
  if (trimmedEmail) return trimmedEmail[0].toUpperCase();
  return "?";
}

export function ProfileTab() {
  const { firstName, lastName, email, updateProfile } = useUserStore();
  const { setAlert } = useGlobalAlertStore();

  const {
    register,
    handleSubmit,
    watch,
    formState: { isSubmitting, isDirty }
  } = useForm<ProfileFormData>({
    defaultValues: {
      firstName: firstName ?? "",
      lastName: lastName ?? "",
      email: email ?? ""
    }
  });

  const watchedFirstName = watch("firstName");
  const watchedLastName = watch("lastName");
  const watchedEmail = watch("email");

  const initials = deriveInitials(watchedFirstName, watchedLastName, watchedEmail);

  const onSubmitProfile = async (data: ProfileFormData) => {
    try {
      await updateProfile({ firstName: data.firstName, lastName: data.lastName });
      setAlert("success", "Profile updated successfully.");
    } catch {
      setAlert("error", "Failed to update profile. Please try again.");
    }
  };

  return (
    <Card variant="outlined" sx={{ p: 3 }}>
      <form onSubmit={handleSubmit(onSubmitProfile)}>
        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
          <Avatar aria-hidden="true" sx={{ bgcolor: "primary.main", width: 40, height: 40, fontSize: 16, fontWeight: 600 }}>
            {initials}
          </Avatar>
          <Typography variant="h6">Profile</Typography>
        </Stack>
        <Stack spacing={3}>
          <TextField
            {...register("firstName")}
            value={watchedFirstName}
            label="First Name"
            placeholder=""
            fullWidth
          />
          <TextField
            {...register("lastName")}
            value={watchedLastName}
            label="Last Name"
            placeholder=""
            fullWidth
          />
          <TextField
            {...register("email")}
            value={watchedEmail}
            label="Email"
            placeholder=""
            slotProps={{ input: { readOnly: true } }}
            helperText="Contact your administrator to change your email address."
            sx={{ "& .MuiInputBase-input": { color: "text.disabled" } }}
            fullWidth
          />
          <Button
            variant="contained"
            type="submit"
            disabled={isSubmitting || !isDirty}
            startIcon={isSubmitting ? <CircularProgress size={16} /> : undefined}
            sx={{ alignSelf: "flex-end" }}
          >
            {isSubmitting ? "Saving…" : "Save Changes"}
          </Button>
        </Stack>
      </form>
    </Card>
  );
}
