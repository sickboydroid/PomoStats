import React from 'react';
import { getCoolFacts } from '../../utils/dataProcessing';
import { Flame, Calendar, Trophy, Clock, Target, CalendarDays, Hash, Star } from 'lucide-react';

export default function CoolFacts({ data }) {
  const facts = getCoolFacts(data);
  if (!facts) return null;

  const { mostStudiedDay, longestStreak, bestWeek, bestMonth, bestYear, totalPomodoros, avgHoursPerMonth, avgHoursPerYear, totalDaysActive } = facts;

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    const d = new Date(dateStr);
    return d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 animate-slide-up mb-4">
      {/* 1. Longest Streak */}
      <div className="card flex items-center gap-3" style={{ padding: '0.75rem 1rem' }}>
        <div style={{ color: '#ef4444', flexShrink: 0 }}>
          <Flame size={22} />
        </div>
        <div>
          <div className="text-muted text-xs uppercase tracking-wider mb-1">Longest Streak</div>
          <div style={{ fontSize: '1.2rem', fontWeight: 700 }}>{longestStreak} days</div>
        </div>
      </div>

      {/* 2. Active Days */}
      <div className="card flex items-center gap-3" style={{ padding: '0.75rem 1rem' }}>
        <div style={{ color: 'var(--accent-cyan)', flexShrink: 0 }}>
          <CalendarDays size={22} />
        </div>
        <div>
          <div className="text-muted text-xs uppercase tracking-wider mb-1">Active Days</div>
          <div style={{ fontSize: '1.2rem', fontWeight: 700 }}>{totalDaysActive}</div>
        </div>
      </div>

      {/* 3. Total Pomodoros */}
      <div className="card flex items-center gap-3" style={{ padding: '0.75rem 1rem' }}>
        <div style={{ color: '#a8a29e', flexShrink: 0 }}>
          <Hash size={22} />
        </div>
        <div>
          <div className="text-muted text-xs uppercase tracking-wider mb-1">Total Pomodoros</div>
          <div style={{ fontSize: '1.2rem', fontWeight: 700 }}>{totalPomodoros}</div>
        </div>
      </div>

      {/* 4. Avg / Month */}
      <div className="card flex items-center gap-3" style={{ padding: '0.75rem 1rem' }}>
        <div style={{ color: '#f59e0b', flexShrink: 0 }}>
          <Clock size={22} />
        </div>
        <div>
          <div className="text-muted text-xs uppercase tracking-wider mb-1">Avg / Month</div>
          <div style={{ fontSize: '1.2rem', fontWeight: 700 }}>{avgHoursPerMonth} hrs</div>
        </div>
      </div>

      {/* 5. Avg / Year */}
      <div className="card flex items-center gap-3" style={{ padding: '0.75rem 1rem' }}>
        <div style={{ color: '#8b5cf6', flexShrink: 0 }}>
          <Target size={22} />
        </div>
        <div>
          <div className="text-muted text-xs uppercase tracking-wider mb-1">Avg / Year</div>
          <div style={{ fontSize: '1.2rem', fontWeight: 700 }}>{avgHoursPerYear} hrs</div>
        </div>
      </div>

      {/* 6. Best Day */}
      <div className="card flex items-center gap-3" style={{ padding: '0.75rem 1rem' }}>
        <div style={{ color: '#10b981', flexShrink: 0 }}>
          <Trophy size={22} />
        </div>
        <div>
          <div className="text-muted text-xs uppercase tracking-wider mb-1">Best Day</div>
          <div style={{ fontSize: '1.05rem', fontWeight: 700 }}>{formatDate(mostStudiedDay.date)}</div>
          <div className="text-emerald-400 text-xs font-semibold">{((mostStudiedDay.minutes)/60).toFixed(1)} hrs</div>
        </div>
      </div>

      {/* 7. Best Week */}
      <div className="card flex items-center gap-3" style={{ padding: '0.75rem 1rem' }}>
        <div style={{ color: '#3b82f6', flexShrink: 0 }}>
          <Calendar size={22} />
        </div>
        <div>
          <div className="text-muted text-xs uppercase tracking-wider mb-1">Best Week</div>
          <div style={{ fontSize: '1.05rem', fontWeight: 700 }}>{bestWeek.week || 'N/A'}</div>
          <div className="text-blue-400 text-xs font-semibold">{((bestWeek.minutes)/60).toFixed(1)} hrs</div>
        </div>
      </div>

      {/* 8. Best Month */}
      <div className="card flex items-center gap-3" style={{ padding: '0.75rem 1rem' }}>
        <div style={{ color: '#ec4899', flexShrink: 0 }}>
          <Star size={22} />
        </div>
        <div>
          <div className="text-muted text-xs uppercase tracking-wider mb-1">Best Month</div>
          <div style={{ fontSize: '1.05rem', fontWeight: 700 }}>{bestMonth.name || 'N/A'}</div>
          <div className="text-pink-400 text-xs font-semibold">{bestMonth.hours.toFixed(1)} hrs</div>
        </div>
      </div>

      {/* 9. Best Year */}
      <div className="card flex items-center gap-3" style={{ padding: '0.75rem 1rem' }}>
        <div style={{ color: '#8b5cf6', flexShrink: 0 }}>
          <Target size={22} />
        </div>
        <div>
          <div className="text-muted text-xs uppercase tracking-wider mb-1">Best Year</div>
          <div style={{ fontSize: '1.05rem', fontWeight: 700 }}>{bestYear.name || 'N/A'}</div>
          <div className="text-purple-400 text-xs font-semibold">{bestYear.hours.toFixed(1)} hrs</div>
        </div>
      </div>
    </div>
  );
}

