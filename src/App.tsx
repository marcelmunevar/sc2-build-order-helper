import { useEffect, useState } from "react";
import "./App.css";
import InputSection from "./components/InputSection";
import type { BuildOrderItem } from "./components/InputSection";
import Controls from "./components/Controls";

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

  // Timer logic
  useEffect(() => {
    if (!isRunning) return;
    const timer = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [isRunning]);

  // Timer control functions
  const startTimer = () => setIsRunning(true);
  const pauseTimer = () => setIsRunning(false);
  const resetTimer = () => setElapsedSeconds(0);
  const incrementTime = (amount: number) =>
    setElapsedSeconds((prev) => prev + amount);

  // Callback to receive parsed build order from InputSection
  const handleBuildOrder = (parsedBuildOrder: BuildOrderItem[]) => {
    setBuildOrder(parsedBuildOrder);
  };

  const currentIndex = buildOrder.findIndex(
    (item) => elapsedSeconds < item.timeSeconds,
  );
  const highlightIndex =
    currentIndex === 0
      ? 0
      : currentIndex === -1
        ? buildOrder.length - 1
        : currentIndex - 1;

  return (
    <div className="container">
      <header>
        <h1>StarCraft II Build Order Helper</h1>
        <p>Track your build order with real-time highlighting</p>
      </header>

      <InputSection
        inputText={inputText}
        setInputText={setInputText}
        onBuildOrder={handleBuildOrder}
      />

      <div id="buildOrderSection" className="build-order-section">
        <Controls
          elapsedSeconds={elapsedSeconds}
          isRunning={isRunning}
          startTimer={startTimer}
          pauseTimer={pauseTimer}
          resetTimer={resetTimer}
          incrementTime={incrementTime}
        />

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
                  className={index === highlightIndex ? "current-item" : ""}
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
