import {
  DatagridConfigurable,
  List,
  SearchInput,
  TextField,
  WrapperField,
  EditButton,
} from "react-admin";
import { Card } from "@mui/material";
import { ListActions } from "./components/ListActions";
import { DATAGRID_STYLES } from "./constants";

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

export const ProductList = () => (
  <Card>
    <List
      actions={<ListActions />}
      filters={filters}
      className="p-0"
      sx={{ "& .RaList-main": { padding: 0 } }}
    >
      <DatagridConfigurable
        omit={[]}
        preferenceKey="products.datagrid"
        sx={DATAGRID_STYLES}
      >
        <TextField source="name" label="Name" />
        <TextField source="description" label="Description" />
        <WrapperField label="Actions">
          <EditButton />
        </WrapperField>
      </DatagridConfigurable>
    </List>
  </Card>
);
