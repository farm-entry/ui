import { useState } from "react";
import type { ReactNode } from "react";
import { Box, Tab, Tabs } from "@mui/material";

export interface AppTab {
  label: string;
  content: ReactNode;
}

interface AppTabsProps {
  tabs: AppTab[];
  defaultTab?: number;
  "aria-label"?: string;
}

export function AppTabs({ tabs, defaultTab, "aria-label": ariaLabel }: AppTabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab ?? 0);

  return (
    <Box>
      <Tabs
        value={activeTab}
        onChange={(_event, newValue: number) => setActiveTab(newValue)}
        variant="scrollable"
        scrollButtons="auto"
        allowScrollButtonsMobile
        aria-label={ariaLabel}
        sx={{ borderBottom: 1, borderColor: "divider", mb: 2, minHeight: 40 }}
      >
        {tabs.map((tab, i) => (
          <Tab
            key={tab.label}
            id={`tab-${i}`}
            aria-controls={`tabpanel-${i}`}
            label={tab.label}
            sx={{ textTransform: "none", fontSize: "0.875rem", minHeight: 40, py: 0.5 }}
          />
        ))}
      </Tabs>
      <Box
        role="tabpanel"
        id={`tabpanel-${activeTab}`}
        aria-labelledby={`tab-${activeTab}`}
      >
        {tabs[activeTab]?.content}
      </Box>
    </Box>
  );
}
