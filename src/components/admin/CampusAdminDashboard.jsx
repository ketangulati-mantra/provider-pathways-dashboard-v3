import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { Search, Eye, Filter, CheckCircle2, XCircle, Clock, GraduationCap, Calendar, UserCheck, Plus, ChevronDown, Sparkles, Building2, BookOpen, X } from 'lucide-react';
import CampusApplicationDetailsDrawer from './CampusApplicationDetailsDrawer';
import RejectReasonModal from './RejectReasonModal';
import RequestMoreInfoModal from './RequestMoreInfoModal';
import ManageReviewersModal from './ManageReviewersModal';
import { MANTRA_CONFIG } from '../../mantra';
import { useAuth } from '../../auth/AuthContext';

const API_BASE = MANTRA_CONFIG.apiBaseUrl !== undefined && MANTRA_CONFIG.apiBaseUrl !== null ? MANTRA_CONFIG.apiBaseUrl : (import.meta.env.PROD ? '' : 'http://localhost:5000');

const DEFAULT_REVIEWERS = [
  'Unassigned'
];

export default function CampusAdminDashboard() {
  const { admin: currentAdmin } = useAuth();
  const loggedInReviewerName = currentAdmin?.name || 'Admin';

  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'submitted' | 'under_review' | 'approved' | 'rejected' | 'more_info_required'
  const [dateFilter, setDateFilter] = useState('all'); // 'all' | 'today' | '7days' | '30days' | 'this_month'
  const [reviewerFilter, setReviewerFilter] = useState('all'); // 'all' | reviewerName
  const [searchQuery, setSearchQuery] = useState('');
  const [applicationsData, setApplicationsData] = useState(null);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Custom Reviewers State
  const [reviewerOptions, setReviewerOptions] = useState(DEFAULT_REVIEWERS);
  const [customReviewerApp, setCustomReviewerApp] = useState(null);
  const [customNameInput, setCustomNameInput] = useState('');
  const [isManagingReviewers, setIsManagingReviewers] = useState(false);

  // Modal & Drawer Controls
  const [selectedAppId, setSelectedAppId] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [rejectModalApp, setRejectModalApp] = useState(null);
  const [requestInfoModalApp, setRequestInfoModalApp] = useState(null);

  // Filter Visibility Toggle State for Campus Program
  const [filterVisibility, setFilterVisibility] = useState({
    date: true,
    status: true,
    activity: true,
    search: true,
    reviewer: false,
    college: false,
    course: false
  });
  const [isFilterSettingsOpen, setIsFilterSettingsOpen] = useState(false);
  const filterSettingsRef = useRef(null);

  const [selectedCollege, setSelectedCollege] = useState('all');
  const [selectedCourse, setSelectedCourse] = useState('all');

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
    fetchAnalytics();
  }, [activeTab, searchQuery]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/campus-program/admin/applications?status=${activeTab}&search=${encodeURIComponent(searchQuery)}`);
      const json = await res.json();
      if (json.success) {
        setApplicationsData(json.data);
        const apps = json.data?.applications || [];
        const existingReviewers = apps
          .map(a => a.reviewed_by)
          .filter(r => r && r.trim() && r !== 'Unassigned');
        setReviewerOptions(prev => Array.from(new Set([...prev, ...existingReviewers])));
      }
    } catch (err) {
      console.error('[CampusAdminDashboard] Error fetching applications:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/campus-program/admin/analytics`);
      const json = await res.json();
      if (json.success) {
        setAnalyticsData(json.data);
      }
    } catch (err) {
      console.error('[CampusAdminDashboard] Error fetching analytics:', err);
    }
  };

  const handleOpenDrawer = (appId) => {
    setSelectedAppId(appId);
    setIsDrawerOpen(true);
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

  const handleReviewerChange = async (app, newReviewer) => {
    if (newReviewer === '__MANAGE__' || newReviewer === '__ADD_CUSTOM__') {
      setIsManagingReviewers(true);
      return;
    }

    await updateAppReviewer(app.id, newReviewer);
  };

  const updateAppReviewer = async (applicationId, reviewerName) => {
    const isUnassigned = !reviewerName || reviewerName === 'Unassigned';
    const targetStatus = isUnassigned ? 'submitted' : 'under_review';
    const effectiveReviewer = isUnassigned ? 'Unassigned' : reviewerName;

    // 1. Instant Optimistic State Update: 0ms UI update, zero loading spinner/reload
    setApplicationsData(prev => {
      if (!prev || !prev.applications) return prev;
      return {
        ...prev,
        applications: prev.applications.map(app =>
          app.id === applicationId ? { ...app, reviewed_by: effectiveReviewer, application_status: targetStatus } : app
        )
      };
    });

    // 2. Silent background persistence (no loading spinner, no re-fetching)
    try {
      await fetch(`${API_BASE}/api/campus-program/admin/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          applicationId,
          action: targetStatus,
          reviewerId: effectiveReviewer,
          reviewerNotes: isUnassigned ? 'Unassigned reviewer' : `Assigned reviewer: ${effectiveReviewer}`
        })
      });
    } catch (err) {
      console.error('[CampusAdminDashboard] Error updating reviewer:', err);
    }
  };

  const handleCustomReviewerSubmit = async (e) => {
    e.preventDefault();
    const cleanName = customNameInput.trim();
    if (!cleanName || !customReviewerApp) return;

    if (!reviewerOptions.includes(cleanName)) {
      setReviewerOptions(prev => [...prev, cleanName]);
    }

    await updateAppReviewer(customReviewerApp.id, cleanName);
    setCustomReviewerApp(null);
    setCustomNameInput('');
  };

  const handleConfirmReject = async (reason) => {
    if (!rejectModalApp) return;
    try {
      const res = await fetch(`${API_BASE}/api/campus-program/admin/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          applicationId: rejectModalApp.id,
          action: 'reject',
          reviewReason: reason,
          reviewerId: loggedInReviewerName
        })
      });
      const json = await res.json();
      if (json.success) {
        setRejectModalApp(null);
        setIsDrawerOpen(false);
        fetchApplications();
        fetchAnalytics();
      }
    } catch (err) {
      console.error('[CampusAdminDashboard] Error rejecting:', err);
    }
  };

  const handleConfirmRequestInfo = async ({ requestedFields, reviewerNotes }) => {
    if (!requestInfoModalApp) return;
    try {
      const res = await fetch(`${API_BASE}/api/campus-program/admin/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          applicationId: requestInfoModalApp.id,
          action: 'request_info',
          requestedFields,
          reviewerNotes,
          reviewerId: loggedInReviewerName
        })
      });
      const json = await res.json();
      if (json.success) {
        setRequestInfoModalApp(null);
        setIsDrawerOpen(false);
        fetchApplications();
        fetchAnalytics();
      }
    } catch (err) {
      console.error('[CampusAdminDashboard] Error requesting info:', err);
    }
  };

  const getStatusBadge = (st) => {
    switch (st) {
      case 'approved':
        return <span style={{ background: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0', padding: '4px 12px', borderRadius: '10px', fontSize: '0.75rem', fontWeight: 900, whiteSpace: 'nowrap', display: 'inline-block' }}>Approved</span>;
      case 'rejected':
        return <span style={{ background: '#fef2f2', color: '#b91c1c', border: '1px solid #fecaca', padding: '4px 12px', borderRadius: '10px', fontSize: '0.75rem', fontWeight: 900, whiteSpace: 'nowrap', display: 'inline-block' }}>Rejected</span>;
      case 'more_info_required':
        return <span style={{ background: '#fff7ed', color: '#c2410c', border: '1px solid #ffedd5', padding: '4px 12px', borderRadius: '10px', fontSize: '0.75rem', fontWeight: 900, whiteSpace: 'nowrap', display: 'inline-block' }}>Info Requested</span>;
      case 'under_review':
        return <span style={{ background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe', padding: '4px 12px', borderRadius: '10px', fontSize: '0.75rem', fontWeight: 900, whiteSpace: 'nowrap', display: 'inline-block' }}>Under Review</span>;
      default:
        return <span style={{ background: '#f1f5f9', color: '#475569', border: '1px solid #e2e8f0', padding: '4px 12px', borderRadius: '10px', fontSize: '0.75rem', fontWeight: 900, whiteSpace: 'nowrap', display: 'inline-block' }}>Submitted</span>;
    }
  };

  // Custom Date Range State
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [isCustomDateModalOpen, setIsCustomDateModalOpen] = useState(false);

  const statusCounts = applicationsData?.statusCounts || { all: 0, submitted: 0, under_review: 0, approved: 0, rejected: 0, more_info_required: 0 };
  let rawApplications = applicationsData?.applications || [];

  // Filter applications by Date Applied
  if (dateFilter !== 'all') {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    rawApplications = rawApplications.filter(app => {
      const appDate = new Date(app.submitted_at || app.updated_at || Date.now());
      
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
          start12M.setFullYear(start12M.getFullYear() - 1);
          return appDate >= start12M;
        }

        case 'custom': {
          if (!customStartDate && !customEndDate) return true;
          const appTime = appDate.getTime();
          const start = customStartDate ? new Date(customStartDate).getTime() : 0;
          const end = customEndDate ? new Date(customEndDate + 'T23:59:59').getTime() : Infinity;
          return appTime >= start && appTime <= end;
        }

        default:
          return true;
      }
    });
  }

  // Filter applications by Reviewer
  if (filterVisibility.reviewer && reviewerFilter !== 'all') {
    rawApplications = rawApplications.filter(app => {
      if (reviewerFilter === 'Unassigned') {
        return !app.reviewed_by || app.reviewed_by === 'Unassigned';
      }
      return app.reviewed_by === reviewerFilter;
    });
  }

  // Extract unique colleges & courses
  const uniqueColleges = Array.from(new Set(
    (applicationsData?.applications || [])
      .map(app => app.college_name || app.college || app.university)
      .filter(c => c && String(c).trim())
  ));

  const uniqueCourses = Array.from(new Set(
    (applicationsData?.applications || [])
      .map(app => app.course || app.degree || app.year_of_study)
      .filter(c => c && String(c).trim())
  ));

  // Filter applications by College
  if (filterVisibility.college && selectedCollege !== 'all') {
    rawApplications = rawApplications.filter(app => {
      const appCollege = app.college_name || app.college || app.university || '';
      return appCollege.toLowerCase() === selectedCollege.toLowerCase();
    });
  }

  // Filter applications by Course
  if (filterVisibility.course && selectedCourse !== 'all') {
    rawApplications = rawApplications.filter(app => {
      const appCourse = app.course || app.degree || app.year_of_study || '';
      return appCourse.toLowerCase() === selectedCourse.toLowerCase();
    });
  }

  return (
    <div style={{ padding: '0 0 40px', display: 'flex', flexDirection: 'column', gap: '12px' }} className="animate-fade-in">
      
      {/* Header Banner - Compact Lighter Blue Tone */}
      <div style={{
        background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
        borderRadius: '12px',
        padding: '12px 18px',
        color: '#ffffff',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 6px 16px -4px rgba(37, 99, 235, 0.25)',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.2)', border: '1px solid rgba(255, 255, 255, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff', flexShrink: 0 }}>
            <GraduationCap size={16} />
          </div>
          <div>
            <span style={{ fontSize: '0.66rem', fontWeight: 800, color: '#dbeafe', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Institutional Management
            </span>
            <h1 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 900, color: '#ffffff' }}>
              Campus Program
            </h1>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <div style={{ background: 'rgba(255, 255, 255, 0.15)', border: '1px solid rgba(255, 255, 255, 0.25)', padding: '4px 10px', borderRadius: '8px', textAlign: 'center', minWidth: '90px' }}>
            <div style={{ fontSize: '0.64rem', color: '#dbeafe', fontWeight: 800 }}>Total Applicants</div>
            <div style={{ fontSize: '0.96rem', fontWeight: 900, color: '#ffffff', lineHeight: 1.2 }}>{analyticsData?.totalApplications || statusCounts.all}</div>
          </div>
          <div style={{ background: 'rgba(255, 255, 255, 0.15)', border: '1px solid rgba(255, 255, 255, 0.25)', padding: '4px 10px', borderRadius: '8px', textAlign: 'center', minWidth: '90px' }}>
            <div style={{ fontSize: '0.64rem', color: '#dbeafe', fontWeight: 800 }}>Pending Review</div>
            <div style={{ fontSize: '0.96rem', fontWeight: 900, color: '#fef08a', lineHeight: 1.2 }}>{analyticsData?.pendingCount || (statusCounts.submitted + statusCounts.under_review)}</div>
          </div>
          <div style={{ background: 'rgba(255, 255, 255, 0.15)', border: '1px solid rgba(255, 255, 255, 0.25)', padding: '4px 10px', borderRadius: '8px', textAlign: 'center', minWidth: '90px' }}>
            <div style={{ fontSize: '0.64rem', color: '#dbeafe', fontWeight: 800 }}>Activation Rate</div>
            <div style={{ fontSize: '0.96rem', fontWeight: 900, color: '#86efac', lineHeight: 1.2 }}>{analyticsData?.activationRate || '0%'}</div>
          </div>
        </div>
      </div>

      {/* Admin Action Control Bar - Single Clean Toolbar */}
      <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', flexWrap: 'wrap', gap: '8px', background: '#ffffff', padding: '8px 12px', borderRadius: '10px', border: '1px solid #e2e8f0', boxShadow: '0 1px 4px rgba(0,0,0,0.01)' }}>
        
        {/* 1. Date Applied Filter */}
        {filterVisibility.date && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative' }}>
              <select
                value={dateFilter}
                onChange={(e) => {
                  const val = e.target.value;
                  setDateFilter(val);
                  if (val === 'custom') {
                    setIsCustomDateModalOpen(true);
                  }
                }}
                style={{
                  padding: '4px 22px 4px 8px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  background: '#ffffff',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  color: '#1e293b',
                  outline: 'none',
                  cursor: 'pointer',
                  appearance: 'none',
                  height: '28px'
                }}
              >
                <option value="all">All Dates</option>
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
              <ChevronDown size={12} color="#64748b" style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
            </div>

            {/* Custom Date Range Inputs */}
            {dateFilter === 'custom' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <input
                  type="date"
                  value={customStartDate}
                  onChange={(e) => setCustomStartDate(e.target.value)}
                  placeholder="From"
                  style={{
                    height: '28px',
                    padding: '0 6px',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.72rem',
                    color: '#0f172a',
                    outline: 'none'
                  }}
                />
                <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700 }}>to</span>
                <input
                  type="date"
                  value={customEndDate}
                  onChange={(e) => setCustomEndDate(e.target.value)}
                  placeholder="To"
                  style={{
                    height: '28px',
                    padding: '0 6px',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.72rem',
                    color: '#0f172a',
                    outline: 'none'
                  }}
                />
              </div>
            )}
          </div>
        )}

        {/* 2. Single Consolidated Status Filter */}
        {filterVisibility.status && (
          <div style={{ position: 'relative' }}>
            <select
              value={activeTab}
              onChange={(e) => setActiveTab(e.target.value)}
              style={{
                padding: '4px 22px 4px 8px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                background: '#ffffff',
                fontSize: '0.72rem',
                fontWeight: 700,
                color: '#1e293b',
                outline: 'none',
                cursor: 'pointer',
                appearance: 'none',
                height: '28px'
              }}
            >
              <option value="all">All Statuses ({statusCounts.all})</option>
              <option value="submitted">Pending Review ({statusCounts.submitted + statusCounts.under_review})</option>
              <option value="approved">Approved Members ({statusCounts.approved})</option>
              <option value="rejected">Rejected ({statusCounts.rejected})</option>
              <option value="more_info_required">Info Requested ({statusCounts.more_info_required})</option>
            </select>
            <ChevronDown size={12} color="#64748b" style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
          </div>
        )}

        {/* 3. Reviewer Filter */}
        {filterVisibility.reviewer && (
          <div style={{ position: 'relative' }}>
            <select
              value={reviewerFilter}
              onChange={(e) => {
                if (e.target.value === '__MANAGE__') {
                  setIsManagingReviewers(true);
                } else {
                  setReviewerFilter(e.target.value);
                }
              }}
              style={{
                padding: '4px 22px 4px 8px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                background: '#ffffff',
                fontSize: '0.72rem',
                fontWeight: 700,
                color: '#1e293b',
                outline: 'none',
                cursor: 'pointer',
                appearance: 'none',
                height: '28px'
              }}
            >
              <option value="all">All Reviewers</option>
              {reviewerOptions.map(rev => (
                <option key={rev} value={rev}>{rev}</option>
              ))}
              <option value="__MANAGE__">⚙️ Manage Reviewers...</option>
            </select>
            <ChevronDown size={12} color="#64748b" style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
          </div>
        )}

        {/* 4. College Filter */}
        {filterVisibility.college && (
          <div style={{ position: 'relative' }}>
            <select
              value={selectedCollege}
              onChange={(e) => setSelectedCollege(e.target.value)}
              style={{
                padding: '4px 22px 4px 8px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                background: '#ffffff',
                fontSize: '0.72rem',
                fontWeight: 700,
                color: '#1e293b',
                outline: 'none',
                cursor: 'pointer',
                appearance: 'none',
                height: '28px',
                maxWidth: '150px',
                textOverflow: 'ellipsis'
              }}
            >
              <option value="all">All Colleges</option>
              {uniqueColleges.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <ChevronDown size={12} color="#64748b" style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
          </div>
        )}

        {/* 5. Course Filter */}
        {filterVisibility.course && (
          <div style={{ position: 'relative' }}>
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              style={{
                padding: '4px 22px 4px 8px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                background: '#ffffff',
                fontSize: '0.72rem',
                fontWeight: 700,
                color: '#1e293b',
                outline: 'none',
                cursor: 'pointer',
                appearance: 'none',
                height: '28px',
                maxWidth: '150px',
                textOverflow: 'ellipsis'
              }}
            >
              <option value="all">All Courses</option>
              {uniqueCourses.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <ChevronDown size={12} color="#64748b" style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
          </div>
        )}

        {/* Search Input */}
        {filterVisibility.search && (
          <div style={{ position: 'relative', width: '180px' }}>
            <Search size={12} color="#94a3b8" style={{ position: 'absolute', left: '8px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search name, college..."
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

        {/* Filter Field Visibility Toggles Popover */}
        <div ref={filterSettingsRef} style={{ position: 'relative' }}>
          <button
            type="button"
            onClick={() => setIsFilterSettingsOpen(prev => !prev)}
            title="Toggle filter fields visibility"
            style={{
              height: '28px',
              padding: '0 8px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              background: isFilterSettingsOpen ? '#eff6ff' : '#ffffff',
              color: isFilterSettingsOpen ? '#2563eb' : '#475569',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '0.74rem',
              fontWeight: 800
            }}
          >
            <Sparkles size={12} color={isFilterSettingsOpen ? '#2563eb' : '#64748b'} />
            <span>Filters</span>
          </button>

          {/* Filter Toggle Menu Card */}
          {isFilterSettingsOpen && (
            <div
              style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: '6px',
                width: '210px',
                background: '#ffffff',
                border: '1px solid #cbd5e1',
                borderRadius: '10px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.12)',
                zIndex: 99999,
                padding: '10px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}
              className="animate-fade-in"
            >
              <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Toggle Filter Visibility
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.76rem', color: '#1e293b', fontWeight: 700, cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={filterVisibility.date}
                    onChange={(e) => setFilterVisibility(prev => ({ ...prev, date: e.target.checked }))}
                  />
                  <span>Time Period</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.76rem', color: '#1e293b', fontWeight: 700, cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={filterVisibility.status}
                    onChange={(e) => setFilterVisibility(prev => ({ ...prev, status: e.target.checked }))}
                  />
                  <span>Status Filter</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.76rem', color: '#1e293b', fontWeight: 700, cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={filterVisibility.reviewer}
                    onChange={(e) => setFilterVisibility(prev => ({ ...prev, reviewer: e.target.checked }))}
                  />
                  <span>Reviewer Filter</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.76rem', color: '#1e293b', fontWeight: 700, cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={filterVisibility.college}
                    onChange={(e) => setFilterVisibility(prev => ({ ...prev, college: e.target.checked }))}
                  />
                  <span>College Filter</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.76rem', color: '#1e293b', fontWeight: 700, cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={filterVisibility.course}
                    onChange={(e) => setFilterVisibility(prev => ({ ...prev, course: e.target.checked }))}
                  />
                  <span>Course Filter</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.76rem', color: '#1e293b', fontWeight: 700, cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={filterVisibility.search}
                    onChange={(e) => setFilterVisibility(prev => ({ ...prev, search: e.target.checked }))}
                  />
                  <span>Search Input</span>
                </label>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Applications Table - Ultra-Compact Layout */}
      <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
        <table style={{ width: '100%', tableLayout: 'fixed', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.76rem' }}>
          <thead>
            <tr style={{ background: '#043263', borderBottom: '1px solid #03254c', color: '#ffffff', fontWeight: 800, fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              <th style={{ padding: '7px 10px', width: '18%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Applicant Name</th>
              <th style={{ padding: '7px 10px', width: '15%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>University / College</th>
              <th style={{ padding: '7px 10px', width: '14%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Course / Year</th>
              <th style={{ padding: '7px 10px', width: '11%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Date Applied</th>
              <th style={{ padding: '7px 10px', width: '11%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Submissions</th>
              <th style={{ padding: '7px 10px', width: '11%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Current Status</th>
              <th style={{ padding: '7px 10px', width: '12%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Reviewer</th>
              <th style={{ padding: '7px 10px', width: '8%', textAlign: 'right', whiteSpace: 'nowrap' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} style={{ padding: '20px', textAlign: 'center', color: '#64748b', fontWeight: 700 }}>
                  Loading campus applications...
                </td>
              </tr>
            ) : rawApplications.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ padding: '20px', textAlign: 'center', color: '#64748b', fontWeight: 700 }}>
                  No campus applications found matching current criteria.
                </td>
              </tr>
            ) : (
              rawApplications.map((app) => (
                <tr key={app.id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.15s ease' }}>
                  
                  {/* Applicant Name with Ellipsis & Hover Tooltip */}
                  <td style={{ padding: '6px 10px', fontWeight: 800, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={`${app.full_name || 'Applicant'} (${app.email})`}>
                    <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', fontSize: '0.78rem' }}>{app.full_name || 'Applicant'}</div>
                    <div style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis' }}>{app.email}</div>
                  </td>

                  {/* University / College with Ellipsis & Hover Tooltip */}
                  <td style={{ padding: '6px 10px', color: '#334155', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontSize: '0.76rem' }} title={app.college}>
                    {app.college}
                  </td>

                  {/* Course / Year with Ellipsis & Hover Tooltip */}
                  <td style={{ padding: '6px 10px', color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontSize: '0.74rem' }} title={`${app.course} (${app.year})`}>
                    {app.course} ({app.year})
                  </td>

                  {/* Date Applied */}
                  <td style={{ padding: '6px 10px', color: '#64748b', fontSize: '0.74rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {new Date(app.submitted_at || app.updated_at || Date.now()).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </td>

                  {/* Submissions Count Column */}
                  <td style={{ padding: '6px 10px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    <span style={{ background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe', padding: '1px 6px', borderRadius: '5px', fontSize: '0.7rem', fontWeight: 800 }}>
                      {app.version || 1} {(app.version || 1) === 1 ? 'Submission' : 'Submissions'}
                    </span>
                  </td>

                  {/* Current Status */}
                  <td style={{ padding: '6px 10px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {getStatusBadge(app.application_status)}
                  </td>

                  {/* Reviewer Dropdown with Custom Name Option */}
                  <td style={{ padding: '6px 10px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    <select
                      value={app.reviewed_by || 'Unassigned'}
                      onChange={(e) => handleReviewerChange(app, e.target.value)}
                      style={{
                        padding: '2px 6px',
                        borderRadius: '6px',
                        border: '1px solid #cbd5e1',
                        background: '#ffffff',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        color: app.reviewed_by ? '#0f172a' : '#64748b',
                        outline: 'none',
                        cursor: 'pointer',
                        maxWidth: '100%',
                        textOverflow: 'ellipsis'
                      }}
                    >
                      {reviewerOptions.map(rev => (
                        <option key={rev} value={rev}>{rev}</option>
                      ))}
                      <option value="__MANAGE__">⚙️ Manage Reviewers...</option>
                    </select>
                  </td>

                  {/* Actions */}
                  <td style={{ padding: '6px 10px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                    <button
                      onClick={() => handleOpenDrawer(app.id)}
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
                      <Eye size={12} /> View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Custom Reviewer Input Modal */}
      {customReviewerApp && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(4px)',
          zIndex: 999999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '20px',
            padding: '24px 28px',
            width: '100%',
            maxWidth: '420px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
          }}>
            <h3 style={{ margin: '0 0 8px', fontSize: '1.1rem', fontWeight: 900, color: '#0f172a' }}>
              Add New Reviewer
            </h3>
            <p style={{ margin: '0 0 16px', fontSize: '0.8rem', color: '#64748b' }}>
              Assign a new reviewer name for {customReviewerApp.full_name || 'Applicant'}.
            </p>
            <form onSubmit={handleCustomReviewerSubmit}>
              <input
                type="text"
                placeholder="Enter reviewer full name..."
                value={customNameInput}
                onChange={(e) => setCustomNameInput(e.target.value)}
                autoFocus
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.84rem',
                  color: '#0f172a',
                  outline: 'none',
                  boxSizing: 'border-box',
                  marginBottom: '20px'
                }}
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setCustomReviewerApp(null)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '10px',
                    border: '1px solid #cbd5e1',
                    background: '#ffffff',
                    color: '#475569',
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!customNameInput.trim()}
                  style={{
                    padding: '8px 18px',
                    borderRadius: '10px',
                    border: 'none',
                    background: customNameInput.trim() ? '#2563eb' : '#94a3b8',
                    color: '#ffffff',
                    fontWeight: 800,
                    fontSize: '0.8rem',
                    cursor: customNameInput.trim() ? 'pointer' : 'not-allowed'
                  }}
                >
                  Save & Assign
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reusable Manage Reviewers Modal */}
      <ManageReviewersModal
        isOpen={isManagingReviewers}
        onClose={() => setIsManagingReviewers(false)}
        reviewerOptions={reviewerOptions}
        onAddReviewer={handleAddReviewer}
        onDeleteReviewer={handleDeleteReviewer}
      />

      {/* Right-Side Slide-Over Detail Drawer / Centered Modal */}
      <CampusApplicationDetailsDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        applicationId={selectedAppId}
        onActionSuccess={() => {
          fetchApplications();
          fetchAnalytics();
        }}
        onOpenRejectModal={(app) => setRejectModalApp(app)}
        onOpenRequestInfoModal={(app) => setRequestInfoModalApp(app)}
      />

      {/* Mandatory Rejection Reason Modal */}
      <RejectReasonModal
        isOpen={!!rejectModalApp}
        onClose={() => setRejectModalApp(null)}
        onSubmit={handleConfirmReject}
        applicantName={rejectModalApp?.full_name}
      />

      {/* Request More Information Modal */}
      <RequestMoreInfoModal
        isOpen={!!requestInfoModalApp}
        onClose={() => setRequestInfoModalApp(null)}
        onSubmit={handleConfirmRequestInfo}
        applicantName={requestInfoModalApp?.full_name}
      />

      {/* Custom Date Range Modal for Campus Program */}
      {isCustomDateModalOpen && ReactDOM.createPortal(
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.5)',
          backdropFilter: 'blur(4px)',
          zIndex: 999999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '16px',
            padding: '24px',
            width: '100%',
            maxWidth: '380px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            border: '1px solid #e2e8f0'
          }} className="animate-scale-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Calendar size={18} color="#2563eb" />
                <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>Custom Date Range</h3>
              </div>
              <button
                onClick={() => setIsCustomDateModalOpen(false)}
                style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: '4px' }}
              >
                <X size={18} color="#64748b" />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 800, color: '#475569', marginBottom: '6px' }}>
                  Start Date
                </label>
                <input
                  type="date"
                  value={customStartDate}
                  onChange={(e) => setCustomStartDate(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.84rem',
                    color: '#0f172a',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 800, color: '#475569', marginBottom: '6px' }}>
                  End Date
                </label>
                <input
                  type="date"
                  value={customEndDate}
                  onChange={(e) => setCustomEndDate(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.84rem',
                    color: '#0f172a',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setIsCustomDateModalOpen(false)}
                  style={{
                    flex: 1,
                    padding: '8px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    background: '#ffffff',
                    color: '#475569',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setDateFilter('custom');
                    setIsCustomDateModalOpen(false);
                  }}
                  style={{
                    flex: 1,
                    padding: '8px',
                    borderRadius: '8px',
                    border: 'none',
                    background: '#2563eb',
                    color: '#ffffff',
                    fontSize: '0.82rem',
                    fontWeight: 800,
                    cursor: 'pointer'
                  }}
                >
                  Apply Filter
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

    </div>
  );
}
