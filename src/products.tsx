import {
  Create,
  SimpleForm,
  TextInput,
  DatagridConfigurable,
  List,
  SearchInput,
  TextField,
  TopToolbar,
  SelectColumnsButton,
  CreateButton,
  Show,
  SimpleShowLayout,
  Edit,
  EditButton,
  useRecordContext,
  Button,
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

interface CreateProductDialogProps {
  open: boolean;
  onClose: () => void;
}

const CreateProductDialog = ({ open, onClose }: CreateProductDialogProps) => {
  const [create] = useCreate();
  const notify = useNotify();
  const refresh = useRefresh();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const handleSubmit = async () => {
    try {
      await create(
        "products",
        { data: formData },
        {
          onSuccess: () => {
            notify("Product created successfully");
            refresh();
            onClose();
          },
          onError: (error) => {
            notify("Error creating product", { type: "error" });
          },
        },
      );
    } catch (error) {
      notify("Error creating product", { type: "error" });
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
        Create New Product
      </DialogTitle>
      <DialogContent sx={{ padding: "24px" }}>
        <div className="flex flex-col gap-4 min-w-[400px] mt-2">
          <input
            type="text"
            placeholder="Product Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-700 focus:border-transparent"
          />
          <textarea
            placeholder="Description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            rows={3}
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
          Create Product
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
        Create Product
      </MuiButton>
      <CreateProductDialog
        open={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
      />
    </TopToolbar>
  );
};

const PageTitle = () => {
  const record = useRecordContext();
  return <span>{record?.name}</span>;
};

const filters = [
  <SearchInput
    key="name"
    source="name@ilike"
    placeholder="Search"
    resettable
    alwaysOn
    sx={{ m: 1 }}
  />,
];

const ProductList = () => (
  <Card title="Products">
    <List
      actions={<ListActions />}
      filters={filters}
      className="p-0"
      sx={{ "& .RaList-main": { padding: 0 } }}
    >
      <DatagridConfigurable
        omit={[]}
        preferenceKey="products.datagrid"
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
        <TextField source="name" label="Name" />
        <TextField source="description" label="Description" />
        <WrapperField label="Actions">
          <EditButton />
        </WrapperField>
      </DatagridConfigurable>
    </List>
  </Card>
);

const ShowActions = () => {
  const navigate = useNavigate();
  return (
    <TopToolbar>
      <Button label="Back" onClick={() => navigate("/products")}>
        <ArrowBack />
      </Button>
    </TopToolbar>
  );
};

const EditActions = () => {
  const navigate = useNavigate();
  return (
    <TopToolbar>
      <Button label="Back" onClick={() => navigate("/products")}>
        <ArrowBack />
      </Button>
    </TopToolbar>
  );
};

export const ProductCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput
        source="name"
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
        source="description"
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

export const ProductShow = () => (
  <Show title={<PageTitle />} actions={<ShowActions />}>
    <SimpleShowLayout>
      <TextField source="name" />
      <TextField source="description" />
    </SimpleShowLayout>
  </Show>
);

export const ProductEdit = () => (
  <Edit title={<PageTitle />} actions={<EditActions />}>
    <SimpleForm>
      <TextInput source="name" />
      <TextInput source="description" multiline rows={3} />
    </SimpleForm>
  </Edit>
);

export { ProductList };
