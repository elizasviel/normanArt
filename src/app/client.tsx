"use client";

import React, { useState, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Physics, RigidBody } from "@react-three/rapier";
import { BuiltInShapes } from "../components/BuiltInShapes";
import { CreatedShapes } from "../components/CreatedShapes";
import { Controller } from "../components/Controller";
import { BumperResponse } from "./api/route";
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
      <Canvas
        camera={{ position: [6, 4, 12], fov: 80 }}
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
        <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
        <ambientLight intensity={Math.PI / 2} />

        <Suspense>
          <Physics interpolate={true} gravity={[0, -9.81, 0]} debug>
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
    </div>
  );
};

export default BallPit;
