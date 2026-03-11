"use client";

import React, { useEffect } from 'react';
import { useAppContext } from '@/context/AppContext';
import LandingPage from '@/components/home/LandingPage';
import UserFeed from '@/components/features/feed/UserFeed';

const HomePage: React.FC = () => {
  const { isLoggedIn, isUserLoading } = useAppContext();

  if (isUserLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-slate-900"></div>
      </div>
    );
  }

  if (isLoggedIn) {
    return <UserFeed />;
  }

  return <LandingPage />;
};

export default HomePage;