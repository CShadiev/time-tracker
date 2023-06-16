import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { useEffect, useRef } from "react";
import axios from "axios";
import { setAccessToken, unsetAccessToken } from "./authSlice";
import { toast } from "react-toastify";
import { REDIRECT_DELAY_SECONDS } from "../../app/config";

export const AuthInterceptor: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const accessToken = useAppSelector((state) => state.auth.access_token);
  const interceptor = useRef<any>(null);

  useEffect(() => {
    // add interceptor
    if (!interceptor.current) {
      interceptor.current = axios.interceptors.response.use(
        (response) => response,
        (error) => {
          if (error.response.status === 401) {
            localStorage.removeItem("access_token");
            dispatch(unsetAccessToken());
            toast("Session expired, please log in.", {
              autoClose: REDIRECT_DELAY_SECONDS * 1000,
              type: "warning",
              position: "top-center",
            });
            setTimeout(() => {
              navigate("/auth");
            }, REDIRECT_DELAY_SECONDS * 1000);
          }
          return Promise.reject(error);
        }
      );
    }

    // remove interceptor on unmount
    return () => {
      if (interceptor.current) {
        axios.interceptors.response.eject(interceptor.current);
      }
    };
  }, [dispatch, navigate]);

  useEffect(() => {
    // check if access token is in local storage
    // use only on app load
    if (!accessToken) {
      const storageAccessToken = localStorage.getItem("access_token");
      if (storageAccessToken) {
        dispatch(setAccessToken(storageAccessToken));
      }
    }
  }, []);

  return null;
};
