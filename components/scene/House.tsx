"use client";

import { animated, useSpring } from "@react-spring/three";

import { HOUSE_VISUAL } from "@/lib/data/profiles";
import { useGameStore } from "@/store/gameStore";

function HouseEquipment() {
  const profile = useGameStore((state) => state.profile);
  const equipment = useGameStore((state) => state.equipment);

  if (!profile.houseType) {
    return null;
  }

  const solarCount = equipment.find((item) => item.type === "solar")?.count ?? 0;
  const hasBattery = equipment.some((item) => item.type === "battery");
  const hasWindmill = equipment.some((item) => item.type === "windmill");

  return (
    <group>
      {Array.from({ length: solarCount }).map((_, index) => (
        <mesh
          key={`panel-${index}`}
          castShadow
          position={[-0.6 + (index % 3) * 0.55, 1.15, -0.25 + Math.floor(index / 3) * 0.42]}
          rotation={[-Math.PI / 6, 0, 0]}
        >
          <boxGeometry args={[0.42, 0.05, 0.28]} />
          <meshStandardMaterial color="#314b8f" />
        </mesh>
      ))}

      {hasBattery && (
        <mesh castShadow position={[1.05, 0.42, 0.6]}>
          <boxGeometry args={[0.34, 0.64, 0.28]} />
          <meshStandardMaterial color="#a6b7c4" />
        </mesh>
      )}

      {hasWindmill && profile.houseType === "maison" && (
        <group position={[2.4, 0, 0]}>
          <mesh castShadow position={[0, 1.2, 0]}>
            <cylinderGeometry args={[0.06, 0.08, 2.4, 8]} />
            <meshStandardMaterial color="#e8edf2" />
          </mesh>
          <mesh castShadow position={[0, 2.35, 0]} rotation={[0, 0, Math.PI / 4]}>
            <boxGeometry args={[0.9, 0.06, 0.06]} />
            <meshStandardMaterial color="#dde4ea" />
          </mesh>
          <mesh castShadow position={[0, 2.35, 0]} rotation={[0, 0, -Math.PI / 4]}>
            <boxGeometry args={[0.9, 0.06, 0.06]} />
            <meshStandardMaterial color="#dde4ea" />
          </mesh>
        </group>
      )}
    </group>
  );
}

export function House() {
  const profile = useGameStore((state) => state.profile);
  const isDaytime = useGameStore((state) => state.isDaytime);

  const houseType = profile.houseType ?? "studio";
  const visual = HOUSE_VISUAL[houseType];
  const spring = useSpring({
    scale: visual.scale,
    config: { tension: 120, friction: 14 },
  });

  const geometryByType: Record<typeof houseType, [number, number, number]> = {
    studio: [1.6, 1.2, 1.4],
    appart: [2.1, 1.55, 1.8],
    maison: [2.75, 1.8, 2.3],
  };

  const [width, height, depth] = geometryByType[houseType];
  const roofHeight = houseType === "studio" ? 0.72 : houseType === "appart" ? 0.86 : 0.98;
  const roofRadius = Math.max(width, depth) * 0.62;
  const deckDepth = houseType === "studio" ? 0.62 : houseType === "appart" ? 0.78 : 0.96;
  const sideWindowOffset = width / 2 - 0.14;

  return (
    <animated.group scale={spring.scale} position={[0, 1.02, -0.1]}>
      <mesh castShadow receiveShadow position={[0, -0.58, 0.2]}>
        <boxGeometry args={[width + 0.48, 0.18, depth + 0.58]} />
        <meshStandardMaterial color="#9a8d79" roughness={0.98} />
      </mesh>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial color="#c79f79" roughness={0.9} />
      </mesh>
      <mesh castShadow position={[0, height * 0.78, 0]}>
        <coneGeometry args={[roofRadius, roofHeight, 4]} />
        <meshStandardMaterial color="#5f666d" roughness={0.74} metalness={0.08} />
      </mesh>
      <mesh castShadow position={[0.22, height + roofHeight * 0.18, 0.18]}>
        <boxGeometry args={[0.2, 0.42, 0.2]} />
        <meshStandardMaterial color="#766a5f" roughness={0.92} />
      </mesh>
      <mesh castShadow receiveShadow position={[0, -0.08, depth / 2 + deckDepth / 2 - 0.06]}>
        <boxGeometry args={[width + 0.26, 0.08, deckDepth]} />
        <meshStandardMaterial color="#8d6d4f" roughness={0.9} />
      </mesh>
      {[-0.48, 0.48].map((x) => (
        <mesh key={`post-${x}`} castShadow position={[x * (width / 1.4), -0.32, depth / 2 + deckDepth - 0.22]}>
          <boxGeometry args={[0.08, 0.52, 0.08]} />
          <meshStandardMaterial color="#73573d" roughness={0.9} />
        </mesh>
      ))}
      <mesh position={[0, -0.12, depth / 2 + 0.04]}>
        <boxGeometry args={[0.5, 0.86, 0.08]} />
        <meshStandardMaterial color="#574536" roughness={0.86} />
      </mesh>
      <mesh position={[0.42, 0.12, depth / 2 + 0.05]}>
        <boxGeometry args={[0.48, 0.56, 0.08]} />
        <meshStandardMaterial
          color={isDaytime ? "#4b5a6d" : "#f9d66f"}
          emissive={isDaytime ? "#000000" : "#f4be4a"}
          emissiveIntensity={isDaytime ? 0 : 1.55}
          roughness={0.12}
          metalness={0.1}
        />
      </mesh>
      <mesh position={[-0.54, 0.18, depth / 2 + 0.05]}>
        <boxGeometry args={[0.42, 0.48, 0.08]} />
        <meshStandardMaterial
          color={isDaytime ? "#5b6d82" : "#ffe2a1"}
          emissive={isDaytime ? "#000000" : "#f4be4a"}
          emissiveIntensity={isDaytime ? 0 : 1.1}
          roughness={0.14}
        />
      </mesh>
      {[-0.35, 0.35].map((z, index) => (
        <mesh key={`side-window-${index}`} position={[sideWindowOffset, 0.24, z]}>
          <boxGeometry args={[0.08, 0.42, 0.42]} />
          <meshStandardMaterial
            color={isDaytime ? "#506277" : "#ffe0a3"}
            emissive={isDaytime ? "#000000" : "#f4be4a"}
            emissiveIntensity={isDaytime ? 0 : 0.9}
            roughness={0.12}
          />
        </mesh>
      ))}
      <HouseEquipment />
    </animated.group>
  );
}
