import React, { useState } from 'react';
import { fetchPomofocusData } from '../services/api';
import { DownloadCloud, Play, AlertTriangle, CheckCircle } from 'lucide-react';

export default function FetchView({ onDataFetched }) {
  const [authorization, setAuthorization] = useState('');
  const [cookie, setCookie] = useState('');
  const [isFetching, setIsFetching] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [successCount, setSuccessCount] = useState(0);

  const handleFetch = async (e) => {
    e.preventDefault();
    if (!authorization || !cookie) {
      setError('Authorization and Cookie headers are required.');
      return;
    }

    setIsFetching(true);
    setError(null);
    setProgress(0);
    setSuccessCount(0);

    try {
      const data = await fetchPomofocusData(authorization, cookie, (pageNum) => {
        setProgress(pageNum);
      });
      setSuccessCount(data.length);
      onDataFetched(data);
    } catch (err) {
      const errorDetails = err instanceof Error 
        ? `${err.name}: ${err.message}\n${err.stack || ''}` 
        : typeof err === 'object' ? JSON.stringify(err, null, 2) : String(err);
      setError(errorDetails);
    } finally {
      setIsFetching(false);
    }
  };

  return (
    <div className="card animate-slide-up" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h2 className="flex items-center gap-2">
        <DownloadCloud className="text-cyan-400" size={24} style={{ color: 'var(--accent-cyan)' }} /> 
        Fetch Data from Pomofocus
      </h2>
      <p className="text-muted text-sm mb-4">
        Extract your Authorization token and Cookie from the network tab in your browser's dev tools while logged into Pomofocus.
      </p>

      <form onSubmit={handleFetch} className="flex-col gap-4">
        <div>
          <label className="text-sm font-semibold mb-2 block">Authorization Header</label>
          <input 
            type="text" 
            placeholder="eyJhbGciOiJIUzI1..." 
            value={authorization}
            onChange={(e) => setAuthorization(e.target.value)}
            disabled={isFetching}
          />
        </div>

        <div>
          <label className="text-sm font-semibold mb-2 block">Cookie Header</label>
          <input 
            type="text" 
            placeholder="access_token=eyJhbGciOi..." 
            value={cookie}
            onChange={(e) => setCookie(e.target.value)}
            disabled={isFetching}
          />
        </div>

        {error && (
          <div className="flex gap-2 mb-4" style={{ color: '#ef4444', background: 'rgba(239, 68, 68, 0.1)', padding: '0.75rem', borderRadius: '8px', alignItems: 'flex-start' }}>
            <AlertTriangle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
            <span className="text-sm" style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all', fontFamily: 'monospace' }}>{error}</span>
          </div>
        )}

        {isFetching && (
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-cyan-400" style={{ color: 'var(--accent-cyan)' }}>Fetching...</span>
              <span>Page: {progress}</span>
            </div>
            <div style={{ width: '100%', height: '4px', background: 'var(--border-color)', borderRadius: '2px', overflow: 'hidden' }}>
              <div 
                style={{ 
                  height: '100%', 
                  width: '50%', // Indeterminate-like look
                  background: 'var(--accent-cyan)',
                  animation: 'slideUp 1s infinite alternate' 
                }} 
              />
            </div>
          </div>
        )}

        {successCount > 0 && !isFetching && !error && (
          <div className="flex items-center gap-2 mb-4" style={{ color: '#10b981', background: 'rgba(16, 185, 129, 0.1)', padding: '0.75rem', borderRadius: '8px' }}>
            <CheckCircle size={18} />
            <span className="text-sm">Successfully fetched {successCount} records!</span>
          </div>
        )}

        <button type="submit" disabled={isFetching} className="w-full mt-4">
          {isFetching ? 'Fetching...' : (
            <>
              <Play size={18} /> Start Fetching
            </>
          )}
        </button>
      </form>
    </div>
  );
}
