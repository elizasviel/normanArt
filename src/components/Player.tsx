import {
  RigidBody,
  useRevoluteJoint,
  RapierRigidBody,
} from "@react-three/rapier";
import { useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import React from "react";
import {
  useKeyboardControls,
  PerspectiveCamera,
  OrbitControls,
} from "@react-three/drei";
import * as THREE from "three";

const SPEED = 5;
const SWING_DURATION = 0.5;
const WEAPON_APPEAR_DURATION = 0.3;

interface PlayerProps {
  clicked: boolean;
  setClicked: React.Dispatch<React.SetStateAction<boolean>>;
}

export function Player({ clicked, setClicked }: PlayerProps) {
  const playerRef = useRef<RapierRigidBody>(null);
  const weaponRef = useRef<RapierRigidBody>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const controlsRef: any = useRef(null);
  const [playerRotation, setPlayerRotation] = useState(
    () => new THREE.Quaternion()
  );
  const [swinging, setSwinging] = useState(false);
  const [weaponVisible, setWeaponVisible] = useState(false);
  const swingStartTime = useRef(0);
  const weaponAppearProgress = useRef(0);

  const playerWeaponJoint = useRevoluteJoint(playerRef, weaponRef, [
    [0, 0, 0],
    [0, 0, 0],
    [0, 1, 0],
  ]);
  const [, getKeys] = useKeyboardControls();
  const { camera } = useThree();

  useFrame((_, delta) => {
    playerWeaponJoint.current?.setLimits(-Math.PI, Math.PI);

    handleMovement(delta);
    updateCameraPosition();
    handleWeaponSwing(delta);
    updateWeaponVisibility(delta);
  });

  const handleMovement = (delta: number) => {
    const { forward, backward, left, right, space } = getKeys();
    const direction = calculateMoveDirection(forward, backward, left, right);
    const velocity = playerRef.current?.linvel();

    if (space && !swinging) {
      setSwinging(true);
      swingStartTime.current = Date.now();
      setClicked(false);
    }
    direction.y = space ? 3 : velocity?.y ?? 0;

    if (direction.length() > 0) {
      playerRef.current?.setLinvel(
        { x: direction.x * SPEED, y: direction.y, z: direction.z * SPEED },
        true
      );
      updatePlayerRotation(direction, delta);
    }
  };

  const calculateMoveDirection = (
    forward: boolean,
    backward: boolean,
    left: boolean,
    right: boolean
  ) => {
    const cameraDirection = new THREE.Vector3(0, 0, -1)
      .applyQuaternion(camera.quaternion)
      .setY(0)
      .normalize();
    const cameraRight = new THREE.Vector3(1, 0, 0)
      .applyQuaternion(camera.quaternion)
      .setY(0)
      .normalize();

    return new THREE.Vector3()
      .add(
        forward
          ? cameraDirection
          : backward
          ? cameraDirection.negate()
          : new THREE.Vector3()
      )
      .add(
        left ? cameraRight.negate() : right ? cameraRight : new THREE.Vector3()
      );
  };

  const updatePlayerRotation = (direction: THREE.Vector3, delta: number) => {
    const targetRotation = new THREE.Quaternion().setFromUnitVectors(
      new THREE.Vector3(0, 0, 1),
      direction
    );
    targetRotation.x = targetRotation.z = 0;
    targetRotation.slerp(playerRotation, 50 * delta);
    setPlayerRotation(targetRotation);
    playerRef.current?.setRotation(targetRotation, true);
  };

  const updateCameraPosition = () => {
    if (playerRef.current && controlsRef.current) {
      controlsRef.current.target.copy(playerRef.current.translation());
      controlsRef.current.update();
    }
  };

  const handleWeaponSwing = (delta: number) => {
    if (swinging) {
      const elapsedTime = (Date.now() - swingStartTime.current) / 1000;
      if (elapsedTime < SWING_DURATION) {
        setWeaponVisible(true);
        const swingProgress = elapsedTime / SWING_DURATION;
        playerWeaponJoint.current?.configureMotorPosition(
          Math.PI * 2 * swingProgress,
          1000,
          100
        );
      } else {
        playerWeaponJoint.current?.configureMotorPosition(0, 1000, 100);
        setSwinging(false);
        setWeaponVisible(false);
      }
    }
  };

  const updateWeaponVisibility = (delta: number) => {
    if (weaponVisible && weaponAppearProgress.current < 1) {
      weaponAppearProgress.current = Math.min(
        weaponAppearProgress.current + delta / WEAPON_APPEAR_DURATION,
        1
      );
    } else if (!weaponVisible && weaponAppearProgress.current > 0) {
      weaponAppearProgress.current = Math.max(
        weaponAppearProgress.current - delta / WEAPON_APPEAR_DURATION,
        0
      );
    }
  };

  return (
    <>
      <PerspectiveCamera ref={cameraRef} fov={75} />
      <OrbitControls
        ref={controlsRef}
        minDistance={7}
        maxDistance={7}
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={0.3}
      />
      <group position={[5, 0, 5]}>
        <PlayerMesh ref={playerRef} />
        <WeaponMesh
          ref={weaponRef}
          appearProgress={weaponAppearProgress.current}
        />
      </group>
    </>
  );
}

const WeaponMesh = React.forwardRef<
  RapierRigidBody,
  { appearProgress: number }
>((props, ref) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (meshRef.current) {
      const progress = props.appearProgress;
      meshRef.current.scale.set(progress, 0.0, 1);
    }
  });

  return (
    <RigidBody
      colliders="cuboid"
      restitution={0}
      ccd={true}
      ref={ref}
      dominanceGroup={1}
      lockRotations={false}
      sensor
    >
      <mesh ref={meshRef}>
        <boxGeometry args={[0.5, 0.1, 6]} />
        <meshStandardMaterial color="pink" />
      </mesh>
    </RigidBody>
  );
});

WeaponMesh.displayName = "WeaponMesh";

const PlayerMesh = React.forwardRef<RapierRigidBody>((props, ref) => (
  <RigidBody
    colliders="cuboid"
    restitution={0}
    ccd={true}
    ref={ref}
    lockRotations={true}
    dominanceGroup={1}
  >
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      {["pink", "green", "blue", "yellow", "purple", "orange"].map(
        (color, index) => (
          <meshStandardMaterial
            key={index}
            color={color}
            attach={`material-${index}`}
          />
        )
      )}
    </mesh>
  </RigidBody>
));

PlayerMesh.displayName = "PlayerMesh";
