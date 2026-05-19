import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Snackbar,
  Stack,
  useMediaQuery,
  useTheme
} from "@mui/material";
import {
  AssignmentOutlined,
  MenuOutlined,
  PlaceOutlined
} from "@mui/icons-material";
import { useEffect, useState } from "react";
import { useGlobalAlertStore } from "../../../store/globalAlertStore";
import { useUserStore } from "../../../store/userStore";
import type {
  FilterLocation,
  FilterMenuOption,
  FilterPostingGroup,
  InclusivityMode,
  UserFilters
} from "../../../store/types/user";
import { DEFAULT_USER_FILTERS } from "../../../store/types/user";
import { userApi } from "../../../services/userApi";
import { FilterAccordion } from "./FilterAccordion";

// ── Filters Tab ───────────────────────────────────────────────────────────────

export function FiltersTab() {
  const storeFilters = useUserStore((state) => state.filters);
  const saveFiltersToStore = useUserStore((state) => state.saveFilters);
  const menuOptionsFromStore = useUserStore((state) => state.menuOptions);
  const { setAlert } = useGlobalAlertStore();

  const [localFilters, setLocalFilters] = useState<UserFilters>(() => ({
    ...DEFAULT_USER_FILTERS,
    ...storeFilters,
    locations: { ...DEFAULT_USER_FILTERS.locations, ...storeFilters?.locations },
    postingGroups: { ...DEFAULT_USER_FILTERS.postingGroups, ...storeFilters?.postingGroups },
    menuOptions: { ...DEFAULT_USER_FILTERS.menuOptions, ...storeFilters?.menuOptions }
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
    userApi
      .getFilterLocations()
      .then(setAvailableLocations)
      .catch(() => setAvailableLocations([]));
    userApi
      .getFilterPostingGroups()
      .then(setAvailablePostingGroups)
      .catch(() => setAvailablePostingGroups([]));
  }, []);

  // Dirty check
  const isDirty = JSON.stringify(localFilters) !== JSON.stringify(storeFilters);

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
      locations: { ...prev.locations, mode }
    }));
  const handleLocationsAdd = (item: FilterLocation) =>
    setLocalFilters((prev) => ({
      ...prev,
      locations: { ...prev.locations, list: [...prev.locations.list, item] }
    }));
  const handleLocationsRemove = (code: string) =>
    setLocalFilters((prev) => ({
      ...prev,
      locations: {
        ...prev.locations,
        list: prev.locations.list.filter((l) => l.code !== code)
      }
    }));

  // PostingGroups handlers
  const handlePostingGroupsMode = (mode: InclusivityMode) =>
    setLocalFilters((prev) => ({
      ...prev,
      postingGroups: { ...prev.postingGroups, mode }
    }));
  const handlePostingGroupsAdd = (item: FilterPostingGroup) =>
    setLocalFilters((prev) => ({
      ...prev,
      postingGroups: {
        ...prev.postingGroups,
        list: [...prev.postingGroups.list, item]
      }
    }));
  const handlePostingGroupsRemove = (code: string) =>
    setLocalFilters((prev) => ({
      ...prev,
      postingGroups: {
        ...prev.postingGroups,
        list: prev.postingGroups.list.filter((pg) => pg.code !== code)
      }
    }));

  // MenuOptions handlers
  const handleMenuOptionsMode = (mode: InclusivityMode) =>
    setLocalFilters((prev) => ({
      ...prev,
      menuOptions: { ...prev.menuOptions, mode }
    }));
  const handleMenuOptionsAdd = (item: FilterMenuOption) =>
    setLocalFilters((prev) => ({
      ...prev,
      menuOptions: {
        ...prev.menuOptions,
        list: [...prev.menuOptions.list, item]
      }
    }));
  const handleMenuOptionsRemove = (segment: string) =>
    setLocalFilters((prev) => ({
      ...prev,
      menuOptions: {
        ...prev.menuOptions,
        list: prev.menuOptions.list.filter((mo) => mo.segment !== segment)
      }
    }));

  // Convert menuOptions from store to FilterMenuOption[]
  const availableMenuOptions: FilterMenuOption[] = menuOptionsFromStore.map((mo) => ({
    title: mo.title,
    segment: mo.segment
  }));

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
                zIndex: 1
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
