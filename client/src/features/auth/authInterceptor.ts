import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../app/hooks";
import { useEffect, useRef } from "react";
import axios from "axios";
import { unsetAccessToken } from "./authSlice";
import { toast } from "react-toastify";
import { REDIRECT_DELAY_SECONDS, unprotectedRoutes } from "../../app/config";

export const AuthInterceptor: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  //   const accessToken = useAppSelector(accessTokenSelector);
  const responseInterceptor = useRef<any>(null);
  const requestInterceptor = useRef<any>(null);
  const redirectRef = useRef<any>(null);

  // add request interceptor
  useEffect(() => {
    // add interceptor
    if (!requestInterceptor.current) {
      requestInterceptor.current = axios.interceptors.request.use(
        (config) => {
          if (config.url && unprotectedRoutes.includes(config.url)) {
            return config;
          }

          const accessToken = localStorage.getItem("access_token");
          if (!accessToken) {
            return Promise.reject({ response: { status: 401 } });
          }
          config.headers["Authorization"] = `Bearer ${accessToken}`;
          return config;
        },
        (error) => {
          return Promise.reject(error);
        }
      );
    }

    // remove interceptor on unmount
    return () => {
      if (requestInterceptor.current) {
        axios.interceptors.request.eject(requestInterceptor.current);
        requestInterceptor.current = null;
      }
    };
  }, []);

  // add response interceptor
  useEffect(() => {
    // add interceptor
    if (responseInterceptor.current) {
      // clear existing
      axios.interceptors.response.eject(responseInterceptor.current);
      responseInterceptor.current = null;
    }

    responseInterceptor.current = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response.status === 401) {
          // clear currently stored token from localstorage
          // and redux store
          localStorage.removeItem("access_token");
          dispatch(unsetAccessToken());
          if (!redirectRef.current) {
            toast("Session expired, please log in.", {
              autoClose: REDIRECT_DELAY_SECONDS * 1000,
              type: "warning",
              position: "top-center",
            });
            redirectRef.current = setTimeout(() => {
              navigate("/auth");
              redirectRef.current = null;
            }, REDIRECT_DELAY_SECONDS * 1000);
          }
        }
        return Promise.reject(error);
      }
    );

    // remove interceptor on unmount
    return () => {
      if (responseInterceptor.current) {
        axios.interceptors.response.eject(responseInterceptor.current);
        responseInterceptor.current = null;
      }
    };
  }, [dispatch, navigate]);

  return null;
};
