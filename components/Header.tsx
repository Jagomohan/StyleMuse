// FIX: Switched to default import for React to resolve widespread JSX typing errors.
import React from 'react';

// FIX: Removed onChangeApiKey prop as API key is now handled by environment variables.
interface HeaderProps {}

const Header: React.FC<HeaderProps> = () => {
  return (
    <header className="bg-brand-charcoal">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-center h-20">
          <h1 className="text-3xl sm:text-4xl font-serif font-semibold text-brand-ivory tracking-wide">
            Style<span className="text-brand-champagne">Muse</span>
          </h1>
          {/* FIX: Removed button to change API key to comply with guidelines. */}
        </div>
      </div>
    </header>
  );
};

export default Header;