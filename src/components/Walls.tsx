import React from "react";
import { RigidBody } from "@react-three/rapier";
import * as Three from "three";

export const Walls: React.FC = () => {
  return (
    <>
      <RigidBody type="fixed">
        <mesh position={[0, -2, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <planeGeometry args={[30, 30]} />
          <meshStandardMaterial color="gray" side={Three.DoubleSide} />
        </mesh>
      </RigidBody>
      {["orange", "pink", "green", "red"].map((color, index) => (
        <RigidBody key={color} type="fixed">
          <mesh
            position={[
              index < 2 ? 0 : index === 2 ? 15 : -15,
              -2,
              index < 2 ? (index === 0 ? 15 : -15) : 0,
            ]}
            rotation={[
              0,
              index < 2 ? 0 : (Math.PI / 2) * (index === 2 ? 1 : -1),
              0,
            ]}
          >
            <planeGeometry args={[30, 30]} />
            <meshStandardMaterial
              color={color}
              side={Three.DoubleSide}
              transparent={true}
              opacity={0.5}
            />
          </mesh>
        </RigidBody>
      ))}
    </>
  );
};
