import { Box, CircularProgress } from "@mui/material";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

export default function DenseTable({
  rows = [],
  columns = [],
  loading = false,
}: {
  rows?: any[];
  columns?: { field: string; headerName: string; flex: number }[];
  loading?: boolean;
}) {
  return (
    <TableContainer component={Paper}>
      <Table size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell key={column.field} style={{ flex: column.flex }}>
                {column.headerName}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {loading && (
            <TableRow>
              <TableCell colSpan={columns.length} align="center">
                <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
                  <CircularProgress size={24} />
                </Box>
              </TableCell>
            </TableRow>
          )}
          {!loading &&
            rows.map((row) => (
              <TableRow key={row.name} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                {columns.map((column) => (
                  <TableCell key={column.field}>{row[column.field]}</TableCell>
                ))}
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
