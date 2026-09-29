import React from 'react';

export default function DateRangeSelector({ dateRange, setDateRange }) {
  const handlePreset = (type) => {
    if (type === 'all') {
      setDateRange({ type: 'all', start: '', end: '' });
      return;
    }
    
    const end = new Date();
    const start = new Date();
    
    if (type === '30days') {
      start.setDate(start.getDate() - 30);
    } else if (type === '7days') {
      start.setDate(start.getDate() - 7);
    } else if (type === 'thisYear') {
      start.setMonth(0, 1);
    }
    
    setDateRange({
      type,
      start: start.toISOString().split('T')[0],
      end: end.toISOString().split('T')[0],
    });
  };

  const handleCustomDate = (e, field) => {
    setDateRange(prev => ({
      ...prev,
      type: 'custom',
      [field]: e.target.value
    }));
  };

  return (
    <div className="card mb-6 animate-slide-up" style={{ padding: '0.75rem 1rem' }}>
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <span className="text-muted text-sm font-semibold uppercase tracking-wider">Date Range:</span>
          <div className="flex gap-2 flex-wrap">
            <button 
              className={dateRange.type === 'all' ? '' : 'outline'} 
              style={{ padding: '0.35rem 0.75rem', fontSize: '0.85rem' }}
              onClick={() => handlePreset('all')}
            >
              All Time
            </button>
            <button 
              className={dateRange.type === '30days' ? '' : 'outline'} 
              style={{ padding: '0.35rem 0.75rem', fontSize: '0.85rem' }}
              onClick={() => handlePreset('30days')}
            >
              Last 30 Days
            </button>
            <button 
              className={dateRange.type === 'thisYear' ? '' : 'outline'} 
              style={{ padding: '0.35rem 0.75rem', fontSize: '0.85rem' }}
              onClick={() => handlePreset('thisYear')}
            >
              This Year
            </button>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-muted text-sm">Custom:</span>
          <input 
            type="date" 
            value={dateRange.start} 
            onChange={(e) => handleCustomDate(e, 'start')}
            style={{ padding: '0.35rem 0.5rem', width: 'auto', backgroundColor: 'var(--bg-main)', fontSize: '0.85rem' }}
          />
          <span className="text-muted">-</span>
          <input 
            type="date" 
            value={dateRange.end} 
            onChange={(e) => handleCustomDate(e, 'end')}
            style={{ padding: '0.35rem 0.5rem', width: 'auto', backgroundColor: 'var(--bg-main)', fontSize: '0.85rem' }}
          />
        </div>
      </div>
    </div>
  );
}
