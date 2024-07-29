import React, { useState } from "react";
import { CanvasData } from "./BallPit";

interface ControllerProps {
  setData: React.Dispatch<React.SetStateAction<CanvasData>>;
}

export const Controller: React.FC<ControllerProps> = ({ setData }) => {
  const [position, setPosition] = useState({ X: 0, Y: 0, Z: 0 });

  const handleInputChange =
    (axis: keyof typeof position) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setPosition((prev) => ({
        ...prev,
        [axis]: parseInt(e.target.value) || 0,
      }));
    };

  const handleEraseTerrain = async () => {
    try {
      const response = await fetch("http://localhost:3000/api", {
        method: "POST",
        body: JSON.stringify("remove"),
      });
      const data = await response.json();
      console.log(data);
      setData(data);
    } catch (error) {
      console.error("Error erasing terrain:", error);
    }
  };

  const handleAddTerrain = async () => {
    try {
      await fetch("http://localhost:3000/api", {
        method: "POST",
        body: JSON.stringify({
          args: [1, 16, 16],
          position: [position.X, position.Y, position.Z],
          color: "lightgreen",
        }),
      });
      const response = await fetch("http://localhost:3000/api");
      const data = await response.json();
      setData(data);
    } catch (error) {
      console.error("Error adding terrain:", error);
    }
  };

  return (
    <div style={styles.container}>
      <button style={styles.button} onClick={handleEraseTerrain}>
        Erase Terrain
      </button>
      <button
        style={{ ...styles.button, backgroundColor: "lightgreen" }}
        onClick={handleAddTerrain}
      >
        Add Terrain
      </button>
      <div style={styles.inputContainer}>
        {Object.entries(position).map(([axis, value]) => (
          <input
            key={axis}
            style={styles.input}
            onChange={handleInputChange(axis as keyof typeof position)}
            value={value}
            placeholder={axis}
          />
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column" as const,
    zIndex: 1,
    position: "absolute" as const,
    top: 80,
    left: 80,
  },
  button: {
    backgroundColor: "pink",
    color: "black",
    margin: "5px 0",
    padding: "5px 10px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  inputContainer: {
    backgroundColor: "lightblue",
    display: "flex",
    flexDirection: "column" as const,
    padding: "5px",
    borderRadius: "5px",
  },
  input: {
    margin: "2px 0",
    width: "50px",
  },
};

// Note: Colliders should be added in the CreatedShapes component where the spheres are rendered
