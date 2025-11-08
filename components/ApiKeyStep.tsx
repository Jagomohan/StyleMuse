// FIX: Switched to default import for React to resolve widespread JSX typing errors.
import React from 'react';

interface ApiKeyStepProps {
  onSubmit: (apiKey: string) => void;
}

const ApiKeyStep: React.FC<ApiKeyStepProps> = ({ onSubmit }) => {
  const [apiKey, setApiKey] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim()) {
      onSubmit(apiKey.trim());
    }
  };

  const inputClass = "w-full bg-brand-charcoal p-4 border border-brand-graphite rounded-lg shadow-inner focus:ring-1 focus:ring-brand-champagne focus:outline-none focus:border-brand-champagne transition duration-300 text-lg text-brand-ivory placeholder-brand-silver/50";
  const buttonClass = "w-full bg-brand-champagne text-brand-charcoal font-bold py-3 px-4 rounded-lg hover:brightness-110 transition-all duration-300 shadow-md shadow-brand-champagne/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-night focus:ring-brand-champagne transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:brightness-100 disabled:transform-none";

  return (
    <div className="w-full max-w-2xl text-center bg-brand-night p-8 sm:p-12 rounded-2xl animate-slide-up">
      <h2 className="text-4xl font-serif font-bold mb-3 text-brand-ivory">Enter Your Gemini API Key</h2>
      <p className="text-lg text-brand-silver mb-8 font-sans">
        To use StyleMuse, please provide your own Google Gemini API key. Your key is stored locally in your browser and is never sent to our servers.
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <input 
          type="password" 
          value={apiKey}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setApiKey(e.target.value)} 
          placeholder="Enter your API key here" 
          required 
          className={inputClass}
          autoFocus
        />
        
        <button type="submit" className={buttonClass} disabled={!apiKey.trim()}>
          Save and Start Styling
        </button>
      </form>
      <p className="text-sm text-brand-silver mt-6">
        Don't have a key? Get one from{' '}
        <a href="https://ai.google.dev/gemini-api/docs/api-key" target="_blank" rel="noopener noreferrer" className="text-brand-champagne hover:text-brand-champagne-dark hover:underline font-semibold">
          Google AI Studio
        </a>.
      </p>
    </div>
  );
};

export default ApiKeyStep;