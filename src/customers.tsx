import {
  Datagrid,
  EmailField,
  List,
  SearchInput,
  TextField,
} from "react-admin";

const filters = [
  <SearchInput
    key="fullname"
    source="fullname@ilike"
    placeholder="Search"
    resettable
    alwaysOn
  />,
];

export const CustomerList = () => (
  <List filters={filters}>
    <Datagrid>
      <TextField source="fullname" />
      <EmailField source="email" />
      <TextField source="address" />
    </Datagrid>
  </List>
);
