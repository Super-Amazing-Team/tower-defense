import { z } from "zod";

export const registerSchema = z.object({
  id: z.number(),
});

export const userSchema = z.object({
  id: z.number(),
  first_name: z.string(),
  second_name: z.string(),
  display_name: z.string(),
  login: z.string(),
  email: z.string(),
  phone: z.string(),
  avatar: z.string().nullable(),
});
