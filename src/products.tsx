import {
  Create,
  SimpleForm,
  TextInput,
  DatagridConfigurable,
  List,
  SearchInput,
  TextField,
  TopToolbar,
  SelectColumnsButton,
  CreateButton,
  Show,
  SimpleShowLayout,
  Edit,
  EditButton,
  useRecordContext,
  Button,
} from "react-admin";
import { useNavigate } from "react-router-dom";
import { Card } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";

const PageTitle = () => {
  const record = useRecordContext();
  return <span>{record?.name}</span>;
};

const ListActions = () => (
  <TopToolbar>
    <SelectColumnsButton />
    <CreateButton />
    <EditButton />
  </TopToolbar>
);

const filters = [
  <SearchInput
    key="name"
    source="name@ilike"
    placeholder="Search"
    resettable
    alwaysOn
    sx={{ m: 1 }}
  />,
];

const ProductList = () => (
  <Card title="Products">
    <List
      actions={<ListActions />}
      filters={filters}
      className="p-0"
      sx={{ "& .RaList-main": { padding: 0 } }}
    >
      <DatagridConfigurable>
        <TextField source="name" />
        <TextField source="description" />
        <EditButton label="Edit Product" />
      </DatagridConfigurable>
    </List>
  </Card>
);

const ShowActions = () => {
  const navigate = useNavigate();
  return (
    <TopToolbar>
      <Button label="Back" onClick={() => navigate("/products")}>
        <ArrowBack />
      </Button>
    </TopToolbar>
  );
};

const EditActions = () => {
  const navigate = useNavigate();
  return (
    <TopToolbar>
      <Button label="Back" onClick={() => navigate("/products")}>
        <ArrowBack />
      </Button>
    </TopToolbar>
  );
};

export const ProductCreate = () => (
  <Create title="Create Product">
    <SimpleForm>
      <TextInput source="name" />
      <TextInput source="description" multiline rows={3} />
    </SimpleForm>
  </Create>
);

export const ProductShow = () => (
  <Show title={<PageTitle />} actions={<ShowActions />}>
    <SimpleShowLayout>
      <TextField source="name" />
      <TextField source="description" />
    </SimpleShowLayout>
  </Show>
);

export const ProductEdit = () => (
  <Edit title={<PageTitle />} actions={<EditActions />}>
    <SimpleForm>
      <TextInput source="name" />
      <TextInput source="description" multiline rows={3} />
    </SimpleForm>
  </Edit>
);

export { ProductList };
