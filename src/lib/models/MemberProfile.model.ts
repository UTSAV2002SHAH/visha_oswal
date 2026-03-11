import mongoose, { Schema, Document } from "mongoose";

export interface IMemberProfile extends Document {
  userId: mongoose.Types.ObjectId;
  personal: {
    fullName: string;
    gender?: "Male" | "Female" | "Other";
    contactNumber?: string;
    dateOfBirth?: Date;
    maritalStatus?: string;
    cityOfOrigin?: string;
    currentCity?: string;
  };
  family: {
    father: {
      user?: mongoose.Types.ObjectId;
      name: string;
      status?: "PENDING" | "ACCEPTED" | "REJECTED";
      manualImage?: string;
    } | null;
    mother: {
      user?: mongoose.Types.ObjectId;
      name: string;
      status?: "PENDING" | "ACCEPTED" | "REJECTED";
      manualImage?: string;
    } | null;
    spouse: {
      user?: mongoose.Types.ObjectId;
      name: string;
      status?: "PENDING" | "ACCEPTED" | "REJECTED";
      manualImage?: string;
    } | null;
    siblings: Array<{
      user?: mongoose.Types.ObjectId;
      name: string;
      status?: "PENDING" | "ACCEPTED" | "REJECTED";
      manualImage?: string;
    }>;
    children: Array<{
      user?: mongoose.Types.ObjectId;
      name: string;
      status?: "PENDING" | "ACCEPTED" | "REJECTED";
      manualImage?: string;
    }>;
  };
}

const FamilyMemberSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", default: null },
    name: { type: String, required: true },
    status: {
      type: String,
      enum: ["PENDING", "ACCEPTED", "REJECTED"],
      default: null,
    },
    manualImage: { type: String, default: null },
  },
  { _id: false } // Prevent Mongoose from creating subdocument _ids for every family member
);

const MemberProfileSchema = new Schema<IMemberProfile>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    personal: {
      fullName: { type: String, required: true, index: true },
      gender: { type: String, enum: ["Male", "Female", "Other"] },
      contactNumber: { type: String },
      dateOfBirth: { type: Date },
      maritalStatus: { type: String },
      cityOfOrigin: { type: String, index: true },
      currentCity: { type: String, index: true },
    },
    family: {
      father: { type: FamilyMemberSchema, default: null },
      mother: { type: FamilyMemberSchema, default: null },
      spouse: { type: FamilyMemberSchema, default: null },
      siblings: { type: [FamilyMemberSchema], default: [] },
      children: { type: [FamilyMemberSchema], default: [] },
    },
  },
  {
    timestamps: true,
  }
);

// Check if the model exists before compiling it (for Next.js dev server hot-reloading)
const MemberProfile =
  mongoose.models.MemberProfile || mongoose.model<IMemberProfile>("MemberProfile", MemberProfileSchema);

export default MemberProfile;
