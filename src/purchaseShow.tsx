import {
  NumberField,
  ReferenceField,
  Show,
  SimpleShowLayout,
  TextField,
} from "react-admin";

export const PurchaseShow = () => (
  <Show>
    <SimpleShowLayout>
      <TextField source="id" />
      <ReferenceField source="customer_id" reference="customers" link={false}>
        <TextField source="fullname" />
      </ReferenceField>
      <ReferenceField source="product_id" reference="products" />
      <NumberField
        source="price"
        options={{
          style: "currency",
          currency: "USD",
          currencyDisplay: "narrowSymbol",
        }}
      />
      <TextField source="purchase_date" />
    </SimpleShowLayout>
  </Show>
);
