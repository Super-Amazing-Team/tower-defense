import { z } from "zod";

export const loginSchema = z.object({
  login: z.string().min(3).max(20),
  password: z.string().min(6).max(20),
});

export const registerSchema = z.object({
  first_name: z.string().min(3).max(20),
  second_name: z.string().min(3).max(20),
  email: z.string().email(),
  login: z.string().min(3).max(20),
  phone: z.string().regex(/^[+]?[0-9]{10,15}$/),
  password: z.string().min(6).max(20),
});

export const newForumThemeSchema = z.object({
  title: z.string().min(3).max(30),
  theme: z.string().min(6).max(300),
});

export const newForumMsgSchema = z.object({
  message: z.string().min(3).max(300),
});

export const editPassSchema = z
  .object({
    oldPassword: z.string().min(6).max(20),
    newPassword: z.string().min(6).max(20),
    confirmNewPassword: z.string().min(6).max(20),
  })
  .superRefine(({ confirmNewPassword, newPassword }, ctx) => {
    if (confirmNewPassword !== newPassword) {
      ctx.addIssue({
        code: "custom",
        message: "Пароли не совпадают",
        path: ["confirmNewPassword"],
      });
    }
  });

export const formProfileSchema = z.object({
  first_name: z.string().min(3).max(20),
  second_name: z.string().min(3).max(20),
  display_name: z.string().min(3).max(20),
  email: z.string().email(),
  login: z.string().min(3).max(20),
  phone: z.string().regex(/^[+]?[0-9]{10,15}$/),
});
