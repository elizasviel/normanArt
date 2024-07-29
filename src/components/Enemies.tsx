import { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { RigidBody, CuboidCollider } from "@react-three/rapier";

const COUNT = 10;
const SPAWN_RANGE = 20;
const MOVEMENT_RANGE = 2;

export const Enemies = () => {
  const [enemies, setEnemies] = useState([]);
  const initialPositions = useRef([]);

  useEffect(() => {
    spawnEnemies();
  }, []);

  const spawnEnemies = () => {
    const newEnemies = [];
    for (let i = 0; i < COUNT; i++) {
      newEnemies.push(createEnemy());
    }
    setEnemies(newEnemies);
  };

  const createEnemy = () => {
    const x = (Math.random() - 0.5) * SPAWN_RANGE;
    const y = (Math.random() - 0.5) * SPAWN_RANGE;
    const z = (Math.random() - 0.5) * SPAWN_RANGE;
    initialPositions.current.push(new THREE.Vector3(x, y, z));
    return {
      id: Math.random(),
      position: [x, y, z],
      isDead: false,
      deathTime: 0,
    };
  };

  const handleCollision = (enemyId) => {
    setEnemies((prevEnemies) =>
      prevEnemies.map((enemy) =>
        enemy.id === enemyId
          ? { ...enemy, isDead: true, deathTime: Date.now() }
          : enemy
      )
    );
  };

  useFrame((state) => {
    setEnemies((prevEnemies) =>
      prevEnemies.map((enemy, index) => {
        if (enemy.isDead) {
          const deathDuration = 1000; // 1 second death animation
          if (Date.now() - enemy.deathTime > deathDuration) {
            return createEnemy(); // Respawn
          }
          return enemy;
        }

        const initialPos = initialPositions.current[index];
        const offset =
          Math.sin(state.clock.elapsedTime + index) * MOVEMENT_RANGE;
        const x = initialPos.x + offset;
        const y =
          initialPos.y +
          Math.cos(state.clock.elapsedTime + index) * MOVEMENT_RANGE;
        const z = initialPos.z;

        return { ...enemy, position: [x, y, z] };
      })
    );
  });

  return (
    <>
      {enemies.map((enemy) => (
        <Enemy
          key={enemy.id}
          {...enemy}
          onCollision={() => handleCollision(enemy.id)}
        />
      ))}
    </>
  );
};

const Enemy = ({ id, position, isDead, onCollision }) => {
  const meshRef = useRef();

  useEffect(() => {
    if (isDead) {
      // Play death animation
      meshRef.current.scale.y = 0.1; // Flatten the enemy
    } else {
      meshRef.current.scale.y = 1; // Reset scale
    }
  }, [isDead]);

  return (
    <RigidBody position={position} type="fixed">
      <CuboidCollider
        args={[0.5, 0.5, 0.5]}
        sensor
        onIntersectionEnter={onCollision}
      />
      <mesh ref={meshRef}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={isDead ? "red" : "green"} />
      </mesh>
    </RigidBody>
  );
};
