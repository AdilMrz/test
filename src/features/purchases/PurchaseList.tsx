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
  useTranslate,
} from "react-admin";
import { Card } from "@mui/material";
import { ListActions } from "./components/ListActions";
import { Protected } from "../../components/Protected";

const ActionButtons = () => {
  const record = useRecordContext();

  if (!record) return null;

  return (
    <WrapperField label="Actions">
      <Protected
        action="update"
        resource="purchases"
        recordUserId={record.created_by}
      >
        <EditButton />
      </Protected>
      <Protected
        action="delete"
        resource="purchases"
        recordUserId={record.created_by}
      >
        <DeleteButton
          confirmTitle="Delete Purchase"
          confirmContent="Are you sure you want to delete this purchase?"
          mutationMode="pessimistic"
        />
      </Protected>
    </WrapperField>
  );
};

export const PurchaseList = () => {
  const translate = useTranslate();

  const filters = [
    <SearchInput
      key="customer_search"
      source="customer_fullname@ilike"
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
          <TextField source="customer_fullname" />
          <ReferenceField source="product_id" reference="products">
            <TextField source="name" />
          </ReferenceField>
          <NumberField
            source="price"
            options={{ style: "currency", currency: "USD" }}
          />
          <DateField source="purchase_date" />
          <WrapperField label="common.actions" sortable={false}>
            <ActionButtons />
          </WrapperField>
        </DatagridConfigurable>
      </List>
    </Card>
  );
};
