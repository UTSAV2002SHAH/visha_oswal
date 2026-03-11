export interface PersonalDetails {
    fullName: string;
    gender?: 'Male' | 'Female' | 'Other' | string;
    maritalStatus?: string;
    dateOfBirth?: string;
    cityOfOrigin?: string;
    currentCity?: string;
    contactNumber?: string;
}

/**
 * Checks if the personal details provided meet the mandatory requirements.
 * Mandatory fields: fullName, gender, contactNumber, dateOfBirth
 */
export const isProfileComplete = (personalData: PersonalDetails | null | undefined): boolean => {
    if (!personalData) return false;

    return !!(
        personalData.fullName &&
        personalData.fullName.trim() !== '' &&
        personalData.gender &&
        personalData.contactNumber &&
        personalData.contactNumber.trim() !== '' &&
        personalData.dateOfBirth
    );
};
