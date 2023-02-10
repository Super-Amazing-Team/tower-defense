import type { AxiosPromise, AxiosRequestConfig } from "axios";
import { Axios } from "./axios";

export interface IApiService {
  get<T>(endpoint: string, options?: AxiosRequestConfig): AxiosPromise<T>;
  post<T, R = undefined>(
    endpoint: string,
    payload?: R,
    options?: AxiosRequestConfig,
  ): AxiosPromise<T>;
  put<T, R>(
    endpoint: string,
    payload?: R,
    options?: AxiosRequestConfig,
  ): AxiosPromise<T>;
  delete<T, R = undefined>(
    endpoint: string,
    payload?: R,
    options?: AxiosRequestConfig,
  ): AxiosPromise<T>;
  patch<T>(endpoint: string, options?: AxiosRequestConfig): AxiosPromise<T>;
}

class ApiService implements IApiService {
  private readonly baseUrl: string;

  constructor(url: string) {
    this.baseUrl = url;
  }

  get<Response>(
    endpoint: string,
    options?: AxiosRequestConfig,
  ): AxiosPromise<Response> {
    return Axios(`${this.baseUrl}${endpoint}`, options);
  }

  post<Response, Body = undefined>(
    endpoint: string,
    payload?: Body,
    options?: AxiosRequestConfig,
  ): AxiosPromise<Response> {
    return Axios.post(`${this.baseUrl}${endpoint}`, payload, options);
  }

  put<Response, Body>(
    endpoint: string,
    payload: Body,
    options?: AxiosRequestConfig,
  ): AxiosPromise<Response> {
    return Axios.put(`${this.baseUrl}${endpoint}`, payload, options);
  }

  delete<Response, Body>(
    endpoint: string,
    payload?: Body,
    options?: AxiosRequestConfig,
  ): AxiosPromise<Response> {
    return Axios.delete(`${this.baseUrl}${endpoint}`, {
      ...options,
      data: payload,
    });
  }

  patch<Response>(
    endpoint: string,
    options?: AxiosRequestConfig,
  ): AxiosPromise<Response> {
    return Axios.patch(`${this.baseUrl}${endpoint}`, options);
  }
}

export default new ApiService("https://ya-praktikum.tech/api/v2");
