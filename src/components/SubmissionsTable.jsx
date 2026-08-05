import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { Search, RefreshCw, Download, FileSpreadsheet, Calendar, User, ExternalLink, Filter, ChevronRight, X, Sparkles, Database, Layers, CheckCircle2, ZoomIn, ZoomOut, RotateCcw, Clock, Eye, Mail, Image, FileText, Phone, Trash2, Plus } from 'lucide-react';
import { fetchAllSubmissions, reviewSubmissionStatus } from '../mantra/api';
import { useToast } from './Toast';

/* Interactive Photo Preview Modal with Zoom & Drag Support */
function InteractiveImageModal({ imageUrl, onClose }) {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  const handleZoomIn = () => setScale(prev => Math.min(prev + 0.35, 4.5));
  const handleZoomOut = () => {
    setScale(prev => {
      const next = Math.max(prev - 0.35, 1);
      if (next === 1) setPosition({ x: 0, y: 0 });
      return next;
    });
  };
  const handleReset = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  // Mouse Wheel Zoom Listener
  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const handleWheel = (e) => {
      e.preventDefault();
      const zoomFactor = e.deltaY < 0 ? 0.2 : -0.2;
      setScale((prevScale) => {
        const nextScale = Math.min(Math.max(prevScale + zoomFactor, 1), 4.5);
        if (nextScale === 1) setPosition({ x: 0, y: 0 });
        return nextScale;
      });
    };

    element.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      element.removeEventListener('wheel', handleWheel);
    };
  }, []);

  const handleMouseDown = (e) => {
    if (scale <= 1) return;
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e) => {
    if (!isDragging || scale <= 1) return;
    e.preventDefault();
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return ReactDOM.createPortal(
    <div 
      ref={containerRef}
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999999,
        background: 'rgba(15, 23, 42, 0.88)',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        userSelect: 'none'
      }}
    >
      {/* Top Floating Control Toolbar */}
      <div 
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'absolute',
          top: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          background: '#ffffff',
          padding: '8px 20px',
          borderRadius: '40px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
          border: '1px solid #e2e8f0',
          zIndex: 10
        }}
      >
        <button
          onClick={handleZoomOut}
          disabled={scale <= 1}
          title="Zoom Out"
          style={{
            background: 'none', border: 'none', cursor: scale <= 1 ? 'not-allowed' : 'pointer',
            opacity: scale <= 1 ? 0.35 : 1, display: 'flex', alignItems: 'center', color: '#0f172a', padding: '4px'
          }}
        >
          <ZoomOut size={18} />
        </button>

        <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0f172a', minWidth: '45px', textAlign: 'center' }}>
          {Math.round(scale * 100)}%
        </span>

        <button
          onClick={handleZoomIn}
          disabled={scale >= 4.5}
          title="Zoom In"
          style={{
            background: 'none', border: 'none', cursor: scale >= 4.5 ? 'not-allowed' : 'pointer',
            opacity: scale >= 4.5 ? 0.35 : 1, display: 'flex', alignItems: 'center', color: '#0f172a', padding: '4px'
          }}
        >
          <ZoomIn size={18} />
        </button>

        <div style={{ width: '1px', height: '16px', background: '#cbd5e1' }} />

        <button
          onClick={handleReset}
          title="Reset View"
          style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#64748b', padding: '4px' }}
        >
          <RotateCcw size={16} />
        </button>

        <button
          onClick={onClose}
          title="Close Preview"
          style={{
            background: '#ef4444', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center',
            justifyContent: 'center', width: '26px', height: '26px', borderRadius: '50%', color: '#ffffff', marginLeft: '4px'
          }}
        >
          <X size={15} />
        </button>
      </div>

      {/* Interactive Image Display Area */}
      <div
        onClick={(e) => e.stopPropagation()}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{
          width: '90vw',
          height: '82vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          cursor: scale > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default'
        }}
      >
        <img
          src={imageUrl}
          alt="Proof Preview"
          draggable={false}
          style={{
            maxHeight: '100%',
            maxWidth: '100%',
            objectFit: 'contain',
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
            transition: isDragging ? 'none' : 'transform 0.15s ease-out',
            borderRadius: '10px',
            boxShadow: '0 25px 50px rgba(0,0,0,0.5)'
          }}
        />
      </div>
    </div>,
    document.body
  );
}

