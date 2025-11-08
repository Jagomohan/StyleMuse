// FIX: Switched to default import for React to resolve widespread JSX typing errors.
import React from 'react';

interface EventStepProps {
  onSubmit: (occasion: string) => void;
}

const EventStep: React.FC<EventStepProps> = ({ onSubmit }) => {
  const [occasion, setOccasion] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (occasion.trim()) {
      onSubmit(occasion.trim());
    }
  };
  
  const inputClass = "w-full bg-brand-charcoal p-4 border border-brand-graphite rounded-lg shadow-inner focus:ring-1 focus:ring-brand-champagne focus:outline-none focus:border-brand-champagne transition duration-300 text-lg text-brand-ivory placeholder-brand-silver/50";
  const buttonClass = "w-full bg-brand-champagne text-brand-charcoal font-bold py-3 px-4 rounded-lg hover:brightness-110 transition-all duration-300 shadow-md shadow-brand-champagne/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-night focus:ring-brand-champagne transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:brightness-100 disabled:transform-none";

  return (
    <div className="w-full max-w-2xl text-center bg-brand-night p-8 sm:p-12 rounded-2xl animate-slide-up">
      <h2 className="text-4xl font-serif font-bold mb-3 text-brand-ivory">What's the Occasion?</h2>
      <p className="text-lg text-brand-silver mb-8 font-sans">Tell us where you're going so we can tailor the perfect style for you.</p>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <input 
          type="text" 
          value={occasion}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setOccasion(e.target.value)} 
          placeholder="e.g., Weekend brunch with friends" 
          required 
          className={inputClass}
          list="occasion-suggestions"
          autoFocus
        />
        <datalist id="occasion-suggestions">
          <option value="Casual Day Out" />
          <option value="Business Meeting" />
          <option value="Date Night" />
          <option value="Formal Event / Gala" />
          <option value="Wedding Guest" />
          <option value="Vacation / Travel" />
        </datalist>

        <button type="submit" className={buttonClass} disabled={!occasion.trim()}>
          Get Style Suggestions
        </button>
      </form>
    </div>
  );
};

export default EventStep;