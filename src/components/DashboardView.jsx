import React from 'react';
import { exportToJson, exportToCsv } from '../utils/exportUtils';
import ActivityHeatmap from './charts/ActivityHeatmap';
import WeekdayAveragesChart from './charts/WeekdayAveragesChart';
import MonthlyActivityChart from './charts/MonthlyActivityChart';
import YearlyActivityChart from './charts/YearlyActivityChart';
import MovingAverageChart from './charts/MovingAverageChart';
import CoolFacts from './charts/CoolFacts';
import { FileJson, FileSpreadsheet, Upload } from 'lucide-react';

export default function DashboardView({ data, onImport }) {
  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const importedData = JSON.parse(event.target.result);
        if (Array.isArray(importedData)) {
          onImport(importedData);
        } else {
          alert('Invalid JSON format. Expected an array of records.');
        }
      } catch (err) {
        alert('Failed to parse JSON file.');
      }
    };
    reader.readAsText(file);
  };

  if (!data || data.length === 0) {
    return (
      <div className="card text-center animate-slide-up" style={{ padding: '4rem 2rem' }}>
        <h2 className="mb-4">No Data Available</h2>
        <p className="text-muted mb-4">Fetch your data from Pomofocus or import a previously saved JSON file.</p>
        <label className="button flex items-center justify-center gap-2" style={{ display: 'inline-flex', cursor: 'pointer', background: 'var(--accent-cyan)', color: '#000', padding: '0.6em 1.2em', borderRadius: '8px', fontWeight: 500 }}>
          <Upload size={18} /> Import JSON
          <input type="file" accept=".json" style={{ display: 'none' }} onChange={handleImport} />
        </label>
      </div>
    );
  }

  return (
    <div className="flex-col gap-6 animate-slide-up">
      {/* Top Bar */}
      <div className="flex justify-between items-center mb-6">
        <h2>Dashboard</h2>
        <div className="flex gap-2">
          <label className="button outline flex items-center gap-2" style={{ display: 'inline-flex', cursor: 'pointer', padding: '0.6em 1.2em', borderRadius: '8px', border: '1px solid var(--accent-cyan)', color: 'var(--accent-cyan)' }}>
            <Upload size={18} /> Import Data
            <input type="file" accept=".json" style={{ display: 'none' }} onChange={handleImport} />
          </label>
          <button className="outline" onClick={() => exportToJson(data)}>
            <FileJson size={18} /> Export JSON
          </button>
          <button className="outline" onClick={() => exportToCsv(data)}>
            <FileSpreadsheet size={18} /> Export CSV
          </button>
        </div>
      </div>

      {/* Group: Key Metrics & Facts */}
      <div>
        <h3 className="text-muted uppercase tracking-wider mb-2 text-sm" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>Key Metrics</h3>
        <CoolFacts data={data} />
      </div>

      {/* Group: Moving Averages */}
      <div>
        <h3 className="text-muted uppercase tracking-wider mb-2 text-sm" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>Trends</h3>
        <MovingAverageChart data={data} />
      </div>

      {/* Group: History Heatmap */}
      <div>
        <h3 className="text-muted uppercase tracking-wider mb-2 text-sm" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>History</h3>
        <ActivityHeatmap data={data} />
      </div>

      {/* Group: Detailed Breakdowns */}
      <div>
        <h3 className="text-muted uppercase tracking-wider mb-2 text-sm" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>Breakdowns</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <WeekdayAveragesChart data={data} />
          <MonthlyActivityChart data={data} />
          <div className="md:col-span-2">
            <YearlyActivityChart data={data} />
          </div>
        </div>
      </div>
    </div>
  );
}
