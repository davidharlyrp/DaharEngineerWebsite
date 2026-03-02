import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

interface FixedHeroProps {
  children: React.ReactNode;
  className?: string;
}

export function FixedHero({ children, className = '' }: FixedHeroProps) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start']
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.5, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.05, 1.1]);
  const y = useTransform(scrollYProgress, [0, 1], [0, 100]);

  return (
    <div ref={ref} className="relative h-screen">
      <motion.div
        style={{ opacity, scale, y }}
        className={`
          fixed inset-0 flex items-center justify-center
          ${className}
        `}
      >
        {children}
      </motion.div>
    </div>
  );
}
