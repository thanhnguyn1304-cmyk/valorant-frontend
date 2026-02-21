# ValorTracker - Frontend Application

ValorTracker is an ultimate statistical and strategic companion for VALORANT players. This repository houses the React frontend that interfaces with the FastAPI backend.

## 🎨 Visual Identity

Designed with the "Divine Duality" theme, the UI captures the essence of sleek, modern gaming aesthetics.

*   **Cybernetic Dark Mode:** Deep `#111111` surfaces interlaced with `#FF4655` (VALORANT Red) accents.
*   **Radiant Gradients:** Extensive use of `radial-gradient` backgrounds to create a deep, glowing, futuristic atmosphere.
*   **Micro-Animations:** Fluid state transitions, hover elevations, and dynamic pulse effects to make the interface feel alive and responsive.
*   **Glassmorphism:** Semi-transparent panels with backdrop filtering (`backdrop-blur-md`) to ensure legible data over rich backgrounds.

## 💻 Tech Stack

*   **Core:** React 18, Vite
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS (Custom thematic variables)
*   **Routing:** React Router v6
*   **Icons:** Lucide-React

## ⚙️ Environment Configuration

To connect this frontend to the FastAPI backend, you must define the `VITE_API_BASE_URL` in your `.env` or Vercel Environment Variables.

```env
# Local Development
VITE_API_BASE_URL=http://localhost:8000

# Production Deployment
VITE_API_BASE_URL=https://valortracker.onrender.com
```
*Note: Ensure there is **NO** trailing slash in the production URL.*

## 🚀 Deployment (Vercel)

This frontend is configured and optimized for zero-config deployments on **Vercel**.

1.  Push the code to the `main` branch.
2.  Vercel automatically triggers a build via `npm run build`.
3.  Client-side routing is strictly handled via the included `vercel.json` rewrite rules to prevent 404 errors on deep profile nested links.
