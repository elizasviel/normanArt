"use client";

import React, { useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
import { KeyboardControls } from "@react-three/drei";
import { Bumper } from "@prisma/client";
import { Controller } from "./Controller";
import { Scene } from "./Scene";
import { Creator } from "./Creator";

export type CanvasData = Bumper[] | null;

const keyboardMap = [
  { name: "forward", keys: ["w", "W"] },
  { name: "backward", keys: ["s", "S"] },
  { name: "left", keys: ["a", "A"] },
  { name: "right", keys: ["d", "D"] },
  { name: "space", keys: [" "] },
];

const BallPit: React.FC = () => {
  //Holds data from the database generated by creator
  const [data, setData] = useState<CanvasData>(null);
  //Handles clicks for child components
  const [clicked, setClicked] = useState(false);

  //Grab data from database
  useEffect(() => {
    fetch("/api")
      .then((response) => response.json())
      .then((data) => setData(data));
  }, []);

  return (
    <div>
      <KeyboardControls map={keyboardMap}>
        <Canvas
          style={{
            width: "100vw",
            height: "100vh",
            backgroundColor: "steelblue",
          }}
          onClick={() => setClicked(true)}
        >
          <Physics interpolate={true} gravity={[0, -9.81, 0]}>
            <Scene data={data} clicked={clicked} setClicked={setClicked} />
          </Physics>
        </Canvas>
      </KeyboardControls>
    </div>
  );
};

export default BallPit;
