import { RigidBody, useRevoluteJoint } from "@react-three/rapier";
import { useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import {
  useKeyboardControls,
  PerspectiveCamera,
  OrbitControls,
} from "@react-three/drei";
import * as THREE from "three";

const SPEED = 5;
const direction = new THREE.Vector3();

// "w" moves the player towards the direction the camera is facing
// player always turns to face the direction they are moving
// camera follow the player

export function Player() {
  //reference to the player object
  const playerRef = useRef<any>();
  //reference to the weapon object
  //const weaponRef = useRef<any>();
  //reference to the camera object
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  //reference to the camera controls
  const controlsRef = useRef<any>(null);
  //tracks if the weapon is locked
  const weaponLock = useRef(false);

  const [playerRotation, setPlayerRotation] = useState(
    new THREE.Quaternion(0, 0, 0, 1)
  );

  //get the keyboard controls
  const [, get] = useKeyboardControls();
  //get the camera
  const { camera } = useThree();

  //delta represents the time between frames
  useFrame((state, delta) => {
    //check for key presses
    const { forward, backward, left, right, space } = get();

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

    // Camera values are used to calculate the transformation to apply on movement input

    direction.set(0, 0, 0);
    if (forward) direction.add(cameraDirection);
    if (backward) direction.sub(cameraDirection);
    if (left) direction.sub(cameraRight);
    if (right) direction.add(cameraRight);
    if (space) direction.y = 3;
    if (!space) direction.y = velocity.y;
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

      playerRef.current.setRotation(playerRotation);
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
  });

  return (
    <>
      <PerspectiveCamera ref={cameraRef} fov={75} />
      <OrbitControls
        ref={controlsRef}
        minDistance={7}
        maxDistance={7}
        maxPolarAngle={Math.PI / 2 - 0.3}
        minPolarAngle={0.3}
      />

      <group position={[5, 0, 5]}>
        <RigidBody
          colliders="hull"
          restitution={0}
          ccd={true}
          ref={playerRef}
          lockRotations={true}
          dominanceGroup={1}
        >
          <mesh>
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
