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
} from "react-admin";
import { Button as MuiButton } from "@mui/material";
import { Add as AddIcon, ArrowBack } from "@mui/icons-material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CreateCustomerDialog } from "./components/CreateCustomerDialog";

export const PurchaseCreate = () => {
  const [isCreateCustomerOpen, setIsCreateCustomerOpen] = useState(false);
  const refresh = useRefresh();
  const navigate = useNavigate();

  const handleCustomerCreated = () => {
    refresh();
  };

  return (
    <Create
      actions={
        <TopToolbar>
          <Button label="Back" onClick={() => navigate("/purchases")}>
            <ArrowBack />
          </Button>
        </TopToolbar>
      }
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
              <SelectInput optionText="fullname" />
            </ReferenceInput>
          </div>
          <div style={{ position: "absolute", right: "32px", top: "0" }}>
            <MuiButton
              startIcon={<AddIcon />}
              onClick={() => setIsCreateCustomerOpen(true)}
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
            <SelectInput optionText="name" />
          </ReferenceInput>
        </div>
        <div style={{ marginBottom: "24px" }}>
          <NumberInput
            source="price"
            min={0}
            validate={(value) => {
              if (value < 0) return "Price cannot be negative";
              return undefined;
            }}
          />
        </div>
        <DateInput source="purchase_date" />
      </SimpleForm>
      <CreateCustomerDialog
        open={isCreateCustomerOpen}
        onClose={() => setIsCreateCustomerOpen(false)}
        onCustomerCreated={handleCustomerCreated}
      />
    </Create>
  );
};
