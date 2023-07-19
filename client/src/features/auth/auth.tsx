import React from "react";
import { SignInForm } from "./signInForm";
import { useAppSelector } from "../../app/hooks";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { accessTokenSelector } from "./authSlice";

export const Auth: React.FC = () => {
  const access_token = useAppSelector(accessTokenSelector);
  const navigate = useNavigate();

  useEffect(() => {
    if (access_token) {
      navigate("/");
    }
  });

  return <div className="auth">{!access_token && <SignInForm />}</div>;
};
