import CustomPageContainer from "../../components/framework/CustomPageContainer";
import { AppTabs } from "../../components/framework/AppTabs";
import { ProfileTab } from "./components/ProfileTab";
import { PasswordTab } from "./components/PasswordTab";
import { FiltersTab } from "./components/FiltersTab";

export default function SettingsPage() {
  const tabs = [
    { label: "Profile", content: <ProfileTab /> },
    { label: "Password", content: <PasswordTab /> },
    { label: "Filters", content: <FiltersTab /> }
  ];

  return (
    <CustomPageContainer headerOptions={{ title: "Settings" }}>
      <AppTabs tabs={tabs} aria-label="settings navigation" />
    </CustomPageContainer>
  );
}
