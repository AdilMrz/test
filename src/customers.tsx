import { Datagrid, EmailField, List, TextField, TextInput } from "react-admin";

const filters = [
  <TextInput key="fullname" source="fullname" />,
  <TextInput key="email" source="email" />,
  <TextInput key="address" source="address" />,
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
