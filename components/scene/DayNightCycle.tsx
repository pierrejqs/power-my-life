"use client";

import { Sky } from "@react-three/drei";
import { animated, useSpring } from "@react-spring/three";
import type { WeatherState } from "@/lib/types/game";

interface DayNightCycleProps {
  isDay: boolean;
  weatherType: WeatherState["type"];
}

export function DayNightCycle({ isDay, weatherType }: DayNightCycleProps) {
  const spring = useSpring({
    ambient: isDay ? 0.62 : 0.14,
    directional: isDay ? 1.65 : 0.28,
    hemisphere: isDay ? 0.82 : 0.18,
    sky: isDay ? "#d7efff" : "#08101d",
    config: { tension: 120, friction: 20 },
  });

  const tint =
    weatherType === "hot"
      ? "#ff8b4d"
      : weatherType === "cold"
        ? "#7ca7ff"
        : "#ffffff";

  return (
    <>
      <Sky
        distance={450000}
        sunPosition={isDay ? [6, 8, 2] : [-6, -2, -6]}
        turbidity={weatherType === "stormy" ? 9 : weatherType === "cloudy" ? 7 : 5}
        rayleigh={isDay ? 1.8 : 0.22}
        mieCoefficient={weatherType === "stormy" ? 0.06 : 0.028}
        mieDirectionalG={0.82}
      />
      <animated.ambientLight intensity={spring.ambient} color={tint} />
      <animated.hemisphereLight
        color="#dff4ff"
        groundColor="#2d3327"
        intensity={spring.hemisphere}
      />
      <animated.directionalLight
        castShadow
        position={[7, 11, 4]}
        intensity={spring.directional}
        color={tint}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={1}
        shadow-camera-far={30}
        shadow-camera-left={-12}
        shadow-camera-right={12}
        shadow-camera-top={12}
        shadow-camera-bottom={-12}
      />
      {!isDay && <pointLight position={[0.4, 1.6, 1.8]} intensity={2.8} color="#ffc36b" distance={7.5} />}
      <animated.fog attach="fog" args={[spring.sky.get(), 9, 24]} />
    </>
  );
}
