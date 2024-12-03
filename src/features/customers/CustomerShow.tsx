import { Show, SimpleShowLayout, TextField, EmailField } from "react-admin";
import { PageTitle } from "./components/PageTitle";
import { BackActions } from "./components/BackActions";

export const CustomerShow = () => (
  <Show title={<PageTitle />} actions={<BackActions />}>
    <SimpleShowLayout>
      <TextField source="fullname" />
      <EmailField source="email" />
      <TextField source="address" />
    </SimpleShowLayout>
  </Show>
);
