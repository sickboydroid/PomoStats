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
  
  const getColor = (minutes) => {
    if (minutes === 0) return 'var(--bg-main)';
    const intensity = Math.min(minutes / maxMinutes, 1);
    const alpha = 0.2 + (intensity * 0.8);
    return `rgba(0, 240, 255, ${alpha})`;
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

    // Add Labels
    if (wIdx === 0 || isMonthChange || isYearChange) {
      // Find the first day in this week that belongs to the new month
      const firstDayOfMonth = week.find(d => d.date.getDate() <= 7);
      if (firstDayOfMonth || wIdx === 0) {
        monthLabels.push({
          offset: currentOffset,
          label: (firstDayOfMonth ? firstDayOfMonth.date : thurs).toLocaleString('default', { month: 'short' })
        });
      }
      
      if (wIdx === 0 || isYearChange) {
        yearLabels.push({
          offset: currentOffset,
          label: currentYear.toString()
        });
      }
    }

    const weekWidth = 12 + marginRight; // 12px width + margin
    const colOffset = currentOffset;
    currentOffset += weekWidth;

    return (
      <div key={wIdx} style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginRight: `${marginRight}px` }}>
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
