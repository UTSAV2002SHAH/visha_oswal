"use client";

import React from 'react';
import { SearchIcon } from '../ui/icons/SearchIcon';

export const SearchBar: React.FC = () => {
  return (
    <div className="relative w-full">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <SearchIcon className="h-5 w-5 text-gray-500" />
      </div>
      <input
        type="text"
        placeholder="Search..."
        className="block w-full rounded-full border-0 bg-black/5 py-1.5 pl-10 pr-3 text-gray-700 ring-1 ring-inset ring-transparent placeholder:text-gray-500 focus:bg-white focus:ring-2 focus:ring-inset focus:ring-orange-500 sm:text-sm sm:leading-6 transition"
      />
    </div>
  );
};
