// FIX: Switched to default import for React to resolve widespread JSX typing errors.
import React from 'react';
import type { UserProfile } from '../types';

interface ProfilingStepProps {
  userImage: string;
  onSubmit: (profile: UserProfile) => void;
  initialProfile?: Partial<UserProfile>;
}

const ProfilingStep: React.FC<ProfilingStepProps> = ({ userImage, onSubmit, initialProfile }) => {
  const [profile, setProfile] = React.useState<UserProfile>({
    occasion: '',
    vibe: '',
    colorsOrMaterials: '',
    styleInspirations: '',
    budget: 'Affordable',
    ...initialProfile,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(profile);
  };

  const inputClass = "w-full bg-brand-charcoal p-3 border border-brand-graphite rounded-lg shadow-inner focus:ring-1 focus:ring-brand-champagne focus:outline-none focus:border-brand-champagne transition duration-300 text-brand-ivory placeholder-brand-silver/50";

  return (
    <div className="w-full max-w-4xl bg-brand-night p-8 rounded-2xl border border-brand-graphite/50 shadow-sm animate-slide-up">
      <h2 className="text-4xl font-serif font-bold mb-6 text-center text-brand-ivory">Define Your Style</h2>
      <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
        <div className="md:w-1/3 flex-shrink-0">
          <img src={userImage} alt="Your submission" className="rounded-lg shadow-md object-cover w-full h-full max-h-96 md:max-h-full" />
        </div>
        <form onSubmit={handleSubmit} className="md:w-2/3 space-y-6">
          <div>
            <label htmlFor="occasion" className="block text-sm font-medium text-brand-silver mb-1">What’s the occasion or purpose?</label>
            <input type="text" name="occasion" id="occasion" value={profile.occasion} onChange={handleChange} placeholder="e.g., Casual day, business event, photoshoot" required className={inputClass} />
          </div>
          <div>
            <label htmlFor="vibe" className="block text-sm font-medium text-brand-silver mb-1">What vibe are you going for?</label>
            <input type="text" name="vibe" id="vibe" value={profile.vibe} onChange={handleChange} placeholder="e.g., Elegant, edgy, relaxed, bold, minimal" required className={inputClass} />
          </div>
          <div>
            <label htmlFor="colorsOrMaterials" className="block text-sm font-medium text-brand-silver mb-1">Any preferred colors or materials?</label>
            <input type="text" name="colorsOrMaterials" id="colorsOrMaterials" value={profile.colorsOrMaterials} onChange={handleChange} placeholder="e.g., Neutral tones, silk, denim" className={inputClass} />
          </div>
          <div>
            <label htmlFor="styleInspirations" className="block text-sm font-medium text-brand-silver mb-1">Style inspirations you admire?</label>
            <input type="text" name="styleInspirations" id="styleInspirations" value={profile.styleInspirations} onChange={handleChange} placeholder="e.g., Zendaya, classic Chanel" className={inputClass} />
          </div>
          <div>
            <label htmlFor="budget" className="block text-sm font-medium text-brand-silver mb-1">Budget preference?</label>
            <select name="budget" id="budget" value={profile.budget} onChange={handleChange} required className={inputClass}>
              <option>Affordable</option>
              <option>Mid-range</option>
              <option>Luxury</option>
            </select>
          </div>
          <button type="submit" className="w-full bg-brand-champagne text-brand-charcoal font-bold py-3 px-4 rounded-lg hover:brightness-110 transition-all duration-300 shadow-md shadow-brand-champagne/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-night focus:ring-brand-champagne transform hover:-translate-y-0.5">
            Generate My Looks
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfilingStep;