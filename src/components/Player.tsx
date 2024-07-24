import { PerspectiveCamera, PointerLockControls } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";
import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { useKeyboardControls } from "@react-three/drei";
import * as THREE from "three";

const SPEED = 5;
const direction = new THREE.Vector3();
const frontVector = new THREE.Vector3();
const sideVector = new THREE.Vector3();

export function Player() {
  const ref = useRef<any>();
  const [lastRotation, setLastRotation] = useState({ x: 0, y: 0, z: 0, w: 1 });
  const [, get] = useKeyboardControls();
  useFrame((state) => {
    const { forward, backward, left, right } = get();

    const velocity = ref.current?.linvel();

    // movement
    frontVector.set(0, 0, Number(backward) - Number(forward));
    sideVector.set(Number(left) - Number(right), 0, 0);

    //sets 1/0 for front and side vector based on the keyboard input

    direction.subVectors(frontVector, sideVector).normalize();

    let rotationQuaternion = lastRotation; // Default: no rotation

    switch (true) {
      // Forward
      case frontVector.z < 0 && sideVector.x === 0:
        rotationQuaternion = { x: 0, y: 0, z: 0, w: 1 };
        break;
      // Backward (180 degrees)
      case frontVector.z > 0 && sideVector.x === 0:
        rotationQuaternion = { x: 0, y: 1, z: 0, w: 0 };
        break;
      // Right
      case sideVector.x < 0 && frontVector.z === 0:
        rotationQuaternion = { x: 0, y: -0.7071068, z: 0, w: 0.7071068 };
        break;
      // Left
      case sideVector.x > 0 && frontVector.z === 0:
        rotationQuaternion = { x: 0, y: 0.7071068, z: 0, w: 0.7071068 };
        break;
      // Diagonal: Forward-Right
      case frontVector.z < 0 && sideVector.x < 0:
        rotationQuaternion = { x: 0, y: -0.3826834, z: 0, w: 0.9238795 };
        break;
      // Diagonal: Forward-Left
      case frontVector.z < 0 && sideVector.x > 0:
        rotationQuaternion = { x: 0, y: 0.3826834, z: 0, w: 0.9238795 };
        break;
      // Diagonal: Backward-Right
      case frontVector.z > 0 && sideVector.x < 0:
        rotationQuaternion = { x: 0, y: -0.9238795, z: 0, w: 0.3826834 };
        break;
      // Diagonal: Backward-Left
      case frontVector.z > 0 && sideVector.x > 0:
        rotationQuaternion = { x: 0, y: 0.9238795, z: 0, w: 0.3826834 };
        break;
    }

    setLastRotation(rotationQuaternion);
    ref.current?.setRotation(rotationQuaternion);

    // Log rotation for debugging
    console.log("Rotation:", ref.current?.rotation());

    //direction is also a vector 3
    //I think subvectors takes two vectors and does something
    //multiplyScar multiples vectors by speed

    ref.current?.setLinvel(
      { x: direction.x, y: velocity.y, z: direction.z },
      true
    );
  });

  return (
    <>
      <RigidBody
        colliders="hull"
        restitution={0}
        ccd={true}
        ref={ref}
        enabledRotations={[false, true, false]}
      >
        <mesh position={[0, 3, 0]}>
          <boxGeometry args={[1, 2, 2]} />
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
