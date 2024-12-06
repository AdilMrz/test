import { Create, SimpleForm, TextInput } from "react-admin";
import { INPUT_STYLES } from "./constants";

const validateEmail = (value: string) => {
  if (!value) return "Email is required";
  if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
    return "Invalid email address";
  }
  return undefined;
};

export const CustomerCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput source="fullname" sx={INPUT_STYLES} />
      <TextInput
        source="email"
        type="email"
        validate={validateEmail}
        sx={INPUT_STYLES}
      />
      <TextInput source="address" multiline rows={3} sx={INPUT_STYLES} />
    </SimpleForm>
  </Create>
);
