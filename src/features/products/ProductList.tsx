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
} from "react-admin";
import { Card } from "@mui/material";
import { ListActions } from "./components/ListActions";
import { DATAGRID_STYLES } from "./constants";
import { Protected } from "../../components/Protected";
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

const DeleteWithConfirmButton = () => {
  const record = useRecordContext();
  if (!record) return null;
  return (
    <Protected action="delete" resource="products">
      <DeleteButton
        confirmTitle="Delete Product"
        confirmContent={`Are you sure you want to delete the product "${record.name}"?`}
        mutationMode="pessimistic"
      />
    </Protected>
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
        <TextField source="name" label="Name" />
        <TextField source="description" label="Description" />
        <WrapperField label="Actions">
          <Protected action="update" resource="products">
            <EditButton />
          </Protected>
          <DeleteWithConfirmButton />
        </WrapperField>
      </DatagridConfigurable>
    </List>
  </Card>
);
