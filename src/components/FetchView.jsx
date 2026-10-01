import React, { useState, useEffect } from 'react';
import { fetchPomofocusData } from '../services/api';
import { DownloadCloud, Play, AlertTriangle, CheckCircle, Clock, X } from 'lucide-react';

export default function FetchView({ onDataFetched, onClose }) {
  const [authorization, setAuthorization] = useState('');
  const [cookie, setCookie] = useState('');
  const [lastUsed, setLastUsed] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [successCount, setSuccessCount] = useState(0);

  useEffect(() => {
    const savedAuth = localStorage.getItem('pomostats_auth');
    const savedCookie = localStorage.getItem('pomostats_cookie');
    const savedLastUsed = localStorage.getItem('pomostats_lastUsed');
    
    if (savedAuth) setAuthorization(savedAuth);
    if (savedCookie) setCookie(savedCookie);
    if (savedLastUsed) setLastUsed(savedLastUsed);
  }, []);

  const handleFetch = async (e) => {
    e.preventDefault();
    if (!authorization || !cookie) {
      setError('Authorization and Cookie headers are required.');
      return;
    }

    // Save credentials
    const now = new Date().toLocaleString();
    localStorage.setItem('pomostats_auth', authorization);
    localStorage.setItem('pomostats_cookie', cookie);
    localStorage.setItem('pomostats_lastUsed', now);
    setLastUsed(now);

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
      // Auto close modal after brief pause on success
      setTimeout(() => {
        if (onClose) onClose();
      }, 1200);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      
      if (errorMessage === 'Failed to fetch' || errorMessage.includes('/corsdemo') || errorMessage.includes('403')) {
        setError(
          <div>
            <div className="mb-2 font-semibold">Proxy Access Required</div>
            <p className="text-sm mb-3">
              Because this app is hosted on GitHub Pages (a static host), it requires a secure proxy to fetch data directly from Pomofocus without being blocked by your browser.
            </p>
            <p className="text-sm mb-3">
              Please click the button below to visit the proxy server, click <strong>"Request temporary access"</strong>, and then come back here to fetch your data.
            </p>
            <a 
              href="https://cors-anywhere.herokuapp.com/corsdemo" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2"
            >
              Unlock Proxy Access
            </a>
          </div>
        );
      } else {
        const errorDetails = err instanceof Error 
          ? `${err.name}: ${err.message}` 
          : typeof err === 'object' ? JSON.stringify(err, null, 2) : String(err);
        setError(<div className="whitespace-pre-wrap">{errorDetails}</div>);
      }
    } finally {
      setIsFetching(false);
    }
  };

  return (
    <div>
      {onClose && (
        <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
          <X size={20} />
        </button>
      )}

      <h2 className="flex items-center gap-2 mb-2" style={{ fontSize: '1.25rem' }}>
        <DownloadCloud style={{ color: 'var(--accent-cyan)' }} size={22} /> 
        Fetch Data from Pomofocus
      </h2>
      <p className="text-muted text-sm mb-4">
        Extract your Authorization token and Cookie from the network tab in your browser's dev tools while logged into Pomofocus.
      </p>

      {lastUsed && (
        <div className="flex items-center gap-2 mb-4 text-xs" style={{ color: 'var(--accent-cyan)', background: 'var(--accent-cyan-dim)', padding: '0.4rem 0.75rem', borderRadius: '6px' }}>
          <Clock size={14} />
          <span>Credentials last used: {lastUsed}</span>
        </div>
      )}

      <form onSubmit={handleFetch} className="flex-col gap-3">
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-muted mb-1 block">Authorization Header</label>
          <input 
            type="text" 
            placeholder="eyJhbGciOiJIUzI1..." 
            value={authorization}
            onChange={(e) => setAuthorization(e.target.value)}
            disabled={isFetching}
            style={{ fontSize: '0.875rem' }}
          />
        </div>

        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-muted mb-1 block">Cookie Header</label>
          <input 
            type="text" 
            placeholder="access_token=eyJhbGciOi..." 
            value={cookie}
            onChange={(e) => setCookie(e.target.value)}
            disabled={isFetching}
            style={{ fontSize: '0.875rem' }}
          />
        </div>

        {error && (
          <div className="flex gap-2 mb-3" style={{ color: '#ef4444', background: 'rgba(239, 68, 68, 0.1)', padding: '0.75rem', borderRadius: '8px', alignItems: 'flex-start' }}>
            <AlertTriangle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
            <span className="text-xs" style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all', fontFamily: 'monospace' }}>{error}</span>
          </div>
        )}

        {isFetching && (
          <div className="mb-3">
            <div className="flex justify-between text-xs mb-1">
              <span style={{ color: 'var(--accent-cyan)' }}>Fetching...</span>
              <span>Pages Fetched: {progress}</span>
            </div>
            <div style={{ width: '100%', height: '4px', background: 'var(--border-color)', borderRadius: '2px', overflow: 'hidden' }}>
              <div className="indeterminate-bar" />
            </div>
          </div>
        )}

        {successCount > 0 && !isFetching && !error && (
          <div className="flex items-center gap-2 mb-3" style={{ color: '#10b981', background: 'rgba(16, 185, 129, 0.1)', padding: '0.75rem', borderRadius: '8px' }}>
            <CheckCircle size={18} />
            <span className="text-sm">Successfully fetched {successCount} records!</span>
          </div>
        )}

        <button type="submit" disabled={isFetching} className="w-full mt-2" style={{ padding: '0.6em' }}>
          {isFetching ? 'Fetching...' : (
            <>
              <Play size={16} /> Start Fetching
            </>
          )}
        </button>
      </form>
    </div>
  );
}

