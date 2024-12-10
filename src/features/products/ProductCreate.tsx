import { Create, SimpleForm, TextInput, useNotify } from "react-admin";
import { INPUT_STYLES } from "./constants";
import { useState } from "react";
import { Box, Button } from "@mui/material";
import { supabaseClient } from "../../supabase";
import type { Product } from "../../types/database";

export const ProductCreate = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const notify = useNotify();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        notify("File size must be less than 5MB", { type: "error" });
        return;
      }
      if (!file.type.startsWith("image/")) {
        notify("File must be an image", { type: "error" });
        return;
      }
      setSelectedFile(file);
    }
  };

  const transform = async (data: Partial<Product>) => {
    if (selectedFile) {
      setUploading(true);
      try {
        const fileExt = selectedFile.name.split(".").pop();
        const fileName = `${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabaseClient.storage
          .from("img")
          .upload(fileName, selectedFile);

        if (uploadError) throw uploadError;

        return {
          ...data,
          photo_url: fileName,
        };
      } catch (error) {
        notify("Error uploading file", { type: "error" });
        throw error;
      } finally {
        setUploading(false);
      }
    }
    return data;
  };

  return (
    <Create transform={transform}>
      <SimpleForm>
        <TextInput source="name" sx={INPUT_STYLES} />
        <TextInput source="description" multiline rows={3} sx={INPUT_STYLES} />
        <Box sx={{ mb: 2 }}>
          <input
            accept="image/*"
            style={{ display: "none" }}
            id="photo-upload"
            type="file"
            onChange={handleFileSelect}
          />
          <label htmlFor="photo-upload">
            <Button variant="contained" component="span" disabled={uploading}>
              {selectedFile ? "Change Photo" : "Upload Photo"}
            </Button>
          </label>
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
      </SimpleForm>
    </Create>
  );
};
