import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getMonthlyActivity } from '../../utils/dataProcessing';

export default function MonthlyActivityChart({ data }) {
  const chartData = getMonthlyActivity(data);

  return (
    <div className="card w-full animate-slide-up" style={{ height: '250px' }}>
      <h3 style={{ marginBottom: '0.25rem' }}>Monthly Trends</h3>
      <p className="text-muted text-sm mb-4">Total hours focused per month over time.</p>
      <ResponsiveContainer width="100%" height="80%">
        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorMonthly" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ec4899" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#ec4899" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
          <XAxis dataKey="name" stroke="var(--text-muted)" tick={{ fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
          <YAxis stroke="var(--text-muted)" tick={{ fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
          <Tooltip 
            contentStyle={{ backgroundColor: 'var(--bg-card-hover)', borderColor: 'var(--border-color)', borderRadius: '8px' }}
            itemStyle={{ color: '#ec4899' }} // Neon Pink
          />
          <Area type="monotone" dataKey="totalHours" name="Total Hours" stroke="#ec4899" fillOpacity={1} fill="url(#colorMonthly)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
