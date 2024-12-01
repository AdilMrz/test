import { Admin, Resource, CustomRoutes } from "react-admin";
import { BrowserRouter, Route } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";
import {
  CreateGuesser,
  EditGuesser,
  ForgotPasswordPage,
  LoginPage,
  SetPasswordPage,
  ShowGuesser,
  defaultI18nProvider,
  supabaseDataProvider,
  supabaseAuthProvider,
} from "ra-supabase";
import { CustomerList } from "./customers";
import { ProductList } from "./products";
import { PurchaseList } from "./purchases";
import { Dashboard } from "./Dashboard";
import { PurchaseShow } from "./purchaseShow";
import { queryClient } from "./queryClient";
import themes from "./themes";

// Supabase client setup
const instanceUrl = import.meta.env.VITE_SUPABASE_URL;
const apiKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabaseClient = createClient(instanceUrl, apiKey);
const dataProvider = supabaseDataProvider({
  instanceUrl,
  apiKey,
  supabaseClient,
});
const authProvider = supabaseAuthProvider(supabaseClient, {});
// App setup
export const App = () => (
  <BrowserRouter>
    <Admin
      dashboard={Dashboard}
      dataProvider={dataProvider}
      queryClient={queryClient}
      authProvider={authProvider}
      i18nProvider={defaultI18nProvider}
      loginPage={LoginPage}
      {...themes}
    >
      <Resource
        name="customers"
        list={CustomerList}
        edit={EditGuesser}
        create={CreateGuesser}
        show={ShowGuesser}
      />
      <Resource
        name="products"
        list={ProductList}
        edit={EditGuesser}
        create={CreateGuesser}
        show={ShowGuesser}
      />
      <Resource
        name="purchases"
        list={PurchaseList}
        edit={EditGuesser}
        create={CreateGuesser}
        show={PurchaseShow}
      />
      <CustomRoutes noLayout>
        <Route path={SetPasswordPage.path} element={<SetPasswordPage />} />
        <Route
          path={ForgotPasswordPage.path}
          element={<ForgotPasswordPage />}
        />
      </CustomRoutes>
    </Admin>
  </BrowserRouter>
);

export default App;
