import { useRef, useMemo, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function SpaceshipModel() {
  const groupRef = useRef<THREE.Group>(null);
  const exhaustRef = useRef<THREE.Mesh>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const targetRotation = useRef({ x: 0, y: 0, z: 0 });

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = maxScroll > 0 ? scrollY / maxScroll : 0;
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useFrame((state) => {
    if (!groupRef.current) return;

    // Smooth floating motion
    const time = state.clock.elapsedTime;
    groupRef.current.position.y = Math.sin(time * 0.5) * 0.3;
    groupRef.current.position.x = Math.sin(time * 0.3) * 0.2;

    // Subtle rotation based on movement
    targetRotation.current.z = Math.sin(time * 0.4) * 0.08;
    targetRotation.current.x = Math.sin(time * 0.3) * 0.05;
    
    groupRef.current.rotation.z += (targetRotation.current.z - groupRef.current.rotation.z) * 0.05;
    groupRef.current.rotation.x += (targetRotation.current.x - groupRef.current.rotation.x) * 0.05;

    // Exhaust flame animation
    if (exhaustRef.current) {
      const flicker = 0.8 + Math.sin(time * 15) * 0.2;
      exhaustRef.current.scale.z = flicker;
    }
  });

  // Create spaceship geometry
  const shipGeometry = useMemo(() => {
    const shape = new THREE.Shape();
    // Sleek spaceship profile
    shape.moveTo(0, 0);
    shape.lineTo(-0.3, 0.5);
    shape.lineTo(-0.2, 1.2);
    shape.lineTo(0, 1.5);
    shape.lineTo(0.2, 1.2);
    shape.lineTo(0.3, 0.5);
    shape.lineTo(0, 0);

    const extrudeSettings = {
      depth: 0.4,
      bevelEnabled: true,
      bevelThickness: 0.05,
      bevelSize: 0.05,
      bevelSegments: 3,
    };

    return new THREE.ExtrudeGeometry(shape, extrudeSettings);
  }, []);

  return (
    <group ref={groupRef} rotation={[0.3, Math.PI * 0.85, 0.1]} scale={0.8}>
      {/* Main body */}
      <mesh geometry={shipGeometry} position={[0, 0, -0.2]}>
        <meshStandardMaterial
          color="#3a3a4a"
          metalness={0.85}
          roughness={0.15}
        />
      </mesh>

      {/* Cockpit window */}
      <mesh position={[0, 0.8, 0.15]}>
        <sphereGeometry args={[0.15, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial
          color="#64C8FF"
          metalness={0.9}
          roughness={0.1}
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* Wing left */}
      <mesh position={[-0.5, 0.3, 0]} rotation={[0, 0, -0.3]}>
        <boxGeometry args={[0.6, 0.05, 0.3]} />
        <meshStandardMaterial color="#1a1a2a" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Wing right */}
      <mesh position={[0.5, 0.3, 0]} rotation={[0, 0, 0.3]}>
        <boxGeometry args={[0.6, 0.05, 0.3]} />
        <meshStandardMaterial color="#1a1a2a" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Engine housing */}
      <mesh position={[0, -0.2, 0]}>
        <cylinderGeometry args={[0.15, 0.2, 0.4, 8]} />
        <meshStandardMaterial color="#1a1a2a" metalness={0.6} roughness={0.4} />
      </mesh>

      {/* Engine exhaust glow */}
      <mesh ref={exhaustRef} position={[0, -0.5, 0]}>
        <coneGeometry args={[0.12, 0.4, 8]} />
        <meshBasicMaterial color="#FF6B00" transparent opacity={0.7} />
      </mesh>

      {/* Outer exhaust glow */}
      <mesh position={[0, -0.5, 0]}>
        <coneGeometry args={[0.18, 0.3, 8]} />
        <meshBasicMaterial color="#FFA500" transparent opacity={0.3} />
      </mesh>

      {/* Detail lines */}
      <mesh position={[0, 0.5, 0.22]}>
        <boxGeometry args={[0.02, 0.8, 0.02]} />
        <meshStandardMaterial color="#64C8FF" emissive="#64C8FF" emissiveIntensity={0.5} />
      </mesh>

      {/* Side lights */}
      <mesh position={[-0.25, 0.5, 0.15]}>
        <sphereGeometry args={[0.03, 8, 8]} />
        <meshBasicMaterial color="#FF6B6B" />
      </mesh>
      <mesh position={[0.25, 0.5, 0.15]}>
        <sphereGeometry args={[0.03, 8, 8]} />
        <meshBasicMaterial color="#6BFF6B" />
      </mesh>
    </group>
  );
}

function Stars() {
  const starsRef = useRef<THREE.Points>(null);
  
  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(200 * 3);
    const col = new Float32Array(200 * 3);
    
    for (let i = 0; i < 200; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10 - 5;
      
      const brightness = 0.5 + Math.random() * 0.5;
      col[i * 3] = brightness;
      col[i * 3 + 1] = brightness;
      col[i * 3 + 2] = brightness;
    }
    
    return [pos, col];
  }, []);

  useFrame((state) => {
    if (starsRef.current) {
      starsRef.current.rotation.z = state.clock.elapsedTime * 0.01;
    }
  });

  return (
    <points ref={starsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={200}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={200}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.03} vertexColors transparent opacity={0.8} />
    </points>
  );
}

export function Spaceship3D() {
  const [scrollY, setScrollY] = useState(0);
  const [maxScroll, setMaxScroll] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateMaxScroll = () => {
      setMaxScroll(document.documentElement.scrollHeight - window.innerHeight);
    };
    
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    updateMaxScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", updateMaxScroll);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", updateMaxScroll);
    };
  }, []);

  const scrollProgress = maxScroll > 0 ? scrollY / maxScroll : 0;
  
  // Move from top to bottom of viewport as user scrolls
  const topPosition = 12 + scrollProgress * 75; // 12% to 87% of viewport height

  return (
    <div
      ref={containerRef}
      className="pointer-events-none fixed left-[3%] z-20 w-[100px] h-[140px] sm:w-[130px] sm:h-[170px] md:w-[160px] md:h-[200px] lg:w-[180px] lg:h-[220px]"
      style={{
        top: `${topPosition}%`,
        transform: "translateY(-50%)",
        opacity: 0.55,
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={1} color="#FFFFFF" />
        <directionalLight position={[-3, 2, 4]} intensity={0.5} color="#64C8FF" />
        <pointLight position={[0, -2, 2]} intensity={0.8} color="#FF6B00" />
        <SpaceshipModel />
        <Stars />
      </Canvas>
    </div>
  );
}
