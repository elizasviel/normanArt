import React, { useEffect, useRef, useState, useCallback } from "react";
import { Sphere } from "@react-three/drei";
import { Vector3 } from "three";
import { CanvasData } from "./BallPit";

interface CreatorProps {
  setData: React.Dispatch<React.SetStateAction<CanvasData>>;
}

export const Creator: React.FC<CreatorProps> = ({ setData }) => {
  const [position, setPosition] = useState<Vector3>(new Vector3(0, 0, 0));
  const positionRef = useRef<Vector3>(position);

  useEffect(() => {
    positionRef.current = position;
  }, [position]);

  const createSphere = useCallback(async () => {
    try {
      const response = await fetch("http://localhost:3000/api", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          args: [1, 16, 16],
          position: positionRef.current.toArray(),
          color: "lightgreen",
        }),
      });
      const data = await response.json();
      setData(data);
    } catch (error) {
      console.error("Error creating sphere:", error);
    }
  }, [setData]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const { key, code } = event;
      const moveAmount = 1;

      setPosition((prev) => {
        const newPosition = prev.clone();

        switch (key) {
          case "ArrowUp":
            newPosition.y -= moveAmount;
            break;
          case "ArrowDown":
            newPosition.y += moveAmount;
            break;
          case "ArrowLeft":
            newPosition.x += moveAmount;
            break;
          case "ArrowRight":
            newPosition.x -= moveAmount;
            break;
          case "Shift":
            if (code === "ShiftRight") {
              newPosition.z += moveAmount;
            }
            break;
          case "Enter":
            createSphere();
            break;
        }

        return newPosition;
      });
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [createSphere]);

  return <Sphere args={[1, 100, 100]} position={position} />;
};
