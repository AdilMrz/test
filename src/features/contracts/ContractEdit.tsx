import {
  Edit,
  SimpleForm,
  TextInput,
  useGetIdentity,
  useNotify,
  useRedirect,
  useGetOne,
} from "react-admin";
import { Card } from "@mui/material";
import { BackActions } from "./components";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { logAction } from "../../utils/logger";

interface ContractData {
  contract_details: string;
  id?: string;
}

export const ContractEdit = () => {
  const { identity } = useGetIdentity();
  const notify = useNotify();
  const redirect = useRedirect();
  const { id } = useParams();
  const { data: contract } = useGetOne("contracts", { id: id || "" });

  useEffect(() => {
    if (contract && identity?.id && contract.creator_id !== identity.id) {
      notify("Not authorized to edit this contract", { type: "error" });
      if (identity.email) {
        logAction(
          identity.email,
          "UNAUTHORIZED_EDIT_ATTEMPT",
          `Attempted to edit contract ${id}`,
        );
      }
      redirect("/contracts");
    }
  }, [contract, identity, notify, redirect, id]);

  const transform = async (data: ContractData) => {
    if (identity?.email) {
      await logAction(identity.email, "EDIT_CONTRACT", `Edited contract ${id}`);
    }
    return data;
  };

  if (!contract || !identity?.id || contract.creator_id !== identity.id) {
    return null;
  }

  return (
    <Card className="shadow-lg rounded-lg overflow-hidden">
      <Edit actions={<BackActions />} transform={transform}>
        <SimpleForm>
          <TextInput
            source="contract_details"
            multiline
            rows={3}
            className="w-full p-3 rounded-lg border focus:ring-2 focus:ring-green-700 focus:border-transparent"
          />
        </SimpleForm>
      </Edit>
    </Card>
  );
};
