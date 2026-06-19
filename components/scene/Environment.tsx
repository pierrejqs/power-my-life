"use client";

function Tree({
  position,
  scale = 1,
}: {
  position: [number, number, number];
  scale?: number;
}) {
  return (
    <group position={position} scale={scale}>
      <mesh castShadow position={[0, 0.36, 0]}>
        <cylinderGeometry args={[0.08, 0.12, 0.72, 8]} />
        <meshStandardMaterial color="#6f5136" roughness={0.92} />
      </mesh>
      <mesh castShadow position={[0, 1.1, 0.08]}>
        <sphereGeometry args={[0.48, 18, 18]} />
        <meshStandardMaterial color="#597f4e" roughness={0.95} />
      </mesh>
      <mesh castShadow position={[-0.22, 0.94, -0.12]}>
        <sphereGeometry args={[0.38, 16, 16]} />
        <meshStandardMaterial color="#4f7244" roughness={0.94} />
      </mesh>
      <mesh castShadow position={[0.28, 0.98, -0.1]}>
        <sphereGeometry args={[0.34, 16, 16]} />
        <meshStandardMaterial color="#6f945f" roughness={0.94} />
      </mesh>
    </group>
  );
}

function Shrub({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  return (
    <mesh castShadow position={position} scale={scale}>
      <sphereGeometry args={[0.18, 14, 14]} />
      <meshStandardMaterial color="#6c9458" roughness={0.98} />
    </mesh>
  );
}

function Rock({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  return (
    <mesh castShadow receiveShadow position={position} scale={scale} rotation={[0.2, 0.4, 0.15]}>
      <dodecahedronGeometry args={[0.36, 0]} />
      <meshStandardMaterial color="#8f9397" roughness={1} />
    </mesh>
  );
}

export function Environment() {
  return (
    <group>
      <mesh receiveShadow position={[0.45, -1.55, 0.65]} rotation={[0.04, Math.PI / 4, 0]}>
        <boxGeometry args={[8.4, 2.6, 8.4]} />
        <meshStandardMaterial color="#80756d" roughness={1} />
      </mesh>
      <mesh receiveShadow position={[0.45, -0.26, 0.65]} rotation={[0.04, Math.PI / 4, 0]}>
        <boxGeometry args={[7.4, 0.28, 7.4]} />
        <meshStandardMaterial color="#b4aa8e" roughness={1} />
      </mesh>
      <mesh receiveShadow position={[0.1, -0.04, 0.15]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[3.7, 40]} />
        <meshStandardMaterial color="#6f8a58" roughness={0.98} />
      </mesh>
      <mesh position={[1.95, -0.02, 1.8]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[2.15, 36]} />
        <meshPhysicalMaterial
          color="#4fa7c8"
          roughness={0.18}
          metalness={0.04}
          transmission={0.26}
          transparent
          opacity={0.9}
          reflectivity={0.3}
          clearcoat={0.45}
        />
      </mesh>
      <mesh position={[1.6, 0.02, 1.45]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.9, 2.45, 36]} />
        <meshStandardMaterial color="#ddd4bd" roughness={0.96} />
      </mesh>
      <mesh position={[-0.1, 0.03, 1.15]} rotation={[-Math.PI / 2, 0.26, 0]} receiveShadow>
        <planeGeometry args={[1.7, 4.2]} />
        <meshStandardMaterial color="#b99f7e" roughness={1} />
      </mesh>
      <mesh position={[0.2, 0.04, 0.65]} rotation={[-Math.PI / 2, 0.28, 0]} receiveShadow>
        <planeGeometry args={[0.78, 2.1]} />
        <meshStandardMaterial color="#8d877d" roughness={0.92} />
      </mesh>
      <mesh position={[2.95, 0.08, -0.25]} castShadow receiveShadow rotation={[0.08, 0.2, -0.2]}>
        <boxGeometry args={[0.9, 0.24, 0.9]} />
        <meshStandardMaterial color="#8f9498" roughness={0.96} />
      </mesh>
      <mesh position={[3.15, 0.32, -0.05]} castShadow>
        <boxGeometry args={[0.42, 0.32, 0.42]} />
        <meshStandardMaterial color="#b8bfc5" roughness={0.74} />
      </mesh>
      <Tree position={[-2.8, 0.04, -1.95]} scale={1.25} />
      <Tree position={[-2.1, 0.04, 1.9]} scale={1.05} />
      <Tree position={[2.95, 0.04, 2.85]} scale={1.18} />
      <Tree position={[3.45, 0.04, 0.9]} scale={0.94} />
      <Tree position={[0.7, 0.04, -2.8]} scale={1.15} />
      <Shrub position={[-1.9, 0.08, 0.75]} scale={1.15} />
      <Shrub position={[-0.55, 0.08, 2.25]} />
      <Shrub position={[1.05, 0.08, -1.9]} scale={0.9} />
      <Shrub position={[2.2, 0.08, 0.55]} scale={1.2} />
      <Rock position={[2.75, 0.16, 1.1]} scale={0.85} />
      <Rock position={[2.25, 0.1, 2.9]} scale={0.95} />
      <Rock position={[-2.35, 0.1, -2.55]} scale={0.7} />
    </group>
  );
}
