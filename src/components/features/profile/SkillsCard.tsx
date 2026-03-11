"use client";

import React, { useState } from 'react';
import { PencilIcon } from '../../ui/icons/PencilIcon';
import { PlusIcon } from '../../ui/icons/PlusIcon';
import { CodeBracketIcon } from '../../ui/icons/CodeBracketIcon';
import { CloseIcon } from '../../ui/icons/CloseIcon'; // Check if this icon exists, if not, I'll need to create it or use a text X

interface SkillsCardProps {
  skills: string[];
  onAdd: (skill: string) => void;
  onDelete: (skill: string) => void;
  isEditable?: boolean;
}

export const SkillsCard: React.FC<SkillsCardProps> = ({ skills, onAdd, onDelete, isEditable = true }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newSkill, setNewSkill] = useState('');

  const handleAdd = () => {
    if (newSkill.trim()) {
      onAdd(newSkill.trim());
      setNewSkill('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAdd();
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-lg shadow-md p-6 transition-colors duration-300 border border-transparent dark:border-slate-700">
      <header className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          <span className="text-gray-500 dark:text-gray-400"><CodeBracketIcon className="w-6 h-6" /></span>
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 transition-colors duration-300">Skills</h2>
        </div>
        <div className="flex items-center gap-2">
          {isEditable && (
            isEditing ? (
              <button
                onClick={() => setIsEditing(false)}
                className="text-sm text-gray-500 hover:text-orange-600"
              >
                Done
              </button>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="text-gray-500 dark:text-gray-400 hover:text-orange-600 dark:hover:text-orange-400 transition-all transform hover:scale-110"
                aria-label="Add or Edit skills"
              >
                <PencilIcon className="w-5 h-5" />
              </button>
            )
          )}
        </div>
      </header>

      {isEditing && (
        <div className="mb-4 flex gap-2">
          <input
            type="text"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Add a skill..."
            className="flex-1 px-3 py-1 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500"
          />
          <button
            onClick={handleAdd}
            disabled={!newSkill.trim()}
            className="bg-orange-500 text-white px-3 py-1 rounded-md hover:bg-orange-600 disabled:opacity-50"
          >
            Add
          </button>
        </div>
      )}

      <div className="flex flex-wrap">
        {skills.map((skill, index) => (
          <span key={`${skill}-${index}`} className="group inline-flex items-center bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200 text-sm font-semibold mr-2 mb-2 px-3 py-1 rounded-full transition-colors duration-300">
            {skill}
            {isEditing && (
              <button
                onClick={() => onDelete(skill)}
                className="ml-2 text-orange-600 hover:text-orange-900 focus:outline-none"
                aria-label={`Remove ${skill}`}
              >
                <span className="text-xs font-bold">✕</span>
              </button>
            )}
          </span>
        ))}
        {skills.length === 0 && !isEditing && (
          <p className="text-gray-400 text-sm italic">No skills added yet.</p>
        )}
      </div>
    </div>
  );
};
