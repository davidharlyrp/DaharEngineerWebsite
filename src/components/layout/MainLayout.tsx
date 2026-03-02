import { motion } from 'framer-motion';
import { useMenu } from '@/context/MenuContext';
import { Header } from './Header';
import { MenuOverlay } from './MenuOverlay';

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const { isOpen } = useMenu();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header />

      {/* Menu Overlay */}
      <MenuOverlay />

      {/* Main content with scale effect */}
      <motion.main
        animate={{
          scale: isOpen ? 0.85 : 1,
          borderRadius: isOpen ? '24px' : '0px',
          opacity: isOpen ? 0.5 : 1,
        }}
        transition={{
          duration: 0.7,
          ease: [0.16, 1, 0.3, 1],
        }}
        className={`
          relative min-h-screen bg-background overflow-hidden
          transition-layout origin-center
          ${isOpen ? 'pointer-events-none' : ''}
        `}
        style={{
          transformOrigin: 'center center',
        }}
      >
        {/* Content wrapper */}
        <div className="relative">
          {children}
        </div>
      </motion.main>
    </div>
  );
}
