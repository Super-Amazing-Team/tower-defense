import axios from "axios";
import { forumUrl } from "@/constants";

export default axios.create({
  baseURL: forumUrl,
  headers: {
    "Access-Control-Allow-Origin": "*",
  },
});
