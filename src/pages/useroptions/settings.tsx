import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Autocomplete,
  Box,
  Button,
  Card,
  Chip,
  CircularProgress,
  Divider,
  Snackbar,
  Stack,
  Tab,
  Tabs,
  TextField as MuiTextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  AssignmentOutlined,
  ExpandMore,
  FilterList,
  LockOutlined,
  Logout as LogoutIcon,
  MenuOutlined,
  PersonOutline,
  PlaceOutlined,
} from "@mui/icons-material";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { TextField } from "../../components/inputs";
import { useAuth } from "../../hooks/useAuth";
import CustomPageContainer from "../../components/framework/CustomPageContainer";
import CustomFormsLayout from "../../layouts/forms";
import { userApi } from "../../services/userApi";
import { useGlobalAlertStore } from "../../store/globalAlertStore";
import { useUserStore } from "../../store/userStore";
import type {
  FilterCategory,
  FilterLocation,
  FilterMenuOption,
  FilterPostingGroup,
  InclusivityMode,
  UserFilters,
} from "../../store/types/user";
import { DEFAULT_USER_FILTERS } from "../../store/types/user";

// ── Types ────────────────────────────────────────────────────────────────────

interface ProfileFormData {
  firstName: string;
  lastName: string;
  email: string;
}

interface PasswordFormData {
  newPassword: string;
  confirmPassword: string;
}

// ── Profile Tab ──────────────────────────────────────────────────────────────

