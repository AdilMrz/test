import { Button, TopToolbar } from "react-admin";
import { useNavigate } from "react-router-dom";
import { ArrowBack } from "@mui/icons-material";

export const BackActions = () => {
  const navigate = useNavigate();
  return (
    <TopToolbar>
      <Button label="Back" onClick={() => navigate("/products")}>
        <ArrowBack />
      </Button>
    </TopToolbar>
  );
};
