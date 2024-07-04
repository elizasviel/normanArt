"use client";

import React, { useState, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Physics, RigidBody } from "@react-three/rapier";
import { BuiltInShapes } from "../components/BuiltInShapes";
import { CreatedShapes } from "../components/CreatedShapes";
import { Controller } from "../components/Controller";
import { Player } from "../components/Player";
import { BumperResponse } from "./api/route";
import { CameraControls, Sphere, KeyboardControls } from "@react-three/drei";

import test from "../components/test";

type Bumper = BumperResponse & {
  args: [number, number | undefined, number | undefined];
  position: [number, number, number];
};

export type CanvasData = Bumper[] | null;

const BallPit = () => {
  const [data, setData] = useState<CanvasData>(null);

  return (
    <div>
      <Controller setData={setData}></Controller>

      <KeyboardControls
        map={[
          { name: "forward", keys: ["ArrowUp", "w", "W"] },
          { name: "backward", keys: ["ArrowDown", "s", "S"] },
          { name: "left", keys: ["ArrowLeft", "a", "A"] },
          { name: "right", keys: ["ArrowRight", "d", "D"] },
        ]}
      >
        <Canvas
          camera={{ position: [60, 20, 20], fov: 80 }}
          style={{
            width: window.innerWidth,
            height: window.innerHeight,
            backgroundColor: "steelblue",
          }}
        >
          <spotLight
            position={[10, 10, 10]}
            angle={0.15}
            penumbra={1}
            decay={0}
            intensity={Math.PI}
          />
          <pointLight
            position={[-10, -10, -10]}
            decay={0}
            intensity={Math.PI}
          />
          <ambientLight intensity={Math.PI / 2} />
          <CameraControls />

          <Suspense>
            <Physics interpolate={true} gravity={[0, -9.81, 0]} debug>
              <Player />
              <RigidBody>
                <Sphere args={[1, 100, 100]} position={[0, 0, 0]} />
              </RigidBody>
              <RigidBody
                //shared starting position that can be overwritten by children
                colliders="hull"
                restitution={1}
                type="fixed"
              >
                <CreatedShapes data={data} />
                <BuiltInShapes />
              </RigidBody>
            </Physics>
          </Suspense>
        </Canvas>
      </KeyboardControls>
    </div>
  );
};

export default BallPit;
