### Overview

This project is a dynamic mindmap visualization tool built with React. It allows users to explore hierarchical data, view node details, and edit nodes interactively.

### Technologies Used

- **HTML5 Canvas:** For rendering the mindmap nodes and connections efficiently.
- **JavaScript (ES6+):** Core programming language for logic and interactivity.
- **Tailwind CSS:** Utility-first CSS framework for styling and responsive layouts.

### Libraries Used

- **React:** JavaScript library for building component-based user interfaces.
- **Lucide React:** Icon library providing scalable, customizable SVG icons for React.

### Overall Architecture / Approach

- **Component-based structure:** Each feature (canvas, tooltip, buttons) is modular and reusable.
- **Canvas-centric rendering:** All visuals are drawn manually via Canvas API for performance and flexibility.
- **State-driven interaction:** Zoom, pan, hover, and collapse states are managed via React hooks (useState, useEffect, useRef).
- **Responsive layout:** Canvas resizes dynamically using container dimensions and device pixel ratio.

### Data Flow:

**Demo Data (Current Setup)**

- A sample JSON file is stored in the public/ directory.
- The app directly imports this demo data into the React component tree.
- This keeps the project simple and avoids unnecessary API calls during development.
- Example:

```
import demoData from "../public/mindmap.json";
```

**Alternative Data Sources (Future Setup)**

- If connected to an API or backend, the same JSON structure can be fetched dynamically using fetch() or Axios.
- Data can be loaded into state (useEffect + useState) instead of direct import.
- If React Router were used, data could also be fetched via route loaders for page-level data injection.
- Example:

```
useEffect(() => {
  fetch("/api/mindmap")
  .then(res => res.json())
  .then(setData);
  }, []);
```

### Key Features

- Zoomable and draggable mindmap.

- Expand/Collapse nodes.

- Fit view to center the mindmap.

- Tooltip on hover.

- Side panel with detailed node info.

- Add child nodes dynamically to any node, not just the root.
