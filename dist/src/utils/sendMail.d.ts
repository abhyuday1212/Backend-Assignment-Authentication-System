export declare const sendResetPasswordEmail: (email: string, resetToken: string, resetUrl: string) => Promise<void>;
export declare const sendPasswordChangedConfirmation: (email: string) => Promise<void>;
