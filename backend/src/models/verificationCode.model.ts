import mongoose from "mongoose";
import VerificationCodeType from "../constants/verificationCodeType";


export interface VerficationCodeDocument extends mongoose.Document {
  userId: mongoose.Types.ObjectId;
  type: VerificationCodeType;
  createdAt: Date;
  expiresAt: Date;
}


const verificationCodeSchema = new mongoose.Schema<VerficationCodeDocument>({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    index: true,
    ref: "User",
  },
  type: { type: String, required: true },
  createdAt: { type: Date, required: true, default: Date.now },
  expiresAt: { type: Date, required: true },
});


const VerificationCodeModel = mongoose.model<VerficationCodeDocument>(
  "VerificationCode",
  verificationCodeSchema,
  "verification_codes"
);


export default VerificationCodeModel;
