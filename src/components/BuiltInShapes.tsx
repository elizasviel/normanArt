import * as THREE from "three";
import React from "react";
import { Sphere, Plane } from "@react-three/drei";

export const BuiltInShapes = () => {
  const sphereCoordinates = [
    {
      args: [0.5, 32, 32],
      position: [-14, 10, -14],
      color: "red",
    },
    {
      args: [0.5, 32, 32],
      position: [14, 10, -14],
      color: "blue",
    },
    {
      args: [0.5, 32, 32],
      position: [-14, 10, 14],
      color: "green",
    },
    {
      args: [0.5, 32, 32],
      position: [14, 10, 14],
      color: "yellow",
    },
    {
      args: [0.5, 32, 32],
      position: [-14, -10, -14],
      color: "purple",
    },
    {
      args: [0.5, 32, 32],
      position: [14, -10, -14],
      color: "orange",
    },
    {
      args: [0.5, 32, 32],
      position: [-14, -10, 14],
      color: "cyan",
    },
    {
      args: [0.5, 32, 32],
      position: [14, -10, 14],
      color: "magenta",
    },
  ];

  const planeCoordinates = [
    {
      args: [28, 28],
      position: [0, 0, -14],
      rotation: [0, Math.PI, 0],
      material: {
        color: "green",
        transparent: true,
        opacity: 0.7,
        side: THREE.DoubleSide,
      },
    },
    {
      args: [28, 28],
      position: [0, 10, 0],
      rotation: [-Math.PI / 2, 0, 0],
      material: {
        transparent: true,
        opacity: 0.3,
        side: THREE.DoubleSide,
      },
    },
    {
      args: [28, 28],
      position: [0, -10, 0],
      rotation: [Math.PI / 2, 0, 0],
      material: {
        transparent: true,
        opacity: 0.7,
        side: THREE.DoubleSide,
      },
    },
    {
      args: [28, 28],
      position: [-14, 0, 0],
      rotation: [0, Math.PI / 2, 0],
      material: {
        color: "lightgreen",
        transparent: true,
        opacity: 0.7,
        side: THREE.DoubleSide,
      },
    },
    {
      args: [28, 28],
      position: [14, 0, 0],
      rotation: [0, -Math.PI / 2, 0],
      material: {
        color: "lightgreen",
        transparent: true,
        opacity: 0.7,
        side: THREE.DoubleSide,
      },
    },
    {
      args: [28, 28],
      position: [0, 0, 14],
      rotation: [0, 0, 0],
      material: {
        transparent: true,
        opacity: 0.3,
        side: THREE.DoubleSide,
      },
    },
  ];
  return (
    <>
      {sphereCoordinates.map((sphere, index) => (
        <Sphere args={sphere?.args} position={sphere.position} key={index}>
          <meshStandardMaterial color={sphere.color} />
        </Sphere>
        //handle undefined
      ))}
      {planeCoordinates.map((plane, index) => (
        <Plane args={plane.args} position={plane.position} key={index}>
          <meshStandardMaterial
            color={plane?.material?.color}
            transparent={true}
            opacity={0.1}
          />
        </Plane>
        //handle undefined
      ))}
    </>
  );
};
