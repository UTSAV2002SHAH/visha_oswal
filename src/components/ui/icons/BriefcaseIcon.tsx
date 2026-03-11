import React from 'react';

export const BriefcaseIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    {...props}
  >
    <path d="M3.375 4.5C2.339 4.5 1.5 5.34 1.5 6.375V13.5h12V6.375c0-1.036-.84-1.875-1.875-1.875h-8.25zM13.5 15h-12v2.625c0 1.035.84 1.875 1.875 1.875h.375a3 3 0 116.75 0h.375a1.875 1.875 0 001.875-1.875V15z" />
    <path d="M16.5 6.375c0-1.036.84-1.875 1.875-1.875h.375a3 3 0 116.75 0h.375a1.875 1.875 0 011.875 1.875v7.125h-12V6.375z" />
  </svg>
);
