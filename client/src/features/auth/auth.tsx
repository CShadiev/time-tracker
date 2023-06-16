import React from "react";
import { SignInForm } from "./signInForm";
import { useAppSelector } from "../../app/hooks";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const Auth: React.FC = () => {
  const access_token = useAppSelector((state) => state.auth.access_token);
  const navigate = useNavigate();

  useEffect(() => {
    if (access_token) {
      navigate("/");
    }
  });

  return <div className="auth">{!access_token && <SignInForm />}</div>;
};
