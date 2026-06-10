import React, { useState } from 'react';
import ScoreRing from './ScoreRing';
import { LOGO_COLORS } from './constants';

export default function JobCard({ job }) {
  const [open, setOpen] = useState(false);
  const logo = LOGO_COLORS[job.logo_color] || LOGO_COLORS.teal;

  const stop = fn => e => { e.stopPropagation(); fn(); };

  const handleViewOpening = () => {
    const url = job.careers_url && job.careers_url.startsWith('http')
      ? job.careers_url
      : `https://www.google.com/search?q=${encodeURIComponent(job.company + ' ' + job.title + ' job opening 2026')}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handlePrepStory = () => {
    const gaps = (job.skill_gaps || []).join(', ') || 'none noted';
    const text = `Help Mansi Shah prep her Confluence Mobile AI personalization story for the ${job.title} role at ${job.company}. Skill gaps to close: ${gaps}. Please provide: (1) a tailored CAR story version, (2) how to signal Staff-track ownership for this specific role, (3) 2-3 likely interview questions she should prepare for.`;
    navigator.clipboard.writeText(text).then(() => {
      alert('✓ Prompt copied to clipboard — paste it into Claude.ai');
    }).catch(() => {
      prompt('Copy this prompt and paste it into Claude.ai:', text);
    });
  };

  const handleDraftOutreach = () => {
    const text = `Draft a short LinkedIn cold outreach message for Mansi Shah targeting the ${job.title} role at ${job.company}. Lead with her Confluence Mobile AI personalization work that was featured at the Atlassian TEAM'25 keynote (+5% engagement, +2% retention). Warm, confident, under 4 sentences.`;
    navigator.clipboard.writeText(text).then(() => {
      alert('✓ Prompt copied to clipboard — paste it into Claude.ai');
    }).catch(() => {
      prompt('Copy this prompt and paste it into Claude.ai:', text);
    });
  };

  return (
    <div className={`job-card ${open ? 'open' : ''}`} onClick={() => setOpen(o => !o)}>
      <div className="job-top">
        <div className="job-co">
          <div className="logo-circle" style={{ background: logo.bg, color: logo.color }}>
            {job.logo_initials || job.company.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="job-title">{job.title}</div>
            <div className="job-meta">{job.company} · {job.location}</div>
          </div>
        </div>
        <ScoreRing score={job.match_score} />
      </div>

      <div className="badge-row">
        <span className="badge b-match">{job.match_score}% match</span>
        <span className="badge b-level">{job.level}</span>
        <span className="badge b-domain">{job.type || 'Full-time'}</span>
        {(job.domain_tags || []).map(t => (
          <span key={t} className="badge b-domain">{t}</span>
        ))}
      </div>

      {open && (
        <div className="job-body" onClick={e => e.stopPropagation()}>
          <div className="body-section">
            <div className="body-label">Why this fits Mansi</div>
            <div className="body-text">{job.why_great_fit}</div>
          </div>

          {job.skill_gaps?.length > 0 && (
            <div className="body-section">
              <div className="body-label">Gaps to address</div>
              <div className="gap-row">
                {job.skill_gaps.map(g => (
                  <span key={g} className="badge b-gap">{g}</span>
                ))}
              </div>
            </div>
          )}

          <div className="body-section">
            <div className="body-label">Application tip</div>
            <div className="body-text">{job.application_tip}</div>
          </div>

          <div className="actions">
            <button className="btn-primary" onClick={stop(handleViewOpening)}>
              View opening ↗
            </button>
            <button className="btn-secondary" onClick={stop(handlePrepStory)}>
              Prep story for this role
            </button>
            <button className="btn-secondary" onClick={stop(handleDraftOutreach)}>
              Draft outreach
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
