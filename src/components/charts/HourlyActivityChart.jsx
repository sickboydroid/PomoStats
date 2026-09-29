import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getHourlyActivity } from '../../utils/dataProcessing';

export default function HourlyActivityChart({ data }) {
  const chartData = getHourlyActivity(data);

  return (
    <div className="card w-full animate-slide-up" style={{ height: '250px' }}>
      <h3 style={{ marginBottom: '0.25rem' }}>Active Hours</h3>
      <p className="text-muted text-sm mb-4">Average minutes focused per hour across all active days.</p>
      <ResponsiveContainer width="100%" height="80%">
        <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
          <XAxis 
            dataKey="name" 
            stroke="var(--text-muted)" 
            tick={{ fill: 'var(--text-muted)', fontSize: 11 }} 
            axisLine={false} 
            tickLine={false} 
            interval="preserveStartEnd"
          />
          <YAxis stroke="var(--text-muted)" tick={{ fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
          <Tooltip 
            contentStyle={{ backgroundColor: 'var(--bg-card-hover)', borderColor: 'var(--border-color)', borderRadius: '8px' }}
            itemStyle={{ color: '#0ea5e9' }} // Neon Blue
            cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
            formatter={(value) => [`${value} mins`, 'Average Focus']}
          />
          <Bar dataKey="avgMinutes" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
