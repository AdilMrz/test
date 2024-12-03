import {
  Edit,
  SimpleForm,
  ReferenceInput,
  SelectInput,
  NumberInput,
  DateInput,
} from "react-admin";
import { PageTitle } from "./components/PageTitle";
import { BackActions } from "./components/BackActions";

export const PurchaseEdit = () => (
  <Edit title={<PageTitle />} actions={<BackActions />}>
    <SimpleForm>
      <ReferenceInput source="customer_id" reference="customers">
        <SelectInput optionText="fullname" />
      </ReferenceInput>
      <ReferenceInput source="product_id" reference="products">
        <SelectInput optionText="name" />
      </ReferenceInput>
      <NumberInput
        source="price"
        min={0}
        validate={(value) => {
          if (value < 0) return "Price cannot be negative";
          return undefined;
        }}
      />
      <DateInput source="purchase_date" />
    </SimpleForm>
  </Edit>
);
