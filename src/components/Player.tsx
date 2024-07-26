import { RigidBody, useRevoluteJoint } from "@react-three/rapier";
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

// "w" moves the player towards the direction the camera is facing
// player always turns to face the direction they are moving
// camera follow the player

export function Player({
  clicked,
  setClicked,
}: {
  clicked: boolean;
  setClicked: (clicked: boolean) => void;
}) {
  //reference to the player object
  const playerRef = useRef<any>();
  //reference to the weapon object
  //const weaponRef = useRef<any>();
  //reference to the camera object
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  //reference to the camera controls
  const controlsRef = useRef<any>(null);
  //reference to the current rotation of the player
  const currentRotation = useRef(new THREE.Quaternion(0, 0, 0, 1));
  //tracks if the weapon is locked
  const weaponLock = useRef(false);

  //get the keyboard controls
  const [, get] = useKeyboardControls();
  //get the camera
  const { camera } = useThree();

  /*const playerWeaponJoint = useRevoluteJoint(playerRef, weaponRef, [
    [0, 0, 0],
    [0, 0, 4],
    [0, 1, 0],
  ]);
  */

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
    // direction.normalize(); // removed normalzation to allow for faster movement

    // Apply movement
    // y handles jumps
    if (direction.length() > 0) {
      playerRef.current?.setLinvel(
        { x: direction.x * SPEED, y: direction.y, z: direction.z * SPEED },
        true //true wakes, or activates, the RigidBody
      );

      // Update player rotation to face movement direction
      // Locking player rotation along the x and z axes will prevent "tumble" effects
      // TODO: Locking does not prevent rotations because rotation is set directly and not a result of a force

      const targetRotation = new THREE.Quaternion().setFromUnitVectors(
        new THREE.Vector3(0, 0, 1),
        direction
      );

      //calculate the new rotation by interpolating between the current rotation and the target rotation
      currentRotation.current.slerp(targetRotation, 5 * delta);
      //workaround to prevent rotation on the x axis
      currentRotation.current.x = 0;
      //workaround to prevent rotation on the z axis
      currentRotation.current.z = 0;
      //apply the new rotation to the player
      playerRef.current?.setRotation(currentRotation.current);
    } else {
      //workaround to prevent rotation on the x axis
      currentRotation.current.x = 0;
      //workaround to prevent rotation on the z axis
      currentRotation.current.z = 0;
      //preserve the rotation of the player
      playerRef.current?.setRotation(currentRotation.current);
      //preserve the y velocity to handle jumps and falls, otherwise set the player to a stand still
      playerRef.current?.setLinvel({ x: 0, y: velocity.y, z: 0 }, true);
    }

    //update the camera to follow the player
    if (playerRef.current && controlsRef.current) {
      const cubePosition = playerRef.current.translation();
      controlsRef.current.target.set(
        cubePosition.x,
        cubePosition.y,
        cubePosition.z
      );
      controlsRef.current.update();
    }

    if (clicked) {
      console.log(clicked);
      setClicked(false); //remember, state variables are not updated immediately
      console.log(clicked);
    }
  });

  return (
    <>
      <PerspectiveCamera ref={cameraRef} makeDefault fov={75} />
      <OrbitControls
        ref={controlsRef}
        camera={camera}
        enablePan={false}
        minDistance={7}
        maxDistance={7}
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

/*
    <RigidBody
            colliders="hull"
            restitution={0}
            ccd={true}
            ref={weaponHelperRef}
          >
    <mesh>
              <sphereGeometry args={[1.5]} />
              <meshStandardMaterial color="pink" />
            </mesh>
          </RigidBody>

*/

/*

        <RigidBody
          colliders="hull"
          restitution={0}
          ccd={true}
          ref={weaponRef}
          dominanceGroup={1}
        >
          <mesh>
            <boxGeometry args={[0.2, 0.2, 0.2]} />
            <meshStandardMaterial color="pink" />
          </mesh>
        </RigidBody>
*/
