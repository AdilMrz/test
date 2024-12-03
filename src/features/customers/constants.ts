export const THEME_COLORS = {
  primary: "#14532d",
  primaryDark: "#0f4024",
};

export const INPUT_STYLES = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "4px",
    "&:hover fieldset": {
      borderColor: THEME_COLORS.primary,
    },
    "&.Mui-focused fieldset": {
      borderColor: THEME_COLORS.primary,
    },
  },
};

export const DATAGRID_STYLES = {
  "& .RaDatagrid-headerCell": {
    borderBottom: "1px solid #e0e0e0",
    borderRight: "1px solid #e0e0e0",
  },
  "& .RaDatagrid-row": {
    borderBottom: "1px solid #e0e0e0",
  },
  "& .RaDatagrid-rowCell": {
    borderRight: "1px solid #e0e0e0",
  },
};
