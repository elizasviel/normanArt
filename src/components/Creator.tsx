import React, { useEffect, useRef, useState } from "react";
import { Sphere } from "@react-three/drei";

export const Creator = () => {
  const [Y, setY] = useState(0);
  const [Z, setZ] = useState(0);
  const [X, setX] = useState(0);

  const currentCoordinatValuesRef = useRef([Y, Z, X]);
  useEffect(() => {
    currentCoordinatValuesRef.current = [Y, Z, X];
  }, [Y, Z, X]);
  //This effect runs only once
  //Adds a event listener to the window
  //How would the Window even know about X Y and Z?
  useEffect(() => {
    console.log("setUpListener");
    window.addEventListener("keydown", (event) => {
      switch (event.key) {
        case "ArrowUp":
          setY((prev) => {
            console.log(prev - 1);
            return prev - 1;
          });
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
          fetch("http://localhost:3000/api", {
            method: "POST",
            body: JSON.stringify({
              args: [1, 16, 16],
              position: currentCoordinatValuesRef.current,
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
      console.log(currentCoordinatValuesRef.current);
    });
  }, []);

  return (
    <>
      <Sphere args={[1, 100, 100]} position={[Y, Z, X]} />
    </>
  );
};
