import { Button, TopToolbar } from "react-admin";
import { ArrowBack } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

export const BackActions = () => {
  const navigate = useNavigate();
  return (
    <TopToolbar>
      <Button label="Back" onClick={() => navigate("/purchases")}>
        <ArrowBack />
      </Button>
    </TopToolbar>
  );
};
