import { Show, SimpleShowLayout, TextField } from "react-admin";
import { PageTitle } from "./components/PageTitle";
import { BackActions } from "./components/BackActions";

export const ProductShow = () => (
  <Show title={<PageTitle />} actions={<BackActions />}>
    <SimpleShowLayout>
      <TextField source="name" />
      <TextField source="description" />
    </SimpleShowLayout>
  </Show>
);
