import {
  Create,
  SimpleForm,
  ReferenceInput,
  SelectInput,
  NumberInput,
  DateInput,
  Button,
  useRefresh,
  TopToolbar,
  required,
} from "react-admin";
import { Button as MuiButton } from "@mui/material";
import { Add as AddIcon, ArrowBack } from "@mui/icons-material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CreateCustomerDialog } from "./components/CreateCustomerDialog";

interface PurchaseFormData {
  customer_id: string;
  product_id: string;
  price: number;
  purchase_date?: string;
}

export const PurchaseCreate = () => {
  const navigate = useNavigate();
  const [isCreateCustomerOpen, setIsCreateCustomerOpen] = useState(false);
  const refresh = useRefresh();

  const handleCustomerCreated = () => {
    refresh();
    setIsCreateCustomerOpen(false);
  };

  const transform = (data: PurchaseFormData) => ({
    ...data,
    purchase_date: data.purchase_date || new Date().toISOString(),
  });

  return (
    <Create
      actions={
        <TopToolbar>
          <Button label="Back" onClick={() => navigate("/purchases")}>
            <ArrowBack />
          </Button>
        </TopToolbar>
      }
      transform={transform}
      redirect="list"
    >
      <SimpleForm>
        <div
          style={{
            display: "flex",
            width: "100%",
            position: "relative",
            marginBottom: "24px",
          }}
        >
          <div style={{ flex: 1, paddingRight: "180px" }}>
            <ReferenceInput source="customer_id" reference="customers">
              <SelectInput optionText="fullname" validate={required()} />
            </ReferenceInput>
          </div>
          <div style={{ position: "absolute", right: "32px", top: "0" }}>
            <MuiButton
              startIcon={<AddIcon />}
              onClick={(e: React.MouseEvent) => {
                e.preventDefault();
                setIsCreateCustomerOpen(true);
              }}
              variant="outlined"
              size="medium"
              sx={{
                borderColor: "#14532d",
                color: "#14532d",
                height: "40px",
                minWidth: "140px",
                mt: 1,
                "&:hover": {
                  borderColor: "#0f4024",
                  backgroundColor: "rgba(20, 83, 45, 0.04)",
                },
              }}
            >
              New Customer
            </MuiButton>
          </div>
        </div>
        <div style={{ marginBottom: "24px" }}>
          <ReferenceInput source="product_id" reference="products">
            <SelectInput optionText="name" validate={required()} />
          </ReferenceInput>
        </div>
        <div style={{ marginBottom: "24px" }}>
          <NumberInput
            source="price"
            min={0}
            validate={[
              required(),
              (value) => {
                if (value < 0) return "Price cannot be negative";
                return undefined;
              },
            ]}
          />
        </div>
        <DateInput source="purchase_date" defaultValue={new Date()} />
      </SimpleForm>
      <CreateCustomerDialog
        open={isCreateCustomerOpen}
        onClose={() => setIsCreateCustomerOpen(false)}
        onCustomerCreated={handleCustomerCreated}
      />
    </Create>
  );
};
