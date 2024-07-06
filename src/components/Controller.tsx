import React, { useState } from "react";

export const Controller = ({ setData }: any) => {
  const [X, setX] = useState(0);
  const [Y, setY] = useState(0);
  const [Z, setZ] = useState(0);

  return (
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
              console.log(data);
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
  );
};
