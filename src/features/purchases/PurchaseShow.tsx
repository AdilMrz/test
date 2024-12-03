import {
  Show,
  SimpleShowLayout,
  DateField,
  ReferenceField,
  TextField,
  NumberField,
} from "react-admin";
import { PageTitle } from "./components/PageTitle";
import { BackActions } from "./components/BackActions";

export const PurchaseShow = () => (
  <Show title={<PageTitle />} actions={<BackActions />}>
    <SimpleShowLayout>
      <DateField source="purchase_date" />
      <ReferenceField source="customer_id" reference="customers">
        <TextField source="fullname" />
      </ReferenceField>
      <ReferenceField source="product_id" reference="products">
        <TextField source="name" />
      </ReferenceField>
      <NumberField
        source="price"
        options={{ style: "currency", currency: "USD" }}
      />
    </SimpleShowLayout>
  </Show>
);
