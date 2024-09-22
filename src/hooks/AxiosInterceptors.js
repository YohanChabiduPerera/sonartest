// AxiosInterceptors.js
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { useEffect } from 'react';

const useAxiosInterceptors = () => {
  const { token, refreshToken, logout, refreshAuthToken } = useAuth();

  useEffect(() => {
    const requestInterceptor = axios.interceptors.request.use(
      (config) => {
        if (token) {
          config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        console.log(error)
        if (error.response.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            await refreshAuthToken();
            return axios(originalRequest);
          } catch (refreshError) {
            logout();
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, [token, refreshToken, logout, refreshAuthToken]);
};

export default useAxiosInterceptors;
