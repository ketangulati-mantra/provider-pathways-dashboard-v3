import React from 'react';
import { ShieldCheck, Award, Flame, Coins, Calendar, ArrowLeft } from 'lucide-react';

export default function AmbassadorHeader({ profile, onBack }) {
  const joinedDateFormatted = profile?.joined_date ? new Date(profile.joined_date).toLocaleDateString() : 'Active Member';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      
      {onBack && (
        <button
          onClick={onBack}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            padding: '8px 16px',
            borderRadius: '10px',
            fontSize: '0.85rem',
            fontWeight: 700,
            color: '#475569',
            cursor: 'pointer',
            width: 'fit-content'
          }}
        >
          <ArrowLeft size={16} /> Back to Dashboard
        </button>
      )}

      {/* Main Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #311b92 100%)',
        borderRadius: '24px',
        padding: '36px 36px',
        color: '#ffffff',
        boxShadow: '0 20px 40px -15px rgba(15, 23, 42, 0.4)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '20px',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ background: 'rgba(37, 99, 235, 0.3)', backdropFilter: 'blur(10px)', color: '#93c5fd', padding: '4px 14px', borderRadius: '14px', fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', border: '1px solid rgba(147, 197, 253, 0.3)' }}>
              Level {profile?.level || 1} Ambassador
            </span>
            <span style={{ background: 'rgba(5, 150, 105, 0.3)', backdropFilter: 'blur(10px)', color: '#6ee7b7', padding: '4px 14px', borderRadius: '14px', fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', border: '1px solid rgba(110, 231, 183, 0.3)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <ShieldCheck size={14} /> {profile?.status || 'Active'}
            </span>
          </div>

          <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: 900, letterSpacing: '-0.02em' }}>
            {profile?.college_name || 'University Chapter Ambassador'}
          </h1>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '0.82rem', color: '#cbd5e1' }}>
            <span><Calendar size={14} style={{ verticalAlign: 'middle' }} /> Joined: <strong>{joinedDateFormatted}</strong></span>
            <span>• Rank: <strong style={{ color: '#fef08a' }}>#12 Leaderboard</strong></span>
          </div>
        </div>

        {/* Stats Badges */}
        <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
          <div style={{ background: 'rgba(255, 255, 255, 0.08)', backdropFilter: 'blur(10px)', padding: '14px 20px', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.12)', textAlign: 'center' }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>Streak</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#ffedd5', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Flame size={20} color="#f97316" /> 5 Days
            </div>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.08)', backdropFilter: 'blur(10px)', padding: '14px 20px', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.12)', textAlign: 'center' }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>Credits</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#fef08a' }}>
              🪙 {profile?.credits || 0}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
