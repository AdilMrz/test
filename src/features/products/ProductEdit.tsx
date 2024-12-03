import { Edit, SimpleForm, TextInput } from "react-admin";
import { PageTitle } from "./components/PageTitle";
import { BackActions } from "./components/BackActions";
import { INPUT_STYLES } from "./constants";

export const ProductEdit = () => (
  <Edit title={<PageTitle />} actions={<BackActions />}>
    <SimpleForm>
      <TextInput source="name" sx={INPUT_STYLES} />
      <TextInput source="description" multiline rows={3} sx={INPUT_STYLES} />
    </SimpleForm>
  </Edit>
);
