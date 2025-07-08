import {
  Layout,
  AppBar,
  CheckForApplicationUpdate,
  TitlePortal,
} from "react-admin";
import type { LayoutProps } from "react-admin";
import { TailwindLanguageSwitcher } from "./TailwindLanguageSwitcher";
import { ReactAdminNotificationBridge } from "./ReactAdminNotificationBridge";
import { TailwindCustomMenu } from "./TailwindCustomMenu";

const TailwindCustomAppBar = () => (
  <AppBar color="primary">
    <TitlePortal />
    <div className="flex-1" />
    <TailwindLanguageSwitcher />
  </AppBar>
);

export const TailwindCustomLayout = (props: LayoutProps) => (
  <Layout {...props} appBar={TailwindCustomAppBar} menu={TailwindCustomMenu}>
    {props.children}
    <CheckForApplicationUpdate />
    <ReactAdminNotificationBridge />
  </Layout>
);

export default TailwindCustomLayout;
