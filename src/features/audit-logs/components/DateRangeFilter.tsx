import { DatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { Card, Button } from "@mui/material";
import type { SxProps, Theme } from "@mui/material";

interface DateRangeFilterProps {
  startDate: Date | null;
  endDate: Date | null;
  onStartDateChange: (date: Date | null) => void;
  onEndDateChange: (date: Date | null) => void;
  cardStyle: SxProps<Theme>;
}

export const DateRangeFilter = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  cardStyle,
}: DateRangeFilterProps) => {
  const handleClear = () => {
    onStartDateChange(null);
    onEndDateChange(null);
  };

  return (
    <Card sx={{ ...cardStyle, padding: 2 }}>
      <div className="flex flex-wrap gap-4 items-center">
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            label="Start Date"
            value={startDate}
            onChange={onStartDateChange}
            slotProps={{
              textField: {
                size: "small",
                sx: { minWidth: "200px" },
              },
            }}
          />
          <DatePicker
            label="End Date"
            value={endDate}
            onChange={onEndDateChange}
            slotProps={{
              textField: {
                size: "small",
                sx: { minWidth: "200px" },
              },
            }}
          />
        </LocalizationProvider>
        <Button
          onClick={handleClear}
          variant="outlined"
          sx={{
            borderColor: "#14532d",
            color: "#14532d",
            "&:hover": {
              borderColor: "#0f4024",
              backgroundColor: "rgba(20, 83, 45, 0.04)",
            },
          }}
        >
          Clear Filter
        </Button>
      </div>
    </Card>
  );
};
