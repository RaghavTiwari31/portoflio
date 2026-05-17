import { useRef, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function UfoModel({ mousePos }: { mousePos: { x: number; y: number } }) {
  const groupRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const targetRotation = useRef({ x: 0, y: 0, z: 0 });

  useFrame((state) => {
    if (!groupRef.current) return;

    const time = state.clock.elapsedTime;
    
    // React to mouse
    targetRotation.current.x = mousePos.y * 0.4;
    targetRotation.current.y = mousePos.x * 0.4;
    targetRotation.current.z = -mousePos.x * 0.2;

    groupRef.current.rotation.x += (targetRotation.current.x - groupRef.current.rotation.x) * 0.05;
    groupRef.current.rotation.y += (targetRotation.current.y - groupRef.current.rotation.y) * 0.05;
    groupRef.current.rotation.z += (targetRotation.current.z - groupRef.current.rotation.z) * 0.05;

    // Hover effect
    groupRef.current.position.y = Math.sin(time * 2) * 0.15;
    
    // Rotate ring
    if (ringRef.current) {
      ringRef.current.rotation.y = time * 1.5;
    }
  });

  return (
    <group ref={groupRef} scale={1.2}>
      {/* UFO Main Body */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.8, 32, 16]} />
        <meshStandardMaterial color="#2a2a3a" metalness={0.9} roughness={0.2} />
      </mesh>
      
      {/* UFO Disc Flange */}
      <mesh position={[0, 0, 0]} scale={[1, 0.12, 1]}>
        <sphereGeometry args={[1.5, 32, 16]} />
        <meshStandardMaterial color="#1a1a2a" metalness={0.8} roughness={0.3} />
      </mesh>

      {/* UFO Dome */}
      <mesh position={[0, 0.2, 0]}>
        <sphereGeometry args={[0.5, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#64C8FF" transparent opacity={0.4} metalness={0.9} roughness={0.1} />
      </mesh>
      
      {/* Inside Dome Alien/Core */}
      <mesh position={[0, 0.15, 0]}>
        <cylinderGeometry args={[0.15, 0.25, 0.3, 16]} />
        <meshStandardMaterial color="#64C8FF" emissive="#64C8FF" emissiveIntensity={0.5} />
      </mesh>

      {/* Rotating Ring with Lights */}
      <group ref={ringRef}>
        {Array.from({ length: 8 }).map((_, i) => {
          const angle = (i / 8) * Math.PI * 2;
          const x = Math.cos(angle) * 1.45;
          const z = Math.sin(angle) * 1.45;
          return (
            <mesh key={i} position={[x, 0, z]}>
              <sphereGeometry args={[0.06, 16, 16]} />
              <meshStandardMaterial 
                color={i % 2 === 0 ? "#64C8FF" : "#FF6B6B"} 
                emissive={i % 2 === 0 ? "#64C8FF" : "#FF6B6B"}
                emissiveIntensity={2}
              />
            </mesh>
          );
        })}
      </group>
      
      {/* Bottom Thruster/Light emitter */}
      <mesh position={[0, -0.3, 0]}>
        <cylinderGeometry args={[0.3, 0.4, 0.2, 16]} />
        <meshStandardMaterial color="#111" metalness={0.8} roughness={0.5} />
      </mesh>
      <mesh position={[0, -0.4, 0]}>
        <sphereGeometry args={[0.25, 16, 16, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2]} />
        <meshStandardMaterial color="#64C8FF" emissive="#64C8FF" emissiveIntensity={2} transparent opacity={0.8} />
      </mesh>
    </group>
  );
}

export function Spaceship3D() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const maxScrollRef = useRef(1);

  useEffect(() => {
    let ticking = false;

    const updatePosition = () => {
      if (containerRef.current) {
        const scrollProgress = maxScrollRef.current > 0 ? window.scrollY / maxScrollRef.current : 0;
        const topPosition = 10 + scrollProgress * 80;
        const numCycles = 1.5; 
        const leftPosition = 50 - Math.cos(scrollProgress * Math.PI * 2 * numCycles) * 40;
        
        containerRef.current.style.top = `${topPosition}%`;
        containerRef.current.style.left = `${leftPosition}%`;
      }
      ticking = false;
    };

    const updateMaxScroll = () => {
      maxScrollRef.current = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      if (!ticking) {
        window.requestAnimationFrame(updatePosition);
        ticking = true;
      }
    };
    
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updatePosition);
        ticking = true;
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1
      });
    };

    updateMaxScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", updateMaxScroll);
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    
    // Slight delay for initial calculations
    setTimeout(updateMaxScroll, 100);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", updateMaxScroll);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="pointer-events-none fixed z-20 w-[160px] h-[160px] sm:w-[200px] sm:h-[200px] md:w-[240px] md:h-[240px] lg:w-[280px] lg:h-[280px]"
      style={{
        top: "10%",
        left: "10%",
        transform: "translate(-50%, -50%)",
      }}
    >
      {/* Tractor Beam */}
      <div 
        className="absolute left-1/2 top-[60%] w-[150px] h-[200px] sm:w-[200px] sm:h-[300px] mix-blend-screen origin-top"
        style={{
          background: "linear-gradient(to bottom, rgba(100, 200, 255, 0.25) 0%, rgba(100, 200, 255, 0) 100%)",
          clipPath: "polygon(30% 0, 70% 0, 100% 100%, 0 100%)",
          filter: "blur(8px)",
          zIndex: -1,
          transform: `translateX(-50%) rotate(${-mousePos.x * 15}deg)`,
          transition: "transform 0.1s ease-out"
        }}
      />
      {/* Central Glow */}
      <div 
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] rounded-full mix-blend-screen"
        style={{
          background: "radial-gradient(circle, rgba(100, 200, 255, 0.15) 0%, rgba(100, 200, 255, 0) 70%)",
          filter: "blur(15px)",
          zIndex: -1
        }}
      />
      <Canvas
        camera={{ position: [0, 2, 8], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 10, 5]} intensity={1.5} color="#FFFFFF" />
        <directionalLight position={[-5, 5, -5]} intensity={0.8} color="#64C8FF" />
        <UfoModel mousePos={mousePos} />
      </Canvas>
    </div>
  );
}
