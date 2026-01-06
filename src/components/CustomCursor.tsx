import { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';

const CustomCursor = () => {
  const [isPointer, setIsPointer] = useState(false);
  const [isHidden, setIsHidden] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  
  // Use refs for smooth lerp-based animation
  const mousePos = useRef({ x: 0, y: 0 });
  const cursorPos = useRef({ x: 0, y: 0 });
  const outerPos = useRef({ x: 0, y: 0 });
  const trailPositions = useRef<{ x: number; y: number }[]>([]);
  
  const cursorRef = useRef<HTMLDivElement>(null);
  const outerRef = useRef<HTMLDivElement>(null);
  const trailRefs = useRef<(HTMLDivElement | null)[]>([]);
  const rafRef = useRef<number>();

  // Lerp function for smooth interpolation
  const lerp = (start: number, end: number, factor: number) => {
    return start + (end - start) * factor;
  };

  // Animation loop using requestAnimationFrame
  const animate = useCallback(() => {
    // Smooth cursor movement with lerp
    cursorPos.current.x = lerp(cursorPos.current.x, mousePos.current.x, 0.35);
    cursorPos.current.y = lerp(cursorPos.current.y, mousePos.current.y, 0.35);

    // Even smoother outer ring
    outerPos.current.x = lerp(outerPos.current.x, mousePos.current.x, 0.15);
    outerPos.current.y = lerp(outerPos.current.y, mousePos.current.y, 0.15);

    // Update trail positions with cascading lerp
    for (let i = 0; i < 6; i++) {
      const target = i === 0 ? cursorPos.current : trailPositions.current[i - 1];
      if (target) {
        if (!trailPositions.current[i]) {
          trailPositions.current[i] = { x: target.x, y: target.y };
        }
        trailPositions.current[i].x = lerp(trailPositions.current[i].x, target.x, 0.25 - i * 0.03);
        trailPositions.current[i].y = lerp(trailPositions.current[i].y, target.y, 0.25 - i * 0.03);
      }
    }

    // Apply transforms directly to DOM for performance
    if (cursorRef.current) {
      const scale = isPointer ? 1.5 : isDragging ? 0.8 : 1;
      const offset = isPointer ? 20 : 10;
      cursorRef.current.style.transform = `translate3d(${cursorPos.current.x - offset}px, ${cursorPos.current.y - offset}px, 0) scale(${scale})`;
    }

    if (outerRef.current) {
      outerRef.current.style.transform = `translate3d(${outerPos.current.x - 25}px, ${outerPos.current.y - 25}px, 0)`;
    }

    // Update trail elements
    trailRefs.current.forEach((ref, i) => {
      if (ref && trailPositions.current[i]) {
        const opacity = 0.6 - i * 0.1;
        const scale = 1 - i * 0.15;
        ref.style.transform = `translate3d(${trailPositions.current[i].x - 4}px, ${trailPositions.current[i].y - 4}px, 0) scale(${scale})`;
        ref.style.opacity = String(Math.max(0, opacity));
      }
    });

    rafRef.current = requestAnimationFrame(animate);
  }, [isPointer, isDragging]);

  useEffect(() => {
    const updatePosition = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      setIsHidden(false);
    };

    const updateCursorType = (e: MouseEvent) => {
      const hoveredElement = document.elementFromPoint(e.clientX, e.clientY);
      const isClickable = hoveredElement?.closest('button, a, [role="button"], input, textarea, select, [data-draggable]');
      setIsPointer(!!isClickable);
    };

    const handleMouseDown = () => setIsDragging(true);
    const handleMouseUp = () => setIsDragging(false);
    const handleMouseLeave = () => setIsHidden(true);
    const handleMouseEnter = () => setIsHidden(false);

    window.addEventListener('mousemove', updatePosition, { passive: true });
    window.addEventListener('mousemove', updateCursorType, { passive: true });
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    // Start animation loop
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', updatePosition);
      window.removeEventListener('mousemove', updateCursorType);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [animate]);

  if (isHidden) return null;

  return (
    <>
      {/* Trail nodes */}
      {[...Array(6)].map((_, index) => (
        <div
          key={index}
          ref={(el) => (trailRefs.current[index] = el)}
          className="fixed pointer-events-none z-[9997] rounded-full will-change-transform"
          style={{
            width: 8,
            height: 8,
            background: `hsl(${190 + index * 8} 100% 50%)`,
            boxShadow: `0 0 ${10 - index}px hsl(${190 + index * 8} 100% 50% / 0.6)`,
          }}
        />
      ))}

      {/* Main cursor */}
      <div
        ref={cursorRef}
        className="fixed pointer-events-none z-[9999] mix-blend-difference will-change-transform"
      >
        <div
          className={`rounded-full transition-all duration-150 ${
            isPointer 
              ? 'w-10 h-10 border-2 border-primary bg-transparent' 
              : isDragging 
                ? 'w-4 h-4 bg-accent' 
                : 'w-5 h-5 bg-primary'
          }`}
          style={{
            boxShadow: isPointer
              ? '0 0 25px hsl(190 100% 50% / 0.8)'
              : '0 0 20px hsl(190 100% 50% / 0.6)',
          }}
        />
      </div>

      {/* Outer ring */}
      <div
        ref={outerRef}
        className="fixed pointer-events-none z-[9998] will-change-transform"
      >
        <motion.div 
          className="w-[50px] h-[50px] rounded-full border border-primary/30"
          animate={{ 
            borderColor: isPointer ? 'hsl(190 100% 50% / 0.6)' : 'hsl(190 100% 50% / 0.3)',
            scale: isDragging ? 0.8 : 1
          }}
          transition={{ duration: 0.2 }}
        />
      </div>
    </>
  );
};

export default CustomCursor;
