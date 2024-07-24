import { PerspectiveCamera, PointerLockControls } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";

export function Player() {
  return (
    <>
      <mesh position={[0, 10, 0]}>
        <boxGeometry args={[2, 2, 2]} />
        <meshStandardMaterial color={"orange"} />
      </mesh>
    </>
  );
}

/*

const SPEED = 5;
const direction = new THREE.Vector3();
const frontVector = new THREE.Vector3();
const sideVector = new THREE.Vector3();



    const { forward, backward, left, right } = get();
    const velocity = ref.current?.linvel();

    // movement
    frontVector.set(10, 10, 10);
    sideVector.set(10, 10, 10);
    direction
      .subVectors(frontVector, sideVector)
      .normalize()
      .multiplyScalar(SPEED)
      .applyEuler(state.camera.rotation);
*/
