import { lazy } from "react";

// Lazy load heavy components to improve initial bundle size and LCP
export const LazyDashboard = lazy(() => import("../features/dashboard/Dashboard"));

export const LazyCustomerList = lazy(() => 
  import("../features/customers/CustomerList").then(module => ({ 
    default: module.CustomerList 
  }))
);

export const LazyCustomerCreate = lazy(() => 
  import("../features/customers/CustomerCreate").then(module => ({ 
    default: module.CustomerCreate 
  }))
);

export const LazyCustomerEdit = lazy(() => 
  import("../features/customers/CustomerEdit").then(module => ({ 
    default: module.CustomerEdit 
  }))
);

export const LazyCustomerShow = lazy(() => 
  import("../features/customers/CustomerShow").then(module => ({ 
    default: module.CustomerShow 
  }))
);

export const LazyProductList = lazy(() => 
  import("../features/products/ProductList").then(module => ({ 
    default: module.ProductList 
  }))
);

export const LazyProductCreate = lazy(() => 
  import("../features/products/ProductCreate").then(module => ({ 
    default: module.ProductCreate 
  }))
);

export const LazyProductEdit = lazy(() => 
  import("../features/products/ProductEdit").then(module => ({ 
    default: module.ProductEdit 
  }))
);

export const LazyProductShow = lazy(() => 
  import("../features/products/ProductShow").then(module => ({ 
    default: module.ProductShow 
  }))
);

export const LazyPurchaseList = lazy(() => 
  import("../features/purchases/PurchaseList").then(module => ({ 
    default: module.PurchaseList 
  }))
);

export const LazyPurchaseCreate = lazy(() => 
  import("../features/purchases/PurchaseCreate").then(module => ({ 
    default: module.PurchaseCreate 
  }))
);

export const LazyPurchaseEdit = lazy(() => 
  import("../features/purchases/PurchaseEdit").then(module => ({ 
    default: module.PurchaseEdit 
  }))
);

export const LazyPurchaseShow = lazy(() => 
  import("../features/purchases/PurchaseShow").then(module => ({ 
    default: module.PurchaseShow 
  }))
);

export const LazyActivityLogList = lazy(() => 
  import("../features/audit-logs/ActivityLogList").then(module => ({ 
    default: module.ActivityLogList 
  }))
);

export const LazyMaintenancePanel = lazy(() => 
  import("../features/maintenance/MaintenancePanel").then(module => ({ 
    default: module.MaintenancePanel 
  }))
);

// Loading fallback component
export const ComponentLoader = () => (
  <div className="flex items-center justify-center min-h-[200px]">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    <span className="ml-2 text-gray-600">Loading...</span>
  </div>
);
