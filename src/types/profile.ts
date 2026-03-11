// Profile-related TypeScript interfaces and types

export interface Experience {
    _id: string;
    title: string;
    company: string;
    logo?: string;
    startDate: string;
    endDate?: string;
    isCurrent: boolean;
    description?: string;
}

export interface Education {
    _id: string;
    school: string;
    degree: string;
    logo?: string;
    fieldOfStudy?: string;
    startDate: string;
    endDate?: string;
    isCurrent: boolean;
}

export interface ProfileUser {
    _id: string;
    email: string;
    name: string;
    username: string;
    headline: string;
    city: string;
    connections: number;
    profilePictureUrl?: string;
    bannerImageUrl?: string;
    about: string;
    skills: string[];
    experience: Experience[];
    education: Education[];
}
