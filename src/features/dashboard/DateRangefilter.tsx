import { useState } from "react";
import { Box, Button } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { useLocale, useTranslate } from "react-admin";
import { fr, enUS } from "date-fns/locale";
import { startOfDay, endOfDay } from "date-fns";

interface DateRangeFilterProps {
  onFilterChange: (startDate: Date | null, endDate: Date | null) => void;
}

export const DateRangeFilter = ({ onFilterChange }: DateRangeFilterProps) => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const translate = useTranslate();
  const locale = useLocale();
  const dateLocale = locale === "fr" ? fr : enUS;

  const handleApply = () => {
    if (startDate && endDate) {
      // Set start date to beginning of day and end date to end of day
      const adjustedStartDate = startOfDay(startDate);
      const adjustedEndDate = endOfDay(endDate);
      onFilterChange(adjustedStartDate, adjustedEndDate);
    }
  };

  const handleClear = () => {
    setStartDate(null);
    setEndDate(null);
    onFilterChange(null, null);
  };

  return (
    <LocalizationProvider
      dateAdapter={AdapterDateFns}
      adapterLocale={dateLocale}
    >
      <Box sx={{ display: "flex", gap: 2, alignItems: "center", mb: 2 }}>
        <DatePicker
          label={translate("dashboard.startDate")}
          value={startDate}
          onChange={(newValue) => {
            setStartDate(newValue);
            if (endDate && newValue && newValue > endDate) {
              setEndDate(newValue);
            }
          }}
          slotProps={{ textField: { size: "small" } }}
          format="P"
        />
        <DatePicker
          label={translate("dashboard.endDate")}
          value={endDate}
          onChange={(newValue) => {
            setEndDate(newValue);
            if (startDate && newValue && newValue < startDate) {
              setStartDate(newValue);
            }
          }}
          slotProps={{ textField: { size: "small" } }}
          format="P"
          minDate={startDate}
        />
        <Button
          variant="contained"
          onClick={handleApply}
          disabled={!startDate || !endDate}
        >
          {translate("dashboard.apply")}
        </Button>
        <Button
          variant="outlined"
          onClick={handleClear}
          disabled={!startDate && !endDate}
        >
          {translate("dashboard.clear")}
        </Button>
      </Box>
    </LocalizationProvider>
  );
};
