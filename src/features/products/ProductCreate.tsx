import { Create, SimpleForm, TextInput, NumberInput } from "react-admin";
import { INPUT_STYLES } from "./constants";

export const ProductCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput source="name" sx={INPUT_STYLES} />
      <TextInput source="description" multiline rows={3} sx={INPUT_STYLES} />
      <NumberInput source="price" sx={INPUT_STYLES} />
      <NumberInput source="stock" sx={INPUT_STYLES} />
    </SimpleForm>
  </Create>
);
