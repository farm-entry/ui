import { Typography } from "@mui/material";
import CustomFormsLayout from "../../layouts/forms";

export default function JobHeaderUpdatesPage() {
  return (
    <CustomFormsLayout>
      <Typography variant="h4" gutterBottom>
        Welcome!
      </Typography>
      <Typography variant="body1">Manage and update job headers here.</Typography>
    </CustomFormsLayout>
  );
}
