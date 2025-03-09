interface ResetTokenData {
    email: string;
    token: string;
    resetLink: string;
    expiresAt: number;
}
export declare const resetTokens: Map<string, ResetTokenData>;
export {};
