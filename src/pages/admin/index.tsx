import { AdminPanelSettings } from "@mui/icons-material";
import { Stack } from "@mui/material";
import { useEffect, useState } from "react";
import CustomHeader from "../../components/framework/CustomHeader";
import { useAdminStore } from "../../store/adminStore";
import { useConfirmationStore } from "../../store/confirmationStore";
import { UserType } from "../../store/types/user";
import { useUserStore } from "../../store/userStore";
import ResetPasswordDialog from "./ResetPasswordDialog";
import UserDialog, { UserDialogSubmitData } from "./UserDialog";
import UsersTable from "./UsersTable";

export default function AdminPage() {
  const { domain } = useUserStore();
  const {
    users,
    domains,
    fetchUsers,
    fetchDomains,
    createUser,
    updateUser,
    deleteUser,
    resetPassword
  } = useAdminStore();

  const showConfirmation = useConfirmationStore((state) => state.showConfirmation);

  const [dialogUser, setDialogUser] = useState<UserType | "add" | null>(null);
  const [resetUser, setResetUser] = useState<UserType | null>(null);

  useEffect(() => {
    fetchDomains();
  }, []);
  useEffect(() => {
    if (domain) fetchUsers(domain);
  }, [domain]);

  const handleSubmit = async (data: UserDialogSubmitData) => {
    if (dialogUser === "add") {
      await createUser({ ...data, role: data.role ?? "user" });
    } else if (dialogUser?.username) {
      await updateUser(dialogUser.username, data);
    }
  };

  const handleDelete = (user: UserType) => {
    showConfirmation(
      "Delete User",
      `Are you sure you want to delete ${user.username}? This cannot be undone.`,
      () => deleteUser(user.username)
    );
  };

  return (
    <Stack sx={{ p: 3 }}>
      <CustomHeader
        icon={AdminPanelSettings}
        title="User Management"
        button={{ label: "Add User", onClick: () => setDialogUser("add"), variant: "contained" }}
      />

      <Stack spacing={2}>
        <UsersTable
          users={users}
          onEdit={setDialogUser}
          onResetPassword={setResetUser}
          onDelete={handleDelete}
        />

        <UserDialog
          open={Boolean(dialogUser)}
          onClose={() => setDialogUser(null)}
          onSubmit={handleSubmit}
          user={dialogUser !== "add" && dialogUser ? dialogUser : undefined}
        />

        <ResetPasswordDialog
          user={resetUser}
          onClose={() => setResetUser(null)}
          onReset={resetPassword}
        />

      </Stack>
    </Stack>
  );
}
