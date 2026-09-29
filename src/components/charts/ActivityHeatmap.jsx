import React, { useRef, useEffect } from 'react';
import { getDailyActivityMap } from '../../utils/dataProcessing';

export default function ActivityHeatmap({ data }) {
  const scrollRef = useRef(null);
  const dailyMap = getDailyActivityMap(data);
  const dates = Object.keys(dailyMap).sort();
  
  if (dates.length === 0) return null;

  const firstDate = new Date(dates[0]);
  const lastDate = new Date(dates[dates.length - 1]);
  
  // Start on a Sunday
  const startDate = new Date(firstDate);
  startDate.setDate(startDate.getDate() - startDate.getDay());

  // End on a Saturday
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
  
  const YEAR_COLORS = [
    '0, 240, 255', // Cyan
    '236, 72, 153', // Pink
    '245, 158, 11', // Orange
    '139, 92, 246', // Purple
    '16, 185, 129', // Emerald
  ];

  const getColor = (minutes, year) => {
    if (minutes === 0) return 'rgba(255, 255, 255, 0.05)'; // Subtle visible empty cell
    const intensity = Math.min(minutes / maxMinutes, 1);
    // Non-linear scaling to boost visibility of smaller sessions
    const alpha = 0.25 + (Math.pow(intensity, 0.5) * 0.75);
    // Hash year to color
    const colorIdx = year % YEAR_COLORS.length;
    return `rgba(${YEAR_COLORS[colorIdx]}, ${alpha.toFixed(3)})`;
  };

  // Scroll to the far right on mount (most recent data)
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
    }
  }, [data]);

  const [hoveredCell, setHoveredCell] = React.useState(null);

  const combinedLabels = [];
  let currentOffset = 0;
  let lastPrintedMonth = -1;
  let lastPrintedYear = -1;
  
  // Calculate gaps and label positions
  const renderWeeks = weeks.map((week, wIdx) => {
    const thurs = week[3].date; // Thursday determines the week's month/year
    const currentMonth = thurs.getMonth();
    const currentYear = thurs.getFullYear();

    let marginRight = 4; // Default gap between weeks

    if (wIdx < weeks.length - 1) {
      const nextThurs = weeks[wIdx + 1][3].date;
      if (nextThurs.getFullYear() !== currentYear) {
        marginRight = 24; // Medium-large gap for year
      } else if (nextThurs.getMonth() !== currentMonth) {
        marginRight = 12; // Medium gap for month
      }
    }

    if (currentMonth !== lastPrintedMonth || currentYear !== lastPrintedYear) {
      const monthStr = thurs.toLocaleString('default', { month: 'short' });
      const yearStr = currentYear.toString();
      
      let labelContent;
      if (currentMonth === 0 || lastPrintedMonth === -1) {
        labelContent = (
          <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>
            {monthStr} <span style={{ opacity: 0.6, fontSize: '11px', fontWeight: 'normal', marginLeft: '2px' }}>({yearStr})</span>
          </span>
        );
      } else {
        labelContent = <span style={{ color: 'var(--text-muted)' }}>{monthStr}</span>;
      }

      combinedLabels.push({
        offset: currentOffset,
        node: labelContent
      });
      
      lastPrintedMonth = currentMonth;
      lastPrintedYear = currentYear;
    }

    const weekWidth = 12 + marginRight; // 12px width + margin
    currentOffset += weekWidth;

    return (
      <div key={wIdx} style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginRight: `${marginRight}px` }}>
        {week.map((day, dIdx) => {
          return (
            <div
              key={dIdx}
              style={{
                width: '12px',
                height: '12px',
                backgroundColor: getColor(day.minutes, currentYear),
                borderRadius: '3px',
                transition: 'transform 0.15s ease, z-index 0s',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'scale(1.4)';
                e.target.style.zIndex = 10;
                e.target.style.boxShadow = '0 0 10px rgba(0,0,0,0.5)';
                const rect = e.target.getBoundingClientRect();
                setHoveredCell({
                  date: day.dateKey,
                  minutes: day.minutes,
                  x: rect.x + rect.width / 2,
                  y: rect.y
                });
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'scale(1)';
                e.target.style.zIndex = 1;
                e.target.style.boxShadow = 'none';
                setHoveredCell(null);
              }}
            />
          );
        })}
      </div>
    );
  });

  return (
    <div className="card w-full animate-slide-up">
      <h3 style={{ marginBottom: '0.25rem' }}>All-Time Activity Heatmap</h3>
      <p className="text-muted text-sm mb-4">Historical view of your focused hours.</p>

      <div 
        ref={scrollRef}
        style={{
          width: '100%',
          overflowX: 'auto',
          paddingBottom: '1rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}
        className="heatmap-scroll-container"
      >
        {/* Unified Month/Year Labels */}
        <div style={{ display: 'flex', position: 'relative', height: '20px', minWidth: `${currentOffset}px` }}>
          {combinedLabels.map((item, i) => (
            <div 
              key={`label-${i}`} 
              style={{ 
                position: 'absolute', 
                left: `${item.offset}px`,
                fontSize: '12px',
                whiteSpace: 'nowrap'
              }}
            >
              {item.node}
            </div>
          ))}
        </div>

        {/* Heatmap Grid */}
        <div style={{ display: 'flex' }}>
          {renderWeeks}
        </div>
      </div>

      {hoveredCell && (
        <div style={{
          position: 'fixed',
          top: hoveredCell.y - 12,
          left: hoveredCell.x,
          transform: 'translate(-50%, -100%)',
          backgroundColor: 'var(--bg-card-hover)',
          border: '1px solid var(--border-color)',
          padding: '6px 12px',
          borderRadius: '6px',
          boxShadow: '0 4px 15px rgba(0,0,0,0.5)',
          pointerEvents: 'none',
          zIndex: 9999,
          fontSize: '12px',
          textAlign: 'center',
          minWidth: '90px'
        }}>
          <div style={{ color: 'var(--text-muted)', marginBottom: '2px' }}>{hoveredCell.date}</div>
          <div style={{ fontWeight: 600 }}>{hoveredCell.minutes === 0 ? 'No activity' : `${(hoveredCell.minutes / 60).toFixed(1)} hrs`}</div>
        </div>
      )}
    </div>
  );
}
