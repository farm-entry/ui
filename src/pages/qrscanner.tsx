import { Box, Button, Stack, Typography } from "@mui/material";
import { PageContainer } from "@toolpad/core";
import QrScanner from "qr-scanner";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { UrlParseFromQR } from "../utils/qrcode";

export default function QRScanner() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [result, setResult] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const qrScannerRef = useRef<QrScanner | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!videoRef.current) return;
    const qrScanner = new QrScanner(
      videoRef.current,
      (scanResult) => {
        if (typeof scanResult === "string") {
          const url = UrlParseFromQR(scanResult);
          url ? navigate(url) : setError("QR Code read. No valid route found.");
        } else if (scanResult && typeof scanResult.data === "string") {
          const url = UrlParseFromQR(scanResult.data);
          url ? navigate(url) : setError("QR Code read. No valid route found.");
        } else {
          setError("QR Code read. Unable to parse QR Code.");
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
    <PageContainer>
      <Box display="flex" justifyContent="center" alignItems="center">
        <Stack spacing={3} alignItems="center">
          <Box
            sx={{
              maxWidth: 400,
              width: "100%",
              aspectRatio: "1 / 1",
              overflow: "hidden",
              borderRadius: 1,
              border: "2px solid",
              borderColor: "divider",
              position: "relative"
            }}
          >
            <video
              ref={videoRef}
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              muted
              playsInline
            />
            {!scanning && (
              <Box
                sx={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: "rgba(0,0,0,0.5)"
                }}
              >
                <Typography color="white" variant="subtitle1">
                  Not scanning
                </Typography>
              </Box>
            )}
          </Box>
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
      </Box>
    </PageContainer>
  );
}
