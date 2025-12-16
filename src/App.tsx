import { ReactRouterAppProvider } from "@toolpad/core/react-router";
import { Outlet } from "react-router";
import frontlineLogo from "./assets/frontlinesprout.svg";
import useDynamicNavigation from "./hooks/useDynamicNavigation";
import { AuthProvider } from "./layouts/authContext";
import LEFTNAV_NAVIGATION from "./LeftNavConfig";
import { customTheme } from "./theme";

const Logo = () => <img src={frontlineLogo} alt="Frontline Farms Logo" />;

const BRANDING = {
  logo: <Logo />,
  title: "Frontline Farms",
};

export default function App() {
  const navigation = useDynamicNavigation(LEFTNAV_NAVIGATION);

  return (
    <ReactRouterAppProvider
      navigation={navigation}
      branding={BRANDING}
      theme={customTheme}
    >
      <AuthProvider>
        <Outlet />
      </AuthProvider>
    </ReactRouterAppProvider>
  );
}
