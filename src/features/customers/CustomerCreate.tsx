import { Create, SimpleForm, TextInput } from "react-admin";
import { INPUT_STYLES } from "./constants";

export const CustomerCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput source="fullname" sx={INPUT_STYLES} />
      <TextInput source="email" type="email" sx={INPUT_STYLES} />
      <TextInput source="address" multiline rows={3} sx={INPUT_STYLES} />
    </SimpleForm>
  </Create>
);
