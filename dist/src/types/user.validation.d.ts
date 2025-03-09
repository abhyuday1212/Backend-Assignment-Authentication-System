import { z } from "zod";
export declare const userValidation: {
    updateProfile: z.ZodObject<{
        email: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        email: string;
    }, {
        email: string;
    }>;
};
