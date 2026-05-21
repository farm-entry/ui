import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import {
  Alert,
  Box,
  Button,
  Card,
  CircularProgress,
  Divider,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography,
} from "@mui/material";
import { useRef, useState } from "react";
import { useUserStore } from "../../store/userStore";
import { dataloadApi, DataloadLog } from "../../services/dataloadApi";
import ResultsDrawer from "./ResultsDrawer";

type StepStatus = "idle" | "loading" | "success" | "error";

interface UploadStep {
  label: string;
  status: StepStatus;
  error?: string;
}

const STEP_LABELS = [
  "Validate filename",
  "Validate CSV headers",
  "Upload to S3",
  "Post to Business Central",
];

const initialSteps = (): UploadStep[] =>
  STEP_LABELS.map((label) => ({ label, status: "idle" }));

function parseHeaders(text: string): string[] {
  const firstLine = text.split("\n")[0] ?? "";
  return firstLine.split(",").map((h) => h.trim().replace(/^"|"$/g, ""));
}

function validateHeaders(headers: string[]): boolean {
  return headers.length > 0 && headers.every((h) => /^[ids]\$/.test(h));
}

function extractEntitySet(filename: string): string {
  const parts = filename.replace(/\.csv$/i, "").split("_");
  return parts[0] ?? "";
}

export default function UploadBox() {
  const { domain } = useUserStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [entitySet, setEntitySet] = useState("");
  const [steps, setSteps] = useState<UploadStep[]>(initialSteps());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [lastLogId, setLastLogId] = useState<string | null>(null);
  const [selectedLog, setSelectedLog] = useState<DataloadLog | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [openDetailError, setOpenDetailError] = useState<string | null>(null);

  const updateStep = (index: number, status: StepStatus, error?: string) =>
    setSteps((prev) => prev.map((s, i) => (i === index ? { ...s, status, error } : s)));

  const activeStep = (() => {
    const loading = steps.findIndex((s) => s.status === "loading");
    if (loading !== -1) return loading;
    const error = steps.findIndex((s) => s.status === "error");
    if (error !== -1) return error;
    return steps.findIndex((s) => s.status === "idle");
  })();

  const allDone = steps.every((s) => s.status === "success");
  const errorStep = steps.find((s) => s.status === "error");
  const started = steps.some((s) => s.status !== "idle");

  const openDetail = async () => {
    if (!lastLogId) return;
    setDetailLoading(true);
    setSelectedLog(null);
    setOpenDetailError(null);
    try {
      const log = await dataloadApi.getLog(lastLogId);
      setSelectedLog(log);
    } catch {
      setOpenDetailError("Failed to load upload detail");
    } finally {
      setDetailLoading(false);
    }
  };

  const selectFile = (f: File) => {
    if (!f.name.toLowerCase().endsWith(".csv")) return;
    setFile(f);
    setEntitySet(extractEntitySet(f.name));
    setSteps(initialSteps());
    setSuccessMsg(null);
    setLastLogId(null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f) selectFile(f);
  };

  const handleClear = () => {
    setFile(null);
    setEntitySet("");
    setSteps(initialSteps());
    setSuccessMsg(null);
    setLastLogId(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async () => {
    if (!file || !entitySet || !domain || isSubmitting) return;
    setIsSubmitting(true);
    setSteps(initialSteps());
    setSuccessMsg(null);

    updateStep(0, "loading");
    await new Promise((r) => setTimeout(r, 200));
    const prefix = file.name.split("_")[0] ?? "";
    if (!prefix) {
      updateStep(0, "error", "Filename must have a prefix before the first underscore");
      setIsSubmitting(false);
      return;
    }
    updateStep(0, "success");

    updateStep(1, "loading");
    let text: string;
    try {
      text = await file.text();
    } catch {
      updateStep(1, "error", "Could not read file");
      setIsSubmitting(false);
      return;
    }
    const headers = parseHeaders(text);
    if (!validateHeaders(headers)) {
      updateStep(1, "error", "Headers must follow the format: i$FieldName, d$FieldName, s$FieldName");
      setIsSubmitting(false);
      return;
    }
    updateStep(1, "success");

    updateStep(2, "loading");
    let s3Key: string;
    try {
      const { url, key } = await dataloadApi.getPresignedUrl(file.name);
      s3Key = key;
      await dataloadApi.uploadToS3(url, file);
      updateStep(2, "success");
    } catch (err) {
      updateStep(2, "error", err instanceof Error ? err.message : "Upload failed");
      setIsSubmitting(false);
      return;
    }

    updateStep(3, "loading");
    try {
      const result = await dataloadApi.processUpload(file.name, s3Key, entitySet);
      updateStep(3, "success");
      setLastLogId(result.id);
      setSuccessMsg(
        `Done — ${result.count} rows posted, ${result.errorCount} error${result.errorCount !== 1 ? "s" : ""}.`
      );
    } catch (err) {
      updateStep(3, "error", err instanceof Error ? err.message : "Processing failed");
    }

    setIsSubmitting(false);
  };

  return (
    <>
      <Card variant="outlined" sx={{ p: 3, maxWidth: 560 }}>
        {!file && (
          <Box
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            tabIndex={0}
            role="button"
            aria-label="Select CSV file"
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") fileInputRef.current?.click(); }}
            sx={{
              border: 2,
              borderStyle: "dashed",
              borderColor: dragOver ? "primary.main" : "divider",
              borderRadius: 2,
              py: 6,
              textAlign: "center",
              cursor: "pointer",
              bgcolor: dragOver ? "action.hover" : "transparent",
              transition: "border-color 0.2s, background 0.2s",
              "&:focus-visible": { outline: "2px solid", outlineColor: "primary.main" },
            }}
          >
            <CloudUploadIcon sx={{ fontSize: 48, color: "text.secondary", mb: 1 }} />
            <Typography variant="body1" color="text.secondary">
              Drag & drop a CSV file here, or click to select
            </Typography>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              hidden
              onChange={(e) => { const f = e.target.files?.[0]; if (f) selectFile(f); }}
            />
          </Box>
        )}

        {file && (
          <>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              File
            </Typography>
            <Typography variant="body2" sx={{ mb: 2, wordBreak: "break-all" }}>
              {file.name}
            </Typography>

            <TextField
              label="Entity Set"
              size="small"
              fullWidth
              value={entitySet}
              onChange={(e) => setEntitySet(e.target.value)}
              disabled={isSubmitting}
              helperText="Derived from filename — edit if needed"
              sx={{ mb: 1 }}
            />

            {domain && (
              <Typography variant="caption" color="text.secondary">
                Domain: <strong>{domain}</strong>
              </Typography>
            )}

            <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
              <Button
                variant="contained"
                disabled={!entitySet || !domain || isSubmitting}
                onClick={handleSubmit}
              >
                {isSubmitting ? "Submitting…" : "Submit"}
              </Button>
              <Button variant="outlined" color="error" onClick={handleClear} disabled={isSubmitting}>
                Clear
              </Button>
            </Box>
          </>
        )}

        {file && started && (
          <>
            <Divider sx={{ my: 3 }} />
            <Stepper activeStep={activeStep} orientation="vertical">
              {steps.map((step) => (
                <Step key={step.label} completed={step.status === "success"}>
                  <StepLabel
                    error={step.status === "error"}
                    StepIconComponent={
                      step.status === "loading"
                        ? () => (
                            <Box sx={{ display: "flex", alignItems: "center", width: 24, height: 24 }}>
                              <CircularProgress size={20} />
                            </Box>
                          )
                        : undefined
                    }
                    optional={
                      step.status === "error" && step.error ? (
                        <Typography variant="caption" color="error">
                          {step.error}
                        </Typography>
                      ) : undefined
                    }
                  >
                    {step.label}
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
          </>
        )}

        {allDone && successMsg && (
          <Alert
            severity="success"
            sx={{ mt: 2 }}
            action={
              lastLogId ? (
                <Button color="inherit" size="small" onClick={openDetail}>
                  View
                </Button>
              ) : undefined
            }
          >
            {successMsg}
          </Alert>
        )}
        {errorStep && !allDone && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {errorStep.error}
          </Alert>
        )}
      </Card>

      {!domain && (
        <Alert severity="warning" sx={{ mt: 2, maxWidth: 560 }}>
          No domain is set for your account. Contact an administrator.
        </Alert>
      )}

      <ResultsDrawer
        log={selectedLog}
        loading={detailLoading}
        error={openDetailError}
        onClose={() => { setSelectedLog(null); setOpenDetailError(null); }}
      />
    </>
  );
}
