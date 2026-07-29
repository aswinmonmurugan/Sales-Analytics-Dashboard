import { createTheme } from '@mui/material/styles';

// A confident slate/teal palette for a data-dense analytics tool —
// deliberately avoiding MUI's default indigo/blue.
export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#0E6B5C',
      light: '#3D8B7D',
      dark: '#094A3F',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#C97A2B',
      light: '#E0A05C',
      dark: '#9C5D1E',
    },
    background: {
      default: '#F6F5F1',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1B2320',
      secondary: '#5B6B65',
    },
    divider: '#E4E2DA',
    success: { main: '#2E7D5B' },
    warning: { main: '#C97A2B' },
    error: { main: '#B3432B' },
    info: { main: '#2C6E8F' },
  },
  typography: {
    fontFamily: '"Inter", "Segoe UI", system-ui, sans-serif',
    h4: { fontWeight: 700, letterSpacing: '-0.02em' },
    h5: { fontWeight: 700, letterSpacing: '-0.01em' },
    h6: { fontWeight: 600 },
    subtitle2: { fontWeight: 600, color: '#5B6B65' },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  shape: {
    borderRadius: 10,
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          border: '1px solid #E4E2DA',
          boxShadow: 'none',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 700,
          fontSize: '0.75rem',
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
          color: '#5B6B65',
          backgroundColor: '#F6F5F1',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
        },
      },
    },
  },
});
