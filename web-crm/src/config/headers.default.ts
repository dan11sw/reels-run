import { AxiosRequestConfig } from "axios";

export const HeadersDefaultJSON: AxiosRequestConfig<any> = {
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
};
