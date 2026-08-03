import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { User, X, Plus, Trash2 } from 'lucide-react';

export default function ManageReviewersModal({ isOpen, onClose, reviewerOptions = [], onAddReviewer, onDeleteReviewer }) {
  const [newReviewerName, setNewReviewerName] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = newReviewerName.trim();
    if (trimmed) {
      if (onAddReviewer) {
        onAddReviewer(trimmed);
      }
      setNewReviewerName('');
    }
  };

  return ReactDOM.createPortal(
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(15, 23, 42, 0.55)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px'
      }}
      onClick={onClose}
    >
      <div 
        style={{
          background: '#ffffff',
          borderRadius: '16px',
          width: '100%',
          maxWidth: '420px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden',
          animation: 'scaleUp 0.15s ease-out'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 18px', borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: '#eff6ff', border: '1px solid #bfdbfe', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb' }}>
              <User size={16} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '0.96rem', fontWeight: 800, color: '#0f172a' }}>
                Manage Reviewers
              </h3>
              <div style={{ fontSize: '0.68rem', color: '#64748b' }}>Add or remove reviewer names from your team list</div>
            </div>
          </div>
          <button 
            onClick={onClose} 
            style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '50%', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b' }}
          >
            <X size={14} />
          </button>
        </div>

        {/* Add New Reviewer Form */}
        <div style={{ padding: '14px 18px', borderBottom: '1px solid #f1f5f9', background: '#ffffff' }}>
          <label style={{ fontSize: '0.68rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: '6px' }}>
            Add New Reviewer
          </label>
          <form 
            onSubmit={handleSubmit}
            style={{ display: 'flex', gap: '8px' }}
          >
            <input
              type="text"
              placeholder="Enter reviewer full name..."
              value={newReviewerName}
              onChange={(e) => setNewReviewerName(e.target.value)}
              style={{
                flex: 1,
                height: '32px',
                padding: '0 10px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                fontSize: '0.78rem',
                outline: 'none',
                background: '#f8fafc',
                color: '#0f172a'
              }}
            />
            <button
              type="submit"
              disabled={!newReviewerName.trim()}
              style={{
                height: '32px',
                padding: '0 14px',
                borderRadius: '8px',
                border: 'none',
                background: newReviewerName.trim() ? 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)' : '#e2e8f0',
                color: newReviewerName.trim() ? '#ffffff' : '#94a3b8',
                fontWeight: 700,
                fontSize: '0.76rem',
                cursor: newReviewerName.trim() ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <Plus size={14} /> Add
            </button>
          </form>
        </div>

        {/* Existing Reviewers List */}
        <div style={{ padding: '14px 18px', maxHeight: '260px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ fontSize: '0.68rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '2px' }}>
            Active Reviewers ({reviewerOptions.length})
          </div>
          {reviewerOptions.map((reviewer) => (
            <div 
              key={reviewer} 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between', 
                background: '#f8fafc', 
                padding: '8px 12px', 
                borderRadius: '8px', 
                border: '1px solid #f1f5f9',
                fontSize: '0.78rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: reviewer !== 'Unassigned' ? '#eff6ff' : '#f1f5f9', color: reviewer !== 'Unassigned' ? '#2563eb' : '#64748b', fontSize: '0.68rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {reviewer.slice(0, 1).toUpperCase()}
                </div>
                <span style={{ fontWeight: 700, color: '#0f172a' }}>{reviewer}</span>
                {reviewer === 'Unassigned' && (
                  <span style={{ fontSize: '0.62rem', color: '#94a3b8', background: '#e2e8f0', padding: '1px 5px', borderRadius: '4px' }}>Default</span>
                )}
              </div>

              {reviewer !== 'Unassigned' && onDeleteReviewer && (
                <button
                  type="button"
                  onClick={() => onDeleteReviewer(reviewer)}
                  title={`Delete reviewer ${reviewer}`}
                  style={{
                    background: '#fee2e2',
                    border: '1px solid #fca5a5',
                    color: '#dc2626',
                    width: '26px',
                    height: '26px',
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.15s'
                  }}
                >
                  <Trash2 size={13} />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Modal Footer */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '12px 18px', background: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
          <button 
            onClick={onClose} 
            style={{ padding: '6px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#ffffff', color: '#0f172a', fontWeight: 700, cursor: 'pointer', fontSize: '0.76rem' }}
          >
            Done
          </button>
        </div>

      </div>
    </div>,
    document.body
  );
}
