import { List, Datagrid, TextField, DateField } from "react-admin";

export const LogList = () => (
  <List>
    <Datagrid>
      <TextField source="user_email" label="User Email" />
      <TextField source="action" label="Action" />
      <TextField source="details" label="Details" />
      <DateField source="created_at" label="Date" />
    </Datagrid>
  </List>
);
