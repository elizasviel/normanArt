"use client";

import * as THREE from "three";
import React, { useRef, useState, Suspense } from "react";
import { Canvas, useFrame, ThreeElements } from "@react-three/fiber";
import { Physics, RigidBody, CuboidCollider } from "@react-three/rapier";
import { Torus, Box, Sphere, Plane } from "@react-three/drei";
import { materialRotation } from "three/examples/jsm/nodes/Nodes.js";

const Test = () => {
  return (
    <div>
      <Canvas
        style={{
          width: innerWidth,
          height: innerHeight,
          backgroundColor: "steelblue",
        }}
      >
        <spotLight
          position={[10, 10, 10]}
          angle={0.15}
          penumbra={1}
          decay={0}
          intensity={Math.PI}
        />
        <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
        <ambientLight intensity={Math.PI / 2} />

        <Suspense>
          <Physics interpolate={true} gravity={[0, -9.81, 0]} debug>
            <RigidBody
              //shared starting position that can be overwrite  children
              colliders="hull"
              restitution={1}
              type="fixed"
            >
              <Box args={[5, 5, 5]} position={[-6, 0, -4]}>
                <meshStandardMaterial transparent={true} opacity={0.2} />
              </Box>
            </RigidBody>
            <RigidBody colliders="hull" restitution={0.8}>
              <Sphere args={[0.5, 16, 16]} position={[-4, 4, -2]}>
                <meshStandardMaterial color={"hotpink"} />
              </Sphere>
            </RigidBody>
            <RigidBody>
              <Plane
                args={[10, 10]}
                position={[-2, -2, -2]}
                rotation={[-Math.PI / 2.2, 0, 0]}
              >
                <meshStandardMaterial color={"hotpink"} />
              </Plane>
            </RigidBody>
            <RigidBody>
              <Plane
                args={[10, 10]}
                position={[-2, -2, -2]}
                rotation={[-Math.PI / 1.8, Math.PI / 3.5, 0]}
              >
                <meshStandardMaterial color={"green"} />
              </Plane>
            </RigidBody>
          </Physics>
        </Suspense>
      </Canvas>
    </div>
  );
};

export default Test;

/*

const Box = (props: ThreeElements["mesh"]) => {
  const ref = useRef<THREE.Mesh>(null!);
  const [hovered, hover] = useState(false);
  const [clicked, click] = useState(false);
  useFrame((state, delta) => (ref.current.rotation.x += delta));
  return (
    <mesh
      {...props}
      ref={ref}
      scale={clicked ? 1.5 : 1}
      onClick={(event) => click(!clicked)}
      onPointerOver={(event) => hover(true)}
      onPointerOut={(event) => hover(false)}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={hovered ? "hotpink" : "orange"} />
    </mesh>
  );
};

const Ball = (props: ThreeElements["mesh"]) => {
  const ref = useRef<THREE.Mesh>(null!);
  const [hovered, hover] = useState(false);
  const [clicked, click] = useState(false);
  useFrame((state, delta) => (ref.current.rotation.x += delta));
  return (
    <mesh
      {...props}
      ref={ref}
      scale={clicked ? 1.5 : 1}
      onClick={(event) => click(!clicked)}
      onPointerOver={(event) => hover(true)}
      onPointerOut={(event) => hover(false)}
    >
      <sphereGeometry args={[1, 8, 8]} />
      <meshStandardMaterial color={hovered ? "hotpink" : "orange"} />
    </mesh>
  );
};

        <spotLight
          position={[10, 10, 10]}
          angle={0.15}
          penumbra={1}
          decay={0}
          intensity={Math.PI}
        />
        <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
        <ambientLight intensity={Math.PI / 2} />
        <Box position={[-5, 0, 0]} />

        <Box position={[5, 0, 0]} />

        <Box position={[0, 0, 3]} />

        <Box position={[0, 2, 0]} />

        <Box position={[0, -2, 0]} />

        <Ball position={[7.2, 0, 0]} />
        <Ball position={[-7.2, 0, 0]} />
 */