function ProfileTab() {
  const { firstName, lastName, email, updateProfile } = useUserStore();
  const { setAlert } = useGlobalAlertStore();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<ProfileFormData>({
    defaultValues: {
      firstName: firstName ?? "",
      lastName: lastName ?? "",
      email: email ?? "",
    },
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
          <TextField
            {...register("lastName")}
            value={watch("lastName")}
            placeholder="Last Name"
          />
        </Stack>

        <TextField
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Invalid email",
            },
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

// ── Password Tab ─────────────────────────────────────────────────────────────

function PasswordTab() {
  const { changePassword } = useUserStore();
  const { setAlert } = useGlobalAlertStore();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<PasswordFormData>({
    defaultValues: { newPassword: "", confirmPassword: "" },
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
    <form onSubmit={handleSubmit(onSubmitPassword)}>
      <Stack spacing={3}>
        <TextField
          {...register("newPassword", {
            required: "Password is required",
            minLength: { value: 8, message: "Minimum 8 characters" },
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
            validate: (v) =>
              v === watch("newPassword") || "Passwords do not match",
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
  );
}

// ── Filter Accordion helpers ─────────────────────────────────────────────────

interface FilterAccordionProps<TItem extends object> {
  title: string;
  icon: React.ReactNode;
  category: FilterCategory<TItem>;
  availableOptions: TItem[];
  getLabel: (item: TItem) => string;
  getKey: (item: TItem) => string;
  defaultExpanded?: boolean;
  onModeChange: (mode: InclusivityMode) => void;
  onAdd: (item: TItem) => void;
  onRemove: (key: string) => void;
  isMobile: boolean;
}

function FilterAccordion<TItem extends object>({
  title,
  icon,
  category,
  availableOptions,
  getLabel,
  getKey,
  defaultExpanded = false,
  onModeChange,
  onAdd,
  onRemove,
  isMobile,
}: FilterAccordionProps<TItem>) {
  const [autocompleteKey, setAutocompleteKey] = useState(0);

  const selectedKeys = new Set(category.list.map(getKey));
  const unselectedOptions = availableOptions.filter(
    (opt) => !selectedKeys.has(getKey(opt))
  );

  return (
    <Accordion defaultExpanded={defaultExpanded} disableGutters>
      <AccordionSummary expandIcon={<ExpandMore />}>
        <Stack
          direction="row"
          alignItems="center"
          spacing={1}
          sx={{ width: "100%", pr: 1 }}
        >
          {icon}
          <Typography sx={{ flexGrow: 1 }}>{title}</Typography>
          <Chip
            label={category.mode}
            size="small"
            color={category.mode === "INCLUDE" ? "success" : "warning"}
            sx={{ mr: 0.5 }}
          />
          {category.list.length > 0 && (
            <Chip label={category.list.length} size="small" />
          )}
        </Stack>
      </AccordionSummary>
      <AccordionDetails>
        <Stack spacing={2}>
          <ToggleButtonGroup
            value={category.mode}
            exclusive
            onChange={(_, newMode) => {
              if (newMode !== null) onModeChange(newMode as InclusivityMode);
            }}
            aria-label={`${title} filter mode`}
            sx={isMobile ? { width: "100%" } : undefined}
          >
            <ToggleButton value="INCLUDE" color="success">
              Include
            </ToggleButton>
            <ToggleButton value="EXCLUDE" color="warning">
              Exclude
            </ToggleButton>
          </ToggleButtonGroup>

          <Autocomplete
            key={autocompleteKey}
            options={unselectedOptions}
            getOptionLabel={getLabel}
            value={null}
            onChange={(_, selected) => {
              if (selected) {
                onAdd(selected);
                setAutocompleteKey((k) => k + 1);
              }
            }}
            renderInput={(params) => (
              <MuiTextField
                {...params}
                size="small"
                placeholder={`Search ${title}`}
                label={`Add ${title}`}
              />
            )}
            isOptionEqualToValue={(opt, val) => getKey(opt) === getKey(val)}
            noOptionsText={
              availableOptions.length === 0
                ? "No options available"
                : "All options selected"
            }
          />

          {category.list.length > 0 && (
            <Stack direction="row" flexWrap="wrap" gap={1}>
              {category.list.map((item) => (
                <Chip
                  key={getKey(item)}
                  label={getLabel(item)}
                  onDelete={() => onRemove(getKey(item))}
                  size="small"
                />
              ))}
            </Stack>
          )}
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
}

// ── Filters Tab ───────────────────────────────────────────────────────────────

function FiltersTab() {
  const storeFilters = useUserStore((state) => state.filters);
  const saveFiltersToStore = useUserStore((state) => state.saveFilters);
  const menuOptionsFromStore = useUserStore((state) => state.menuOptions);
  const { setAlert } = useGlobalAlertStore();

  const [localFilters, setLocalFilters] = useState<UserFilters>(() => ({
    ...DEFAULT_USER_FILTERS,
    ...storeFilters,
    locations: { ...DEFAULT_USER_FILTERS.locations, ...storeFilters?.locations },
    postingGroups: { ...DEFAULT_USER_FILTERS.postingGroups, ...storeFilters?.postingGroups },
    menuOptions: { ...DEFAULT_USER_FILTERS.menuOptions, ...storeFilters?.menuOptions },
  }));

  const [availableLocations, setAvailableLocations] = useState<FilterLocation[]>([]);
  const [availablePostingGroups, setAvailablePostingGroups] = useState<FilterPostingGroup[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Fetch available filter options on tab mount
  useEffect(() => {
    userApi.getFilterLocations().then(setAvailableLocations).catch(() => setAvailableLocations([]));
    userApi.getFilterPostingGroups().then(setAvailablePostingGroups).catch(() => setAvailablePostingGroups([]));
  }, []);

  // Dirty check
  const isDirty =
    JSON.stringify(localFilters) !== JSON.stringify(storeFilters);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await saveFiltersToStore(localFilters);
      setAlert("success", "Filters saved successfully.");
      setSnackbarSeverity("success");
      setSnackbarMsg("Filters saved successfully.");
      setSnackbarOpen(true);
    } catch {
      setAlert("error", "Failed to save filters. Please try again.");
      setSnackbarSeverity("error");
      setSnackbarMsg("Failed to save filters. Please try again.");
      setSnackbarOpen(true);
    } finally {
      setIsSaving(false);
    }
  };

  // Locations handlers
  const handleLocationsMode = (mode: InclusivityMode) =>
    setLocalFilters((prev) => ({
      ...prev,
      locations: { ...prev.locations, mode },
    }));
  const handleLocationsAdd = (item: FilterLocation) =>
    setLocalFilters((prev) => ({
      ...prev,
      locations: { ...prev.locations, list: [...prev.locations.list, item] },
    }));
  const handleLocationsRemove = (code: string) =>
    setLocalFilters((prev) => ({
      ...prev,
      locations: {
        ...prev.locations,
        list: prev.locations.list.filter((l) => l.code !== code),
      },
    }));

  // PostingGroups handlers
  const handlePostingGroupsMode = (mode: InclusivityMode) =>
    setLocalFilters((prev) => ({
      ...prev,
      postingGroups: { ...prev.postingGroups, mode },
    }));
  const handlePostingGroupsAdd = (item: FilterPostingGroup) =>
    setLocalFilters((prev) => ({
      ...prev,
      postingGroups: {
        ...prev.postingGroups,
        list: [...prev.postingGroups.list, item],
      },
    }));
  const handlePostingGroupsRemove = (code: string) =>
    setLocalFilters((prev) => ({
      ...prev,
      postingGroups: {
        ...prev.postingGroups,
        list: prev.postingGroups.list.filter((pg) => pg.code !== code),
      },
    }));

  // MenuOptions handlers
  const handleMenuOptionsMode = (mode: InclusivityMode) =>
    setLocalFilters((prev) => ({
      ...prev,
      menuOptions: { ...prev.menuOptions, mode },
    }));
  const handleMenuOptionsAdd = (item: FilterMenuOption) =>
    setLocalFilters((prev) => ({
      ...prev,
      menuOptions: {
        ...prev.menuOptions,
        list: [...prev.menuOptions.list, item],
      },
    }));
  const handleMenuOptionsRemove = (segment: string) =>
    setLocalFilters((prev) => ({
      ...prev,
      menuOptions: {
        ...prev.menuOptions,
        list: prev.menuOptions.list.filter((mo) => mo.segment !== segment),
      },
    }));

  // Convert menuOptions from store to FilterMenuOption[]
  const availableMenuOptions: FilterMenuOption[] = menuOptionsFromStore.map(
    (mo) => ({ title: mo.title, segment: mo.segment })
  );

  return (
    <Stack spacing={2}>
      <FilterAccordion<FilterLocation>
        title="Locations"
        icon={<PlaceOutlined fontSize="small" />}
        category={localFilters.locations}
        availableOptions={availableLocations}
        getLabel={(l) => l.name}
        getKey={(l) => l.code}
        defaultExpanded
        onModeChange={handleLocationsMode}
        onAdd={handleLocationsAdd}
        onRemove={handleLocationsRemove}
        isMobile={isMobile}
      />

      <FilterAccordion<FilterPostingGroup>
        title="Posting Groups"
        icon={<AssignmentOutlined fontSize="small" />}
        category={localFilters.postingGroups}
        availableOptions={availablePostingGroups}
        getLabel={(pg) => `${pg.code} ${pg.description}`}
        getKey={(pg) => pg.code}
        onModeChange={handlePostingGroupsMode}
        onAdd={handlePostingGroupsAdd}
        onRemove={handlePostingGroupsRemove}
        isMobile={isMobile}
      />

      <FilterAccordion<FilterMenuOption>
        title="Menu Options"
        icon={<MenuOutlined fontSize="small" />}
        category={localFilters.menuOptions}
        availableOptions={availableMenuOptions}
        getLabel={(mo) => mo.title}
        getKey={(mo) => mo.segment}
        onModeChange={handleMenuOptionsMode}
        onAdd={handleMenuOptionsAdd}
        onRemove={handleMenuOptionsRemove}
        isMobile={isMobile}
      />

      <Box
        sx={
          isMobile
            ? {
                position: "sticky",
                bottom: 0,
                pt: 1,
                pb: 2,
                bgcolor: "background.paper",
                zIndex: 1,
              }
            : undefined
        }
      >
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={!isDirty || isSaving}
          fullWidth={isMobile}
          startIcon={isSaving ? <CircularProgress size={16} /> : undefined}
        >
          {isSaving ? "Saving…" : "Save Filters"}
        </Button>
      </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMsg}
        </Alert>
      </Snackbar>
    </Stack>
  );
}

// ── Settings Page ─────────────────────────────────────────────────────────────

export default function SettingsPage() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [activeTab, setActiveTab] = useState(0);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <CustomPageContainer>
      <CustomFormsLayout>
        <Stack spacing={3}>
          <Card variant="outlined">
            <Tabs
              value={activeTab}
              onChange={(_, v) => setActiveTab(v)}
              variant="fullWidth"
              aria-label="Settings tabs"
            >
              <Tab
                icon={<PersonOutline />}
                label="Profile"
                iconPosition={isMobile ? "top" : "start"}
                id="settings-tab-0"
                aria-controls="settings-panel-0"
              />
              <Tab
                icon={<LockOutlined />}
                label="Password"
                iconPosition={isMobile ? "top" : "start"}
                id="settings-tab-1"
                aria-controls="settings-panel-1"
              />
              <Tab
                icon={<FilterList />}
                label="Filters"
                iconPosition={isMobile ? "top" : "start"}
                id="settings-tab-2"
                aria-controls="settings-panel-2"
              />
            </Tabs>

            <Divider />

            <Box sx={{ p: 3 }}>
              {activeTab === 0 && (
                <Box
                  role="tabpanel"
                  id="settings-panel-0"
                  aria-labelledby="settings-tab-0"
                >
                  <ProfileTab />
                </Box>
              )}
              {activeTab === 1 && (
                <Box
                  role="tabpanel"
                  id="settings-panel-1"
                  aria-labelledby="settings-tab-1"
                >
                  <PasswordTab />
                </Box>
              )}
              {activeTab === 2 && (
                <Box
                  role="tabpanel"
                  id="settings-panel-2"
                  aria-labelledby="settings-tab-2"
                >
                  <FiltersTab />
                </Box>
              )}
            </Box>
          </Card>

          <Button
            variant="text"
            color="error"
            startIcon={<LogoutIcon />}
            onClick={handleLogout}
            sx={{ alignSelf: "flex-start" }}
          >
            Logout
          </Button>
        </Stack>
      </CustomFormsLayout>
    </CustomPageContainer>
  );
}
