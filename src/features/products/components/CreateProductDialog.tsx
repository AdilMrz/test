import { useState, useRef } from "react";
import { useCreate, useNotify, useRefresh } from "react-admin";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button as MuiButton,
  Box,
} from "@mui/material";
import { Upload as UploadIcon } from "@mui/icons-material";
import type { CreateProductDialogProps } from "../types";
import { THEME_COLORS } from "../constants";
import { supabaseClient } from "../../../supabase";

export const CreateProductDialog = ({
  open,
  onClose,
}: CreateProductDialogProps) => {
  const [create] = useCreate();
  const notify = useNotify();
  const refresh = useRefresh();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    photo_url: "",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      notify("File size must be less than 5MB", { type: "error" });
      return;
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      notify("File must be an image", { type: "error" });
      return;
    }

    // Validate image dimensions
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      if (img.width > 1920 || img.height > 1080) {
        notify("Image dimensions must be 1920x1080 pixels or smaller", {
          type: "error",
        });
        return;
      }
      setSelectedFile(file);
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      notify("Error loading image", { type: "error" });
    };

    img.src = objectUrl;
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.description) {
      notify("Name and description are required", { type: "error" });
      return;
    }

    try {
      setUploading(true);
      let photoUrl = "";

      if (selectedFile) {
        const fileExt = selectedFile.name.split(".").pop();
        const fileName = `${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabaseClient.storage
          .from("img")
          .upload(fileName, selectedFile);

        if (uploadError) throw uploadError;
        photoUrl = fileName;
      }

      await create(
        "products",
        {
          data: { ...formData, photo_url: photoUrl },
        },
        {
          onSuccess: () => {
            notify("Product created successfully");
            refresh();
            onClose();
          },
          onError: () => {
            notify("Error creating product", { type: "error" });
          },
        },
      );
    } catch (error) {
      notify("Error creating product", { type: "error" });
    } finally {
      setUploading(false);
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
        Create New Product
      </DialogTitle>
      <DialogContent sx={{ padding: "24px" }}>
        <div className="flex flex-col gap-4 min-w-[400px] mt-2">
          <input
            type="text"
            placeholder="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-700 focus:border-transparent"
          />
          <input
            type="text"
            placeholder="Description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-700 focus:border-transparent"
          />
          <Box sx={{ mt: 2 }}>
            <input
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleFileSelect}
              ref={fileInputRef}
            />
            <MuiButton
              variant="outlined"
              component="span"
              startIcon={<UploadIcon />}
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              sx={{
                borderColor: THEME_COLORS.primary,
                color: THEME_COLORS.primary,
                "&:hover": {
                  borderColor: THEME_COLORS.primaryDark,
                  backgroundColor: "rgba(20, 83, 45, 0.04)",
                },
              }}
            >
              {selectedFile ? "Change Photo" : "Upload Photo"}
            </MuiButton>
            {selectedFile && (
              <Box sx={{ mt: 2 }}>
                <img
                  src={URL.createObjectURL(selectedFile)}
                  alt="Preview"
                  style={{
                    maxWidth: "200px",
                    maxHeight: "200px",
                    objectFit: "contain",
                  }}
                />
              </Box>
            )}
          </Box>
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
          disabled={uploading}
          sx={{
            backgroundColor: THEME_COLORS.primary,
            "&:hover": { backgroundColor: THEME_COLORS.primaryDark },
          }}
        >
          Create Product
        </MuiButton>
      </DialogActions>
    </Dialog>
  );
};
