import axios from "axios";
import { baseUrl } from "@/constants";

const instance = axios.create({ baseURL: baseUrl });

instance.defaults.withCredentials = true;
instance.defaults.headers.common["Access-Control-Allow-Origin"] = "*";

export default instance;
