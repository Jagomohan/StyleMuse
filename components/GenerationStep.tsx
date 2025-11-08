// FIX: Switched to default import for React to resolve widespread JSX typing errors.
import React from 'react';
import Spinner from './Spinner';

interface GenerationStepProps {
  message: string;
}

const messages = [
  'Consulting with fashion archives...',
  'Sketching out new designs...',
  'Matching colors and textures...',
  'Tailoring the perfect fit...',
  'Finalizing your lookbook...'
];

const GenerationStep: React.FC<GenerationStepProps> = ({ message }) => {
    const [currentMessage, setCurrentMessage] = React.useState(messages[0]);

    React.useEffect(() => {
        let index = 0;
        const interval = setInterval(() => {
            index = (index + 1) % messages.length;
            setCurrentMessage(messages[index]);
        }, 3000);

        return () => clearInterval(interval);
    }, []);

  return (
    <div className="w-full max-w-2xl text-center bg-brand-night p-12 rounded-2xl animate-slide-up">
      <h2 className="text-3xl font-serif font-bold mb-4 text-brand-ivory">Curating Your Style...</h2>
      <Spinner />
      <p className="text-lg text-brand-silver mt-6 font-sans transition-opacity duration-500">
        {message || currentMessage}
      </p>
    </div>
  );
};

export default GenerationStep;