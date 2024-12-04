import { useState } from "react";
import { useCreate, useNotify, useRefresh, useGetIdentity } from "react-admin";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button as MuiButton,
} from "@mui/material";

interface CreateContractDialogProps {
  open: boolean;
  onClose: () => void;
}

export const CreateContractDialog = ({
  open,
  onClose,
}: CreateContractDialogProps) => {
  const [create] = useCreate();
  const notify = useNotify();
  const refresh = useRefresh();
  const { identity } = useGetIdentity();
  const [formData, setFormData] = useState({
    contract_details: "",
  });

  const handleSubmit = async () => {
    if (!identity?.id) {
      notify("Not authorized", { type: "error" });
      return;
    }

    try {
      await create(
        "contracts",
        {
          data: {
            ...formData,
            creator_id: identity.id,
          },
        },
        {
          onSuccess: () => {
            notify("Contract created successfully");
            refresh();
            onClose();
          },
          onError: () => {
            notify("Error creating contract", { type: "error" });
          },
        },
      );
    } catch (error) {
      notify("Error creating contract", { type: "error" });
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
        Create New Contract
      </DialogTitle>
      <DialogContent sx={{ padding: "24px" }}>
        <div className="flex flex-col gap-4 min-w-[400px] mt-2">
          <textarea
            placeholder="Contract Details"
            value={formData.contract_details}
            onChange={(e) =>
              setFormData({ ...formData, contract_details: e.target.value })
            }
            rows={4}
            className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-700 focus:border-transparent"
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
          Cancel
        </MuiButton>
        <MuiButton
          onClick={handleSubmit}
          variant="contained"
          sx={{
            backgroundColor: "#14532d",
            "&:hover": { backgroundColor: "#0f4024" },
          }}
        >
          Create Contract
        </MuiButton>
      </DialogActions>
    </Dialog>
  );
};
