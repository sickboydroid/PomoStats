import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getYearlyActivity } from '../../utils/dataProcessing';

export default function YearlyActivityChart({ data }) {
  const chartData = getYearlyActivity(data);

  return (
    <div className="card w-full animate-slide-up" style={{ height: '250px' }}>
      <h3 style={{ marginBottom: '0.25rem' }}>Yearly Activity</h3>
      <p className="text-muted text-sm mb-4">Total hours focused per calendar year.</p>
      <ResponsiveContainer width="100%" height="80%">
        <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
          <XAxis dataKey="name" stroke="var(--text-muted)" tick={{ fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
          <YAxis stroke="var(--text-muted)" tick={{ fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
          <Tooltip 
            contentStyle={{ backgroundColor: 'var(--bg-card-hover)', borderColor: 'var(--border-color)', borderRadius: '8px' }}
            itemStyle={{ color: '#8b5cf6' }} // Neon Purple
            cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
          />
          <Bar dataKey="totalHours" name="Total Hours" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
