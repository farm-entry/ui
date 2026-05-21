import { AssignmentOutlined, MenuOutlined, PlaceOutlined, TuneOutlined } from "@mui/icons-material";
import { Box, Button, CircularProgress, Stack, useMediaQuery, useTheme } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import CustomHeader from "../../../components/framework/CustomHeader";
import { userApi } from "../../../services/userApi";
import { useGlobalAlertStore } from "../../../store/globalAlertStore";
import type {
  FilterLocation,
  FilterMenuOption,
  FilterPostingGroup,
  InclusivityMode,
  UserFilters
} from "../../../store/types/user";
import { DEFAULT_USER_FILTERS } from "../../../store/types/user";
import { useUserStore } from "../../../store/userStore";
import { MAIN_ROUTES } from "../../../routes";
import { FilterAccordion } from "./FilterAccordion";

// ── Menu option helpers ───────────────────────────────────────────────────────

const MENU_OPTION_GROUPS: Record<string, string> = Object.fromEntries(
  MAIN_ROUTES.flatMap((route) =>
    route.children?.length
      ? route.children.map((child) => [child.segment, route.title] as [string, string])
      : []
  )
);

const getMenuOptionGroup = (mo: FilterMenuOption) =>
  MENU_OPTION_GROUPS[mo.segment] || "Other Forms";

function expandToMenuOptions(segments: string[]): FilterMenuOption[] {
  return segments.flatMap((segment) => {
    const route = MAIN_ROUTES.find((r) => r.segment === segment);
    if (route?.children?.length) {
      return route.children.map((child) => ({ title: child.title, segment: child.segment }));
    }
    return route ? [{ title: route.title, segment }] : [];
  });
}

const ALL_ROUTE_OPTIONS = expandToMenuOptions(MAIN_ROUTES.map((r) => r.segment));

// ── Filters Tab ───────────────────────────────────────────────────────────────

export function FiltersTab() {
  const storeFilters = useUserStore((state) => state.filters);
  const saveFiltersToStore = useUserStore((state) => state.saveFilters);
  const menuOptionsFromStore = useUserStore((state) => state.menuOptions);
  const { setAlert } = useGlobalAlertStore();

  // Available options are scoped to what this user is permitted to see.
  // menuOptionsFromStore holds top-level segments (e.g. "livestock-activity").
  // Routes with children are expanded to their children (grouped under the parent title),
  // matching the same structure ALL_ROUTE_OPTIONS uses for the unrestricted case.
  const availableMenuOptions = useMemo<FilterMenuOption[]>(() => {
    const visibleSegments = menuOptionsFromStore.filter((o) => !o.hidden).map((o) => o.segment);
    return visibleSegments.length > 0 ? expandToMenuOptions(visibleSegments) : ALL_ROUTE_OPTIONS;
  }, [menuOptionsFromStore]);

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

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

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

  // Reconcile stored posting groups against fetched list so descriptions are never stale/empty.
  useEffect(() => {
    if (availablePostingGroups.length === 0) return;
    setLocalFilters((prev) => ({
      ...prev,
      postingGroups: {
        ...prev.postingGroups,
        list: prev.postingGroups.list.map(
          (item) => availablePostingGroups.find((a) => a.code === item.code) ?? item
        )
      }
    }));
  }, [availablePostingGroups]);

  const isDirty = JSON.stringify(localFilters) !== JSON.stringify(storeFilters);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await saveFiltersToStore(localFilters);
      setAlert("success", "Filters saved successfully.");
    } catch {
      setAlert("error", "Failed to save filters. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  // ── Mode handlers ────────────────────────────────────────────────────────────

  const handleLocationsMode = (mode: InclusivityMode) =>
    setLocalFilters((prev) => ({ ...prev, locations: { ...prev.locations, mode } }));

  const handlePostingGroupsMode = (mode: InclusivityMode) =>
    setLocalFilters((prev) => ({ ...prev, postingGroups: { ...prev.postingGroups, mode } }));

  const handleMenuOptionsMode = (mode: InclusivityMode) =>
    setLocalFilters((prev) => ({ ...prev, menuOptions: { ...prev.menuOptions, mode } }));

  // ── List handlers ────────────────────────────────────────────────────────────

  const handleLocationsChange = (list: FilterLocation[]) =>
    setLocalFilters((prev) => ({ ...prev, locations: { ...prev.locations, list } }));

  const handlePostingGroupsChange = (list: FilterPostingGroup[]) =>
    setLocalFilters((prev) => ({ ...prev, postingGroups: { ...prev.postingGroups, list } }));

  const handleMenuOptionsChange = (list: FilterMenuOption[]) =>
    setLocalFilters((prev) => ({ ...prev, menuOptions: { ...prev.menuOptions, list } }));

  return (
    <Stack spacing={2}>
      <CustomHeader icon={TuneOutlined} title="Filters" sx={{ mb: 0 }} />
      <FilterAccordion<FilterLocation>
        title="Locations"
        icon={<PlaceOutlined fontSize="small" />}
        category={localFilters.locations}
        availableOptions={availableLocations}
        getLabel={(l) => l.name}
        getKey={(l) => l.code}
        defaultExpanded
        onModeChange={handleLocationsMode}
        onChange={handleLocationsChange}
        isMobile={isMobile}
      />
      <FilterAccordion<FilterPostingGroup>
        title="Posting Groups"
        icon={<AssignmentOutlined fontSize="small" />}
        category={localFilters.postingGroups}
        availableOptions={availablePostingGroups}
        getLabel={(pg) => (pg.description ? `${pg.code} – ${pg.description}` : pg.code)}
        getKey={(pg) => pg.code}
        onModeChange={handlePostingGroupsMode}
        onChange={handlePostingGroupsChange}
        isMobile={isMobile}
      />

      <FilterAccordion<FilterMenuOption>
        title="Menu Options"
        icon={<MenuOutlined fontSize="small" />}
        category={localFilters.menuOptions}
        availableOptions={availableMenuOptions}
        getLabel={(mo) => mo.title}
        getKey={(mo) => mo.segment}
        getGroup={getMenuOptionGroup}
        onModeChange={handleMenuOptionsMode}
        onChange={handleMenuOptionsChange}
        isMobile={isMobile}
      />

      <Button
        variant="contained"
        onClick={handleSave}
        disabled={!isDirty || isSaving}
        fullWidth={isMobile}
        startIcon={isSaving ? <CircularProgress size={16} /> : undefined}
      >
        {isSaving ? "Saving…" : "Save Filters"}
      </Button>
    </Stack>
  );
}
