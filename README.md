
# 🌆 CityShiftSimulator

> *"What if I moved there?"* — An AI-powered life simulator that lets you explore what your life would look like in any city on Earth.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-GitHub%20Pages-blue?style=for-the-badge)](https://bhavikaa-guptaa.github.io/CityShiftSimulator/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-4-646CFF?style=flat-square&logo=vite)](https://vitejs.dev/)
[![Three.js](https://img.shields.io/badge/Three.js-r184-black?style=flat-square&logo=threedotjs)](https://threejs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38BDF8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)

---

## ✨ Features

- **AI-Generated Life Simulations** — Enter any city and get a rich, narrative simulation of your daily life there: income, rent, commute, lifestyle, and more.
- **3D Avatar Environment** — A city-specific 3D avatar rendered with Three.js / React Three Fiber that lives in your simulated world.
- **Gender Toggle** — Choose your avatar's gender for a personalized experience.
- **Sims-Style Fullscreen Mode** — Immerse yourself with a fullscreen toggle for a true life-sim feel.
- **Shareable Results Card** — A beautifully styled card summarizing your simulated life, ready to share.
- **Smooth Animations** — Fluid UI transitions powered by Framer Motion.

---

## 🚀 Live Demo

👉 **[bhavikaa-guptaa.github.io/CityShiftSimulator](https://bhavikaa-guptaa.github.io/CityShiftSimulator/)**

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + Vite 4 |
| 3D Rendering | Three.js, React Three Fiber, Drei |
| Styling | Tailwind CSS 3, Framer Motion |
| AI | Claude API (Anthropic) via `claude-sonnet-4-6` |
| Deployment | GitHub Pages via `gh-pages` |

---

## 📁 Project Structure

```
CityShiftSimulator/
├── index.html              # App entry point
├── vite.config.js          # Vite config (includes base path for GitHub Pages)
├── tailwind.config.js      # Tailwind configuration
├── postcss.config.cjs      # PostCSS configuration
├── package.json            # Dependencies & scripts
└── src/
    ├── main.jsx            # React root
    ├── App.jsx             # Root component
    ├── components/         # UI components
    ├── hooks/              # Custom React hooks
    └── utils/              # Helper utilities
```

---

## ⚙️ Getting Started

### Prerequisites

- Node.js ≥ 18
- npm ≥ 9

### Installation

```bash
# Clone the repository
git clone https://github.com/bhavikaa-guptaa/CityShiftSimulator.git
cd CityShiftSimulator

# Install dependencies
npm install
```

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_ANTHROPIC_API_KEY=your_anthropic_api_key_here
```

> ⚠️ **Never commit your `.env` file.** It is already listed in `.gitignore`.

### Running Locally

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Building for Production

```bash
npm run build
```

The output will be in the `dist/` folder.

---

## 🌐 Deploying to GitHub Pages

The repo is pre-configured for GitHub Pages deployment using the `gh-pages` package.

**One-command deploy:**

```bash
npm run deploy
```

This runs `npm run build` first (via the `predeploy` hook), then pushes the `dist/` folder to the `gh-pages` branch.

After the first deploy, your app will be live at:
```
https://bhavikaa-guptaa.github.io/CityShiftSimulator/
```

> 📌 Make sure the `base` in `vite.config.js` is set to `"/CityShiftSimulator/"` for assets to load correctly on GitHub Pages (see the fix note below).

---

## 🐛 Known Issues & Fixes

### GitHub Pages: Blank Page / Missing Assets

If the deployed app shows a blank page, it's because Vite's default `base` is `/` but GitHub Pages serves from a subdirectory path. Fix:

```js
// vite.config.js
export default defineConfig({
  base: '/CityShiftSimulator/',   // ← this line is required
  plugins: [react()],
})
```

---

## 📜 License

This project is open source and available under the [MIT License](LICENSE).

---

## 👩‍💻 Author

**Bhavika Gupta** — [@bhavikaa-guptaa](https://github.com/bhavikaa-guptaa)
