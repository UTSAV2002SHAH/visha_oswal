"use client";

import { useState, useEffect, useCallback } from 'react';
import { isProfileComplete } from '@/utils/profile-validation';
import { useAppContext } from '@/context/AppContext';
import { fetchWithAuth } from '@/lib/utils/fetchWithAuth';

export const useProfileCompleteness = () => {
    const { user } = useAppContext();
    const [isComplete, setIsComplete] = useState<boolean>(true);
    const [loading, setLoading] = useState<boolean>(true);

    const checkCompleteness = useCallback(async () => {
        if (!user) {
            setLoading(false);
            return;
        }

        try {
            const res = await fetchWithAuth('/api/member-profile');

            if (res.ok) {
                const data = await res.json();
                setIsComplete(isProfileComplete(data.personal));
            } else {
                setIsComplete(false);
            }
        } catch (error) {
            console.error("Failed to check profile completeness", error);
            setIsComplete(false);
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        checkCompleteness();
    }, [checkCompleteness]);

    return { isComplete, loading, refresh: checkCompleteness };
};
