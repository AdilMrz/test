import {
  SearchInput,
  List,
  DatagridConfigurable,
  TextField,
  ReferenceField,
  NumberField,
  DateField,
  WrapperField,
  BulkDeleteButton,
  useTranslate,
} from "react-admin";
import { Card } from "@mui/material";
import { ListActions } from "./components/ListActions";
import { Protected } from "../../components/Protected";
import { createActionButtons } from "../../components/OptimizedActionButtons";

// Create optimized action buttons for purchases
const ActionButtons = createActionButtons("purchases");

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
                confirmTitle={translate("dialogs.delete.purchases.title")}
                confirmContent={translate("dialogs.delete.purchases.content")}
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
