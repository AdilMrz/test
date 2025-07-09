import {
  List,
  Datagrid,
  TextField,
  DateField,
  ChipField,
  SearchInput,
  SelectInput,
  useRecordContext,
  useTranslate,
  type RaRecord,
} from "react-admin";
import {
  Card,
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  IconButton,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { useState } from "react";
import { DateRangeFilter } from "./components/DateRangeFilter";

interface ActivityRecord extends RaRecord {
  status: "success" | "error";
  timestamp: string;
  operation: string;
  resource: string;
  user_fullname: string;
  details?: string;
}

interface StatusChipProps {
  source: string;
}

const StatusChip = ({ source }: StatusChipProps) => {
  const record = useRecordContext<ActivityRecord>();
  return (
    <ChipField
      source={source}
      sx={{
        "&.RaChipField-chip": {
          backgroundColor: record?.status === "success" ? "#4caf50" : "#f44336",
          color: "#fff",
        },
      }}
    />
  );
};

const DetailsDialog = ({
  open,
  onClose,
  record,
}: {
  open: boolean;
  onClose: () => void;
  record: ActivityRecord | null;
}) => {
  const translate = useTranslate();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "8px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        },
      }}
    >
      <DialogTitle
        sx={{
          borderBottom: "1px solid #e0e0e0",
          backgroundColor: "#14532d",
          color: "#ffffff",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>{translate("audit_logs.details.title")}</div>
        <IconButton onClick={onClose} sx={{ color: "#ffffff" }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ mt: 2 }}>
        {record && (
          <>
            <Typography
              variant="subtitle2"
              color="textSecondary"
              fontWeight="bold"
            >
              {translate("audit_logs.fields.timestamp")}
            </Typography>
            <Typography paragraph>
              {new Date(record.timestamp).toLocaleString()}
            </Typography>

            <Typography
              variant="subtitle2"
              color="textSecondary"
              fontWeight="bold"
            >
              {translate("audit_logs.fields.operation")}
            </Typography>
            <Typography paragraph>{record.operation}</Typography>

            <Typography
              variant="subtitle2"
              color="textSecondary"
              fontWeight="bold"
            >
              {translate("audit_logs.fields.resource")}
            </Typography>
            <Typography paragraph>{record.resource}</Typography>

            <Typography
              variant="subtitle2"
              color="textSecondary"
              fontWeight="bold"
            >
              {translate("audit_logs.fields.user")}
            </Typography>
            <Typography paragraph>{record.user_fullname}</Typography>

            <Typography
              variant="subtitle2"
              color="textSecondary"
              fontWeight="bold"
            >
              {translate("audit_logs.fields.details")}
            </Typography>
            <Typography paragraph>
              {record.details || translate("audit_logs.messages.no_details")}
            </Typography>

            <Typography
              variant="subtitle2"
              color="textSecondary"
              fontWeight="bold"
            >
              {translate("audit_logs.fields.status")}
            </Typography>
            <Typography
              paragraph
              sx={{
                color: record.status === "success" ? "#4caf50" : "#f44336",
                fontWeight: "bold",
              }}
            >
              {record.status.toUpperCase()}
            </Typography>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export const ActivityLogList = () => {
  const translate = useTranslate();
  const [selectedRecord, setSelectedRecord] = useState<ActivityRecord | null>(
    null,
  );
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const filters = [
    <SearchInput
      key="search"
      source="details"
      placeholder={translate("audit_logs.filters.search")}
      resettable
      alwaysOn
      sx={{ m: 1 }}
    />,
    <SelectInput
      key="operation"
      source="operation"
      choices={[
        { id: "CREATE", name: translate("audit_logs.operations.create") },
        { id: "EDIT", name: translate("audit_logs.operations.edit") },
        { id: "DELETE", name: translate("audit_logs.operations.delete") },
        {
          id: "BULK_DELETE",
          name: translate("audit_logs.operations.bulk_delete"),
        },
      ]}
      alwaysOn
      sx={{ m: 1 }}
    />,
    <SelectInput
      key="resource"
      source="resource"
      choices={[
        { id: "customers", name: translate("audit_logs.resources.customers") },
        { id: "products", name: translate("audit_logs.resources.products") },
        { id: "purchases", name: translate("audit_logs.resources.purchases") },
      ]}
      alwaysOn
      sx={{ m: 1 }}
    />,
  ];

  const filterList = {
    ...(startDate && { "timestamp@gte": startDate.toISOString() }),
    ...(endDate && { "timestamp@lte": endDate.toISOString() }),
  };

  return (
    <div className="flex flex-col gap-4">
      <DateRangeFilter
        startDate={startDate}
        endDate={endDate}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
        cardStyle={{
          backgroundColor: "#eef2ea",
          boxShadow:
            "rgba(20, 83, 45, 0.2) -2px 2px, rgba(20, 83, 45, 0.1) -4px 4px, rgba(20, 83, 45, 0.05) -6px 6px",
        }}
      />
      <Card>
        <List
          filters={filters}
          filter={filterList}
          sort={{ field: "timestamp", order: "DESC" }}
          className="p-0"
          sx={{ "& .RaList-main": { padding: 0 } }}
          actions={false}
        >
          <Datagrid
            bulkActionButtons={false}
            rowClick={(_, __, record) => {
              setSelectedRecord(record as unknown as ActivityRecord);
              return false;
            }}
          >
            <DateField source="timestamp" showTime />
            <TextField source="operation" />
            <TextField source="resource" />
            <TextField source="user_fullname" />
            <StatusChip source="status" />
            <TextField source="details" />
          </Datagrid>
        </List>
        <DetailsDialog
          open={!!selectedRecord}
          onClose={() => setSelectedRecord(null)}
          record={selectedRecord}
        />
      </Card>
    </div>
  );
};
