import React from 'react';

interface LogoProps {
  size?: number;
  className?: string;
  showText?: boolean;
}

export const HavenLogo: React.FC<LogoProps> = ({ size = 36, className = '', showText = false }) => {
  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="transition-transform hover:scale-105 duration-300"
      >
        {/* Outer Circular Frame */}
        <circle cx="50" cy="50" r="46" stroke="#2E5B38" strokeWidth="5" fill="none" />
        
        {/* Rolling Green Hills at bottom */}
        <path
          d="M 6 70 Q 30 55, 50 68 T 94 70"
          stroke="#2E5B38"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
        />

        {/* Golden Sun Top Left */}
        <circle cx="36" cy="30" r="7" stroke="#D99B26" strokeWidth="3" fill="none" />
        {/* Sun Rays */}
        <line x1="36" y1="18" x2="36" y2="21" stroke="#D99B26" strokeWidth="3" strokeLinecap="round" />
        <line x1="36" y1="39" x2="36" y2="42" stroke="#D99B26" strokeWidth="3" strokeLinecap="round" />
        <line x1="24" y1="30" x2="27" y2="30" stroke="#D99B26" strokeWidth="3" strokeLinecap="round" />
        <line x1="45" y1="30" x2="48" y2="30" stroke="#D99B26" strokeWidth="3" strokeLinecap="round" />
        <line x1="28" y1="22" x2="30" y2="24" stroke="#D99B26" strokeWidth="3" strokeLinecap="round" />
        <line x1="42" y1="36" x2="44" y2="38" stroke="#D99B26" strokeWidth="3" strokeLinecap="round" />

        {/* Minimalist House Outline */}
        <path
          d="M 38 58 V 52 L 53 37 L 68 52 V 58"
          stroke="#2E5B38"
          strokeWidth="5"
          fill="none"
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {/* Golden Wheat / Leaf Stalk inside House */}
        <path
          d="M 50 64 C 50 56, 52 48, 59 43"
          stroke="#D99B26"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
        />
        {/* Leaf Grains */}
        <path d="M 50 60 C 53 58, 57 56, 58 52" stroke="#D99B26" strokeWidth="3.5" fill="none" strokeLinecap="round" />
        <path d="M 49 54 C 52 52, 55 49, 56 46" stroke="#D99B26" strokeWidth="3.5" fill="none" strokeLinecap="round" />
        <path d="M 54 48 C 57 46, 59 43, 58 40" stroke="#D99B26" strokeWidth="3.5" fill="none" strokeLinecap="round" />
      </svg>
      
      {showText && (
        <span className="font-bold text-2xl tracking-tight text-haven-700 dark:text-haven-200">
          Haven
        </span>
      )}
    </div>
  );
};
