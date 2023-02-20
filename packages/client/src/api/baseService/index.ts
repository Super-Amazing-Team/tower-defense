import axios from "axios";
import { baseUrl } from "@/constants";

export default axios.create({
  baseURL: baseUrl,
  headers: {
    "Access-Control-Allow-Origin": "*",
  },
  withCredentials: true,
});
