# PomofocusDataVisualizer Project Structure

This document outlines the directory and file structure of the project. It will be updated as new modules are added.

```
/
├── public/                 # Static assets (favicon, etc.)
├── src/                    # Source code
│   ├── assets/             # Images, global styles
│   ├── components/         # React components
│   │   ├── charts/         # Chart components (Heatmap, Bar charts, etc.)
│   │   ├── FetchView.jsx   # Data fetching UI
│   │   ├── DashboardView.jsx # Visualization dashboard UI
│   ├── services/           # External API calls and logic
│   │   └── api.js          # Pomofocus API client
│   ├── utils/              # Helper functions
│   │   ├── dataProcessing.js # Functions to process raw data for charts
│   │   └── exportUtils.js  # CSV/JSON export logic
│   ├── App.jsx             # Main application layout and routing
│   ├── main.jsx            # React entry point
│   └── index.css           # Global vanilla CSS (variables, themes, animations)
├── index.html              # HTML entry point
├── package.json            # Dependencies and scripts
├── vite.config.js          # Vite configuration
└── PROJECT_STRUCTURE.md    # This file
```

## Modules
- **Fetcher**: Handles communication with the Pomofocus API, utilizing user-provided `authorization` and `cookie` headers. Supports paginated fetching and progress updates.
- **Visualizer**: Uses `recharts` and custom CSS grid to render interactive, aesthetic charts (Heatmap, Weekly averages, Monthly trends).
- **Data Processor**: Aggregates the raw JSON payload into structured formats expected by the visualization components.
- **Importer/Exporter**: Allows users to save their fetched data locally and load it back later without re-fetching.
