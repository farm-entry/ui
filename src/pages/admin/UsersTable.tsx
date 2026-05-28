import { Delete, Edit, LockReset, TuneOutlined } from "@mui/icons-material";
import { Box, IconButton, Tooltip } from "@mui/material";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { UserType } from "../../store/types/user";

interface UsersTableProps {
  users: UserType[];
  onEdit: (user: UserType) => void;
  onResetPassword: (user: UserType) => void;
  onDelete: (user: UserType) => void;
  onManageFilters: (user: UserType) => void;
}

const columns = (
  onEdit: (u: UserType) => void,
  onResetPassword: (u: UserType) => void,
  onDelete: (u: UserType) => void,
  onManageFilters: (u: UserType) => void
): GridColDef<UserType>[] => [
  { field: "username", headerName: "Username", width: 160 },
  { field: "email", headerName: "Email", width: 220 },
  { field: "firstName", headerName: "First Name", width: 130 },
  { field: "lastName", headerName: "Last Name", width: 130 },
  { field: "domain", headerName: "Domain", width: 130 },
  { field: "role", headerName: "Role", width: 110 },
  {
    field: "loginTime",
    headerName: "Last Login",
    width: 160,
    valueFormatter: (value) => (value ? new Date(value as string).toLocaleString() : "—")
  },
  {
    field: "actions",
    headerName: "Actions",
    width: 165,
    sortable: false,
    filterable: false,
    renderCell: (params: GridRenderCellParams<UserType>) => (
      <Box>
        <Tooltip title="Edit User">
          <IconButton size="small" onClick={() => onEdit(params.row)}>
            <Edit fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Reset Password">
          <IconButton size="small" onClick={() => onResetPassword(params.row)}>
            <LockReset fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Manage Filters">
          <IconButton size="small" onClick={() => onManageFilters(params.row)}>
            <TuneOutlined fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete User">
          <IconButton size="small" color="error" onClick={() => onDelete(params.row)}>
            <Delete fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
    )
  }
];

export default function UsersTable({ users, onEdit, onResetPassword, onDelete, onManageFilters }: UsersTableProps) {
  return (
    <Box sx={{ height: 500, width: "100%" }}>
      <DataGrid
        rows={users}
        columns={columns(onEdit, onResetPassword, onDelete, onManageFilters)}
        getRowId={(row) => row.username}
        showToolbar
        initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
        pageSizeOptions={[10, 25, 50]}
        disableRowSelectionOnClick
      />
    </Box>
  );
}
