import type { Navigation } from "@toolpad/core/AppProvider";
import { unionBy } from "lodash";
import { useUserStore } from "../store/userStore";
export const useDynamicNavigation = (nav_config: Navigation): Navigation => {
  const user = useUserStore();

  // Start with base navigation items
  const navigation: Navigation = [
    {
      kind: "header",
      title: `Welcome, ${user.username}!`,
    },
    ...nav_config,
  ];

  // show only forms that the user has requested to see
  const allowedForms = user.menuOptions.filter((option) => !option.hidden);

  return unionBy(navigation, allowedForms, "segment");
};

export default useDynamicNavigation;
