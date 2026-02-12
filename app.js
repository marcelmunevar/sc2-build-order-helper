// Supply cost table for StarCraft II units and buildings
const SUPPLY_COSTS = {
  // Workers
  drone: 1,
  worker: 1,
  scv: 1,
  probe: 1,

  // Overlords/Overseers
  overlord: 0,
  overseer: 0,

  // Zerglings
  zergling: 0.5,

  // Queens
  queen: 2,

  // Roaches
  roach: 2,

  // Swarm Hosts
  "swarm host": 3,

  // Spine/Spore Crawlers
  "spine crawler": -1,
  "spore crawler": -1,

  // Mutalisk
  mutalisk: 3,

  // Baneling
  baneling: 1,

  // Infestor
  infestor: 2,

  // Ultralisk
  ultralisk: 4,

  // Brood Lord
  "brood lord": 4,

  // Hatchery
  hatchery: -1,

  // Buildings (no supply cost)
  "spawning pool": -1,
  extractor: -1,
  lair: 0,
  hive: 0,
  "infestation pit": -1,
  "nydus network": -1,
  "nydus canal": 0,
};

class BuildOrderHelper {
  constructor() {
    this.buildOrder = [];
    this.timerInterval = null;
    this.elapsedSeconds = 0;
    this.isRunning = false;
    this.currentItemIndex = -1;
    this.lastAnnounceIndex = -1;

    this.initializeElements();
    this.attachEventListeners();
  }

  initializeElements() {
    this.buildOrderInput = document.getElementById("buildOrderInput");
    this.loadBtn = document.getElementById("loadBtn");
    this.startBtn = document.getElementById("startBtn");
    this.pauseBtn = document.getElementById("pauseBtn");
    this.resetBtn = document.getElementById("resetBtn");
    this.decrement5Btn = document.getElementById("decrement5Btn");
    this.decrement1Btn = document.getElementById("decrement1Btn");
    this.increment1Btn = document.getElementById("increment1Btn");
    this.increment5Btn = document.getElementById("increment5Btn");
    this.timerText = document.getElementById("timerText");
    this.buildOrderBody = document.getElementById("buildOrderBody");
    this.buildOrderSection = document.getElementById("buildOrderSection");
    this.errorMessage = document.getElementById("error");
    this.loadingMessage = document.getElementById("loadingMessage");
  }

  attachEventListeners() {
    this.loadBtn.addEventListener("click", () => this.loadBuildOrder());
    this.startBtn.addEventListener("click", () => this.startTimer());
    this.decrement5Btn.addEventListener("click", () => this.incrementTime(-5));
    this.decrement1Btn.addEventListener("click", () => this.incrementTime(-1));
    this.pauseBtn.addEventListener("click", () => this.pauseTimer());
    this.resetBtn.addEventListener("click", () => this.resetTimer());
    this.increment1Btn.addEventListener("click", () => this.incrementTime(1));
    this.increment5Btn.addEventListener("click", () => this.incrementTime(5));
  }

  loadBuildOrder() {
    const buildOrderText = this.buildOrderInput.value.trim();

    if (!buildOrderText) {
      this.showError("Please paste a build order");
      return;
    }

    this.clearError();

    try {
      this.parseBuildOrderText(buildOrderText);
      this.displayBuildOrder();
      this.showBuildOrderSection(true);
    } catch (error) {
      this.showError(`Error parsing build order: ${error.message}`);
      console.error(error);
    }
  }

