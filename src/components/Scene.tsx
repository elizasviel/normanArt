import React, { Suspense } from "react";
import { Enemies } from "./Enemies";
import { CreatedShapes } from "./CreatedShapes";
import { Player } from "./Player";
import { Terrain } from "./Terrain";
import { CanvasData } from "./BallPit";

interface SceneProps {
  data: CanvasData;
  clicked: boolean;
  setClicked: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Scene: React.FC<SceneProps> = ({ data, clicked, setClicked }) => {
  return (
    <Suspense fallback={null}>
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <Enemies />
      <Player clicked={clicked} setClicked={setClicked} />
      <CreatedShapes data={data} />
      <Terrain />
    </Suspense>
  );
};
