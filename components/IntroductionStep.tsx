// FIX: Switched to default import for React to resolve widespread JSX typing errors.
import React from 'react';

interface IntroductionStepProps {
  onImageUpload: (imageBase64: string) => void;
}

const IntroductionStep: React.FC<IntroductionStepProps> = ({ onImageUpload }) => {
  const [isDragging, setIsDragging] = React.useState(false);

  const handleFileChange = React.useCallback((files: FileList | null) => {
    if (files && files[0]) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          onImageUpload(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        alert('Please upload a valid image file.');
      }
    }
  }, [onImageUpload]);

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleFileChange(e.dataTransfer.files);
  };

  return (
    <div className="w-full max-w-2xl text-center bg-brand-night p-8 sm:p-12 rounded-2xl animate-slide-up">
      <h2 className="text-4xl font-serif font-bold mb-3 text-brand-ivory">Your Personal Stylist, Reimagined</h2>
      <p className="text-lg text-brand-silver mb-8 font-sans">Begin your style transformation. Upload a clear, full-body photo to start.</p>
      
      <div 
        className={`border-2 border-dashed rounded-lg p-10 transition-colors duration-300 ${isDragging ? 'border-brand-champagne bg-brand-charcoal' : 'border-brand-graphite bg-brand-charcoal'}`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <input
          type="file"
          id="file-upload"
          className="hidden"
          accept="image/*"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFileChange(e.target.files)}
        />
        <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
            <svg className="w-12 h-12 text-brand-silver mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                {/* Fix: Use correct camelCase for SVG attributes */}
                {/* FIX: Corrected camelCase for SVG props from strokeLineCap/strokeLineJoin to strokeLinecap/strokeLinejoin. */}
                <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
            </svg>
          <p className="text-brand-ivory font-medium text-base">
            <span className="font-semibold text-brand-champagne-dark">Click to upload</span> or drag and drop
          </p>
          <p className="text-sm text-brand-silver mt-1">PNG, JPG, or WEBP. Max 10MB.</p>
        </label>
      </div>
    </div>
  );
};

export default IntroductionStep;