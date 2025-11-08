// FIX: Switched to default import for React to resolve widespread JSX typing errors.
import React from 'react';
import { AppStep, UserProfile, GeneratedLook, StyleSuggestion } from './types';
import Header from './components/Header';
import IntroductionStep from './components/IntroductionStep';
import EventStep from './components/EventStep';
import SuggestionStep from './components/SuggestionStep';
import ProfilingStep from './components/ProfilingStep';
import GenerationStep from './components/GenerationStep';
import ResultsStep from './components/ResultsStep';
import * as geminiService from './services/geminiService';

const App: React.FC = () => {
  // FIX: Start at Introduction step as API key is handled by environment variables.
  const [step, setStep] = React.useState<AppStep>(AppStep.Introduction);
  const [userImage, setUserImage] = React.useState<string | null>(null);
  const [occasion, setOccasion] = React.useState<string>('');
  const [initialProfile, setInitialProfile] = React.useState<Partial<UserProfile> | null>(null);
  const [styleSuggestions, setStyleSuggestions] = React.useState<StyleSuggestion[]>([]);
  const [generatedLooks, setGeneratedLooks] = React.useState<GeneratedLook[]>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = React.useState<string>('');
  const [error, setError] = React.useState<string | null>(null);

  // FIX: Removed all API key handling logic from the UI to comply with guidelines.
  // The API key is now managed via environment variables in the geminiService.
  
  const handleApiError = (err: unknown) => {
    console.error(err);
    const errMessage = (err as Error).message || '';
    if (errMessage.toLowerCase().includes('api key') || errMessage.toLowerCase().includes('permission denied') || errMessage.includes('429') || errMessage.includes('quota')) {
         setError('Your API key seems to be invalid or has exceeded its quota. Please check your key and billing details.');
         // FIX: Resetting to introduction step since API key management is removed.
         handleReset();
    } else {
        setError('An unexpected error occurred. Please try again.');
        handleReset();
    }
  };

  const handleImageUpload = React.useCallback((imageBase64: string) => {
    setUserImage(imageBase64);
    setStep(AppStep.Event);
    setError(null);
  }, []);
  
  const handleEventSubmit = React.useCallback(async (eventOccasion: string) => {
    if (!userImage) {
      setError('An image is required to proceed.');
      setStep(AppStep.Introduction);
      return;
    }
    setOccasion(eventOccasion);
    setStep(AppStep.Suggestion);
    setIsLoading(true);
    setError(null);
    setLoadingMessage('Analyzing your photo for style suggestions...');
    
    try {
      const suggestions = await geminiService.getStyleSuggestions(userImage, eventOccasion);
      setStyleSuggestions(suggestions);
    } catch (err) {
      handleApiError(err);
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  }, [userImage]);

  const handleSuggestionSelect = (suggestion: StyleSuggestion) => {
    setInitialProfile({ ...suggestion.keywords, occasion });
    setStep(AppStep.Profiling);
  };

  const handleSkipSuggestions = () => {
    setInitialProfile({ occasion });
    setStep(AppStep.Profiling);
  };

  const handleProfileSubmit = React.useCallback(async (profile: UserProfile) => {
    if (!userImage) {
      setError('An image is required to proceed.');
      return;
    }
    setStep(AppStep.Generating);
    setIsLoading(true);
    setError(null);

    try {
      setLoadingMessage('Analyzing your style profile...');
      const outfitIdeas = await geminiService.getOutfitIdeas(userImage, profile);

      setLoadingMessage('Virtually trying on your new looks...');
      const [header, base64Data] = userImage.split(',');
      const mimeType = header.match(/:(.*?);/)?.[1] || 'image/jpeg';
      
      const looks: GeneratedLook[] = await Promise.all(
        outfitIdeas.map(async (idea) => {
          const editedImageBase64 = await geminiService.editImage(base64Data, mimeType, idea.editPrompt);
          return {
            ...idea,
            imageUrl: `data:image/jpeg;base64,${editedImageBase64}`,
          };
        })
      );
      
      setGeneratedLooks(looks);
      setStep(AppStep.Results);
    } catch (err) {
      handleApiError(err);
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  }, [userImage]);

  const handleReset = () => {
    setStep(AppStep.Introduction);
    setUserImage(null);
    setOccasion('');
    setInitialProfile(null);
    setStyleSuggestions([]);
    setGeneratedLooks([]);
    setError(null);
  };

  const renderStep = () => {
    switch (step) {
      case AppStep.Introduction:
        return <IntroductionStep onImageUpload={handleImageUpload} />;
      case AppStep.Event:
        return <EventStep onSubmit={handleEventSubmit} />;
      case AppStep.Suggestion:
        return isLoading ? 
          <GenerationStep message={loadingMessage} /> : 
          <SuggestionStep suggestions={styleSuggestions} onSelect={handleSuggestionSelect} onSkip={handleSkipSuggestions} />;
      case AppStep.Profiling:
        return userImage && <ProfilingStep userImage={userImage} onSubmit={handleProfileSubmit} initialProfile={initialProfile || { occasion }} />;
      case AppStep.Generating:
        return <GenerationStep message={loadingMessage} />;
      case AppStep.Results:
        return <ResultsStep looks={generatedLooks} onReset={handleReset} />;
      default:
        // FIX: Default to Introduction step as API Key step is removed.
        return <IntroductionStep onImageUpload={handleImageUpload} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* FIX: Removed API key management UI. */}
      <Header />
      <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8 flex flex-col items-center justify-center">
        {error && (
          <div className="bg-red-900/50 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg relative mb-6 w-full max-w-2xl text-center shadow-lg" role="alert">
            <strong className="font-semibold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        {renderStep()}
      </main>
    </div>
  );
};

export default App;