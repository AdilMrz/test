import { BulkDeleteButton } from "react-admin";

interface BulkDeleteWithConfirmButtonProps {
  resourceName: string;
  warningMessage?: string;
}

export const BulkDeleteWithConfirmButton = ({
  resourceName,
  warningMessage = "",
}: BulkDeleteWithConfirmButtonProps) => {
  const baseMessage = `Are you sure you want to delete these ${resourceName.toLowerCase()}s?`;
  const confirmContent = warningMessage
    ? `${baseMessage} ${warningMessage}`
    : baseMessage;

  return (
    <BulkDeleteButton
      confirmTitle={`Delete ${resourceName}s`}
      confirmContent={confirmContent}
      mutationMode="pessimistic"
    />
  );
};
