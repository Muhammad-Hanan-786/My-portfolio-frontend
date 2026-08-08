import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { playSound, setMuted, isMuted, type SoundName } from "@/lib/sounds";
import { Volume2, VolumeX, X, GripHorizontal, Sparkles } from "lucide-react";

// Cursor state shared with the R3F scene (module-scoped, no re-render)
const pointer = { x: 0, y: 0 };

/**
 * Chibi 3D character built from primitives — red hoodie mascot.
 * Gestures toward the cursor: head tracks, body tilts, arms raise & point.
 */
function ChibiCharacter({ reacting }: { reacting: boolean }) {
  const root = useRef<THREE.Group>(null);
  const head = useRef<THREE.Group>(null);
  const body = useRef<THREE.Group>(null);
  const leftPupil = useRef<THREE.Mesh>(null);
  const rightPupil = useRef<THREE.Mesh>(null);
  const leftArm = useRef<THREE.Group>(null);
  const rightArm = useRef<THREE.Group>(null);
  const mouth = useRef<THREE.Mesh>(null);
  const bounce = useRef(0);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const px = pointer.x; // -1..1 (right = +1)
    const py = pointer.y; // -1..1 (down  = +1, top = -1)

    // Whole-body sway + idle bob. Cursor RIGHT → body turns right (viewer's right).
    if (root.current) {
      root.current.position.y = -1 + Math.sin(t * 2.1) * 0.05;
      root.current.rotation.y = THREE.MathUtils.damp(root.current.rotation.y, px * 0.55, 6, delta);
      root.current.rotation.z = THREE.MathUtils.damp(root.current.rotation.z, -px * 0.08, 6, delta);
    }
    // Body lean forward/back (cursor down → lean forward toward viewer)
    if (body.current) {
      body.current.rotation.x = THREE.MathUtils.damp(body.current.rotation.x, py * 0.18, 6, delta);
    }
    // Head tracks cursor (px > 0 turns head right, py > 0 tilts head down)
    if (head.current) {
      head.current.rotation.y = THREE.MathUtils.damp(head.current.rotation.y, px * 0.75, 8, delta);
      head.current.rotation.x = THREE.MathUtils.damp(head.current.rotation.x, py * 0.45, 8, delta);
    }
    // Pupils micro-track
    const eyeX = px * 0.05;
    const eyeY = -py * 0.045;
    if (leftPupil.current) {
      leftPupil.current.position.x = -0.13 + eyeX;
      leftPupil.current.position.y = 0.06 + eyeY;
    }
    if (rightPupil.current) {
      rightPupil.current.position.x = 0.13 + eyeX;
      rightPupil.current.position.y = 0.06 + eyeY;
    }

    // ARMS — point toward the cursor target in avatar space
    const cx = px * 2.2;
    const cy = -py * 1.8 + 0.6;
    {
      const dx = cx - -0.7;
      const dy = cy - 0.35;
      const target = Math.atan2(-dy, -dx);
      if (leftArm.current) {
        leftArm.current.rotation.z = THREE.MathUtils.damp(leftArm.current.rotation.z, target, 6, delta);
        leftArm.current.rotation.x = THREE.MathUtils.damp(leftArm.current.rotation.x, Math.sin(t * 2) * 0.05, 5, delta);
      }
    }
    {
      const dx = cx - 0.7;
      const dy = cy - 0.35;
      const target = Math.atan2(dy, dx);
      if (rightArm.current) {
        rightArm.current.rotation.z = THREE.MathUtils.damp(rightArm.current.rotation.z, target, 6, delta);
        rightArm.current.rotation.x = THREE.MathUtils.damp(rightArm.current.rotation.x, Math.cos(t * 2) * 0.05, 5, delta);
      }
    }

    // Reaction bounce
    if (reacting) bounce.current = Math.min(1, bounce.current + delta * 8);
    else bounce.current = Math.max(0, bounce.current - delta * 3);
    if (root.current) {
      const s = 1 + bounce.current * 0.08;
      root.current.scale.setScalar(s);
    }
    if (mouth.current) {
      mouth.current.scale.y = 0.35 + bounce.current * 1.6;
    }
  });

  const skin = "#f5c9a6";
  const hoodie = "#c0392b";
  const hoodieDark = "#7f1d1d";
  const hair = "#3a2416";
  const pants = "#141821";
  const shoe = "#e74c3c";

  return (
    <group ref={root} position={[0, -1, 0]}>
      {/* BODY (hoodie torso) */}
      <group ref={body} position={[0, 0.55, 0]}>
        {/* Torso — capsule-ish sphere */}
        <mesh position={[0, 0, 0]} scale={[1.05, 1.15, 0.95]} castShadow>
          <sphereGeometry args={[0.7, 32, 32]} />
          <meshStandardMaterial color={hoodie} roughness={0.85} />
        </mesh>
        {/* Pocket band */}
        <mesh position={[0, -0.15, 0.55]} rotation={[0.2, 0, 0]}>
          <boxGeometry args={[0.75, 0.28, 0.1]} />
          <meshStandardMaterial color={hoodieDark} roughness={0.9} />
        </mesh>
        {/* Hood behind neck */}
        <mesh position={[0, 0.55, -0.15]}>
          <sphereGeometry args={[0.55, 24, 24]} />
          <meshStandardMaterial color={hoodie} roughness={0.85} />
        </mesh>

        {/* HEAD */}
        <group ref={head} position={[0, 0.9, 0.05]}>
          {/* Skull */}
          <mesh castShadow>
            <sphereGeometry args={[0.5, 32, 32]} />
            <meshStandardMaterial color={skin} roughness={0.55} />
          </mesh>
          {/* Hair cap */}
          <mesh position={[0, 0.12, -0.02]} scale={[1.05, 0.85, 1.05]}>
            <sphereGeometry args={[0.5, 24, 24, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
            <meshStandardMaterial color={hair} roughness={0.75} />
          </mesh>
          {/* Bun */}
          <mesh position={[0, 0.55, -0.05]}>
            <sphereGeometry args={[0.16, 20, 20]} />
            <meshStandardMaterial color={hair} roughness={0.75} />
          </mesh>
          {/* Glasses frame */}
          <mesh position={[-0.13, 0.06, 0.42]}>
            <torusGeometry args={[0.11, 0.018, 12, 24]} />
            <meshStandardMaterial color="#0b0b12" roughness={0.4} metalness={0.3} />
          </mesh>
          <mesh position={[0.13, 0.06, 0.42]}>
            <torusGeometry args={[0.11, 0.018, 12, 24]} />
            <meshStandardMaterial color="#0b0b12" roughness={0.4} metalness={0.3} />
          </mesh>
          {/* Glasses bridge */}
          <mesh position={[0, 0.06, 0.42]}>
            <boxGeometry args={[0.05, 0.015, 0.015]} />
            <meshStandardMaterial color="#0b0b12" />
          </mesh>
          {/* Eyes (whites) */}
          <mesh position={[-0.13, 0.06, 0.4]}>
            <sphereGeometry args={[0.085, 20, 20]} />
            <meshStandardMaterial color="#ffffff" roughness={0.2} />
          </mesh>
          <mesh position={[0.13, 0.06, 0.4]}>
            <sphereGeometry args={[0.085, 20, 20]} />
            <meshStandardMaterial color="#ffffff" roughness={0.2} />
          </mesh>
          {/* Pupils */}
          <mesh ref={leftPupil} position={[-0.13, 0.06, 0.47]}>
            <sphereGeometry args={[0.038, 16, 16]} />
            <meshStandardMaterial color="#0b0b12" />
          </mesh>
          <mesh ref={rightPupil} position={[0.13, 0.06, 0.47]}>
            <sphereGeometry args={[0.038, 16, 16]} />
            <meshStandardMaterial color="#0b0b12" />
          </mesh>
          {/* Nose */}
          <mesh position={[0, -0.05, 0.48]}>
            <sphereGeometry args={[0.045, 16, 16]} />
            <meshStandardMaterial color="#e89a7a" roughness={0.55} />
          </mesh>
          {/* Cheeks */}
          <mesh position={[-0.24, -0.1, 0.36]}>
            <sphereGeometry args={[0.06, 16, 16]} />
            <meshBasicMaterial color="#ff9aa2" transparent opacity={0.55} />
          </mesh>
          <mesh position={[0.24, -0.1, 0.36]}>
            <sphereGeometry args={[0.06, 16, 16]} />
            <meshBasicMaterial color="#ff9aa2" transparent opacity={0.55} />
          </mesh>
          {/* Mouth (smile) */}
          <mesh ref={mouth} position={[0, -0.18, 0.44]} scale={[1, 0.4, 1]}>
            <sphereGeometry args={[0.05, 16, 16]} />
            <meshStandardMaterial color="#5a1a1a" />
          </mesh>
        </group>

        {/* LEFT ARM */}
        <group ref={leftArm} position={[-0.7, 0.35, 0]}>
          <mesh position={[-0.35, 0, 0]}>
            <capsuleGeometry args={[0.18, 0.55, 8, 16]} />
            <meshStandardMaterial color={hoodie} roughness={0.85} />
          </mesh>
          <mesh position={[-0.7, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.19, 0.19, 0.1, 20]} />
            <meshStandardMaterial color={hoodieDark} roughness={0.9} />
          </mesh>
          <mesh position={[-0.82, 0, 0]}>
            <sphereGeometry args={[0.14, 20, 20]} />
            <meshStandardMaterial color={skin} roughness={0.55} />
          </mesh>
        </group>

        {/* RIGHT ARM */}
        <group ref={rightArm} position={[0.7, 0.35, 0]}>
          <mesh position={[0.35, 0, 0]}>
            <capsuleGeometry args={[0.18, 0.55, 8, 16]} />
            <meshStandardMaterial color={hoodie} roughness={0.85} />
          </mesh>
          <mesh position={[0.7, 0, 0]}>
            <cylinderGeometry args={[0.19, 0.19, 0.1, 20]} />
            <meshStandardMaterial color={hoodieDark} roughness={0.9} />
          </mesh>
          <mesh position={[0.82, 0, 0]}>
            <sphereGeometry args={[0.14, 20, 20]} />
            <meshStandardMaterial color={skin} roughness={0.55} />
          </mesh>
        </group>

        {/* Chest patch */}
        <mesh position={[0, 0.05, 0.6]}>
          <circleGeometry args={[0.18, 24]} />
          <meshStandardMaterial color="#f4ead6" roughness={0.9} />
        </mesh>
      </group>

      {/* LEGS / PANTS */}
      <mesh position={[-0.22, -0.45, 0]}>
        <capsuleGeometry args={[0.18, 0.5, 8, 16]} />
        <meshStandardMaterial color={pants} roughness={0.9} />
      </mesh>
      <mesh position={[0.22, -0.45, 0]}>
        <capsuleGeometry args={[0.18, 0.5, 8, 16]} />
        <meshStandardMaterial color={pants} roughness={0.9} />
      </mesh>
      {/* Shoes */}
      <mesh position={[-0.22, -0.85, 0.1]} scale={[1, 0.6, 1.4]}>
        <sphereGeometry args={[0.2, 20, 20]} />
        <meshStandardMaterial color={shoe} roughness={0.6} />
      </mesh>
      <mesh position={[0.22, -0.85, 0.1]} scale={[1, 0.6, 1.4]}>
        <sphereGeometry args={[0.2, 20, 20]} />
        <meshStandardMaterial color={shoe} roughness={0.6} />
      </mesh>
    </group>
  );
}

export function CuteAvatar() {
  const [reacting, setReacting] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [muted, setLocalMuted] = useState(false);
  const [isVisible, setIsVisible] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("cute_avatar_visible");
      return saved !== "false";
    }
    return true;
  });
  const [pos, setPos] = useState<{ x: number; y: number }>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("cute_avatar_pos");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (typeof parsed.x === "number" && typeof parsed.y === "number") {
            return parsed;
          }
        } catch (e) {}
      }
    }
    return { x: 16, y: 16 };
  });

  const [isDragging, setIsDragging] = useState(false);
  const reactTimer = useRef<number | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef<{
    startX: number;
    startY: number;
    posX: number;
    posY: number;
    hasMoved: boolean;
  } | null>(null);

  const react = (sound: SoundName) => {
    playSound(sound);
    setReacting(true);
    if (reactTimer.current) window.clearTimeout(reactTimer.current);
    reactTimer.current = window.setTimeout(() => setReacting(false), 420);
  };

  useEffect(() => {
    setMounted(true);
    const onMove = (e: PointerEvent) => {
      if (wrapperRef.current) {
        const rect = wrapperRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const dx = e.clientX - centerX;
        const dy = e.clientY - centerY;
        pointer.x = Math.max(-1.5, Math.min(1.5, dx / 300));
        pointer.y = Math.max(-1.5, Math.min(1.5, dy / 300));
      } else {
        pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
        pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
      }
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    const onClick = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null;
      if (!t) return;
      const btn = t.closest("button, a, [role='button']") as HTMLElement | null;
      if (!btn) return;
      if (btn.dataset.cuteMute === "true" || btn.dataset.cuteHide === "true") return;
      const kind = btn.dataset.sound as SoundName | undefined;
      if (kind) react(kind);
      else if (btn.tagName === "A") react("nav");
      else react("click");
    };

    let lastHover = 0;
    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null;
      if (!t) return;
      const btn = t.closest("button, a") as HTMLElement | null;
      if (!btn) return;
      const now = performance.now();
      if (now - lastHover < 140) return;
      lastHover = now;
      react("hover");
    };
    const onSubmit = () => react("success");

    let lastType = 0;
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (!t) return;
      const editable =
        t.tagName === "INPUT" ||
        t.tagName === "TEXTAREA" ||
        (t as HTMLElement).isContentEditable;
      if (!editable) return;
      if (
        e.key.length > 1 &&
        e.key !== "Backspace" &&
        e.key !== "Enter" &&
        e.key !== "Tab" &&
        e.key !== " "
      )
        return;
      const now = performance.now();
      if (now - lastType < 20) return;
      lastType = now;
      react("type");
    };

    document.addEventListener("click", onClick, true);
    document.addEventListener("mouseover", onOver, true);
    document.addEventListener("submit", onSubmit, true);
    document.addEventListener("keydown", onKey, true);

    (window as any).cuteSound = (name: SoundName) => react(name);

    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("click", onClick, true);
      document.removeEventListener("mouseover", onOver, true);
      document.removeEventListener("submit", onSubmit, true);
      document.removeEventListener("keydown", onKey, true);
      if (reactTimer.current) window.clearTimeout(reactTimer.current);
    };
  }, []);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    const target = e.target as HTMLElement;
    if (target.closest("button, a")) return;

    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch (err) {}

    dragStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      posX: pos.x,
      posY: pos.y,
      hasMoved: false,
    };
    setIsDragging(true);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragStartRef.current) return;
    const dx = e.clientX - dragStartRef.current.startX;
    const dy = e.clientY - dragStartRef.current.startY;

    if (Math.hypot(dx, dy) > 4) {
      dragStartRef.current.hasMoved = true;
    }

    const containerW = 120;
    const containerH = 140;
    const maxX = Math.max(0, window.innerWidth - containerW);
    const maxY = Math.max(0, window.innerHeight - containerH);

    const newX = Math.max(8, Math.min(maxX, dragStartRef.current.posX + dx));
    const newY = Math.max(8, Math.min(maxY, dragStartRef.current.posY + dy));

    setPos({ x: newX, y: newY });
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragStartRef.current) return;
    if (dragStartRef.current.hasMoved) {
      localStorage.setItem("cute_avatar_pos", JSON.stringify(pos));
    }
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch (err) {}
    dragStartRef.current = null;
    setIsDragging(false);
  };

  if (!mounted) return null;

  if (!isVisible) {
    return (
      <button
        type="button"
        aria-label="Bring back mascot"
        onClick={() => {
          setIsVisible(true);
          localStorage.setItem("cute_avatar_visible", "true");
          playSound("giggle");
        }}
        className="fixed left-4 top-4 z-[60] flex items-center gap-2 rounded-full border border-border/80 bg-background/85 px-3 py-1.5 text-xs font-medium text-foreground shadow-lg backdrop-blur-md transition-all hover:scale-105 hover:bg-background hover:shadow-red-500/20 active:scale-95"
      >
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500"></span>
        </span>
        <Sparkles className="h-3.5 w-3.5 text-red-500" />
        <span>Bring back mascot</span>
      </button>
    );
  }

  return (
    <div
      ref={wrapperRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      className={`group fixed z-[60] flex flex-col items-center gap-1.5 touch-none select-none transition-shadow duration-200 ${
        isDragging ? "cursor-grabbing opacity-90 scale-105" : "cursor-grab"
      }`}
      style={{
        left: `${pos.x}px`,
        top: `${pos.y}px`,
      }}
    >
      <div
        className="relative h-24 w-24 sm:h-28 sm:w-28 rounded-2xl transition-transform"
        style={{
          background:
            "radial-gradient(circle at 35% 30%, rgba(239,68,68,0.35), rgba(0,0,0,0) 70%)",
          filter: "drop-shadow(0 8px 22px rgba(239,68,68,0.35))",
        }}
      >
        {/* Subtle drag hint icon on hover */}
        <div className="absolute top-1 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-60 transition-opacity text-white/70 pointer-events-none z-10">
          <GripHorizontal className="h-4 w-4" />
        </div>

        <Canvas
          camera={{ position: [0, 0.2, 4.4], fov: 32 }}
          gl={{ antialias: true, alpha: true }}
          dpr={[1, 1.5]}
          style={{ pointerEvents: "none" }}
        >
          <ambientLight intensity={0.75} />
          <directionalLight position={[3, 4, 5]} intensity={1.2} />
          <pointLight position={[-3, -1, 2]} intensity={0.5} color="#ffb4a2" />
          <ChibiCharacter reacting={reacting} />
        </Canvas>
      </div>

      {/* Action buttons toolbar */}
      <div className="flex items-center gap-1.5 pointer-events-auto">
        <button
          type="button"
          aria-label={muted ? "Unmute mascot" : "Mute mascot"}
          data-cute-mute="true"
          onClick={() => {
            const next = !muted;
            setLocalMuted(next);
            setMuted(next);
            if (!next) playSound("giggle");
          }}
          className="grid h-6 w-6 place-items-center rounded-full border border-border bg-background/80 text-muted-foreground backdrop-blur transition hover:bg-background hover:text-foreground hover:scale-110 active:scale-95"
        >
          {muted ? <VolumeX className="h-3 w-3" /> : <Volume2 className="h-3 w-3" />}
        </button>

        <button
          type="button"
          aria-label="Remove mascot"
          data-cute-hide="true"
          onClick={(e) => {
            e.stopPropagation();
            setIsVisible(false);
            localStorage.setItem("cute_avatar_visible", "false");
            playSound("click");
          }}
          className="grid h-6 w-6 place-items-center rounded-full border border-border bg-background/80 text-muted-foreground backdrop-blur transition hover:bg-red-500/20 hover:text-red-400 hover:scale-110 active:scale-95"
          title="Remove mascot"
        >
          <X className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
}

void isMuted;

