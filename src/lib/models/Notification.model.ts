import mongoose, { Schema, Document } from "mongoose";

export interface INotification extends Document {
    type: "RELATIONSHIP_REQUEST" | "GENERAL";
    sender: mongoose.Types.ObjectId;
    receiver: mongoose.Types.ObjectId;
    status: "PENDING" | "ACCEPTED" | "REJECTED";
    metadata: {
        requestingRelation?: string;
        [key: string]: any;
    };
    isRead: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const NotificationSchema = new Schema<INotification>(
    {
        type: {
            type: String,
            enum: ["RELATIONSHIP_REQUEST", "GENERAL"],
            required: true,
        },
        sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
        receiver: { type: Schema.Types.ObjectId, ref: "User", required: true },
        status: {
            type: String,
            enum: ["PENDING", "ACCEPTED", "REJECTED"],
            default: "PENDING",
        },
        metadata: {
            requestingRelation: { type: String },
        },
        isRead: { type: Boolean, default: false },
    },
    { timestamps: true }
);

// Check if the model exists before compiling it
const Notification =
    mongoose.models.Notification ||
    mongoose.model<INotification>("Notification", NotificationSchema);

export default Notification;
