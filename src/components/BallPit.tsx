"use client";

import React, { useState, Suspense, useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { Physics, RigidBody } from "@react-three/rapier";

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
  const [clicked, setClicked] = useState(false);

  //This is the useEffect hook that is used to fetch the data from the database
  //It triggers only once, when the component mounts
  useEffect(() => {
    fetch("/api")
      .then((response) => response.json())
      .then((data) => setData(data));
  }, []);

  //This is the main component that is rendered in the app
  //It is a div that contains the canvas and the controller

  const handleClick = (e: any) => {
    setClicked(true);
  };

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
          onClick={handleClick}
        >
          <ambientLight intensity={Math.PI / 2} />
          <pointLight intensity={1} position={[0, 5, 0]} />

          {/* This part made possible by Rapier Physics */}

          <Suspense>
            {/* <Creator /> is a sphere controlled by keyboard inputs */}
            {/* When user presses the return key, sends a post request to the server and sets data equal to the response */}
            {/* CreatedShapes uses the data, so should work with physics. However, it could be the case that re renders
            not happening here*/}
            <Physics interpolate={true} gravity={[0, -9.81, 0]}>
              <Player clicked={clicked} setClicked={setClicked}></Player>
              <RigidBody
                colliders="hull"
                restitution={0}
                mass={0.2}
                position={[4, 0, 0]}
              >
                <mesh>
                  <boxGeometry args={[1, 1, 1]} />
                  <meshStandardMaterial color="lightblue" />
                </mesh>
              </RigidBody>
              <RigidBody
                colliders="ball"
                restitution={0}
                mass={0.2}
                position={[-2, 0, 0]}
              >
                <mesh>
                  <sphereGeometry args={[0.25]} />
                  <meshStandardMaterial color="lightgreen" />
                </mesh>
              </RigidBody>
              <CreatedShapes data={data} />

              <RigidBody type="fixed">
                <mesh
                  position={[0, -2, 0]}
                  rotation={[(3 * Math.PI) / 2, 0, 0]}
                >
                  <planeGeometry args={[30, 30]} />
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
