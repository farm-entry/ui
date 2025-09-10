import { CheckCircle, Code, Person, Router, Security } from "@mui/icons-material";
import { Alert, Box, Button, Divider, List, ListItem, ListItemIcon, ListItemText, Paper, Stack, Typography } from "@mui/material";
import { PageContainer } from "@toolpad/core";
import { useState } from "react";
import UserPermissionDemo from "../components/UserPermissionDemo";

export const RouteProtectionGuide = () => {
  const [showImplementation, setShowImplementation] = useState(false);

  return (
    <PageContainer>
      <Box sx={{ p: 3 }}>
        <Paper sx={{ p: 4, mb: 3 }}>
          <Box display="flex" alignItems="center" mb={3}>
            <Security sx={{ fontSize: 32, mr: 2 }} color="primary" />
            <Typography variant="h4">Route Protection Implementation Guide</Typography>
          </Box>

          <Alert severity="info" sx={{ mb: 3 }}>
            This guide shows how to make routes dependent on userInfo API results using React Router and Zustand state management.
          </Alert>

          <Divider sx={{ mb: 3 }} />

          <Typography variant="h5" gutterBottom>
            Key Components Created:
          </Typography>

          <List>
            <ListItem>
              <ListItemIcon>
                <Security color="primary" />
              </ListItemIcon>
              <ListItemText primary="RouteGuard Component" secondary="Protects routes by checking user permissions and loading user data at app startup" />
            </ListItem>

            <ListItem>
              <ListItemIcon>
                <Router color="primary" />
              </ListItemIcon>
              <ListItemText primary="Dynamic Navigation Hook" secondary="Generates navigation menu based on user permissions from userInfo API" />
            </ListItem>

            <ListItem>
              <ListItemIcon>
                <Person color="primary" />
              </ListItemIcon>
              <ListItemText primary="User Store Integration" secondary="Zustand store manages user data and menu options with permission-based filtering" />
            </ListItem>
          </List>

          <Divider sx={{ mb: 3 }} />

          <Typography variant="h5" gutterBottom>
            How It Works:
          </Typography>

          <Stack spacing={2} sx={{ mb: 3 }}>
            <Box display="flex" alignItems="center">
              <CheckCircle color="success" sx={{ mr: 1 }} />
              <Typography>1. App loads and RouteGuard fetches user info from userOptionsApi</Typography>
            </Box>
            <Box display="flex" alignItems="center">
              <CheckCircle color="success" sx={{ mr: 1 }} />
              <Typography>2. User permissions are stored in Zustand store</Typography>
            </Box>
            <Box display="flex" alignItems="center">
              <CheckCircle color="success" sx={{ mr: 1 }} />
              <Typography>3. Navigation menu is dynamically generated based on user permissions</Typography>
            </Box>
            <Box display="flex" alignItems="center">
              <CheckCircle color="success" sx={{ mr: 1 }} />
              <Typography>4. Routes are protected - unauthorized access redirects to home</Typography>
            </Box>
            <Box display="flex" alignItems="center">
              <CheckCircle color="success" sx={{ mr: 1 }} />
              <Typography>5. Menu options marked as "hidden: true" are not shown and routes are blocked</Typography>
            </Box>
          </Stack>

          <Button variant="outlined" startIcon={<Code />} onClick={() => setShowImplementation(!showImplementation)} sx={{ mb: 2 }}>
            {showImplementation ? "Hide" : "Show"} Implementation Details
          </Button>

          {showImplementation && (
            <Paper sx={{ p: 3, bgcolor: "grey.50" }}>
              <Typography variant="h6" gutterBottom>
                Implementation Files:
              </Typography>

              <Stack spacing={2}>
                <Box>
                  <Typography variant="subtitle1" color="primary">
                    📁 src/components/RouteGuard.tsx
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Loads user data on app startup and protects routes based on permissions
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="subtitle1" color="primary">
                    📁 src/hooks/useDynamicNavigation.tsx
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Generates navigation menu dynamically based on user permissions
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="subtitle1" color="primary">
                    📁 src/main-protected.tsx
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Protected router configuration with RouteGuard wrapping protected routes
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="subtitle1" color="primary">
                    📁 src/services/userOptionsApi.ts
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    API service for fetching user information and permissions
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="subtitle1" color="primary">
                    📁 src/mock/userOptionsLimited.json
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Example user with limited permissions for testing
                  </Typography>
                </Box>
              </Stack>
            </Paper>
          )}

          <Divider sx={{ my: 3 }} />

          <Alert severity="warning">
            <Typography variant="body2">
              <strong>To enable route protection:</strong> Replace the import in main.tsx from "./main.tsx" to "./main-protected.tsx" to activate the protected routing system.
            </Typography>
          </Alert>
        </Paper>
      </Box>
      <UserPermissionDemo />
    </PageContainer>
  );
};

export default RouteProtectionGuide;
