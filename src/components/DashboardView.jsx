import React from 'react';
import ActivityHeatmap from './charts/ActivityHeatmap';
import WeekdayAveragesChart from './charts/WeekdayAveragesChart';
import MonthlyActivityChart from './charts/MonthlyActivityChart';
import YearlyActivityChart from './charts/YearlyActivityChart';
import DailyActivityChart from './charts/DailyActivityChart';
import WeeklyActivityChart from './charts/WeeklyActivityChart';
import HourlyActivityChart from './charts/HourlyActivityChart';
import CoolFacts from './charts/CoolFacts';
import { DownloadCloud, Upload } from 'lucide-react';

export default function DashboardView({ data, onImportClick, onFetchClick }) {
  if (!data || data.length === 0) {
    return (
      <div className="card text-center animate-slide-up" style={{ padding: '4rem 2rem' }}>
        <h2 className="mb-4">No Data Available</h2>
        <p className="text-muted mb-4">Fetch your data from Pomofocus or import a previously saved JSON file.</p>
        <div className="flex justify-center gap-3">
          <button onClick={onFetchClick}>
            <DownloadCloud size={18} /> Fetch Data
          </button>
          <button className="outline" onClick={onImportClick}>
            <Upload size={18} /> Import JSON
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-col gap-6 animate-slide-up">
      {/* Group: Key Metrics & Facts */}
      <div>
        <h3 className="text-muted uppercase tracking-wider mb-2 text-sm" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>Key Metrics</h3>
        <CoolFacts data={data} />
      </div>

      {/* Group: Trends (Full horizontal width for detail) */}
      <div>
        <h3 className="text-muted uppercase tracking-wider mb-2 text-sm" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>Trends</h3>
        <div className="flex-col gap-4 mb-4" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <DailyActivityChart data={data} />
          <WeeklyActivityChart data={data} />
        </div>
      </div>

      {/* Group: Detailed Breakdowns */}
      <div>
        <h3 className="text-muted uppercase tracking-wider mb-2 text-sm" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>Time Analysis</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <YearlyActivityChart data={data} />
          <MonthlyActivityChart data={data} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <WeekdayAveragesChart data={data} />
          <HourlyActivityChart data={data} />
        </div>
      </div>

      {/* Group: History Heatmap */}
      <div>
        <h3 className="text-muted uppercase tracking-wider mb-2 text-sm" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>History</h3>
        <ActivityHeatmap data={data} />
      </div>
    </div>
  );
}

