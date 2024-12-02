import { Admin, Resource, CustomRoutes } from "react-admin";
import { BrowserRouter, Route } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  ForgotPasswordPage,
  LoginPage,
  SetPasswordPage,
  defaultI18nProvider,
  supabaseDataProvider,
  supabaseAuthProvider,
} from "ra-supabase";
import {
  People as PeopleIcon,
  ShoppingCart as ShoppingCartIcon,
  Inventory as InventoryIcon,
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
import { Dashboard } from "./Dashboard";
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

const queryClient = new QueryClient();

// App setup
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
        <Resource
          name="customers"
          list={CustomerList}
          edit={CustomerEdit}
          create={CustomerCreate}
          show={CustomerShow}
          icon={PeopleIcon}
        />
        <Resource
          name="products"
          list={ProductList}
          edit={ProductEdit}
          create={ProductCreate}
          show={ProductShow}
          icon={InventoryIcon}
        />
        <Resource
          name="purchases"
          list={PurchaseList}
          edit={PurchaseEdit}
          create={PurchaseCreate}
          show={PurchaseShow}
          icon={ShoppingCartIcon}
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
  </QueryClientProvider>
);

export default App;
