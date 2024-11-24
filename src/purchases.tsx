import {
  Datagrid,
  List,
  NumberField,
  NumberInput,
  ReferenceField,
  ReferenceInput,
  TextField,
  TextInput,
  SearchInput,
} from "react-admin";

const filters = [
  <ReferenceInput
    key="customer_id"
    source="customer_id"
    reference="customers"
  />,
  <ReferenceInput key="product_id" source="product_id" reference="products" />,
  <NumberInput key="price" source="price" />,
  <TextInput key="purchase_date" source="purchase_date" />,
  <SearchInput key="fullname" source="fullname@ilike" placeholder="Search" />,
];

export const PurchaseList = () => (
  <List filters={filters}>
    <Datagrid>
      <ReferenceField source="customer_id" reference="customers" />
      <ReferenceField source="product_id" reference="products" />
      <NumberField source="price" />
      <TextField source="purchase_date" />
    </Datagrid>
  </List>
);
