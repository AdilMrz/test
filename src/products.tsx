import {
  DatagridConfigurable,
  List,
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
    key="name"
    source="name@ilike"
    placeholder="Search"
    resettable
    alwaysOn
  />,
];

const ProductList = () => (
  <Card>
    <List
      actions={<ListActions />}
      filters={filters}
      className="p-0"
      sx={{ "& .RaList-main": { padding: 0 } }}
    >
      <DatagridConfigurable>
        <TextField source="name" />
        <TextField source="description" />
      </DatagridConfigurable>
    </List>
  </Card>
);

export { ProductList };
