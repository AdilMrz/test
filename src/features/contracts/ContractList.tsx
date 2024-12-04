import {
  SearchInput,
  List,
  DatagridConfigurable,
  TextField,
  DateField,
  WrapperField,
  EditButton,
  useGetIdentity,
  useNotify,
} from "react-admin";
import { Card } from "@mui/material";
import { ListActions } from "./components";
import { useEffect } from "react";

const filters = [
  <SearchInput
    key="search"
    source="contract_details@ilike"
    placeholder="Search"
    resettable
    alwaysOn
    className="m-2"
  />,
];

export const ContractList = () => {
  const { identity } = useGetIdentity();
  const notify = useNotify();

  useEffect(() => {
    if (!identity?.id) {
      notify("Not authorized", { type: "error" });
    }
  }, [identity, notify]);

  if (!identity?.id) {
    return null;
  }

  return (
    <Card className="shadow-lg rounded-lg overflow-hidden">
      <List
        actions={<ListActions />}
        filters={filters}
        sort={{ field: "created_at", order: "DESC" }}
        className="p-0"
      >
        <DatagridConfigurable
          omit={[]}
          preferenceKey="contracts.datagrid"
          className="border-collapse [&_.RaDatagrid-headerCell]:border-b [&_.RaDatagrid-headerCell]:border-r [&_.RaDatagrid-headerCell]:bg-gray-100 [&_.RaDatagrid-headerCell]:p-3 [&_.RaDatagrid-row]:hover:bg-gray-50 [&_.RaDatagrid-rowCell]:border-b [&_.RaDatagrid-rowCell]:border-r [&_.RaDatagrid-rowCell]:p-3"
        >
          <TextField source="contract_details" className="font-medium" />
          <TextField source="creator_id" className="text-gray-600" />
          <DateField source="created_at" className="text-gray-600" />
          <DateField source="updated_at" className="text-gray-600" />
          <WrapperField label="Actions">
            <EditButton className="text-green-800 hover:text-green-900" />
          </WrapperField>
        </DatagridConfigurable>
      </List>
    </Card>
  );
};
