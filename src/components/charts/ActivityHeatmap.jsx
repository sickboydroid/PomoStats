import React from 'react';
import { getDailyActivityMap } from '../../utils/dataProcessing';

export default function ActivityHeatmap({ data }) {
  const dailyMap = getDailyActivityMap(data);
  
  // Calculate a basic grid representation (last 365 days or just the range of data)
  // For simplicity, let's just do a 52x7 grid of the past year.
  const today = new Date();
  const days = [];
  const oneDay = 24 * 60 * 60 * 1000;
  
  // Create last 365 days array
  for (let i = 364; i >= 0; i--) {
    const d = new Date(today.getTime() - i * oneDay);
    const dateKey = d.toISOString().split('T')[0];
    const minutes = dailyMap[dateKey] || 0;
    days.push({ dateKey, minutes });
  }

  // Helper for color intensity based on max minutes
  const maxMinutes = Math.max(...Object.values(dailyMap).length ? Object.values(dailyMap) : [0], 120);
  
  const getColor = (minutes) => {
    if (minutes === 0) return 'var(--bg-main)';
    const intensity = Math.min(minutes / maxMinutes, 1);
    // Cyperbunk Cyan: rgba(0, 240, 255, a)
    const alpha = 0.2 + (intensity * 0.8);
    return `rgba(0, 240, 255, ${alpha})`;
  };

  return (
    <div className="card w-full animate-slide-up">
      <h3 style={{ marginBottom: '1.5rem' }}>Activity Heatmap (Past Year)</h3>
      <div 
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(52, 1fr)',
          gridTemplateRows: 'repeat(7, 1fr)',
          gap: '4px',
          gridAutoFlow: 'column',
          overflowX: 'auto',
          paddingBottom: '0.5rem'
        }}
      >
        {days.map((day, idx) => (
          <div
            key={idx}
            title={`${day.dateKey}: ${day.minutes.toFixed(1)} mins`}
            style={{
              width: '12px',
              height: '12px',
              backgroundColor: getColor(day.minutes),
              borderRadius: '2px',
              border: '1px solid var(--border-color)',
              transition: 'transform 0.2s'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'scale(1.5)';
              e.target.style.zIndex = 10;
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'scale(1)';
              e.target.style.zIndex = 1;
            }}
          />
        ))}
      </div>
      <div className="flex justify-between text-muted text-sm mt-4">
        <span>Less</span>
        <div className="flex gap-2">
          {[0, 0.25, 0.5, 0.75, 1].map((intensity, i) => (
            <div 
              key={i}
              style={{
                width: '12px', height: '12px', borderRadius: '2px',
                backgroundColor: intensity === 0 ? 'var(--bg-main)' : `rgba(0, 240, 255, ${0.2 + intensity * 0.8})`,
                border: '1px solid var(--border-color)'
              }}
            />
          ))}
        </div>
        <span>More</span>
      </div>
    </div>
  );
}
