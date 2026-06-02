import { TuneOutlined, ColorLensOutlined, RestartAltOutlined } from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  Chip,
  CircularProgress,
  Divider,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useColorScheme } from "@mui/material/styles";
import React, { useRef, useState } from "react";
import { ColorSwatch } from "../../../components/shared/ColorSwatch";
import { useConfigStore } from "../../../store/configStore";
import { useGlobalAlertStore } from "../../../store/globalAlertStore";
import type { UserPreferences } from "../../../store/types/user";
import { useUserStore } from "../../../store/userStore";

// ── Banner color presets ──────────────────────────────────────────────────────

const BANNER_COLOR_PRESETS = [
  { name: "Forest Green",  hex: "#2E7D32" },
  { name: "Farm Green",    hex: "#388E3C" },
  { name: "Olive Grove",   hex: "#558B2F" },
  { name: "Meadow",        hex: "#33691E" },
  { name: "Teal Pasture",  hex: "#00695C" },
  { name: "Slate Teal",    hex: "#00796B" },
  { name: "Harvest Amber", hex: "#E65100" },
  { name: "Wheat Gold",    hex: "#F57F17" },
  { name: "Barn Red",      hex: "#B71C1C" },
  { name: "Terracotta",    hex: "#BF360C" },
  { name: "Saddle Brown",  hex: "#5D4037" },
  { name: "Rich Earth",    hex: "#4E342E" },
  { name: "Soil",          hex: "#6D4C41" },
  { name: "Slate Blue",    hex: "#1565C0" },
  { name: "Deep Sky",      hex: "#0277BD" },
  { name: "Midnight Plum", hex: "#4A148C" },
  { name: "Dusk",          hex: "#283593" },
  { name: "Charcoal",      hex: "#424242" },
  { name: "Gunmetal",      hex: "#37474F" },
  { name: "Deep Slate",    hex: "#455A64" },
] as const;

// ── PreferencesTab ────────────────────────────────────────────────────────────

