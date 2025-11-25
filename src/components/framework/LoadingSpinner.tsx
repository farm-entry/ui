import { CircularProgress, Stack } from "@mui/material";

export default function LoadingSpinner() {
  return (
    <Stack alignItems="center" justifyContent="center" sx={{ minHeight: "200px" }}>
      <CircularProgress />
    </Stack>
  );
}
