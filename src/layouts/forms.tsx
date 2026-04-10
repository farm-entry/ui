import { Card } from "@mui/material";
import * as React from "react";
import { useLocation, useNavigate } from "react-router";
import { FormAnalyticsContext, useFormAnalytics } from "../analytics";
import CustomConfirmation from "../components/framework/CustomConfirmation";
import CustomNotice from "../components/framework/CustomNotice";
import CustomPageContainer, { HeaderOptions } from "../components/framework/CustomPageContainer";
import { Button } from "../components/inputs";
import { useConfirmationStore } from "../store/confirmationStore";

// This is meant to be used as a subset of the dashboard layout
// It wraps all forms and standardizes screen size, putting each form component into a card.

interface CustomFormsLayoutProps<T> {
  children: React.ReactNode;
  notice?: {
    formType: string;
    onLoad: (data: T) => void;
  };
  headerOptions?: HeaderOptions;
}

export default function CustomFormsLayout<T>({
  children,
  notice,
  headerOptions
}: CustomFormsLayoutProps<T>) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const showConfirmation = useConfirmationStore((s) => s.showConfirmation);
  const formName = pathname.split("/").filter(Boolean).pop() ?? "unknown";
  useFormAnalytics(formName);

  const handleCancel = () => {
    showConfirmation("Cancel", "Are you sure you want to cancel?", () => navigate("/"));
  };

  return (
    <FormAnalyticsContext.Provider value={{ formName }}>
      <CustomPageContainer headerOptions={headerOptions}>
        {notice && <CustomNotice<T> formType={notice.formType} onLoad={notice.onLoad} />}
        <Card variant="outlined" sx={{ mt: 0, mb: 2, p: 2 }}>
          {children}
        </Card>
        <CustomConfirmation />
        <Button variant="text" onClick={handleCancel}>Cancel</Button>
      </CustomPageContainer>
    </FormAnalyticsContext.Provider>
  );
}
