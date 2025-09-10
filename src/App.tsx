import { ReactRouterAppProvider } from "@toolpad/core/react-router";
import { Outlet } from "react-router";
import frontlineLogo from "./assets/frontlinesprout.svg";
import useDynamicNavigation from "./hooks/useDynamicNavigation";
import { customTheme } from "./theme";

const BrandLogo = () => <img src={frontlineLogo} alt="Frontline Farms Logo" />;

const BRANDING = {
  logo: <BrandLogo />,
  title: "Frontline Farms",
};

export default function App() {
  const navigation = useDynamicNavigation();

  return (
    <ReactRouterAppProvider navigation={navigation} branding={BRANDING} theme={customTheme}>
      <Outlet />
    </ReactRouterAppProvider>
  );
}
