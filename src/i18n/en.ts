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
      },
      create: "Create Customer",
      edit: "Edit Customer",
      delete: "Delete Customer",
    },
    products: {
      name: "Product |||| Products",
      fields: {
        name: "Name",
        description: "Description",
        photo_url: "Photo",
      },
      create: "Create Product",
      edit: "Edit Product",
      delete: "Delete Product",
    },
    purchases: {
      name: "Purchase |||| Purchases",
      fields: {
        customer_id: "Customer",
        product_id: "Product",
        price: "Price",
        purchase_date: "Purchase Date",
        customer_fullname: "Customer Name",
      },
      create: "Create Purchase",
      edit: "Edit Purchase",
      delete: "Delete Purchase",
    },
    audit_logs: {
      name: "Activity Log |||| Activity Logs",
      fields: {
        action: "Action",
        resource: "Resource",
        date: "Date",
        user: "User",
      },
    },
  },
  ra: {
    ...englishMessages.ra,
    message: {
      ...englishMessages.ra.message,
      created: "Element created",
      updated: "Element updated",
      deleted: "Element deleted",
      not_found: "Not Found",
      loading: "Loading...",
      invalid_form: "The form is not valid",
      error: "An error occurred",
    },
    notification: {
      ...englishMessages.ra.notification,
      item_created: "%{item} created",
      item_updated: "%{item} updated",
      item_deleted: "%{item} deleted",
    },
    action: {
      ...englishMessages.ra.action,
      create: "Create",
      edit: "Edit",
      delete: "Delete",
      save: "Save",
      cancel: "Cancel",
      back: "Back",
    },
    page: {
      ...englishMessages.ra.page,
      create: "Create %{name}",
      edit: "Edit %{name}",
      show: "%{name} Details",
      list: "%{name} List",
      dashboard: "Dashboard",
    },
  },
  buttons: {
    create_customer: "New Customer",
    create_product: "New Product",
    create_purchase: "New Purchase",
    upload_photo: "Upload Photo",
    change_photo: "Change Photo",
  },
  dialogs: {
    delete: {
      title: "Delete Confirmation",
      content: "Are you sure you want to delete this item?",
    },
    create: {
      customer: "Create New Customer",
      product: "Create New Product",
    },
  },
  validation: {
    required: "Required",
    email: "Invalid email address",
    price: {
      positive: "Price must be positive",
      required: "Price is required",
    },
  },
  dashboard: {
    startDate: "Start Date",
    endDate: "End Date",
    apply: "Apply",
    clear: "Clear",
  },
};

export default customEnglishMessages;
