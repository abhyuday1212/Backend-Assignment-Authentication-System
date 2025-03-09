import { z } from "zod";
export declare const authValidation: {
    register: z.ZodObject<{
        email: z.ZodString;
        password: z.ZodString;
        role: z.ZodOptional<z.ZodEnum<["user", "admin"]>>;
    }, "strip", z.ZodTypeAny, {
        email: string;
        password: string;
        role?: "user" | "admin" | undefined;
    }, {
        email: string;
        password: string;
        role?: "user" | "admin" | undefined;
    }>;
    login: z.ZodObject<{
        email: z.ZodString;
        password: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        email: string;
        password: string;
    }, {
        email: string;
        password: string;
    }>;
    forgotPassword: z.ZodObject<{
        email: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        email: string;
    }, {
        email: string;
    }>;
};
