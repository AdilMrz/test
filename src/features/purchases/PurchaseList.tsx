import {
  SearchInput,
  List,
  DatagridConfigurable,
  TextField,
  ReferenceField,
  NumberField,
  DateField,
  WrapperField,
  EditButton,
  DeleteButton,
  BulkDeleteButton,
  useRecordContext,
  useGetIdentity,
} from "react-admin";
import { Card } from "@mui/material";
import { ListActions } from "./components/ListActions";
import { Protected } from "../../components/Protected";

const filters = [
  <SearchInput
    key="customer_search"
    source="customer_fullname@ilike"
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
    <WrapperField label="Actions">
      {(isOwner || isAdmin) && (
        <>
          <Protected action="update" resource="purchases">
            <EditButton />
          </Protected>
          <Protected action="delete" resource="purchases">
            <DeleteButton
              confirmTitle="Delete Purchase"
              confirmContent="Are you sure you want to delete this purchase?"
              mutationMode="pessimistic"
            />
          </Protected>
        </>
      )}
    </WrapperField>
  );
};

export const PurchaseList = () => (
  <Card>
    <List
      actions={<ListActions />}
      filters={filters}
      sort={{ field: "purchase_date", order: "DESC" }}
      className="p-0"
      sx={{ "& .RaList-main": { padding: 0 } }}
    >
      <DatagridConfigurable
        omit={[]}
        preferenceKey="purchases.datagrid"
        sx={{
          "& .RaDatagrid-headerCell": {
            borderBottom: "1px solid #e0e0e0",
            borderRight: "1px solid #e0e0e0",
          },
          "& .RaDatagrid-row": {
            borderBottom: "1px solid #e0e0e0",
          },
          "& .RaDatagrid-rowCell": {
            borderRight: "1px solid #e0e0e0",
          },
        }}
        bulkActionButtons={
          <Protected action="delete" resource="purchases">
            <BulkDeleteButton
              confirmTitle="Delete Purchases"
              confirmContent="Are you sure you want to delete these purchases?"
              mutationMode="pessimistic"
            />
          </Protected>
        }
      >
        <TextField source="customer_fullname" label="Customer Name" />
        <ReferenceField
          source="product_id"
          reference="products"
          label="Product"
        >
          <TextField source="name" />
        </ReferenceField>
        <NumberField
          source="price"
          options={{ style: "currency", currency: "USD" }}
          label="Price"
        />
        <DateField source="purchase_date" label="Purchase Date" />
        <WrapperField label="Actions" sortable={false}>
          <ActionButtons />
        </WrapperField>
      </DatagridConfigurable>
    </List>
  </Card>
);
