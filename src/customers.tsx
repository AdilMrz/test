import {
  DatagridConfigurable,
  EmailField,
  List,
  SearchInput,
  TextField,
  TopToolbar,
  SelectColumnsButton,
  CreateButton,
  Create,
  SimpleForm,
  TextInput,
  Show,
  SimpleShowLayout,
  Edit,
  EditButton,
  Button,
  useRecordContext,
} from "react-admin";
import { useNavigate } from "react-router-dom";
import { Card } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";

const ListActions = () => (
  <TopToolbar>
    <SelectColumnsButton />
    <CreateButton />
  </TopToolbar>
);

const filters = [
  <SearchInput
    key="fullname"
    source="fullname@ilike"
    placeholder="Search"
    resettable
    alwaysOn
    sx={{ m: 1 }}
  />,
];

const CustomerList = () => (
  <Card>
    <List
      actions={<ListActions />}
      filters={filters}
      className="p-0"
      sx={{ "& .RaList-main": { padding: 0 } }}
    >
      <DatagridConfigurable
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
        <TextField source="fullname" />
        <EmailField source="email" />
        <TextField source="address" />
        <EditButton label="Edit Customer" />
      </DatagridConfigurable>
    </List>
  </Card>
);

const PageTitle = () => {
  const record = useRecordContext();
  return <span>{record?.fullname}</span>;
};

const ShowActions = () => {
  const navigate = useNavigate();
  return (
    <TopToolbar>
      <Button label="Back" onClick={() => navigate("/customers")}>
        <ArrowBack />
      </Button>
    </TopToolbar>
  );
};

const EditActions = () => {
  const navigate = useNavigate();
  return (
    <TopToolbar>
      <Button label="Back" onClick={() => navigate("/customers")}>
        <ArrowBack />
      </Button>
    </TopToolbar>
  );
};

export const CustomerCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput source="fullname" />
      <TextInput source="email" />
      <TextInput source="address" />
    </SimpleForm>
  </Create>
);

export const CustomerShow = () => (
  <Show title={<PageTitle />} actions={<ShowActions />}>
    <SimpleShowLayout>
      <TextField source="fullname" />
      <EmailField source="email" />
      <TextField source="address" />
    </SimpleShowLayout>
  </Show>
);

export const CustomerEdit = () => (
  <Edit title={<PageTitle />} actions={<EditActions />}>
    <SimpleForm>
      <TextInput source="fullname" />
      <TextInput source="email" type="email" />
      <TextInput source="address" />
    </SimpleForm>
  </Edit>
);

export { CustomerList };
