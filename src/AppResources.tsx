import { Suspense } from "react";
import {
  People as PeopleIcon,
  ShoppingCart as ShoppingCartIcon,
  Inventory as InventoryIcon,
  History as HistoryIcon,
  Build as BuildIcon,
  Dashboard as DashboardIcon,
} from "@mui/icons-material";
import {
  LazyDashboard,
  LazyCustomerList,
  LazyCustomerCreate,
  LazyCustomerShow,
  LazyCustomerEdit,
  LazyProductList,
  LazyProductCreate,
  LazyProductShow,
  LazyProductEdit,
  LazyPurchaseList,
  LazyPurchaseCreate,
  LazyPurchaseShow,
  LazyPurchaseEdit,
  LazyActivityLogList,
  LazyMaintenancePanel,
  ComponentLoader,
} from "./components/LazyComponents";
import { Protected } from "./components/Protected";
import { useRBAC } from "./contexts/RBACContext";
import { useState, useEffect } from "react";

const EmptyComponent = () => <></>;

const AuditLogList = () => (
  <Protected action="read" resource="audit_logs">
    <SuspenseWrapper>
      <LazyActivityLogList />
    </SuspenseWrapper>
  </Protected>
);

// Wrapper components with Suspense for lazy loading
const SuspenseWrapper = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<ComponentLoader />}>{children}</Suspense>
);

const DashboardWrapper = () => (
  <SuspenseWrapper>
    <LazyDashboard />
  </SuspenseWrapper>
);

export const useResources = () => {
  const { checkPermission } = useRBAC();
  const [showAuditLogs, setShowAuditLogs] = useState(false);
  const [showMaintenance, setShowMaintenance] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);

  useEffect(() => {
    const checkPermissions = async () => {
      const [
        hasAuditLogPermission,
        hasMaintenancePermission,
        hasDashboardPermission,
      ] = await Promise.all([
        checkPermission("read", "audit_logs"),
        checkPermission("read", "maintenance"),
        checkPermission("read", "dashboard"),
      ]);

      setShowAuditLogs(hasAuditLogPermission);
      setShowMaintenance(hasMaintenancePermission);
      setShowDashboard(hasDashboardPermission);
    };
    checkPermissions();
  }, [checkPermission]);

  const baseResources = [
    {
      name: "customers",
      list: () => (
        <SuspenseWrapper>
          <LazyCustomerList />
        </SuspenseWrapper>
      ),
      create: () => (
        <SuspenseWrapper>
          <LazyCustomerCreate />
        </SuspenseWrapper>
      ),
      edit: () => (
        <SuspenseWrapper>
          <LazyCustomerEdit />
        </SuspenseWrapper>
      ),
      show: () => (
        <SuspenseWrapper>
          <LazyCustomerShow />
        </SuspenseWrapper>
      ),
      icon: PeopleIcon,
    },
    {
      name: "products",
      list: () => (
        <SuspenseWrapper>
          <LazyProductList />
        </SuspenseWrapper>
      ),
      create: () => (
        <SuspenseWrapper>
          <LazyProductCreate />
        </SuspenseWrapper>
      ),
      edit: () => (
        <SuspenseWrapper>
          <LazyProductEdit />
        </SuspenseWrapper>
      ),
      show: () => (
        <SuspenseWrapper>
          <LazyProductShow />
        </SuspenseWrapper>
      ),
      icon: InventoryIcon,
    },
    {
      name: "purchases",
      list: () => (
        <SuspenseWrapper>
          <LazyPurchaseList />
        </SuspenseWrapper>
      ),
      create: () => (
        <SuspenseWrapper>
          <LazyPurchaseCreate />
        </SuspenseWrapper>
      ),
      edit: () => (
        <SuspenseWrapper>
          <LazyPurchaseEdit />
        </SuspenseWrapper>
      ),
      show: () => (
        <SuspenseWrapper>
          <LazyPurchaseShow />
        </SuspenseWrapper>
      ),
      icon: ShoppingCartIcon,
    },
  ];

  if (showMaintenance) {
    baseResources.push({
      name: "maintenance",
      list: () => (
        <SuspenseWrapper>
          <LazyMaintenancePanel />
        </SuspenseWrapper>
      ),
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

  if (showDashboard) {
    baseResources.push({
      name: "dashboard",
      list: DashboardWrapper,
      create: EmptyComponent,
      edit: EmptyComponent,
      show: EmptyComponent,
      icon: DashboardIcon,
    });
  }

  return {
    resources: baseResources,
    showDashboard,
  };
};
