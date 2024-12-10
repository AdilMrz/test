import {
  Layout,
  AppBar,
  CheckForApplicationUpdate,
  TitlePortal,
} from "react-admin";
import type { LayoutProps } from "react-admin";
import { Box } from "@mui/material";
import { LanguageSwitcher } from "./components/LanguageSwitcher";

const CustomAppBar = () => (
  <AppBar color="primary">
    <TitlePortal />
    <Box flex={1} />
    <LanguageSwitcher />
  </AppBar>
);

export const CustomLayout = (props: LayoutProps) => (
  <Layout {...props} appBar={CustomAppBar}>
    {props.children}
    <CheckForApplicationUpdate />
  </Layout>
);

export default CustomLayout;
