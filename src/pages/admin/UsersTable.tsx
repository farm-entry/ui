import { Edit } from "@mui/icons-material";
import { Box, IconButton, Tooltip } from "@mui/material";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { UserType } from "../../store/types/user";

interface UsersTableProps {
  users: UserType[];
  onEdit: (user: UserType) => void;
  onManageFilters: (user: UserType) => void;
}

const columns = (
  onEdit: (u: UserType) => void,
): GridColDef<UserType>[] => [
  {
    field: "actions",
    headerName: "",
    width: 50,
    minWidth: 50,
    sortable: false,
    filterable: false,
    disableColumnMenu: true,
    renderCell: (params: GridRenderCellParams<UserType>) => (
      <Tooltip title="Edit User">
        <IconButton size="small" onClick={() => onEdit(params.row)}>
          <Edit fontSize="small" />
        </IconButton>
      </Tooltip>
    )
  },
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
];

export default function UsersTable({ users, onEdit, onManageFilters }: UsersTableProps) {
  return (
    <Box sx={{ height: 500, width: "100%" }}>
      <DataGrid
        rows={users}
        columns={columns(onEdit)}
        getRowId={(row) => row.username}
        showToolbar
        initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
        pageSizeOptions={[10, 25, 50]}
        disableRowSelectionOnClick
      />
    </Box>
  );
}
