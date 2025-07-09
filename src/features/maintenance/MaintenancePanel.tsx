import { useState, useEffect, useCallback } from "react";
import {
  Card,
  Button,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  FormControlLabel,
  Switch,
  Chip,
  TableSortLabel,
} from "@mui/material";
import {
  DeleteSweep as DeleteSweepIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";
import { supabaseClient } from "../../supabase";
import { Protected } from "../../components/Protected";
import { Title, useTranslate } from "react-admin";
import { PageTitle } from "./components/PageTitle";

interface BucketFile {
  name: string;
  id: string;
  bucket_id: string;
  owner: string;
  created_at: string;
  updated_at: string;
  last_accessed_at: string;
  metadata: {
    size?: number;
    mimetype?: string;
    cacheControl?: string;
    lastModified?: string;
    contentLength?: number;
  };
  size: number;
  url: string;
  isUsed?: boolean;
}

// Add these types
type SortField = "name" | "size" | "updated_at";
type SortOrder = "asc" | "desc";

export const MaintenancePanel = () => {
  const translate = useTranslate();
  // State to manage loading status
  const [loading, setLoading] = useState(false);
  // State to store error messages
  const [error, setError] = useState<string | null>(null);
  // State to store success messages
  const [success, setSuccess] = useState<string | null>(null);
  // State to store list of files in the bucket
  const [files, setFiles] = useState<BucketFile[]>([]);
  // State to toggle the view of only unused files
  const [showOnlyUnused, setShowOnlyUnused] = useState(false);
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

  // Function to check if images are used in the products table
  const checkImageUsage = useCallback(async (files: BucketFile[]) => {
    try {
      const { data: products, error: productsError } = await supabaseClient
        .from("products")
        .select("photo_url");

      if (productsError) throw productsError;

      const usedPhotoUrls = new Set(
        products?.map((p) => p.photo_url).filter(Boolean),
      );

      return files.map((file) => ({
        ...file,
        isUsed: usedPhotoUrls.has(file.name),
      }));
    } catch (err) {
      console.error("Error checking image usage:", err);
      return files;
    }
  }, []);

  // Function to load contents of the bucket
  const loadBucketContents = useCallback(async () => {
    setLoading(true);
    try {
      const { data: bucketData } =
        await supabaseClient.storage.getBucket("img");
      console.log("Bucket info:", bucketData);

      const { data: listData, error: listError } = await supabaseClient.storage
        .from("img")
        .list("", {
          limit: 100,
          sortBy: { column: "name", order: "asc" },
        });

      if (listError) throw listError;

      const filesWithUrls = await Promise.all(
        (listData || []).map(async (file) => {
          const {
            data: { publicUrl },
          } = supabaseClient.storage.from("img").getPublicUrl(file.name);

          return {
            ...file,
            size: file.metadata?.size || 0,
            url: publicUrl,
          };
        }),
      );

      const filesWithUsageInfo = await checkImageUsage(filesWithUrls);
      setFiles(filesWithUsageInfo);
    } catch (err) {
      console.error("Full error:", err);
      setError(
        err instanceof Error ? err.message : "Failed to load bucket contents",
      );
    } finally {
      setLoading(false);
    }
  }, [checkImageUsage]);

  // Effect to load bucket contents on component mount
  useEffect(() => {
    loadBucketContents();
  }, [loadBucketContents]);

  // Function to format bytes into human-readable format
  const formatBytes = (bytes: number) => {
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${Number.parseFloat((bytes / k ** i).toFixed(2))} ${sizes[i]}`;
  };

  // Function to format date strings into a readable format
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  // Function to clear unused images from the bucket
  const clearUnusedImages = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabaseClient.rpc("delete_unused_photos");

      if (error) throw error;

      await loadBucketContents();
      setSuccess(
        `Successfully cleaned up unused photos. ${data?.deleted_count || 0} files removed.`,
      );
    } catch (err) {
      console.error("Failed to clear unused photos:", err);
      setError(
        err instanceof Error ? err.message : "Failed to clear unused photos",
      );
    } finally {
      setLoading(false);
    }
  };

  // Function to handle deletion of a specific file
  const handleDelete = async (fileName: string) => {
    try {
      setLoading(true);
      const { error } = await supabaseClient.storage
        .from("img")
        .remove([fileName]);

      if (error) throw error;
      await loadBucketContents();
    } catch (err) {
      console.error("Delete error:", err);
      setError(err instanceof Error ? err.message : "Failed to delete file");
    } finally {
      setLoading(false);
    }
  };

  // Filter files based on the showOnlyUnused state
  const filteredFiles = showOnlyUnused
    ? files.filter((file) => !file.isUsed)
    : files;

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  // Sort files
  const sortedFiles = [...filteredFiles].sort((a, b) => {
    const multiplier = sortOrder === "asc" ? 1 : -1;

    switch (sortField) {
      case "name":
        return multiplier * a.name.localeCompare(b.name);
      case "size":
        return multiplier * (a.size - b.size);
      case "updated_at":
        return (
          multiplier *
          (new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime())
        );
      default:
        return 0;
    }
  });

  return (
    <Protected action="read" resource="maintenance">
      <Title title={<PageTitle />} />
      <Card>
        <Box p={2}>
          <Typography variant="h6">
            {translate("maintenance.storage.title")}
          </Typography>

          <Box sx={{ mt: 2, mb: 2 }}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Button
                variant="contained"
                color="error"
                startIcon={<DeleteSweepIcon />}
                onClick={clearUnusedImages}
                disabled={loading}
              >
                {translate("maintenance.buttons.clear_unused")}
              </Button>
              <Button
                variant="contained"
                startIcon={<RefreshIcon />}
                onClick={loadBucketContents}
                disabled={loading}
              >
                {translate("maintenance.buttons.refresh")}
              </Button>
              <FormControlLabel
                control={
                  <Switch
                    checked={showOnlyUnused}
                    onChange={(e) => setShowOnlyUnused(e.target.checked)}
                  />
                }
                label={translate("maintenance.filters.show_unused")}
              />
            </Stack>
          </Box>

          {loading && (
            <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
              <CircularProgress />
            </Box>
          )}

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ mt: 2 }}>
              {success}
            </Alert>
          )}

          <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>
                    {translate("maintenance.table.preview")}
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={sortField === "name"}
                      direction={sortField === "name" ? sortOrder : "asc"}
                      onClick={() => handleSort("name")}
                    >
                      {translate("maintenance.table.name")}
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={sortField === "size"}
                      direction={sortField === "size" ? sortOrder : "asc"}
                      onClick={() => handleSort("size")}
                    >
                      {translate("maintenance.table.size")}
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>{translate("maintenance.table.type")}</TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={sortField === "updated_at"}
                      direction={sortField === "updated_at" ? sortOrder : "asc"}
                      onClick={() => handleSort("updated_at")}
                    >
                      {translate("maintenance.table.last_modified")}
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>{translate("maintenance.table.status")}</TableCell>
                  <TableCell>
                    {translate("maintenance.table.actions")}
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedFiles.map((file) => (
                  <TableRow key={file.name}>
                    <TableCell>
                      {file.metadata.mimetype?.startsWith("image/") ? (
                        <Box
                          component="img"
                          src={file.url}
                          alt={file.name}
                          sx={{
                            width: 50,
                            height: 50,
                            objectFit: "cover",
                            borderRadius: 1,
                            cursor: "pointer",
                          }}
                          onClick={() => window.open(file.url, "_blank")}
                        />
                      ) : (
                        <Box
                          sx={{
                            width: 50,
                            height: 50,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            bgcolor: "grey.100",
                            borderRadius: 1,
                          }}
                        >
                          -
                        </Box>
                      )}
                    </TableCell>
                    <TableCell>{file.name}</TableCell>
                    <TableCell>{formatBytes(file.size)}</TableCell>
                    <TableCell>{file.metadata.mimetype}</TableCell>
                    <TableCell>{formatDate(file.updated_at)}</TableCell>
                    <TableCell>
                      <Chip
                        label={
                          file.isUsed
                            ? translate("maintenance.status.in_use")
                            : translate("maintenance.status.unused")
                        }
                        color={file.isUsed ? "success" : "warning"}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1}>
                        <Button
                          size="small"
                          color="error"
                          onClick={() => handleDelete(file.name)}
                          disabled={loading}
                        >
                          {translate("maintenance.buttons.delete")}
                        </Button>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
                {sortedFiles.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      {translate("maintenance.messages.no_files")}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Card>
    </Protected>
  );
};
