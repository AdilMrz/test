import { useState, useEffect, useMemo } from "react";
import { Admin, Resource, CustomRoutes } from "react-admin";
import type { ResourceProps } from "react-admin";
import { BrowserRouter, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ForgotPasswordPage, LoginPage, SetPasswordPage } from "ra-supabase";
import polyglotI18nProvider from "ra-i18n-polyglot";
import englishMessages from "./i18n/en";
import frenchMessages from "./i18n/fr";
import { Dashboard } from "./features/dashboard/Dashboard";
import themes from "./themes";
import { useResources } from "./AppResources";
import { queryClientConfig } from "./auth";
import { authProvider as baseAuthProvider, supabaseClient } from "./supabase";
import { createTrackingSupabaseProvider } from "./providers/trackingSupabaseProvider";
import CustomLayout from "./CustomLayout";
import { RBACProvider } from "./contexts/RBACContext";
import type { Role } from "./types/rbac";
import { useRBAC } from "./contexts/RBACContext";

const queryClient = new QueryClient(queryClientConfig);
const authProvider = baseAuthProvider;
const i18nProvider = polyglotI18nProvider(
  (locale) => {
    if (locale === "fr") {
      return frenchMessages;
    }
    return englishMessages;
  },
  "en", // Default locale
);

const CustomLoginPage = (props = {}) => <LoginPage {...props} />;

const AdminApp = ({ role = null }: { role?: Role | null }) => {
  const { checkPermission } = useRBAC();
  const resources = useResources();
  const [showDashboard, setShowDashboard] = useState(false);

  useEffect(() => {
    const checkDashboardPermission = async () => {
      const hasPermission = await checkPermission("read", "dashboard");
      setShowDashboard(hasPermission);
    };
    checkDashboardPermission();
  }, [checkPermission]);

  const trackingDataProvider = useMemo(
    () => createTrackingSupabaseProvider(supabaseClient, checkPermission),
    [checkPermission],
  );

  return (
    <Admin
      key={role || "no-role"}
      dashboard={showDashboard ? Dashboard : undefined}
      dataProvider={trackingDataProvider}
      authProvider={authProvider}
      i18nProvider={i18nProvider}
      loginPage={CustomLoginPage}
      defaultTheme="light"
      layout={CustomLayout}
      {...themes}
    >
      {resources.map((resource: ResourceProps) => (
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

    // Subscribe to auth state changes
    const {
      data: { subscription },
    } = supabaseClient.auth.onAuthStateChange(async () => {
      fetchUserRole();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <RBACProvider role={userRole}>
          <AdminApp role={userRole} />
        </RBACProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