export default function SubmissionsTable() {
  const { showToast } = useToast();
  const [submissions, setSubmissions] = useState([]);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, totalRecords: 0 });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedActivity, setSelectedActivity] = useState('all');
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const loadSubmissions = async (page = 1) => {
    setLoading(true);
    const res = await fetchAllSubmissions({
      page,
      limit: 50,
      search: searchQuery
    });
    setLoading(false);

    if (res.success) {
      setSubmissions(res.data || []);
      if (res.pagination) {
        setPagination(res.pagination);
      }
    } else {
      showToast(res.error || 'Failed to load submissions from server', 'error');
    }
  };

  useEffect(() => {
    loadSubmissions(1);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadSubmissions(1);
  };

  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedReviewer, setSelectedReviewer] = useState('all');
  const [reviewerOptions, setReviewerOptions] = useState(['Unassigned', 'Ketan', 'Team Member', 'Pooja', 'Mantra Admin']);
  const [isManagingReviewers, setIsManagingReviewers] = useState(false);
  const [newReviewerName, setNewReviewerName] = useState('');

  // Extract unique reviewers from dataset
  useEffect(() => {
    if (submissions && submissions.length > 0) {
      const existing = submissions.map(s => s.reviewed_by).filter(r => r && r.trim() && r !== 'Unassigned');
      setReviewerOptions(prev => Array.from(new Set([...prev, ...existing])));
    }
  }, [submissions]);

  const handleAddReviewer = (nameToAdd) => {
    const trimmed = nameToAdd ? nameToAdd.trim() : newReviewerName.trim();
    if (!trimmed) return;
    if (reviewerOptions.includes(trimmed)) {
      showToast(`Reviewer '${trimmed}' already exists`, 'info');
      return;
    }
    setReviewerOptions(prev => [...prev, trimmed]);
    setNewReviewerName('');
    showToast(`Added reviewer '${trimmed}'`, 'success');
  };

  const handleDeleteReviewer = async (nameToDelete) => {
    if (nameToDelete === 'Unassigned') {
      showToast('Cannot delete default Unassigned option', 'error');
      return;
    }

    // 1. Remove from options list
    setReviewerOptions(prev => prev.filter(r => r !== nameToDelete));
    if (selectedReviewer === nameToDelete) {
      setSelectedReviewer('all');
    }

    // 2. Re-assign any submissions assigned to this deleted reviewer back to 'Unassigned'
    const assignedSubmissions = submissions.filter(s => s.reviewed_by === nameToDelete);
    if (assignedSubmissions.length > 0) {
      setSubmissions(prev => prev.map(s => s.reviewed_by === nameToDelete ? { ...s, reviewed_by: 'Unassigned' } : s));
      for (const sub of assignedSubmissions) {
        try {
          await reviewSubmissionStatus(sub.id, undefined, '', 'Unassigned');
        } catch (e) {
          console.error('Failed to reset reviewer for submission:', sub.id, e);
        }
      }
    }

    showToast(`Deleted reviewer '${nameToDelete}'`, 'success');
  };

  // Counts calculation
  const pendingCount = submissions.filter(s => (!s.status || s.status === 'pending')).length;
  const underReviewCount = submissions.filter(s => s.status === 'under_review').length;
  const reviewedCount = submissions.filter(s => (s.status === 'reviewed' || s.status === 'approved')).length;
  const mailSentCount = submissions.filter(s => s.status === 'mail_sent').length;

  const STATUS_CONFIG = {
    pending: { label: 'Pending', bg: '#fef3c7', border: '#fde68a', color: '#b45309' },
    under_review: { label: 'Under Review', bg: '#ffedd5', border: '#fed7aa', color: '#c2410c' },
    reviewed: { label: 'Reviewed', bg: '#dcfce7', border: '#bbf7d0', color: '#15803d' },
    mail_sent: { label: 'Mail Sent', bg: '#ffffff', border: '#cbd5e1', color: '#334155' },
  };

  const handleStatusChange = async (submissionId, newStatus) => {
    try {
      setSubmissions(prev => prev.map(s => s.id === submissionId ? { ...s, status: newStatus } : s));
      const res = await reviewSubmissionStatus(submissionId, newStatus);
      if (res.success || res.data || res.status) {
        showToast(`Status updated to '${STATUS_CONFIG[newStatus]?.label || newStatus}'`, 'success');
      }
    } catch (err) {
      console.error('[SubmissionsTable] Error updating status:', err);
      showToast('Failed to update status', 'error');
    }
  };

  const handleReviewerChange = async (submissionId, newReviewer) => {
    if (newReviewer === '__MANAGE__') {
      setIsManagingReviewers(true);
      return;
    }
    let finalReviewer = newReviewer;
    if (newReviewer === '__ADD_NEW__') {
      const customName = prompt('Enter Reviewer Name:');
      if (!customName || !customName.trim()) return;
      finalReviewer = customName.trim();
      handleAddReviewer(finalReviewer);
    }

    try {
      setSubmissions(prev => prev.map(s => s.id === submissionId ? { ...s, reviewed_by: finalReviewer } : s));
      await reviewSubmissionStatus(submissionId, undefined, '', finalReviewer);
      showToast(`Assigned reviewer: ${finalReviewer}`, 'success');
    } catch (err) {
      console.error('[SubmissionsTable] Error updating reviewer:', err);
      showToast('Failed to update reviewer', 'error');
    }
  };

  // Filter submissions by selected activity, status, and reviewer
  const filteredSubmissions = submissions.filter(item => {
    if (selectedActivity !== 'all' && item.lesson_id !== selectedActivity && item.submission_type !== selectedActivity) {
      return false;
    }
    const itemStatus = (item.status || 'pending').toLowerCase();
    if (selectedStatus !== 'all') {
      if (selectedStatus === 'reviewed' && (itemStatus === 'reviewed' || itemStatus === 'approved')) {
        // match
      } else if (itemStatus !== selectedStatus) {
        return false;
      }
    }
    const itemReviewer = item.reviewed_by || 'Unassigned';
    if (selectedReviewer !== 'all') {
      if (selectedReviewer === 'Unassigned' && (itemReviewer === 'Unassigned' || !item.reviewed_by)) {
        // match
      } else if (itemReviewer.toLowerCase() !== selectedReviewer.toLowerCase()) {
        return false;
      }
    }
    return true;
  });

  // Unique activity list for filter dropdown
  const uniqueActivities = Array.from(new Set(submissions.map(s => JSON.stringify({ lessonId: s.lesson_id, title: s.activity_title }))))
    .map(str => JSON.parse(str));

  // Exclude redundant user info, P/V links & technical file upload metadata keys from main table
  const REDUNDANT_KEYS = [
    'fullName', 'name', 'email', 'phone', 'phoneNumber', 'phone_number', 'mobile', 'contact',
    'submittedAt', 'submitted_at', 'uploadedAt', 'uploaded_at', 'submitted_date', 'created_at', 'updated_at', 'service',
    'fileName', 'file_name',
    'fileSize', 'file_size', 'bytes',
    'fileType', 'file_type', 'format',
    'publicId', 'public_id',
    'screenshotUrl', 'imageUrl', 'url',
    'videoPublicId', 'country', 'countryCode', 'consent',
    'profileUrl', 'profile_url', 'videoUrl'
  ];

  const PROOF_KEYS = ['screenshotUrl', 'imageUrl', 'url', 'file', 'proof'];

  const getDynamicFormKeys = () => {
    const keys = new Set();
    submissions.forEach(sub => {
      const data = sub.form_data || sub.submission_data || {};
      Object.keys(data).forEach(k => {
        if (!REDUNDANT_KEYS.includes(k)) {
          keys.add(k);
        }
      });
    });
    const keysArr = Array.from(keys);
    const regularKeys = keysArr.filter(k => !PROOF_KEYS.includes(k));
    const proofKeys = keysArr.filter(k => PROOF_KEYS.includes(k));
    
    return [...regularKeys, ...proofKeys];
  };

  const dynamicKeys = getDynamicFormKeys();

  const formatHeaderLabel = (key) => {
    if (key.toLowerCase() === 'city') return 'Country';
    if (key.toLowerCase() === 'country') return 'Country';
    if (key === 'videoUrl') return 'Video';
    if (PROOF_KEYS.includes(key)) return 'Uploaded Proof';
    return key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    try {
      return new Date(dateStr).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return dateStr;
    }
  };

  const exportToCSV = () => {
    if (!filteredSubmissions || filteredSubmissions.length === 0) {
      showToast('No submission data available to export', 'error');
      return;
    }

    const headers = ['User Name', 'Email', 'Phone', 'Service', 'Status', 'Reviewed By', ...dynamicKeys.map(formatHeaderLabel), 'Activity Title', 'Submitted At'];
    const csvRows = [headers.join(',')];

    filteredSubmissions.forEach(item => {
      const data = item.form_data || item.submission_data || {};
      const fullName = data.fullName || data.name || item.user_id || '';
      const email = data.email || '';
      const phone = data.phone || data.phoneNumber || data.phone_number || data.mobile || '';
      const service = item.service || data.service || '';
      const statusLabel = STATUS_CONFIG[item.status || 'pending']?.label || item.status || 'Pending';
      const reviewer = item.reviewed_by || 'Unassigned';
      const activity = item.activity_title || '';
      const submittedAt = formatDate(item.created_at || data.submittedAt || data.uploadedAt);

      const formValues = dynamicKeys.map(key => {
        const val = data[key];
        if (!val) return '""';
        return `"${String(val).replace(/"/g, '""')}"`;
      });

      const row = [
        `"${fullName.replace(/"/g, '""')}"`,
        `"${email.replace(/"/g, '""')}"`,
        `"${phone.replace(/"/g, '""')}"`,
        `"${service.replace(/"/g, '""')}"`,
        `"${statusLabel.replace(/"/g, '""')}"`,
        `"${reviewer.replace(/"/g, '""')}"`,
        ...formValues,
        `"${activity.replace(/"/g, '""')}"`,
        `"${submittedAt.replace(/"/g, '""')}"`
      ];
      csvRows.push(row.join(','));
    });
    const csvContent = '\uFEFF' + csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `operations_activity_submissions_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('Exported Operations CSV successfully!', 'success');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
      
      {/* Top Status Metrics Cards (Ultra-Compact) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '8px' }}>
        
        {/* Metric 1: Pending */}
        <div style={{ background: '#fffbeb', borderRadius: '8px', border: '1px solid #fde68a', padding: '6px 10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '26px', height: '26px', borderRadius: '6px', background: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Clock size={13} color="#b45309" />
          </div>
          <div>
            <div style={{ fontSize: '0.62rem', fontWeight: 800, color: '#b45309', textTransform: 'uppercase', letterSpacing: '0.03em' }}>Pending</div>
            <div style={{ fontSize: '0.98rem', fontWeight: 900, color: '#92400e', lineHeight: 1, marginTop: '1px' }}>{pendingCount}</div>
          </div>
        </div>

        {/* Metric 2: Under Review */}
        <div style={{ background: '#fff7ed', borderRadius: '8px', border: '1px solid #fed7aa', padding: '6px 10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '26px', height: '26px', borderRadius: '6px', background: '#ffedd5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Eye size={13} color="#c2410c" />
          </div>
          <div>
            <div style={{ fontSize: '0.62rem', fontWeight: 800, color: '#c2410c', textTransform: 'uppercase', letterSpacing: '0.03em' }}>Under Review</div>
            <div style={{ fontSize: '0.98rem', fontWeight: 900, color: '#9a3412', lineHeight: 1, marginTop: '1px' }}>{underReviewCount}</div>
          </div>
        </div>

        {/* Metric 3: Reviewed */}
        <div style={{ background: '#f0fdf4', borderRadius: '8px', border: '1px solid #bbf7d0', padding: '6px 10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '26px', height: '26px', borderRadius: '6px', background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <CheckCircle2 size={13} color="#15803d" />
          </div>
          <div>
            <div style={{ fontSize: '0.62rem', fontWeight: 800, color: '#15803d', textTransform: 'uppercase', letterSpacing: '0.03em' }}>Reviewed</div>
            <div style={{ fontSize: '0.98rem', fontWeight: 900, color: '#166534', lineHeight: 1, marginTop: '1px' }}>{reviewedCount}</div>
          </div>
        </div>

        {/* Metric 4: Mail Sent */}
        <div style={{ background: '#ffffff', borderRadius: '8px', border: '1px solid #cbd5e1', padding: '6px 10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '26px', height: '26px', borderRadius: '6px', background: '#f8fafc', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Mail size={13} color="#334155" />
          </div>
          <div>
            <div style={{ fontSize: '0.62rem', fontWeight: 800, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.03em' }}>Mail Sent</div>
            <div style={{ fontSize: '0.98rem', fontWeight: 900, color: '#0f172a', lineHeight: 1, marginTop: '1px' }}>{mailSentCount}</div>
          </div>
        </div>

      </div>

      {/* Sleek Action & Filter Bar (Compact Height) */}
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
            <FileSpreadsheet size={15} style={{ display: 'block', margin: 'auto' }} />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.01em' }}>
              Submission Portal
            </h3>
            <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '0px' }}>
              Showing <strong style={{ color: '#2563eb' }}>{filteredSubmissions.length}</strong> records
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          
          {/* Status Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#f8fafc', padding: '4px 8px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
            <Filter size={12} color="#64748b" />
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              style={{ border: 'none', background: 'transparent', fontSize: '0.76rem', color: '#1e293b', fontWeight: 700, outline: 'none', cursor: 'pointer' }}
            >
              <option value="all">All Statuses ({submissions.length})</option>
              <option value="pending">Pending ({pendingCount})</option>
              <option value="under_review">Under Review ({underReviewCount})</option>
              <option value="reviewed">Reviewed ({reviewedCount})</option>
              <option value="mail_sent">Mail Sent ({mailSentCount})</option>
            </select>
          </div>

          {/* Reviewed By Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#f8fafc', padding: '4px 8px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
            <User size={12} color="#64748b" />
            <select
              value={selectedReviewer}
              onChange={(e) => {
                if (e.target.value === '__MANAGE__') {
                  setIsManagingReviewers(true);
                } else {
                  setSelectedReviewer(e.target.value);
                }
              }}
              style={{ border: 'none', background: 'transparent', fontSize: '0.76rem', color: '#1e293b', fontWeight: 700, outline: 'none', cursor: 'pointer' }}
            >
              <option value="all">All Reviewers</option>
              {reviewerOptions.map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
              <option value="__MANAGE__">⚙️ Manage Reviewers...</option>
            </select>
          </div>

          {/* Activity Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#f8fafc', padding: '4px 8px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
            <Layers size={12} color="#64748b" />
            <select
              value={selectedActivity}
              onChange={(e) => setSelectedActivity(e.target.value)}
              style={{ border: 'none', background: 'transparent', fontSize: '0.76rem', color: '#1e293b', fontWeight: 700, outline: 'none', cursor: 'pointer' }}
            >
              <option value="all">All Activities</option>
              {uniqueActivities.map(act => (
                <option key={act.lessonId} value={act.lessonId}>{act.title}</option>
              ))}
            </select>
          </div>

          {/* Search Input */}
          <form onSubmit={handleSearchSubmit} style={{ position: 'relative', width: '150px' }}>
            <Search size={12} style={{ position: 'absolute', left: '8px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                height: '28px',
                padding: '0 8px 0 24px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                fontSize: '0.76rem',
                outline: 'none',
                background: '#f8fafc',
                color: '#0f172a'
              }}
            />
          </form>

          {/* Refresh Button */}
          <button
            onClick={() => loadSubmissions(pagination.currentPage)}
            disabled={loading}
            style={{
              height: '28px',
              padding: '0 10px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              background: '#ffffff',
              color: '#334155',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '0.76rem',
              fontWeight: 700
            }}
          >
            <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>

          {/* Export Button */}
          <button
            onClick={exportToCSV}
            style={{
              height: '28px',
              padding: '0 12px',
              borderRadius: '8px',
              border: 'none',
              background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
              color: '#ffffff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              fontSize: '0.76rem',
              fontWeight: 800,
              boxShadow: '0 2px 8px rgba(37, 99, 235, 0.25)'
            }}
          >
            <Download size={12} /> Export CSV
          </button>

        </div>

      </div>

      {/* Main Operations Table (Compact Rows) */}
      <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 2px 10px rgba(0,0,0,0.02)', overflow: 'hidden' }}>
        <table style={{ width: '100%', tableLayout: 'fixed', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.76rem' }}>
          <thead>
            <tr style={{ background: '#043263', borderBottom: '1px solid #03254c', color: '#ffffff', fontWeight: 800, textTransform: 'uppercase', fontSize: '0.68rem', letterSpacing: '0.04em' }}>
              <th style={{ padding: '10px 14px', width: '18%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>User / Email</th>
              <th style={{ padding: '10px 14px', width: '10%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Service</th>
              <th style={{ padding: '10px 14px', width: '12%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Country</th>
              
              {/* Dynamically Generated Form Data Columns */}
              {dynamicKeys.map(key => (
                <th key={key} style={{ padding: '10px 14px', width: `${Math.floor(18 / Math.max(1, dynamicKeys.length))}%`, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {formatHeaderLabel(key)}
                </th>
              ))}

              <th style={{ padding: '10px 14px', width: '16%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Activity</th>
              <th style={{ padding: '10px 14px', width: '14%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Submitted At</th>
              <th style={{ padding: '10px 14px', width: '10%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Status</th>
              <th style={{ padding: '10px 14px', width: '12%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Reviewed By</th>
              <th style={{ padding: '10px 14px', width: '10%', whiteSpace: 'nowrap', textAlign: 'right' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7 + dynamicKeys.length} style={{ textAlign: 'center', padding: '24px 12px', color: '#64748b' }}>
                  <RefreshCw size={18} style={{ margin: '0 auto 6px', color: '#2563eb' }} className="animate-spin" />
                  <div style={{ fontWeight: 600, fontSize: '0.76rem' }}>Loading operations data...</div>
                </td>
              </tr>
            ) : filteredSubmissions.length === 0 ? (
              <tr>
                <td colSpan={7 + dynamicKeys.length} style={{ textAlign: 'center', padding: '28px 12px', color: '#64748b' }}>
                  <FileSpreadsheet size={26} style={{ margin: '0 auto 6px', color: '#cbd5e1' }} />
                  <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.82rem' }}>No Submissions Found</div>
                  <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '2px' }}>Try adjusting your filters or search terms</div>
                </td>
              </tr>
            ) : (
              filteredSubmissions.map((item) => {
                const data = item.form_data || item.submission_data || {};
                const fullName = data.fullName || data.name || item.user_id;
                const email = data.email;
                const country = data.country || data.countryName || data.city || 'United States';
                const currentStatus = (item.status || 'pending').toLowerCase();
                const statusStyle = STATUS_CONFIG[currentStatus] || STATUS_CONFIG.pending;
                const currentReviewer = item.reviewed_by || 'Unassigned';

                return (
                  <tr 
                    key={item.id} 
                    style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.15s ease' }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    
                    {/* Column 1: User / Email */}
                    <td style={{ padding: '10px 14px', verticalAlign: 'middle', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={`${fullName} (${email || ''})`}>
                      <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.78rem', overflow: 'hidden', textOverflow: 'ellipsis' }}>{fullName}</div>
                      {email && <div style={{ fontSize: '0.68rem', color: '#64748b', marginTop: '0px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{email}</div>}
                    </td>

                    {/* Column 2: Service Context Badge */}
                    <td style={{ padding: '10px 14px', verticalAlign: 'middle', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {item.service ? (
                        <span style={{ 
                          padding: '1px 6px', 
                          borderRadius: '4px', 
                          background: 'linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%)', 
                          color: '#7e22ce', 
                          border: '1px solid #e9d5ff',
                          fontSize: '0.68rem', 
                          fontWeight: 700, 
                          textTransform: 'capitalize',
                          display: 'inline-block'
                        }}>
                          {item.service}
                        </span>
                      ) : (
                        <span style={{ color: '#cbd5e1', fontSize: '0.72rem' }}>—</span>
                      )}
                    </td>

                    {/* Column 3: Country */}
                    <td style={{ padding: '10px 14px', verticalAlign: 'middle', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      <span style={{ fontSize: '0.76rem', fontWeight: 700, color: '#334155' }}>
                        {country}
                      </span>
                    </td>

                    {/* Dynamic Form Field Columns */}
                    {dynamicKeys.map(key => {
                      const val = data[key];
                      const isImage = PROOF_KEYS.includes(key);

                      if (isImage && val) {
                        const isVideo = key === 'videoUrl' || (typeof val === 'string' && (val.includes('/video/') || val.endsWith('.mp4') || val.endsWith('.webm')));
                        return (
                          <td key={key} style={{ padding: '10px 14px', verticalAlign: 'middle', whiteSpace: 'nowrap' }}>
                            {isVideo ? (
                              <a
                                href={val}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                  padding: '2px 6px',
                                  borderRadius: '4px',
                                  border: '1px solid #bfdbfe',
                                  background: '#eff6ff',
                                  color: '#2563eb',
                                  fontSize: '0.68rem',
                                  fontWeight: 700,
                                  cursor: 'pointer',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '3px',
                                  textDecoration: 'none'
                                }}
                              >
                                <ExternalLink size={11} /> Video
                              </a>
                            ) : (
                              <button
                                onClick={() => setPreviewImage(val)}
                                style={{
                                  padding: '2px 6px',
                                  borderRadius: '4px',
                                  border: '1px solid #e9d5ff',
                                  background: '#faf5ff',
                                  color: '#7e22ce',
                                  fontSize: '0.68rem',
                                  fontWeight: 700,
                                  cursor: 'pointer',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '3px'
                                }}
                              >
                                <Image size={11} /> Proof
                              </button>
                            )}
                          </td>
                        );
                      }

                      return (
                        <td key={key} style={{ padding: '10px 14px', verticalAlign: 'middle', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={String(val || '')}>
                          {val !== undefined && val !== null && val !== '' ? (
                            <span style={{ color: '#334155', fontWeight: 600 }}>{String(val)}</span>
                          ) : (
                            <span style={{ color: '#cbd5e1' }}>—</span>
                          )}
                        </td>
                      );
                    })}

                    {/* Activity Name */}
                    <td style={{ padding: '10px 14px', verticalAlign: 'middle', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={item.activity_title}>
                      <div style={{ fontSize: '0.74rem', fontWeight: 600, color: '#475569', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {(item.activity_title === 'TherapyMantra' || item.lesson_id === 'grow-your-practice' || item.lesson_id === 'market-yourself' || item.activity_title?.toLowerCase().includes('therapymantra')) ? (
                          <a 
                            href={`/task/market-yourself/${encodeURIComponent(item.service || 'therapy')}`} 
                            style={{ color: '#2563eb', textDecoration: 'none', fontWeight: 700 }}
                          >
                            Marketing(TM)
                          </a>
                        ) : (
                          item.activity_title
                        )}
                      </div>
                    </td>

                    {/* Submitted At */}
                    <td style={{ padding: '10px 14px', verticalAlign: 'middle', whiteSpace: 'nowrap', fontSize: '0.74rem', color: '#64748b', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {formatDate(item.created_at || data.submittedAt || data.uploadedAt)}
                    </td>

                    {/* Status Column with Interactive Selector */}
                    <td style={{ padding: '10px 14px', verticalAlign: 'middle', whiteSpace: 'nowrap' }}>
                      <select
                        value={currentStatus === 'approved' ? 'reviewed' : currentStatus}
                        onChange={(e) => handleStatusChange(item.id, e.target.value)}
                        style={{
                          padding: '2px 6px',
                          borderRadius: '6px',
                          border: `1px solid ${statusStyle.border}`,
                          background: statusStyle.bg,
                          color: statusStyle.color,
                          fontWeight: 800,
                          fontSize: '0.72rem',
                          cursor: 'pointer',
                          outline: 'none'
                        }}
                      >
                        <option value="pending">Pending</option>
                        <option value="under_review">Under Review</option>
                        <option value="reviewed">Reviewed</option>
                        <option value="mail_sent">Mail Sent</option>
                      </select>
                    </td>

                    {/* Reviewed By Column with Interactive Selector */}
                    <td style={{ padding: '6px 10px', verticalAlign: 'middle', whiteSpace: 'nowrap' }}>
                      <select
                        value={currentReviewer}
                        onChange={(e) => handleReviewerChange(item.id, e.target.value)}
                        style={{
                          padding: '2px 6px',
                          borderRadius: '6px',
                          border: '1px solid #cbd5e1',
                          background: currentReviewer !== 'Unassigned' ? '#eff6ff' : '#f8fafc',
                          color: currentReviewer !== 'Unassigned' ? '#1d4ed8' : '#64748b',
                          fontWeight: 700,
                          fontSize: '0.72rem',
                          cursor: 'pointer',
                          outline: 'none',
                          maxWidth: '110px'
                        }}
                      >
                        {reviewerOptions.map(r => (
                          <option key={r} value={r}>{r}</option>
                        ))}
                        <option value="__ADD_NEW__">+ Add Reviewer...</option>
                        <option value="__MANAGE__">⚙️ Manage / Delete Reviewers...</option>
                      </select>
                    </td>

                    {/* Action View Button */}
                    <td style={{ padding: '6px 10px', verticalAlign: 'middle', textAlign: 'right', whiteSpace: 'nowrap' }}>
                      <button
                        onClick={() => setSelectedSubmission(item)}
                        style={{
                          padding: '3px 8px',
                          borderRadius: '6px',
                          border: '1px solid #cbd5e1',
                          background: '#ffffff',
                          color: '#2563eb',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '2px'
                        }}
                      >
                        View <ChevronRight size={11} />
                      </button>
                    </td>

                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL 1: Interactive Zoom & Drag Image Proof Viewer */}
      {previewImage && (
        <InteractiveImageModal 
          imageUrl={previewImage} 
          onClose={() => setPreviewImage(null)} 
        />
      )}

      {/* MODAL 2: Premium Centered Screen Record Popup Portal */}
      {selectedSubmission && ReactDOM.createPortal(
        <div 
          onClick={() => setSelectedSubmission(null)}
          style={{ 
            position: 'fixed', 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0, 
            width: '100vw', 
            height: '100vh', 
            backgroundColor: 'rgba(15, 23, 42, 0.75)', 
            backdropFilter: 'blur(8px)',
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            zIndex: 9999999, 
            padding: '20px'
          }}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{ 
              background: '#ffffff', 
              borderRadius: '20px', 
              width: '100%', 
              maxWidth: '560px', 
              maxHeight: '85vh', 
              display: 'flex', 
              flexDirection: 'column', 
              padding: '0', 
              boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.4)',
              border: '1px solid #e2e8f0',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* Gradient Top Accent Bar */}
            <div style={{ height: '4px', background: 'linear-gradient(90deg, #2563eb, #7c3aed, #ec4899)' }}></div>
            
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <FileText size={16} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.02rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.01em' }}>
                    Submission Details
                  </h3>
                  <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '1px' }}>
                    ID: #{String(selectedSubmission.id).slice(-8)}
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setSelectedSubmission(null)} 
                style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '50%', width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b', transition: 'all 0.15s' }}
              >
                <X size={15} />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '14px', padding: '16px 20px', background: '#fcfcfd' }}>
              
              {/* Card 1: User Profile Header Card */}
              {(() => {
                const data = selectedSubmission.form_data || selectedSubmission.submission_data || {};
                const fullName = data.fullName || data.name || selectedSubmission.user_id || 'User';
                const email = data.email || '';
                const phone = data.phone || data.phoneNumber || data.phone_number || data.mobile || data.contact || '';
                const submittedDate = formatDate(selectedSubmission.created_at || data.submittedAt || data.uploadedAt);
                const currentStatus = (selectedSubmission.status || 'pending').toLowerCase();
                const statusStyle = STATUS_CONFIG[currentStatus] || STATUS_CONFIG.pending;
                const reviewer = selectedSubmission.reviewed_by || 'Unassigned';
                const initials = fullName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'U';

                return (
                  <>
                    <div style={{ background: '#ffffff', borderRadius: '12px', padding: '14px 16px', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)', color: '#1d4ed8', fontSize: '1rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #bfdbfe', flexShrink: 0 }}>
                          {initials}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <h4 style={{ margin: 0, fontSize: '0.98rem', fontWeight: 800, color: '#0f172a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {fullName}
                          </h4>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: '4px', fontSize: '0.76rem', color: '#475569' }}>
                            {email && (
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#2563eb', fontWeight: 600 }}>
                                <Mail size={12} color="#3b82f6" /> {email}
                              </span>
                            )}
                            {phone && (
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#334155', fontWeight: 600 }}>
                                <Phone size={12} color="#64748b" /> {phone}
                              </span>
                            )}
                          </div>
                        </div>
                        {selectedSubmission.service && (
                          <span style={{ padding: '3px 10px', borderRadius: '6px', background: '#faf5ff', color: '#7e22ce', border: '1px solid #e9d5ff', fontSize: '0.72rem', fontWeight: 700, textTransform: 'capitalize' }}>
                            {selectedSubmission.service}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Card 2: Activity & Review Status Details */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      
                      <div style={{ background: '#ffffff', padding: '12px 14px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                        <div style={{ fontSize: '0.64rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Activity Name</div>
                        <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0f172a', marginTop: '3px' }}>{selectedSubmission.activity_title}</div>
                        <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Clock size={11} /> {submittedDate}
                        </div>
                      </div>

                      <div style={{ background: '#ffffff', padding: '12px 14px', borderRadius: '10px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '6px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <span style={{ fontSize: '0.64rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Status:</span>
                          <span style={{ padding: '2px 8px', borderRadius: '6px', border: `1px solid ${statusStyle.border}`, background: statusStyle.bg, color: statusStyle.color, fontWeight: 800, fontSize: '0.72rem' }}>
                            {statusStyle.label}
                          </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <span style={{ fontSize: '0.64rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Reviewed By:</span>
                          <span style={{ padding: '2px 8px', borderRadius: '6px', border: '1px solid #cbd5e1', background: reviewer !== 'Unassigned' ? '#eff6ff' : '#f8fafc', color: reviewer !== 'Unassigned' ? '#1d4ed8' : '#64748b', fontWeight: 700, fontSize: '0.72rem' }}>
                            {reviewer}
                          </span>
                        </div>
                      </div>

                    </div>
                  </>
                );
              })()}

              {/* Card 3: Form Response Data */}
              {(() => {
                const formDataEntries = Object.entries(selectedSubmission.form_data || selectedSubmission.submission_data || {})
                  .filter(([k]) => !REDUNDANT_KEYS.includes(k) && !PROOF_KEYS.includes(k));

                if (formDataEntries.length === 0) return null;

                return (
                  <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '14px 16px' }}>
                    <h4 style={{ margin: '0 0 10px', fontSize: '0.76rem', color: '#0f172a', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      Form Fields & Responses
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {formDataEntries.map(([key, val]) => (
                        <div key={key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc', padding: '8px 12px', borderRadius: '8px', border: '1px solid #f1f5f9', fontSize: '0.78rem' }}>
                          <span style={{ fontWeight: 700, color: '#475569' }}>
                            {formatHeaderLabel(key)}:
                          </span>
                          <span style={{ color: '#0f172a', fontWeight: 600, textAlign: 'right', wordBreak: 'break-word', marginLeft: '12px' }}>
                            {String(val)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}

              {/* Card 4: Proof Screenshot Attachment */}
              {(selectedSubmission.form_data?.screenshotUrl || selectedSubmission.form_data?.imageUrl) && (
                <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '14px 16px' }}>
                  <h4 style={{ margin: '0 0 10px', fontSize: '0.76rem', color: '#0f172a', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Uploaded Proof Screenshot
                  </h4>
                  <div style={{ background: '#faf5ff', padding: '10px 14px', borderRadius: '10px', border: '1px solid #e9d5ff', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <img 
                        src={selectedSubmission.form_data?.screenshotUrl || selectedSubmission.form_data?.imageUrl} 
                        alt="Proof" 
                        onClick={() => setPreviewImage(selectedSubmission.form_data?.screenshotUrl || selectedSubmission.form_data?.imageUrl)}
                        style={{ width: '60px', height: '44px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #cbd5e1', cursor: 'pointer' }}
                      />
                      <div>
                        <div style={{ fontSize: '0.76rem', fontWeight: 700, color: '#7e22ce' }}>Image Proof Uploaded</div>
                        <div style={{ fontSize: '0.68rem', color: '#64748b', marginTop: '1px' }}>Click thumbnail to open zoom viewer</div>
                      </div>
                    </div>
                    <button 
                      type="button"
                      onClick={() => setPreviewImage(selectedSubmission.form_data?.screenshotUrl || selectedSubmission.form_data?.imageUrl)} 
                      style={{ padding: '4px 10px', borderRadius: '6px', border: '1px solid #e9d5ff', background: '#ffffff', color: '#7e22ce', fontWeight: 700, fontSize: '0.74rem', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}
                    >
                      <Image size={12} /> View Image <ExternalLink size={11} />
                    </button>
                  </div>
                </div>
              )}

              {/* Card 5: Uploaded Video Attachment (Always visible) */}
              {(() => {
                const fd = selectedSubmission.form_data || selectedSubmission.submission_data || {};
                const vUrl = selectedSubmission.videoUrl || selectedSubmission.video_url || selectedSubmission.video || fd.videoUrl || fd.video_url || fd.videoLink || fd.url || fd.file || '';
                return (
                  <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '14px 16px' }}>
                    <h4 style={{ margin: '0 0 10px', fontSize: '0.76rem', color: '#0f172a', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      Uploaded Video
                    </h4>
                    {vUrl ? (
                      <>
                        <div style={{ borderRadius: '10px', overflow: 'hidden', border: '1px solid #e2e8f0', background: '#000000' }}>
                          <video
                            src={vUrl}
                            controls
                            preload="metadata"
                            style={{ width: '100%', maxHeight: '260px', display: 'block' }}
                          />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '10px', background: '#eff6ff', padding: '8px 12px', borderRadius: '8px', border: '1px solid #bfdbfe' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: '#dbeafe', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <Eye size={14} />
                            </div>
                            <div>
                              <div style={{ fontSize: '0.74rem', fontWeight: 700, color: '#1d4ed8' }}>Provider Introduction Video</div>
                              <div style={{ fontSize: '0.66rem', color: '#64748b', marginTop: '1px' }}>Hosted on Cloudinary</div>
                            </div>
                          </div>
                          <a
                            href={vUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ padding: '4px 10px', borderRadius: '6px', border: '1px solid #bfdbfe', background: '#ffffff', color: '#2563eb', fontWeight: 700, fontSize: '0.74rem', display: 'inline-flex', alignItems: 'center', gap: '4px', textDecoration: 'none', cursor: 'pointer' }}
                          >
                            <ExternalLink size={11} /> Open in New Tab
                          </a>
                        </div>
                      </>
                    ) : (
                      <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '10px', border: '1px dashed #cbd5e1', textAlign: 'center' }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#f1f5f9', color: '#94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px' }}>
                          <Eye size={18} />
                        </div>
                        <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b' }}>No Video Uploaded</div>
                        <div style={{ fontSize: '0.68rem', color: '#94a3b8', marginTop: '2px' }}>Provider has not submitted an introduction video yet</div>
                      </div>
                    )}
                  </div>
                );
              })()}

            </div>

            {/* Modal Footer */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '12px 20px', background: '#ffffff', borderTop: '1px solid #e2e8f0' }}>
              <button 
                onClick={() => setSelectedSubmission(null)} 
                style={{ padding: '6px 20px', borderRadius: '8px', border: 'none', background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)', color: '#ffffff', fontWeight: 800, cursor: 'pointer', fontSize: '0.78rem', boxShadow: '0 2px 8px rgba(37,99,235,0.2)' }}
              >
                Close Record
              </button>
            </div>

          </div>
        </div>,
        document.body
      )}

      {/* MODAL 3: Manage & Delete Reviewers Modal */}
      {isManagingReviewers && ReactDOM.createPortal(
        <div 
          onClick={() => setIsManagingReviewers(false)} 
          style={{ 
            position: 'fixed', 
            inset: 0, 
            background: 'rgba(15, 23, 42, 0.65)', 
            backdropFilter: 'blur(6px)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            zIndex: 9999999, 
            padding: '20px'
          }}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{ 
              background: '#ffffff', 
              borderRadius: '16px', 
              width: '100%', 
              maxWidth: '440px', 
              display: 'flex', 
              flexDirection: 'column', 
              boxShadow: '0 20px 40px -10px rgba(15, 23, 42, 0.35)',
              border: '1px solid #e2e8f0',
              overflow: 'hidden'
            }}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 18px', borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '7px', background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <User size={14} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '0.96rem', fontWeight: 800, color: '#0f172a' }}>
                    Manage Reviewers
                  </h3>
                  <div style={{ fontSize: '0.68rem', color: '#64748b' }}>Add or remove reviewer names from your team list</div>
                </div>
              </div>
              <button 
                onClick={() => setIsManagingReviewers(false)} 
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
                onSubmit={(e) => {
                  e.preventDefault();
                  handleAddReviewer();
                }}
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
                    background: newReviewerName.trim() ? 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)' : '#e2e8f0',
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

                  {reviewer !== 'Unassigned' && (
                    <button
                      type="button"
                      onClick={() => handleDeleteReviewer(reviewer)}
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
                onClick={() => setIsManagingReviewers(false)} 
                style={{ padding: '6px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#ffffff', color: '#0f172a', fontWeight: 700, cursor: 'pointer', fontSize: '0.76rem' }}
              >
                Done
              </button>
            </div>

          </div>
        </div>,
        document.body
      )}

    </div>
  );
}
