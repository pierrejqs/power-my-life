"use client";

import { animated, useSpring } from "@react-spring/three";
import { useMemo } from "react";
import * as THREE from "three";

import { HOUSE_VISUAL } from "@/lib/data/profiles";
import type { HouseType } from "@/lib/types/game";
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

function ApartmentBuilding({ isDaytime }: { isDaytime: boolean }) {
  const width = 2.35;
  const height = 2.25;
  const depth = 1.55;
  const roofY = height / 2 + 0.04;
  const litWindow = isDaytime ? "#53677c" : "#ffe0a3";
  const emissive = isDaytime ? "#000000" : "#f4be4a";

  return (
    <group>
      <mesh castShadow receiveShadow position={[0, -0.58, 0.12]}>
        <boxGeometry args={[width + 0.42, 0.18, depth + 0.42]} />
        <meshStandardMaterial color="#9a8d79" roughness={0.98} />
      </mesh>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial color="#b89069" roughness={0.92} />
      </mesh>
      <mesh castShadow receiveShadow position={[0, roofY, 0]}>
        <boxGeometry args={[width + 0.18, 0.14, depth + 0.16]} />
        <meshStandardMaterial color="#59646c" roughness={0.82} />
      </mesh>
      <mesh castShadow position={[-0.58, -0.75, depth / 2 + 0.04]}>
        <boxGeometry args={[0.34, 0.72, 0.08]} />
        <meshStandardMaterial color="#5b4637" roughness={0.86} />
      </mesh>
      {[-0.62, 0, 0.62].map((x) =>
        [-0.42, 0.28, 0.88].map((y) => (
          <mesh key={`front-window-${x}-${y}`} position={[x, y, depth / 2 + 0.05]}>
            <boxGeometry args={[0.34, 0.3, 0.08]} />
            <meshStandardMaterial
              color={litWindow}
              emissive={emissive}
              emissiveIntensity={isDaytime ? 0 : 1.1}
              roughness={0.14}
            />
          </mesh>
        ))
      )}
      {[-0.48, 0.18, 0.84].map((y) => (
        <mesh key={`side-window-${y}`} position={[width / 2 + 0.05, y, -0.22]}>
          <boxGeometry args={[0.08, 0.28, 0.34]} />
          <meshStandardMaterial
            color={litWindow}
            emissive={emissive}
            emissiveIntensity={isDaytime ? 0 : 0.9}
            roughness={0.14}
          />
        </mesh>
      ))}
    </group>
  );
}

function HippedRoof({
  width,
  depth,
  height,
}: {
  width: number;
  depth: number;
  height: number;
}) {
  const geometry = useMemo(() => {
    const overhang = 0.18;
    const halfWidth = width / 2 + overhang;
    const halfDepth = depth / 2 + overhang;
    const roofGeometry = new THREE.BufferGeometry();
    const vertices = new Float32Array([
      -halfWidth,
      0,
      -halfDepth,
      halfWidth,
      0,
      -halfDepth,
      0,
      height,
      0,
      halfWidth,
      0,
      -halfDepth,
      halfWidth,
      0,
      halfDepth,
      0,
      height,
      0,
      halfWidth,
      0,
      halfDepth,
      -halfWidth,
      0,
      halfDepth,
      0,
      height,
      0,
      -halfWidth,
      0,
      halfDepth,
      -halfWidth,
      0,
      -halfDepth,
      0,
      height,
      0,
    ]);

    roofGeometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
    roofGeometry.computeVertexNormals();
    return roofGeometry;
  }, [depth, height, width]);

  return (
    <mesh castShadow geometry={geometry} position={[0, 0, 0]}>
      <meshStandardMaterial color="#5f666d" roughness={0.74} metalness={0.08} side={THREE.DoubleSide} />
    </mesh>
  );
}

function PitchedHouse({ houseType, isDaytime }: { houseType: HouseType; isDaytime: boolean }) {
  const geometryByType: Record<HouseType, [number, number, number]> = {
    studio: [1.6, 1.2, 1.4],
    appart: [2.1, 1.55, 1.8],
    maison: [2.75, 1.8, 2.3],
  };

  const [width, height, depth] = geometryByType[houseType];
  const roofHeight = houseType === "studio" ? 0.72 : 0.98;
  const deckDepth = houseType === "studio" ? 0.62 : 0.96;
  const sideWindowOffset = width / 2 - 0.14;
  const roofY = height / 2;

  return (
    <group>
      <mesh castShadow receiveShadow position={[0, -0.58, 0.2]}>
        <boxGeometry args={[width + 0.48, 0.18, depth + 0.58]} />
        <meshStandardMaterial color="#9a8d79" roughness={0.98} />
      </mesh>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial color="#c79f79" roughness={0.9} />
      </mesh>
      <group position={[0, roofY, 0]}>
        <HippedRoof width={width} depth={depth} height={roofHeight} />
      </group>
      <mesh castShadow position={[0.22, height / 2 + roofHeight * 0.42, 0.18]}>
        <boxGeometry args={[0.2, 0.42, 0.2]} />
        <meshStandardMaterial color="#766a5f" roughness={0.92} />
      </mesh>
      <mesh castShadow receiveShadow position={[0, -0.08, depth / 2 + deckDepth / 2 - 0.06]}>
        <boxGeometry args={[width + 0.26, 0.08, deckDepth]} />
        <meshStandardMaterial color="#8d6d4f" roughness={0.9} />
      </mesh>
      {[-0.48, 0.48].map((x) => (
        <mesh
          key={`post-${x}`}
          castShadow
          position={[x * (width / 1.4), -0.32, depth / 2 + deckDepth - 0.22]}
        >
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
    </group>
  );
}

export function House() {
  const profile = useGameStore((state) => state.profile);
  const isDaytime = useGameStore((state) => state.isDaytime);

  const houseType = profile.houseType ?? "maison";
  const visual = HOUSE_VISUAL[houseType];
  const spring = useSpring({
    scale: visual.scale,
    config: { tension: 120, friction: 14 },
  });

  return (
    <animated.group scale={spring.scale} position={[0, 1.02, -0.1]}>
      {houseType === "appart" ? (
        <ApartmentBuilding isDaytime={isDaytime} />
      ) : (
        <PitchedHouse houseType={houseType} isDaytime={isDaytime} />
      )}
      <HouseEquipment />
    </animated.group>
  );
}
