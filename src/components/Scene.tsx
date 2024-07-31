import React, { Suspense, useState } from "react";
import { Enemies } from "./Enemies";
import { Player } from "./Player";
import { Terrain } from "./Terrain";
import { CanvasData } from "./BallPit";
import * as THREE from "three";
import { Vector } from "three/examples/jsm/Addons.js";

//Passing data and clickState
interface SceneProps {
  data: CanvasData;
  clicked: boolean;
  setClicked: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Scene: React.FC<SceneProps> = ({ data, clicked, setClicked }) => {
  const [playerPosition, setPlayerPosition] = useState<Vector>({
    x: 0,
    y: 0,
    z: 0,
  });
  return (
    <Suspense fallback={null}>
      <ambientLight intensity={0.5}></ambientLight>
      <directionalLight
        position={[5, 5, 5]}
        intensity={1}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <Player
        playerPosition={playerPosition}
        setPlayerPosition={setPlayerPosition}
      ></Player>
      <Enemies playerPosition={playerPosition}></Enemies>
      <Terrain />
    </Suspense>
  );
};

//Perhaps add a light to produce shadows for balloons and player
//
