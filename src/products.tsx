import { Datagrid, List, TextField, TextInput } from "react-admin";
import { Card } from "@mui/material";

const filters = [
  <TextInput
    key="name"
    source="name"
    className="bg-gray-700 text-gray-100"
    label="Name"
  />,
  <TextInput
    key="description"
    source="description"
    className="bg-gray-700 text-gray-100"
    label="Description"
  />,
];

const ProductList = () => (
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
        <TextField source="name" />
        <TextField source="description" />
      </Datagrid>
    </List>
  </Card>
);

export { ProductList };
