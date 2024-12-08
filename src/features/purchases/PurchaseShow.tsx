import { Show, useRecordContext, useGetOne } from "react-admin";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  IconButton,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import type { Purchase } from "../../types/database";

const PurchaseDialog = () => {
  const record = useRecordContext<Purchase>();
  const navigate = useNavigate();
  const { data: customer } = useGetOne("customers", {
    id: record?.customer_id || "",
  });
  const { data: product } = useGetOne("products", {
    id: record?.product_id || "",
  });

  if (!record) return null;

  return (
    <Dialog
      open={true}
      maxWidth="sm"
      fullWidth
      onClose={() => navigate("/purchases")}
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
        <div>Purchase Details</div>
        <IconButton
          onClick={() => navigate("/purchases")}
          sx={{ color: "#ffffff" }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ mt: 2 }}>
        <Typography variant="subtitle2" color="textSecondary" fontWeight="bold">
          Purchase Date
        </Typography>
        <Typography paragraph>
          {new Date(record.purchase_date).toLocaleDateString()}
        </Typography>

        <Typography variant="subtitle2" color="textSecondary" fontWeight="bold">
          Customer
        </Typography>
        <Typography paragraph>{customer?.fullname}</Typography>

        <Typography variant="subtitle2" color="textSecondary" fontWeight="bold">
          Product
        </Typography>
        <Typography paragraph>{product?.name}</Typography>

        <Typography variant="subtitle2" color="textSecondary" fontWeight="bold">
          Price
        </Typography>
        <Typography paragraph>${record.price.toFixed(2)}</Typography>
      </DialogContent>
    </Dialog>
  );
};

export const PurchaseShow = () => (
  <Show>
    <PurchaseDialog />
  </Show>
);
