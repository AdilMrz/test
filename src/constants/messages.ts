export const WARNING_MESSAGES = {
  CUSTOMER_DELETE:
    "This action will fail if the customer has any associated purchases.",
  PRODUCT_DELETE:
    "This action will fail if the product has any associated purchases.",
} as const;

export const RESOURCE_NAMES = {
  CUSTOMER: "Customer",
  PRODUCT: "Product",
  PURCHASE: "Purchase",
} as const;
