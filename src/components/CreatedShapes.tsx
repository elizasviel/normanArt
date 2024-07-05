import React from "react";
import { Sphere } from "@react-three/drei";
import { CanvasData } from "@/app/client";

type sphereArgs = [
  radius?: number | undefined,
  widthSegments?: number | undefined,
  heightSegments?: number | undefined,
  phiStart?: number | undefined,
  phiLength?: number | undefined,
  thetaStart?: number | undefined,
  thetaLength?: number | undefined
];
type spherePosition = [x: number, y: number, z: number];

type SpheresProps = {
  data: CanvasData;
};

const Spheres = ({ data }: SpheresProps) => {
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
  return <Spheres data={data} />;
};
