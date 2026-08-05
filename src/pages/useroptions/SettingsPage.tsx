import CustomPageContainer from "../../components/framework/CustomPageContainer";
import { AppTabs } from "../../components/framework/AppTabs";
import { ProfileTab } from "./components/ProfileTab";
import { PasswordTab } from "./components/PasswordTab";
import { FiltersTab } from "./components/FiltersTab";
import { PreferencesTab } from "./components/PreferencesTab";

export default function SettingsPage() {
  const tabs = [
    { label: "Profile", content: <ProfileTab /> },
    { label: "Password", content: <PasswordTab /> },
    { label: "Filters", content: <FiltersTab /> },
    { label: "Preferences", content: <PreferencesTab /> }
  ];

  return (
    <CustomPageContainer headerOptions={{ title: "Settings" }}>
      <AppTabs tabs={tabs} aria-label="settings navigation" />
    </CustomPageContainer>
  );
}
