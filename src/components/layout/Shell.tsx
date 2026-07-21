import { ReactNode } from 'react';
import { useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { CustomCursor } from '../ui/custom-cursor';
export function Shell({ children }: { children: ReactNode }) {
  const [location] = useLocation();

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background text-foreground overflow-x-hidden relative selection:bg-primary/30">
      <CustomCursor />
      <Navbar />
      
      {/* AnimatePresence for Page Transitions */}
      <AnimatePresence mode="wait">
        <motion.main 
          key={location}
          initial={{ opacity: 0, scale: 0.98, filter: 'blur(10px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          exit={{ opacity: 0, scale: 1.02, filter: 'blur(10px)' }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="flex-1 flex flex-col pt-20 relative z-10"
        >
          {children}
        </motion.main>
      </AnimatePresence>

      <Footer />

      {/* Global CSS for custom scrollbar and text selection */}
      <style dangerouslySetInnerHTML={{__html: `
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        ::-webkit-scrollbar-track {
          background: hsl(var(--background));
        }
        ::-webkit-scrollbar-thumb {
          background: hsl(var(--muted));
          border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: hsl(var(--primary) / 0.5);
        }
      `}} />
    </div>
  );
}
