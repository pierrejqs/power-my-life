"use client";

import { ContactShadows } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";

import { useGameStore } from "@/store/gameStore";
import { DayNightCycle } from "@/components/scene/DayNightCycle";
import { Environment } from "@/components/scene/Environment";
import { House } from "@/components/scene/House";
import { Weather } from "@/components/scene/Weather";

export function Scene() {
  const isDaytime = useGameStore((state) => state.isDaytime);
  const weatherType = useGameStore((state) => state.weather.type);

  return (
    <div className="absolute inset-0 bg-[#c6c7cf]">
      <Canvas
        shadows
        orthographic
        dpr={[1, 1.75]}
        gl={{ antialias: true }}
        camera={{ position: [11, 10.5, 11], zoom: 44 }}
      >
        <color attach="background" args={["#c6c7cf"]} />
        <group position={[0, -0.45, 0]}>
          <DayNightCycle isDay={isDaytime} weatherType={weatherType} />
          <Environment />
          <Weather weatherType={weatherType} />
          <House />
          <ContactShadows position={[0, -0.56, 0.4]} opacity={0.42} scale={18} blur={2.8} far={8} />
        </group>
      </Canvas>
    </div>
  );
}
