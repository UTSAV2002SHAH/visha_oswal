"use client";

import React, { useState, useEffect, useRef } from 'react';
import { SpinnerIcon } from './icons/SpinnerIcon';

export interface Company {
  name: string;
  logo: string;
}

const MOCK_COMPANIES: Company[] = [
  { name: 'Google', logo: 'https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg' },
  { name: 'Google DeepMind', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Google_DeepMind_logo.svg/1024px-Google_DeepMind_logo.svg.png' },
  { name: 'Facebook', logo: 'https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg' },
  { name: 'Meta', logo: 'https://upload.wikimedia.org/wikipedia/commons/a/ab/Meta-Logo.png' },
  { name: 'Apple', logo: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg' },
  { name: 'Amazon', logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg' },
  { name: 'Netflix', logo: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg' },
  { name: 'Microsoft', logo: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg' },
  { name: 'Tesla', logo: 'https://upload.wikimedia.org/wikipedia/commons/e/e8/Tesla_logo.png' },
  { name: 'OpenAI', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/OpenAI_Logo.svg/1024px-OpenAI_Logo.svg.png' },
  { name: 'NVIDIA', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/2/21/Nvidia_logo.svg/1024px-Nvidia_logo.svg.png' }
];

const searchCompanies = (query: string): Promise<Company[]> => {
  return new Promise(resolve => {
    setTimeout(() => {
      if (!query) {
        resolve([]);
        return;
      }
      const lowercasedQuery = query.toLowerCase();
      const results = MOCK_COMPANIES.filter(company =>
        company.name.toLowerCase().includes(lowercasedQuery)
      );
      resolve(results);
    }, 300);
  });
};

interface CompanyAutocompleteProps {
  value: string;
  onValueChange: (value: string) => void;
  onSelect: (company: Company) => void;
  label: string;
  placeholder?: string;
}

export const CompanyAutocomplete: React.FC<CompanyAutocompleteProps> = ({ value, onValueChange, onSelect, label, placeholder }) => {
  const [suggestions, setSuggestions] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value.trim() === '') {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const handler = setTimeout(() => {
      setIsLoading(true);
      searchCompanies(value).then(results => {
        setSuggestions(results);
        setIsLoading(false);
        setShowSuggestions(true);
      });
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelect = (company: Company) => {
    onSelect(company);
    setShowSuggestions(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onValueChange(e.target.value);
  }

  return (
    <div className="relative" ref={containerRef}>
      <label htmlFor="company" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
      <input
        type="text"
        id="company"
        name="company"
        value={value}
        onChange={handleInputChange}
        onFocus={() => value && setShowSuggestions(true)}
        placeholder={placeholder}
        className="mt-1 block w-full px-3 py-2 bg-gray-50 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm text-gray-900 dark:text-white transition-colors duration-200"
        autoComplete="off"
      />
      {showSuggestions && (
        <div className="absolute z-10 w-full mt-1 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-md shadow-lg max-h-60 overflow-y-auto">
          {isLoading && <div className="p-3 text-center text-gray-500 dark:text-gray-400"><SpinnerIcon className="animate-spin h-5 w-5 mx-auto" /></div>}
          {!isLoading && suggestions.length > 0 && (
            <ul>
              {suggestions.map(company => (
                <li
                  key={company.name}
                  onClick={() => handleSelect(company)}
                  className="flex items-center gap-3 p-3 cursor-pointer hover:bg-orange-100 dark:hover:bg-slate-700 transition-colors border-b border-gray-100 dark:border-slate-700 last:border-0"
                >
                  <img src={company.logo} alt={`${company.name} logo`} className="w-8 h-8 object-contain bg-white rounded-full p-0.5" />
                  <span className="text-gray-800 dark:text-gray-200">{company.name}</span>
                </li>
              ))}
            </ul>
          )}
          {!isLoading && suggestions.length === 0 && value.trim() !== '' && (
            <div className="p-3 text-center text-sm text-gray-500 dark:text-gray-400">No companies found. You can still add it manually.</div>
          )}
        </div>
      )}
    </div>
  );
};
