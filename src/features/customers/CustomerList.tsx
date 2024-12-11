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
  useGetIdentity,
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
          <Protected action="update" resource="customers">
            <EditButton />
          </Protected>
          <Protected action="delete" resource="customers">
            <DeleteButton
              confirmTitle="Delete Customer"
              confirmContent={`Are you sure you want to delete the customer "${record.fullname}"? This action will fail if the customer has any associated purchases.`}
              mutationMode="pessimistic"
            />
          </Protected>
        </>
      )}
    </WrapperField>
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
        <WrapperField source="actions" label="Actions">
          <ActionButtons />
        </WrapperField>
      </DatagridConfigurable>
    </List>
  </Card>
);
