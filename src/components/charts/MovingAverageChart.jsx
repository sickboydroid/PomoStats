import React from 'react';
import { ComposedChart, Line, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getMovingAverage } from '../../utils/dataProcessing';

export default function MovingAverageChart({ data }) {
  // Use a 7-day moving average window
  const chartData = getMovingAverage(data, 7);

  return (
    <div className="card w-full animate-slide-up" style={{ height: '400px' }}>
      <h3 style={{ marginBottom: '0.5rem' }}>Daily Activity with 7-Day Moving Average</h3>
      <p className="text-muted text-sm mb-4">Shows actual hours vs. the smoothed trend over time.</p>
      
      <ResponsiveContainer width="100%" height="80%">
        <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="rgba(255,255,255,0.1)" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="rgba(255,255,255,0.1)" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
          
          <XAxis 
            dataKey="date" 
            stroke="var(--text-muted)" 
            tick={{ fill: 'var(--text-muted)', fontSize: 12 }} 
            axisLine={false} 
            tickLine={false} 
            minTickGap={30}
            tickFormatter={(val) => {
              const d = new Date(val);
              return `${d.toLocaleString('default', { month: 'short' })} ${d.getDate()}`;
            }}
          />
          
          <YAxis stroke="var(--text-muted)" tick={{ fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
          
          <Tooltip 
            contentStyle={{ backgroundColor: 'var(--bg-card-hover)', borderColor: 'var(--border-color)', borderRadius: '8px', color: '#fff' }}
            itemStyle={{ color: 'var(--accent-cyan)' }}
          />
          
          {/* Actual Data Area */}
          <Area type="monotone" dataKey="actualHours" name="Actual Hours" fillOpacity={1} fill="url(#colorActual)" stroke="none" />
          
          {/* Moving Average Line */}
          <Line 
            type="monotone" 
            dataKey="avgHours" 
            name="7-Day Avg" 
            stroke="var(--accent-cyan)" 
            strokeWidth={3} 
            dot={false}
            activeDot={{ r: 6, fill: '#fff', stroke: 'var(--accent-cyan)', strokeWidth: 2 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
