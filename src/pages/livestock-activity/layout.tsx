import { PageContainer } from "@toolpad/core";
import { Outlet } from "react-router";

export default function LivestockActivityLayout() {
  return (
    <PageContainer>
      <Outlet />;
    </PageContainer>
  );
}
