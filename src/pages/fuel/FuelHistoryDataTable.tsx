import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";
import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import { useTheme } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableFooter from "@mui/material/TableFooter";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import * as React from "react";
import LoadingSpinner from "../../components/framework/LoadingSpinner";
import { FuelAssetDetails, FuelHistory } from "../../store/types/fuel";

interface TablePaginationActionsProps {
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (event: React.MouseEvent<HTMLButtonElement>, newPage: number) => void;
}

function TablePaginationActions(props: TablePaginationActionsProps) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton onClick={handleBackButtonClick} disabled={page === 0} aria-label="previous page">
        {theme.direction === "rtl" ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === "rtl" ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  }).format(amount);
};

const calculateEfficiency = (amount: number, quantity: number): string => {
  if (quantity === 0) return "N/A";
  return `$${(amount / quantity).toFixed(2)}/gal`;
};

interface Props {
  selectedAsset: FuelAssetDetails | null;
  isLoading: boolean;
}

export default function FuelHistoryDataTable({ selectedAsset: selectedFuelAsset, isLoading }: Props) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const historyData = selectedFuelAsset?.history || [];

  // Sort history by date (most recent first)
  const sortedHistory = [...historyData].sort(
    (a, b) => new Date(b.postingDate).getTime() - new Date(a.postingDate).getTime()
  );

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - sortedHistory.length) : 0;

  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!selectedFuelAsset) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6" color="text.secondary" align="center">
            Select a fuel asset to view history
          </Typography>
        </CardContent>
      </Card>
    );
  }

  if (sortedHistory.length === 0) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6" color="text.secondary" align="center">
            No fuel history available for this asset
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="fuel history table">
        <TableHead>
          <TableRow>
            <TableCell colSpan={2}>Date</TableCell>
            <TableCell>Amount</TableCell>
            <TableCell>Quantity</TableCell>
            <TableCell>Efficiency</TableCell>
            <TableCell>Odometer</TableCell>
            <TableCell>Delta</TableCell>
            <TableCell>Comments</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(rowsPerPage > 0
            ? sortedHistory.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            : sortedHistory
          ).map((record: FuelHistory, index: number) => {
            const previousRecord = sortedHistory[index + 1];
            const delta = previousRecord ? record.meta - previousRecord.meta : 0;

            return (
              <TableRow key={record.entry}>
                <TableCell colSpan={2}>{record.postingDate}</TableCell>
                <TableCell>{formatCurrency(record.amount)}</TableCell>
                <TableCell>{record.quantity} gal</TableCell>
                <TableCell>{calculateEfficiency(record.amount, record.quantity)}</TableCell>
                <TableCell align="right">{record.meta.toLocaleString()}</TableCell>
                <TableCell align="right">
                  {index === sortedHistory.length - 1 ? "N/A" : delta.toLocaleString()}
                </TableCell>
                <TableCell>{record.description}</TableCell>
              </TableRow>
            );
          })}
          {emptyRows > 0 && (
            <TableRow style={{ height: 53 * emptyRows }}>
              <TableCell colSpan={7} />
            </TableRow>
          )}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
              colSpan={7}
              count={sortedHistory.length}
              rowsPerPage={rowsPerPage}
              page={page}
              slotProps={{
                select: {
                  inputProps: {
                    "aria-label": "rows per page"
                  },
                  native: true
                }
              }}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              ActionsComponent={TablePaginationActions}
            />
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
}
