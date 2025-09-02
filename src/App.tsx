import { ReactRouterAppProvider } from "@toolpad/core/react-router";
import { Outlet } from "react-router";
import frontlineLogo from "./assets/frontlinesprout.svg";
import LEFTNAV_NAVIGATION from "./LeftNavConfig";
import { customTheme } from "./theme";

const BrandLogo = () => <img src={frontlineLogo} alt="Frontline Farms Logo" />;

const BRANDING = {
  logo: <BrandLogo />,
  title: "Frontline Farms",
};

export default function App() {
  return (
    <ReactRouterAppProvider navigation={LEFTNAV_NAVIGATION} branding={BRANDING} theme={customTheme}>
      <Outlet />
    </ReactRouterAppProvider>
  );
}
