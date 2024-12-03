import {
  DatagridConfigurable,
  EmailField,
  List,
  SearchInput,
  TextField,
  WrapperField,
  EditButton,
} from "react-admin";
import { Card } from "@mui/material";
import { ListActions } from "./components/ListActions";
import { DATAGRID_STYLES } from "./constants";

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
      >
        <TextField source="fullname" label="Full Name" />
        <EmailField source="email" label="Email" />
        <TextField source="address" label="Address" />
        <WrapperField label="Actions">
          <EditButton />
        </WrapperField>
      </DatagridConfigurable>
    </List>
  </Card>
);
