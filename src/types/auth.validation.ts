import { z } from "zod";

export const authValidation = {
  register: z.object({
    email: z.string().email(),
    password: z.string(),
    role: z.enum(["user", "admin"]).optional(),
  }),
  login: z.object({
    email: z.string().email(),
    password: z.string(),
  }),
  forgotPassword: z.object({
    email: z.string().email(),
  }),
};
