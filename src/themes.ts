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
      primary: { main: "#14532d" },
      secondary: { main: "#eef2ea" },
      background: { default: "#f0f1f6" },
      text: {
        primary: "#14532d",
        secondary: "#14532d",
      },
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
