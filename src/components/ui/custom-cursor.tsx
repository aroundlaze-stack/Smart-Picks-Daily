import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [ringPosition, setRingPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    // Check if mobile device
    const checkMobile = () => {
      setIsMobile(window.matchMedia('(max-width: 768px)').matches || ('ontouchstart' in window));
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);

    const onMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    if (!isMobile) {
      window.addEventListener('mousemove', onMouseMove);
    }

    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, [isMobile]);

  // Lerp for the ring
  useEffect(() => {
    if (isMobile) return;
    
    let animationFrameId: number;
    
    const render = () => {
      setRingPosition((prev) => ({
        x: prev.x + (mousePosition.x - prev.x) * 0.15,
        y: prev.y + (mousePosition.y - prev.y) * 0.15,
      }));
      animationFrameId = requestAnimationFrame(render);
    };
    
    render();
    return () => cancelAnimationFrame(animationFrameId);
  }, [mousePosition, isMobile]);

  // Detect hover on clickable elements
  useEffect(() => {
    if (isMobile) return;

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('a, button, input, textarea, select, [role="button"]')) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mouseover', handleMouseOver);
    return () => window.removeEventListener('mouseover', handleMouseOver);
  }, [isMobile]);

  if (isMobile) return null;

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 bg-primary rounded-full pointer-events-none z-[9999] mix-blend-screen shadow-[0_0_10px_rgba(79,140,255,0.8)]"
        animate={{
          x: mousePosition.x - 4,
          y: mousePosition.y - 4,
          scale: isHovering ? 0 : 1,
        }}
        transition={{ type: 'tween', ease: 'backOut', duration: 0 }}
      />
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 border-2 border-primary/50 rounded-full pointer-events-none z-[9998] mix-blend-screen"
        animate={{
          x: ringPosition.x - 16,
          y: ringPosition.y - 16,
          scale: isHovering ? 1.5 : 1,
          borderColor: isHovering ? 'rgba(79,140,255,1)' : 'rgba(79,140,255,0.5)',
          backgroundColor: isHovering ? 'rgba(79,140,255,0.1)' : 'transparent',
        }}
        transition={{ type: 'tween', ease: 'backOut', duration: 0 }}
      />
    </>
  );
}