export function PreferencesTab() {
  const { mode, setMode } = useColorScheme();

  const domains = useUserStore((state) => state.domains);
  const preferences = useUserStore((state) => state.preferences);
  const savePreferences = useUserStore((state) => state.savePreferences);
  const getDomain = useConfigStore((state) => state.getDomain);
  const getDomainColor = useConfigStore((state) => state.getDomainColor);
  const { setAlert } = useGlobalAlertStore();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [draftColors, setDraftColors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);

  // Deduplicated, sorted list of accessible domain names (exclude wildcard '*')
  const accessibleDomains: string[] = React.useMemo(() => {
    const flat = Object.values(domains).flat().filter((d) => d !== "*");
    return Array.from(new Set(flat)).sort();
  }, [domains]);

  // Ensure a ref exists for each accessible domain's hidden color input
  const customInputRefs = useRef<Record<string, React.RefObject<HTMLInputElement | null>>>({});
  accessibleDomains.forEach((domain) => {
    if (!customInputRefs.current[domain]) {
      customInputRefs.current[domain] = React.createRef<HTMLInputElement>();
    }
  });

  const isDirty = Object.keys(draftColors).length > 0;

  // ── Helpers ──────────────────────────────────────────────────────────────────

  /** Current draft value for a domain (may be '' for a pending reset). */
  function getDraftColor(domain: string): string | undefined {
    if (domain in draftColors) return draftColors[domain];
    if (preferences.domainColors[domain] !== undefined) return preferences.domainColors[domain];
    return undefined;
  }

  /** Effective color shown in the preview strip. */
  function getPreviewColor(domain: string): string | undefined {
    const draft = draftColors[domain];
    if (draft !== undefined && draft !== "") return draft;
    const saved = preferences.domainColors[domain];
    if (saved !== undefined && saved !== "") return saved;
    return getDomainColor(domain);
  }

  /** Label shown inside the preview strip. */
  function getPreviewLabel(domain: string): string {
    const effective = getPreviewColor(domain);
    if (!effective) return "Default";
    const preset = BANNER_COLOR_PRESETS.find((p) => p.hex.toLowerCase() === effective.toLowerCase());
    return preset ? preset.name : effective.toUpperCase();
  }

  /** Whether the custom swatch should show a selected outline (color is not a preset). */
  function isCustomSelected(domain: string): boolean {
    const current = getDraftColor(domain);
    if (!current) return false;
    return !BANNER_COLOR_PRESETS.some((p) => p.hex.toLowerCase() === current.toLowerCase());
  }

  // ── Handlers ─────────────────────────────────────────────────────────────────

  const handleColorSelect = (domain: string, hex: string) => {
    setDraftColors((prev) => ({ ...prev, [domain]: hex }));
  };

  const handleReset = (domain: string) => {
    // Empty string signals "reset to default" — filtered out on save
    setDraftColors((prev) => ({ ...prev, [domain]: "" }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const merged: Record<string, string> = { ...preferences.domainColors };
      for (const [domain, color] of Object.entries(draftColors)) {
        if (color === "") {
          delete merged[domain]; // reset to default
        } else {
          merged[domain] = color;
        }
      }
      await savePreferences({ domainColors: merged });
      setDraftColors({});
      setAlert("success", "Preferences saved successfully.");
    } catch {
      setAlert("error", "Failed to save preferences. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────────

  return (
    <Card variant="outlined" sx={{ p: 3 }}>
      {/* Header */}
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
        <TuneOutlined color="primary" sx={{ fontSize: 24 }} />
        <Typography variant="h6">Preferences</Typography>
      </Stack>

      {/* ── Appearance section ─────────────────────────────────────────────── */}
      <Stack spacing={2}>
        <Typography variant="body2" color="text.secondary">
          Appearance
        </Typography>
        <ToggleButtonGroup
          value={mode ?? "system"}
          exclusive
          onChange={(_, val) => { if (val) setMode(val); }}
          aria-label="theme mode"
        >
          <ToggleButton value="light">Light</ToggleButton>
          <ToggleButton value="system">System</ToggleButton>
          <ToggleButton value="dark">Dark</ToggleButton>
        </ToggleButtonGroup>
      </Stack>

      {/* ── Banner Colors section (only when user has accessible domains) ───── */}
      {accessibleDomains.length > 0 && (
        <>
          <Divider sx={{ my: 3 }} />

          <Stack spacing={3}>
            <Typography variant="body2" color="text.secondary">
              Banner Colors
            </Typography>

            {accessibleDomains.map((domain) => {
              const previewColor = getPreviewColor(domain);
              const previewLabel = getPreviewLabel(domain);
              const currentDraft = getDraftColor(domain);
              const showReset =
                draftColors[domain] !== undefined || !!preferences.domainColors[domain];

              return (
                <Stack key={domain} spacing={1.5}>
                  {/* Domain label */}
                  <Typography variant="subtitle2">
                    {getDomain(domain)?.uri ?? domain}
                  </Typography>

                  {/* Swatch palette + custom swatch */}
                  <Stack direction="row" alignItems="center" flexWrap="wrap" gap={1}>
                    <Box
                      role="radiogroup"
                      aria-label={`Banner color for ${domain}`}
                      sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}
                    >
                      {BANNER_COLOR_PRESETS.map((preset) => (
                        <ColorSwatch
                          key={preset.hex}
                          color={preset.hex}
                          label={preset.name}
                          selected={
                            currentDraft !== undefined
                              ? currentDraft.toLowerCase() === preset.hex.toLowerCase()
                              : false
                          }
                          onClick={() => handleColorSelect(domain, preset.hex)}
                        />
                      ))}
                    </Box>

                    {/* Custom color swatch */}
                    <Box
                      component="button"
                      aria-label={`Custom color for ${domain}`}
                      onClick={() => customInputRefs.current[domain]?.current?.click()}
                      sx={{
                        width: 28,
                        height: 28,
                        borderRadius: "50%",
                        border: isCustomSelected(domain) ? "3px solid" : "2px dashed",
                        borderColor: isCustomSelected(domain) ? "text.primary" : "text.secondary",
                        bgcolor: "transparent",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        outline: "none",
                        padding: 0,
                        transition: "transform 0.15s ease",
                        "&:hover": {
                          transform: "scale(1.15)",
                        },
                      }}
                    >
                      <ColorLensOutlined sx={{ fontSize: 14, color: "text.secondary" }} />
                      <Box
                        component="input"
                        type="color"
                        ref={customInputRefs.current[domain]}
                        aria-hidden="true"
                        tabIndex={-1}
                        value={
                          isCustomSelected(domain) && currentDraft
                            ? currentDraft
                            : "#000000"
                        }
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          handleColorSelect(domain, e.target.value)
                        }
                        sx={{
                          position: "absolute",
                          width: 0,
                          height: 0,
                          opacity: 0,
                          pointerEvents: "none",
                          border: "none",
                          padding: 0,
                        }}
                      />
                    </Box>
                  </Stack>

                  {/* Preview strip */}
                  <Box
                    role="img"
                    aria-label="Banner color preview"
                    sx={{
                      height: 32,
                      borderRadius: 1,
                      backgroundColor: previewColor ?? "primary.main",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "background-color 0.2s ease",
                    }}
                  >
                    <Typography
                      variant="caption"
                      aria-live="polite"
                      sx={{ color: "#ffffff" }}
                    >
                      {previewLabel}
                    </Typography>
                  </Box>

                  {/* Reset chip — only shown when there is a draft or a saved preference */}
                  {showReset && (
                    <Box>
                      <Chip
                        variant="outlined"
                        size="small"
                        icon={<RestartAltOutlined fontSize="small" />}
                        label="Reset to default"
                        onClick={() => handleReset(domain)}
                        aria-label={`Reset ${domain} banner color to default`}
                      />
                    </Box>
                  )}
                </Stack>
              );
            })}

            {/* Save button */}
            <Button
              variant="contained"
              onClick={handleSave}
              disabled={!isDirty || isSaving}
              fullWidth={isMobile}
              startIcon={isSaving ? <CircularProgress size={16} /> : undefined}
            >
              {isSaving ? "Saving…" : "Save Preferences"}
            </Button>
          </Stack>
        </>
      )}
    </Card>
  );
}
