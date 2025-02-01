import mongoose from "mongoose";
import { compareValue, hashValue } from "../utils/bcrypt";

export interface UserDocument extends mongoose.Document {
    email: string;
    password: string;
    verified: boolean
    createdAt: Date;
    updatedAt: Date;
    comparePassword(val: string): Promise<boolean>;
}


const userSchema = new mongoose.Schema<UserDocument>({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    verified: { type: Boolean, required: true, default: false },
    // createdAt: { type: Date, default: Date.now },
}, {
    timestamps: true,
})


// schema hooks: run before event occurs
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }

    this.password = await hashValue(this.password);
    next();
})


userSchema.methods.comparePassword = async function (val: string) {
    return await compareValue(val, this.password);
}


const User = mongoose.model<UserDocument>("User", userSchema);


export default User;