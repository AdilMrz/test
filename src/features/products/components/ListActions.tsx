import { TopToolbar, Button } from "react-admin";
import { Add as AddIcon } from "@mui/icons-material";
import { useState } from "react";
import { CreateProductDialog } from "./CreateProductDialog";

export const ListActions = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  return (
    <TopToolbar>
      <Button
        onClick={() => setIsCreateDialogOpen(true)}
        label="Create Product"
      >
        <AddIcon />
      </Button>
      <CreateProductDialog
        open={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
      />
    </TopToolbar>
  );
};
