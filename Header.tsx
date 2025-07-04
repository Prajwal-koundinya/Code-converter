import React from 'react';
import { Code, Settings } from 'lucide-react';

interface HeaderProps {
  onSettingsClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onSettingsClick }) => {
  return (
    <header className="bg-gray-800 border-b border-gray-700 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-600 rounded-lg">
            <Code className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">CodeVerter</h1>
            <p className="text-gray-400 text-sm">Programming Language Converter</p>
          </div>
        </div>
        <button
          onClick={onSettingsClick}
          className="flex items-center space-x-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors duration-200"
        >
          <Settings className="w-4 h-4 text-gray-300" />
          <span className="text-gray-300">Settings</span>
        </button>
      </div>
    </header>
  );
};