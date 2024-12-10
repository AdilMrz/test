import { DatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { Box, Button, useTheme } from "@mui/material";
import { useLocale, useTranslate } from "react-admin";
import { fr, enUS } from "date-fns/locale";
import { startOfDay, endOfDay } from "date-fns";
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
  const theme = useTheme();
  const translate = useTranslate();
  const locale = useLocale();
  const dateLocale = locale === "fr" ? fr : enUS;

  const handleApply = () => {
    if (startDate && endDate) {
      const adjustedStartDate = startOfDay(startDate);
      const adjustedEndDate = endOfDay(endDate);
      onStartDateChange(adjustedStartDate);
      onEndDateChange(adjustedEndDate);
    }
  };

  const handleClear = () => {
    onStartDateChange(null);
    onEndDateChange(null);
  };

  return (
    <Box
      sx={{
        ...cardStyle,
        padding: 2,
        bgcolor: theme.palette.background.paper,
        border: "none",
        boxShadow: "none",
      }}
    >
      <LocalizationProvider
        dateAdapter={AdapterDateFns}
        adapterLocale={dateLocale}
      >
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <DatePicker
            label={translate("dashboard.startDate")}
            value={startDate}
            onChange={(newValue) => {
              onStartDateChange(newValue);
              if (endDate && newValue && newValue > endDate) {
                onEndDateChange(newValue);
              }
            }}
            slotProps={{
              textField: {
                size: "small",
                sx: {
                  bgcolor: theme.palette.background.paper,
                  "& .MuiInputBase-root": {
                    color: theme.palette.text.primary,
                  },
                },
              },
            }}
            format="P"
          />
          <DatePicker
            label={translate("dashboard.endDate")}
            value={endDate}
            onChange={(newValue) => {
              onEndDateChange(newValue);
              if (startDate && newValue && newValue < startDate) {
                onStartDateChange(newValue);
              }
            }}
            slotProps={{
              textField: {
                size: "small",
                sx: {
                  bgcolor: theme.palette.background.paper,
                  "& .MuiInputBase-root": {
                    color: theme.palette.text.primary,
                  },
                },
              },
            }}
            format="P"
            minDate={startDate}
          />
          <Button
            variant="contained"
            onClick={handleApply}
            disabled={!startDate || !endDate}
            sx={{
              bgcolor: theme.palette.primary.main,
              "&:hover": {
                bgcolor: theme.palette.primary.dark,
              },
            }}
          >
            {translate("dashboard.apply")}
          </Button>
          <Button
            variant="outlined"
            onClick={handleClear}
            disabled={!startDate && !endDate}
            sx={{
              borderColor: theme.palette.primary.main,
              color: theme.palette.primary.main,
              "&:hover": {
                borderColor: theme.palette.primary.dark,
                bgcolor: theme.palette.action.hover,
              },
            }}
          >
            {translate("dashboard.clear")}
          </Button>
        </Box>
      </LocalizationProvider>
    </Box>
  );
};
