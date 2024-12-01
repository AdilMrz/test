import {
  DatagridConfigurable,
  DateField,
  List,
  NumberField,
  ReferenceField,
  SearchInput,
  TextField,
  TopToolbar,
  SelectColumnsButton,
} from "react-admin";
import { Card } from "@mui/material";

const ListActions = () => (
  <TopToolbar>
    <SelectColumnsButton />
  </TopToolbar>
);

const filters = [
  <SearchInput
    key="product"
    source="product_id"
    placeholder="Search"
    resettable
    alwaysOn
  />,
];

const PurchaseList = () => (
  <Card>
    <List
      actions={<ListActions />}
      filters={filters}
      className="p-0"
      sx={{ "& .RaList-main": { padding: 0 } }}
    >
      <DatagridConfigurable>
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
      </DatagridConfigurable>
    </List>
  </Card>
);

export { PurchaseList };
