import {
  DatagridConfigurable,
  EmailField,
  List,
  SearchInput,
  TextField,
  TopToolbar,
  SelectColumnsButton,
  CreateButton,
  Create,
  SimpleForm,
  TextInput,
  Show,
  SimpleShowLayout,
  Edit,
  EditButton,
  Button,
  useRecordContext,
  WrapperField,
  useCreate,
  useNotify,
  useRefresh,
} from "react-admin";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button as MuiButton,
} from "@mui/material";
import { ArrowBack, Add as AddIcon } from "@mui/icons-material";

interface CreateCustomerDialogProps {
  open: boolean;
  onClose: () => void;
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

const ListActions = () => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  return (
    <TopToolbar>
      <SelectColumnsButton />
      <MuiButton
        startIcon={<AddIcon />}
        onClick={() => setIsCreateOpen(true)}
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
        Create Customer
      </MuiButton>
      <CreateCustomerDialog
        open={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
      />
    </TopToolbar>
  );
};

const filters = [
  <SearchInput
    key="fullname"
    source="fullname@ilike"
    placeholder="Search"
    resettable
    alwaysOn
    sx={{ m: 1 }}
  />,
];

const CustomerList = () => (
  <Card>
    <List
      actions={<ListActions />}
      filters={filters}
      className="p-0"
      sx={{ "& .RaList-main": { padding: 0 } }}
    >
      <DatagridConfigurable
        omit={[]}
        preferenceKey="customers.datagrid"
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
        <TextField source="fullname" label="Full Name" />
        <EmailField source="email" label="Email" />
        <TextField source="address" label="Address" />
        <WrapperField label="Actions">
          <EditButton />
        </WrapperField>
      </DatagridConfigurable>
    </List>
  </Card>
);

const PageTitle = () => {
  const record = useRecordContext();
  return <span>{record?.fullname}</span>;
};

const ShowActions = () => {
  const navigate = useNavigate();
  return (
    <TopToolbar>
      <Button label="Back" onClick={() => navigate("/customers")}>
        <ArrowBack />
      </Button>
    </TopToolbar>
  );
};

const EditActions = () => {
  const navigate = useNavigate();
  return (
    <TopToolbar>
      <Button label="Back" onClick={() => navigate("/customers")}>
        <ArrowBack />
      </Button>
    </TopToolbar>
  );
};

export const CustomerCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput
        source="fullname"
        sx={{
          "& .MuiOutlinedInput-root": {
            borderRadius: "4px",
            "&:hover fieldset": {
              borderColor: "#14532d",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#14532d",
            },
          },
        }}
      />
      <TextInput
        source="email"
        type="email"
        sx={{
          "& .MuiOutlinedInput-root": {
            borderRadius: "4px",
            "&:hover fieldset": {
              borderColor: "#14532d",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#14532d",
            },
          },
        }}
      />
      <TextInput
        source="address"
        multiline
        rows={3}
        sx={{
          "& .MuiOutlinedInput-root": {
            borderRadius: "4px",
            "&:hover fieldset": {
              borderColor: "#14532d",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#14532d",
            },
          },
        }}
      />
    </SimpleForm>
  </Create>
);

export const CustomerShow = () => (
  <Show title={<PageTitle />} actions={<ShowActions />}>
    <SimpleShowLayout>
      <TextField source="fullname" />
      <EmailField source="email" />
      <TextField source="address" />
    </SimpleShowLayout>
  </Show>
);

export const CustomerEdit = () => (
  <Edit title={<PageTitle />} actions={<EditActions />}>
    <SimpleForm>
      <TextInput source="fullname" />
      <TextInput source="email" type="email" />
      <TextInput source="address" />
    </SimpleForm>
  </Edit>
);

export { CustomerList };
