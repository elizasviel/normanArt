"use client";

import React, { useState, Suspense, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { Physics, RigidBody } from "@react-three/rapier";
import { PerspectiveCamera } from "@react-three/drei";
import { BuiltInShapes } from "./BuiltInShapes";
import { CreatedShapes } from "./CreatedShapes";
import { Controller } from "./Controller";
import { Player } from "./Player";
import { KeyboardControls } from "@react-three/drei";
import { Bumper } from "@prisma/client";
import { Creator } from "./Creator";

export type CanvasData = Bumper[] | null;

//This is a React Three Fiber component
//It is the main component that is rendered in the app

const BallPit = () => {
  //This is the state that is used to store the data from the database
  //The data is passed into the Creator and CreatedShapes components
  const [data, setData] = useState<CanvasData>(null);

  console.log(data);

  //This is the useEffect hook that is used to fetch the data from the database
  //It triggers only once, when the component mounts
  useEffect(() => {
    fetch("/api")
      .then((response) => response.json())
      .then((data) => setData(data));
  }, []);

  //This is the main component that is rendered in the app
  //It is a div that contains the canvas and the controller

  return (
    <div>
      {/* This is the controller that is used to update the data */}
      <Controller setData={setData}></Controller>

      {/* How are the keyboard controls passed into the Player component? */}
      <KeyboardControls
        map={[
          { name: "forward", keys: ["w", "W"] },
          { name: "backward", keys: ["s", "S"] },
          { name: "left", keys: ["a", "A"] },
          { name: "right", keys: ["d", "D"] },
          { name: "space", keys: [" "] },
        ]}
      >
        <Canvas
          style={{
            width: window.innerWidth,
            height: window.innerHeight,
            backgroundColor: "steelblue",
          }}
        >
          <ambientLight intensity={Math.PI / 2} />
          <pointLight intensity={1} position={[0, 5, 0]} />

          {/* This part made possible by Rapier Physics */}

          <Suspense>
            {/* <Creator /> is a sphere controlled by keyboard inputs */}
            {/* When user presses the return key, sends a post request to the server and sets data equal to the response */}
            {/* CreatedShapes uses the data, so should work with physics. However, it could be the case that re renders
            not happening here*/}
            <Physics interpolate={false} gravity={[0, -9.81, 0]} debug>
              <Creator setData={setData} />

              <Player></Player>
              <CreatedShapes data={data} />

              <RigidBody
                colliders="hull"
                restitution={1}
                type="fixed"
                ccd={true}
              >
                <mesh
                  position={[0, -2, 0]}
                  rotation={[(3 * Math.PI) / 2, 0, 0]}
                >
                  <planeGeometry args={[10, 10]} />
                  <meshStandardMaterial color="gray" />
                </mesh>
              </RigidBody>
            </Physics>
            {/* End of Rapier Physics */}
          </Suspense>
        </Canvas>
      </KeyboardControls>
    </div>
  );
};

export default BallPit;

//perhaps make new colliders
//orbit controls
