"use client";

import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback } from 'react';
import AuthModal from '@/components/features/auth/AuthModal';
import CreatePostModal from '@/components/features/feed/CreatePostModal';
import { IUser } from '@/lib/models/User.model';

// Interface defining the shape of our global application context
// This provides type safety for all components consuming the context
interface AppContextType {
  isLoggedIn: boolean;             // Tracks if the user is authenticated
  setIsLoggedIn: (isLoggedIn: boolean) => void;
  isUserLoading: boolean;          // Indicates if user data is being fetched
  user: IUser | null;              // Stores the current user's data
  fetchUser: () => Promise<void>;  // Function to refresh user data from API
  openAuthModal: () => void;       // Triggers the login/signup modal
  openCreatePostModal: (post?: any) => void; // Triggers the create/edit post modal
  closeCreatePostModal: () => void; // Closes the create post modal
  isCreatePostModalOpen: boolean;  // State of the create post modal
  editingPost: any | null;         // Stores the post currently being edited
}

// Create the context with undefined initial value
const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {

  // Global State Management
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [user, setUser] = useState<IUser | null>(null);
  const [isUserLoading, setIsUserLoading] = useState<boolean>(true); // Start true to check auth on load
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState<boolean>(false);
  const [editingPost, setEditingPost] = useState<any | null>(null);

  // fetchUser: Authenticates the user using the stored token
  // This is wrapped in useCallback to prevent unnecessary re-creations
  const fetchUser = useCallback(async () => {
    setIsUserLoading(true);
    const token = localStorage.getItem('token');

    // If no token exists, reset user state and stop loading
    if (!token) {
      setIsLoggedIn(false);
      setUser(null);
      setIsUserLoading(false);
      return;
    };

    try {
      // Verify token with backend
      const res = await fetch('/api/users/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        // Token is valid, update user state
        const userData = await res.json();
        setUser(userData);
        setIsLoggedIn(true);
      } else {
        // Token invalid or user not found, clear session
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        setUser(null);
      }
    } catch (error) {
      console.error('Failed to fetch user', error);
      // On error, better to be safe and clear potentially bad state
      localStorage.removeItem('token');
      setIsLoggedIn(false);
      setUser(null);
    } finally {
      setIsUserLoading(false); // Ensure loading state is cleared
    }
  }, []);

  // Initial check for user authentication on component mount
  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  // Modal Control Functions
  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);

  const openCreatePostModal = (post?: any) => {
    if (post) setEditingPost(post);
    else setEditingPost(null);
    setIsCreatePostModalOpen(true);
  };
  const closeCreatePostModal = () => {
    setIsCreatePostModalOpen(false);
    setEditingPost(null);
  };

  // Callback when login succeeds within the modal
  const handleLoginSuccess = () => {
    fetchUser(); // Refresh user data
    closeAuthModal(); // Close the modal
  };

  // The value object exposed to all children components
  const value = {
    isLoggedIn,
    setIsLoggedIn,
    isUserLoading,
    user,
    fetchUser,
    openAuthModal,
    openCreatePostModal,
    closeCreatePostModal,
    isCreatePostModalOpen,
    editingPost
  };

  return (
    <AppContext.Provider value={value}>
      {children}
      {/* Global Modals: Rendered here to be accessible from anywhere */}
      {isAuthModalOpen && (
        <AuthModal
          onClose={closeAuthModal}
          onLoginSuccess={handleLoginSuccess}
        />
      )}
      {isCreatePostModalOpen && (
        <CreatePostModal />
      )}
    </AppContext.Provider>
  );
};

// Custom hook for consuming the context
// Ensures the hook is used within an AppProvider
export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};