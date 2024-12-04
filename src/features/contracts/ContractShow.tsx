import { Show, SimpleShowLayout, TextField, DateField } from "react-admin";
import { Card } from "@mui/material";
import { BackActions } from "./components";

export const ContractShow = () => (
  <Card className="shadow-lg rounded-lg overflow-hidden">
    <Show actions={<BackActions />}>
      <SimpleShowLayout className="p-6">
        <TextField source="contract_details" />
        <TextField source="creator_id" />
        <DateField source="created_at" />
        <DateField source="updated_at" />
      </SimpleShowLayout>
    </Show>
  </Card>
);
