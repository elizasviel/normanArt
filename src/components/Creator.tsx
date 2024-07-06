import React, { useEffect, useState } from "react";
import { Sphere } from "@react-three/drei";

export const Creator = () => {
  const [X, setX] = useState(0);
  const [Y, setY] = useState(0);
  const [Z, setZ] = useState(0);
  console.log(X, Y, Z);

  useEffect(() => {
    window.addEventListener("keydown", (event) => {
      switch (event.key) {
        case "ArrowUp":
          setY((prev) => prev - 1);
          break;
        case "ArrowDown":
          setY((prev) => prev + 1);
          break;
        case "ArrowLeft":
          setX((prev) => prev + 1);
          break;
        case "ArrowRight":
          setX((prev) => prev - 1);
          break;
        case " ":
          setZ((prev) => prev - 1);
          break;
        case "Enter":
          console.log(X, Y, Z);
          fetch("http://localhost:3000/api", {
            method: "POST",
            body: JSON.stringify({
              args: [1, 16, 16],
              position: [X, Y, Z],
              color: "lightgreen",
            }),
          });
          break;
        default:
          if (event.code === "ShiftRight") {
            setZ((prev) => prev + 1);
          }
          break;
      }
    });
  }, []);

  return (
    <>
      <Sphere args={[1, 100, 100]} position={[Y, Z, X]} />
    </>
  );
};
