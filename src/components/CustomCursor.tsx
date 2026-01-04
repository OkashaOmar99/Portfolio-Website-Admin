import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isPointer, setIsPointer] = useState(false);
  const [isHidden, setIsHidden] = useState(true);
  const [trail, setTrail] = useState<{ x: number; y: number; id: number }[]>([]);

  useEffect(() => {
    const updatePosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      setIsHidden(false);

      setTrail((prev) => {
        const newTrail = [...prev, { x: e.clientX, y: e.clientY, id: Date.now() }];
        return newTrail.slice(-8);
      });
    };

    const updateCursorType = () => {
      const hoveredElement = document.elementFromPoint(position.x, position.y);
      const isClickable = hoveredElement?.closest('button, a, [role="button"], input, textarea, select');
      setIsPointer(!!isClickable);
    };

    const handleMouseLeave = () => setIsHidden(true);
    const handleMouseEnter = () => setIsHidden(false);

    window.addEventListener('mousemove', updatePosition);
    window.addEventListener('mouseover', updateCursorType);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', updatePosition);
      window.removeEventListener('mouseover', updateCursorType);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [position.x, position.y]);

  if (isHidden) return null;

  return (
    <>
      {/* Trail nodes */}
      {trail.map((point, index) => (
        <motion.div
          key={point.id}
          className="fixed pointer-events-none z-[9998] rounded-full"
          initial={{ opacity: 0.6, scale: 0.5 }}
          animate={{ opacity: 0, scale: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            left: point.x - 3,
            top: point.y - 3,
            width: 6,
            height: 6,
            background: `hsl(${190 + index * 5} 100% 50%)`,
            boxShadow: `0 0 10px hsl(${190 + index * 5} 100% 50% / 0.5)`,
          }}
        />
      ))}

      {/* Main cursor */}
      <motion.div
        className="fixed pointer-events-none z-[9999] mix-blend-difference"
        animate={{
          x: position.x - (isPointer ? 20 : 10),
          y: position.y - (isPointer ? 20 : 10),
          scale: isPointer ? 1.5 : 1,
        }}
        transition={{ type: 'spring', stiffness: 500, damping: 28, mass: 0.5 }}
      >
        <div
          className={`rounded-full transition-all duration-200 ${
            isPointer ? 'w-10 h-10 border-2 border-primary bg-transparent' : 'w-5 h-5 bg-primary'
          }`}
          style={{
            boxShadow: isPointer
              ? '0 0 20px hsl(190 100% 50% / 0.8)'
              : '0 0 15px hsl(190 100% 50% / 0.6)',
          }}
        />
      </motion.div>

      {/* Outer ring */}
      <motion.div
        className="fixed pointer-events-none z-[9998]"
        animate={{
          x: position.x - 25,
          y: position.y - 25,
        }}
        transition={{ type: 'spring', stiffness: 150, damping: 20, mass: 1 }}
      >
        <div className="w-[50px] h-[50px] rounded-full border border-primary/30" />
      </motion.div>
    </>
  );
};

export default CustomCursor;
