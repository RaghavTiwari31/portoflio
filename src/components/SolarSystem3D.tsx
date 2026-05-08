import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

type PlanetData = {
  name: string;
  orbitRadius: number;
  size: number;
  color: string;
  speed: number;
  hasRing?: boolean;
  ringColor?: string;
  tilt?: number;
};

const PLANETS: PlanetData[] = [
  { name: "Mercury", orbitRadius: 1.5, size: 0.08, color: "#B5A642", speed: 1.6 },
  { name: "Venus", orbitRadius: 2.0, size: 0.12, color: "#E6C87A", speed: 1.2 },
  { name: "Earth", orbitRadius: 2.6, size: 0.13, color: "#4A90D9", speed: 1.0, tilt: 23.5 },
  { name: "Mars", orbitRadius: 3.2, size: 0.1, color: "#CD5C5C", speed: 0.8 },
  { name: "Jupiter", orbitRadius: 4.2, size: 0.35, color: "#D4A574", speed: 0.4 },
  { name: "Saturn", orbitRadius: 5.2, size: 0.3, color: "#F4D58D", speed: 0.3, hasRing: true, ringColor: "#F4D58D" },
  { name: "Uranus", orbitRadius: 6.0, size: 0.2, color: "#7EC8E3", speed: 0.2, tilt: 98 },
  { name: "Neptune", orbitRadius: 6.8, size: 0.18, color: "#4169E1", speed: 0.15 },
];

function Sun() {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.003;
    }
    if (glowRef.current) {
      const scale = 1.15 + Math.sin(state.clock.elapsedTime * 0.6) * 0.03;
      glowRef.current.scale.setScalar(scale);
    }
  });

  return (
    <group>
      {/* Subtle outer glow */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[0.58, 32, 32]} />
        <meshBasicMaterial color="#FFAA00" transparent opacity={0.15} />
      </mesh>
      {/* Bright sun surface */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshBasicMaterial color="#FFE066" />
      </mesh>
    </group>
  );
}

function Planet({ data, index }: { data: PlanetData; index: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const initialAngle = useMemo(() => (index * Math.PI * 2) / 8 + Math.random() * 0.5, [index]);

  useFrame((state) => {
    if (groupRef.current) {
      const time = state.clock.elapsedTime * data.speed * 0.3;
      const angle = initialAngle + time;
      groupRef.current.position.x = Math.cos(angle) * data.orbitRadius;
      groupRef.current.position.z = Math.sin(angle) * data.orbitRadius;
      // Add slight vertical oscillation for 3D effect
      groupRef.current.position.y = Math.sin(angle * 2) * 0.1;
    }
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Planet sphere */}
      <mesh ref={meshRef} rotation={data.tilt ? [0, 0, (data.tilt * Math.PI) / 180] : undefined}>
        <sphereGeometry args={[data.size, 24, 24]} />
        <meshStandardMaterial
          color={data.color}
          roughness={0.7}
          metalness={0.1}
        />
      </mesh>
      {/* Saturn's ring */}
      {data.hasRing && (
        <mesh rotation={[Math.PI / 2.5, 0, 0]}>
          <ringGeometry args={[data.size * 1.4, data.size * 2.2, 32]} />
          <meshBasicMaterial
            color={data.ringColor}
            transparent
            opacity={0.6}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}
    </group>
  );
}

function OrbitRing({ radius }: { radius: number }) {
  const points = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i <= 64; i++) {
      const angle = (i / 64) * Math.PI * 2;
      pts.push(new THREE.Vector3(Math.cos(angle) * radius, 0, Math.sin(angle) * radius));
    }
    return pts;
  }, [radius]);

  const geometry = useMemo(() => {
    return new THREE.BufferGeometry().setFromPoints(points);
  }, [points]);

  return (
    <line geometry={geometry}>
      <lineBasicMaterial color="#ffffff" transparent opacity={0.08} />
    </line>
  );
}

function SolarSystemScene() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.0005;
    }
  });

  return (
    <group ref={groupRef} rotation={[0.4, 0, 0.1]}>
      <Sun />
      {PLANETS.map((planet, i) => (
        <group key={planet.name}>
          <OrbitRing radius={planet.orbitRadius} />
          <Planet data={planet} index={i} />
        </group>
      ))}
    </group>
  );
}

export function SolarSystem3D() {
  return (
    <div className="absolute right-[-5%] top-1/2 -translate-y-1/2 w-[400px] h-[400px] md:w-[480px] md:h-[480px] lg:w-[520px] lg:h-[520px] xl:w-[580px] xl:h-[580px] opacity-90">
      <Canvas
        camera={{ position: [0, 8, 12], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.35} />
        <pointLight position={[0, 0, 0]} intensity={3} color="#FFCC00" distance={15} />
        <pointLight position={[0, 0, 0]} intensity={1.5} color="#FF8C00" distance={8} />
        <SolarSystemScene />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.3}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 2}
        />
      </Canvas>
    </div>
  );
}
