import { easeInOut, motion } from 'framer-motion';
import { useMenu } from '@/context/MenuContext';
import { Header } from './Header';
import { MenuOverlay } from './MenuOverlay';
import { Footer } from './Footer';

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
          scaleX: isOpen ? 1 : 1,
          scaleY: isOpen ? 1 : 1,
          borderRadius: isOpen ? '24px' : '0px',
          opacity: isOpen ? 0.5 : 1,
        }}
        transition={{
          duration: 0.7,
          ease: easeInOut,
        }}
        className={`
          relative min-h-screen bg-background overflow-hidden
          transition-all origin-center
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

        {/* Footer */}
        {!isOpen && (
          <div className="relative z-10">
            <Footer />
          </div>
        )}
      </motion.main>
    </div>
  );
}
