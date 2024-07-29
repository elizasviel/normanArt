import { RigidBody, useRevoluteJoint } from "@react-three/rapier";
import { useRef, useState, useEffect } from "react";
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

export function Player({ clicked, setClicked }) {
  const [playerRef, weaponRef, cameraRef, controlsRef] = [
    useRef(),
    useRef(),
    useRef(),
    useRef(),
  ];
  const [playerRotation, setPlayerRotation] = useState(
    () => new THREE.Quaternion()
  );
  const [swinging, setSwinging] = useState(false);
  const swingStartTime = useRef(0);

  const playerWeaponJoint = useRevoluteJoint(playerRef, weaponRef, [
    [0, 0, 0],
    [0, 0, 1],
    [0, 1, 0],
  ]);
  const [, getKeys] = useKeyboardControls();
  const { camera } = useThree();

  useEffect(() => {
    playerWeaponJoint.current?.setLimits(-Math.PI, Math.PI);
  }, []);

  useEffect(() => {
    if (clicked && !swinging) {
      setSwinging(true);
      swingStartTime.current = Date.now();
      setClicked(false);
    }
  }, [clicked, swinging, setClicked]);

  useFrame((_, delta) => {
    handleMovement(delta);
    updateCameraPosition();
    handleWeaponSwing();
  });

  // Movement and rotation logic
  const handleMovement = (delta) => {
    const { forward, backward, left, right, space } = getKeys();
    const direction = calculateMoveDirection(forward, backward, left, right);
    const velocity = playerRef.current?.linvel();
    direction.y = space ? 3 : velocity.y;

    if (direction.length() > 0) {
      playerRef.current?.setLinvel(
        { x: direction.x * SPEED, y: direction.y, z: direction.z * SPEED },
        true
      );
      updatePlayerRotation(direction, delta);
    }
  };

  const calculateMoveDirection = (forward, backward, left, right) => {
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

  const updatePlayerRotation = (direction, delta) => {
    const targetRotation = new THREE.Quaternion().setFromUnitVectors(
      new THREE.Vector3(0, 0, 1),
      direction
    );
    targetRotation.x = targetRotation.z = 0;
    targetRotation.slerp(playerRotation, 50 * delta);
    setPlayerRotation(targetRotation);
    playerRef.current.setRotation(targetRotation);
  };

  // Camera update
  const updateCameraPosition = () => {
    if (playerRef.current && controlsRef.current) {
      controlsRef.current.target.copy(playerRef.current.translation());
      controlsRef.current.update();
    }
  };

  // Weapon swing logic
  const handleWeaponSwing = () => {
    if (swinging) {
      const elapsedTime = (Date.now() - swingStartTime.current) / 1000;
      if (elapsedTime < SWING_DURATION) {
        const swingProgress = elapsedTime / SWING_DURATION;
        playerWeaponJoint.current?.configureMotorPosition(
          Math.PI * 2 * swingProgress,
          1000,
          100
        );
      } else {
        playerWeaponJoint.current?.configureMotorPosition(0, 1000, 100);
        setSwinging(false);
      }
    }
  };

  // Render
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
        <WeaponMesh ref={weaponRef} />
        <PlayerMesh ref={playerRef} />
      </group>
    </>
  );
}

// Separate components for Weapon and Player meshes
const WeaponMesh = React.forwardRef((props, ref) => (
  <RigidBody
    colliders="hull"
    restitution={0}
    ccd={true}
    ref={ref}
    dominanceGroup={1}
    lockRotations={false}
    sensor
  >
    <mesh position={[0, 0, 1]}>
      <boxGeometry args={[0.5, 0.1, 6]} />
      <meshStandardMaterial color="pink" />
    </mesh>
  </RigidBody>
));

const PlayerMesh = React.forwardRef((props, ref) => (
  <RigidBody
    colliders="hull"
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
