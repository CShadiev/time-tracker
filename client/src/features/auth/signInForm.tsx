import { Button, Card, Col, Input, Row } from "antd";
import "./auth.sass";
import { useEffect, useState } from "react";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { apiBase } from "../../app/config";
import { AccessTokenResponse } from "./authTypes";
import { useAppDispatch } from "../../app/hooks";
import { setAccessToken } from "./authSlice";

export const SignInForm: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const params = new URLSearchParams(window.location.search);
  const [triedUrlSignIn, setTriedUrlSignIn] = useState(false);
  const dispatch = useAppDispatch();

  const signIn = useMutation({
    mutationFn: async ({
      username,
      password,
    }: {
      username: string;
      password: string;
    }) => {
      const response = await axios.post(apiBase + "/users/token/", {
        username: username,
        password: password,
      });
      const respData: AccessTokenResponse = response.data;
      localStorage.setItem("access_token", respData.access_token);
      dispatch(setAccessToken(respData.access_token));
    },
  });

  const userNameHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const passwordHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const allowSignin = username && password && !signIn.isLoading;

  useEffect(() => {
    const username = params.get("username");
    const password = params.get("password");
    if (username && password && signIn.isIdle && !triedUrlSignIn) {
      console.log("signing in with url params");
      console.log(username, password);
      setTriedUrlSignIn(true);
      signIn.mutate({ username, password });
    }
  }, [params, signIn]);

  return (
    <div
      className={"sign-in-container"}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          if (allowSignin) {
            signIn.mutate({ username, password });
          }
        }
      }}
    >
      <Row justify={"center"}>
        <Col xs={24} sm={12} md={10}>
          <Card title={"Sign In"}>
            <Input
              value={username}
              placeholder={"Username"}
              onChange={userNameHandler}
            />
            <div className="spacer" />
            <Input.Password
              value={password}
              placeholder={"Password"}
              onChange={passwordHandler}
            />
            {signIn.isError && (
              <div
                className="danger"
                style={{
                  marginTop: "1em",
                  fontSize: ".9em",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                Invalid username or password
              </div>
            )}
            <div className="controls">
              <Button
                type={"primary"}
                disabled={!allowSignin}
                onClick={() => signIn.mutate({ username, password })}
              >
                Sign In
              </Button>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};
