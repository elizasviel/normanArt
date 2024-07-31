import React, { useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { RigidBody } from "@react-three/rapier";
import { useState } from "react";

import { Vector } from "three/examples/jsm/Addons.js";

interface CoinProps {
  playerPosition: Vector;
  setCoins: React.Dispatch<React.SetStateAction<number>>;
  color: string;
  value: number;
}

export const Coin = ({ playerPosition, setCoins, color, value }: CoinProps) => {
  const coinRef = useRef<any>(null);
  const [isCollected, setIsCollected] = useState(false);

  const handleCollision = (event: any) => {
    const collidingBody = event.other;
    if (collidingBody && collidingBody.rigidBodyObject.name === "player") {
      setIsCollected(true);
      setCoins((prev) => prev + 1);
    }
  };

  useFrame((state, delta) => {
    if (coinRef.current && !isCollected) {
      // Spin the coin
      coinRef.current.setAngvel({ x: 0, y: 10, z: 0 }, true);

      // Get coin position
      const coinPosition = coinRef.current.translation();
      const coinVector3 = new THREE.Vector3(
        coinPosition.x,
        coinPosition.y,
        coinPosition.z
      );

      // Calculate direction and distance to player
      const direction = new THREE.Vector3()
        .subVectors(playerPosition, coinVector3)
        .normalize();
      const distance = coinVector3.distanceTo(playerPosition);

      // Apply attraction force if player is within range
      const attractionRange = 15; // Adjust this value as needed
      if (distance < attractionRange) {
        const forceMagnitude = 5 / (distance * distance); // Inverse square law
        const force = direction.multiplyScalar(forceMagnitude);
        coinRef.current.applyImpulse(
          { x: force.x, y: force.y, z: force.z },
          true
        );
      }
    }
  });

  if (isCollected) {
    return null;
  } else {
    return (
      <RigidBody
        ref={coinRef}
        rotation={[Math.PI / 2, 0, 0]}
        gravityScale={0.5}
        restitution={0.3}
        onCollisionEnter={handleCollision}
        enabledRotations={[false, true, false]}
        name="coin"
      >
        <mesh>
          <cylinderGeometry args={[0.5, 0.5, 0.2]} />
          <meshPhongMaterial
            color={color}
            emissive={color}
            emissiveIntensity={0.5}
            shininess={100}
          />
        </mesh>
        <pointLight intensity={1} color={"yellow"} />
      </RigidBody>
    );
  }
};
