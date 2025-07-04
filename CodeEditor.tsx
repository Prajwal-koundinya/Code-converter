import React from 'react';
import { Copy, Check } from 'lucide-react';
import { Language } from '../types';

interface CodeEditorProps {
  value: string;
  onChange?: (value: string) => void;
  language: Language | null;
  placeholder?: string;
  readOnly?: boolean;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  value,
  onChange,
  language,
  placeholder = 'Enter your code here...',
  readOnly = false
}) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-3 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center space-x-3">
          {language && (
            <>
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: language.color }}
              />
              <span className="text-white font-medium">{language.name}</span>
              <span className="text-gray-400 text-sm">.{language.extension}</span>
            </>
          )}
        </div>
        {value && (
          <button
            onClick={handleCopy}
            className="flex items-center space-x-2 px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-md transition-colors duration-200"
          >
            {copied ? (
              <Check className="w-4 h-4 text-green-400" />
            ) : (
              <Copy className="w-4 h-4 text-gray-400" />
            )}
            <span className="text-sm text-gray-300">
              {copied ? 'Copied!' : 'Copy'}
            </span>
          </button>
        )}
      </div>
      <div className="flex-1 relative">
        <textarea
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          readOnly={readOnly}
          className="w-full h-full p-4 bg-gray-900 text-white font-mono text-sm resize-none focus:outline-none placeholder-gray-500 leading-relaxed"
          style={{ minHeight: '400px' }}
        />
      </div>
    </div>
  );
};