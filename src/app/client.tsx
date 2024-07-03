"use client";

import * as THREE from "three";
import React, { useRef, useState, Suspense } from "react";
import { Canvas, useFrame, ThreeElements } from "@react-three/fiber";
import { Physics, RigidBody } from "@react-three/rapier";
import { Torus, Box, Sphere, Plane } from "@react-three/drei";
import { materialRotation } from "three/examples/jsm/nodes/Nodes.js";

const Spheres = ({ data }) => {
  return (
    <>
      {data?.map((bumper, index) => (
        <Sphere args={bumper.args} position={bumper.position} key={index}>
          <meshStandardMaterial />
        </Sphere>
      ))}
    </>
  );
};

const BallPit = () => {
  const [data, setData] = useState(null);
  const [X, setX] = useState(0);
  const [Y, setY] = useState(0);
  const [Z, setZ] = useState(0);
  return (
    <div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          zIndex: 1,
          position: "absolute",
          top: 80,
          left: 80,
        }}
      >
        <button
          onClick={() => {
            fetch("http://localhost:3000/api", {
              method: "GET",
            })
              .then((response) => {
                return response.json();
              })
              .then((data) => {
                setData(data); // this will be a json
              });
          }}
        >
          Get Bumpers
        </button>

        <button
          onClick={() => {
            fetch("http://localhost:3000/api", {
              method: "POST",
              body: JSON.stringify({
                args: [1, 16, 16], //somehow rounds to zero
                position: [X, Y, Z],
                color: "lightgreen",
              }),
            })
              .then((response) => {
                return response.text();
              })
              .then((data) => {
                console.log(data); // this will be a string
              });
          }}
        >
          Add Bumper
        </button>
        <div
          style={{
            backgroundColor: "lightblue",
            display: "flex",
            flexDirection: "column",
            color: "black",
          }}
        >
          <input onChange={(e) => setX(parseInt(e.target.value))} value={X} />
          <input onChange={(e) => setY(parseInt(e.target.value))} value={Y} />
          <input onChange={(e) => setZ(parseInt(e.target.value))} value={Z} />
        </div>
      </div>

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
              <Spheres data={data} />
              {/* Back face */}

              {/* Static Spheres at vertices */}
              <Sphere args={[0.5, 32, 32]} position={[-14, 10, -14]}>
                <meshStandardMaterial color={"red"} />
              </Sphere>
              <Sphere args={[0.5, 32, 32]} position={[14, 10, -14]}>
                <meshStandardMaterial color={"blue"} />
              </Sphere>
              <Sphere args={[0.5, 32, 32]} position={[-14, 10, 14]}>
                <meshStandardMaterial color={"green"} />
              </Sphere>
              <Sphere args={[0.5, 32, 32]} position={[14, 10, 14]}>
                <meshStandardMaterial color={"yellow"} />
              </Sphere>
              <Sphere args={[0.5, 32, 32]} position={[-14, -10, -14]}>
                <meshStandardMaterial color={"purple"} />
              </Sphere>
              <Sphere args={[0.5, 32, 32]} position={[14, -10, -14]}>
                <meshStandardMaterial color={"orange"} />
              </Sphere>
              <Sphere args={[0.5, 32, 32]} position={[-14, -10, 14]}>
                <meshStandardMaterial color={"cyan"} />
              </Sphere>
              <Sphere args={[0.5, 32, 32]} position={[14, -10, 14]}>
                <meshStandardMaterial color={"magenta"} />
              </Sphere>

              <Plane
                args={[28, 20]}
                position={[0, 0, -14]}
                rotation={[0, Math.PI, 0]}
              >
                <meshStandardMaterial
                  color={"green"}
                  transparent={true}
                  opacity={0.7}
                  side={THREE.DoubleSide}
                />
              </Plane>

              {/* Bottom face */}

              <Plane
                args={[28, 28]}
                position={[0, -10, 0]}
                rotation={[Math.PI / 2, 0, 0]}
              >
                <meshStandardMaterial
                  transparent={true}
                  opacity={0.7}
                  side={THREE.DoubleSide}
                />
              </Plane>
              {/* Left face */}
              <Plane
                args={[28, 20]}
                position={[-14, 0, 0]}
                rotation={[0, Math.PI / 2, 0]}
              >
                <meshStandardMaterial
                  color={"lightgreen"}
                  transparent={true}
                  opacity={0.7}
                  side={THREE.DoubleSide}
                />
              </Plane>

              {/* Front face */}
              <Plane args={[28, 20]} position={[0, 0, 14]} rotation={[0, 0, 0]}>
                <meshStandardMaterial
                  transparent={true}
                  opacity={0.3}
                  side={THREE.DoubleSide}
                />
              </Plane>

              {/* Right face */}
              <Plane
                args={[28, 20]}
                position={[14, 0, 0]}
                rotation={[0, -Math.PI / 2, 0]}
              >
                <meshStandardMaterial
                  transparent={true}
                  opacity={0.3}
                  side={THREE.DoubleSide}
                />
              </Plane>

              {/* Top face */}
              <Plane
                args={[28, 28]}
                position={[0, 10, 0]}
                rotation={[-Math.PI / 2, 0, 0]}
              >
                <meshStandardMaterial
                  transparent={true}
                  opacity={0.3}
                  side={THREE.DoubleSide}
                />
              </Plane>
            </RigidBody>
            <RigidBody colliders="hull" restitution={1.2}>
              <Sphere args={[0.5, 32, 32]} position={[-2, 2, -2]}>
                <meshStandardMaterial color={"hotpink"} />
              </Sphere>
            </RigidBody>
            <RigidBody colliders="hull" restitution={0.8}>
              <Sphere args={[0.2, 16, 16]} position={[-2, 4, -2]}>
                <meshStandardMaterial color={"black"} />
              </Sphere>
            </RigidBody>
            <RigidBody>
              <Plane
                args={[6, 6]}
                position={[-2, -2, -2]}
                rotation={[-Math.PI / 2.2, 0, 0]}
              >
                <meshStandardMaterial
                  color={"black"}
                  transparent={true}
                  opacity={0.7}
                />
              </Plane>
            </RigidBody>
            <RigidBody>
              <Plane
                args={[4, 4]}
                position={[-2, -2, -2]}
                rotation={[-Math.PI / 1.8, Math.PI / 4.5, 0]}
              >
                <meshStandardMaterial
                  color={"lightgreen"}
                  transparent={true}
                  opacity={0.7}
                />
              </Plane>
            </RigidBody>

            <RigidBody>
              <Plane
                args={[4, 4]}
                position={[6, -4, -8]}
                rotation={[-Math.PI / 1.8, Math.PI / 4.5, 0]}
              >
                <meshStandardMaterial
                  color={"lightgreen"}
                  transparent={true}
                  opacity={0.7}
                />
              </Plane>
            </RigidBody>
          </Physics>
        </Suspense>
      </Canvas>
    </div>
  );
};

export default BallPit;
