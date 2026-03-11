"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppContext } from '@/context/AppContext';
import { ProfilePage as ProfilePageComponent } from '@/components/features/profile/ProfilePage';
import { SpinnerIcon } from '@/components/ui/icons/SpinnerIcon';

const ProfilePage: React.FC = () => {
  const { isLoggedIn, user, isUserLoading } = useAppContext();
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    if (!isUserLoading) {
      if (!isLoggedIn) {
        router.push('/');
      } else {
        setAuthChecked(true);
      }
    }
  }, [isLoggedIn, isUserLoading, router]);

  if (!authChecked || !user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <SpinnerIcon className="w-12 h-12 animate-spin text-orange-500" />
      </div>
    );
  }

  return <ProfilePageComponent />;
};

export default ProfilePage;