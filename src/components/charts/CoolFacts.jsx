import React from 'react';
import { getCoolFacts } from '../../utils/dataProcessing';
import { Flame, Calendar, Trophy, Clock, Target, CalendarDays } from 'lucide-react';

export default function CoolFacts({ data }) {
  const facts = getCoolFacts(data);
  if (!facts) return null;

  const { mostStudiedDay, longestStreak, bestWeek, avgHoursPerMonth, avgHoursPerYear, totalDaysActive } = facts;

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    const d = new Date(dateStr);
    return d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4 animate-slide-up">
      <div className="card flex items-center gap-4">
        <div style={{ background: 'rgba(239, 68, 68, 0.1)', padding: '1rem', borderRadius: '50%', color: '#ef4444' }}>
          <Flame size={28} />
        </div>
        <div>
          <div className="text-muted text-sm uppercase tracking-wider mb-1">Longest Streak</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{longestStreak} days</div>
        </div>
      </div>

      <div className="card flex items-center gap-4">
        <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '1rem', borderRadius: '50%', color: '#10b981' }}>
          <Trophy size={28} />
        </div>
        <div>
          <div className="text-muted text-sm uppercase tracking-wider mb-1">Most Studied Day</div>
          <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>{formatDate(mostStudiedDay.date)}</div>
          <div className="text-cyan-400 text-sm">{((mostStudiedDay.minutes)/60).toFixed(1)} hrs</div>
        </div>
      </div>

      <div className="card flex items-center gap-4">
        <div style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '1rem', borderRadius: '50%', color: '#3b82f6' }}>
          <Calendar size={28} />
        </div>
        <div>
          <div className="text-muted text-sm uppercase tracking-wider mb-1">Best Week</div>
          <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>{bestWeek.week || 'N/A'}</div>
          <div className="text-cyan-400 text-sm">{((bestWeek.minutes)/60).toFixed(1)} hrs</div>
        </div>
      </div>

      <div className="card flex items-center gap-4">
        <div style={{ background: 'rgba(245, 158, 11, 0.1)', padding: '1rem', borderRadius: '50%', color: '#f59e0b' }}>
          <Clock size={28} />
        </div>
        <div>
          <div className="text-muted text-sm uppercase tracking-wider mb-1">Avg Hrs / Month</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{avgHoursPerMonth}</div>
        </div>
      </div>

      <div className="card flex items-center gap-4">
        <div style={{ background: 'rgba(139, 92, 246, 0.1)', padding: '1rem', borderRadius: '50%', color: '#8b5cf6' }}>
          <Target size={28} />
        </div>
        <div>
          <div className="text-muted text-sm uppercase tracking-wider mb-1">Avg Hrs / Year</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{avgHoursPerYear}</div>
        </div>
      </div>

      <div className="card flex items-center gap-4">
        <div style={{ background: 'rgba(0, 240, 255, 0.1)', padding: '1rem', borderRadius: '50%', color: 'var(--accent-cyan)' }}>
          <CalendarDays size={28} />
        </div>
        <div>
          <div className="text-muted text-sm uppercase tracking-wider mb-1">Active Days</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{totalDaysActive}</div>
        </div>
      </div>
    </div>
  );
}
