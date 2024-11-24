import { Datagrid, List, TextField, TextInput } from "react-admin";

const filters = [
  <TextInput key="name" source="name" />,
  <TextInput key="description" source="description" />,
];

export const ProductList = () => (
  <List filters={filters}>
    <Datagrid>
      <TextField source="name" />
      <TextField source="description" />
    </Datagrid>
  </List>
);
