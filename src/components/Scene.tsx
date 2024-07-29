import React, { Suspense } from "react";
import { Enemies } from "./Enemies";
import { CreatedShapes } from "./CreatedShapes";
import { BuiltInShapes } from "./BuiltInShapes";
import { Player } from "./Player";
import { Walls } from "./Walls";
import { CanvasData } from "./BallPit";

interface SceneProps {
  data: CanvasData;
  clicked: boolean;
  setClicked: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Scene: React.FC<SceneProps> = ({ data, clicked, setClicked }) => {
  return (
    <Suspense fallback={null}>
      <ambientLight intensity={2} />
      <pointLight intensity={1} position={[0, 5, 0]} />
      <BuiltInShapes />
      <Enemies />
      <Player clicked={clicked} setClicked={setClicked} />
      <CreatedShapes data={data} />
      <Walls />
    </Suspense>
  );
};
