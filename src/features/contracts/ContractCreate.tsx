import {
  Create,
  SimpleForm,
  TextInput,
  useGetIdentity,
  useNotify,
  useDataProvider,
} from "react-admin";
import { Card } from "@mui/material";
import { logAction } from "../../utils/logger";

interface ContractData {
  contract_details: string;
}

export const ContractCreate = () => {
  const { identity } = useGetIdentity();
  const notify = useNotify();
  const dataProvider = useDataProvider();

  const transform = async (data: ContractData) => {
    if (!identity?.id) {
      notify("Not authorized", { type: "error" });
      throw new Error("Not authorized");
    }

    try {
      await dataProvider.getOne("auth.users", { id: identity.id });

      // Log the action
      if (identity.email) {
        await logAction(
          identity.email,
          "CREATE_CONTRACT",
          `Created contract with details: ${data.contract_details.substring(0, 50)}...`,
        );
      }

      return {
        ...data,
        creator_id: identity.id,
      };
    } catch (error) {
      notify("Error creating contract", { type: "error" });
      throw new Error("Error creating contract");
    }
  };

  if (!identity?.id) {
    return null;
  }

  return (
    <Card className="shadow-lg rounded-lg overflow-hidden">
      <Create redirect="list" transform={transform}>
        <SimpleForm>
          <TextInput
            source="contract_details"
            multiline
            rows={3}
            className="w-full p-3 rounded-lg border focus:ring-2 focus:ring-green-700 focus:border-transparent"
          />
        </SimpleForm>
      </Create>
    </Card>
  );
};
