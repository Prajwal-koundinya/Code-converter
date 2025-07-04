import React, { useState, useEffect } from 'react';
import { RefreshCw, AlertCircle } from 'lucide-react';
import { Header } from './components/Header';
import { LanguageDropdown } from './components/LanguageDropdown';
import { CodeEditor } from './components/CodeEditor';
import { SettingsModal } from './components/SettingsModal';
import { GeminiService } from './services/geminiService';
import { PROGRAMMING_LANGUAGES } from './constants/languages';
import { Language } from './types';

function App() {
  const [sourceLanguage, setSourceLanguage] = useState<Language | null>(null);
  const [targetLanguage, setTargetLanguage] = useState<Language | null>(null);
  const [sourceCode, setSourceCode] = useState('');
  const [convertedCode, setConvertedCode] = useState('');
  const [isConverting, setIsConverting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [geminiService, setGeminiService] = useState<GeminiService | null>(null);

  useEffect(() => {
    // Load API key from localStorage
    const savedApiKey = localStorage.getItem('gemini-api-key');
    if (savedApiKey) {
      setApiKey(savedApiKey);
      setGeminiService(new GeminiService(savedApiKey));
    }
  }, []);

  const handleApiKeyChange = (newApiKey: string) => {
    setApiKey(newApiKey);
    localStorage.setItem('gemini-api-key', newApiKey);
    setGeminiService(new GeminiService(newApiKey));
  };

  const handleConvertCode = async () => {
    if (!sourceLanguage || !targetLanguage || !sourceCode.trim()) {
      setError('Please select both languages and enter source code.');
      return;
    }

    if (!geminiService) {
      setError('Please set your Gemini API key in settings.');
      return;
    }

    setIsConverting(true);
    setError(null);

    try {
      const result = await geminiService.convertCode({
        sourceCode,
        sourceLanguage: sourceLanguage.name,
        targetLanguage: targetLanguage.name
      });

      if (result.error) {
        setError(result.error);
      } else {
        setConvertedCode(result.convertedCode);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during conversion');
    } finally {
      setIsConverting(false);
    }
  };

  const canConvert = sourceLanguage && targetLanguage && sourceCode.trim() && geminiService;

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <Header onSettingsClick={() => setIsSettingsOpen(true)} />
      
      <main className="flex-1 flex flex-col lg:flex-row gap-6 p-6">
        {/* Source Code Panel */}
        <div className="flex-1 flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">Source Code</h2>
            <div className="w-64">
              <LanguageDropdown
                languages={PROGRAMMING_LANGUAGES}
                selectedLanguage={sourceLanguage}
                onLanguageSelect={setSourceLanguage}
                placeholder="Select source language"
              />
            </div>
          </div>
          <div className="flex-1 bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
            <CodeEditor
              value={sourceCode}
              onChange={setSourceCode}
              language={sourceLanguage}
              placeholder="Enter your code here..."
            />
          </div>
        </div>

        {/* Convert Button */}
        <div className="flex lg:flex-col items-center justify-center lg:py-8">
          <button
            onClick={handleConvertCode}
            disabled={!canConvert || isConverting}
            className="flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors duration-200 font-medium"
          >
            <RefreshCw className={`w-5 h-5 ${isConverting ? 'animate-spin' : ''}`} />
            <span>{isConverting ? 'Converting...' : 'Convert Code'}</span>
          </button>
        </div>

        {/* Target Code Panel */}
        <div className="flex-1 flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">Converted Code</h2>
            <div className="w-64">
              <LanguageDropdown
                languages={PROGRAMMING_LANGUAGES}
                selectedLanguage={targetLanguage}
                onLanguageSelect={setTargetLanguage}
                placeholder="Select target language"
              />
            </div>
          </div>
          <div className="flex-1 bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
            <CodeEditor
              value={convertedCode}
              language={targetLanguage}
              placeholder="Converted code will appear here..."
              readOnly
            />
          </div>
        </div>
      </main>

      {/* Error Display */}
      {error && (
        <div className="mx-6 mb-6 p-4 bg-red-900 border border-red-700 rounded-lg flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-red-300 font-medium">Error</p>
            <p className="text-red-200 text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        apiKey={apiKey}
        onApiKeyChange={handleApiKeyChange}
      />
    </div>
  );
}

export default App;