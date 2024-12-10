import {
  Edit,
  SimpleForm,
  TextInput,
  useNotify,
  useRecordContext,
  useInput,
} from "react-admin";
import { PageTitle } from "./components/PageTitle";
import { BackActions } from "./components/BackActions";
import { INPUT_STYLES } from "./constants";
import { useState, useEffect } from "react";
import { Box, Button } from "@mui/material";
import { supabaseClient } from "../../supabase";
import type { Product } from "../../types/database";

const ImageUploadField = ({
  onFileSelect,
  uploading,
}: {
  onFileSelect: (file: File | null) => void;
  uploading: boolean;
}) => {
  const [currentPhotoUrl, setCurrentPhotoUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const notify = useNotify();
  const record = useRecordContext();
  const { field } = useInput({ source: "photo_url" });

  useEffect(() => {
    if (record?.photo_url) {
      const {
        data: { publicUrl },
      } = supabaseClient.storage.from("img").getPublicUrl(record.photo_url);
      setCurrentPhotoUrl(publicUrl);
    }
  }, [record]);

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
      onFileSelect(file);
      field.onChange(file.name);
    }
  };

  return (
    <Box sx={{ mb: 2 }}>
      <TextInput source="photo_url" style={{ display: "none" }} />
      <input
        accept="image/*"
        style={{ display: "none" }}
        id="photo-upload"
        type="file"
        onChange={handleFileSelect}
      />
      <label htmlFor="photo-upload">
        <Button variant="contained" component="span" disabled={uploading}>
          {currentPhotoUrl ? "Change Photo" : "Upload Photo"}
        </Button>
      </label>
      {(selectedFile || currentPhotoUrl) && (
        <Box sx={{ mt: 2 }}>
          <img
            src={
              selectedFile
                ? URL.createObjectURL(selectedFile)
                : currentPhotoUrl || ""
            }
            alt="Preview"
            style={{
              maxWidth: "200px",
              maxHeight: "200px",
              objectFit: "contain",
              borderRadius: "4px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            }}
          />
        </Box>
      )}
    </Box>
  );
};

export const ProductEdit = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const notify = useNotify();
  const record = useRecordContext();

  const transform = async (data: Partial<Product>) => {
    if (selectedFile) {
      setUploading(true);
      try {
        // Delete old photo if exists
        if (record?.photo_url) {
          await supabaseClient.storage.from("img").remove([record.photo_url]);
        }

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
    <Edit
      title={<PageTitle />}
      actions={<BackActions />}
      transform={transform}
      mutationMode="pessimistic"
    >
      <SimpleForm>
        <TextInput source="name" sx={INPUT_STYLES} />
        <TextInput source="description" multiline rows={3} sx={INPUT_STYLES} />
        <ImageUploadField
          onFileSelect={setSelectedFile}
          uploading={uploading}
        />
      </SimpleForm>
    </Edit>
  );
};
