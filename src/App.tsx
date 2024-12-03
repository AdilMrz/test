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
import { dataProvider, authProvider } from "./supabase";

const queryClient = new QueryClient(queryClientConfig);

export const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <Admin
        dashboard={Dashboard}
        dataProvider={dataProvider}
        authProvider={authProvider}
        i18nProvider={defaultI18nProvider}
        loginPage={LoginPage}
        defaultTheme="light"
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
