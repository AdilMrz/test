import { Create, SimpleForm, TextInput } from "react-admin";
import { INPUT_STYLES } from "./constants";

export const ProductCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput source="name" sx={INPUT_STYLES} />
      <TextInput source="description" multiline rows={3} sx={INPUT_STYLES} />
    </SimpleForm>
  </Create>
);
