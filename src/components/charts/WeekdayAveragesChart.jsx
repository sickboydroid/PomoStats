import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getWeekdayAverages } from '../../utils/dataProcessing';

export default function WeekdayAveragesChart({ data }) {
  const chartData = getWeekdayAverages(data);

  return (
    <div className="card w-full animate-slide-up" style={{ height: '350px' }}>
      <h3 style={{ marginBottom: '1.5rem' }}>Average Hours per Weekday</h3>
      <ResponsiveContainer width="100%" height="85%">
        <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
          <XAxis dataKey="name" stroke="var(--text-muted)" tick={{ fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
          <YAxis stroke="var(--text-muted)" tick={{ fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
          <Tooltip 
            contentStyle={{ backgroundColor: 'var(--bg-card-hover)', borderColor: 'var(--border-color)', borderRadius: '8px' }}
            itemStyle={{ color: 'var(--accent-cyan)' }}
          />
          <Bar dataKey="avgHours" fill="var(--accent-cyan)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
