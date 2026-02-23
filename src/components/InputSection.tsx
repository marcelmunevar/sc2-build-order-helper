import React, { useState } from "react";

export type BuildOrderItem = {
  supply: number;
  time: string;
  name: string;
  notes: string;
  timeSeconds: number;
};

type InputSectionProps = {
  inputText: string;
  setInputText: React.Dispatch<React.SetStateAction<string>>;
  onBuildOrderParsed: (parsedBuildOrder: BuildOrderItem[]) => void;
  parseTime: (timeString: string) => number;
};

const InputSection: React.FC<InputSectionProps> = ({
  inputText,
  setInputText,
  onBuildOrderParsed,
  parseTime,
}) => {
  const [error, setError] = useState<string | null>(null);

  const parseBuildOrder = (text: string) => {
    const lines = text.split("\n").filter((line) => line.trim());
    const buildOrder: BuildOrderItem[] = [];

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
    return buildOrder;
  };

  const loadBuildOrder = () => {
    setError(null);
    try {
      const parsed = parseBuildOrder(inputText);
      onBuildOrderParsed(parsed);
    } catch (e: any) {
      setError(e.message || "Failed to parse build order.");
      onBuildOrderParsed([]); // Clear build order on error
    }
  };

  return (
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
      <div id="error" className="error-message">
        {error}
      </div>
    </div>
  );
};

export default InputSection;
