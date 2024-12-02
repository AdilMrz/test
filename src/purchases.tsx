import {
  DatagridConfigurable,
  DateField,
  List,
  NumberField,
  ReferenceField,
  SearchInput,
  TextField,
  TopToolbar,
  SelectColumnsButton,
  CreateButton,
  Create,
  SimpleForm,
  NumberInput,
  ReferenceInput,
  DateInput,
  Show,
  SimpleShowLayout,
  Edit,
  EditButton,
  SelectInput,
  Button,
  WrapperField,
  useCreate,
  useNotify,
  useRefresh,
} from "react-admin";
import { useNavigate } from "react-router-dom";
import {
  Card,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button as MuiButton,
} from "@mui/material";
import { useRecordContext } from "react-admin";
import { ArrowBack, Add as AddIcon } from "@mui/icons-material";
import { useState } from "react";

const ListActions = () => {
  const navigate = useNavigate();

  return (
    <TopToolbar>
      <SelectColumnsButton />
      <MuiButton
        startIcon={<AddIcon />}
        onClick={() => navigate("/purchases/create")}
        variant="outlined"
        size="medium"
        sx={{
          borderColor: "#14532d",
          color: "#14532d",
          height: "40px",
          minWidth: "140px",
          marginLeft: "8px",
          "&:hover": {
            borderColor: "#0f4024",
            backgroundColor: "rgba(20, 83, 45, 0.04)",
          },
        }}
      >
        Create Purchase
      </MuiButton>
    </TopToolbar>
  );
};

const filters = [
  <SearchInput
    key="customer_search"
    source="customer_fullname@ilike"
    placeholder="Search"
    resettable
    alwaysOn
    sx={{ m: 1 }}
  />,
];

const PurchaseList = () => (
  <Card>
    <List
      actions={<ListActions />}
      filters={filters}
      sort={{ field: "purchase_date", order: "DESC" }}
      className="p-0"
      sx={{ "& .RaList-main": { padding: 0 } }}
    >
      <DatagridConfigurable
        omit={[]}
        preferenceKey="purchases.datagrid"
        sx={{
          "& .RaDatagrid-headerCell": {
            borderBottom: "1px solid #e0e0e0",
            borderRight: "1px solid #e0e0e0",
          },
          "& .RaDatagrid-row": {
            borderBottom: "1px solid #e0e0e0",
          },
          "& .RaDatagrid-rowCell": {
            borderRight: "1px solid #e0e0e0",
          },
        }}
      >
        <TextField source="customer_fullname" label="Customer Name" />
        <ReferenceField
          source="product_id"
          reference="products"
          label="Product"
        >
          <TextField source="name" />
        </ReferenceField>
        <NumberField
          source="price"
          options={{ style: "currency", currency: "USD" }}
          label="Price"
        />
        <DateField source="purchase_date" label="Purchase Date" />
        <WrapperField label="Actions">
          <EditButton />
        </WrapperField>
      </DatagridConfigurable>
    </List>
  </Card>
);

const PageTitle = () => {
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

const ShowActions = () => {
  const navigate = useNavigate();
  return (
    <TopToolbar>
      <Button label="Back" onClick={() => navigate("/purchases")}>
        <ArrowBack />
      </Button>
    </TopToolbar>
  );
};

const EditActions = () => {
  const navigate = useNavigate();
  return (
    <TopToolbar>
      <Button label="Back" onClick={() => navigate("/purchases")}>
        <ArrowBack />
      </Button>
    </TopToolbar>
  );
};

interface CreateCustomerDialogProps {
  open: boolean;
  onClose: () => void;
  onCustomerCreated: (customer: { id: number; fullname: string }) => void;
}

const CreateCustomerDialog = ({ open, onClose }: CreateCustomerDialogProps) => {
  const [create] = useCreate();
  const notify = useNotify();
  const refresh = useRefresh();
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    address: "",
  });

  const handleSubmit = async () => {
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      notify("Please enter a valid email address", { type: "error" });
      return;
    }

    try {
      await create(
        "customers",
        { data: formData },
        {
          onSuccess: () => {
            notify("Customer created successfully");
            refresh();
            onClose();
          },
          onError: (error) => {
            notify("Error creating customer", { type: "error" });
          },
        },
      );
    } catch (error) {
      notify("Error creating customer", { type: "error" });
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          borderRadius: "8px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        },
      }}
    >
      <DialogTitle
        sx={{
          borderBottom: "1px solid #e0e0e0",
          backgroundColor: "#14532d",
          color: "#ffffff",
          fontSize: "1.2rem",
        }}
      >
        Create New Customer
      </DialogTitle>
      <DialogContent sx={{ padding: "24px" }}>
        <div className="flex flex-col gap-4 min-w-[400px] mt-2">
          <input
            type="text"
            placeholder="Full Name"
            value={formData.fullname}
            onChange={(e) =>
              setFormData({ ...formData, fullname: e.target.value })
            }
            className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-700 focus:border-transparent"
          />
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-700 focus:border-transparent"
            pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
            required
          />
          <input
            type="text"
            placeholder="Address"
            value={formData.address}
            onChange={(e) =>
              setFormData({ ...formData, address: e.target.value })
            }
            className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-700 focus:border-transparent"
          />
        </div>
      </DialogContent>
      <DialogActions
        sx={{
          padding: "16px 24px",
          borderTop: "1px solid #e0e0e0",
          gap: "8px",
        }}
      >
        <MuiButton
          onClick={onClose}
          sx={{
            color: "#666",
            "&:hover": { backgroundColor: "#f5f5f5" },
          }}
        >
          Cancel
        </MuiButton>
        <MuiButton
          onClick={handleSubmit}
          variant="contained"
          sx={{
            backgroundColor: "#14532d",
            "&:hover": { backgroundColor: "#0f4024" },
          }}
        >
          Create Customer
        </MuiButton>
      </DialogActions>
    </Dialog>
  );
};

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

export const PurchaseShow = () => (
  <Show title={<PageTitle />} actions={<ShowActions />}>
    <SimpleShowLayout>
      <DateField source="purchase_date" />
      <ReferenceField source="customer_id" reference="customers">
        <TextField source="fullname" />
      </ReferenceField>
      <ReferenceField source="product_id" reference="products">
        <TextField source="name" />
      </ReferenceField>
      <NumberField
        source="price"
        options={{ style: "currency", currency: "USD" }}
      />
    </SimpleShowLayout>
  </Show>
);

export const PurchaseEdit = () => (
  <Edit title={<PageTitle />} actions={<EditActions />}>
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

export { PurchaseList };
