import { z } from "zod";

export const authValidation = {
  register: z
    .object({
      email: z.string().email(),
      password: z.string(),
      role: z.enum(["user", "admin"]).optional(),
    })
    .strict(),

  login: z
    .object({
      email: z.string().email(),
      password: z.string(),
    })
    .strict(),

  forgotPassword: z
    .object({
      email: z.string().email(),
    })
    .strict(),
};
