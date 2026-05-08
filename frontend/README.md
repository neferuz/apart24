# Apart Premium Project

This project follows a **Senior-Level Architecture** designed for scalability, maintainability, and high performance.

## 🏗 Directory Structure

- `src/components/ui`: Base UI components (Design System atoms).
- `src/components/layout`: Global layout components (Header, Footer, Sidebar).
- `src/features`: Modular features. Each feature contains its own components and logic.
- `src/lib`: Configuration and instances for external libraries.
- `src/hooks`: Custom React hooks for shared logic.
- `src/services`: API fetchers and data layer logic.
- `src/utils`: Global utility functions (like `cn` for Tailwind).
- `src/types`: Global TypeScript definitions.

## 🎨 Design System

- **Glassmorphism**: Use the `.glass` class for blurred overlays.
- **Color Palette**: Custom primary blue `#5396e8` with refined slate shades.
- **Animations**: Powered by `framer-motion` for smooth interactions.

## 🚀 Getting Started

1. Install dependencies: `npm install`
2. Run development server: `npm run dev`
3. Build for production: `npm run build`
