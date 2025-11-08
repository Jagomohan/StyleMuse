// FIX: Switched to default import for React to resolve widespread JSX typing errors.
import React from 'react';
import type { GeneratedLook, AccessorySuggestion } from '../types';
import * as geminiService from '../services/geminiService';
import Spinner from './Spinner';

interface ResultsStepProps {
  looks: GeneratedLook[];
  onReset: () => void;
}

const ResultsStep: React.FC<ResultsStepProps> = ({ looks, onReset }) => {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [isEditing, setIsEditing] = React.useState(false);
  const [editPrompt, setEditPrompt] = React.useState('');
  const [editedImages, setEditedImages] = React.useState<{ [key: number]: string }>({});
  const [isLoading, setIsLoading] = React.useState<{ [key: string]: boolean }>({});
  
  const [activeAction, setActiveAction] = React.useState<'accessories' | null>(null);
  const [actionIsLoading, setActionIsLoading] = React.useState(false);
  const [accessorySuggestions, setAccessorySuggestions] = React.useState<AccessorySuggestion[] | null>(null);

  const currentLook = looks[currentIndex];
  const displayImage = editedImages[currentIndex] || currentLook.imageUrl;

  const resetActions = () => {
    setActiveAction(null);
    setActionIsLoading(false);
    setAccessorySuggestions(null);
    setIsEditing(false);
    setEditPrompt('');
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? looks.length - 1 : prev - 1));
    resetActions();
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === looks.length - 1 ? 0 : prev + 1));
    resetActions();
  };
  
  const handleEditImage = async () => {
    if (!editPrompt) return;
    const key = `edit-${currentIndex}`;
    setIsLoading(prev => ({ ...prev, [key]: true }));
    setIsEditing(false);

    try {
        const [header, base64Data] = displayImage.split(',');
        const mimeType = header.match(/:(.*?);/)?.[1] || 'image/jpeg';
        const newImageBase64 = await geminiService.editImage(base64Data, mimeType, editPrompt);
        setEditedImages(prev => ({ ...prev, [currentIndex]: `data:image/jpeg;base64,${newImageBase64}` }));
        setEditPrompt('');
    } catch (error) {
        console.error("Failed to edit image:", error);
        alert("Sorry, we couldn't edit the image. Please try again.");
    } finally {
        setIsLoading(prev => ({ ...prev, [key]: false }));
    }
  };

  const handleSuggestAccessories = async () => {
    resetActions();
    setActiveAction('accessories');
    setActionIsLoading(true);
    try {
        const results = await geminiService.getAccessorySuggestions(currentLook.name, currentLook.explanation);
        setAccessorySuggestions(results);
    } catch (error) {
        console.error("Failed to get accessory suggestions:", error);
        alert("Sorry, we couldn't get accessory suggestions. Please try again.");
        resetActions();
    } finally {
        setActionIsLoading(false);
    }
  };

  if (!looks.length) {
    return (
      <div className="text-center">
        <p>No looks were generated. Please try again.</p>
        <button onClick={onReset} className="mt-4 bg-brand-champagne text-brand-charcoal font-bold py-2 px-4 rounded-lg hover:brightness-110 transition-colors">Start Over</button>
      </div>
    );
  }
  
  const inputClass = "w-full bg-brand-charcoal p-3 border border-brand-graphite rounded-lg shadow-inner focus:ring-1 focus:ring-brand-champagne focus:outline-none focus:border-brand-champagne transition duration-300 text-brand-ivory placeholder-brand-silver/50";
  const actionButtonClass = "flex-1 bg-transparent border border-brand-graphite text-brand-silver font-semibold py-2 px-4 rounded-lg hover:bg-brand-graphite hover:text-brand-ivory transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-night focus:ring-brand-champagne disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <div className="w-full max-w-6xl animate-slide-up">
        <div className="bg-brand-night p-6 sm:p-8 rounded-2xl border border-brand-graphite/50 shadow-sm">
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
                <div className="lg:w-1/2 relative flex items-center justify-center">
                    <div className="relative w-full aspect-[9/16] max-w-sm mx-auto overflow-hidden rounded-lg shadow-lg shadow-brand-champagne/10">
                        <img src={displayImage} alt={currentLook.name} className="absolute inset-0 object-cover w-full h-full" />
                        {(isLoading[`edit-${currentIndex}`]) && (
                            <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center rounded-lg">
                                <Spinner />
                                <p className="text-white mt-2">Refining your look...</p>
                            </div>
                        )}
                        <div className="absolute top-1/2 -translate-y-1/2 w-full flex justify-between px-2">
                             <button onClick={handlePrev} className="bg-brand-night/50 hover:bg-brand-night/80 backdrop-blur-sm text-brand-ivory rounded-full w-12 h-12 flex items-center justify-center transition-all duration-300 shadow">&larr;</button>
                             <button onClick={handleNext} className="bg-brand-night/50 hover:bg-brand-night/80 backdrop-blur-sm text-brand-ivory rounded-full w-12 h-12 flex items-center justify-center transition-all duration-300 shadow">&rarr;</button>
                        </div>
                    </div>
                </div>

                <div className="lg:w-1/2 flex flex-col">
                    <div className="flex-grow">
                        <div className="flex justify-between items-start mb-4">
                            <h2 className="text-4xl md:text-5xl font-serif font-bold text-brand-ivory leading-tight">{currentLook.name}</h2>
                            <span className="text-lg font-medium text-brand-silver pt-2">{currentIndex + 1} / {looks.length}</span>
                        </div>
                        <h3 className="font-sans font-semibold text-brand-silver mb-4 text-lg border-b border-brand-graphite pb-2">Stylist's Notes</h3>
                        <p className="text-base text-brand-ivory/90 leading-relaxed mb-6 whitespace-pre-line">{currentLook.explanation}</p>
                    </div>

                    <div className="space-y-4 mt-auto border-t border-brand-graphite pt-6">
                        <h3 className="font-sans font-semibold text-brand-silver text-lg">Actions</h3>
                        <div className="flex gap-2">
                            <button onClick={() => setIsEditing(true)} disabled={isEditing} className={actionButtonClass}>Refine Look</button>
                            <button onClick={handleSuggestAccessories} disabled={actionIsLoading} className={actionButtonClass}>Accessorize</button>
                        </div>
                        
                        {isEditing && (
                            <div className="flex gap-2 pt-2 animate-fade-in">
                                <input type="text" value={editPrompt} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditPrompt(e.target.value)} placeholder="e.g., Change the jacket to red" className={inputClass} autoFocus />
                                <button onClick={handleEditImage} className="bg-brand-champagne text-brand-charcoal font-bold py-2 px-4 rounded-md hover:bg-brand-champagne-dark transition-colors">Apply</button>
                                <button onClick={() => setIsEditing(false)} className="bg-brand-graphite text-brand-ivory py-2 px-4 rounded-md hover:bg-opacity-80 transition-colors">Cancel</button>
                            </div>
                        )}
                        
                        <div className="mt-4 min-h-[150px] bg-brand-charcoal/50 p-4 rounded-lg relative">
                            {activeAction && !actionIsLoading && (
                                <button
                                    onClick={resetActions}
                                    className="absolute top-3 right-3 text-brand-silver hover:text-brand-ivory transition-colors z-10"
                                    aria-label="Close"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        {/* Fix: Use correct camelCase for SVG attributes */}
                                        {/* FIX: Corrected camelCase for SVG props from strokeLineCap/strokeLineJoin to strokeLinecap/strokeLinejoin. */}
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            )}
                            
                            {actionIsLoading && (
                                <div className="flex flex-col items-center justify-center h-full">
                                    <Spinner />
                                    <p className="text-brand-silver mt-2">
                                        Finding accessories...
                                    </p>
                                </div>
                            )}

                             {!activeAction && !actionIsLoading && (
                                <div className="flex items-center justify-center h-full">
                                    <p className="text-brand-silver">Select an action above to see results.</p>
                                </div>
                            )}

                            {activeAction === 'accessories' && accessorySuggestions && (
                                <div className="animate-fade-in space-y-3">
                                    <h4 className="font-bold text-brand-ivory text-lg pr-8">Accessory Suggestions</h4>
                                    <ul className="space-y-2 text-brand-silver max-h-64 overflow-y-auto pr-2">
                                        {accessorySuggestions.map((item, index) => (
                                            <li key={index} className="p-2 bg-brand-charcoal rounded-md">
                                                <p className="font-semibold text-brand-ivory">{item.name}</p>
                                                <p className="text-sm">{item.description}</p>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div className="text-center mt-8">
            <button onClick={onReset} className="text-brand-silver hover:text-brand-ivory font-semibold transition-colors duration-300">Start Another Occasion</button>
        </div>
    </div>
  );
};

export default ResultsStep;