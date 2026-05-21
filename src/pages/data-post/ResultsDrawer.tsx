import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import {
  Alert,
  Box,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  Drawer,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useState } from 'react';
import { DataloadLog, parseNavError } from '../../services/dataloadApi';

interface ResultsDrawerProps {
  log: DataloadLog | null;
  loading: boolean;
  error?: string | null;
  onClose: () => void;
}

function ErrorDetailDialog({ message, onClose }: { message: string; onClose: () => void }) {
  const nav = parseNavError(message);
  return (
    <Dialog open onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Error Detail</DialogTitle>
      <DialogContent dividers>
        {nav ? (
          <Stack spacing={2}>
            <Box>
              <Typography variant="caption" color="text.secondary">Code</Typography>
              <Typography variant="body2" sx={{ fontFamily: 'monospace', wordBreak: 'break-all' }}>
                {nav.code}
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">Message</Typography>
              <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                {nav.message}
              </Typography>
            </Box>
          </Stack>
        ) : (
          <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
            {message}
          </Typography>
        )}
      </DialogContent>
    </Dialog>
  );
}

function MessageCell({ message }: { message?: string }) {
  const [open, setOpen] = useState(false);
  if (!message) return null;
  const nav = parseNavError(message);
  const label = nav ? `${nav.code}: ${nav.message}` : message;

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, width: '100%', minWidth: 0 }}>
      <Typography
        variant="body2"
        sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1, minWidth: 0 }}
        title={label}
      >
        {label}
      </Typography>
      <Tooltip title="View full error">
        <IconButton size="small" onClick={() => setOpen(true)} sx={{ flexShrink: 0 }}>
          <InfoOutlinedIcon fontSize="inherit" />
        </IconButton>
      </Tooltip>
      {open && <ErrorDetailDialog message={message} onClose={() => setOpen(false)} />}
    </Box>
  );
}

const detailColumns: GridColDef[] = [
  { field: 'rowNumber', headerName: 'Row', width: 70 },
  {
    field: 'status',
    headerName: 'Status',
    width: 100,
    renderCell: ({ value }) => (
      <Chip
        label={value}
        size="small"
        color={value === 'fulfilled' ? 'success' : 'error'}
      />
    ),
  },
  {
    field: 'message',
    headerName: 'Message',
    flex: 1,
    renderCell: ({ value }) => <MessageCell message={value} />,
  },
];

export default function ResultsDrawer({ log, loading, error, onClose }: ResultsDrawerProps) {
  return (
    <Drawer
      anchor="right"
      open={!!log || loading || !!error}
      onClose={onClose}
      PaperProps={{ sx: { width: { xs: '100%', sm: 560 }, p: 3, overflowY: 'auto' } }}
    >
      {error && <Alert severity="error">{error}</Alert>}

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', pt: 8 }}>
          <Typography color="text.secondary">Loading…</Typography>
        </Box>
      )}

      {log && (
        <Stack spacing={2}>
          <Typography variant="h6" noWrap title={log.filename}>
            {log.filename}
          </Typography>

          <Stack direction="row" spacing={1} flexWrap="wrap">
            <Chip label={log.domain} size="small" />
            <Chip label={log.entitySet} size="small" variant="outlined" />
            <Chip label={`${log.count} rows`} size="small" variant="outlined" />
            <Chip
              label={`${log.errorCount} error${log.errorCount !== 1 ? 's' : ''}`}
              size="small"
              color={log.errorCount === 0 ? 'success' : 'error'}
            />
          </Stack>

          <Typography variant="caption" color="text.secondary">
            {new Date(log.createdAt).toLocaleString()} · {log.user}
          </Typography>

          {log.errorCount > 0 && (
            <Alert severity="warning">
              {log.errorCount} row{log.errorCount !== 1 ? 's' : ''} failed to post.
            </Alert>
          )}

          <DataGrid
            rows={log.results ?? []}
            columns={detailColumns}
            getRowId={(r) => r.rowNumber}
            autoHeight
            hideFooter={(log.results?.length ?? 0) <= 100}
            pageSizeOptions={[100]}
            density="compact"
          />
        </Stack>
      )}
    </Drawer>
  );
}
