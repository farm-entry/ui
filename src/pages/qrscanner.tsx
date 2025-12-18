import React, { useRef, useEffect, useState } from "react";
import QrScanner from "qr-scanner";
import { Box, Paper, Typography, Button, Stack } from "@mui/material";

export default function QRScanner() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [result, setResult] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const qrScannerRef = useRef<QrScanner | null>(null);

  useEffect(() => {
    if (!videoRef.current) return;
    const qrScanner = new QrScanner(
      videoRef.current,
      (scanResult) => {
        if (typeof scanResult === "string") {
          setResult(scanResult);
        } else if (scanResult && typeof scanResult.data === "string") {
          setResult(scanResult.data);
        } else {
          setResult(null);
        }
        setScanning(false);
        qrScanner.stop();
      },
      { returnDetailedScanResult: true }
    );
    qrScannerRef.current = qrScanner;

    handleStart();

    return () => {
      qrScanner.destroy();
      qrScannerRef.current = null;
    };
  }, []);

  const handleStart = async () => {
    setError(null);
    setResult(null);
    setScanning(true);
    try {
      await qrScannerRef.current?.start();
    } catch (err: any) {
      const error = typeof err === "string" ? err : err?.message || "Could not start scanner";
      setError(error);
      setScanning(false);
    }
  };

  const handleStop = () => {
    qrScannerRef.current?.stop();
    setScanning(false);
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
      <Paper sx={{ p: 4, maxWidth: 400, width: "100%" }} elevation={3}>
        <Stack spacing={3} alignItems="center">
          <Typography variant="h5">QR Scanner</Typography>
          <video ref={videoRef} style={{ width: "100%", borderRadius: 8 }} muted playsInline />
          <Stack direction="row" spacing={2}>
            <Button variant="contained" onClick={handleStart} disabled={scanning} color="primary">
              Start Scanning
            </Button>
            <Button variant="outlined" onClick={handleStop} disabled={!scanning} color="secondary">
              Stop
            </Button>
          </Stack>
          {result && (
            <Box mt={2} width="100%">
              <Typography variant="subtitle1" color="success.main">
                Result:
              </Typography>
              <Typography variant="body2" sx={{ wordBreak: "break-all" }}>
                {result}
              </Typography>
            </Box>
          )}
          {error && (
            <Typography color="error" variant="body2">
              Error: {error}
            </Typography>
          )}
        </Stack>
      </Paper>
    </Box>
  );
}
