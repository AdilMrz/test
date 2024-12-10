import { useSetLocale, useLocale } from "react-admin";
import { Button, Menu, MenuItem } from "@mui/material";
import { Language as LanguageIcon } from "@mui/icons-material";
import { useState } from "react";

export const LanguageSwitcher = () => {
  const setLocale = useSetLocale();
  const locale = useLocale();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLanguageChange = (newLocale: string) => {
    setLocale(newLocale);
    handleClose();
  };

  return (
    <>
      <Button
        color="inherit"
        onClick={handleClick}
        startIcon={<LanguageIcon />}
      >
        {locale === "en" ? "English" : "Français"}
      </Button>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem onClick={() => handleLanguageChange("en")}>English</MenuItem>
        <MenuItem onClick={() => handleLanguageChange("fr")}>Français</MenuItem>
      </Menu>
    </>
  );
};
