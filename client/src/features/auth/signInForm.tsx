import { Button, Card, Col, Input, Row } from "antd"
import './auth.sass';
import { useState } from "react";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { apiBase } from "../../app/config";


export const SignInForm: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const signIn = useMutation({
    mutationFn: (data: { username: string, password: string }) => {
      document.cookie = 'test=test';
      return axios.post(apiBase + '/users/sign_in', {
        username: data.username,
        password: data.password,
      }, { withCredentials: true })
    },
  })

  const userNameHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const passwordHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const allogSignin = (username && password) && !signIn.isLoading;

  console.log(signIn.data);

  return (
    <div className={'sign-in-container'}>
      <Row justify={'center'}>
        <Col xs={20} sm={10}>
          <Card title={'Sign In'}>
            <Input
              value={username}
              placeholder={'Username'}
              onChange={userNameHandler}
            />
            <div className='spacer' />
            <Input.Password
              value={password}
              placeholder={'Password'}
              onChange={passwordHandler}
            />
            <div className='controls'>
              <Button
                type={'primary'}
                disabled={!allogSignin}
                onClick={() => signIn.mutate({ username, password })}
              >
                Sign In
              </Button>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  )
}