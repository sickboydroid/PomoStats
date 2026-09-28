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
    <div className="flex-col gap-4 animate-slide-up mb-4">
      
      {/* Group: Streaks and Totals */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card flex items-center gap-4">
          <div style={{ background: 'rgba(239, 68, 68, 0.1)', padding: '1rem', borderRadius: '50%', color: '#ef4444' }}>
            <Flame size={24} />
          </div>
          <div>
            <div className="text-muted text-sm uppercase tracking-wider mb-1">Longest Streak</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>{longestStreak} days</div>
          </div>
        </div>

        <div className="card flex items-center gap-4">
          <div style={{ background: 'rgba(0, 240, 255, 0.1)', padding: '1rem', borderRadius: '50%', color: 'var(--accent-cyan)' }}>
            <CalendarDays size={24} />
          </div>
          <div>
            <div className="text-muted text-sm uppercase tracking-wider mb-1">Active Days</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>{totalDaysActive}</div>
          </div>
        </div>

        <div className="card flex items-center gap-4">
          <div style={{ background: 'rgba(168, 162, 158, 0.1)', padding: '1rem', borderRadius: '50%', color: '#a8a29e' }}>
            <Hash size={24} />
          </div>
          <div>
            <div className="text-muted text-sm uppercase tracking-wider mb-1">Total Pomodoros</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>{totalPomodoros}</div>
          </div>
        </div>
      </div>

      {/* Group: Averages */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div className="card flex items-center gap-4">
          <div style={{ background: 'rgba(245, 158, 11, 0.1)', padding: '1rem', borderRadius: '50%', color: '#f59e0b' }}>
            <Clock size={24} />
          </div>
          <div>
            <div className="text-muted text-sm uppercase tracking-wider mb-1">Avg / Month</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>{avgHoursPerMonth} hrs</div>
          </div>
        </div>

        <div className="card flex items-center gap-4">
          <div style={{ background: 'rgba(139, 92, 246, 0.1)', padding: '1rem', borderRadius: '50%', color: '#8b5cf6' }}>
            <Target size={24} />
          </div>
          <div>
            <div className="text-muted text-sm uppercase tracking-wider mb-1">Avg / Year</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>{avgHoursPerYear} hrs</div>
          </div>
        </div>
      </div>

      {/* Group: Personal Bests */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
        <div className="card flex items-center gap-4">
          <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '1rem', borderRadius: '50%', color: '#10b981' }}>
            <Trophy size={24} />
          </div>
          <div>
            <div className="text-muted text-sm uppercase tracking-wider mb-1">Best Day</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>{formatDate(mostStudiedDay.date)}</div>
            <div className="text-emerald-400 text-sm">{((mostStudiedDay.minutes)/60).toFixed(1)} hrs</div>
          </div>
        </div>

        <div className="card flex items-center gap-4">
          <div style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '1rem', borderRadius: '50%', color: '#3b82f6' }}>
            <Calendar size={24} />
          </div>
          <div>
            <div className="text-muted text-sm uppercase tracking-wider mb-1">Best Week</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>{bestWeek.week || 'N/A'}</div>
            <div className="text-blue-400 text-sm">{((bestWeek.minutes)/60).toFixed(1)} hrs</div>
          </div>
        </div>

        <div className="card flex items-center gap-4">
          <div style={{ background: 'rgba(236, 72, 153, 0.1)', padding: '1rem', borderRadius: '50%', color: '#ec4899' }}>
            <Star size={24} />
          </div>
          <div>
            <div className="text-muted text-sm uppercase tracking-wider mb-1">Best Month</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>{bestMonth.name || 'N/A'}</div>
            <div className="text-pink-400 text-sm">{bestMonth.hours.toFixed(1)} hrs</div>
          </div>
        </div>

        <div className="card flex items-center gap-4">
          <div style={{ background: 'rgba(139, 92, 246, 0.1)', padding: '1rem', borderRadius: '50%', color: '#8b5cf6' }}>
            <Target size={24} />
          </div>
          <div>
            <div className="text-muted text-sm uppercase tracking-wider mb-1">Best Year</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>{bestYear.name || 'N/A'}</div>
            <div className="text-purple-400 text-sm">{bestYear.hours.toFixed(1)} hrs</div>
          </div>
        </div>
      </div>
      
    </div>
  );
}
