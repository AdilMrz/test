import { defaultTheme } from "react-admin";
import { alpha } from "@mui/material";

const alert = {
  error: { main: "#DB488B" },
  warning: { main: "#F2E963" },
  info: { main: "#3ED0EB" },
  success: { main: "#0FBF9F" },
};

const getOverrides = (theme: {
  palette: { mode: string; primary: { main: string } };
}) => {
  const shadows = [
    alpha(theme.palette.primary.main, 0.2),
    alpha(theme.palette.primary.main, 0.1),
    alpha(theme.palette.primary.main, 0.05),
  ];
  return {
    MuiPaper: {
      styleOverrides: {
        elevation1: {
          boxShadow: `${shadows[0]} -2px 2px, ${shadows[1]} -4px 4px, ${shadows[2]} -6px 6px`,
        },
        root: {
          backgroundClip: "padding-box",
        },
      },
    },
    RaMenuItemLink: {
      styleOverrides: {
        root: {
          color: theme.palette.mode === "light" ? "#14532d" : "#eef2ea",
          "& .MuiListItemIcon-root": {
            color: theme.palette.mode === "light" ? "#14532d" : "#eef2ea",
          },
          borderLeft: `3px solid ${theme.palette.mode === "light" ? "#eef2ea" : "#151221"}`,
          "&:hover": {
            borderLeft: "3px solid #14532d",
            borderRadius: "0px 100px 100px 0px",
            backgroundColor: "#14532d",
            color: "#eef2ea",
            "& .MuiListItemIcon-root": {
              color: "#eef2ea",
            },
          },
          "&.RaMenuItemLink-active": {
            borderLeft: "3px solid #14532d",
            borderRadius: "0px 100px 100px 0px",
            backgroundColor: "#14532d",
            color: "#eef2ea",
            "& .MuiListItemIcon-root": {
              color: "#eef2ea",
            },
          },
        },
      },
    },
  };
};

export default {
  lightTheme: {
    ...defaultTheme,
    palette: {
      primary: {
        main: "#14532d",
        light: "#16a34a",
        dark: "#0f172a",
        contrastText: "#ffffff",
      },
      secondary: {
        main: "#eef2ea",
        light: "#f7f9f5",
        dark: "#d1d5db",
        contrastText: "#14532d",
      },
      background: {
        default: "#f8fafc",
        paper: "#ffffff",
      },
      text: {
        primary: "#14532d",
        secondary: "#6b7280",
      },
      divider: "#e2e8f0",
      mode: "light" as const,
      ...alert,
    },
    components: {
      MuiAppBar: {
        styleOverrides: {
          colorSecondary: {
            backgroundColor: "#eef2ea",
            color: "#14532d",
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: "12px",
            textTransform: "none",
            fontWeight: 600,
            fontSize: "0.875rem",
            transition: "all 0.2s ease-in-out",
          },
          contained: {
            boxShadow: "none",
            "&:hover": {
              boxShadow: "0 4px 12px rgba(20, 83, 45, 0.4)",
              transform: "translateY(-1px)",
            },
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            "& .MuiOutlinedInput-root": {
              borderRadius: "12px",
              backgroundColor: "#f8fafc",
              transition: "all 0.2s ease-in-out",
              "&:hover": {
                backgroundColor: "#ffffff",
              },
              "&.Mui-focused": {
                backgroundColor: "#ffffff",
                boxShadow: "0 0 0 3px rgba(20, 83, 45, 0.1)",
              },
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: "16px",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
            border: "1px solid #e2e8f0",
            transition: "all 0.2s ease-in-out",
            "&:hover": {
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: "12px",
            border: "1px solid #e2e8f0",
          },
        },
      },
      ...getOverrides({
        palette: { mode: "light", primary: { main: "#14532d" } },
      }),
    },
  },
  darkTheme: {
    ...defaultTheme,
    palette: {
      primary: { main: "#14532d" },
      secondary: { main: "#eef2ea" },
      background: { default: "#110e1c", paper: "#151221" },
      text: {
        primary: "#eef2ea",
        secondary: "#89868D",
      },
      mode: "dark" as const,
      ...alert,
    },
    components: {
      MuiAppBar: {
        styleOverrides: {
          colorSecondary: {
            backgroundColor: "#151221",
            color: "#eef2ea",
          },
        },
      },
      ...getOverrides({
        palette: { mode: "dark", primary: { main: "#14532d" } },
      }),
    },
  },
};
