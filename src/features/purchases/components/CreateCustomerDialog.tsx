import { useCreate, useNotify, useRefresh, useTranslate } from "react-admin";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button as MuiButton,
} from "@mui/material";
import { useState } from "react";

interface CreateCustomerDialogProps {
  open: boolean;
  onClose: () => void;
  onCustomerCreated: () => void;
}

export const CreateCustomerDialog = ({
  open,
  onClose,
  onCustomerCreated,
}: CreateCustomerDialogProps) => {
  const [create] = useCreate();
  const notify = useNotify();
  const refresh = useRefresh();
  const translate = useTranslate();
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    address: "",
  });

  const handleSubmit = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      notify(translate("validation.email"), { type: "error" });
      return;
    }

    try {
      await create(
        "customers",
        { data: formData },
        {
          onSuccess: () => {
            notify("ra.notification.created", { type: "success" });
            refresh();
            onCustomerCreated();
            onClose();
          },
          onError: () => {
            notify("ra.notification.http_error", { type: "error" });
          },
        },
      );
    } catch (error) {
      notify("ra.notification.http_error", { type: "error" });
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
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
          fontSize: "1.2rem",
        }}
      >
        {translate("dialogs.create.customer")}
      </DialogTitle>
      <DialogContent sx={{ padding: "24px" }}>
        <form
          onSubmit={(e) => e.preventDefault()}
          className="flex flex-col gap-4 min-w-[400px] mt-2"
        >
          <input
            type="text"
            placeholder={translate("resources.customers.fields.fullname")}
            value={formData.fullname}
            onChange={(e) =>
              setFormData({ ...formData, fullname: e.target.value })
            }
            className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-700 focus:border-transparent"
          />
          <input
            type="email"
            placeholder={translate("resources.customers.fields.email")}
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-700 focus:border-transparent"
          />
          <input
            type="text"
            placeholder={translate("resources.customers.fields.address")}
            value={formData.address}
            onChange={(e) =>
              setFormData({ ...formData, address: e.target.value })
            }
            className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-700 focus:border-transparent"
          />
        </form>
      </DialogContent>
      <DialogActions
        sx={{
          padding: "16px 24px",
          borderTop: "1px solid #e0e0e0",
          gap: "8px",
        }}
      >
        <MuiButton
          onClick={onClose}
          sx={{
            color: "#666",
            "&:hover": { backgroundColor: "#f5f5f5" },
          }}
        >
          {translate("ra.action.cancel")}
        </MuiButton>
        <MuiButton
          onClick={handleSubmit}
          variant="contained"
          sx={{
            backgroundColor: "#14532d",
            "&:hover": { backgroundColor: "#0f4024" },
          }}
        >
          {translate("resources.customers.create")}
        </MuiButton>
      </DialogActions>
    </Dialog>
  );
};
