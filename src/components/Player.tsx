import * as THREE from "three";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useKeyboardControls } from "@react-three/drei";
import { CapsuleCollider, RigidBody } from "@react-three/rapier";

const SPEED = 5;
const direction = new THREE.Vector3();
const frontVector = new THREE.Vector3();
const sideVector = new THREE.Vector3();

export function Player() {
  const ref = useRef<any>();
  const [, get] = useKeyboardControls();
  useFrame((state) => {
    const { forward, backward, left, right } = get();
    const velocity = ref.current?.linvel();

    // movement
    frontVector.set(0, 0, Number(backward) - Number(forward));
    sideVector.set(Number(left) - Number(right), 0, 0);
    direction
      .subVectors(frontVector, sideVector)
      .normalize()
      .multiplyScalar(SPEED)
      .applyEuler(state.camera.rotation);
    ref.current?.setLinvel({ x: direction.x, y: velocity.y, z: direction.z });
  });
  return (
    <>
      <RigidBody
        ref={ref}
        colliders={false}
        mass={1}
        position={[0, 50, 0]}
        enabledRotations={[false, false, false]}
      >
        <CapsuleCollider args={[5, 2]} />
      </RigidBody>
    </>
  );
}
