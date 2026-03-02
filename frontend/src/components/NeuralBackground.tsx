import { useEffect, useRef } from "react";
import * as THREE from "three";

/* ══════════════════════════════════════
   GLOBAL NEURAL NETWORK BACKGROUND
   Fixed full-screen behind all sections
══════════════════════════════════════ */
const NeuralBackground = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    /* Scene setup */
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, el.clientWidth / el.clientHeight, 0.1, 2000);
    camera.position.z = 350;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(el.clientWidth, el.clientHeight);
    renderer.setClearColor(0x000000, 0);
    el.appendChild(renderer.domElement);

    /* Particle count based on device */
    const COUNT = isMobile ? 80 : 180;
    const CONNECT_DIST = isMobile ? 80 : 110;
    const SPREAD = isMobile ? 200 : 350;

    /* Particle positions & velocities */
    const positions = new Float32Array(COUNT * 3);
    const velocities: THREE.Vector3[] = [];
    const colors = new Float32Array(COUNT * 3);

    const palette = [
      new THREE.Color("#06b6d4"),  // cyan
      new THREE.Color("#3b82f6"),  // blue
      new THREE.Color("#8b5cf6"),  // violet
      new THREE.Color("#a5f3fc"),  // light cyan
    ];

    for (let i = 0; i < COUNT; i++) {
      positions[i * 3] = (Math.random() - 0.5) * SPREAD * 2;
      positions[i * 3 + 1] = (Math.random() - 0.5) * SPREAD * 1.4;
      positions[i * 3 + 2] = (Math.random() - 0.5) * SPREAD;
      velocities.push(new THREE.Vector3(
        (Math.random() - 0.5) * 0.18,
        (Math.random() - 0.5) * 0.18,
        (Math.random() - 0.5) * 0.08,
      ));
      const c = palette[Math.floor(Math.random() * palette.length)];
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }

    /* Point cloud */
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const pointMat = new THREE.PointsMaterial({
      size: isMobile ? 2.2 : 2.8,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      sizeAttenuation: true,
    });
    const points = new THREE.Points(geo, pointMat);
    scene.add(points);

    /* Line segments (connections) */
    const maxLines = COUNT * 4;
    const linePositions = new Float32Array(maxLines * 6);
    const lineColors = new Float32Array(maxLines * 6);
    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute("position", new THREE.BufferAttribute(linePositions, 3));
    lineGeo.setAttribute("color", new THREE.BufferAttribute(lineColors, 3));
    lineGeo.setDrawRange(0, 0);
    const lineMat = new THREE.LineSegments(lineGeo, new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.3,
    }));
    scene.add(lineMat);

    /* Mouse interaction */
    const handleMouse = (e: MouseEvent) => {
      mouseRef.current = {
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: -(e.clientY / window.innerHeight - 0.5) * 2,
      };
    };
    const handleTouch = (e: TouchEvent) => {
      if (e.touches[0]) {
        mouseRef.current = {
          x: (e.touches[0].clientX / window.innerWidth - 0.5) * 2,
          y: -(e.touches[0].clientY / window.innerHeight - 0.5) * 2,
        };
      }
    };
    window.addEventListener("mousemove", handleMouse);
    window.addEventListener("touchmove", handleTouch, { passive: true });

    /* Resize */
    const handleResize = () => {
      camera.aspect = el.clientWidth / el.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(el.clientWidth, el.clientHeight);
    };
    window.addEventListener("resize", handleResize);

    /* Animation loop */
    let frame = 0;
    let animId: number;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      frame++;

      const pos = geo.attributes.position.array as Float32Array;

      /* Gentle camera drift following mouse */
      camera.position.x += (mouseRef.current.x * 30 - camera.position.x) * 0.018;
      camera.position.y += (mouseRef.current.y * 20 - camera.position.y) * 0.018;
      camera.lookAt(scene.position);

      /* Slow rotation of entire group */
      points.rotation.y += 0.0008;
      lineMat.rotation.y += 0.0008;

      /* Update particles */
      for (let i = 0; i < COUNT; i++) {
        pos[i * 3] += velocities[i].x;
        pos[i * 3 + 1] += velocities[i].y;
        pos[i * 3 + 2] += velocities[i].z;

        /* Bounce off boundaries */
        if (Math.abs(pos[i * 3]) > SPREAD) velocities[i].x *= -1;
        if (Math.abs(pos[i * 3 + 1]) > SPREAD * 0.7) velocities[i].y *= -1;
        if (Math.abs(pos[i * 3 + 2]) > SPREAD * 0.5) velocities[i].z *= -1;
      }
      geo.attributes.position.needsUpdate = true;

      /* Build connection lines every 2 frames for perf */
      if (frame % 2 === 0) {
        let lineIdx = 0;
        const lp = lineGeo.attributes.position.array as Float32Array;
        const lc = lineGeo.attributes.color.array as Float32Array;

        for (let i = 0; i < COUNT && lineIdx < maxLines; i++) {
          for (let j = i + 1; j < COUNT && lineIdx < maxLines; j++) {
            const dx = pos[i * 3] - pos[j * 3];
            const dy = pos[i * 3 + 1] - pos[j * 3 + 1];
            const dz = pos[i * 3 + 2] - pos[j * 3 + 2];
            const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
            if (dist < CONNECT_DIST) {
              const alpha = 1 - dist / CONNECT_DIST;
              lp[lineIdx * 6] = pos[i * 3];
              lp[lineIdx * 6 + 1] = pos[i * 3 + 1];
              lp[lineIdx * 6 + 2] = pos[i * 3 + 2];
              lp[lineIdx * 6 + 3] = pos[j * 3];
              lp[lineIdx * 6 + 4] = pos[j * 3 + 1];
              lp[lineIdx * 6 + 5] = pos[j * 3 + 2];
              lc[lineIdx * 6] = colors[i * 3] * alpha;
              lc[lineIdx * 6 + 1] = colors[i * 3 + 1] * alpha;
              lc[lineIdx * 6 + 2] = colors[i * 3 + 2] * alpha;
              lc[lineIdx * 6 + 3] = colors[j * 3] * alpha;
              lc[lineIdx * 6 + 4] = colors[j * 3 + 1] * alpha;
              lc[lineIdx * 6 + 5] = colors[j * 3 + 2] * alpha;
              lineIdx++;
            }
          }
        }
        lineGeo.setDrawRange(0, lineIdx * 2);
        lineGeo.attributes.position.needsUpdate = true;
        lineGeo.attributes.color.needsUpdate = true;
      }

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", handleMouse);
      window.removeEventListener("touchmove", handleTouch);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
    };
  }, [isMobile]);

  return (
    <div
      ref={mountRef}
      className="fixed inset-0 w-full h-full -z-10 pointer-events-none"
    />
  );
};

export default NeuralBackground;
