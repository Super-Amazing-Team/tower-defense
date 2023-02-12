import axios from "axios";
import { baseUrl } from "@/constants";
axios.defaults.withCredentials = true;
axios.defaults.headers.common["Access-Control-Allow-Origin"] = "*";
export default axios.create({ baseURL: baseUrl });
