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
  CreateButton,
  Create,
  SimpleForm,
  NumberInput,
  ReferenceInput,
  DateInput,
  Show,
  SimpleShowLayout,
  Edit,
  EditButton,
  SelectInput,
  Button,
} from "react-admin";
import { useNavigate } from "react-router-dom";
import { Card } from "@mui/material";
import { useRecordContext } from "react-admin";
import { ArrowBack } from "@mui/icons-material";

const ListActions = () => (
  <TopToolbar>
    <SelectColumnsButton />
    <CreateButton />
  </TopToolbar>
);

const filters = [
  <SearchInput
    key="customer_search"
    source="customer_fullname@ilike"
    placeholder="Search"
    resettable
    alwaysOn
    sx={{ m: 1 }}
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
      <DatagridConfigurable
        omit={[]}
        preferenceKey="purchases.datagrid"
        sx={{
          "& .RaDatagrid-headerCell": {
            borderBottom: "1px solid #e0e0e0",
            borderRight: "1px solid #e0e0e0",
          },
          "& .RaDatagrid-row": {
            borderBottom: "1px solid #e0e0e0",
          },
          "& .RaDatagrid-rowCell": {
            borderRight: "1px solid #e0e0e0",
          },
        }}
      >
        <TextField source="customer_fullname" label="Customer Name" />
        <ReferenceField
          source="product_id"
          reference="products"
          label="Product"
        >
          <TextField source="name" />
        </ReferenceField>
        <NumberField
          source="price"
          options={{ style: "currency", currency: "USD" }}
          label="Price"
        />
        <DateField source="purchase_date" label="Purchase Date" />
        <EditButton />
      </DatagridConfigurable>
    </List>
  </Card>
);

const PageTitle = () => {
  const record = useRecordContext();
  return (
    <span>
      Purchase by{" "}
      <ReferenceField
        source="customer_id"
        reference="customers"
        record={record}
      >
        <TextField source="fullname" />
      </ReferenceField>
      {" - "}
      <ReferenceField source="product_id" reference="products" record={record}>
        <TextField source="name" />
      </ReferenceField>
    </span>
  );
};

const ShowActions = () => {
  const navigate = useNavigate();
  return (
    <TopToolbar>
      <Button label="Back" onClick={() => navigate("/purchases")}>
        <ArrowBack />
      </Button>
    </TopToolbar>
  );
};

const EditActions = () => {
  const navigate = useNavigate();
  return (
    <TopToolbar>
      <Button label="Back" onClick={() => navigate("/purchases")}>
        <ArrowBack />
      </Button>
    </TopToolbar>
  );
};

export const PurchaseCreate = () => (
  <Create>
    <SimpleForm>
      <ReferenceInput source="customer_id" reference="customers">
        <SelectInput optionText="fullname" />
      </ReferenceInput>
      <ReferenceInput source="product_id" reference="products">
        <SelectInput optionText="name" />
      </ReferenceInput>
      <NumberInput
        source="price"
        min={0}
        validate={(value) => {
          if (value < 0) return "Price cannot be negative";
          return undefined;
        }}
      />
      <DateInput source="purchase_date" />
    </SimpleForm>
  </Create>
);

export const PurchaseShow = () => (
  <Show title={<PageTitle />} actions={<ShowActions />}>
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

export const PurchaseEdit = () => (
  <Edit title={<PageTitle />} actions={<EditActions />}>
    <SimpleForm>
      <ReferenceInput source="customer_id" reference="customers">
        <SelectInput optionText="fullname" />
      </ReferenceInput>
      <ReferenceInput source="product_id" reference="products">
        <SelectInput optionText="name" />
      </ReferenceInput>
      <NumberInput
        source="price"
        min={0}
        validate={(value) => {
          if (value < 0) return "Price cannot be negative";
          return undefined;
        }}
      />
      <DateInput source="purchase_date" />
    </SimpleForm>
  </Edit>
);

export { PurchaseList };
