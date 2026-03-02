import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

interface FullScreenSectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  bgImage?: string;
}

export function FullScreenSection({ 
  children, 
  className = '', 
  id,
  bgImage 
}: FullScreenSectionProps) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start']
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.95, 1, 1, 0.95]);
  const y = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [50, 0, 0, -50]);

  return (
    <motion.section
      ref={ref}
      id={id}
      style={{ opacity, scale, y }}
      className={`
        section-fullscreen relative flex items-center
        ${className}
      `}
    >
      {/* Background image */}
      {bgImage && (
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${bgImage})` }}
        >
          <div className="absolute inset-0 bg-background/80" />
        </div>
      )}
      
      {/* Content */}
      <div className="relative z-10 w-full">
        {children}
      </div>
    </motion.section>
  );
}
