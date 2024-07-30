import React, { useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { RigidBody } from "@react-three/rapier";
import { Sparkles } from "@react-three/drei";

export const Coin = () => {
  const coinRef = useRef<any>(null);

  useFrame((state, delta) => {
    if (coinRef.current) {
      coinRef.current.setAngvel(new THREE.Vector3(0, 10, 0), true);
    }
  });

  return (
    <RigidBody
      ref={coinRef}
      rotation={[Math.PI / 2, 0, 0]}
      gravityScale={0.5}
      restitution={0.3}
      sensor
    >
      <mesh>
        <cylinderGeometry args={[0.5, 0.5, 0.2]} />
        <meshStandardMaterial
          color="yellow"
          roughness={0}
          emissive="red"
          emissiveIntensity={1}
        />
      </mesh>
      <pointLight color="yellow" intensity={1} distance={5} />
    </RigidBody>
  );
};

//perhaps a useeffect to wake up the coin?
