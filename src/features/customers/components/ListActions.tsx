import { useState } from "react";
import { TopToolbar, SelectColumnsButton } from "react-admin";
import { Button as MuiButton } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import { CreateCustomerDialog } from "./CreateCustomerDialog";
import { THEME_COLORS } from "../constants";

export const ListActions = () => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  return (
    <TopToolbar>
      <SelectColumnsButton />
      <MuiButton
        startIcon={<AddIcon />}
        onClick={() => setIsCreateOpen(true)}
        variant="outlined"
        size="medium"
        sx={{
          borderColor: THEME_COLORS.primary,
          color: THEME_COLORS.primary,
          height: "40px",
          minWidth: "140px",
          marginLeft: "8px",
          "&:hover": {
            borderColor: THEME_COLORS.primaryDark,
            backgroundColor: "rgba(20, 83, 45, 0.04)",
          },
        }}
      >
        Create Customer
      </MuiButton>
      <CreateCustomerDialog
        open={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
      />
    </TopToolbar>
  );
};
