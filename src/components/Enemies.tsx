import { useRef, useEffect, useState, useCallback } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { RigidBody, CuboidCollider } from "@react-three/rapier";
import { Sphere } from "@react-three/drei";

const COUNT = 10;
const SPAWN_RANGE = 20;
const MOVEMENT_RANGE = 2;

interface Enemy {
  id: number;
  position: [number, number, number];
  isPopping: boolean;
  popStartTime: number;
}

export const Enemies: React.FC = () => {
  const [enemies, setEnemies] = useState<Enemy[]>([]);
  const initialPositions = useRef<THREE.Vector3[]>([]);

  const spawnEnemies = useCallback(() => {
    const newEnemies: Enemy[] = [];
    for (let i = 0; i < COUNT; i++) {
      newEnemies.push(createEnemy());
    }
    setEnemies(newEnemies);
  }, []);

  useEffect(() => {
    spawnEnemies();
  }, [spawnEnemies]);

  const createEnemy = (): Enemy => {
    const x = (Math.random() - 0.5) * SPAWN_RANGE;
    const y = (Math.random() - 0.5) * SPAWN_RANGE;
    const z = (Math.random() - 0.5) * SPAWN_RANGE;
    initialPositions.current.push(new THREE.Vector3(x, y, z));
    return {
      id: Math.random(),
      position: [x, y, z],
      isPopping: false,
      popStartTime: 0,
    };
  };

  const handleCollision = (enemyId: number) => {
    setEnemies((prevEnemies) =>
      prevEnemies.map((enemy) =>
        enemy.id === enemyId
          ? { ...enemy, isPopping: true, popStartTime: Date.now() }
          : enemy
      )
    );
  };

  useFrame((state) => {
    setEnemies((prevEnemies) =>
      prevEnemies.map((enemy, index) => {
        if (enemy.isPopping) {
          const popDuration = 500; // 0.5 second pop animation
          if (Date.now() - enemy.popStartTime > popDuration) {
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

interface EnemyProps {
  id: number;
  position: [number, number, number];
  isPopping: boolean;
  onCollision: () => void;
}

const Enemy: React.FC<EnemyProps> = ({
  id,
  position,
  isPopping,
  onCollision,
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [scale, setScale] = useState<number>(1);

  useEffect(() => {
    if (isPopping) {
      const popAnimation = () => {
        setScale((prevScale) => {
          const newScale = prevScale * 1.05;
          return newScale > 1.5 ? 1.5 : newScale;
        });
      };
      const intervalId = setInterval(popAnimation, 16);
      return () => clearInterval(intervalId);
    }
  }, [isPopping]);

  return (
    <RigidBody position={position} type="fixed">
      <CuboidCollider
        args={[0.5, 0.5, 0.5]}
        sensor
        onIntersectionEnter={onCollision}
      />
      <Sphere ref={meshRef} args={[0.5, 16, 16]} scale={scale}>
        <meshStandardMaterial
          color={isPopping ? "red" : "lightblue"}
          transparent
          opacity={0.7}
        />
      </Sphere>
    </RigidBody>
  );
};
