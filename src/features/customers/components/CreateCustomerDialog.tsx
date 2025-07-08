import { useState } from "react";
import { useCreate, useNotify, useRefresh, useTranslate } from "react-admin";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button as MuiButton,
} from "@mui/material";
import type { CreateCustomerDialogProps } from "../types";
import { THEME_COLORS } from "../constants";

export const CreateCustomerDialog = ({
  open,
  onClose,
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
    try {
      await create(
        "customers",
        { data: formData },
        {
          onSuccess: () => {
            notify(translate("notifications.success.create"));
            refresh();
            onClose();
          },
          onError: () => {
            notify(translate("notifications.error.create"), { type: "error" });
          },
        },
      );
    } catch (error) {
      notify(translate("notifications.error.create"), { type: "error" });
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
          backgroundColor: THEME_COLORS.primary,
          color: "#ffffff",
          fontSize: "1.2rem",
        }}
      >
        {translate("dialogs.create.customer")}
      </DialogTitle>
      <DialogContent sx={{ padding: "24px" }}>
        <div className="flex flex-col gap-4 min-w-[400px] mt-2">
          <input
            type="text"
            placeholder={translate("resources.customers.fields.fullname")}
            value={formData.fullname}
            onChange={(e) =>
              setFormData({ ...formData, fullname: e.target.value })
            }
            className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-700 focus:border-transparent"
            required
          />
          <input
            type="email"
            placeholder={translate("resources.customers.fields.email")}
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-700 focus:border-transparent"
            required
          />
          <input
            type="text"
            placeholder={translate("resources.customers.fields.address")}
            value={formData.address}
            onChange={(e) =>
              setFormData({ ...formData, address: e.target.value })
            }
            className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-700 focus:border-transparent"
            required
          />
        </div>
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
            backgroundColor: THEME_COLORS.primary,
            "&:hover": { backgroundColor: THEME_COLORS.primaryDark },
          }}
        >
          {translate("resources.customers.create")}
        </MuiButton>
      </DialogActions>
    </Dialog>
  );
};
