import { Show, SimpleShowLayout, TextField, NumberField } from "react-admin";
import { PageTitle } from "./components/PageTitle";
import { BackActions } from "./components/BackActions";

export const ProductShow = () => (
  <Show title={<PageTitle />} actions={<BackActions />}>
    <SimpleShowLayout>
      <TextField source="name" />
      <TextField source="description" />
      <NumberField
        source="price"
        options={{ style: "currency", currency: "USD" }}
      />
      <NumberField source="stock" />
    </SimpleShowLayout>
  </Show>
);
