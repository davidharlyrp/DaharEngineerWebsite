import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

interface LineRevealProps {
  className?: string;
  delay?: number;
  direction?: 'left' | 'right' | 'center';
  color?: string;
}

export function LineReveal({ 
  className = '', 
  delay = 0,
  direction = 'left',
  color = 'bg-army-500'
}: LineRevealProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  const initialX = direction === 'left' ? '-100%' : direction === 'right' ? '100%' : '0%';
  const initialScaleX = direction === 'center' ? 0 : 1;

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.div
        initial={{ x: initialX, scaleX: initialScaleX }}
        animate={isInView ? { x: 0, scaleX: 1 } : {}}
        transition={{
          duration: 0.8,
          delay,
          ease: [0.16, 1, 0.3, 1],
        }}
        className={`h-px ${color}`}
        style={{ transformOrigin: direction === 'center' ? 'center' : 'left' }}
      />
    </div>
  );
}
