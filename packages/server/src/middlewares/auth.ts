import { Request, Response, NextFunction } from "express";
import fetch from "node-fetch";

export const auth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const response = await fetch("https://ya-praktikum.tech/api/v2/auth/user", {
    method: "get",
    headers: {
      // "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      // "Access-Control-Allow-Credentials": "true",
      // cookie: "authCookie=c4492727e1da083a3f23a3a4eb988330be3a8668%3A1680026949; uuid=45ebe208-7a96-41a7-8b8e-bf30554b7865",
    }
  });
  if (response.status === 200) {
    next();
  } else {
    res.status(403).send("Forbidden");
  }
  return false;
};
