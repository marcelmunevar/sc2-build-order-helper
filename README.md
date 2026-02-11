# SC2 Build Order Helper

A web-based tool for StarCraft II players to practice and follow build orders with real-time timer highlights and audio announcements.

## Features

- **Real-time Highlighting**: Current build step is highlighted as the timer progresses
- **Timer Controls**: Start, pause, reset buttons with +1s, +5s, -1s, -5s increment/decrement buttons
- **Audio Announcements**: Text-to-speech announcements notify you when to build each unit
- **Intelligent Drone Tracking**: Automatically inserts drone rows based on supply cost calculations
- **Supply Cost Tracking**: Supports multiple units with accurate supply consumption (e.g., Zergling = 0.5 supply, Swarm Host = 3 supply)
- **Auto-scrolling**: View automatically scrolls to highlight the current build step
- **Dark Theme**: Sci-fi inspired UI with cyan accents

## Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/sc2-build-order-helper.git
cd sc2-build-order-helper
```

2. Install dependencies:

```bash
npm install
```

## Usage

1. Start the development server:

```bash
npm start
```

2. Open your browser (automatically opens at http://localhost:8080)

3. Paste your build order in the textarea using the format:

```
Supply    Time    Building/Unit    Notes
12        0:00    Drone x2
13        0:15    Spawning Pool
16        1:00    Zergling x2
20        2:00    Swarm Host x2
```

4. Click "Start Timer" to begin following the build order

5. Use the control buttons to adjust timing as needed

## Build Order Format

The input expects tab or space-separated columns:

| Column        | Purpose               | Example                           |
| ------------- | --------------------- | --------------------------------- |
| Supply        | Target supply count   | 12, 16, 20                        |
| Time          | When to build (MM:SS) | 0:30, 2:45                        |
| Building/Unit | What to build         | Drone, Spawning Pool, Zergling x2 |
| Notes         | Optional notes        | Early pool, All-in                |

**Supported Units/Buildings:**

- Drone, Overlord
- Swarm Host, Zergling, Queen, Roach, Mutalisk, Ultralisk, Brood Lord
- Spawning Pool, Extractor, Lair, Hive, Spine Crawler, Spore Crawler

## How Supply Tracking Works

The helper uses supply economics to intelligently insert drone rows:

- **Units consume supply**: Zergling = 0.5, Queen = 2, Roach = 2, Swarm Host = 3, etc.
- **Buildings tie up drones**: Each building (Spawning Pool, Extractor, etc.) costs -1 supply (one drone is busy)
- **Automatic drone insertion**: If you need to reach a supply target but don't have enough drones, a row is automatically inserted

Example: Building from supply 16 to 20 with "Zergling x2" (costs 1 supply):

- Current supply after action: 16 + 1 = 17
- Supply needed: 20
- Drones to build: 20 - 17 = 3 drones

## Technologies

- **Vanilla JavaScript (ES6+)**: Zero dependencies for portability
- **HTML5 & CSS3**: Responsive design with flexbox and gradients
- **Web Speech API**: Browser-native text-to-speech for announcements
- **http-server**: Local development server

## File Structure

```
sc2-build-order-helper/
├── index.html        # HTML structure and UI
├── app.js            # Core application logic
├── styles.css        # Styling and theme
├── package.json      # Project metadata and dependencies
└── README.md         # This file
```

## Project Status

Fully functional and ready to use. Features include:

- ✓ Real-time timer with highlighting
- ✓ Audio announcements
- ✓ Supply cost calculations
- ✓ Drone row insertion
- ✓ Multi-unit parsing (comma-separated items)
- ✓ Responsive design

## License

MIT

## Contributing

Feel free to submit issues or pull requests to improve the build order helper!
