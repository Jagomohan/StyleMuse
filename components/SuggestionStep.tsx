// FIX: Switched to default import for React to resolve widespread JSX typing errors.
import React from 'react';
import type { StyleSuggestion } from '../types';

interface SuggestionStepProps {
  suggestions: StyleSuggestion[];
  onSelect: (suggestion: StyleSuggestion) => void;
  onSkip: () => void;
}

const SuggestionStep: React.FC<SuggestionStepProps> = ({ suggestions, onSelect, onSkip }) => {
  return (
    <div className="w-full max-w-4xl text-center bg-brand-night p-8 sm:p-12 rounded-2xl animate-slide-up">
      <h2 className="text-4xl font-serif font-bold mb-3 text-brand-ivory">A Few Style Directions...</h2>
      <p className="text-lg text-brand-silver mb-8 font-sans">Select a vibe to get started, or skip ahead to define your own.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {suggestions.map((suggestion, index) => (
          <div 
            key={index} 
            className="group cursor-pointer bg-brand-night rounded-lg border border-brand-graphite p-6 text-left transform hover:-translate-y-1 hover:shadow-xl hover:shadow-brand-champagne/10 transition-all duration-300 flex flex-col"
            onClick={() => onSelect(suggestion)}
          >
            <h3 className="font-serif text-xl font-bold text-brand-ivory mb-2 group-hover:text-brand-champagne transition-colors">{suggestion.name}</h3>
            <p className="text-sm text-brand-silver flex-grow">{suggestion.description}</p>
          </div>
        ))}
      </div>

      <button 
        onClick={onSkip} 
        className="w-full max-w-sm mx-auto bg-brand-champagne text-brand-charcoal font-bold py-3 px-4 rounded-lg hover:brightness-110 transition-all duration-300 shadow-md shadow-brand-champagne/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-night focus:ring-brand-champagne transform hover:-translate-y-0.5"
      >
        Or, Create My Own Style
      </button>
    </div>
  );
};

export default SuggestionStep;