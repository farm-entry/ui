import { AdminPanelSettings, Add, Delete, LockReset } from "@mui/icons-material";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { authApi } from "../../services/userApi";
import { tokenStorage } from "../../services/tokenStorage";
import { useAdminStore } from "../../store/adminStore";
import { useUserStore } from "../../store/userStore";

export default function AdminPage() {
  const { domain, setUserDomain } = useUserStore();
  const { users, domains, fetchUsers, fetchDomains, createUser, deleteUser, resetPassword } = useAdminStore();

  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [resetDialogUserId, setResetDialogUserId] = useState<string | null>(null);
  const [deleteDialogUserId, setDeleteDialogUserId] = useState<string | null>(null);

  // Add user form state
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState<'user' | 'admin'>('user');

  // Reset password form state
  const [newPasswordValue, setNewPasswordValue] = useState('');

  useEffect(() => {
    fetchDomains();
  }, []);

  useEffect(() => {
    if (domain) fetchUsers(domain);
  }, [domain]);

  const handleDomainSwitch = async (newDomain: string) => {
    const { accessToken } = await authApi.switchDomain(newDomain);
    const refresh = tokenStorage.getRefresh()!;
    tokenStorage.set(accessToken, refresh);
    setUserDomain(newDomain);
  };

  const handleAddUser = async () => {
    if (!domain) return;
    await createUser({ email: newEmail, password: newPassword, role: newRole, domain });
    setAddDialogOpen(false);
    setNewEmail('');
    setNewPassword('');
    setNewRole('user');
  };

  const handleResetPassword = async () => {
    if (!resetDialogUserId) return;
    await resetPassword(resetDialogUserId, newPasswordValue);
    setResetDialogUserId(null);
    setNewPasswordValue('');
  };

  const handleDeleteUser = async () => {
    if (!deleteDialogUserId) return;
    await deleteUser(deleteDialogUserId);
    setDeleteDialogUserId(null);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box display="flex" alignItems="center" gap={1} mb={3}>
        <AdminPanelSettings />
        <Typography variant="h5">Admin Console</Typography>
      </Box>

      {/* Domain Switcher */}
      <Box mb={3}>
        <FormControl size="small" sx={{ minWidth: 240 }}>
          <InputLabel>Active Domain</InputLabel>
          <Select
            value={domain ?? ''}
            label="Active Domain"
            onChange={(e) => handleDomainSwitch(e.target.value)}
          >
            {domains.map((d) => (
              <MenuItem key={d} value={d}>{d}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* User Table */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
        <Typography variant="h6">Users — {domain}</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => setAddDialogOpen(true)} size="small">
          Add User
        </Button>
      </Box>

      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Email</TableCell>
            <TableCell>Role</TableCell>
            <TableCell>Active</TableCell>
            <TableCell>Last Login</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell>{user.isActive ? 'Yes' : 'No'}</TableCell>
              <TableCell>{user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString() : '—'}</TableCell>
              <TableCell align="right">
                <Tooltip title="Reset Password">
                  <IconButton size="small" onClick={() => setResetDialogUserId(user.id)}>
                    <LockReset fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete User">
                  <IconButton size="small" color="error" onClick={() => setDeleteDialogUserId(user.id)}>
                    <Delete fontSize="small" />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
          {users.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} align="center">No users found</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Add User Dialog */}
      <Dialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Add User</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
          <TextField label="Email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} fullWidth size="small" />
          <TextField label="Password" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} fullWidth size="small" />
          <FormControl size="small" fullWidth>
            <InputLabel>Role</InputLabel>
            <Select value={newRole} label="Role" onChange={(e) => setNewRole(e.target.value as 'user' | 'admin')}>
              <MenuItem value="user">User</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleAddUser} disabled={!newEmail || !newPassword}>Add</Button>
        </DialogActions>
      </Dialog>

      {/* Reset Password Dialog */}
      <Dialog open={Boolean(resetDialogUserId)} onClose={() => setResetDialogUserId(null)} maxWidth="xs" fullWidth>
        <DialogTitle>Reset Password</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <TextField label="New Password" type="password" value={newPasswordValue} onChange={(e) => setNewPasswordValue(e.target.value)} fullWidth size="small" />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setResetDialogUserId(null)}>Cancel</Button>
          <Button variant="contained" onClick={handleResetPassword} disabled={!newPasswordValue}>Reset</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirm Dialog */}
      <Dialog open={Boolean(deleteDialogUserId)} onClose={() => setDeleteDialogUserId(null)}>
        <DialogTitle>Delete User</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this user? This cannot be undone.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogUserId(null)}>Cancel</Button>
          <Button variant="contained" color="error" onClick={handleDeleteUser}>Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
