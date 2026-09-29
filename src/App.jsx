import React, { useState, useEffect, useMemo } from 'react';
import FetchView from './components/FetchView';
import DashboardView from './components/DashboardView';
import DateRangeSelector from './components/DateRangeSelector';
import { DownloadCloud, Upload, FileJson, FileSpreadsheet } from 'lucide-react';
import { exportToJson, exportToCsv } from './utils/exportUtils';

function App() {
  const [data, setData] = useState([]);
  const [showFetchModal, setShowFetchModal] = useState(false);
  const [dateRange, setDateRange] = useState(() => {
    const saved = localStorage.getItem('pomostats_dateRange');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (err) {}
    }
    return { type: 'all', start: '', end: '' };
  });

  // Load from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('pomofocusData');
    if (saved) {
      try {
        setData(JSON.parse(saved));
      } catch (err) {}
    }
  }, []);

  // Save to local storage when data changes
  useEffect(() => {
    if (data && data.length > 0) {
      localStorage.setItem('pomofocusData', JSON.stringify(data));
    }
  }, [data]);

  // Save date range to local storage
  useEffect(() => {
    localStorage.setItem('pomostats_dateRange', JSON.stringify(dateRange));
  }, [dateRange]);

  const filteredData = useMemo(() => {
    if (dateRange.type === 'all' || !dateRange.start || !dateRange.end) {
      return data;
    }
    const start = new Date(dateRange.start);
    const end = new Date(dateRange.end);
    end.setHours(23, 59, 59, 999);
    
    return data.filter(item => {
      const date = new Date(item.created);
      return date >= start && date <= end;
    });
  }, [data, dateRange]);

  const handleDataFetched = (fetchedData) => {
    const mergedData = [...data];
    fetchedData.forEach(item => {
      if (!mergedData.find(d => d._id === item._id)) {
        mergedData.push(item);
      }
    });
    setData(mergedData);
  };

  const handleDataImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const importedData = JSON.parse(event.target.result);
        if (Array.isArray(importedData)) {
          setData(importedData);
        } else {
          alert('Invalid JSON format. Expected an array of records.');
        }
      } catch (err) {
        alert('Failed to parse JSON file.');
      }
    };
    reader.readAsText(file);
  };

  const triggerImportPicker = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = handleDataImport;
    input.click();
  };

  return (
    <div className="container">
      {/* Header */}
      <header className="flex justify-between items-center mb-6 pb-4" style={{ borderBottom: '1px solid var(--border-color)' }}>
        <div className="flex items-center gap-2" style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.5px' }}>
          <span>🍅</span> PomoStats
        </div>
        
        {/* Action Controls Toolbar */}
        <div className="flex items-center gap-2 flex-wrap justify-end">
          <button onClick={() => setShowFetchModal(true)}>
            <DownloadCloud size={16} /> Fetch Data
          </button>
          
          <label className="button outline" style={{ cursor: 'pointer' }}>
            <Upload size={16} /> Import Data
            <input type="file" accept=".json" style={{ display: 'none' }} onChange={handleDataImport} />
          </label>

          <button className="outline" onClick={() => exportToJson(data)} disabled={!data || data.length === 0}>
            <FileJson size={16} /> Export JSON
          </button>

          <button className="outline" onClick={() => exportToCsv(data)} disabled={!data || data.length === 0}>
            <FileSpreadsheet size={16} /> Export CSV
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main>
        {data && data.length > 0 && (
          <DateRangeSelector dateRange={dateRange} setDateRange={setDateRange} />
        )}
        <DashboardView 
          data={filteredData} 
          onImportClick={triggerImportPicker} 
          onFetchClick={() => setShowFetchModal(true)} 
        />
      </main>

      {/* Fetch Data Dialog / Modal */}
      {showFetchModal && (
        <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) setShowFetchModal(false); }}>
          <div className="modal-content">
            <FetchView 
              onDataFetched={handleDataFetched} 
              onClose={() => setShowFetchModal(false)} 
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

