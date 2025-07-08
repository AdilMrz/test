import { useState } from "react";
import { TopToolbar, SelectColumnsButton, useTranslate } from "react-admin";
import { Button as MuiButton } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import { CreateProductDialog } from "./CreateProductDialog";
import { THEME_COLORS } from "../constants";
import { Protected } from "../../../components/Protected";

export const ListActions = () => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const translate = useTranslate();

  return (
    <TopToolbar>
      <SelectColumnsButton />
      <Protected action="create" resource="products">
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
          {translate("resources.products.create")}
        </MuiButton>
      </Protected>
      <CreateProductDialog
        open={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
      />
    </TopToolbar>
  );
};
