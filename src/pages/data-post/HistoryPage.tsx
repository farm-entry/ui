import {
  Alert,
  Button,
  Chip,
  Typography,
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useCallback, useEffect, useState } from 'react';
import CustomPageContainer from '../../components/framework/CustomPageContainer';
import { dataloadApi, DataloadLog } from '../../services/dataloadApi';
import ResultsDrawer from './ResultsDrawer';

export default function DataPostHistoryPage() {
  const [logs, setLogs] = useState<DataloadLog[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedLog, setSelectedLog] = useState<DataloadLog | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await dataloadApi.getLogs();
      setLogs(data.items);
      setTotal(data.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load history');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const openDetail = async (logId: string) => {
    setDetailLoading(true);
    setSelectedLog(null);
    try {
      const log = await dataloadApi.getLog(logId);
      setSelectedLog(log);
    } catch {
      setError('Failed to load log detail');
    } finally {
      setDetailLoading(false);
    }
  };

  const columns: GridColDef<DataloadLog>[] = [
    { field: 'filename', headerName: 'File', flex: 2, minWidth: 180 },
    { field: 'domain', headerName: 'Domain', width: 110 },
    { field: 'entitySet', headerName: 'Entity Set', width: 130 },
    { field: 'count', headerName: 'Rows', width: 70 },
    {
      field: 'errorCount',
      headerName: 'Errors',
      width: 80,
      renderCell: ({ value }) => (
        <Chip
          label={value}
          size="small"
          color={value === 0 ? 'success' : 'error'}
          sx={{ fontWeight: 600 }}
        />
      ),
    },
    {
      field: 'createdAt',
      headerName: 'Uploaded',
      flex: 1,
      minWidth: 160,
      valueFormatter: (value: string) => new Date(value).toLocaleString(),
    },
    {
      field: 'actions',
      headerName: '',
      width: 70,
      sortable: false,
      renderCell: ({ row }) => (
        <Button size="small" onClick={() => openDetail(row._id)}>
          View
        </Button>
      ),
    },
  ];

  return (
    <CustomPageContainer
      headerOptions={{
        title: 'Upload History',
        button: { label: 'Refresh', onClick: fetchLogs, variant: 'outlined' },
      }}
    >
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Typography variant="caption" color="text.secondary">
        {total} total upload{total !== 1 ? 's' : ''}
      </Typography>

      <DataGrid
        rows={logs}
        columns={columns}
        getRowId={(row) => row._id}
        loading={loading}
        autoHeight
        pageSizeOptions={[25, 50]}
        initialState={{ pagination: { paginationModel: { pageSize: 25 } } }}
        sx={{ mt: 1 }}
        disableRowSelectionOnClick
      />

      <ResultsDrawer
        log={selectedLog}
        loading={detailLoading}
        onClose={() => setSelectedLog(null)}
      />
    </CustomPageContainer>
  );
}
