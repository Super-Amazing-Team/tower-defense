import axios from "axios";
import { forumUrl } from "@/constants";

export default axios.create({
  baseURL: forumUrl,
  headers: {
    "Access-Control-Allow-Origin": "*",
    Authorization:
      "authCookie=c4492727e1da083a3f23a3a4eb988330be3a8668%3A1680026949; uuid=45ebe208-7a96-41a7-8b8e-bf30554b7865",
  },
});
