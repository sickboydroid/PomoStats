// Utilities for processing raw Pomofocus data for charts

export function getWeekdayAverages(data) {
  if (!data || data.length === 0) return [];
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
    const date = new Date(item.created);
    const dayIndex = date.getDay();
    if (!isNaN(dayIndex)) {
      days[dayIndex].minutes += item.minutes || 0;
      days[dayIndex].count += 1;
    }
  });
  return days.map(d => ({
    name: d.name,
    avgMinutes: d.count > 0 ? parseFloat((d.minutes / d.count).toFixed(2)) : 0,
    avgHours: d.count > 0 ? parseFloat(((d.minutes / 60) / d.count).toFixed(2)) : 0
  }));
}

export function getMonthlyActivity(data) {
  if (!data || data.length === 0) return [];
  const monthlyTotals = {};
  data.forEach(item => {
    const date = new Date(item.created);
    if (!isNaN(date.getTime())) {
      const monthStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      if (!monthlyTotals[monthStr]) monthlyTotals[monthStr] = 0;
      monthlyTotals[monthStr] += item.minutes || 0;
    }
  });
  return Object.keys(monthlyTotals).sort().map(monthKey => {
    const [year, month] = monthKey.split('-');
    const date = new Date(year, month - 1);
    return {
      monthStr: monthKey,
      name: date.toLocaleString('default', { month: 'short', year: 'numeric' }),
      totalHours: parseFloat((monthlyTotals[monthKey] / 60).toFixed(2))
    };
  });
}

export function getYearlyActivity(data) {
  if (!data || data.length === 0) return [];
  const yearlyTotals = {};
  data.forEach(item => {
    const date = new Date(item.created);
    if (!isNaN(date.getTime())) {
      const yearStr = `${date.getFullYear()}`;
      if (!yearlyTotals[yearStr]) yearlyTotals[yearStr] = 0;
      yearlyTotals[yearStr] += item.minutes || 0;
    }
  });
  return Object.keys(yearlyTotals).sort().map(yearStr => ({
    name: yearStr,
    totalHours: parseFloat((yearlyTotals[yearStr] / 60).toFixed(2))
  }));
}

export function getDailyActivityMap(data) {
  if (!data || data.length === 0) return {};
  const dailyMap = {};
  data.forEach(item => {
    const date = new Date(item.created);
    if (!isNaN(date.getTime())) {
      const dateKey = date.toISOString().split('T')[0];
      if (!dailyMap[dateKey]) dailyMap[dateKey] = 0;
      dailyMap[dateKey] += item.minutes || 0;
    }
  });
  return dailyMap;
}

export function getCoolFacts(data) {
  if (!data || data.length === 0) return null;
  const dailyMap = getDailyActivityMap(data);
  const dates = Object.keys(dailyMap).sort();
  
  // Most studied day
  let maxDay = { date: null, minutes: 0 };
  for (const [date, minutes] of Object.entries(dailyMap)) {
    if (minutes > maxDay.minutes) maxDay = { date, minutes };
  }

  // Longest streak
  let longestStreak = 0;
  let currentStreak = 0;
  let lastDateObj = null;

  dates.forEach(dateStr => {
    const d = new Date(dateStr);
    if (!lastDateObj) {
      currentStreak = 1;
    } else {
      const diffTime = Math.abs(d - lastDateObj);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays === 1) {
        currentStreak++;
      } else if (diffDays > 1) {
        currentStreak = 1;
      }
    }
    if (currentStreak > longestStreak) longestStreak = currentStreak;
    lastDateObj = d;
  });

  // Best week (simple approximation: group by week year-week)
  const weeklyTotals = {};
  data.forEach(item => {
    const d = new Date(item.created);
    if (!isNaN(d.getTime())) {
      // Get ISO week number
      const dCopy = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
      const dayNum = dCopy.getUTCDay() || 7;
      dCopy.setUTCDate(dCopy.getUTCDate() + 4 - dayNum);
      const yearStart = new Date(Date.UTC(dCopy.getUTCFullYear(),0,1));
      const weekNo = Math.ceil((((dCopy - yearStart) / 86400000) + 1)/7);
      const weekStr = `${dCopy.getUTCFullYear()}-W${String(weekNo).padStart(2, '0')}`;
      if (!weeklyTotals[weekStr]) weeklyTotals[weekStr] = 0;
      weeklyTotals[weekStr] += item.minutes || 0;
    }
  });

  let bestWeek = { week: null, minutes: 0 };
  for (const [week, minutes] of Object.entries(weeklyTotals)) {
    if (minutes > bestWeek.minutes) bestWeek = { week, minutes };
  }

  // Yearly/Monthly averages
  const totalMinutes = data.reduce((acc, curr) => acc + (curr.minutes || 0), 0);
  const firstDate = new Date(dates[0]);
  const lastDate = new Date(dates[dates.length - 1]);
  const totalDays = Math.max(1, Math.ceil((lastDate - firstDate) / (1000 * 60 * 60 * 24)));
  
  // Most Productive Month
  const monthlyTotals = getMonthlyActivity(data);
  let bestMonth = { name: null, hours: 0 };
  monthlyTotals.forEach(m => {
    if (m.totalHours > bestMonth.hours) bestMonth = { name: m.name, hours: m.totalHours };
  });

  // Most Productive Year
  const yearlyTotals = getYearlyActivity(data);
  let bestYear = { name: null, hours: 0 };
  yearlyTotals.forEach(y => {
    if (y.totalHours > bestYear.hours) bestYear = { name: y.name, hours: y.totalHours };
  });

  return {
    mostStudiedDay: maxDay,
    longestStreak,
    bestWeek,
    bestMonth,
    bestYear,
    totalPomodoros: data.length,
    avgHoursPerMonth: ((totalMinutes / 60) / Math.max(1, totalDays / 30)).toFixed(1),
    avgHoursPerYear: ((totalMinutes / 60) / Math.max(1, totalDays / 365)).toFixed(1),
    totalDaysActive: dates.length,
  };
}

export function getMovingAverage(data, windowDays = 7) {
  if (!data || data.length === 0) return [];
  const dailyMap = getDailyActivityMap(data);
  const dates = Object.keys(dailyMap).sort();
  
  if (dates.length === 0) return [];

  // Fill in missing dates to have a continuous timeline
  const firstDate = new Date(dates[0]);
  const lastDate = new Date(dates[dates.length - 1]);
  const continuousMap = {};
  
  for (let d = new Date(firstDate); d <= lastDate; d.setDate(d.getDate() + 1)) {
    const key = d.toISOString().split('T')[0];
    continuousMap[key] = dailyMap[key] || 0;
  }

  const continuousDates = Object.keys(continuousMap).sort();
  const result = [];

  for (let i = 0; i < continuousDates.length; i++) {
    let sumMinutes = 0;
    let count = 0;
    // Calculate trailing window average
    for (let j = Math.max(0, i - windowDays + 1); j <= i; j++) {
      sumMinutes += continuousMap[continuousDates[j]];
      count++;
    }
    const avgMinutes = sumMinutes / count;
    
    // Only push if the date actually has activity, or every N days to keep chart clean
    if (dailyMap[continuousDates[i]] !== undefined) {
      result.push({
        date: continuousDates[i],
        avgHours: parseFloat((avgMinutes / 60).toFixed(2)),
        actualHours: parseFloat((continuousMap[continuousDates[i]] / 60).toFixed(2))
      });
    }
  }

  return result;
}
