import React from "react";
import "./componentStyles.css";

interface ScoreboardProps {
  coins: number;
}

const Scoreboard: React.FC<ScoreboardProps> = ({ coins }) => {
  return (
    <div className="scoreboard">
      <p style={{ fontFamily: "Chalkduster, fantasy", color: "yellow" }}>
        Coins Collected: {coins}
      </p>
    </div>
  );
};

Scoreboard.displayName = "Scoreboard";

const Instructions: React.FC = () => {
  return (
    <div
      className="instructions"
      style={{ fontFamily: "Chalkduster, fantasy" }}
    >
      <p
        style={{
          fontSize: "2vw",
          textAlign: "center",
          textDecoration: "underline",
        }}
      >
        Instructions
      </p>
      <p>WASD to Move</p>
      <p>Hold Space to Fly</p>
      <p>Click and Drag to Move Camera</p>
      <p>Touch Bubbles to Pop</p>
    </div>
  );
};

Instructions.displayName = "Instructions";

const HUD: React.FC<{ coins: number }> = ({ coins }) => {
  return (
    <div className="hud">
      <Instructions />
      <Scoreboard coins={coins} />
    </div>
  );
};

HUD.displayName = "HUD";

export default HUD;
