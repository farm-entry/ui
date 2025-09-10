import { Desk, Home, QrCode } from "@mui/icons-material";
import LockIcon from "@mui/icons-material/Lock";
import PersonIcon from "@mui/icons-material/Person";
import type { Navigation } from "@toolpad/core/AppProvider";
import { UserInfo, useUserStore } from "../store/userStore";

const filterForms = (user: UserInfo) => {
  // Filter menu options based on user permissions
  const allowedMenuOptions = user.menuOptions.filter(
    (option) => !option.hidden
  );

  // Build the forms children array based on user permissions, including descriptions
  const formsChildren = allowedMenuOptions.map(
    ({ hidden, ...navItem }) => navItem.segment && { ...navItem }
  );

  console.log("Filtered Forms Children:", formsChildren);

  // Only add Farm Entry Forms if user has access to any form
  return {
    title: "Farm Entry Forms",
    icon: <Desk />,
    pattern: "forms{/:formId}*",
    children: formsChildren,
  };
};

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

  // Add forms filtered by user preference
  const formsSection = filterForms(user);

  if (formsSection.children && formsSection.children.length > 0) {
    navigation.push(formsSection as Navigation[number]);
  }

  console.log("Dynamic Navigation:", navigation);

  return navigation;
};

export default useDynamicNavigation;
