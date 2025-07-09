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
  useTranslate,
} from "react-admin";
import { Card } from "@mui/material";
import { ListActions } from "./components/ListActions";
import { DATAGRID_STYLES } from "./constants";
import { Protected } from "../../components/Protected";

const ActionButtons = () => {
  const record = useRecordContext();
  const translate = useTranslate();

  if (!record) return null;

  return (
    <WrapperField>
      <Protected
        action="update"
        resource="customers"
        recordUserId={record.created_by}
      >
        <EditButton />
      </Protected>
      <Protected
        action="delete"
        resource="customers"
        recordUserId={record.created_by}
      >
        <DeleteButton
          confirmTitle={translate("dialogs.delete.customer.title")}
          confirmContent={translate("dialogs.delete.customer.content", {
            name: record.fullname,
          })}
          mutationMode="pessimistic"
        />
      </Protected>
    </WrapperField>
  );
};

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
