"use client";

import React from 'react';
import { UsersIcon } from './ui/icons/UsersIcon';

interface Person {
  name: string;
  headline: string;
  avatar: string;
}

interface PeopleYouMayKnowCardProps {
  people: Person[];
}

const PersonItem: React.FC<{ person: Person }> = ({ person }) => (
  <div className="flex items-center gap-3 py-3 border-b border-gray-200 last:border-b-0">
    <img src={person.avatar} alt={person.name} className="w-12 h-12 rounded-full object-cover" />
    <div className="flex-grow">
      <h4 className="font-bold text-gray-800">{person.name}</h4>
      <p className="text-sm text-gray-500 truncate">{person.headline}</p>
    </div>
    <button className="border border-orange-500 text-orange-500 font-semibold px-4 py-1.5 rounded-full hover:bg-orange-50 transition-colors text-sm whitespace-nowrap">
      Connect
    </button>
  </div>
);

export const PeopleYouMayKnowCard: React.FC<PeopleYouMayKnowCardProps> = ({ people }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <header className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-3">
          <span className="text-gray-500"><UsersIcon className="w-6 h-6" /></span>
          <h2 className="text-xl font-bold text-gray-800">People You May Know</h2>
        </div>
      </header>
      <div>
        {people.map(person => <PersonItem key={person.name} person={person} />)}
      </div>
    </div>
  );
};
