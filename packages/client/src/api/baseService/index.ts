import axios from "axios";
import { baseUrl } from "@/constants";
axios.defaults.withCredentials = true;
export default axios.create({ baseURL: baseUrl });
