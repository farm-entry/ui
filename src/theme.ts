import { createTheme, ThemeOptions } from '@mui/material/styles';
import { green, amber } from '@mui/material/colors';

const commonThemeOptions: ThemeOptions = {
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
  },
};

export const customTheme = createTheme({
  ...commonThemeOptions,
  cssVariables: {
    colorSchemeSelector: 'data-toolpad-color-scheme',
  },
  colorSchemes: {
    light: {
      palette: {
        mode: 'light',
        primary: {
          main: green[700], // #388E3C - strong farm/nature tone
        },
        secondary: {
          main: amber[600], // #FFB300 - warm, like crops/grains
        },
        background: {
          default: '#F9FBE7', // soft pale green-beige
          paper: '#FFFFFF',
        },
        text: {
          primary: '#212121', // dark gray
        },
      },
    },
    dark: {
      palette: {
        mode: 'dark',
        primary: {
          main: green[400], // #66BB6A - fresh accent against dark backgrounds
        },
        secondary: {
          main: amber[300], // #FFD54F
        },
        background: {
          default: '#121212',
          paper: '#1E1E1E', // surface color
        },
        text: {
          primary: '#E0E0E0', // off-white
        },
      },
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
});