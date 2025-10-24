import { Box, Container, Paper, Stack, Typography } from "@mui/material";
import { PageContainer } from "@toolpad/core/PageContainer";
import { useState } from "react";
import { Button, DatePicker, Select, Slider, TextArea, TextField, TypeAhead, TypeAheadOption } from "../components/inputs";
import { StackedButton } from "../components/inputs/StackedButton";

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
              <Typography variant="body2" color="text.secondary">
                Current Values:
                <p>{JSON.stringify(values, null, 2)}</p>
              </Typography>
              <pre>{JSON.stringify(values, null, 2)}</pre>
            </Stack>
          </Paper>

          <Paper sx={{ p: 3 }}>
            <Stack spacing={3}>
              <Typography variant="h6">Stacked Button Examples</Typography>

              <Box>
                <Typography variant="subtitle1" gutterBottom>
                  Vertical Stacked Button (6 options, centered)
                </Typography>
                <StackedButton
                  orientation="vertical"
                  align="centered"
                  variant="outlined"
                  options={[
                    { label: "Option 1", onClick: () => alert("Option 1 clicked") },
                    { label: "Option 2", onClick: () => alert("Option 2 clicked") },
                    { label: "Option 3", href: "https://mui.com/", disabled: false },
                    { label: "Option 4", onClick: () => alert("Option 4 clicked") },
                    { label: "Option 5", onClick: () => alert("Option 5 clicked") },
                    { label: "Option 6", onClick: () => alert("Option 6 clicked") },
                  ]}
                  width={320}
                />
              </Box>

              <Box>
                <Typography variant="subtitle1" gutterBottom>
                  Horizontal Stacked Button (Yes/No)
                </Typography>
                <StackedButton
                  orientation="horizontal"
                  options={[
                    { label: "Yes", onClick: () => alert("Yes clicked") },
                    { label: "No", onClick: () => alert("No clicked") },
                  ]}
                  width={240}
                  align="centered"
                />
              </Box>
              <Box>
                <Typography variant="subtitle1" gutterBottom>
                  Centered button
                </Typography>
                <Button variant="contained" center>
                  Sign In
                </Button>
                <Typography variant="subtitle1" gutterBottom>
                  Full width button
                </Typography>
                <Button variant="outlined" fullWidth>
                  Submit
                </Button>
                <Typography variant="subtitle1" gutterBottom>
                  Both centered and full width
                </Typography>
                <Button variant="text" center fullWidth>
                  Login
                </Button>
              </Box>
            </Stack>
          </Paper>
        </Stack>
      </Container>
    </PageContainer>
  );
}
