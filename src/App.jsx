import React, { useState, useEffect } from 'react';
import FetchView from './components/FetchView';
import DashboardView from './components/DashboardView';
import { Activity, DownloadCloud } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [data, setData] = useState([]);

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

  const handleDataFetched = (fetchedData) => {
    // Merge new data with old data, avoiding duplicates based on _id
    const mergedData = [...data];
    fetchedData.forEach(item => {
      if (!mergedData.find(d => d._id === item._id)) {
        mergedData.push(item);
      }
    });
    setData(mergedData);
    setActiveTab('dashboard');
  };

  const handleDataImport = (importedData) => {
    setData(importedData);
  };

  return (
    <div className="container">
      {/* Header */}
      <header className="flex justify-between items-center mb-4 pb-4" style={{ borderBottom: '1px solid var(--border-color)' }}>
        <div className="flex items-center gap-2">
          <Activity size={32} style={{ color: 'var(--accent-cyan)' }} />
          <h1 style={{ margin: 0 }}>Pomofocus Visualizer</h1>
        </div>
        
        {/* Navigation Tabs */}
        <div className="flex gap-2">
          <button 
            className={activeTab === 'dashboard' ? '' : 'outline'}
            onClick={() => setActiveTab('dashboard')}
          >
            <Activity size={18} /> Dashboard
          </button>
          <button 
            className={activeTab === 'fetch' ? '' : 'outline'}
            onClick={() => setActiveTab('fetch')}
          >
            <DownloadCloud size={18} /> Fetch Data
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main>
        {activeTab === 'dashboard' ? (
          <DashboardView data={data} onImport={handleDataImport} />
        ) : (
          <FetchView onDataFetched={handleDataFetched} />
        )}
      </main>
    </div>
  );
}

export default App;
