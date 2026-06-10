import React, { useState, useCallback } from 'react';
import './App.css';
import JobCard from './JobCard';
import { DOMAINS, DEFAULT_ACTIVE_DOMAINS } from './constants';
import { fetchJobs } from './api';

export default function App() {
  const [tier, setTier] = useState('big');
  const [level, setLevel] = useState('both');
  const [activeDomains, setActiveDomains] = useState(new Set(DEFAULT_ACTIVE_DOMAINS));
  const [keyword, setKeyword] = useState('');
  const [jobs, setJobs] = useState([]);
  const [status, setStatus] = useState('idle'); // idle | loading | done | error
  const [errMsg, setErrMsg] = useState('');

  const hasApiKey = !!process.env.REACT_APP_ANTHROPIC_API_KEY;

  const toggleDomain = d => setActiveDomains(prev => {
    const next = new Set(prev);
    next.has(d) ? next.delete(d) : next.add(d);
    return next;
  });

  const runSearch = useCallback(async () => {
    setStatus('loading');
    setJobs([]);
    setErrMsg('');
    try {
      const results = await fetchJobs({ tier, level, activeDomains, keyword });
      setJobs(results.sort((a, b) => b.match_score - a.match_score));
      setStatus('done');
    } catch (e) {
      setErrMsg(e.message || 'Something went wrong.');
      setStatus('error');
    }
  }, [tier, level, activeDomains, keyword]);

  const avg = jobs.length
    ? Math.round(jobs.reduce((s, j) => s + j.match_score, 0) / jobs.length)
    : 0;
  const top = jobs.filter(j => j.match_score >= 80).length;

  return (
    <div className="app">
      {/* Header */}
      <div className="header">
        <div className="profile-pill">
          <span className="profile-dot" />
          Mansi Shah · Senior iOS Engineer
        </div>
        <h1 className="page-title">Job finder</h1>
        <p className="page-sub">
          Openings searched and scored against Mansi's profile — AI-native iOS, FAANG+ and growth-stage.
        </p>
      </div>

      {/* API key warning */}
      {!hasApiKey && (
        <div className="api-banner">
          <strong>⚠ API key not configured</strong>
          Create a <code>.env</code> file in the project root with:<br />
          <code>REACT_APP_ANTHROPIC_API_KEY=sk-ant-...</code><br />
          Then restart the dev server. The app will not make API calls without it.
        </div>
      )}

      {/* Filters */}
      <div className="filters">
        <div className="filter-row">
          <div className="filter-group">
            <label className="filter-label">Company tier</label>
            <select value={tier} onChange={e => setTier(e.target.value)}>
              <option value="all">All tiers</option>
              <option value="big">Big tech (FAANG+)</option>
              <option value="mid">Growth / mid-size</option>
              <option value="startup">Startup / AI-native</option>
            </select>
          </div>
          <div className="filter-group">
            <label className="filter-label">Role level</label>
            <select value={level} onChange={e => setLevel(e.target.value)}>
              <option value="both">Senior + Staff</option>
              <option value="senior">Senior only</option>
              <option value="staff">Staff only</option>
            </select>
          </div>
        </div>
        <div className="filter-group">
          <span className="filter-label">Domain focus</span>
          <div className="tag-row">
            {DOMAINS.map(d => (
              <span
                key={d}
                className={`tag ${activeDomains.has(d) ? 'tag-on' : 'tag-off'}`}
                onClick={() => toggleDomain(d)}
              >
                {d}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Search bar */}
      <div className="search-bar">
        <input
          className="kw-input"
          value={keyword}
          onChange={e => setKeyword(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && status !== 'loading' && runSearch()}
          placeholder='Optional keyword — e.g. "on-device AI" or "LLM"'
        />
        <button
          className="btn-find"
          onClick={runSearch}
          disabled={status === 'loading' || !hasApiKey}
        >
          {status === 'loading' ? 'Searching…' : 'Find jobs'}
        </button>
      </div>

      {/* Results */}
      {status === 'idle' && (
        <div className="center-state">
          <p>Hit "Find jobs" to surface openings matched to Mansi's profile.</p>
        </div>
      )}

      {status === 'loading' && (
        <div className="center-state">
          <div className="spinner" />
          <p>Searching for openings matched to Mansi's profile…<br />
          <span style={{ fontSize: 12, color: '#D1D5DB' }}>This takes 10–20 seconds</span></p>
        </div>
      )}

      {status === 'error' && (
        <div className="center-state">
          <p className="error-msg">{errMsg}</p>
          <button className="btn-secondary" onClick={runSearch}>Try again</button>
        </div>
      )}

      {status === 'done' && jobs.length > 0 && (
        <>
          <div className="stats-row">
            <div className="stat-card">
              <div className="stat-num">{jobs.length}</div>
              <div className="stat-lbl">openings found</div>
            </div>
            <div className="stat-card">
              <div className="stat-num">{top}</div>
              <div className="stat-lbl">strong matches (80+)</div>
            </div>
            <div className="stat-card">
              <div className="stat-num">{avg}</div>
              <div className="stat-lbl">avg match score</div>
            </div>
          </div>
          <div className="job-list">
            {jobs.map(j => <JobCard key={j.id} job={j} />)}
          </div>
        </>
      )}

      {status === 'done' && jobs.length === 0 && (
        <div className="center-state">
          <p>No matches found — try adjusting your filters.</p>
        </div>
      )}

      <div className="footer">Peak Your Potential · Built for Mansi Shah</div>
    </div>
  );
}
