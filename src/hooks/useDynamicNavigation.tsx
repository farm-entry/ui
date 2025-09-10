import { Desk, Home, QrCode } from "@mui/icons-material";
import ClipboardIcon from "@mui/icons-material/DynamicForm";
import LockIcon from "@mui/icons-material/Lock";
import PersonIcon from "@mui/icons-material/Person";
import type { Navigation, NavigationPageItem } from "@toolpad/core/AppProvider";
import { UserInfo, useUserStore } from "../store/userStore";

// Extend NavigationPageItem to include description while maintaining compatibility
interface ExtendedNavigationPageItem extends NavigationPageItem {
  description?: string;
}

// Custom navigation type that supports descriptions
type ExtendedNavigation = (Navigation[number] | (Omit<Navigation[number], 'children'> & { 
  children?: ExtendedNavigationPageItem[] 
}))[];

const filterForms = (user: UserInfo) => {
  // Filter menu options based on user permissions
  const allowedMenuOptions = user.menuOptions.filter((option) => !option.hidden);

  // Build the forms children array based on user permissions, including descriptions
  const formsChildren: ExtendedNavigationPageItem[] = allowedMenuOptions.map(({ hidden, ...navItem }) => ({
    segment: navItem.segment,
    title: navItem.title,
    description: navItem.description, // Include description field
  })).filter((item): item is ExtendedNavigationPageItem => !!item.segment);

  // Only add Farm Entry Forms if user has access to any form
  return {
    title: "Farm Entry Forms",
    icon: <Desk />,
    segment: "forms",
    children: formsChildren,
  };
};

export const useDynamicNavigation = (): Navigation => {
  const { user } = useUserStore();

  // Start with base navigation items
  const navigation: Navigation = [
    {
      kind: "header",
      title: `Welcome, ${user.userData.username}!`,
    },
    {
      title: "Home",
      icon: <Home />,
      segment: "",
    },
  ];

  // Add forms filtered by user preference
  const formsSection = filterForms(user);
  if (formsSection.children && formsSection.children.length > 0) {
    // Cast to Navigation item for compatibility
    navigation.push(formsSection as Navigation[number]);
  }

  // Add other static navigation items
  navigation.push(
    {
      segment: "forminputs",
      title: "Form Inputs",
      icon: <ClipboardIcon />,
    },
    {
      segment: "employees",
      title: "Employees",
      icon: <PersonIcon />,
    },
    {
      segment: "route-protection",
      title: "Route Protection",
      icon: <LockIcon />,
    },
    {
      segment: "qrcode",
      title: "QR Scanner",
      icon: <QrCode />,
    }
  );

  return navigation;
};

export default useDynamicNavigation;
