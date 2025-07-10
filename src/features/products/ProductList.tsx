import {
  SearchInput,
  List,
  DatagridConfigurable,
  TextField,
  WrapperField,
  BulkDeleteButton,
  useTranslate,
  useRecordContext,
} from "react-admin";
import { Card, Box } from "@mui/material";
import { ListActions } from "./components/ListActions";
import { DATAGRID_STYLES } from "./constants";
import { Protected } from "../../components/Protected";
import { createActionButtons } from "../../components/OptimizedActionButtons";
import { supabaseClient } from "../../supabase";

const ProductImage = () => {
  const record = useRecordContext();
  if (!record || !record.photo_url) return null;

  const {
    data: { publicUrl },
  } = supabaseClient.storage.from("img").getPublicUrl(record.photo_url);

  return (
    <Box
      component="img"
      src={publicUrl}
      alt={record.name}
      sx={{
        width: 50,
        height: 50,
        objectFit: "cover",
        borderRadius: 1,
        cursor: "pointer",
      }}
      onClick={() => window.open(publicUrl, "_blank")}
    />
  );
};

// Create optimized action buttons for products
const ActionButtons = createActionButtons("products");

export const ProductList = () => {
  const translate = useTranslate();

  const filters = [
    <SearchInput
      key="name"
      source="name@ilike"
      placeholder={translate("common.search")}
      resettable
      alwaysOn
      sx={{ m: 1 }}
    />,
  ];

  return (
    <Card>
      <List
        actions={<ListActions />}
        filters={filters}
        className="p-0"
        sx={{ "& .RaList-main": { padding: 0 } }}
      >
        <DatagridConfigurable
          sx={DATAGRID_STYLES}
          bulkActionButtons={
            <Protected action="delete" resource="products">
              <BulkDeleteButton
                confirmTitle={translate("dialogs.delete.products.title")}
                confirmContent={translate("dialogs.delete.products.content")}
                mutationMode="pessimistic"
              />
            </Protected>
          }
        >
          <WrapperField
            label="resources.products.fields.image"
            sortable={false}
          >
            <ProductImage />
          </WrapperField>
          <TextField source="name" />
          <TextField source="description" />
          <WrapperField label="common.actions" sortable={false}>
            <ActionButtons />
          </WrapperField>
        </DatagridConfigurable>
      </List>
    </Card>
  );
};
