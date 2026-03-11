"use client";

import { GoogleOAuthProvider } from '@react-oauth/google';
import React from 'react';

interface Props {
    children: React.ReactNode;
    clientId: string;
}

export const GoogleAuthProviderWrapper: React.FC<Props> = ({ children, clientId }) => {
    return (
        <GoogleOAuthProvider clientId={clientId}>
            {children}
        </GoogleOAuthProvider>
    );
};
