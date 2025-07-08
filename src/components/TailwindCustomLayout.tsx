import {
  Layout,
  AppBar,
  CheckForApplicationUpdate,
  TitlePortal,
} from "react-admin";
import type { LayoutProps } from "react-admin";
import { TailwindLanguageSwitcher } from "./TailwindLanguageSwitcher";

const TailwindCustomAppBar = () => (
  <AppBar color="primary">
    <TitlePortal />
    <div className="flex-1" />
    <TailwindLanguageSwitcher />
  </AppBar>
);

export const TailwindCustomLayout = (props: LayoutProps) => (
  <Layout {...props} appBar={TailwindCustomAppBar}>
    {props.children}
    <CheckForApplicationUpdate />
  </Layout>
);

export default TailwindCustomLayout;
