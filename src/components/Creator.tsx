import React, { useEffect, useRef, useState } from "react";
import { CustomTransformControls } from "./CustomTransformControls";

export const Creator = () => {
  const [width, setWidth] = useState(1);
  useEffect(() => {
    window.addEventListener("keypress", () => setWidth((prev) => prev + 1));
  }, []);

  return (
    <>
      <CustomTransformControls onChange={(event) => console.log(event)}>
        <mesh>
          <boxGeometry args={[width, 3, 3]} />
          <meshStandardMaterial color="orange" />
        </mesh>
      </CustomTransformControls>
    </>
  );
};
