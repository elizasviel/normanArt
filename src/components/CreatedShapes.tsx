import React from "react";
import { Sphere } from "@react-three/drei";
import { CanvasData } from "@/components/BallPit";
import { RigidBody } from "@react-three/rapier";

type sphereArgs = [
  radius?: number | undefined,
  widthSegments?: number | undefined,
  heightSegments?: number | undefined,
  phiStart?: number | undefined,
  phiLength?: number | undefined,
  thetaStart?: number | undefined,
  thetaLength?: number | undefined
];
type spherePosition = [y: number, z: number, x: number];

type SpheresProps = {
  data: CanvasData;
};

const Spheres = ({ data }: SpheresProps) => {
  console.log(data);
  return (
    <>
      {data?.map((bumper, index) => (
        <Sphere
          args={bumper.args as sphereArgs}
          position={bumper.position as spherePosition}
          key={index}
        >
          <meshStandardMaterial />
        </Sphere>
      ))}
    </>
  );
};

type CreatedShapesProps = {
  data: CanvasData;
};

export const CreatedShapes = ({ data }: CreatedShapesProps) => {
  return (
    <RigidBody colliders="hull" restitution={1} type="fixed">
      <Spheres data={data} />;
    </RigidBody>
  );
};
