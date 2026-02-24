import { useEffect, useState } from "react";

type ControlsProps = {
  onElapsedSecondsChange: (seconds: number) => void;
};

const Controls: React.FC<ControlsProps> = ({ onElapsedSecondsChange }) => {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  // Timer logic (useEffect for interval)
  useEffect(() => {
    if (!isRunning) return;

    const timer = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning]);

  // Sync elapsedSeconds with parent
  useEffect(() => {
    onElapsedSecondsChange(elapsedSeconds);
  }, [elapsedSeconds, onElapsedSecondsChange]);

  // Format seconds to MM:SS
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

  // Timer control functions
  const startTimer = () => {
    setIsRunning(true);
  };
  const pauseTimer = () => {
    setIsRunning(false);
  };
  const resetTimer = () => {
    setElapsedSeconds(0);
  };
  const incrementTime = (amount: number) => {
    setElapsedSeconds((prev) => prev + amount);
  };
  return (
    <div className="controls">
      <button onClick={startTimer} className="btn btn-start">
        Start Timer
      </button>
      <button onClick={pauseTimer} className="btn btn-pause">
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
