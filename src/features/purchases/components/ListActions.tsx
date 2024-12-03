import { SelectColumnsButton, TopToolbar } from "react-admin";
import { Button as MuiButton } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

export const ListActions = () => {
  const navigate = useNavigate();

  return (
    <TopToolbar>
      <SelectColumnsButton />
      <MuiButton
        startIcon={<AddIcon />}
        onClick={() => navigate("/purchases/create")}
        variant="outlined"
        size="medium"
        sx={{
          borderColor: "#14532d",
          color: "#14532d",
          height: "40px",
          minWidth: "140px",
          marginLeft: "8px",
          "&:hover": {
            borderColor: "#0f4024",
            backgroundColor: "rgba(20, 83, 45, 0.04)",
          },
        }}
      >
        Create Purchase
      </MuiButton>
    </TopToolbar>
  );
};
