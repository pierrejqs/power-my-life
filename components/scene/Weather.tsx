"use client";

import { animated, useSpring } from "@react-spring/three";
import type { WeatherState } from "@/lib/types/game";

interface WeatherProps {
  weatherType: WeatherState["type"];
}

function Cloud({
  position,
  stormy,
}: {
  position: [number, number, number];
  stormy: boolean;
}) {
  return (
    <group position={position}>
      <mesh position={[-0.55, 0.04, 0]}>
        <sphereGeometry args={[0.66, 18, 18]} />
        <meshStandardMaterial color={stormy ? "#72798a" : "#eef3f8"} roughness={0.96} />
      </mesh>
      <mesh position={[0.1, 0.18, -0.08]} scale={[1.45, 0.95, 1]}>
        <sphereGeometry args={[0.68, 18, 18]} />
        <meshStandardMaterial color={stormy ? "#62697b" : "#f7fbff"} roughness={0.95} />
      </mesh>
      <mesh position={[0.78, 0.06, -0.06]}>
        <sphereGeometry args={[0.58, 18, 18]} />
        <meshStandardMaterial color={stormy ? "#596172" : "#e4ebf3"} roughness={0.96} />
      </mesh>
    </group>
  );
}

export function Weather({ weatherType }: WeatherProps) {
  const spring = useSpring({
    groupY: weatherType === "stormy" ? 0.08 : 0,
    config: { tension: 100, friction: 18 },
  });

  return (
    <animated.group rotation-y={spring.groupY}>
      {(weatherType === "sunny" || weatherType === "hot" || weatherType === "normal") && (
        <group position={[6.2, 7.05, -0.3]}>
          <mesh>
            <sphereGeometry args={[0.72, 24, 24]} />
            <meshBasicMaterial color={weatherType === "hot" ? "#ffb25d" : "#ffd359"} />
          </mesh>
          <mesh scale={1.55}>
            <sphereGeometry args={[0.72, 24, 24]} />
            <meshBasicMaterial
              color={weatherType === "hot" ? "#ff8b4d" : "#fff0ae"}
              transparent
              opacity={0.18}
            />
          </mesh>
        </group>
      )}

      {(weatherType === "cloudy" || weatherType === "stormy" || weatherType === "cold") && (
        <>
          <Cloud position={[4.9, 6.2, -1.2]} stormy={weatherType === "stormy"} />
          {weatherType === "stormy" && (
            <>
              {Array.from({ length: 7 }).map((_, index) => (
                <mesh
                  key={`rain-${index}`}
                  position={[4.35 + index * 0.22, 5.1 - (index % 2) * 0.12, -1.15 + (index % 3) * 0.08]}
                  rotation={[0.35, 0, 0.16]}
                >
                  <boxGeometry args={[0.03, 0.48, 0.03]} />
                  <meshBasicMaterial color="#8bd0ff" transparent opacity={0.55} />
                </mesh>
              ))}
            </>
          )}
        </>
      )}
    </animated.group>
  );
}
