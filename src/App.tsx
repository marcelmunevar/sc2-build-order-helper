import { useEffect, useState } from "react";
import "./App.css";

const SUPPLY_COSTS = {
  drone: 1,
  worker: 1,
  scv: 1,
  probe: 1,
  overlord: 0,
  overseer: 0,
  zergling: 0.5,
  queen: 2,
  roach: 2,
  "swarm host": 3,
  "spine crawler": -1,
  "spore crawler": -1,
  mutalisk: 3,
  baneling: 1,
  infestor: 2,
  ultralisk: 4,
  "brood lord": 4,
  hatchery: -1,
  "spawning pool": -1,
  extractor: -1,
  lair: 0,
  hive: 0,
  "infestation pit": -1,
  "nydus network": -1,
  "nydus canal": 0,
};

function App() {
  const [inputText, setInputText] = useState("");
  const [buildOrder, setBuildOrder] = useState<
    {
      supply: number;
      time: string;
      name: string;
      notes: string;
      timeSeconds: number;
    }[]
  >([]);
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

  // Build order parsing function
  const parseBuildOrder = (text: string) => {
    setBuildOrder([]);
    const lines = text.split("\n").filter((line) => line.trim());
    const buildOrder: {
      supply: number;
      time: string;
      name: string;
      notes: string;
      timeSeconds: number;
    }[] = [];

    lines.forEach((line) => {
      // Split by tabs or multiple spaces
      const parts = line
        .split(/\t+|\s{2,}/)
        .map((p) => p.trim())
        .filter((p) => p);

      if (parts.length >= 3) {
        const supply = parseInt(parts[0], 10);
        const timeStr = parts[1];
        const building = parts[2];
        const notes = parts.length > 3 ? parts.slice(3).join(" ") : "";

        if (!isNaN(supply) && timeStr) {
          buildOrder.push({
            supply: supply,
            time: timeStr,
            name: building,
            notes: notes,
            timeSeconds: parseTime(timeStr),
          });
        }
      }
    });

    if (buildOrder.length === 0) {
      throw new Error("No build steps found. Please check the format.");
    }

    // Sort by time
    buildOrder.sort((a, b) => a.timeSeconds - b.timeSeconds);
    setBuildOrder(buildOrder);
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
  const loadBuildOrder = () => {
    parseBuildOrder(inputText);
  };

  return (
    <div className="container">
      <header>
        <h1>StarCraft II Build Order Helper</h1>
        <p>Track your build order with real-time highlighting</p>
      </header>

      <div className="input-section">
        <label htmlFor="buildOrderInput" className="input-label">
          Paste Build Order:
        </label>
        <div className="input-group">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Paste your build order here (tab-separated format: Supply, Time, Building/Unit, Notes)&#10;Example:&#10;13	0:22	Spawning Pool&#10;14	0:40	Overlord"
            className="build-order-input"
            rows={6}
          ></textarea>
        </div>
        <button onClick={loadBuildOrder} className="btn btn-load">
          Load Build Order
        </button>
        <div id="error" className="error-message"></div>
      </div>

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
