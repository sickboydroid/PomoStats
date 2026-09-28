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
    if (minutes === 0) return 'var(--bg-main)';
    const intensity = Math.min(minutes / maxMinutes, 1);
    const alpha = 0.2 + (intensity * 0.8);
    // Hash year to color
    const colorIdx = year % YEAR_COLORS.length;
    return `rgba(${YEAR_COLORS[colorIdx]}, ${alpha})`;
  };

  // Scroll to the far right on mount (most recent data)
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
    }
  }, [data]);

  const monthLabels = [];
  const yearLabels = [];

  let currentOffset = 0;
  
  // Calculate gaps and label positions
  const renderWeeks = weeks.map((week, wIdx) => {
    const thurs = week[3].date; // Thursday determines the week's month/year
    const currentMonth = thurs.getMonth();
    const currentYear = thurs.getFullYear();

    let marginRight = 4; // Default gap between weeks
    let isYearChange = false;
    let isMonthChange = false;

    if (wIdx < weeks.length - 1) {
      const nextThurs = weeks[wIdx + 1][3].date;
      if (nextThurs.getFullYear() !== currentYear) {
        marginRight = 32; // Large gap for year
        isYearChange = true;
      } else if (nextThurs.getMonth() !== currentMonth) {
        marginRight = 16; // Medium gap for month
        isMonthChange = true;
      }
    }

    // Add Labels for the current week if it's the start
    if (wIdx === 0) {
      yearLabels.push({ offset: currentOffset, label: currentYear.toString() });
    }
    
    // Check if this week starts a new month (or is week 0)
    if (wIdx === 0 || isMonthChange || isYearChange) {
      const firstDayOfMonth = week.find(d => d.date.getDate() <= 7);
      if (firstDayOfMonth || wIdx === 0) {
        monthLabels.push({
          offset: currentOffset,
          label: (firstDayOfMonth ? firstDayOfMonth.date : thurs).toLocaleString('default', { month: 'short' })
        });
      }
    }

    // If next week is a year change, push the NEXT year's label at the NEXT offset
    if (isYearChange) {
      const nextThurs = weeks[wIdx + 1][3].date;
      yearLabels.push({
        offset: currentOffset + 12 + marginRight,
        label: nextThurs.getFullYear().toString()
      });
    }

    const weekWidth = 12 + marginRight; // 12px width + margin
    const colOffset = currentOffset;
    currentOffset += weekWidth;

    return (
      <div key={wIdx} style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginRight: `${marginRight}px` }}>
        {week.map((day, dIdx) => {
          const isZero = day.minutes === 0;
          const tooltip = isZero ? `${day.dateKey}: No activity` : `${day.dateKey}: ${(day.minutes / 60).toFixed(1)} hrs`;
          
          return (
            <div
              key={dIdx}
              title={tooltip}
              style={{
                width: '12px',
                height: '12px',
                backgroundColor: getColor(day.minutes, currentYear),
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
          gap: '4px'
        }}
        className="heatmap-scroll-container"
      >
        {/* Year Labels */}
        <div style={{ display: 'flex', position: 'relative', height: '16px', minWidth: `${currentOffset}px` }}>
          {yearLabels.map((y, i) => (
            <span 
              key={`y-${i}`} 
              style={{ 
                position: 'absolute', 
                left: `${y.offset}px`,
                fontSize: '11px',
                fontWeight: 'bold',
                color: 'var(--text-main)',
                backgroundColor: 'rgba(255,255,255,0.1)',
                padding: '0 4px',
                borderRadius: '4px'
              }}
            >
              {y.label}
            </span>
          ))}
        </div>

        {/* Month Labels */}
        <div style={{ display: 'flex', position: 'relative', height: '20px', minWidth: `${currentOffset}px` }}>
          {monthLabels.map((m, i) => (
            <span 
              key={`m-${i}`} 
              style={{ 
                position: 'absolute', 
                left: `${m.offset}px`,
                fontSize: '12px',
                color: 'var(--text-muted)'
              }}
            >
              {m.label}
            </span>
          ))}
        </div>

        {/* Heatmap Grid */}
        <div style={{ display: 'flex' }}>
          {renderWeeks}
        </div>
      </div>
    </div>
  );
}
