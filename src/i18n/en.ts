import englishMessages from "ra-language-english";

const customEnglishMessages = {
  ...englishMessages,
  resources: {
    customers: {
      name: "Customer |||| Customers",
    },
    products: {
      name: "Product |||| Products",
    },
    purchases: {
      name: "Purchase |||| Purchases",
    },
    audit_logs: {
      name: "Activity Log |||| Activity Logs",
    },
  },
  ra: {
    ...englishMessages.ra,
    message: {
      ...englishMessages.ra.message,
      created: "Element created",
      updated: "Element updated",
      deleted: "Element deleted",
    },
    notification: {
      ...englishMessages.ra.notification,
      item_created: "%{item} created",
      item_updated: "%{item} updated",
      item_deleted: "%{item} deleted",
    },
  },
};

export default customEnglishMessages;
