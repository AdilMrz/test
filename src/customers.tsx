import {
  Datagrid,
  EmailField,
  List,
  SearchInput,
  TextField,
} from "react-admin";
import { Card } from "@mui/material";

const filters = [
  <SearchInput
    key="fullname"
    source="fullname@ilike"
    placeholder="Search"
    resettable
    alwaysOn
    className="bg-gray-700 text-gray-100"
  />,
];

const CustomerList = () => (
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
        <TextField source="fullname" />
        <EmailField source="email" />
        <TextField source="address" />
      </Datagrid>
    </List>
  </Card>
);

export { CustomerList };
