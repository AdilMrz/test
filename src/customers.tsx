import {
  DatagridConfigurable,
  EmailField,
  List,
  SearchInput,
  TextField,
  TopToolbar,
  SelectColumnsButton,
} from "react-admin";
import { Card } from "@mui/material";

const ListActions = () => (
  <TopToolbar>
    <SelectColumnsButton />
  </TopToolbar>
);

const filters = [
  <SearchInput
    key="fullname"
    source="fullname@ilike"
    placeholder="Search"
    resettable
    alwaysOn
  />,
];

const CustomerList = () => (
  <Card>
    <List
      actions={<ListActions />}
      filters={filters}
      className="p-0"
      sx={{ "& .RaList-main": { padding: 0 } }}
    >
      <DatagridConfigurable>
        <TextField source="fullname" />
        <EmailField source="email" />
        <TextField source="address" />
      </DatagridConfigurable>
    </List>
  </Card>
);

export { CustomerList };
