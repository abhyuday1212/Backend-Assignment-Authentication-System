import { z } from "zod";

export const userValidation = {
  updateProfile: z.object({
    email: z.string().email(),
  }),
};
