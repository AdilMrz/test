import {
  People as PeopleIcon,
  ShoppingCart as ShoppingCartIcon,
  Inventory as InventoryIcon,
  History as HistoryIcon,
  Build as BuildIcon,
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
import { Protected } from "./components/Protected";
import { useRBAC } from "./contexts/RBACContext";
import { useState, useEffect } from "react";
import { MaintenancePanel } from "./features/maintenance/MaintenancePanel";

const EmptyComponent = () => <></>;

const AuditLogList = () => (
  <Protected action="read" resource="audit_logs">
    <ActivityLogList />
  </Protected>
);

export const useResources = () => {
  const { checkPermission } = useRBAC();
  const [showAuditLogs, setShowAuditLogs] = useState(false);
  const [showMaintenance, setShowMaintenance] = useState(false);

  useEffect(() => {
    const checkPermissions = async () => {
      const hasAuditLogPermission = await checkPermission("read", "audit_logs");
      const hasMaintenancePermission = await checkPermission(
        "read",
        "maintenance",
      );
      setShowAuditLogs(hasAuditLogPermission);
      setShowMaintenance(hasMaintenancePermission);
    };
    checkPermissions();
  }, [checkPermission]);

  const baseResources = [
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
  ];

  if (showMaintenance) {
    baseResources.push({
      name: "maintenance",
      list: MaintenancePanel,
      create: EmptyComponent,
      edit: EmptyComponent,
      show: EmptyComponent,
      icon: BuildIcon,
    });
  }

  if (showAuditLogs) {
    baseResources.push({
      name: "audit_logs",
      list: AuditLogList,
      create: EmptyComponent,
      edit: EmptyComponent,
      show: EmptyComponent,
      icon: HistoryIcon,
    });
  }

  return baseResources;
};
