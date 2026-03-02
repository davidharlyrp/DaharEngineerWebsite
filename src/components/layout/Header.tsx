import { motion } from 'framer-motion';
import { useMenu } from '@/context/MenuContext';
import { Link } from 'react-router-dom';

export function Header() {
  const { isOpen, toggle } = useMenu();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-6 lg:px-10 py-5">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="relative z-[110]">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-3"
          >
            <div className="w-8 h-8 flex items-center justify-center">
              <img src="/logo.png" alt="Dahar Engineer" />
            </div>
            <div className="hidden sm:block">
              <span className="text-lg font-semibold tracking-tight">DAHAR</span>
              <span className="text-lg font-light text-muted-foreground ml-1">ENGINEER</span>
            </div>
          </motion.div>
        </Link>

        {/* Hamburger button */}
        <motion.button
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          onClick={toggle}
          className={`
            relative z-[110] p-3 group
            transition-colors duration-300
            ${isOpen ? 'text-foreground' : 'text-foreground hover:text-army-400'}
          `}
          aria-label="Toggle menu"
        >
          <div className={`flex flex-col gap-1.5 ${isOpen ? 'hamburger-active' : ''}`}>
            <span className="hamburger-line w-6 h-0.5 bg-current block" />
            <span className="hamburger-line w-6 h-0.5 bg-current block" />
            <span className="hamburger-line w-4 h-0.5 bg-current block group-hover:w-6 transition-all duration-300" />
          </div>
        </motion.button>
      </div>
    </header>
  );
}
