import React from "react";
import "./componentStyles.css";

interface ScoreboardProps {
  coins: number;
}

const Scoreboard: React.FC<ScoreboardProps> = ({ coins }) => {
  return (
    <div className="scoreboard">
      <span className="coin-icon">🪙</span>
      <span className="coin-count">{coins}</span>
    </div>
  );
};

const HUD: React.FC<{ coins: number }> = ({ coins }) => {
  return (
    <div className="hud">
      <Scoreboard coins={coins} />
    </div>
  );
};

export default HUD;
