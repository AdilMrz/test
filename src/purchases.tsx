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
  TextInput,
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
    key="product"
    source="product_id"
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
        <EditButton label="Edit Purchase" />
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
      <NumberInput source="price" />
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
      <NumberInput source="price" />
      <DateInput source="purchase_date" />
    </SimpleForm>
  </Edit>
);

export { PurchaseList };
