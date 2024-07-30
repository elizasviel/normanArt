import { useRef, useEffect, useState, useCallback } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { RigidBody, BallCollider } from "@react-three/rapier";
import { Sphere } from "@react-three/drei";
import { Coin } from "./Coin";

const COUNT = 25;
const SPAWN_RANGE_XZ = 100;
const SPAWN_RANGE_Y = 70;
const MOVEMENT_RANGE = 5;
const ENEMY_COLORS = [
  { color: "lightblue", weight: 10 },
  { color: "lightgreen", weight: 5 },
  { color: "yellow", weight: 2 },
  { color: "orange", weight: 2 },
  { color: "red", weight: 2 },
  { color: "black", weight: 1 },
];

interface Enemy {
  id: number;
  position: [number, number, number];
  isPopping: boolean;
  popStartTime: number;
  color: string;
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
          const popDuration = 2000;
          if (Date.now() - enemy.popStartTime > popDuration) {
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
}

const Enemy: React.FC<EnemyProps> = ({
  id,
  position,
  isPopping,
  onCollision,
  color,
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [opacity, setOpacity] = useState<number>(0.7);
  const [theta, setTheta] = useState<number>(2 * Math.PI);
  const [phi, setPhi] = useState<number>(2 * Math.PI);
  const [coins, setCoins] = useState<
    { id: number; position: [number, number, number] }[]
  >([]);

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
            <Coin />
            <Coin />
            <Coin />
            <Coin />
            <Coin />
          </>
        ) : null}
      </RigidBody>
    </>
  );
};

//enemy schema
//color, health, drops, speed, size,
