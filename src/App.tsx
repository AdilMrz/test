import { useState, useEffect, useMemo } from "react";
import { Admin, Resource, CustomRoutes } from "react-admin";
import { BrowserRouter, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  ForgotPasswordPage,
  LoginPage,
  SetPasswordPage,
  defaultI18nProvider,
} from "ra-supabase";
import { Dashboard } from "./Dashboard";
import themes from "./themes";
import { resources } from "./AppResources";
import { queryClientConfig } from "./auth";
import { authProvider as baseAuthProvider, supabaseClient } from "./supabase";
import { createTrackingSupabaseProvider } from "./providers/trackingSupabaseProvider";
import CustomLayout from "./CustomLayout";
import { RBACProvider } from "./contexts/RBACContext";
import type { Role } from "./types/rbac";
import { useRBAC } from "./contexts/RBACContext";

const queryClient = new QueryClient(queryClientConfig);
const authProvider = baseAuthProvider;

const AdminApp = () => {
  const { checkPermission } = useRBAC();
  const trackingDataProvider = useMemo(
    () => createTrackingSupabaseProvider(supabaseClient, checkPermission),
    [checkPermission],
  );

  return (
    <Admin
      dashboard={Dashboard}
      dataProvider={trackingDataProvider}
      authProvider={authProvider}
      i18nProvider={defaultI18nProvider}
      loginPage={LoginPage}
      defaultTheme="light"
      layout={CustomLayout}
      {...themes}
    >
      {resources.map((resource) => (
        <Resource key={resource.name} {...resource} />
      ))}
      <CustomRoutes noLayout>
        <Route path={SetPasswordPage.path} element={<SetPasswordPage />} />
        <Route
          path={ForgotPasswordPage.path}
          element={<ForgotPasswordPage />}
        />
      </CustomRoutes>
    </Admin>
  );
};

export const App = () => {
  const [userRole, setUserRole] = useState<Role | null>(null);

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        if (authProvider?.getIdentity) {
          const identity = await authProvider.getIdentity();
          setUserRole(identity.role);
        }
      } catch (error) {
        setUserRole(null);
      }
    };
    fetchUserRole();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <RBACProvider role={userRole}>
          <AdminApp />
        </RBACProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
