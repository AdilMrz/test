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
import { Card } from "@mui/material";

const filters = [
  <ReferenceInput
    key="customer_id"
    source="customer_id"
    reference="customers"
    className="bg-gray-700 text-gray-100"
  />,
  <ReferenceInput
    key="product_id"
    source="product_id"
    reference="products"
    className="bg-gray-700 text-gray-100"
  />,
  <NumberInput
    key="price"
    source="price"
    className="bg-gray-700 text-gray-100"
  />,
  <TextInput
    key="purchase_date"
    source="purchase_date"
    className="bg-gray-700 text-gray-100"
  />,
  <SearchInput
    key="fullname"
    source="fullname@ilike"
    placeholder="Search"
    className="bg-gray-700 text-gray-100"
  />,
];

const PurchaseList = () => (
  <Card className="bg-gray-800 shadow-lg rounded-lg">
    <List
      filters={filters}
      className="p-0"
      sx={{
        "& .RaList-main": { padding: 0 },
        "& .RaDatagrid-table": {
          backgroundColor: "rgb(31, 41, 55)",
        },
        "& .RaDatagrid-headerCell": {
          backgroundColor: "rgb(55, 65, 81)",
          color: "rgb(243, 244, 246)",
        },
        "& .RaDatagrid-row": {
          "&:hover": {
            backgroundColor: "rgb(55, 65, 81)",
          },
          backgroundColor: "rgb(31, 41, 55)",
          color: "rgb(243, 244, 246)",
        },
      }}
    >
      <Datagrid>
        <ReferenceField source="customer_id" reference="customers" link={false}>
          <TextField source="fullname" />
        </ReferenceField>
        <ReferenceField source="product_id" reference="products" link={false}>
          <TextField source="name" />
        </ReferenceField>
        <NumberField
          source="price"
          options={{
            style: "currency",
            currency: "USD",
            currencyDisplay: "narrowSymbol",
          }}
        />
        <TextField source="purchase_date" />
      </Datagrid>
    </List>
  </Card>
);

export { PurchaseList };
