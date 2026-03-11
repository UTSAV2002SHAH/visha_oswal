import mongoose, { Document, Model, Schema } from 'mongoose';

// --- Sub-schema Interfaces ---

export interface IAuthToken extends Document {
  accessToken: string;
  refreshToken?: string;
  createdAt: Date;
  lastUsedAt?: Date;
  deviceInfo?: string;
}

export interface IExperience {
  _id: mongoose.Types.ObjectId;
  title: string;
  company: string;
  logo?: string;
  startDate: Date;
  endDate?: Date;
  isCurrent: boolean;
  description?: string;
}

export interface IEducation {
  _id: mongoose.Types.ObjectId;
  school: string;
  degree: string;
  logo?: string;
  fieldOfStudy?: string;
  startDate: Date;
  endDate?: Date;
  isCurrent: boolean;
}

// --- Main User Interface ---

export interface IUser extends Document {
  email: string;
  passwordHash: string;
  name?: string;
  username?: string;
  headline?: string;
  city?: string;
  connections?: number;
  profilePictureUrl?: string;
  bannerImageUrl?: string;
  about?: string;
  skills: string[];
  experience: IExperience[];
  education: IEducation[];
  authTokens: IAuthToken[];
  accountStatus: 'active' | 'inactive' | 'suspended';
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// --- Mongoose Schemas ---

const AuthTokenSchema = new Schema<IAuthToken>({
  accessToken: { type: String, required: true },
  refreshToken: { type: String },
  createdAt: { type: Date, default: Date.now },
  lastUsedAt: { type: Date },
  deviceInfo: { type: String },
});

const ExperienceSchema = new Schema<IExperience>({
  title: { type: String, required: true },
  company: { type: String, required: true },
  logo: { type: String },
  startDate: { type: Date, required: true },
  endDate: { type: Date },
  isCurrent: { type: Boolean, default: false },
  description: { type: String },
});

const EducationSchema = new Schema<IEducation>({
  school: { type: String, required: true },
  degree: { type: String, required: true },
  logo: { type: String },
  fieldOfStudy: { type: String },
  startDate: { type: Date, required: true },
  endDate: { type: Date },
  isCurrent: { type: Boolean, default: false },
});

const UserSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String },
  name: { type: String, default: "Your Name", trim: true, index: true },
  username: {
    type: String,
    unique: true,
    sparse: true,
    lowercase: true,
    trim: true,
    match: [/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers and underscores']
  },
  headline: { type: String, default: "Your Headline", trim: true },
  city: {
    type: String,
    default: "Your City",
    trim: true,
    maxlength: [50, 'City name too long'],
    match: [/^[a-zA-Z\s,.-]+$/, 'City name contains invalid characters']
  },
  connections: { type: Number, default: 0 },
  profilePictureUrl: { type: String, default: '' },
  bannerImageUrl: { type: String, default: '' },
  about: { type: String, default: "Tell us about yourself...", trim: true },
  skills: { type: [String], default: ["Communication", "Leadership", "Problem Solving"] },
  experience: [ExperienceSchema],
  education: [EducationSchema],
  authTokens: [AuthTokenSchema],
  accountStatus: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
    default: 'active',
  },
  lastLogin: { type: Date },
}, {
  timestamps: true
});

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;