import * as THREE from "three";
import React from "react";
import { Plane, Sphere } from "@react-three/drei";

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
  const buildSphere = [
    {
      args: [1, 16, 16],
      position: [0, 1, 2],
      color: "red",
    },
    {
      args: [1, 16, 16],
      position: [4, 0, 0],
      color: "green",
    },
    {
      args: [1, 16, 16],
      position: [3, 3, 3],
      color: "blue",
    },
  ];

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
        //handle undefined
      ))}
      <Plane args={[100, 100]} position={[0, 0, 0]}>
        <meshStandardMaterial color={"gray"} />
      </Plane>
    </>
  );
};
