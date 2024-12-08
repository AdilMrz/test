import {
  List,
  Datagrid,
  TextField,
  DateField,
  ChipField,
  SearchInput,
  useRecordContext,
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
}) => (
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
      <div>Activity Log Details</div>
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
            Timestamp
          </Typography>
          <Typography paragraph>
            {new Date(record.timestamp).toLocaleString()}
          </Typography>

          <Typography
            variant="subtitle2"
            color="textSecondary"
            fontWeight="bold"
          >
            Operation
          </Typography>
          <Typography paragraph>{record.operation}</Typography>

          <Typography
            variant="subtitle2"
            color="textSecondary"
            fontWeight="bold"
          >
            Resource
          </Typography>
          <Typography paragraph>{record.resource}</Typography>

          <Typography
            variant="subtitle2"
            color="textSecondary"
            fontWeight="bold"
          >
            User
          </Typography>
          <Typography paragraph>{record.user_fullname}</Typography>

          <Typography
            variant="subtitle2"
            color="textSecondary"
            fontWeight="bold"
          >
            Details
          </Typography>
          <Typography paragraph>
            {record.details || "No details available"}
          </Typography>

          <Typography
            variant="subtitle2"
            color="textSecondary"
            fontWeight="bold"
          >
            Status
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

const filters = [
  <SearchInput
    key="search"
    source="details"
    placeholder="Search"
    resettable
    alwaysOn
    sx={{ m: 1 }}
  />,
];

export const ActivityLogList = () => {
  const [selectedRecord, setSelectedRecord] = useState<ActivityRecord | null>(
    null,
  );
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

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
            <TextField source="user_fullname" label="User" />
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
