import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getWeeklyActivity } from '../../utils/dataProcessing';

export default function WeeklyActivityChart({ data }) {
  const chartData = getWeeklyActivity(data);

  return (
    <div className="card w-full animate-slide-up" style={{ height: '250px' }}>
      <h3 style={{ marginBottom: '0.25rem' }}>Weekly Activity</h3>
      <p className="text-muted text-sm mb-4">Total hours focused per explicit calendar week.</p>
      <ResponsiveContainer width="100%" height="75%">
        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorWeekly" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
          <XAxis 
            dataKey="name" 
            stroke="var(--text-muted)" 
            tick={{ fill: 'var(--text-muted)', fontSize: 11 }} 
            axisLine={false} 
            tickLine={false}
            minTickGap={20}
          />
          <YAxis stroke="var(--text-muted)" tick={{ fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
          <Tooltip 
            contentStyle={{ backgroundColor: 'var(--bg-card-hover)', borderColor: 'var(--border-color)', borderRadius: '8px' }}
            itemStyle={{ color: '#3b82f6' }} // Neon Blue
          />
          <Area type="step" dataKey="totalHours" name="Total Hours" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorWeekly)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
