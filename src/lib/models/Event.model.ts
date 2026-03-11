import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IEvent extends Document {
    title: string;
    slug: string;
    description: string;
    imageUrl: string;
    startDate: Date;
    endDate: Date;
    location: string;
    tags: string[];
    link?: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const EventSchema = new Schema<IEvent>({
    title: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, index: true },
    description: { type: String, required: true, trim: true },
    imageUrl: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    location: { type: String, required: true, trim: true },
    tags: [{ type: String, trim: true }],
    link: { type: String, trim: true },
    isActive: { type: Boolean, default: true },
}, {
    timestamps: true,
});

// Auto-generate slug from title before saving
EventSchema.pre('save', function (next) {
    if (this.isModified('title') || !this.slug) {
        this.slug = this.title
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')   // remove special chars
            .replace(/\s+/g, '-')             // spaces → hyphens
            .replace(/-+/g, '-')              // collapse multiple hyphens
            .replace(/^-|-$/g, '');           // trim leading/trailing hyphens
    }
    next();
});

const Event: Model<IEvent> = mongoose.models.Event || mongoose.model<IEvent>('Event', EventSchema);

export default Event;
