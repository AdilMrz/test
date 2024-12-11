import {
  SearchInput,
  List,
  DatagridConfigurable,
  TextField,
  WrapperField,
  EditButton,
  DeleteButton,
  BulkDeleteButton,
  useRecordContext,
  useGetIdentity,
} from "react-admin";
import { Card, Box } from "@mui/material";
import { ListActions } from "./components/ListActions";
import { DATAGRID_STYLES } from "./constants";
import { Protected } from "../../components/Protected";
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

const filters = [
  <SearchInput
    key="name"
    source="name@ilike"
    placeholder="Search"
    resettable
    alwaysOn
    sx={{ m: 1 }}
  />,
];

const ActionButtons = () => {
  const record = useRecordContext();
  const { identity } = useGetIdentity();

  if (!record) return null;

  const isOwner = record.created_by === identity?.id;
  const isAdmin = identity?.role === "admin";

  return (
    <WrapperField>
      {(isOwner || isAdmin) && (
        <>
          <Protected action="update" resource="products">
            <EditButton />
          </Protected>
          <Protected action="delete" resource="products">
            <DeleteButton
              confirmTitle="Delete Product"
              confirmContent={`Are you sure you want to delete the product "${record.name}"?`}
              mutationMode="pessimistic"
            />
          </Protected>
        </>
      )}
    </WrapperField>
  );
};

export const ProductList = () => (
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
              confirmTitle="Delete Products"
              confirmContent="Are you sure you want to delete these products?"
              mutationMode="pessimistic"
            />
          </Protected>
        }
      >
        <WrapperField label="Image" sortable={false}>
          <ProductImage />
        </WrapperField>
        <TextField source="name" label="Name" />
        <TextField source="description" label="Description" />
        <WrapperField source="actions" label="Actions">
          <ActionButtons />
        </WrapperField>
      </DatagridConfigurable>
    </List>
  </Card>
);
