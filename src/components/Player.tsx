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

const direction = new THREE.Vector3();

// "w" moves the player towards the direction the camera is facing
// player always turns to face the direction they are moving
// camera follow the player

export function Player() {
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

  //delta represents the time between frames
  useFrame((state, delta) => {
    //check for key presses
    const { forward, backward, left, right, space } = getKeys();

    //get the current linear velocity of the player
    //vector contains x, y, and z velocities
    const velocity = playerRef.current?.linvel();

    //console.log(velocity, weaponRef.current?.linvel()); velocity values are there, lock/disable probably just throws out the values

    //get camera orientation
    const cameraQuaternion = camera.quaternion;
    //(maybe) calculates the camera direction based on the camera's orientation
    const cameraDirection = new THREE.Vector3(0, 0, -1).applyQuaternion(
      cameraQuaternion
    );

    cameraDirection.y = 0; // ignore vertical rotation
    cameraDirection.normalize(); //normalize values

    const cameraRight = new THREE.Vector3(1, 0, 0).applyQuaternion(
      cameraQuaternion
    );
    cameraRight.y = 0;
    cameraRight.normalize();

    direction.set(0, 0, 0);
    if (forward) direction.add(cameraDirection);
    if (backward) direction.sub(cameraDirection);
    if (left) direction.sub(cameraRight);
    if (right) direction.add(cameraRight);
    if (space) {
      direction.y = 3;
      if (!swinging) {
        setSwinging(true);
        swingStartTime.current = Date.now();
      }
    }
    if (!space) direction.y = velocity?.y ?? 0;
    // direction.normalize(); // removed normalzation to allow for faster movement

    //.length () : Float
    //Computes the Euclidean length (straight-line length) from (0, 0, 0) to (x, y, z).

    if (direction.length() > 0) {
      playerRef.current?.setLinvel(
        { x: direction.x * SPEED, y: direction.y, z: direction.z * SPEED },
        true //true wakes, or activates, the RigidBody
      );
    }

    if (forward || backward || left || right) {
      //player should rotate only in response to these user inputs
      //compute rotation, set state, update ref
      const targetRotation = new THREE.Quaternion().setFromUnitVectors(
        new THREE.Vector3(0, 0, 1),
        direction
      );

      targetRotation.x = 0;
      targetRotation.z = 0;

      targetRotation.slerp(playerRotation, 50 * delta);

      setPlayerRotation(targetRotation);

      playerRef.current?.setRotation(playerRotation, true);
    }

    if (playerRef.current && controlsRef.current) {
      const cubePosition = playerRef.current.translation();
      controlsRef.current.target.set(
        cubePosition.x,
        cubePosition.y,
        cubePosition.z
      );
      controlsRef.current.update();
    }

    handleWeaponSwing(delta);
    updateWeaponVisibility(delta);
  });

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
      meshRef.current.scale.set(progress, progress / 2, 1);
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
      <mesh ref={meshRef} castShadow>
        <boxGeometry args={[0.5, 0.3, 6]} />
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
  >
    <mesh castShadow>
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
