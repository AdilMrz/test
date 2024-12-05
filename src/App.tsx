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
import { authProvider, supabaseClient } from "./supabase";
import { createTrackingSupabaseProvider } from "./providers/trackingSupabaseProvider";
import CustomLayout from "./CustomLayout";

const queryClient = new QueryClient(queryClientConfig);
const trackingDataProvider = createTrackingSupabaseProvider(supabaseClient);

export const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
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
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
