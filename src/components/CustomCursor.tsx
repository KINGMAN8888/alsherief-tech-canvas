import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

/* ── Only render on mouse (fine pointer) devices ── */
const hasFinePointer = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(pointer: fine)").matches;

const CustomCursor = () => {
  const [visible, setVisible]   = useState(false);
  const [hovering, setHovering] = useState(false);
  const [clicking, setClicking] = useState(false);

  const mouseX = useMotionValue(-200);
  const mouseY = useMotionValue(-200);

  /* Dot — snaps instantly */
  const dotX = useSpring(mouseX, { stiffness: 2000, damping: 50, mass: 0.2 });
  const dotY = useSpring(mouseY, { stiffness: 2000, damping: 50, mass: 0.2 });

  /* Ring — magnetic lag */
  const ringX = useSpring(mouseX, { stiffness: 180, damping: 22, mass: 0.6 });
  const ringY = useSpring(mouseY, { stiffness: 180, damping: 22, mass: 0.6 });

  /* Outer trail — slower, ghostly */
  const trailX = useSpring(mouseX, { stiffness: 80, damping: 18, mass: 1 });
  const trailY = useSpring(mouseY, { stiffness: 80, damping: 18, mass: 1 });

  const hoverRef = useRef(false);

  useEffect(() => {
    if (!hasFinePointer()) return;

    const onMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!visible) setVisible(true);
    };

    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      const isInteractive = !!t.closest(
        "a, button, [role='button'], input, textarea, select, label, [tabindex]"
      );
      if (isInteractive !== hoverRef.current) {
        hoverRef.current = isInteractive;
        setHovering(isInteractive);
      }
    };

    const onDown  = () => setClicking(true);
    const onUp    = () => setClicking(false);
    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);

    document.addEventListener("mousemove",  onMove,  { passive: true });
    document.addEventListener("mouseover",  onOver,  { passive: true });
    document.addEventListener("mousedown",  onDown);
    document.addEventListener("mouseup",    onUp);
    document.documentElement.addEventListener("mouseleave", onLeave);
    document.documentElement.addEventListener("mouseenter", onEnter);

    return () => {
      document.removeEventListener("mousemove",  onMove);
      document.removeEventListener("mouseover",  onOver);
      document.removeEventListener("mousedown",  onDown);
      document.removeEventListener("mouseup",    onUp);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      document.documentElement.removeEventListener("mouseenter", onEnter);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!hasFinePointer()) return null;

  return (
    <>
      {/* ── Outer trail (ghostly aura) ── */}
      <motion.div
        className="pointer-events-none fixed top-0 left-0 z-[9998] rounded-full"
        style={{
          x: trailX,
          y: trailY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          opacity:  visible ? (hovering ? 0.18 : 0.1) : 0,
          width:    clicking ? 48 : hovering ? 72 : 56,
          height:   clicking ? 48 : hovering ? 72 : 56,
          background: hovering
            ? "radial-gradient(circle, rgba(139,92,246,0.35) 0%, transparent 70%)"
            : "radial-gradient(circle, rgba(6,182,212,0.25) 0%, transparent 70%)",
        }}
        transition={{ duration: 0.25 }}
      />

      {/* ── Ring ── */}
      <motion.div
        className="pointer-events-none fixed top-0 left-0 z-[9999] rounded-full border"
        style={{
          x: ringX,
          y: ringY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          opacity:     visible ? 1 : 0,
          width:       clicking ? 26 : hovering ? 48 : 34,
          height:      clicking ? 26 : hovering ? 48 : 34,
          borderColor: hovering
            ? "rgba(139,92,246,0.85)"
            : "rgba(6,182,212,0.7)",
          boxShadow: hovering
            ? "0 0 14px rgba(139,92,246,0.45), inset 0 0 6px rgba(139,92,246,0.1)"
            : "0 0 10px rgba(6,182,212,0.35), inset 0 0 4px rgba(6,182,212,0.08)",
          borderWidth: hovering ? "1.5px" : "1px",
        }}
        transition={{ type: "spring", stiffness: 280, damping: 24 }}
      />

      {/* ── Dot ── */}
      <motion.div
        className="pointer-events-none fixed top-0 left-0 z-[10000] rounded-full"
        style={{
          x: dotX,
          y: dotY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          opacity:         visible ? 1 : 0,
          width:           clicking ? 3 : hovering ? 5 : 6,
          height:          clicking ? 3 : hovering ? 5 : 6,
          backgroundColor: hovering ? "#ffffff" : "#06b6d4",
          boxShadow: hovering
            ? "0 0 8px rgba(255,255,255,0.9), 0 0 16px rgba(139,92,246,0.5)"
            : "0 0 8px rgba(6,182,212,0.9), 0 0 16px rgba(6,182,212,0.4)",
        }}
        transition={{ type: "spring", stiffness: 2000, damping: 50 }}
      />
    </>
  );
};

export default CustomCursor;
