import { TopToolbar, SelectColumnsButton } from "react-admin";
import { Button as MuiButton } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import { useState } from "react";
import { CreateContractDialog } from "./CreateContractDialog";

export const ListActions = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  return (
    <TopToolbar className="p-3">
      <SelectColumnsButton />
      <MuiButton
        startIcon={<AddIcon />}
        onClick={() => setIsCreateDialogOpen(true)}
        variant="outlined"
        size="medium"
        sx={{
          borderColor: "#14532d",
          color: "#14532d",
          height: "40px",
          minWidth: "140px",
          marginLeft: "8px",
          "&:hover": {
            borderColor: "#0f4024",
            backgroundColor: "rgba(20, 83, 45, 0.04)",
          },
        }}
      >
        Create Contract
      </MuiButton>
      <CreateContractDialog
        open={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
      />
    </TopToolbar>
  );
};
