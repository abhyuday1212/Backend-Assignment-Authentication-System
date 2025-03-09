//In‑memory store for tokens (token string → token data)
interface ResetTokenData {
  email: string;
  token: string;
  resetLink: string;
  expiresAt: number;
}
export const resetTokens: Map<string, ResetTokenData> = new Map();
