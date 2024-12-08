import { Show, useRecordContext } from "react-admin";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  IconButton,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import type { Product } from "../../types/database";

const ProductDialog = () => {
  const record = useRecordContext<Product>();
  const navigate = useNavigate();
  if (!record) return null;

  return (
    <Dialog
      open={true}
      maxWidth="sm"
      fullWidth
      onClose={() => navigate("/products")}
      PaperProps={{
        sx: {
          borderRadius: "8px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        },
      }}
    >
      <DialogTitle
        sx={{
          borderBottom: "1px solid #e0e0e0",
          backgroundColor: "#14532d",
          color: "#ffffff",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>Product Details</div>
        <IconButton
          onClick={() => navigate("/products")}
          sx={{ color: "#ffffff" }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ mt: 2 }}>
        <Typography variant="subtitle2" color="textSecondary" fontWeight="bold">
          Name
        </Typography>
        <Typography paragraph>{record.name}</Typography>

        <Typography variant="subtitle2" color="textSecondary" fontWeight="bold">
          Description
        </Typography>
        <Typography paragraph>{record.description}</Typography>
      </DialogContent>
    </Dialog>
  );
};

export const ProductShow = () => (
  <Show>
    <ProductDialog />
  </Show>
);
