import React, { useState } from "react";
import { Stack, Typography, Paper, Container, Box } from "@mui/material";
import { PageContainer } from "@toolpad/core/PageContainer";
import AddIcon from "@mui/icons-material/Add";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";
import { TextField, TextArea, Select, DatePicker, Slider, TypeAhead, TypeAheadOption, Button } from "../components/inputs";

export default function FormInputs() {
  const [values, setValues] = useState({
    text: "",
    multiline: "",
    select: "",
    date: null as Date | null,
    slider: 5,
    typeahead: null as TypeAheadOption | null,
  });

  const departments = [
    { value: "market", label: "Market" },
    { value: "finance", label: "Finance" },
    { value: "development", label: "Development" },
  ];

  const countries = [
    { value: "us", label: "United States" },
    { value: "uk", label: "United Kingdom" },
    { value: "ca", label: "Canada" },
    { value: "au", label: "Australia" },
    { value: "de", label: "Germany" },
    { value: "fr", label: "France" },
  ];

  return (
    <PageContainer>
      <Container maxWidth="md">
        <Stack spacing={3}>
          <Paper sx={{ p: 3 }}>
            <Stack spacing={3}>
              <Typography variant="h6">Form Fields</Typography>
              <TextField
                label="Standard Text Input"
                value={values.text}
                onChange={(e) => setValues({ ...values, text: e.target.value })}
                helperText="This is a standard text input field"
              />

              <TextArea
                label="Multiline Text Input"
                value={values.multiline}
                onChange={(e) => setValues({ ...values, multiline: e.target.value })}
                helperText="This is a multiline text input field"
                rows={4}
              />

              <Select
                label="Department"
                options={departments}
                value={values.select}
                onChange={(e) => setValues({ ...values, select: e.target.value as string })}
                onClear={() => setValues({ ...values, select: "" })}
                helperText="Select your department"
              />

              <DatePicker label="Join Date" value={values.date} onChange={(newValue) => setValues({ ...values, date: newValue })} helperText="Choose your join date" />

              <Slider
                label="Experience Level"
                value={values.slider}
                onChange={(newValue) => setValues({ ...values, slider: newValue })}
                min={0}
                max={10}
                step={0.5}
                helperText="Select your experience level (0-10)"
              />

              <TypeAhead
                label="Country"
                options={countries}
                value={values.typeahead}
                onChange={(newValue) => setValues({ ...values, typeahead: newValue })}
                helperText="Start typing to search for a country"
                placeholder="Select a country"
                freeSolo
              />
            </Stack>
          </Paper>

          <Paper sx={{ p: 3 }}>
            <Stack spacing={3}>
              <Typography variant="h6">Button Variants</Typography>

              <Stack spacing={3}>
                <Box>
                  <Typography variant="subtitle1" gutterBottom>
                    Primary Buttons
                  </Typography>
                  <Stack direction="row" spacing={2}>
                    <Button variant="primary" size="small">
                      Small
                    </Button>
                    <Button variant="primary">Medium</Button>
                    <Button variant="primary" size="large">
                      Large
                    </Button>
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
                    <Button variant="secondary" size="small">
                      Small
                    </Button>
                    <Button variant="secondary">Medium</Button>
                    <Button variant="secondary" size="large">
                      Large
                    </Button>
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
                    <Button variant="tertiary" size="small">
                      Small
                    </Button>
                    <Button variant="tertiary">Medium</Button>
                    <Button variant="tertiary" size="large">
                      Large
                    </Button>
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
                      Primary
                    </Button>
                    <Button variant="secondary" disabled>
                      Secondary
                    </Button>
                    <Button variant="tertiary" disabled>
                      Tertiary
                    </Button>
                  </Stack>
                </Box>
              </Stack>

              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                Current Values:
              </Typography>
              <pre>{JSON.stringify(values, null, 2)}</pre>
            </Stack>
          </Paper>
        </Stack>
      </Container>
    </PageContainer>
  );
}
