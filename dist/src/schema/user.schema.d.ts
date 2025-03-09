import mongoose, { Document } from "mongoose";
interface UserDocument extends Document {
    email: string;
    password: string;
    role: "user" | "admin";
    refreshToken?: string;
    generateAccessToken(): Promise<string>;
    generatRefreshToken(): Promise<string>;
    comparePassword(candidatePassword: string): Promise<boolean>;
}
declare const User: mongoose.Model<UserDocument, {}, {}, {}, mongoose.Document<unknown, {}, UserDocument> & UserDocument & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export { User };
