import { Canvas, useFrame } from "@react-three/fiber";
import { Float, AdaptiveDpr, AdaptiveEvents, PerformanceMonitor } from "@react-three/drei";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

function GlassKnot() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    const { x, y } = state.pointer;
    ref.current.rotation.y += 0.003;
    ref.current.rotation.x = THREE.MathUtils.lerp(ref.current.rotation.x, y * 0.3, 0.05);
    ref.current.position.x = THREE.MathUtils.lerp(ref.current.position.x, x * 0.4, 0.06);
  });
  return (
    <Float speed={1.1} rotationIntensity={0.3} floatIntensity={0.6}>
      <mesh ref={ref}>
        {/* Lower poly: 96 tubular × 20 radial ≈ 60% fewer tris */}
        <torusKnotGeometry args={[1.05, 0.34, 96, 20]} />
        <meshPhysicalMaterial
          color="#cfe6ff"
          metalness={0.35}
          roughness={0.18}
          clearcoat={1}
          clearcoatRoughness={0.15}
        />
      </mesh>
    </Float>
  );
}

export default function HeroScene() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);
  const [dprMax, setDprMax] = useState(1.5);

  useEffect(() => {
    if (!wrapRef.current) return;
    const io = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.05 },
    );
    io.observe(wrapRef.current);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={wrapRef} className="absolute inset-0">
      <Canvas
        dpr={[1, dprMax]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        camera={{ position: [0, 0, 5], fov: 38 }}
        frameloop={visible ? "always" : "never"}
      >
        <PerformanceMonitor
          onDecline={() => setDprMax(1)}
          onIncline={() => setDprMax(1.5)}
        />
        <AdaptiveDpr pixelated />
        <AdaptiveEvents />
        <ambientLight intensity={0.5} />
        <directionalLight position={[4, 6, 4]} intensity={1.1} />
        <directionalLight position={[-5, -2, -3]} intensity={0.3} color="#7aaaff" />
        <GlassKnot />
      </Canvas>
    </div>
  );
}
