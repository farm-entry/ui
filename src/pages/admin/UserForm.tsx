import {
  Box,
  Button,
  Checkbox,
  Chip,
  FormControl,
  FormControlLabel,
  FormHelperText,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
  Switch,
  Typography,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { TextField } from "../../components/inputs";
import { useAdminStore } from "../../store/adminStore";
import { RolesType } from "../../store/types/user";

export interface UserFormData {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  domains: string[];
  role: RolesType;
  isActive: boolean;
  isEmailVerified: boolean;
}

interface UserFormProps {
  onSubmit: (data: UserFormData) => Promise<void>;
  onCancel: () => void;
  initialValues?: Partial<UserFormData>;
  editMode?: boolean;
}

const ROLE_OPTIONS = [
  { value: "user", label: "User" },
  { value: "admin", label: "Admin" },
  { value: "app_admin", label: "App Admin" }
];

export default function UserForm({
  onSubmit,
  onCancel,
  initialValues,
  editMode = false
}: UserFormProps) {
  const { domains: availableDomains } = useAdminStore();

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm<UserFormData>({
    defaultValues: {
      username: "",
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      domains: [],
      role: "user",
      isActive: true,
      isEmailVerified: false,
      ...initialValues
    }
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        <Typography variant="subtitle2" color="text.secondary">
          Account
        </Typography>

        <TextField
          {...register("username", { required: !editMode && "Username is required" })}
          value={watch("username")}
          placeholder="Username"
          disabled={editMode}
          error={!!errors.username}
          helperText={errors.username?.message}
        />

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

        {!editMode && (
          <TextField
            {...register("password", {
              required: "Password is required",
              minLength: { value: 8, message: "Minimum 8 characters" }
            })}
            value={watch("password")}
            placeholder="Password"
            type="password"
            error={!!errors.password}
            helperText={errors.password?.message}
          />
        )}

        <Typography variant="subtitle2" color="text.secondary">
          Profile
        </Typography>

        <Stack direction="row" spacing={2}>
          <TextField
            {...register("firstName")}
            value={watch("firstName")}
            placeholder="First Name"
          />
          <TextField {...register("lastName")} value={watch("lastName")} placeholder="Last Name" />
        </Stack>

        <Typography variant="subtitle2" color="text.secondary">
          Permissions
        </Typography>

        {/* Multi-select: Companies / Domains */}
        <Controller
          name="domains"
          control={control}
          rules={{ validate: (v) => v.length > 0 || "At least one company is required" }}
          render={({ field }) => (
            <FormControl fullWidth error={!!errors.domains}>
              <InputLabel id="domains-label">Companies</InputLabel>
              <Select
                labelId="domains-label"
                multiple
                value={field.value}
                onChange={(e) => field.onChange(e.target.value as string[])}
                input={<OutlinedInput label="Companies" />}
                renderValue={(selected) => (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {(selected as string[]).map((val) => (
                      <Chip key={val} label={val} size="small" />
                    ))}
                  </Box>
                )}
              >
                {availableDomains.map((d) => (
                  <MenuItem key={d} value={d}>
                    <Checkbox checked={field.value.includes(d)} />
                    <ListItemText primary={d} />
                  </MenuItem>
                ))}
              </Select>
              {errors.domains && (
                <FormHelperText>{(errors.domains as any)?.message}</FormHelperText>
              )}
            </FormControl>
          )}
        />

        <Controller
          name="role"
          control={control}
          rules={{ required: "Role is required" }}
          render={({ field }) => (
            <FormControl fullWidth error={!!errors.role}>
              <InputLabel id="role-label">Role</InputLabel>
              <Select
                labelId="role-label"
                value={field.value ?? ""}
                onChange={(e) => field.onChange(e.target.value)}
                input={<OutlinedInput label="Role" />}
              >
                {ROLE_OPTIONS.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </MenuItem>
                ))}
              </Select>
              {errors.role && <FormHelperText>{errors.role.message}</FormHelperText>}
            </FormControl>
          )}
        />

        <Box>
          <Controller
            name="isActive"
            control={control}
            render={({ field }) => (
              <FormControlLabel
                control={<Switch checked={field.value} onChange={field.onChange} />}
                label="Active"
              />
            )}
          />
          <Controller
            name="isEmailVerified"
            control={control}
            render={({ field }) => (
              <FormControlLabel
                control={<Switch checked={field.value} onChange={field.onChange} />}
                label="Email Verified"
              />
            )}
          />
        </Box>

        <Stack direction="row" spacing={2} justifyContent="flex-end">
          <Button variant="outlined" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button variant="contained" type="submit" disabled={isSubmitting}>
            {editMode ? "Save" : "Add User"}
          </Button>
        </Stack>
      </Stack>
    </form>
  );
}
