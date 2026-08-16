import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Search, Eye, Filter, CheckCircle2, XCircle, Clock, Building2, Calendar, UserCheck, Plus, ChevronDown, X, Mail, User, RefreshCw, Download, FileSpreadsheet } from 'lucide-react';
import ManageReviewersModal from './ManageReviewersModal';
import { MANTRA_CONFIG } from '../../mantra';
import { useAuth } from '../../auth/AuthContext';
import { fetchAdminReviewers } from '../../mantra/api';

const API_BASE = MANTRA_CONFIG.apiBaseUrl !== undefined && MANTRA_CONFIG.apiBaseUrl !== null ? MANTRA_CONFIG.apiBaseUrl : (import.meta.env.PROD ? '' : 'http://localhost:5000');

const DEFAULT_REVIEWERS = [
  'Unassigned'
];

// Submission View Details Modal
function SubmissionDetailsModal({ app, isOpen, onClose }) {
  if (!isOpen || !app) return null;

  return ReactDOM.createPortal(
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 999999,
        background: 'rgba(15, 23, 42, 0.65)',
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
          maxWidth: '540px',
          maxHeight: '85vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          overflow: 'hidden',
          animation: 'scaleUp 0.15s ease-out'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '34px', height: '34px', borderRadius: '10px', background: '#eff6ff', border: '1px solid #bfdbfe', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb' }}>
              <Building2 size={18} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>
                {app.full_name || 'Applicant Details'}
              </h3>
              <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
                Submitted on {(() => {
                  const raw = app.submitted_at || app.updated_at || app.created_at;
                  if (!raw) return 'N/A';
                  const d = new Date(raw);
                  return isNaN(d.getTime()) ? 'N/A' : d.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
                })()}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '50%', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b' }}
          >
            <X size={14} />
          </button>
        </div>

        {/* Modal Content */}
        <div style={{ padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', background: '#f8fafc', padding: '14px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
            <div>
              <div style={{ fontSize: '0.68rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>Email Address</div>
              <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#0f172a', marginTop: '2px' }}>{app.email || 'N/A'}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.68rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>Phone Number</div>
              <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#0f172a', marginTop: '2px' }}>{app.country_code} {app.phone || 'N/A'}</div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div style={{ border: '1px solid #e2e8f0', borderRadius: '10px', padding: '12px' }}>
              <div style={{ fontSize: '0.68rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>Location / City</div>
              <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#0f172a', marginTop: '2px' }}>{app.city || 'N/A'}</div>
            </div>
            <div style={{ border: '1px solid #e2e8f0', borderRadius: '10px', padding: '12px' }}>
              <div style={{ fontSize: '0.68rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>Target Industry</div>
              <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#0f172a', marginTop: '2px' }}>{app.industries || 'N/A'}</div>
            </div>
          </div>

          <div style={{ border: '1px solid #e2e8f0', borderRadius: '10px', padding: '12px' }}>
            <div style={{ fontSize: '0.68rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>Network Connections</div>
            <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#0f172a', marginTop: '2px' }}>{app.company_connections || 'N/A'}</div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div style={{ border: '1px solid #e2e8f0', borderRadius: '10px', padding: '12px' }}>
              <div style={{ fontSize: '0.68rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>Weekly Availability</div>
              <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#0f172a', marginTop: '2px' }}>{app.availability || 'N/A'}</div>
            </div>
            <div style={{ border: '1px solid #e2e8f0', borderRadius: '10px', padding: '12px' }}>
              <div style={{ fontSize: '0.68rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>Assigned Reviewer</div>
              <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#2563eb', marginTop: '2px' }}>{app.reviewed_by || 'Unassigned'}</div>
            </div>
          </div>

          <div style={{ border: '1px solid #e2e8f0', borderRadius: '10px', padding: '12px', background: '#faf5ff' }}>
            <div style={{ fontSize: '0.68rem', fontWeight: 800, color: '#7e22ce', textTransform: 'uppercase' }}>Primary Goal</div>
            <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#581c87', marginTop: '2px' }}>{app.motivation || 'N/A'}</div>
          </div>

        </div>

        {/* Modal Footer */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '12px 20px', background: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
          <button
            onClick={onClose}
            style={{ padding: '7px 18px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#ffffff', color: '#334155', fontWeight: 800, fontSize: '0.78rem', cursor: 'pointer' }}
          >
            Close Details
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default function CorporateAdminDashboard() {
  const { admin: currentAdmin, user } = useAuth();
  const activeUser = currentAdmin || user;
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'submitted' | 'approved' | 'rejected'
  const [dateFilter, setDateFilter] = useState('all');
  const [reviewerFilter, setReviewerFilter] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [selectedIndustry, setSelectedIndustry] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [applicationsData, setApplicationsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  // Modal State
  const [viewApp, setViewApp] = useState(null);

  // Custom Date Range State
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');

  // Custom Reviewers State
  const [reviewerOptions, setReviewerOptions] = useState(DEFAULT_REVIEWERS);
  const [isManagingReviewers, setIsManagingReviewers] = useState(false);

  // Filter Visibility Toggle State
  const [filterVisibility, setFilterVisibility] = useState({
    date: true,
    status: true,
    reviewer: true,
    location: true,
    industry: true,
    search: true
  });
  const [isFilterSettingsOpen, setIsFilterSettingsOpen] = useState(false);
  const filterSettingsRef = React.useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (filterSettingsRef.current && !filterSettingsRef.current.contains(e.target)) {
        setIsFilterSettingsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    fetchApplications();
  }, [activeTab, searchQuery]);

  const loadDbReviewers = async (appsList = []) => {
    try {
      const res = await fetchAdminReviewers();
      let dbNames = [];
      if (res && res.success) {
        if (Array.isArray(res.reviewers)) {
          dbNames = res.reviewers.map(r => r.name || r.email || r.user_id).filter(Boolean);
        } else if (Array.isArray(res.data)) {
          dbNames = res.data.map(r => (typeof r === 'string' ? r : r.name || r.email)).filter(Boolean);
        }
      }
      const currentApps = appsList.length > 0 ? appsList : (applicationsData?.applications || []);
      const existingReviewers = currentApps
        .map(a => a.reviewed_by)
        .filter(r => r && r.trim() && r !== 'Unassigned');

      const allActiveReviewers = Array.from(new Set([...dbNames, ...existingReviewers]));
      setReviewerOptions(allActiveReviewers);
    } catch (err) {
      console.error('[CorporateAdminDashboard] Error loading DB reviewers:', err);
    }
  };

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/corporate-program/admin/applications?status=${activeTab}&search=${encodeURIComponent(searchQuery)}`);
      const json = await res.json();
      if (json.success) {
        setApplicationsData(json.data);
        const apps = json.data?.applications || [];
        loadDbReviewers(apps);
      }
    } catch (err) {
      console.error('[CorporateAdminDashboard] Error fetching applications:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddReviewer = (name) => {
    if (!reviewerOptions.includes(name)) {
      setReviewerOptions(prev => [...prev, name]);
    }
  };

  const handleDeleteReviewer = (name) => {
    setReviewerOptions(prev => prev.filter(r => r !== name));
    if (reviewerFilter === name) {
      setReviewerFilter('all');
    }
  };

  const STATUS_CONFIG = {
    pending: { label: 'Pending', bg: '#fef3c7', border: '#fde68a', color: '#b45309' },
    under_review: { label: 'Under Review', bg: '#ffedd5', border: '#fed7aa', color: '#c2410c' },
    reviewed: { label: 'Reviewed', bg: '#dcfce7', border: '#bbf7d0', color: '#15803d' },
    mail_sent: { label: 'Mail Sent', bg: '#ffffff', border: '#cbd5e1', color: '#334155' },
  };

  const handleStatusChange = async (app, newStatus) => {
    const appId = app.id || app.user_id;
    const activeAdminName = activeUser?.name || activeUser?.email || (app.reviewed_by && app.reviewed_by !== 'Unassigned' ? app.reviewed_by : 'Unassigned');
    const isUnassigned = newStatus === 'pending' || newStatus === 'submitted';

    const targetReviewer = isUnassigned
      ? 'Unassigned'
      : (!app.reviewed_by || app.reviewed_by === 'Unassigned' ? activeAdminName : app.reviewed_by);

    // 1. Instant Optimistic State Update: 0ms UI update, zero flicker/reload
    setApplicationsData(prev => {
      if (!prev) return prev;
      const appsList = prev.applications || (Array.isArray(prev) ? prev : []);

      const updatedApps = appsList.map(item => {
        const matchesId = (item.id !== undefined && app.id !== undefined && String(item.id) === String(app.id));
        const matchesUser = (item.user_id !== undefined && app.user_id !== undefined && String(item.user_id) === String(app.user_id));
        if (matchesId || matchesUser) {
          return {
            ...item,
            reviewed_by: targetReviewer,
            application_status: newStatus,
            review_status: newStatus
          };
        }
        return item;
      });

      // Recalculate status counts dynamically across all applications
      let pendingCount = 0;
      let underReviewCount = 0;
      let reviewedCount = 0;
      let mailSentCount = 0;

      updatedApps.forEach((a) => {
        const st = (a.review_status || a.application_status || 'pending').toLowerCase();
        if (st === 'submitted' || st === 'pending' || st === '') {
          pendingCount++;
        } else if (st === 'under_review') {
          underReviewCount++;
        } else if (st === 'reviewed' || st === 'approved') {
          reviewedCount++;
        } else if (st === 'mail_sent') {
          mailSentCount++;
        }
      });

      const updatedCounts = {
        pending: pendingCount,
        underReview: underReviewCount,
        reviewed: reviewedCount,
        mailSent: mailSentCount,
        all: updatedApps.length
      };

      if (Array.isArray(prev)) return updatedApps;

      return {
        ...prev,
        statusCounts: updatedCounts,
        applications: updatedApps
      };
    });

    // 2. Silent background persistence (no loading spinner, no re-fetching)
    try {
      await fetch(`${API_BASE}/api/corporate-program/admin/applications/${appId}/reviewer`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reviewer: targetReviewer, status: newStatus })
      });
    } catch (err) {
      console.error('[CorporateAdminDashboard] Error updating status:', err);
    }
  };

  const getStatusBadge = (st) => {
    switch (st) {
      case 'approved':
        return <span style={{ background: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0', padding: '3px 8px', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 800, whiteSpace: 'nowrap', display: 'inline-block' }}>Approved</span>;
      case 'rejected':
        return <span style={{ background: '#fef2f2', color: '#b91c1c', border: '1px solid #fecaca', padding: '3px 8px', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 800, whiteSpace: 'nowrap', display: 'inline-block' }}>Rejected</span>;
      case 'interested':
      case 'NOT_APPLIED':
        return <span style={{ background: '#faf5ff', color: '#7e22ce', border: '1px solid #e9d5ff', padding: '3px 8px', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 800, whiteSpace: 'nowrap', display: 'inline-block' }}>Initial Interest</span>;
      default:
        return <span style={{ background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe', padding: '3px 8px', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 800, whiteSpace: 'nowrap', display: 'inline-block' }}>Submitted</span>;
    }
  };

  let rawApplications = (applicationsData?.applications || []).filter(
    app => app.application_status !== 'interested' && (app.full_name || app.email)
  );

  // Extract unique locations and industries for filter options
  const uniqueLocations = Array.from(new Set(
    rawApplications.map(app => app.city).filter(c => c && c.trim() && c !== 'Pending')
  )).sort();

  const uniqueIndustries = Array.from(new Set(
    rawApplications.map(app => app.industries).filter(ind => ind && ind.trim())
  )).sort();

  // Filter applications by Date Applied
  if (dateFilter !== 'all') {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    rawApplications = rawApplications.filter(app => {
      const rawDate = app.submitted_at || app.updated_at || app.created_at;
      if (!rawDate) return false;
      const appDate = new Date(rawDate);

      switch (dateFilter) {
        case 'today':
          return appDate >= todayStart;

        case 'yesterday': {
          const yesterdayStart = new Date(todayStart);
          yesterdayStart.setDate(yesterdayStart.getDate() - 1);
          return appDate >= yesterdayStart && appDate < todayStart;
        }

        case 'this_week': {
          const dayOfWeek = now.getDay();
          const weekStart = new Date(todayStart);
          weekStart.setDate(weekStart.getDate() - dayOfWeek);
          return appDate >= weekStart;
        }

        case 'this_month': {
          const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
          return appDate >= monthStart;
        }

        case 'last_month': {
          const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
          const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
          return appDate >= lastMonthStart && appDate <= lastMonthEnd;
        }

        case 'last_3_months': {
          const start3M = new Date(now);
          start3M.setMonth(start3M.getMonth() - 3);
          return appDate >= start3M;
        }

        case 'last_6_months': {
          const start6M = new Date(now);
          start6M.setMonth(start6M.getMonth() - 6);
          return appDate >= start6M;
        }

        case 'last_12_months': {
          const start12M = new Date(now);
          start12M.setMonth(start12M.getMonth() - 12);
          return appDate >= start12M;
        }

        case 'custom': {
          if (!customStartDate && !customEndDate) return true;
          const start = customStartDate ? new Date(customStartDate) : new Date(0);
          const end = customEndDate ? new Date(customEndDate) : new Date();
          end.setHours(23, 59, 59, 999);
          return appDate >= start && appDate <= end;
        }

        default:
          return true;
      }
    });
  }

  // Filter by Reviewer, Location, and Industry
  const filteredApps = rawApplications.filter(app => {
    if (reviewerFilter !== 'all') {
      const rev = app.reviewed_by || 'Unassigned';
      if (rev !== reviewerFilter) return false;
    }
    if (selectedLocation !== 'all') {
      if ((app.city || '').toLowerCase() !== selectedLocation.toLowerCase()) return false;
    }
    if (selectedIndustry !== 'all') {
      if ((app.industries || '').toLowerCase() !== selectedIndustry.toLowerCase()) return false;
    }
    return true;
  });

  const isAnyFilterActive = dateFilter !== 'all' || activeTab !== 'all' || reviewerFilter !== 'all' || selectedLocation !== 'all' || selectedIndustry !== 'all' || searchQuery !== '';

  const handleClearAllFilters = () => {
    setDateFilter('all');
    setActiveTab('all');
    setReviewerFilter('all');
    setSelectedLocation('all');
    setSelectedIndustry('all');
    setSearchQuery('');
    setCustomStartDate('');
    setCustomEndDate('');
  };

  const statusCounts = applicationsData?.statusCounts || {
    pending: rawApplications.filter(a => (!a.application_status || a.application_status === 'submitted' || a.application_status === 'pending')).length,
    underReview: rawApplications.filter(a => a.application_status === 'under_review').length,
    reviewed: rawApplications.filter(a => (a.application_status === 'reviewed' || a.application_status === 'approved')).length,
    mailSent: rawApplications.filter(a => a.application_status === 'mail_sent').length,
  };

  const handleExportCSV = () => {
    if (!filteredApps || filteredApps.length === 0) return;
    const headers = ['Applicant Name', 'Email', 'Location / City', 'Target Industry', 'Date Applied', 'Current Status', 'Reviewer'];
    const rows = [headers.join(',')];

    for (const app of filteredApps) {
      const rawDate = app.submitted_at || app.updated_at || app.created_at || app.submittedAt;
      const d = rawDate ? new Date(rawDate) : null;
      const dateStr = d && !isNaN(d.getTime()) ? d.toISOString() : 'N/A';

      const row = [
        `"${(app.full_name || 'Applicant Candidate').replace(/"/g, '""')}"`,
        `"${(app.email || '').replace(/"/g, '""')}"`,
        `"${(app.city || 'N/A').replace(/"/g, '""')}"`,
        `"${(app.industries || 'N/A').replace(/"/g, '""')}"`,
        `"${dateStr}"`,
        `"${app.review_status || app.application_status || 'submitted'}"`,
        `"${app.reviewed_by || 'Unassigned'}"`
      ];
      rows.push(row.join(','));
    }

    const csvContent = 'data:text/csv;charset=utf-8,' + encodeURIComponent(rows.join('\n'));
    const link = document.createElement('a');
    link.setAttribute('href', csvContent);
    link.setAttribute('download', `corporate_eap_submissions_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

      {/* Top Header Control Bar matching Form Submissions */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        background: '#ffffff',
        padding: '12px 18px',
        borderRadius: '12px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 6px rgba(15, 23, 42, 0.15)'
          }}>
            <Building2 size={16} />
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: '1rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.01em' }}>
              Corporate Growth Partner Program - EAP Submissions
            </h2>
            <p style={{ margin: 0, fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>
              Manage corporate EAP partner applications, reviewer assignments, and submission data
            </p>
          </div>
        </div>
      </div>

      {/* Top Status Metrics Cards (Ultra-Compact) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '8px' }}>

        {/* Metric 1: Pending */}
        <div style={{ background: '#fffbeb', borderRadius: '8px', border: '1px solid #fde68a', padding: '6px 10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '26px', height: '26px', borderRadius: '6px', background: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Clock size={13} color="#b45309" />
          </div>
          <div>
            <div style={{ fontSize: '0.62rem', fontWeight: 800, color: '#b45309', textTransform: 'uppercase', letterSpacing: '0.03em' }}>Pending</div>
            <div style={{ fontSize: '0.98rem', fontWeight: 900, color: '#92400e', lineHeight: 1, marginTop: '1px' }}>{statusCounts.pending}</div>
          </div>
        </div>

        {/* Metric 2: Under Review */}
        <div style={{ background: '#fff7ed', borderRadius: '8px', border: '1px solid #fed7aa', padding: '6px 10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '26px', height: '26px', borderRadius: '6px', background: '#ffedd5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Eye size={13} color="#c2410c" />
          </div>
          <div>
            <div style={{ fontSize: '0.62rem', fontWeight: 800, color: '#c2410c', textTransform: 'uppercase', letterSpacing: '0.03em' }}>Under Review</div>
            <div style={{ fontSize: '0.98rem', fontWeight: 900, color: '#9a3412', lineHeight: 1, marginTop: '1px' }}>{statusCounts.underReview}</div>
          </div>
        </div>

        {/* Metric 3: Reviewed */}
        <div style={{ background: '#f0fdf4', borderRadius: '8px', border: '1px solid #bbf7d0', padding: '6px 10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '26px', height: '26px', borderRadius: '6px', background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <CheckCircle2 size={13} color="#15803d" />
          </div>
          <div>
            <div style={{ fontSize: '0.62rem', fontWeight: 800, color: '#15803d', textTransform: 'uppercase', letterSpacing: '0.03em' }}>Reviewed</div>
            <div style={{ fontSize: '0.98rem', fontWeight: 900, color: '#166534', lineHeight: 1, marginTop: '1px' }}>{statusCounts.reviewed}</div>
          </div>
        </div>

        {/* Metric 4: Mail Sent */}
        <div style={{ background: '#ffffff', borderRadius: '8px', border: '1px solid #cbd5e1', padding: '6px 10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '26px', height: '26px', borderRadius: '6px', background: '#f8fafc', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Mail size={13} color="#334155" />
          </div>
          <div>
            <div style={{ fontSize: '0.62rem', fontWeight: 800, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.03em' }}>Mail Sent</div>
            <div style={{ fontSize: '0.98rem', fontWeight: 900, color: '#0f172a', lineHeight: 1, marginTop: '1px' }}>{statusCounts.mailSent}</div>
          </div>
        </div>

      </div>

      {/* Sleek Action & Filter Bar (Matching Form Submissions) */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '10px',
        background: '#ffffff',
        padding: '10px 16px',
        borderRadius: '12px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
      }}>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '30px',
            height: '30px',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            boxShadow: '0 2px 6px rgba(37, 99, 235, 0.2)'
          }}>
            <Building2 size={15} style={{ display: 'block', margin: 'auto' }} />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.01em' }}>
              EAP Submissions Portal
            </h3>
            <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '0px' }}>
              Showing <strong style={{ color: '#2563eb' }}>{filteredApps.length}</strong> records
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>

          {/* 1. Date Applied Dropdown */}
          {filterVisibility.date && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#f8fafc', padding: '4px 8px', borderRadius: '8px', border: '1px solid #cbd5e1', maxWidth: '160px' }}>
              <Calendar size={12} color="#64748b" style={{ flexShrink: 0 }} />
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                style={{ border: 'none', background: 'transparent', fontSize: '0.76rem', color: '#1e293b', fontWeight: 700, outline: 'none', cursor: 'pointer', maxWidth: '130px', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="yesterday">Yesterday</option>
                <option value="this_week">This Week</option>
                <option value="this_month">This Month</option>
                <option value="last_month">Last Month</option>
                <option value="last_3_months">Last 3 Months</option>
                <option value="last_6_months">Last 6 Months</option>
                <option value="last_12_months">Last 12 Months</option>
                <option value="custom">Custom Range...</option>
              </select>

              {/* Custom Date Inputs */}
              {dateFilter === 'custom' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <input
                    type="date"
                    value={customStartDate}
                    onChange={(e) => setCustomStartDate(e.target.value)}
                    style={{ height: '28px', padding: '0 6px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.72rem', color: '#0f172a', outline: 'none' }}
                  />
                  <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700 }}>to</span>
                  <input
                    type="date"
                    value={customEndDate}
                    onChange={(e) => setCustomEndDate(e.target.value)}
                    style={{ height: '28px', padding: '0 6px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.72rem', color: '#0f172a', outline: 'none' }}
                  />
                </div>
              )}
            </div>
          )}

          {/* 2. Status Filter Dropdown */}
          {filterVisibility.status && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#f8fafc', padding: '4px 8px', borderRadius: '8px', border: '1px solid #cbd5e1', maxWidth: '140px' }}>
              <Filter size={12} color="#64748b" style={{ flexShrink: 0 }} />
              <select
                value={activeTab}
                onChange={(e) => setActiveTab(e.target.value)}
                style={{ border: 'none', background: 'transparent', fontSize: '0.76rem', color: '#1e293b', fontWeight: 700, outline: 'none', cursor: 'pointer', maxWidth: '110px', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}
              >
                <option value="all">All Statuses</option>
                <option value="submitted">Submitted</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          )}

          {/* 3. Reviewer Filter Dropdown */}
          {filterVisibility.reviewer && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#f8fafc', padding: '4px 8px', borderRadius: '8px', border: '1px solid #cbd5e1', maxWidth: '150px' }}>
              <User size={12} color="#64748b" style={{ flexShrink: 0 }} />
              <select
                value={reviewerFilter}
                onChange={(e) => {
                  if (e.target.value === '__MANAGE__') {
                    setIsManagingReviewers(true);
                  } else {
                    setReviewerFilter(e.target.value);
                  }
                }}
                style={{ border: 'none', background: 'transparent', fontSize: '0.76rem', color: '#1e293b', fontWeight: 700, outline: 'none', cursor: 'pointer', maxWidth: '120px', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}
              >
                <option value="all">All Reviewers</option>
                {reviewerOptions.map(rev => (
                  <option key={rev} value={rev}>{rev}</option>
                ))}
                <option value="__MANAGE__">⚙️ Manage Reviewers...</option>
              </select>
            </div>
          )}

          {/* 4. Location / City Filter Dropdown */}
          {filterVisibility.location && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#f8fafc', padding: '4px 8px', borderRadius: '8px', border: '1px solid #cbd5e1', maxWidth: '160px' }}>
              <Building2 size={12} color="#64748b" style={{ flexShrink: 0 }} />
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                style={{ border: 'none', background: 'transparent', fontSize: '0.76rem', color: '#1e293b', fontWeight: 700, outline: 'none', cursor: 'pointer', maxWidth: '130px', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}
              >
                <option value="all">All Locations</option>
                {uniqueLocations.map(loc => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>
          )}

          {/* 5. Target Industry Filter Dropdown */}
          {filterVisibility.industry && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#f8fafc', padding: '4px 8px', borderRadius: '8px', border: '1px solid #cbd5e1', maxWidth: '170px' }}>
              <Filter size={12} color="#64748b" style={{ flexShrink: 0 }} />
              <select
                value={selectedIndustry}
                onChange={(e) => setSelectedIndustry(e.target.value)}
                style={{ border: 'none', background: 'transparent', fontSize: '0.76rem', color: '#1e293b', fontWeight: 700, outline: 'none', cursor: 'pointer', maxWidth: '140px', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}
              >
                <option value="all">All Target Industries</option>
                {uniqueIndustries.map(ind => (
                  <option key={ind} value={ind}>{ind}</option>
                ))}
              </select>
            </div>
          )}

          {/* Filter Customizer Settings Popover */}
          <div style={{ position: 'relative' }} ref={filterSettingsRef}>
            <button
              onClick={() => setIsFilterSettingsOpen(!isFilterSettingsOpen)}
              title="Filter Options & Visibility"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '4px 10px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                background: isFilterSettingsOpen ? '#eff6ff' : '#ffffff',
                color: '#334155',
                fontSize: '0.72rem',
                fontWeight: 700,
                cursor: 'pointer',
                height: '28px'
              }}
            >
              <Filter size={12} color="#2563eb" />
              <span>Filters</span>
              <ChevronDown size={10} color="#64748b" />
            </button>

            {isFilterSettingsOpen && (
              <div style={{
                position: 'absolute',
                top: '34px',
                right: 0,
                zIndex: 99,
                background: '#ffffff',
                border: '1px solid #cbd5e1',
                borderRadius: '10px',
                padding: '10px 14px',
                boxShadow: '0 10px 25px rgba(0,0,0,0.12)',
                width: '180px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}>
                <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: '2px' }}>
                  Visible Filters
                </div>
                {Object.keys(filterVisibility).map(key => (
                  <label key={key} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.76rem', color: '#1e293b', cursor: 'pointer', fontWeight: 600 }}>
                    <input
                      type="checkbox"
                      checked={filterVisibility[key]}
                      onChange={(e) => setFilterVisibility(prev => ({ ...prev, [key]: e.target.checked }))}
                    />
                    <span style={{ textTransform: 'capitalize' }}>{key} Filter</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Reset All Filters Button */}
          {isAnyFilterActive && (
            <button
              onClick={handleClearAllFilters}
              style={{
                padding: '4px 10px',
                borderRadius: '8px',
                border: '1px solid #fecaca',
                background: '#fef2f2',
                color: '#dc2626',
                fontSize: '0.72rem',
                fontWeight: 800,
                cursor: 'pointer',
                height: '28px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <X size={12} /> Clear Filters
            </button>
          )}

          {/* Search Input */}
          {filterVisibility.search && (
            <div style={{ position: 'relative', width: '180px' }}>
              <Search size={12} color="#94a3b8" style={{ position: 'absolute', left: '8px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  height: '28px',
                  padding: '0 8px 0 26px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.72rem',
                  color: '#0f172a',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          )}

          {/* Refresh Button */}
          <button
            onClick={() => fetchApplications()}
            title="Refresh Submissions"
            style={{
              padding: '5px 8px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              background: '#ffffff',
              color: '#475569',
              fontSize: '0.74rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              height: '28px'
            }}
          >
            <RefreshCw size={12} className={loading ? 'spin-icon' : ''} />
            <span>Refresh</span>
          </button>

          {/* Export CSV Button */}
          <button
            onClick={handleExportCSV}
            title="Export CSV"
            style={{
              padding: '5px 10px',
              borderRadius: '8px',
              border: 'none',
              background: '#2563eb',
              color: '#ffffff',
              fontSize: '0.74rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              height: '28px',
              boxShadow: '0 2px 6px rgba(37, 99, 235, 0.25)'
            }}
          >
            <Download size={12} />
            <span>Export CSV</span>
          </button>

        </div>
      </div>

      {/* Main Table — 7-column layout (Submissions column removed) */}
      <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
        <table style={{ width: '100%', tableLayout: 'fixed', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.76rem' }}>
          <thead>
            <tr style={{ background: '#043263', borderBottom: '1px solid #03254c', color: '#ffffff', fontWeight: 800, fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              <th style={{ padding: '7px 10px', width: '22%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Applicant Name</th>
              <th style={{ padding: '7px 10px', width: '17%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Location / City</th>
              <th style={{ padding: '7px 10px', width: '16%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Target Industry</th>
              <th style={{ padding: '7px 10px', width: '13%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Date Applied</th>
              <th style={{ padding: '7px 10px', width: '12%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Current Status</th>
              <th style={{ padding: '7px 10px', width: '12%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Reviewer</th>
              <th style={{ padding: '7px 10px', width: '8%', textAlign: 'right', whiteSpace: 'nowrap' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} style={{ padding: '20px', textAlign: 'center', color: '#64748b', fontWeight: 700 }}>
                  Loading corporate submissions...
                </td>
              </tr>
            ) : filteredApps.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ padding: '20px', textAlign: 'center', color: '#64748b', fontWeight: 700 }}>
                  No corporate submissions found matching current criteria.
                </td>
              </tr>
            ) : (
              (filteredApps.slice((currentPage - 1) * pageSize, currentPage * pageSize)).map((app) => (
                <tr key={app.id || app.user_id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.15s ease' }}>

                  {/* Applicant Name */}
                  <td style={{ padding: '6px 10px', fontWeight: 800, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={app.full_name ? `${app.full_name} (${app.email || 'No Email'})` : 'Initial Interest Lead'}>
                    <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', fontSize: '0.78rem', color: app.full_name ? '#0f172a' : '#6b21a8' }}>
                      {app.full_name || (app.application_status === 'interested' ? 'Initial Interest Candidate' : 'Applicant Candidate')}
                    </div>
                    <div style={{ fontSize: '0.68rem', color: app.email ? '#64748b' : '#9333ea', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {app.email || (app.application_status === 'interested' ? 'Awaiting Full Form Submission' : 'Pending Details')}
                    </div>
                  </td>

                  {/* Location / City */}
                  <td style={{ padding: '6px 10px', color: '#334155', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontSize: '0.76rem' }} title={app.city}>
                    {(() => {
                      if (!app.city) return 'N/A';
                      const parts = app.city.split(',').map((s) => s.trim());
                      const unique = Array.from(new Set(parts));
                      if (unique.length >= 2) {
                        return `${unique[0]}, ${unique[unique.length - 1]}`;
                      }
                      return unique[0] || app.city;
                    })()}
                  </td>

                  {/* Target Industry */}
                  <td style={{ padding: '6px 10px', color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontSize: '0.74rem' }} title={app.industries}>
                    {app.industries || 'N/A'}
                  </td>

                  {/* Date Applied */}
                  <td style={{ padding: '6px 10px', color: '#64748b', fontSize: '0.74rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {(() => {
                      const rawDate = app.submitted_at || app.updated_at || app.created_at || app.submittedAt;
                      if (!rawDate) return 'N/A';
                      const d = new Date(rawDate);
                      return isNaN(d.getTime()) ? 'N/A' : d.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
                    })()}
                  </td>

                  {/* Current Status Select Dropdown */}
                  <td style={{ padding: '6px 10px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {(() => {
                      const currentSt = (app.review_status || app.application_status || 'submitted').toLowerCase();
                      const mappedSt = (currentSt === 'submitted' || currentSt === 'pending') ? 'pending' : currentSt;
                      const conf = STATUS_CONFIG[mappedSt] || STATUS_CONFIG.pending;
                      return (
                        <select
                          value={mappedSt}
                          onChange={(e) => handleStatusChange(app, e.target.value)}
                          style={{
                            padding: '2px 6px',
                            borderRadius: '6px',
                            border: `1px solid ${conf.border}`,
                            background: conf.bg,
                            fontSize: '0.72rem',
                            fontWeight: 800,
                            color: conf.color,
                            outline: 'none',
                            cursor: 'pointer',
                            maxWidth: '100%',
                            textOverflow: 'ellipsis'
                          }}
                        >
                          <option value="pending" style={{ background: '#ffffff', color: '#0f172a' }}>Pending</option>
                          <option value="under_review" style={{ background: '#ffffff', color: '#0f172a' }}>Under Review</option>
                          <option value="reviewed" style={{ background: '#ffffff', color: '#0f172a' }}>Reviewed</option>
                          <option value="mail_sent" style={{ background: '#ffffff', color: '#0f172a' }}>Mail Sent</option>
                        </select>
                      );
                    })()}
                  </td>

                  {/* Reviewer Display Badge (Display-only, auto-synced with status changes) */}
                  <td style={{ padding: '6px 10px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span
                        style={{
                          fontSize: '0.72rem',
                          fontWeight: app.reviewed_by && app.reviewed_by !== 'Unassigned' ? 800 : 600,
                          color: app.reviewed_by && app.reviewed_by !== 'Unassigned' ? '#1e293b' : '#94a3b8',
                          background: app.reviewed_by && app.reviewed_by !== 'Unassigned' ? '#f1f5f9' : 'transparent',
                          padding: app.reviewed_by && app.reviewed_by !== 'Unassigned' ? '2px 8px' : '0',
                          borderRadius: '6px',
                          border: app.reviewed_by && app.reviewed_by !== 'Unassigned' ? '1px solid #cbd5e1' : 'none'
                        }}
                        title={app.reviewed_by || 'Unassigned'}
                      >
                        {app.reviewed_by && app.reviewed_by !== 'Unassigned' ? app.reviewed_by : 'Unassigned'}
                      </span>
                    </div>
                  </td>

                  {/* Actions */}
                  <td style={{ padding: '6px 10px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                    <button
                      onClick={() => setViewApp(app)}
                      style={{
                        padding: '3px 8px',
                        borderRadius: '5px',
                        border: '1px solid #cbd5e1',
                        background: '#ffffff',
                        color: '#1e293b',
                        fontWeight: 800,
                        fontSize: '0.72rem',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '3px'
                      }}
                    >
                      <Eye size={12} color="#2563eb" /> View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination Footer Controls */}
        {filteredApps.length > 0 && (() => {
          const totalPages = Math.max(1, Math.ceil(filteredApps.length / pageSize));
          return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px', background: '#f8fafc', borderTop: '1px solid #e2e8f0', flexWrap: 'wrap', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.76rem', color: '#475569', fontWeight: 600 }}>
                <span>Rows per page:</span>
                <select
                  value={pageSize}
                  onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
                  style={{ padding: '3px 8px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#ffffff', color: '#0f172a', fontSize: '0.76rem', fontWeight: 700, outline: 'none', cursor: 'pointer' }}
                >
                  <option value={25}>25 records</option>
                  <option value={50}>50 records</option>
                  <option value={100}>100 records</option>
                </select>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <span style={{ fontSize: '0.76rem', color: '#64748b', fontWeight: 600 }}>
                  Page <strong style={{ color: '#0f172a' }}>{currentPage}</strong> of <strong style={{ color: '#0f172a' }}>{totalPages}</strong> ({filteredApps.length} total records)
                </span>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <button
                    onClick={() => setCurrentPage(1)}
                    disabled={currentPage <= 1}
                    title="First Page"
                    style={{ padding: '4px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', background: currentPage <= 1 ? '#f1f5f9' : '#ffffff', color: currentPage <= 1 ? '#94a3b8' : '#334155', fontSize: '0.74rem', fontWeight: 700, cursor: currentPage <= 1 ? 'not-allowed' : 'pointer' }}
                  >
                    «
                  </button>

                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage <= 1}
                    style={{ padding: '4px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', background: currentPage <= 1 ? '#f1f5f9' : '#ffffff', color: currentPage <= 1 ? '#94a3b8' : '#334155', fontSize: '0.74rem', fontWeight: 700, cursor: currentPage <= 1 ? 'not-allowed' : 'pointer' }}
                  >
                    Previous
                  </button>

                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage >= totalPages}
                    style={{ padding: '4px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', background: currentPage >= totalPages ? '#f1f5f9' : '#ffffff', color: currentPage >= totalPages ? '#94a3b8' : '#334155', fontSize: '0.74rem', fontWeight: 700, cursor: currentPage >= totalPages ? 'not-allowed' : 'pointer' }}
                  >
                    Next
                  </button>

                  <button
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={currentPage >= totalPages}
                    title="Last Page"
                    style={{ padding: '4px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', background: currentPage >= totalPages ? '#f1f5f9' : '#ffffff', color: currentPage >= totalPages ? '#94a3b8' : '#334155', fontSize: '0.74rem', fontWeight: 700, cursor: currentPage >= totalPages ? 'not-allowed' : 'pointer' }}
                  >
                    »
                  </button>
                </div>
              </div>
            </div>
          );
        })()}
      </div>

      {/* Submission Details Modal */}
      <SubmissionDetailsModal
        app={viewApp}
        isOpen={Boolean(viewApp)}
        onClose={() => setViewApp(null)}
      />

      {/* Manage Reviewers Modal */}
      <ManageReviewersModal
        isOpen={isManagingReviewers}
        onClose={() => {
          setIsManagingReviewers(false);
          loadDbReviewers();
        }}
        onReviewersChange={(newReviewers) => setReviewerOptions(newReviewers)}
      />

    </div>
  );
}
