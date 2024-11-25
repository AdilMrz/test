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

const instanceUrl = process.env.SUPABASE_INSTANCE_URL ?? "";
const apiKey = process.env.SUPABASE_API_KEY ?? "";
const supabaseClient = createClient(instanceUrl, apiKey);
const dataProvider = supabaseDataProvider({
  instanceUrl,
  apiKey,
  supabaseClient,
});
const authProvider = supabaseAuthProvider(supabaseClient, {});

export const App = () => (
  <BrowserRouter>
    <Admin
      dashboard={Dashboard}
      dataProvider={dataProvider}
      authProvider={authProvider}
      i18nProvider={defaultI18nProvider}
      loginPage={LoginPage}
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
