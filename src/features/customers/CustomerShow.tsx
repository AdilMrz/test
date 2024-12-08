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
import type { Customer } from "../../types/database";

const CustomerDialog = () => {
  const record = useRecordContext<Customer>();
  const navigate = useNavigate();
  if (!record) return null;

  return (
    <Dialog
      open={true}
      maxWidth="sm"
      fullWidth
      onClose={() => navigate("/customers")}
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
        <div>Customer Details</div>
        <IconButton
          onClick={() => navigate("/customers")}
          sx={{ color: "#ffffff" }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ mt: 2 }}>
        <Typography variant="subtitle2" color="textSecondary" fontWeight="bold">
          Full Name
        </Typography>
        <Typography paragraph>{record.fullname}</Typography>

        <Typography variant="subtitle2" color="textSecondary" fontWeight="bold">
          Email
        </Typography>
        <Typography paragraph>{record.email}</Typography>

        <Typography variant="subtitle2" color="textSecondary" fontWeight="bold">
          Address
        </Typography>
        <Typography paragraph>{record.address}</Typography>
      </DialogContent>
    </Dialog>
  );
};

export const CustomerShow = () => (
  <Show>
    <CustomerDialog />
  </Show>
);
