import React from "react";

type ControlsProps = {
  elapsedSeconds: number;
  isRunning: boolean;
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  incrementTime: (amount: number) => void;
};

const Controls: React.FC<ControlsProps> = ({
  elapsedSeconds,
  isRunning,
  startTimer,
  pauseTimer,
  resetTimer,
  incrementTime,
}) => {
  // Format seconds to MM:SS
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="controls">
      <button
        onClick={startTimer}
        className="btn btn-start"
        disabled={isRunning}
      >
        Start Timer
      </button>
      <button
        onClick={pauseTimer}
        className="btn btn-pause"
        disabled={!isRunning}
      >
        Pause Timer
      </button>
      <button onClick={resetTimer} className="btn btn-reset">
        Reset
      </button>
      <button onClick={() => incrementTime(-5)} className="btn btn-increment">
        -5s
      </button>
      <button onClick={() => incrementTime(-1)} className="btn btn-increment">
        -1s
      </button>
      <button onClick={() => incrementTime(1)} className="btn btn-increment">
        +1s
      </button>
      <button onClick={() => incrementTime(5)} className="btn btn-increment">
        +5s
      </button>
      <div className="timer-display">
        <span id="timerText" className="timer">
          {formatTime(elapsedSeconds)}
        </span>
      </div>
    </div>
  );
};
export default Controls;
