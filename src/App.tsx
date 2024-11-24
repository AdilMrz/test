import { Admin, Resource, CustomRoutes } from "react-admin";
import { BrowserRouter, Route } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";
import {
  CreateGuesser,
  EditGuesser,
  ForgotPasswordPage,
  ListGuesser,
  LoginPage,
  SetPasswordPage,
  ShowGuesser,
  defaultI18nProvider,
  supabaseDataProvider,
  supabaseAuthProvider,
} from "ra-supabase";

const instanceUrl = "https://huipyswcdlflijelqekd.supabase.co";
const apiKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh1aXB5c3djZGxmbGlqZWxxZWtkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE4Njc4NjYsImV4cCI6MjA0NzQ0Mzg2Nn0.KiMLeTf_zeG4-FaUliHhfw8FotuG0KolZXvI93g-t8s";
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
      dataProvider={dataProvider}
      authProvider={authProvider}
      i18nProvider={defaultI18nProvider}
      loginPage={LoginPage}
    >
      <Resource
        name="customers"
        list={ListGuesser}
        edit={EditGuesser}
        create={CreateGuesser}
        show={ShowGuesser}
      />
      <Resource
        name="products"
        list={ListGuesser}
        edit={EditGuesser}
        create={CreateGuesser}
        show={ShowGuesser}
      />
      <Resource
        name="subscription"
        list={ListGuesser}
        edit={EditGuesser}
        create={CreateGuesser}
        show={ShowGuesser}
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
