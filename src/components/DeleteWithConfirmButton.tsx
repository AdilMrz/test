import { DeleteButton, useRecordContext } from "react-admin";
import type { RaRecord } from "react-admin";

interface DeleteWithConfirmButtonProps<RecordType extends RaRecord = RaRecord> {
  resourceName: string;
  warningMessage?: string;
  getRecordLabel?: (record: RecordType) => string;
}

export const DeleteWithConfirmButton = <
  RecordType extends RaRecord = RaRecord,
>({
  resourceName,
  warningMessage = "",
  getRecordLabel = (record: RecordType) =>
    record.name || record.fullname || String(record.id),
}: DeleteWithConfirmButtonProps<RecordType>) => {
  const record = useRecordContext<RecordType>();
  if (!record) return null;

  const label = getRecordLabel(record);
  const baseMessage = `Are you sure you want to delete the ${resourceName} "${label}"?`;
  const confirmContent = warningMessage
    ? `${baseMessage} ${warningMessage}`
    : baseMessage;

  return (
    <DeleteButton
      resource={resourceName}
      record={record}
      confirmTitle={`Delete ${resourceName}`}
      confirmContent={confirmContent}
      mutationMode="pessimistic"
    />
  );
};
