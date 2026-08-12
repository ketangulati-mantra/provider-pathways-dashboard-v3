import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { User, X, Plus, Trash2, ChevronDown, Loader2 } from 'lucide-react';
import { MANTRA_CONFIG } from '../../mantra';

const API_BASE = MANTRA_CONFIG.apiBaseUrl !== undefined && MANTRA_CONFIG.apiBaseUrl !== null ? MANTRA_CONFIG.apiBaseUrl : (import.meta.env.PROD ? '' : 'http://localhost:5000');

export default function ManageReviewersModal({ isOpen, onClose, reviewerOptions = [], onAddReviewer, onDeleteReviewer }) {
  const [selectedUserName, setSelectedUserName] = useState('');
  const [allUsers, setAllUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchUsers();
    }
  }, [isOpen]);

  const fetchUsers = async () => {
    try {
      setLoadingUsers(true);
      const res = await fetch(`${API_BASE}/api/admin/available-users`);
      const json = await res.json();
      if (json.success && Array.isArray(json.users)) {
        setAllUsers(json.users);
      }
    } catch (err) {
      console.error('[ManageReviewersModal] Error fetching users:', err);
    } finally {
      setLoadingUsers(false);
    }
  };

  if (!isOpen) return null;

  // Filter out users who are ALREADY reviewers
  const availableUsers = allUsers.filter(u => {
    if (!u.name || !u.name.trim()) return false;
    const cleanName = u.name.trim();
    if (cleanName === 'Unassigned') return false;
    return !reviewerOptions.includes(cleanName);
  });

  const handleAdd = (e) => {
    e.preventDefault();
    if (selectedUserName && selectedUserName.trim()) {
      if (onAddReviewer) {
        onAddReviewer(selectedUserName.trim());
      }
      setSelectedUserName('');
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
          maxWidth: '460px',
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
              <div style={{ fontSize: '0.68rem', color: '#64748b' }}>Select existing users to assign as reviewers</div>
            </div>
          </div>
          <button 
            onClick={onClose} 
            style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '50%', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b' }}
          >
            <X size={14} />
          </button>
        </div>

        {/* Add Reviewer Selector Form */}
        <div style={{ padding: '14px 18px', borderBottom: '1px solid #f1f5f9', background: '#ffffff' }}>
          <label style={{ fontSize: '0.68rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: '6px' }}>
            Select Existing User to Add as Reviewer
          </label>
          <form 
            onSubmit={handleAdd}
            style={{ display: 'flex', gap: '8px' }}
          >
            <div style={{ position: 'relative', flex: 1 }}>
              <select
                value={selectedUserName}
                onChange={(e) => setSelectedUserName(e.target.value)}
                disabled={loadingUsers || availableUsers.length === 0}
                style={{
                  width: '100%',
                  height: '34px',
                  padding: '0 26px 0 10px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  outline: 'none',
                  background: '#f8fafc',
                  color: selectedUserName ? '#0f172a' : '#64748b',
                  appearance: 'none',
                  cursor: (loadingUsers || availableUsers.length === 0) ? 'not-allowed' : 'pointer'
                }}
              >
                <option value="">
                  {loadingUsers
                    ? 'Loading existing users...'
                    : availableUsers.length === 0
                    ? 'No remaining users available'
                    : 'Choose an existing user...'}
                </option>
                {availableUsers.map((u) => (
                  <option key={u.id || u.name} value={u.name}>
                    {u.name} {u.email ? `(${u.email})` : u.role ? `(${u.role})` : ''}
                  </option>
                ))}
              </select>
              <ChevronDown size={12} color="#64748b" style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
            </div>

            <button
              type="submit"
              disabled={!selectedUserName}
              style={{
                height: '34px',
                padding: '0 14px',
                borderRadius: '8px',
                border: 'none',
                background: selectedUserName ? 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)' : '#e2e8f0',
                color: selectedUserName ? '#ffffff' : '#94a3b8',
                fontWeight: 700,
                fontSize: '0.76rem',
                cursor: selectedUserName ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                whiteSpace: 'nowrap'
              }}
            >
              <Plus size={14} /> Add Reviewer
            </button>
          </form>

          {availableUsers.length === 0 && !loadingUsers && (
            <div style={{ fontSize: '0.68rem', color: '#94a3b8', marginTop: '6px', fontStyle: 'italic' }}>
              All registered users in the system are currently added to the reviewer list.
            </div>
          )}
        </div>

        {/* Active Reviewers List */}
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
