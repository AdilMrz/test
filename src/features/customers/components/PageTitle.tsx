import { useRecordContext } from "react-admin";
import type { Customer } from "../types";

export const PageTitle = () => {
  const record = useRecordContext<Customer>();
  return <span>{record?.fullname}</span>;
};
