import { Desk, Home, QrCode } from "@mui/icons-material";
import LockIcon from "@mui/icons-material/Lock";
import PersonIcon from "@mui/icons-material/Person";
import type { Navigation } from "@toolpad/core/AppProvider";
import { UserInfo, useUserStore } from "../store/userStore";

export const useDynamicNavigation = (nav_config: Navigation): Navigation => {
  const { user } = useUserStore();

  // Start with base navigation items
  const navigation: Navigation = [
    {
      kind: "header",
      title: `Welcome, ${user.userData.username}!`,
    },
    ...nav_config,
  ];

  // show only forms that the user has requested to see
  const allowedForms = user.menuOptions.filter((option) => !option.hidden);
  navigation.push(allowedForms as Navigation[number]);

  return navigation;
};

export default useDynamicNavigation;
