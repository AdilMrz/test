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

const AUTHORIZED_EMAILS = [
  "marzouki.adil1987@gmail.com",
  "jules.dupk@gmail.com",
  "johndoe@example.com",
];

const dataProvider = supabaseDataProvider({
  instanceUrl,
  apiKey,
  supabaseClient,
});

const authProvider = supabaseAuthProvider(supabaseClient, {
  getPermissions: async () => {
    const {
      data: { user },
    } = await supabaseClient.auth.getUser();
    return AUTHORIZED_EMAILS.includes(user?.email || "") ? "admin" : null;
  },
});

// Add authorization check to the authProvider
const authProviderWithCheck = {
  ...authProvider,
  login: async (params: { email: string; password: string }) => {
    if (!AUTHORIZED_EMAILS.includes(params.email)) {
      return Promise.reject("Email non autorisé");
    }
    return authProvider.login(params);
  },
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 30000,
    },
    mutations: {
      retry: 1,
    },
  },
});

// App setup
export const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <Admin
        dashboard={Dashboard}
        dataProvider={dataProvider}
        authProvider={authProviderWithCheck}
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
