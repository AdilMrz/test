import englishMessages from "ra-language-english";

const customEnglishMessages = {
  ...englishMessages,
  resources: {
    customers: {
      name: "Customer |||| Customers",
      fields: {
        fullname: "Full Name",
        email: "Email",
        address: "Address",
        created_at: "Created At",
        updated_at: "Updated At",
      },
      create: "Create Customer",
      edit: "Edit Customer",
      delete: "Delete Customer",
      details: "Customer Details",
    },
    products: {
      name: "Product |||| Products",
      fields: {
        name: "Name",
        description: "Description",
        photo_url: "Photo",
        created_at: "Created At",
        updated_at: "Updated At",
      },
      create: "Create Product",
      edit: "Edit Product",
      delete: "Delete Product",
      details: "Product Details",
    },
    purchases: {
      name: "Purchase |||| Purchases",
      fields: {
        customer_id: "Customer",
        product_id: "Product",
        price: "Price",
        purchase_date: "Purchase Date",
        customer_fullname: "Customer Name",
        created_at: "Created At",
        updated_at: "Updated At",
      },
      create: "Create Purchase",
      edit: "Edit Purchase",
      delete: "Delete Purchase",
      details: "Purchase Details",
    },
    audit_logs: {
      name: "Activity Log |||| Activity Logs",
      fields: {
        action: "Action",
        resource: "Resource",
        date: "Date",
        user: "User",
        details: "Details",
        created_at: "Created At",
      },
    },
    maintenance: {
      name: "Maintenance",
      title: "System Maintenance",
      description: "System maintenance and configuration",
    },
  },
  dashboard: {
    title: "Dashboard",
    welcome: "Welcome to the Dashboard",
    startDate: "Start Date",
    endDate: "End Date",
    apply: "Apply",
    clear: "Clear",
    export: "Export PDF",
    cards: {
      purchaseDistribution: "Purchase Distribution",
      productRevenue: "Product Revenue",
      recentPurchases: "Recent Purchases",
    },
  },
  common: {
    actions: "Actions",
    details: "Details",
    edit: "Edit",
    delete: "Delete",
    cancel: "Cancel",
    save: "Save",
    create: "Create",
    search: "Search",
    filter: "Filter",
    refresh: "Refresh",
    back: "Back",
    noData: "No data available",
    areYouSure: "Are you sure?",
    startDate: "Start Date",
    endDate: "End Date",
    apply: "Apply",
    clear: "Clear Filter",
  },
  buttons: {
    create_customer: "New Customer",
    create_product: "New Product",
    create_purchase: "New Purchase",
    upload_photo: "Upload Photo",
    change_photo: "Change Photo",
    export: "Export",
  },
  dialogs: {
    delete: {
      title: "Delete Confirmation",
      content: "Are you sure you want to delete this item?",
    },
    create: {
      customer: "Create New Customer",
      product: "Create New Product",
      purchase: "Create New Purchase",
    },
    edit: {
      customer: "Edit Customer",
      product: "Edit Product",
      purchase: "Edit Purchase",
    },
  },
  validation: {
    required: "Required",
    email: "Invalid email address",
    price: {
      positive: "Price must be positive",
      required: "Price is required",
    },
    date: {
      invalid: "Invalid date",
      future: "Date cannot be in the future",
    },
  },
  notifications: {
    success: {
      create: "Successfully created",
      update: "Successfully updated",
      delete: "Successfully deleted",
    },
    error: {
      create: "Error creating item",
      update: "Error updating item",
      delete: "Error deleting item",
      general: "An error occurred",
    },
  },
};

export default customEnglishMessages;
