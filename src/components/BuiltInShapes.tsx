import * as THREE from "three";
import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Sphere } from "@react-three/drei";

type sphereArgs = [
  radius?: number | undefined,
  widthSegments?: number | undefined,
  heightSegments?: number | undefined,
  phiStart?: number | undefined,
  phiLength?: number | undefined,
  thetaStart?: number | undefined,
  thetaLength?: number | undefined
];
type spherePosition = [x: number, y: number, z: number];

export const BuiltInShapes = () => {
  //reference to the test cube
  const testCube = useRef<any>();
  const buildSphere = [
    {
      args: [1, 16, 16],
      position: [3, 3, 3],
      color: "blue",
    },
  ];

  useFrame((state, delta) => {
    const { clock } = state;
    const elapsedTime = clock.getElapsedTime();
    testCube.current.rotation.x = elapsedTime;
  });

  return (
    <>
      {buildSphere.map((sphere, index) => (
        <Sphere
          args={sphere.args as sphereArgs}
          position={sphere.position as spherePosition}
          key={index}
        >
          <meshStandardMaterial color={sphere.color} />
        </Sphere>
      ))}
      <mesh position={[2, 2, 2]} ref={testCube}>
        <boxGeometry args={[2, 2, 2]} />
        <meshStandardMaterial color="black" opacity={0.2} transparent={true} />
      </mesh>
    </>
  );
};
