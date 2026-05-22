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
  Typography
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { TextField } from "../../components/inputs";
import { useAdminStore } from "../../store/adminStore";
import { useUserStore } from "../../store/userStore";
import { RolesType } from "../../store/types/user";
import { assignableRoles } from "../../utils/roles";

export interface UserFormData {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  domains: Record<string, string[]>;
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

// ── DomainSelector ────────────────────────────────────────────────────────────

interface DomainSelectorProps {
  role: RolesType;
  control: any;
  errors: any;
  setValue: (name: 'domains', value: Record<string, string[]>) => void;
  watch: (name: 'domains') => Record<string, string[]>;
  availableDomains: Record<string, string[]>;
}

function DomainSelector({
  role,
  control,
  errors,
  setValue,
  watch,
  availableDomains,
}: DomainSelectorProps) {
  const selectedDomains = watch('domains');

  // app_admin — no domain selector needed
  if (role === 'app_admin') {
    return (
      <Typography variant="body2" color="text.secondary">
        App admins are granted access to all domains automatically.
      </Typography>
    );
  }

  // no role selected — disabled placeholder
  if (!role) {
    return (
      <FormControl fullWidth disabled>
        <InputLabel id="domains-label">Domains</InputLabel>
        <Select
          labelId="domains-label"
          value={[]}
          multiple
          input={<OutlinedInput label="Domains" />}
        >
          {/* empty */}
        </Select>
        <FormHelperText>Select a role first</FormHelperText>
      </FormControl>
    );
  }

  const parentFarms = Object.keys(availableDomains);

  // admin — parent farms only, multi-select
  if (role === 'admin') {
    const selectedParents = Object.keys(selectedDomains);

    return (
      <Controller
        name="domains"
        control={control}
        rules={{
          validate: (v: Record<string, string[]>) =>
            Object.keys(v).length > 0 || 'At least one domain is required',
        }}
        render={() => (
          <FormControl fullWidth error={!!errors.domains}>
            <InputLabel id="domains-label">Domains</InputLabel>
            <Select
              labelId="domains-label"
              multiple
              value={selectedParents}
              onChange={(e) => {
                const selected = e.target.value as string[];
                const next: Record<string, string[]> = {};
                for (const farm of selected) {
                  next[farm] = availableDomains[farm] ?? [];
                }
                setValue('domains', next);
              }}
              input={<OutlinedInput label="Domains" />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {(selected as string[]).map((val) => (
                    <Chip key={val} label={val} size="small" />
                  ))}
                </Box>
              )}
            >
              {parentFarms.map((farm) => (
                <MenuItem key={farm} value={farm}>
                  <Checkbox checked={selectedParents.includes(farm)} />
                  <ListItemText primary={farm} />
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>
              {(errors.domains as any)?.message ??
                'All sub-domains under selected farms will be granted automatically'}
            </FormHelperText>
          </FormControl>
        )}
      />
    );
  }

  // user — grouped tree with parent select-all
  const selectedSubDomains = Object.values(selectedDomains).flat();

  const handleSelectAll = (farm: string, subDomains: string[]) => {
    const allSelected =
      subDomains.length > 0 && subDomains.every((sd) => selectedSubDomains.includes(sd));
    if (allSelected) {
      const next = { ...selectedDomains };
      delete next[farm];
      setValue('domains', next);
    } else {
      setValue('domains', { ...selectedDomains, [farm]: subDomains });
    }
  };

  const handleToggleChild = (farm: string, child: string) => {
    const currentFarmSelected = selectedDomains[farm] ?? [];
    const isSelected = currentFarmSelected.includes(child);
    let nextFarmList: string[];
    if (isSelected) {
      nextFarmList = currentFarmSelected.filter((d) => d !== child);
    } else {
      nextFarmList = [...currentFarmSelected, child];
    }
    const next = { ...selectedDomains };
    if (nextFarmList.length === 0) {
      delete next[farm];
    } else {
      next[farm] = nextFarmList;
    }
    setValue('domains', next);
  };

  return (
    <Controller
      name="domains"
      control={control}
      rules={{
        validate: (v: Record<string, string[]>) =>
          Object.values(v).flat().length > 0 || 'At least one domain is required',
      }}
      render={() => (
        <FormControl fullWidth error={!!errors.domains}>
          <InputLabel id="domains-label">Domains</InputLabel>
          <Select
            labelId="domains-label"
            multiple
            value={selectedSubDomains}
            input={<OutlinedInput label="Domains" />}
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {(selected as string[]).map((val) => (
                  <Chip key={val} label={val} size="small" />
                ))}
              </Box>
            )}
          >
            {parentFarms.map((farm) => {
              const subDomains = availableDomains[farm] ?? [];
              const allSelected =
                subDomains.length > 0 &&
                subDomains.every((sd) => selectedSubDomains.includes(sd));
              const someSelected = subDomains.some((sd) => selectedSubDomains.includes(sd));
              return [
                <MenuItem
                  key={`header-${farm}`}
                  disableRipple
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectAll(farm, subDomains);
                  }}
                  sx={{ bgcolor: 'action.hover' }}
                >
                  <Checkbox
                    checked={allSelected}
                    indeterminate={someSelected && !allSelected}
                    inputProps={{ 'aria-label': `Select all ${farm} domains` }}
                  />
                  <ListItemText
                    primary={farm}
                    primaryTypographyProps={{ fontWeight: 'bold' }}
                  />
                </MenuItem>,
                ...subDomains.map((sub) => (
                  <MenuItem
                    key={sub}
                    value={sub}
                    sx={{ pl: 4 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleChild(farm, sub);
                    }}
                  >
                    <Checkbox checked={selectedSubDomains.includes(sub)} />
                    <ListItemText primary={sub} />
                  </MenuItem>
                )),
              ];
            })}
          </Select>
          {errors.domains && (
            <FormHelperText>{(errors.domains as any)?.message}</FormHelperText>
          )}
        </FormControl>
      )}
    />
  );
}

// ── UserForm ──────────────────────────────────────────────────────────────────

export default function UserForm({
  onSubmit,
  onCancel,
  initialValues,
  editMode = false
}: UserFormProps) {
  const { domains: availableDomains } = useAdminStore();
  const { role: currentUserRole } = useUserStore();
  const roleOptions = assignableRoles(currentUserRole);

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
      domains: {},
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
          label="Username"
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
          label="Email"
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
            label="Password"
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
            label="First Name"
            placeholder="First Name"
          />
          <TextField
            {...register("lastName")}
            value={watch("lastName")}
            label="Last Name"
            placeholder="Last Name"
          />
        </Stack>

        <Typography variant="subtitle2" color="text.secondary">
          Permissions
        </Typography>

        {/* ── ROLE SELECTOR — always first ── */}
        <Controller
          name="role"
          control={control}
          rules={{ required: 'Role is required' }}
          render={({ field }) => (
            <FormControl fullWidth error={!!errors.role}>
              <InputLabel id="role-label">Role</InputLabel>
              <Select
                labelId="role-label"
                value={field.value ?? ''}
                onChange={(e) => {
                  field.onChange(e.target.value);
                  setValue('domains', {}); // clear domains on role change
                }}
                input={<OutlinedInput label="Role" />}
              >
                {roleOptions.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </MenuItem>
                ))}
              </Select>
              {errors.role && <FormHelperText>{errors.role.message}</FormHelperText>}
            </FormControl>
          )}
        />

        {/* ── DOMAIN SELECTOR — conditional on role ── */}
        <DomainSelector
          role={watch('role')}
          control={control}
          errors={errors}
          setValue={setValue}
          watch={watch}
          availableDomains={availableDomains}
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
