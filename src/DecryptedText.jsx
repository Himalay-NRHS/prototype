import { useState, useEffect, useRef } from 'react';

const DecryptedText = ({
  text,
  speed = 50,
  maxIterations = 10,
  characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*',
  className = '',
  parentClassName = '',
  encryptedClassName = '',
  animateOn = 'view', // 'hover' or 'view'
  revealDirection = 'start', // 'start', 'end', 'center'
  loop = false, // Enable looping
  pauseDuration = 5000 // Pause duration in ms before restarting
}) => {
  const [displayText, setDisplayText] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const elementRef = useRef(null);
  const intervalRef = useRef(null);
  const timeoutRef = useRef(null);

  const getRandomChar = () => {
    return characters[Math.floor(Math.random() * characters.length)];
  };

  const decryptText = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    const textLength = text.length;
    let iteration = 0;

    clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setDisplayText(
        text
          .split('')
          .map((char, index) => {
            // Determine reveal order based on direction
            let revealThreshold;
            if (revealDirection === 'center') {
              const center = textLength / 2;
              const distance = Math.abs(index - center);
              revealThreshold = textLength / 2 - distance;
            } else if (revealDirection === 'end') {
              revealThreshold = textLength - index;
            } else {
              revealThreshold = index;
            }

            if (iteration > revealThreshold) {
              return char;
            }
            return char === ' ' ? ' ' : getRandomChar();
          })
          .join('')
      );

      iteration += 1 / maxIterations;

      if (iteration >= textLength) {
        clearInterval(intervalRef.current);
        setDisplayText(text);
        setIsAnimating(false);
        
        if (loop) {
          // Wait for pauseDuration, then vanish and restart
          timeoutRef.current = setTimeout(() => {
            setDisplayText('');
            setTimeout(() => {
              decryptText();
            }, 500); // Brief pause after vanishing
          }, pauseDuration);
        } else if (animateOn === 'view') {
          setHasAnimated(true);
        }
      }
    }, speed);
  };

  useEffect(() => {
    if (animateOn === 'view') {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && !hasAnimated) {
              decryptText();
            }
          });
        },
        { threshold: 0.1 }
      );

      if (elementRef.current) {
        observer.observe(elementRef.current);
      }

      return () => {
        if (elementRef.current) {
          observer.unobserve(elementRef.current);
        }
        clearInterval(intervalRef.current);
        clearTimeout(timeoutRef.current);
      };
    }

    return () => {
      clearInterval(intervalRef.current);
      clearTimeout(timeoutRef.current);
    };
  }, [animateOn, hasAnimated, loop]);

  const handleMouseEnter = () => {
    if (animateOn === 'hover') {
      decryptText();
    }
  };

  return (
    <span
      ref={elementRef}
      className={`${parentClassName} ${isAnimating ? encryptedClassName : className}`}
      onMouseEnter={handleMouseEnter}
      style={{ display: 'inline-block' }}
    >
      {displayText}
    </span>
  );
};

export default DecryptedText;
