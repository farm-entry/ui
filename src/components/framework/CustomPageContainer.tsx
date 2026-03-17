import { PageContainer, PageContainerProps, useActivePage } from "@toolpad/core";
import { Breadcrumbs, Link, Typography } from "@mui/material";
import { Link as RouterLink, useLocation } from "react-router";
import { findRouteByPath } from "../../routes";
import CustomHeader, { HeaderButton } from "./CustomHeader";

export interface HeaderOptions {
  button?: HeaderButton;
}

interface CustomPageContainerProps extends PageContainerProps {
  headerOptions?: HeaderOptions;
}

const CustomPageContainer = ({ headerOptions, ...props }: CustomPageContainerProps) => {
  const { pathname } = useLocation();
  const activePage = useActivePage();
  const route = findRouteByPath(pathname);
  const breadcrumbs = activePage?.breadcrumbs ?? [];

  return (
    <PageContainer
      {...props}
      slots={{
        header: () => (
          <>
            {breadcrumbs.length > 0 && (
              <Breadcrumbs aria-label="breadcrumb">
                {breadcrumbs.map(({ title, path }, i) =>
                  i < breadcrumbs.length - 1 && path ? (
                    <Link
                      key={path}
                      component={RouterLink}
                      to={path}
                      underline="hover"
                      color="inherit"
                    >
                      {title}
                    </Link>
                  ) : (
                    <Typography key={title} color="text.primary">
                      {title}
                    </Typography>
                  )
                )}
              </Breadcrumbs>
            )}
            <CustomHeader
              icon={route?.Icon}
              title={activePage?.title ?? ""}
              button={headerOptions?.button}
            />
          </>
        )
      }}
    />
  );
};

export default CustomPageContainer;
