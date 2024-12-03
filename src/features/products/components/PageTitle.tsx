import { useRecordContext } from "react-admin";
import type { Product } from "../types";

export const PageTitle = () => {
  const record = useRecordContext<Product>();
  return <span>{record?.name}</span>;
};
