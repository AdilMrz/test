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
        image: "Image",
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
        timestamp: "Timestamp",
        operation: "Operation",
        user_fullname: "User",
        status: "Status",
      },
    },
    maintenance: {
      name: "Maintenance",
      title: "System Maintenance",
      description: "System maintenance and configuration",
    },
    dashboard: {
      name: "Dashboard",
      title: "Dashboard",
      description: "Overview of system data",
    },
  },
  maintenance: {
    storage: {
      title: "Storage Management",
    },
    buttons: {
      clear_unused: "Clear Unused Images",
      refresh: "Refresh",
      delete: "Delete",
    },
    filters: {
      show_unused: "Show Only Unused Images",
    },
    table: {
      preview: "Preview",
      name: "Name",
      size: "Size",
      type: "Type",
      last_modified: "Last Modified",
      status: "Status",
      actions: "Actions",
    },
    status: {
      in_use: "In Use",
      unused: "Unused",
    },
    messages: {
      no_files: "No files found",
    },
  },
  audit_logs: {
    details: {
      title: "Activity Log Details",
    },
    fields: {
      timestamp: "Timestamp",
      operation: "Operation",
      resource: "Resource",
      user: "User",
      details: "Details",
      status: "Status",
    },
    filters: {
      search: "Search",
    },
    operations: {
      create: "Create",
      edit: "Edit",
      delete: "Delete",
      bulk_delete: "Bulk Delete",
    },
    messages: {
      no_details: "No details available",
    },
    resources: {
      customers: "Customers",
      products: "Products",
      purchases: "Purchases",
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
    unknown: "Unknown",
    purchaseDistribution: "Purchase Distribution",
    productRevenue: "Product Revenue",
    recentPurchases: "Recent Purchases",
    table: {
      date: "Date",
      customer: "Customer",
      product: "Product",
      price: "Price",
      no_purchases: "No recent purchases found",
    },
    pdf: {
      title: "Dashboard Report",
      generatedOn: "Generated on",
      dateRange: "Date Range",
      start: "Start",
      end: "End",
      numberOfPurchases: "Number of Purchases",
      revenue: "Revenue",
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
      customer: {
        title: "Delete Customer",
        content:
          'Are you sure you want to delete the customer "%{name}"? This action will fail if the customer has any associated purchases.',
      },
      customers: {
        title: "Delete Customers",
        content:
          "Are you sure you want to delete these customers? This action will fail for any customer with associated purchases.",
      },
      product: {
        title: "Delete Product",
        content:
          'Are you sure you want to delete the product "%{name}"? This action will fail if the product has any associated purchases.',
      },
      products: {
        title: "Delete Products",
        content:
          "Are you sure you want to delete these products? This action will fail for any product with associated purchases.",
      },
      purchase: {
        title: "Delete Purchase",
        content: "Are you sure you want to delete this purchase?",
      },
      purchases: {
        title: "Delete Purchases",
        content: "Are you sure you want to delete these purchases?",
      },
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
