import { Create, SimpleForm, TextInput, useGetIdentity } from "react-admin";
import { INPUT_STYLES } from "./constants";
import { logAction } from "../../utils/logger";
import { LOG_ACTIONS } from "../../utils/logActions";

interface ProductData {
  name: string;
  description: string;
}

export const ProductCreate = () => {
  const { identity } = useGetIdentity();

  const transform = async (data: ProductData) => {
    if (identity?.email) {
      await logAction(
        identity.email,
        LOG_ACTIONS.CREATE_PRODUCT,
        `Created product: ${data.name}`,
      );
    }
    return data;
  };

  return (
    <Create transform={transform}>
      <SimpleForm>
        <TextInput source="name" sx={INPUT_STYLES} />
        <TextInput source="description" multiline rows={3} sx={INPUT_STYLES} />
      </SimpleForm>
    </Create>
  );
};
