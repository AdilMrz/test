import {
  People as PeopleIcon,
  ShoppingCart as ShoppingCartIcon,
  Inventory as InventoryIcon,
  History as HistoryIcon,
} from "@mui/icons-material";
import {
  CustomerList,
  CustomerCreate,
  CustomerShow,
  CustomerEdit,
} from "./customers";
import {
  ProductList,
  ProductCreate,
  ProductShow,
  ProductEdit,
} from "./products";
import {
  PurchaseList,
  PurchaseCreate,
  PurchaseShow,
  PurchaseEdit,
} from "./purchases";
import { ActivityLogList } from "./features/audit-logs";

export const resources = [
  {
    name: "customers",
    list: CustomerList,
    create: CustomerCreate,
    edit: CustomerEdit,
    show: CustomerShow,
    icon: PeopleIcon,
  },
  {
    name: "products",
    list: ProductList,
    create: ProductCreate,
    edit: ProductEdit,
    show: ProductShow,
    icon: InventoryIcon,
  },
  {
    name: "purchases",
    list: PurchaseList,
    create: PurchaseCreate,
    edit: PurchaseEdit,
    show: PurchaseShow,
    icon: ShoppingCartIcon,
  },
  {
    name: "audit_logs",
    list: ActivityLogList,
    icon: HistoryIcon,
    options: { label: "Activity Logs" },
  },
];
