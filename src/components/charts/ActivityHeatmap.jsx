import React, { useRef, useEffect } from 'react';
import { getDailyActivityMap } from '../../utils/dataProcessing';

export default function ActivityHeatmap({ data }) {
  const scrollRef = useRef(null);
  const dailyMap = getDailyActivityMap(data);
  const dates = Object.keys(dailyMap).sort();
  
  if (dates.length === 0) return null;

  const firstDate = new Date(dates[0]);
  const lastDate = new Date(dates[dates.length - 1]);
  
  // Make sure we start on a Sunday
  const startDate = new Date(firstDate);
  startDate.setDate(startDate.getDate() - startDate.getDay());

  // Make sure we end on a Saturday
  const endDate = new Date(lastDate);
  endDate.setDate(endDate.getDate() + (6 - endDate.getDay()));

  const allDays = [];
  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    const key = d.toISOString().split('T')[0];
    allDays.push({ dateKey: key, minutes: dailyMap[key] || 0, date: new Date(d) });
  }

  // Group into weeks
  const weeks = [];
  for (let i = 0; i < allDays.length; i += 7) {
    weeks.push(allDays.slice(i, i + 7));
  }

  const maxMinutes = Math.max(...Object.values(dailyMap).length ? Object.values(dailyMap) : [0], 120);
  
  const getColor = (minutes) => {
    if (minutes === 0) return 'var(--bg-main)';
    const intensity = Math.min(minutes / maxMinutes, 1);
    const alpha = 0.2 + (intensity * 0.8);
    return `rgba(0, 240, 255, ${alpha})`;
  };

  // Extract month labels. Only add a month label if the first day of the week is the ~start of the month
  const monthLabels = [];
  weeks.forEach((week, index) => {
    const firstDay = week[0].date;
    if (firstDay.getDate() <= 7) {
      monthLabels.push({ index, label: firstDay.toLocaleString('default', { month: 'short' }) });
    }
  });

  // Scroll to the far right on mount (most recent data)
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
    }
  }, [data]);

  return (
    <div className="card w-full animate-slide-up">
      <h3 style={{ marginBottom: '0.5rem' }}>All-Time Activity Heatmap</h3>
      <p className="text-muted text-sm mb-4">Scroll horizontally to view your entire history.</p>

      <div 
        ref={scrollRef}
        style={{
          width: '100%',
          overflowX: 'auto',
          paddingBottom: '1rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px'
        }}
        className="heatmap-scroll-container"
      >
        {/* Month Labels */}
        <div style={{ display: 'flex', position: 'relative', height: '20px', minWidth: `${weeks.length * 16}px` }}>
          {monthLabels.map((m, i) => (
            <span 
              key={i} 
              style={{ 
                position: 'absolute', 
                left: `${m.index * 16}px`,
                fontSize: '12px',
                color: 'var(--text-muted)'
              }}
            >
              {m.label}
            </span>
          ))}
        </div>

        {/* Heatmap Grid */}
        <div style={{ display: 'flex', gap: '4px' }}>
          {weeks.map((week, wIdx) => (
            <div key={wIdx} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {week.map((day, dIdx) => (
                <div
                  key={dIdx}
                  title={`${day.dateKey}: ${(day.minutes / 60).toFixed(1)} hrs`}
                  style={{
                    width: '12px',
                    height: '12px',
                    backgroundColor: getColor(day.minutes),
                    borderRadius: '2px',
                    border: '1px solid var(--border-color)',
                    transition: 'transform 0.2s',
                    cursor: 'pointer'
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
          ))}
        </div>
      </div>

      <div className="flex justify-between text-muted text-sm mt-2">
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
