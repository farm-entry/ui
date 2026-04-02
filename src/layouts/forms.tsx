import { Card } from "@mui/material";
import * as React from "react";
import { useNavigate } from "react-router";
import CustomConfirmation from "../components/framework/CustomConfirmation";
import CustomNotice from "../components/framework/CustomNotice";
import CustomPageContainer, { HeaderOptions } from "../components/framework/CustomPageContainer";
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
  const navigate = useNavigate();
  const showConfirmation = useConfirmationStore((state) => state.showConfirmation);
  // const handleExit = () => {
  //   showConfirmation(
  //     "Are you sure?",
  //     "Do you want to exit this form? Any unsaved changes will be lost.",
  //     () => navigate("/")
  //   );
  // };

  return (
    <>
      <CustomPageContainer headerOptions={headerOptions}>
        {notice && <CustomNotice<T> formType={notice.formType} onLoad={notice.onLoad} />}

        {/* <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ my: 1 }}>
        <Button variant="text" color="primary" onClick={handleExit}>
          Exit
        </Button>
      </Stack> */}
        <Card variant="outlined" sx={{ mt: 0, mb: 2, p: 2 }}>
          {children}
        </Card>
        <CustomConfirmation />
        {/* <Stack direction="row" spacing={2} justifyContent="center" sx={{ mb: 2 }}>
        <Tooltip title="Exit">
          <Button variant="text" color="primary" fullWidth onClick={handleExit}>
            Cancel
          </Button>
        </Tooltip>
      </Stack> */}
      </CustomPageContainer>
    </>
  );
}
