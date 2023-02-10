import axios from "axios";
import type {
  AxiosError,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from "axios";

axios.defaults.withCredentials = true;
export const Axios = axios.create({});

const requestHandler = (request: InternalAxiosRequestConfig) => {
  return { ...request };
};

const responseHandler = (response: AxiosResponse) => {
  return response;
};

const errorHandler = (error: AxiosError) => {
  return Promise.reject(error);
};

Axios.interceptors.request.use(
  (request) => requestHandler(request),
  (error: AxiosError) => errorHandler(error),
);

Axios.interceptors.response.use(
  (response) => responseHandler(response),
  (error: AxiosError) => errorHandler(error),
);
