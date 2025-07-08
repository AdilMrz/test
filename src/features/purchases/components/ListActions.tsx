import { SelectColumnsButton, TopToolbar, useTranslate } from "react-admin";
import { Button as MuiButton } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { Protected } from "../../../components/Protected";

export const ListActions = () => {
  const navigate = useNavigate();
  const translate = useTranslate();

  return (
    <TopToolbar>
      <SelectColumnsButton />
      <Protected action="create" resource="purchases">
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
          {translate("resources.purchases.create")}
        </MuiButton>
      </Protected>
    </TopToolbar>
  );
};
