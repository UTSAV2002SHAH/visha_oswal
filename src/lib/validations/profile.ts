import { z } from 'zod';

export const PersonalDetailsSchema = z.object({
  fullName: z.string().min(1, 'Full name is required').max(100),
  gender: z.enum(['Male', 'Female', 'Other']).optional(),
  contactNumber: z.string().optional(),
  dateOfBirth: z.string().or(z.date()).optional(),
  maritalStatus: z.string().optional(),
  cityOfOrigin: z.string().optional(),
  currentCity: z.string().optional(),
});

export const ExperienceSchema = z.object({
  title: z.string().min(1, 'Job title is required').max(100),
  company: z.string().min(1, 'Company name is required').max(100),
  logo: z.string().optional(),
  startDate: z.string().or(z.date()),
  endDate: z.string().or(z.date()).optional().nullable(),
  isCurrent: z.boolean().default(false),
  description: z.string().max(2000).optional(),
});

export const EducationSchema = z.object({
  school: z.string().min(1, 'School name is required').max(100),
  degree: z.string().min(1, 'Degree is required').max(100),
  logo: z.string().optional(),
  fieldOfStudy: z.string().optional(),
  startDate: z.string().or(z.date()),
  endDate: z.string().or(z.date()).optional().nullable(),
  isCurrent: z.boolean().default(false),
});

export const UserUpdateSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100).optional(),
  username: z.string().min(3, 'Username must be at least 3 characters').max(30).regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers and underscores').optional(),
  headline: z.string().max(200).optional(),
  city: z.string().max(50).optional(),
  about: z.string().max(5000).optional(),
  skills: z.array(z.string()).optional(),
  profilePictureUrl: z.string().optional(),
  bannerImageUrl: z.string().optional(),
});
