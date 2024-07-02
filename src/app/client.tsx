"use client";

import * as THREE from "three";
import { Physics, usePlane, useBox } from "@react-three/cannon";

import React, { useRef, useState } from "react";
import { Canvas, useFrame, ThreeElements } from "@react-three/fiber";

const Plane = (props: ThreeElements["mesh"]) => {
  const [ref] = usePlane(() => ({ rotation: [-Math.PI / 2, 0, 0], ...props }));
  return (
    <mesh ref={ref}>
      <planeGeometry args={[100, 100]} />
    </mesh>
  );
};

const Cube = (props: ThreeElements["mesh"]) => {
  const [ref] = useBox(() => ({ mass: 1, position: [0, 5, 0], ...props }));
  return (
    <mesh ref={ref}>
      <boxGeometry />
    </mesh>
  );
};

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

const Test = () => {
  return (
    <div>
      <Canvas>
        <spotLight
          position={[10, 10, 10]}
          angle={0.15}
          penumbra={1}
          decay={0}
          intensity={Math.PI}
        />
        <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
        <ambientLight intensity={Math.PI / 2} />
        <Box position={[-1.2, 0, 0]} />
        <Box position={[1.2, 0, 0]} />
        <Box position={[3.2, 0, 0]} />
        <Ball position={[5.2, 0, 0]} />
        <Ball position={[7.2, 0, 0]} />
      </Canvas>
      <Canvas>
        <Physics>
          <Plane />
          <Cube />
        </Physics>
      </Canvas>
    </div>
  );
};

export default Test;
