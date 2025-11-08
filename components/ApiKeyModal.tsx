// FIX: Switched to default import for React to resolve widespread JSX typing errors.
import React from 'react';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectKey: () => void;
}

const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onClose, onSelectKey }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex justify-center items-center backdrop-blur-md">
      <div className="bg-brand-night rounded-2xl border border-brand-graphite shadow-2xl p-8 max-w-md w-full mx-4 animate-slide-up">
        <h2 className="text-2xl font-bold font-serif mb-4 text-brand-ivory">API Key Required for Video</h2>
        <p className="text-brand-silver mb-6">
          To generate a video with Veo, you need to select a personal API key. 
          This is a necessary step for this feature.
          Your key will be used for this session only.
        </p>
        <p className="text-sm text-brand-silver mb-6">
            For more on billing, please see the{' '}
            <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="text-brand-champagne hover:text-brand-champagne-dark hover:underline font-semibold">
            official documentation
            </a>.
        </p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg text-brand-ivory bg-brand-graphite hover:bg-opacity-80 transition-colors font-semibold"
          >
            Cancel
          </button>
          <button
            onClick={onSelectKey}
            className="px-5 py-2 rounded-lg text-brand-charcoal bg-brand-champagne hover:brightness-110 transition-colors font-semibold"
          >
            Select API Key
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApiKeyModal;