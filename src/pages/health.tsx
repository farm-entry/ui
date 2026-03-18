import { CheckCircle, ErrorOutline, Refresh } from "@mui/icons-material";
import { Box, Button, CircularProgress, Container, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { HealthData, pingApi } from "../services/pingApi";

const toMB = (bytes: number) => (bytes / 1024 / 1024).toFixed(1);

const formatUptime = (seconds: number) => {
  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return [d && `${d}d`, h && `${h}h`, m && `${m}m`, `${s}s`].filter(Boolean).join(" ");
};

export default function HealthPage() {
  const [data, setData] = useState<HealthData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHealth = () => {
    setLoading(true);
    setError(null);
    pingApi
      .fetchHealth()
      .then((json) => setData(json))
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchHealth();
  }, []);

  const isHealthy = data?.status === "healthy";

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          textAlign: "center",
          gap: 3
        }}
      >
        {loading && <CircularProgress size={48} />}

        {!loading && error && (
          <>
            <ErrorOutline sx={{ fontSize: "6rem" }} color="error" />
            <Typography variant="h5">Unable to reach server</Typography>
            <Typography variant="body1" color="text.secondary">
              {error}
            </Typography>
          </>
        )}

        {!loading && data && (
          <>
            {isHealthy ? (
              <CheckCircle sx={{ fontSize: "6rem" }} color="success" />
            ) : (
              <ErrorOutline sx={{ fontSize: "6rem" }} color="error" />
            )}

            <Typography
              variant="h4"
              fontWeight={700}
              color={isHealthy ? "success.main" : "error.main"}
            >
              {data.status.toUpperCase()}
            </Typography>

            <Stack spacing={1} sx={{ width: "100%", textAlign: "left" }}>
              <Row label="Timestamp" value={new Date(data.timestamp).toLocaleString()} />
              <Row label="Uptime" value={formatUptime(data.uptime)} />
              <Row label="Heap Used" value={`${toMB(data.memory.heapUsed)} MB`} />
              <Row label="Heap Total" value={`${toMB(data.memory.heapTotal)} MB`} />
              <Row label="RSS" value={`${toMB(data.memory.rss)} MB`} />
            </Stack>
          </>
        )}

        <Button variant="outlined" startIcon={<Refresh />} onClick={fetchHealth} disabled={loading}>
          Refresh
        </Button>
      </Box>
    </Container>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <Box sx={{ display: "flex", justifyContent: "space-between", py: 0.5 }}>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body2" fontWeight="medium">
        {value}
      </Typography>
    </Box>
  );
}
