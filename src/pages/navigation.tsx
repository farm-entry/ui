import React from "react";
import { Stack, Typography, Paper, Container, Box } from "@mui/material";
import { PageContainer } from "@toolpad/core/PageContainer";
import AddIcon from "@mui/icons-material/Add";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";
import { Button, ButtonGroup } from "../components/inputs";

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
                    <Button variant="primary">Primary</Button>
                    <Button variant="primary" startIcon={<AddIcon />}>
                      With Icon
                    </Button>
                  </Stack>
                </Box>

                <Box>
                  <Typography variant="subtitle1" gutterBottom>
                    Secondary Buttons
                  </Typography>
                  <Stack direction="row" spacing={2}>
                    <Button variant="secondary">Secondary</Button>
                    <Button variant="secondary" startIcon={<SaveIcon />}>
                      With Icon
                    </Button>
                  </Stack>
                </Box>

                <Box>
                  <Typography variant="subtitle1" gutterBottom>
                    Tertiary Buttons
                  </Typography>
                  <Stack direction="row" spacing={2}>
                    <Button variant="tertiary">Tertiary</Button>
                    <Button variant="tertiary" startIcon={<DeleteIcon />}>
                      With Icon
                    </Button>
                  </Stack>
                </Box>

                <Box>
                  <Typography variant="subtitle1" gutterBottom>
                    Disabled State
                  </Typography>
                  <Stack direction="row" spacing={2}>
                    <Button variant="primary" disabled>
                      Disabled
                    </Button>
                    <Button variant="primary" disabled startIcon={<AddIcon />}>
                      Disabled with Icon
                    </Button>
                  </Stack>
                </Box>
              </Stack>

              <Typography variant="h6" sx={{ mt: 4 }}>
                Farm Activity Navigation
              </Typography>

              <ButtonGroup
                orientation="vertical"
                align="center"
              >
                <Button variant="secondary">Livestock Activity</Button>
                <Button variant="secondary">Scorecards</Button>
                <Button variant="secondary">Fuel</Button>
                <Button variant="secondary">Maintenance</Button>
                <Button variant="secondary">Inventory Consumption</Button>
                <Button variant="secondary">Job Header Updates</Button>
              </ButtonGroup>
            </Stack>
          </Paper>
        </Stack>
      </Container>
    </PageContainer>
  );
}
