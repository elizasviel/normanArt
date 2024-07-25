import { RigidBody, useRopeJoint } from "@react-three/rapier";
import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import {
  useKeyboardControls,
  PerspectiveCamera,
  OrbitControls,
} from "@react-three/drei";
import * as THREE from "three";

const SPEED = 5;
const direction = new THREE.Vector3();

export function Player({
  clicked,
  setClicked,
}: {
  clicked: boolean;
  setClicked: (clicked: boolean) => void;
}) {
  const ref = useRef<any>();
  const weaponRef = useRef<any>();
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const controlsRef = useRef<any>(null);
  const currentRotation = useRef(new THREE.Quaternion(0, 0, 0, 1));

  const [, get] = useKeyboardControls();
  const { camera } = useThree();

  useFrame((state, delta) => {
    const { forward, backward, left, right, space } = get();

    const velocity = ref.current?.linvel();

    // Get camera direction
    const cameraQuaternion = camera.quaternion;
    const cameraDirection = new THREE.Vector3(0, 0, -1).applyQuaternion(
      cameraQuaternion
    );
    cameraDirection.y = 0; // Ignore vertical rotation
    cameraDirection.normalize();
    // Calculate right vector
    const cameraRight = new THREE.Vector3(1, 0, 0).applyQuaternion(
      cameraQuaternion
    );
    cameraRight.y = 0;
    cameraRight.normalize();

    // Calculate movement direction

    direction.set(0, 0, 0);
    if (forward) direction.add(cameraDirection);
    if (backward) direction.sub(cameraDirection);
    if (left) direction.sub(cameraRight);
    if (right) direction.add(cameraRight);
    direction.normalize();

    // Apply movement
    if (direction.length() > 0) {
      ref.current?.setLinvel(
        { x: direction.x * SPEED, y: velocity.y, z: direction.z * SPEED },
        true
      );

      // Update player rotation to face movement direction
      const targetRotation = new THREE.Quaternion().setFromUnitVectors(
        new THREE.Vector3(0, 0, 1),
        direction
      );
      currentRotation.current.slerp(targetRotation, 5 * delta);
      ref.current?.setRotation(currentRotation.current);
    } else {
      ref.current?.setLinvel({ x: 0, y: velocity.y, z: 0 }, true);
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
    if (ref.current && controlsRef.current) {
      const cubePosition = ref.current.translation();
      controlsRef.current.target.set(
        cubePosition.x,
        cubePosition.y,
        cubePosition.z
      );
      controlsRef.current.update();
    }

    if (clicked) {
      console.log(weaponRef.current.position);
      setClicked(false);
    }
  });

  return (
    <>
      <PerspectiveCamera
        ref={cameraRef}
        makeDefault
        position={[0, 5, 5]}
        fov={75}
      />
      <OrbitControls
        ref={controlsRef}
        camera={camera}
        enablePan={false}
        minDistance={7}
        maxDistance={7}
      />

      <group>
        <RigidBody
          colliders="hull"
          restitution={0}
          ccd={true}
          ref={ref}
          enabledRotations={[false, true, false]}
        >
          <mesh ref={weaponRef}>
            <boxGeometry args={[0.2, 0.2, 0.2]} />
            <meshStandardMaterial color="pink" />
          </mesh>
        </RigidBody>
        <RigidBody
          colliders="hull"
          restitution={0}
          ccd={true}
          ref={ref}
          enabledRotations={[false, true, false]}
        >
          <mesh ref={ref}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="pink" attach="material-0" />{" "}
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
      </group>
    </>
  );
}
