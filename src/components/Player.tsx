import { RigidBody } from "@react-three/rapier";
import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import {
  useKeyboardControls,
  PerspectiveCamera,
  PointerLockControls,
} from "@react-three/drei";
import * as THREE from "three";

const SPEED = 5;
const direction = new THREE.Vector3();
const frontVector = new THREE.Vector3();
const sideVector = new THREE.Vector3();

export function Player() {
  const ref = useRef<any>();
  const currentRotation = useRef(new THREE.Quaternion(0, 0, 0, 1));
  const targetRotation = useRef(new THREE.Quaternion(0, 0, 0, 1));
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const cameraPosition = useRef(new THREE.Vector3(0, 5, 5));

  const [, get] = useKeyboardControls();
  useFrame((state, delta) => {
    const { forward, backward, left, right, space } = get();

    const velocity = ref.current?.linvel();

    // movement
    frontVector.set(0, 0, Number(backward) - Number(forward));
    sideVector.set(Number(left) - Number(right), 0, 0);

    //sets 1/0 for front and side vector based on the keyboard input

    direction.subVectors(frontVector, sideVector).normalize();

    if (frontVector.length() > 0 || sideVector.length() > 0) {
      let rotationQuaternion = new THREE.Quaternion();

      switch (true) {
        // Forward
        case frontVector.z < 0 && sideVector.x === 0:
          rotationQuaternion.setFromEuler(new THREE.Euler(0, 0, 0));
          break;
        // Backward (180 degrees)
        case frontVector.z > 0 && sideVector.x === 0:
          rotationQuaternion.setFromEuler(new THREE.Euler(0, Math.PI, 0));
          break;
        // Right
        case sideVector.x < 0 && frontVector.z === 0:
          rotationQuaternion.setFromEuler(new THREE.Euler(0, -Math.PI / 2, 0));
          break;
        // Left
        case sideVector.x > 0 && frontVector.z === 0:
          rotationQuaternion.setFromEuler(new THREE.Euler(0, Math.PI / 2, 0));
          break;
        // Diagonal: Forward-Right
        case frontVector.z < 0 && sideVector.x < 0:
          rotationQuaternion.setFromEuler(new THREE.Euler(0, -Math.PI / 4, 0));
          break;
        // Diagonal: Forward-Left
        case frontVector.z < 0 && sideVector.x > 0:
          rotationQuaternion.setFromEuler(new THREE.Euler(0, Math.PI / 4, 0));
          break;
        // Diagonal: Backward-Right
        case frontVector.z > 0 && sideVector.x < 0:
          rotationQuaternion.setFromEuler(new THREE.Euler(0, -Math.PI / 4, 0));
          break;
        // Diagonal: Backward-Left
        case frontVector.z > 0 && sideVector.x > 0:
          rotationQuaternion.setFromEuler(new THREE.Euler(0, Math.PI / 4, 0));
          break;
      }

      targetRotation.current.copy(rotationQuaternion);

      currentRotation.current.slerp(targetRotation.current, 5 * delta);

      ref.current?.setRotation(currentRotation.current);
    }

    if (ref.current && cameraRef.current) {
      const playerPosition = ref.current.translation();
      cameraPosition.current.set(
        playerPosition.x,
        playerPosition.y + 3,
        playerPosition.z + 3
      );
      cameraRef.current.position.lerp(cameraPosition.current, 0.1);
      cameraRef.current.lookAt(
        playerPosition.x,
        playerPosition.y + 3,
        playerPosition.z
      );
    }

    // Log rotation for debugging
    //console.log("Rotation:", ref.current?.rotation());

    //direction is also a vector 3
    //I think subvectors takes two vectors and does something
    //multiplyScar multiples vectors by speed

    if (space) {
      velocity.y = 3;
    }

    ref.current?.setLinvel(
      { x: direction.x, y: velocity.y, z: direction.z },
      true
    );
  });

  return (
    <>
      <PerspectiveCamera
        ref={cameraRef}
        makeDefault
        fov={75}
      ></PerspectiveCamera>

      <RigidBody
        colliders="hull"
        restitution={0}
        ccd={true}
        ref={ref}
        enabledRotations={[false, true, false]}
      >
        <mesh position={[0, 3, 0]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="gray" attach="material-0" />{" "}
          {/* Right face */}
          <meshStandardMaterial color="green" attach="material-1" />{" "}
          {/* Left face */}
          <meshStandardMaterial color="blue" attach="material-2" />{" "}
          {/* Top face */}
          <meshStandardMaterial color="yellow" attach="material-3" />{" "}
          {/* Bottom face */}
          <meshStandardMaterial color="purple" attach="material-4" />{" "}
          {/* Front face */}
          <meshStandardMaterial color="orange" attach="material-5" />{" "}
          {/* Back face */}
        </mesh>
      </RigidBody>
    </>
  );
}

/*


*/
