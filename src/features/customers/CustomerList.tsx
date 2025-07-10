import {
  DatagridConfigurable,
  EmailField,
  List,
  SearchInput,
  TextField,
  WrapperField,
  BulkDeleteButton,
  useTranslate,
} from "react-admin";
import { Card } from "@mui/material";
import { ListActions } from "./components/ListActions";
import { DATAGRID_STYLES } from "./constants";
import { Protected } from "../../components/Protected";
import { createActionButtons } from "../../components/OptimizedActionButtons";

// Create optimized action buttons for customers
const ActionButtons = createActionButtons("customers");

export const CustomerList = () => {
  const translate = useTranslate();

  const filters = [
    <SearchInput
      key="fullname"
      source="fullname@ilike"
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
          omit={[]}
          preferenceKey="customers.datagrid"
          sx={DATAGRID_STYLES}
          bulkActionButtons={
            <Protected action="delete" resource="customers">
              <BulkDeleteButton
                confirmTitle={translate("dialogs.delete.customers.title")}
                confirmContent={translate("dialogs.delete.customers.content")}
                mutationMode="pessimistic"
              />
            </Protected>
          }
        >
          <TextField source="fullname" />
          <EmailField source="email" />
          <TextField source="address" />
          <WrapperField label="common.actions" sortable={false}>
            <ActionButtons />
          </WrapperField>
        </DatagridConfigurable>
      </List>
    </Card>
  );
};
