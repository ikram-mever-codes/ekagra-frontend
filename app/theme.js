import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#11282E",
    },
    secondary: {
      main: "#3BAFDA",
    },
    background: {
      default: "#FFFFFF",
      paper: "#F5F5F5",
    },
    text: {
      primary: "#2C3E50",
      secondary: "#4F5B66",
    },
    error: {
      main: "#D32F2F",
    },
    warning: {
      main: "#FFA000",
    },
    info: {
      main: "#0288D1",
    },
    success: {
      main: "#388E3C",
    },
  },
  typography: {
    fontFamily: "Roboto, Arial, sans-serif",
    h1: {
      fontSize: "2.5rem",
      fontWeight: 700,
      color: "#2C3E50",
    },
    h2: {
      fontSize: "2rem",
      fontWeight: 700,
      color: "#4F5B66",
    },
    body1: {
      fontSize: "1rem",
      color: "#4F5B66",
    },
    button: {
      textTransform: "none",
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
          fontWeight: 700,
          color: "#FFFFFF",
        },
        containedPrimary: {
          backgroundColor: "#11282E",
          "&:hover": {
            backgroundColor: "#0A1A23",
          },
        },
        containedSecondary: {
          backgroundColor: "#3BAFDA",
          "&:hover": {
            backgroundColor: "#2B8FA8",
          },
        },
        outlined: {
          borderColor: "#11282E",
          color: "#11282E",
          "&:hover": {
            borderColor: "#0A1A23",
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: "#2C3E50",
            },
            "&:hover fieldset": {
              borderColor: "#11282E",
            },
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        outlined: {
          borderColor: "#2C3E50",
          "&:hover": {
            borderColor: "#11282E",
          },
        },
      },
    },
  },
});

export default theme;