  parseBuildOrderText(text) {
    this.buildOrder = [];
    const lines = text.split("\n").filter((line) => line.trim());

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
          this.buildOrder.push({
            supply: supply,
            time: timeStr,
            building: building,
            notes: notes,
            timeSeconds: this.timeStringToSeconds(timeStr),
          });
        }
      }
    });

    if (this.buildOrder.length === 0) {
      throw new Error("No build steps found. Please check the format.");
    }

    // Sort by time
    this.buildOrder.sort((a, b) => a.timeSeconds - b.timeSeconds);
  }

  timeStringToSeconds(timeStr) {
    if (!timeStr) return 0;

    const match = timeStr.match(/(\d+):(\d+)/);
    if (match) {
      const minutes = parseInt(match[1], 10);
      const seconds = parseInt(match[2], 10);
      return minutes * 60 + seconds;
    }
    return 0;
  }

  secondsToTimeString(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  }

  displayBuildOrder() {
    this.buildOrderBody.innerHTML = "";

    let currentSupply = 12; // Start with 12 workers
    let itemIndex = 0;
    let displayOrder = []; // Track all items in display order

    this.buildOrder.forEach((item, index) => {
      const itemSupplyCost = this.getSupplyCost(item.building);

      // If the item is at a supply level higher than what we have available,
      // we need to build drones to reach it
      if (item.supply > currentSupply) {
        const workersNeeded = item.supply - currentSupply;
        const newWorkerSupply = currentSupply + workersNeeded;
        const workerRow = document.createElement("tr");
        workerRow.id = `worker-item-${index}`;
        workerRow.className = "worker-row upcoming-item";

        // Determine drone time
        let droneTimeSeconds = 0;
        console.log(index);
        if (index > 0) {
          console.log(this.buildOrder[index - 1]);
          // Use previous item's timeSeconds for all future drones
          droneTimeSeconds = this.buildOrder[index - 1].timeSeconds + 1;
        }

        workerRow.innerHTML = `
                <td class="supply">${currentSupply}-${newWorkerSupply}</td>
                <td class="time">${this.secondsToTimeString(droneTimeSeconds)}</td>
                <td class="building" style="color: #4caf50;">Drone x${workersNeeded}</td>
                <td class="notes"></td>
            `;

        this.buildOrderBody.appendChild(workerRow);

        // Add drone to display order with timing before the next item
        displayOrder.push({
          supply: newWorkerSupply,
          timeSeconds: droneTimeSeconds,
          building: `Drone x${workersNeeded}`,
          notes: "",
          isDrone: true,
          htmlId: `worker-item-${index}`,
        });

        currentSupply = newWorkerSupply;
      }

      // Add the actual build order item
      const row = document.createElement("tr");
      row.id = `build-item-${itemIndex}`;
      row.className = "upcoming-item";

      row.innerHTML = `
                <td class="supply">${item.supply}</td>
                <td class="time">${this.secondsToTimeString(item.timeSeconds)}</td>
                <td class="building">${this.escapeHtml(item.building)}</td>
                <td class="notes">${this.escapeHtml(item.notes)}</td>
            `;

      this.buildOrderBody.appendChild(row);

      // Add item to display order
      displayOrder.push({
        supply: item.supply,
        timeSeconds: item.timeSeconds,
        building: item.building,
        notes: item.notes,
        isDrone: false,
        htmlId: `build-item-${itemIndex}`,
      });

      itemIndex++;

      // Update current supply: the item's supply plus any unit cost
      // This accounts for items that increase our available supply
      currentSupply = item.supply + itemSupplyCost;
    });

    // Store display order for use in updateHighlight
    this.displayOrder = displayOrder;
  }

  getSupplyCost(building) {
    const buildingLower = building.toLowerCase();
    let totalCost = 0;

    // Handle comma-separated items (e.g., "Zergling x2, Swarm Host")
    const items = building.split(",").map((item) => item.trim());

    items.forEach((item) => {
      const itemLower = item.toLowerCase();

      // Check for exact matches first
      if (itemLower in SUPPLY_COSTS) {
        let cost = SUPPLY_COSTS[itemLower];
        // Handle multiple units (e.g., "Zergling x2")
        const match = item.match(/x(\d+)/i);
        if (match) {
          cost *= parseInt(match[1], 10);
        }
        totalCost += cost;
        return;
      }

      // Check for partial matches
      for (const [unit, cost] of Object.entries(SUPPLY_COSTS)) {
        if (itemLower.includes(unit)) {
          let finalCost = cost;
          // Handle multiple units (e.g., "Zergling x2")
          const match = item.match(/x(\d+)/i);
          if (match) {
            finalCost = cost * parseInt(match[1], 10);
          }
          totalCost += finalCost;
          return;
        }
      }

      // Default to 1 if not found
      totalCost += 1;
    });

    return totalCost;
  }

  startTimer() {
    if (this.isRunning) return;

    this.isRunning = true;
    this.startBtn.classList.add("hidden");
    this.pauseBtn.classList.remove("hidden");

    this.timerInterval = setInterval(() => {
      this.elapsedSeconds++;
      this.updateTimer();
      this.updateHighlight();
    }, 1000);
  }

  pauseTimer() {
    this.isRunning = false;
    clearInterval(this.timerInterval);

    this.startBtn.classList.remove("hidden");
    this.pauseBtn.classList.add("hidden");
  }

  resetTimer() {
    this.pauseTimer();
    this.elapsedSeconds = 0;
    this.currentItemIndex = -1;
    this.lastAnnounceIndex;

    // Reset all row highlighting
    document.querySelectorAll("#buildOrderBody tr").forEach((row) => {
      row.className = "upcoming-item";
    });
  }

  incrementTime(seconds) {
    this.elapsedSeconds += seconds;
    // Prevent negative time
    if (this.elapsedSeconds < 0) {
      this.elapsedSeconds = 0;
    }
    this.updateTimer();
    this.updateHighlight();
  }

  updateTimer() {
    this.timerText.textContent = this.secondsToTimeString(this.elapsedSeconds);
  }

  updateHighlight() {
    if (!this.displayOrder) return; // Exit if display order not set yet

    let newCurrentIndex = -1;

    // Find the current and upcoming items in display order
    for (let i = 0; i < this.displayOrder.length; i++) {
      const item = this.displayOrder[i];

      if (this.elapsedSeconds >= item.timeSeconds) {
        newCurrentIndex = i;
      } else {
        break;
      }
    }

    // Update highlighting
    this.displayOrder.forEach((item, index) => {
      const row = document.getElementById(item.htmlId);
      if (!row) return;

      row.classList.remove("current-item", "completed-item", "upcoming-item");

      if (index < newCurrentIndex) {
        row.classList.add("completed-item");
      } else if (index === newCurrentIndex && newCurrentIndex !== -1) {
        row.classList.add("current-item");
      } else {
        row.classList.add("upcoming-item");
      }
    });

    // Auto-scroll to current item
    if (newCurrentIndex !== -1) {
      const currentItem = this.displayOrder[newCurrentIndex];
      const currentRow = document.getElementById(currentItem.htmlId);
      if (currentRow) {
        currentRow.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }

    // Announce new build item
    if (newCurrentIndex !== this.lastAnnounceIndex && newCurrentIndex !== -1) {
      const item = this.displayOrder[newCurrentIndex];
      this.announce(`Build ${item.building}`);
      this.lastAnnounceIndex = newCurrentIndex;
    }

    this.currentItemIndex = newCurrentIndex;
  }

  announce(text) {
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    // Create new utterance
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 1;

    // Speak the text
    window.speechSynthesis.speak(utterance);
  }

  showError(message) {
    this.errorMessage.textContent = message;
    this.errorMessage.style.display = "block";
  }

  clearError() {
    this.errorMessage.textContent = "";
    this.errorMessage.style.display = "none";
  }

  showBuildOrderSection(show) {
    if (show) {
      this.buildOrderSection.classList.remove("hidden");
      this.resetTimer();
    } else {
      this.buildOrderSection.classList.add("hidden");
    }
  }

  escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }
}

// Initialize the app when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new BuildOrderHelper();
});
