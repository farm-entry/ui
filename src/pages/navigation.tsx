import React from "react";
import { Stack, Typography, Paper, Container, Box } from "@mui/material";
import { PageContainer } from "@toolpad/core/PageContainer";
import AddIcon from "@mui/icons-material/Add";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";
import { Button, StackedButton } from "../components/inputs";

export default function Navigation() {
  return (
    <PageContainer>
      <Container maxWidth="md">
        <Stack spacing={3}>
          <Paper sx={{ p: 3 }}>
            <Stack spacing={3}>
              <Typography variant="h6">Button Variants</Typography>

              <Stack spacing={3}>
                <Box>
                  <Typography variant="subtitle1" gutterBottom>
                    Primary Buttons
                  </Typography>
                  <Stack direction="row" spacing={2}>
                    <Button variant="contained">Primary</Button>
                    <Button variant="contained" startIcon={<AddIcon />}>
                      With Icon
                    </Button>
                  </Stack>
                </Box>

                <Box>
                  <Typography variant="subtitle1" gutterBottom>
                    Secondary Buttons
                  </Typography>
                  <Stack direction="row" spacing={2}>
                    <Button variant="outlined">Secondary</Button>
                    <Button variant="outlined" startIcon={<SaveIcon />}>
                      With Icon
                    </Button>
                  </Stack>
                </Box>

                <Box>
                  <Typography variant="subtitle1" gutterBottom>
                    Tertiary Buttons
                  </Typography>
                  <Stack direction="row" spacing={2}>
                    <Button variant="text">Tertiary</Button>
                    <Button variant="text" startIcon={<DeleteIcon />}>
                      With Icon
                    </Button>
                  </Stack>
                </Box>

                <Box>
                  <Typography variant="subtitle1" gutterBottom>
                    Disabled State
                  </Typography>
                  <Stack direction="row" spacing={2}>
                    <Button variant="contained" disabled>
                      Disabled
                    </Button>
                    <Button variant="contained" disabled startIcon={<AddIcon />}>
                      Disabled with Icon
                    </Button>
                  </Stack>
                </Box>
              </Stack>

              <Typography variant="h6" sx={{ mt: 4 }}>
                Farm Activity Navigation
              </Typography>

              <StackedButton
                options={[
                  { label: 'Livestock Activity', onClick: () => {} },
                  { label: 'Scorecards', onClick: () => {} },
                  { label: 'Fuel', onClick: () => {} },
                  { label: 'Maintenance', onClick: () => {} },
                  { label: 'Inventory Consumption', onClick: () => {} },
                  { label: 'Job Header Updates', onClick: () => {} }
                ]}
                orientation="vertical"
                width={250}
                align="centered"
                variant="contained"
                color="secondary"
              />
            </Stack>
          </Paper>
        </Stack>
      </Container>
    </PageContainer>
  );
}
