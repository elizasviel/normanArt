import { useRef, useEffect, useState, useCallback } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { RigidBody, BallCollider } from "@react-three/rapier";
import { Sphere } from "@react-three/drei";
import { Coin } from "./Coin";

import { Vector } from "three/examples/jsm/Addons.js";

const COUNT = 30;
const SPAWN_RANGE_XZ = 100;
const SPAWN_RANGE_Y = 70;
const MOVEMENT_RANGE = 5;
const ENEMY_COLORS = [
  { color: "lightblue", weight: 1 },
  { color: "lightgreen", weight: 3 },
  { color: "orange", weight: 10 },
];

interface Enemy {
  id: number;
  position: [number, number, number];
  isPopping: boolean;
  popStartTime: number;
  color: string;
  setCoins: React.Dispatch<React.SetStateAction<number>>;
}

export const Enemies: React.FC<{
  playerPosition: Vector;
  setCoins: React.Dispatch<React.SetStateAction<number>>;
}> = ({ playerPosition, setCoins }) => {
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
    const x = (Math.random() - 0.5) * SPAWN_RANGE_XZ;
    const y = Math.random() * SPAWN_RANGE_Y - 10;
    const z = (Math.random() - 0.5) * SPAWN_RANGE_XZ;
    initialPositions.current.push(new THREE.Vector3(x, y, z));

    // Weighted random selection for color
    const totalWeight = ENEMY_COLORS.reduce(
      (sum, { weight }) => sum + weight,
      0
    );
    let randomWeight = Math.random() * totalWeight;
    let selectedColor = ENEMY_COLORS[ENEMY_COLORS.length - 1].color;

    for (const { color, weight } of ENEMY_COLORS) {
      if (randomWeight <= weight) {
        selectedColor = color;
        break;
      }
      randomWeight -= weight;
    }

    return {
      id: Math.random(),
      position: [x, y, z],
      isPopping: false,
      popStartTime: 0,
      color: selectedColor,
      setCoins,
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
          const popDuration = 1000;
          const lootStayTime = 5000;
          if (Date.now() - enemy.popStartTime > popDuration + lootStayTime) {
            return createEnemy();
          }
          return enemy;
        }

        const initialPos = initialPositions.current[index];
        const time = state.clock.elapsedTime + index;
        const x = initialPos.x + Math.sin(time) * MOVEMENT_RANGE;
        const y = initialPos.y + Math.cos(time * 0.5) * MOVEMENT_RANGE;
        const z = initialPos.z + Math.sin(time * 0.7) * MOVEMENT_RANGE;

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
          playerPosition={playerPosition}
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
  color: string;
  playerPosition: Vector;
  setCoins: React.Dispatch<React.SetStateAction<number>>;
}

const Enemy: React.FC<EnemyProps> = ({
  id,
  position,
  isPopping,
  onCollision,
  color,
  playerPosition,
  setCoins,
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [opacity, setOpacity] = useState<number>(0.7);
  const [theta, setTheta] = useState<number>(2 * Math.PI);
  const [phi, setPhi] = useState<number>(2 * Math.PI);

  useEffect(() => {
    if (isPopping) {
      let startTime = Date.now();
      const popDuration = 2000; // 2 seconds for the entire pop animation

      const popAnimation = () => {
        const elapsedTime = Date.now() - startTime;
        const progress = Math.min(elapsedTime / popDuration, 1);

        // Easing function for smoother animation
        const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
        const easedProgress = easeOutCubic(progress);

        // Reduce theta and phi to zero
        setTheta(2 * Math.PI * (1 - easedProgress));
        setPhi(2 * Math.PI * (1 - easedProgress));

        if (progress < 1) {
          requestAnimationFrame(popAnimation);
        }
      };

      requestAnimationFrame(popAnimation);
    } else {
      setTheta(2 * Math.PI);
      setPhi(2 * Math.PI);
      setOpacity(0.7);
    }
  }, [isPopping]);

  return (
    <>
      <RigidBody position={position} type="fixed" sensor>
        <BallCollider args={[4]} sensor onIntersectionEnter={onCollision} />
        <Sphere ref={meshRef} args={[4, 32, 32, 0, theta, 0, phi]}>
          <meshStandardMaterial
            color={isPopping ? "red" : color}
            transparent
            opacity={opacity}
            roughness={0.1}
          />
        </Sphere>
        {isPopping ? (
          <>
            <Coin
              playerPosition={playerPosition}
              setCoins={setCoins}
              color={color}
              value={1}
            />
            <Coin
              playerPosition={playerPosition}
              setCoins={setCoins}
              color={color}
              value={5}
            />
            <Coin
              playerPosition={playerPosition}
              setCoins={setCoins}
              color={color}
              value={10}
            />
            <Coin
              playerPosition={playerPosition}
              setCoins={setCoins}
              color={color}
              value={100}
            />
            <Coin
              playerPosition={playerPosition}
              setCoins={setCoins}
              color={color}
              value={1000}
            />
          </>
        ) : null}
      </RigidBody>
    </>
  );
};

//enemy schema
//color, health, drops, speed, size,
