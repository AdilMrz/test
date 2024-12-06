import {
  DatagridConfigurable,
  EmailField,
  List,
  SearchInput,
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
    key="fullname"
    source="fullname@ilike"
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
    <Protected action="delete" resource="customers">
      <DeleteButton
        confirmTitle="Delete Customer"
        confirmContent={`Are you sure you want to delete the customer "${record.fullname}"? This action will fail if the customer has any associated purchases.`}
        mutationMode="pessimistic"
      />
    </Protected>
  );
};

export const CustomerList = () => (
  <Card>
    <List
      actions={<ListActions />}
      filters={filters}
      className="p-0"
      sx={{ "& .RaList-main": { padding: 0 } }}
    >
      <DatagridConfigurable
        omit={[]}
        preferenceKey="customers.datagrid"
        sx={DATAGRID_STYLES}
        bulkActionButtons={
          <Protected action="delete" resource="customers">
            <BulkDeleteButton
              confirmTitle="Delete Customers"
              confirmContent="Are you sure you want to delete these customers? This action will fail for any customers who have associated purchases."
              mutationMode="pessimistic"
            />
          </Protected>
        }
      >
        <TextField source="fullname" label="Full Name" />
        <EmailField source="email" label="Email" />
        <TextField source="address" label="Address" />
        <WrapperField label="Actions">
          <Protected action="update" resource="customers">
            <EditButton />
          </Protected>
          <DeleteWithConfirmButton />
        </WrapperField>
      </DatagridConfigurable>
    </List>
  </Card>
);
