import { useEffect, useState } from "react";
import "./App.css";
import InputSection from "./components/InputSection";
import type { BuildOrderItem } from "./components/InputSection";

const SUPPLY_COSTS = {
  // units
  adept: 2,
  archon: 4,
  baneling: 0.5,
  banshee: 3,
  battlecruiser: 6,
  "brood lord": 2,
  carrier: 6,
  colossus: 6,
  corruptor: 2,
  cyclone: 2,
  "dark templar": 2,
  disruptor: 4,
  drone: 1,
  ghost: 2,
  hellbat: 2,
  hellion: 2,
  "high templar": 2,
  hydralisk: 2,
  immortal: 4,
  infestor: 2,
  liberator: 3,
  lurker: 1,
  marauder: 2,
  marine: 1,
  medivac: 2,
  mothership: 6,
  mutalisk: 2,
  observer: 1,
  oracle: 3,
  phoenix: 2,
  probe: 1,
  queen: 2,
  ravager: 1,
  raven: 2,
  reaper: 1,
  roach: 2,
  scv: 1,
  sentry: 2,
  "siege tank": 3,
  stalker: 2,
  "swarm host": 3,
  tempest: 5,
  thor: 6,
  ultralisk: 6,
  viking: 2,
  viper: 3,
  "void ray": 4,
  "warp prism": 2,
  "widow mine": 2,
  zealot: 2,
  zergling: 0.5,

  //buildings
  "spine crawler": -1,
  "spore crawler": -1,
  hatchery: -1,
  "spawning pool": -1,
  extractor: -1,
  "infestation pit": -1,
  "nydus network": -1,
  "evolution chamber": -1,
  "hydralisk den": -1,
  "lurker den": -1,
  "ultralisk cavern": -1,
  "baneling nest": -1,
  "roach warren": -1,
  spire: -1,
};

function App() {
  const [inputText, setInputText] = useState("");
  const [buildOrder, setBuildOrder] = useState<BuildOrderItem[]>([]);
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

  // Format seconds to MM:SS
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

  // Parse time string (MM:SS) to seconds
  const parseTime = (timeString: string): number => {
    const parts = timeString.split(":").map(Number);
    return parts[0] * 60 + (parts[1] || 0);
  };

  // Callback to receive parsed build order from InputSection
  const handleBuildOrderParsed = (parsedBuildOrder: BuildOrderItem[]) => {
    setBuildOrder(parsedBuildOrder);
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
    <div className="container">
      <header>
        <h1>StarCraft II Build Order Helper</h1>
        <p>Track your build order with real-time highlighting</p>
      </header>

      <InputSection
        inputText={inputText}
        setInputText={setInputText}
        onBuildOrderParsed={handleBuildOrderParsed}
        parseTime={parseTime}
      />

      <div id="buildOrderSection" className="build-order-section">
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
          <button
            onClick={() => incrementTime(-5)}
            className="btn btn-increment"
          >
            -5s
          </button>
          <button
            onClick={() => incrementTime(-1)}
            className="btn btn-increment"
          >
            -1s
          </button>
          <button
            onClick={() => incrementTime(1)}
            className="btn btn-increment"
          >
            +1s
          </button>
          <button
            onClick={() => incrementTime(5)}
            className="btn btn-increment"
          >
            +5s
          </button>
          <div className="timer-display">
            <span id="timerText" className="timer">
              {formatTime(elapsedSeconds)}
            </span>
          </div>
        </div>

        <div className="build-order-list">
          <table>
            <thead>
              <tr>
                <th>Supply</th>
                <th>Time</th>
                <th>Building/Unit</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody id="buildOrderBody">
              {buildOrder.map((item, index) => (
                <tr
                  key={index}
                  className={elapsedSeconds >= item.timeSeconds ? "active" : ""}
                >
                  <td>{item.supply}</td>
                  <td>{item.time}</td>
                  <td>{item.name}</td>
                  <td>{item.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default App;
