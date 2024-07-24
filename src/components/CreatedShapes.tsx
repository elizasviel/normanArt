import React from "react";
import { Sphere } from "@react-three/drei";
import { CanvasData } from "@/components/BallPit";
import { BallCollider, CuboidCollider, RigidBody } from "@react-three/rapier";

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
        <BallCollider
          args={[1]}
          position={bumper.position as spherePosition}
          key={index}
        >
          <meshStandardMaterial />
        </BallCollider>
      ))}
    </>
  );
};

type CreatedShapesProps = {
  data: CanvasData;
};

export const CreatedShapes = ({ data }: CreatedShapesProps) => {
  return <Spheres data={data} />;
};
