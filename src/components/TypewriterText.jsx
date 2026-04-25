import { useState, useEffect } from 'react';

function TypewriterText() {
  const fullText = 'Master new skills with interactive tutorials';
  const [displayedText, setDisplayedText] = useState('');
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [showCursor, setShowCursor] = useState(true);

  // Add character one by one
  useEffect(() => {
    if (currentCharIndex < fullText.length) {
      const timer = setTimeout(() => {
        setDisplayedText(fullText.slice(0, currentCharIndex + 1));
        setCurrentCharIndex(currentCharIndex + 1);
      }, 80); // Speed of typing - adjust for faster/slower
      return () => clearTimeout(timer);
    }
  }, [currentCharIndex, fullText]);

  // Blinking cursor animation
  useEffect(() => {
    const cursorTimer = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 530);
    return () => clearInterval(cursorTimer);
  }, []);

  return (
    <div className="min-h-24 flex items-center justify-center">
      <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white text-center">
        {displayedText}
        <span className={`inline-block ml-1 text-primary-600 dark:text-primary-400 transition-opacity duration-100 ${showCursor ? 'opacity-100' : 'opacity-0'}`}>
          |
        </span>
      </h1>
    </div>
  );
}

export default TypewriterText;
