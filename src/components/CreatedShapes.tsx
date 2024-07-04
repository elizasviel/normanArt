import React from "react";
import { Sphere } from "@react-three/drei";
import { CanvasData } from "@/app/client";

type SpheresProps = {
  data: CanvasData;
};

const Spheres = ({ data }: SpheresProps) => {
  return (
    <>
      {data?.map((bumper, index) => (
        <Sphere args={bumper.args} position={bumper.position} key={index}>
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
