import { useState, useEffect, useMemo } from "react";
import { Admin, Resource, CustomRoutes } from "react-admin";
import type { ResourceProps } from "react-admin";
import { BrowserRouter, Route } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { ForgotPasswordPage, SetPasswordPage } from "ra-supabase";
import { TailwindLoginPage } from "./components/TailwindLoginPage";
import { TailwindShowcase } from "./components/TailwindShowcase";
import { TailwindDashboard } from "./components/dashboard/TailwindDashboard";
import { TailwindForm } from "./components/forms/TailwindForm";
import { TailwindMaintenancePanel } from "./components/TailwindMaintenancePanel";
import { TailwindNotificationDemo } from "./components/TailwindNotificationDemo";
import polyglotI18nProvider from "ra-i18n-polyglot";
import englishMessages from "./i18n/en";
import frenchMessages from "./i18n/fr";
import themes from "./themes";
import { useResources } from "./AppResources";
import { queryClient } from "./auth";
import { authProvider as baseAuthProvider, supabaseClient } from "./supabase";
import { createTrackingSupabaseProvider } from "./providers/trackingSupabaseProvider";
import { TailwindCustomLayout } from "./components/TailwindCustomLayout";
import { RBACProvider } from "./contexts/RBACContext";
import type { Role } from "./types/rbac";
import { useRBAC } from "./contexts/RBACContext";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { useErrorHandler } from "./hooks/useErrorHandler";
import { initSentry } from "./utils/sentry";

// queryClient is now imported from auth.ts
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

const AdminApp = ({ role = null }: { role?: Role | null }) => {
  const { checkPermission } = useRBAC();
  const resources = useResources();

  const trackingDataProvider = useMemo(
    () => createTrackingSupabaseProvider(supabaseClient, checkPermission),
    [checkPermission],
  );

  return (
    <Admin
      key={role || "no-role"}
      dataProvider={trackingDataProvider}
      authProvider={authProvider}
      i18nProvider={i18nProvider}
      loginPage={TailwindLoginPage}
      defaultTheme="light"
      layout={TailwindCustomLayout}
      {...themes}
    >
      {resources.resources.map((resource: ResourceProps) => (
        <Resource key={resource.name} {...resource} />
      ))}
      <CustomRoutes noLayout>
        <Route path={SetPasswordPage.path} element={<SetPasswordPage />} />
        <Route
          path={ForgotPasswordPage.path}
          element={<ForgotPasswordPage />}
        />
      </CustomRoutes>
      <CustomRoutes>
        <Route path="/tailwind-showcase" element={<TailwindShowcase />} />
        <Route path="/tailwind-dashboard" element={<TailwindDashboard />} />
        <Route path="/tailwind-form" element={<TailwindForm />} />
        <Route
          path="/tailwind-maintenance"
          element={
            <TailwindMaintenancePanel
              isMaintenanceMode={true}
              tasks={[
                {
                  id: "1",
                  title: "Database Migration",
                  description:
                    "Upgrading database schema to improve performance",
                  status: "completed",
                  estimatedTime: "30 minutes",
                  startTime: "2:00 PM",
                  endTime: "2:25 PM",
                },
                {
                  id: "2",
                  title: "Server Updates",
                  description: "Installing security patches and system updates",
                  status: "in-progress",
                  progress: 75,
                  estimatedTime: "45 minutes",
                  startTime: "2:30 PM",
                },
                {
                  id: "3",
                  title: "Cache Optimization",
                  description:
                    "Optimizing cache configuration for better response times",
                  status: "pending",
                  estimatedTime: "20 minutes",
                },
              ]}
              estimatedCompletion="3:30 PM EST"
              contactInfo={{
                email: "support@example.com",
                phone: "+1 (555) 123-4567",
                website: "https://status.example.com",
              }}
              onRefresh={() => window.location.reload()}
              onRetry={() => console.log("Retry clicked")}
            />
          }
        />
        <Route
          path="/tailwind-notifications"
          element={<TailwindNotificationDemo />}
        />
      </CustomRoutes>
    </Admin>
  );
};

// Initialize Sentry
initSentry();

export const App = () => {
  const [userRole, setUserRole] = useState<Role | null>(null);
  const { handleError } = useErrorHandler();

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        if (authProvider?.getIdentity) {
          const identity = await authProvider.getIdentity();
          setUserRole(identity.role);
        }
      } catch (error) {
        await handleError(error, {
          action: "fetch_user_role",
          metadata: { component: "App" },
        });
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
  }, [handleError]);

  return (
    <ErrorBoundary
      onError={(error, errorId) => {
        console.error("App Error Boundary caught error:", { error, errorId });
        handleError(error, {
          action: "error_boundary",
          metadata: { component: "App", errorId },
        });
      }}
      enableRetry={true}
      showDetails={true}
    >
      <QueryClientProvider client={queryClient}>
        <BrowserRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <RBACProvider role={userRole}>
            <AdminApp role={userRole} />
          </RBACProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
