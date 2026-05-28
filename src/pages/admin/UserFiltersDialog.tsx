import { AssignmentOutlined, MenuOutlined, PlaceOutlined } from "@mui/icons-material";
import {
  Box, Button, CircularProgress, Dialog, DialogContent, DialogTitle,
  Stack, useMediaQuery, useTheme
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { FilterAccordion } from "../useroptions/components/FilterAccordion";
import { userApi } from "../../services/userApi";
import { useGlobalAlertStore } from "../../store/globalAlertStore";
import type {
  FilterLocation, FilterMenuOption, FilterPostingGroup,
  InclusivityMode, UserFilters, UserType
} from "../../store/types/user";
import { DEFAULT_USER_FILTERS } from "../../store/types/user";
import { MENU_OPTION_GROUPS, ALL_ROUTE_OPTIONS } from "../../routes";

interface UserFiltersDialogProps {
  user: UserType | null;
  onClose: () => void;
}

export default function UserFiltersDialog({ user, onClose }: UserFiltersDialogProps) {
  const { setAlert } = useGlobalAlertStore();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [localFilters, setLocalFilters] = useState<UserFilters>(DEFAULT_USER_FILTERS);
  const [availableLocations, setAvailableLocations] = useState<FilterLocation[]>([]);
  const [availablePostingGroups, setAvailablePostingGroups] = useState<FilterPostingGroup[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const availableMenuOptions = useMemo<FilterMenuOption[]>(() => ALL_ROUTE_OPTIONS, []);

  useEffect(() => {
    if (!user) return;
    setIsLoading(true);
    Promise.all([
      userApi.getFilterLocations(),
      userApi.getFilterPostingGroups(),
      userApi.getAdminUserFilters(user.username).catch(() => DEFAULT_USER_FILTERS)
    ]).then(([locs, pgs, filters]) => {
      setAvailableLocations(locs);
      setAvailablePostingGroups(pgs);
      setLocalFilters({
        ...DEFAULT_USER_FILTERS,
        ...filters,
        locations: { ...DEFAULT_USER_FILTERS.locations, ...filters?.locations },
        postingGroups: { ...DEFAULT_USER_FILTERS.postingGroups, ...filters?.postingGroups },
        menuOptions: { ...DEFAULT_USER_FILTERS.menuOptions, ...filters?.menuOptions },
      });
    }).catch(() => setAlert("error", "Failed to load filter data."))
      .finally(() => setIsLoading(false));
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setIsSaving(true);
    try {
      await userApi.saveAdminUserFilters(user.username, localFilters);
      setAlert("success", "Filters saved.");
      onClose();
    } catch {
      setAlert("error", "Failed to save filters.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={Boolean(user)} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Filters — {user?.username}</DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        {isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Stack spacing={2} sx={{ mt: 1 }}>
            <FilterAccordion<FilterLocation>
              title="Locations"
              icon={<PlaceOutlined fontSize="small" />}
              category={localFilters.locations}
              availableOptions={availableLocations}
              getLabel={(l) => l.name}
              getKey={(l) => l.code}
              defaultExpanded
              onModeChange={(mode: InclusivityMode) =>
                setLocalFilters((prev) => ({ ...prev, locations: { ...prev.locations, mode } }))
              }
              onChange={(list: FilterLocation[]) =>
                setLocalFilters((prev) => ({ ...prev, locations: { ...prev.locations, list } }))
              }
              isMobile={isMobile}
            />
            <FilterAccordion<FilterPostingGroup>
              title="Posting Groups"
              icon={<AssignmentOutlined fontSize="small" />}
              category={localFilters.postingGroups}
              availableOptions={availablePostingGroups}
              getLabel={(pg) => (pg.description ? `${pg.code} – ${pg.description}` : pg.code)}
              getKey={(pg) => pg.code}
              onModeChange={(mode: InclusivityMode) =>
                setLocalFilters((prev) => ({ ...prev, postingGroups: { ...prev.postingGroups, mode } }))
              }
              onChange={(list: FilterPostingGroup[]) =>
                setLocalFilters((prev) => ({ ...prev, postingGroups: { ...prev.postingGroups, list } }))
              }
              isMobile={isMobile}
            />
            <FilterAccordion<FilterMenuOption>
              title="Menu Options"
              icon={<MenuOutlined fontSize="small" />}
              category={localFilters.menuOptions}
              availableOptions={availableMenuOptions}
              getLabel={(mo) => mo.title}
              getKey={(mo) => mo.segment}
              getGroup={(mo) => MENU_OPTION_GROUPS[mo.segment] || "Other Forms"}
              onModeChange={(mode: InclusivityMode) =>
                setLocalFilters((prev) => ({ ...prev, menuOptions: { ...prev.menuOptions, mode } }))
              }
              onChange={(list: FilterMenuOption[]) =>
                setLocalFilters((prev) => ({ ...prev, menuOptions: { ...prev.menuOptions, list } }))
              }
              isMobile={isMobile}
            />
            <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ pt: 1 }}>
              <Button variant="outlined" onClick={onClose} disabled={isSaving}>Cancel</Button>
              <Button
                variant="contained"
                onClick={handleSave}
                disabled={isSaving}
                startIcon={isSaving ? <CircularProgress size={16} /> : undefined}
              >
                {isSaving ? "Saving…" : "Save Filters"}
              </Button>
            </Stack>
          </Stack>
        )}
      </DialogContent>
    </Dialog>
  );
}
