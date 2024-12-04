import {
  People as PeopleIcon,
  ShoppingCart as ShoppingCartIcon,
  Inventory as InventoryIcon,
  Description as DescriptionIcon,
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
import {
  ContractList,
  ContractCreate,
  ContractEdit,
  ContractShow,
} from "./features/contracts";
import { LogList } from "./features/logs/LogList";

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
    name: "contracts",
    list: ContractList,
    create: ContractCreate,
    edit: ContractEdit,
    show: ContractShow,
    icon: DescriptionIcon,
  },
  {
    name: "logs",
    list: LogList,
    icon: HistoryIcon,
    options: { label: "Activity Logs" },
  },
];
