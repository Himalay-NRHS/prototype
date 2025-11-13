// Component inspired by Tom Miller from the GSAP community
// https://codepen.io/creativeocean/pen/NPWLwJM
import { useEffect, useRef, useState } from 'react';

const ScrambledText = ({
  children,
  className = '',
  radius = 100,
  duration = 1.2,
  speed = 0.5,
  scrambleChars = '.:',
  loop = false,
  pauseDuration = 5000
}) => {
  const textRef = useRef(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const animationRef = useRef(null);
  const timeoutRef = useRef(null);

  const scrambleText = () => {
    if (!textRef.current || isAnimating) return;
    
    setIsAnimating(true);
    const element = textRef.current;
    const originalText = children;
    const chars = scrambleChars.split('');
    const textLength = originalText.length;
    
    let frame = 0;
    const totalFrames = duration * 60; // Assuming 60fps
    
    const animate = () => {
      frame++;
      const progress = frame / totalFrames;
      
      let scrambled = '';
      for (let i = 0; i < textLength; i++) {
        const charProgress = (i / textLength);
        const revealPoint = progress * (1 + speed) - charProgress * speed;
        
        if (revealPoint >= 1) {
          // Character is fully revealed
          scrambled += originalText[i];
        } else if (revealPoint > 0) {
          // Character is scrambling
          if (originalText[i] === ' ') {
            scrambled += ' ';
          } else {
            scrambled += chars[Math.floor(Math.random() * chars.length)];
          }
        } else {
          // Character hasn't started yet
          scrambled += originalText[i] === ' ' ? ' ' : chars[0];
        }
      }
      
      element.textContent = scrambled;
      
      if (frame < totalFrames) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        element.textContent = originalText;
        setIsAnimating(false);
        
        if (loop) {
          // Wait, then vanish and restart
          timeoutRef.current = setTimeout(() => {
            element.textContent = '';
            setTimeout(() => {
              frame = 0;
              scrambleText();
            }, 500);
          }, pauseDuration);
        }
      }
    };
    
    animationRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isAnimating) {
            scrambleText();
          }
        });
      },
      { threshold: 0.1 }
    );

    if (textRef.current) {
      observer.observe(textRef.current);
    }

    return () => {
      if (textRef.current) {
        observer.unobserve(textRef.current);
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <span ref={textRef} className={className}>
      {children}
    </span>
  );
};

export default ScrambledText;
