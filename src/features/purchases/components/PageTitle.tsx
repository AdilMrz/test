import { ReferenceField, TextField, useRecordContext } from "react-admin";

export const PageTitle = () => {
  const record = useRecordContext();
  return (
    <span>
      Purchase by{" "}
      <ReferenceField
        source="customer_id"
        reference="customers"
        record={record}
      >
        <TextField source="fullname" />
      </ReferenceField>
      {" - "}
      <ReferenceField source="product_id" reference="products" record={record}>
        <TextField source="name" />
      </ReferenceField>
    </span>
  );
};
