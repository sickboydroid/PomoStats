// Utilities for processing raw Pomofocus data for charts

/**
 * Calculates average pomodoro minutes per weekday.
 */
export function getWeekdayAverages(data) {
  if (!data || data.length === 0) return [];
  
  // Array to hold sum of minutes and count of entries for each weekday (0=Sun, 6=Sat)
  const days = [
    { name: 'Sun', minutes: 0, count: 0 },
    { name: 'Mon', minutes: 0, count: 0 },
    { name: 'Tue', minutes: 0, count: 0 },
    { name: 'Wed', minutes: 0, count: 0 },
    { name: 'Thu', minutes: 0, count: 0 },
    { name: 'Fri', minutes: 0, count: 0 },
    { name: 'Sat', minutes: 0, count: 0 },
  ];

  data.forEach(item => {
    // dateStr example: "22-Sep-2026" or using created date
    const date = new Date(item.created);
    const dayIndex = date.getDay();
    if (!isNaN(dayIndex)) {
      days[dayIndex].minutes += item.minutes || 0;
      days[dayIndex].count += 1;
    }
  });

  // Calculate averages
  return days.map(d => ({
    name: d.name,
    avgMinutes: d.count > 0 ? parseFloat((d.minutes / d.count).toFixed(2)) : 0,
    avgHours: d.count > 0 ? parseFloat(((d.minutes / 60) / d.count).toFixed(2)) : 0
  }));
}

/**
 * Groups total minutes by month for trend analysis.
 */
export function getMonthlyActivity(data) {
  if (!data || data.length === 0) return [];

  const monthlyTotals = {};

  data.forEach(item => {
    const date = new Date(item.created);
    if (!isNaN(date.getTime())) {
      // Format as "YYYY-MM"
      const monthStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      if (!monthlyTotals[monthStr]) {
        monthlyTotals[monthStr] = 0;
      }
      monthlyTotals[monthStr] += item.minutes || 0;
    }
  });

  // Sort chronologically and format
  return Object.keys(monthlyTotals).sort().map(monthKey => {
    const [year, month] = monthKey.split('-');
    const date = new Date(year, month - 1);
    const monthName = date.toLocaleString('default', { month: 'short', year: '2-digit' });
    return {
      monthStr: monthKey,
      name: monthName,
      totalHours: parseFloat((monthlyTotals[monthKey] / 60).toFixed(2))
    };
  });
}

/**
 * Prepares data for a GitHub style calendar heatmap.
 * Groups minutes by YYYY-MM-DD.
 */
export function getDailyActivityMap(data) {
  if (!data || data.length === 0) return {};

  const dailyMap = {};

  data.forEach(item => {
    const date = new Date(item.created);
    if (!isNaN(date.getTime())) {
      const dateKey = date.toISOString().split('T')[0];
      if (!dailyMap[dateKey]) {
        dailyMap[dateKey] = 0;
      }
      dailyMap[dateKey] += item.minutes || 0;
    }
  });

  return dailyMap;
}
