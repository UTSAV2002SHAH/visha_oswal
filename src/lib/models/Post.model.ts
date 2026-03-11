import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IPost extends Document {
    user: mongoose.Types.ObjectId;
    content: string;
    imageUrl: string;
    likesCount: number;
    comments: {
        user: mongoose.Types.ObjectId;
        text: string;
        createdAt: Date;
    }[];
    createdAt: Date;
    updatedAt: Date;
}

const PostSchema = new Schema<IPost>({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true, trim: true },
    imageUrl: { type: String, required: true },
    likesCount: { type: Number, default: 0 },
    comments: [{
        user: { type: Schema.Types.ObjectId, ref: 'User' },
        text: { type: String, required: true },
        createdAt: { type: Date, default: Date.now }
    }],
}, {
    timestamps: true
});

const Post: Model<IPost> = mongoose.models.Post || mongoose.model<IPost>('Post', PostSchema);

export default Post;
