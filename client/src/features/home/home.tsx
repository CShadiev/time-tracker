import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export const Home: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/dashboard");
  });

  return null;
};
