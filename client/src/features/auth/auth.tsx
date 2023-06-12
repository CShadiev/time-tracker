import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import axios, { isAxiosError } from "axios";
import { apiBase } from "../../app/config";
import { SignInForm } from "./signInForm";


type AuthStatus = 'check' | 'sign in' | 'sign out' | 'signed';

export const Auth: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const [status, setStatus] = useState<AuthStatus>('check');

  const me = useQuery<{ username: string }>({
    queryKey: ['me'],
    queryFn: async () => {
      console.log('fetching /users/me');
      return axios.get(apiBase + '/users/me', {});
    },
    retry: (failureCount, error) => {
      if (isAxiosError(error)) {
        if (error.response?.status === 401) {
          setStatus('sign in');
          return false;
        }
      }
      return failureCount < 3;
    },
  })

  if (status === 'sign in') {
    return <SignInForm />
  }

  return (
    <>
      {children}
    </>
  )
}