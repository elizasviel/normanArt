import React, { Suspense } from "react";
import { Enemies } from "./Enemies";
import { CreatedShapes } from "./CreatedShapes";
import { Player } from "./Player";
import { Terrain } from "./Terrain";
import { Coin } from "./Coin";
import { CanvasData } from "./BallPit";
import { RigidBody } from "@react-three/rapier";
import * as THREE from "three";

//Passing data and clickState
interface SceneProps {
  data: CanvasData;
  clicked: boolean;
  setClicked: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Scene: React.FC<SceneProps> = ({ data, clicked, setClicked }) => {
  return (
    <Suspense fallback={null}>
      <ambientLight intensity={0.5}></ambientLight>
      <directionalLight
        position={[5, 5, 5]}
        intensity={1}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />

      <Player></Player>

      <Enemies />
      <Terrain />
    </Suspense>
  );
};

//Perhaps add a light to produce shadows for balloons and player
