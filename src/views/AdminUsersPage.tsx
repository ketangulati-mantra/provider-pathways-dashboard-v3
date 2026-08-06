import React, { useState, useEffect } from 'react';
import {
  Users, UserPlus, ShieldCheck, Shield, Search, Filter, RefreshCw,
  Edit2, Key, Power, Trash2, AlertCircle, X, Loader2, ArrowLeft
} from 'lucide-react';
import { useAuth } from '../auth/AuthContext';
import { useToast } from '../components';

export interface AdminUserItem {
  id: number;
  name: string;
  email: string;
  role: 'super_admin' | 'admin' | string;
  is_active: boolean;
  last_login_at: string | null;
  created_at: string;
  updated_at: string;
}

function getApiBase(): string {
  if (typeof window === 'undefined') return '/api';
  const hostname = window.location.hostname;
  const port = window.location.port;

  if ((hostname === 'localhost' || hostname === '127.0.0.1') && port === '5173') {
    return 'http://localhost:5000/api';
  }

  const pathname = window.location.pathname;
  const prefixes = [
    '/provider_pathways_dashboard_v3',
    '/provider_pathways_dashboard_v2',
    '/provider_dashboard_v1',
    '/provider_pathways_dashboard_v1',
    '/provider_pathways_v2_testing',
    '/provider_pathways'
  ];
  for (const prefix of prefixes) {
    if (pathname.startsWith(prefix)) return `${prefix}/api`;
  }
  return '/api';
}

export default function AdminUsersPage() {
  const { admin: currentAdmin } = useAuth();
  const { showToast } = useToast();

  const [admins, setAdmins] = useState<AdminUserItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const tableScrollRef = React.useRef<HTMLDivElement>(null);
  const scrollIntervalRef = React.useRef<any>(null);
  const [showLeftNav, setShowLeftNav] = useState(false);
  const [showRightNav, setShowRightNav] = useState(false);

  const [adminColumns, setAdminColumns] = useState([
    { id: 'name', label: 'Admin User' },
    { id: 'role', label: 'Role' },
    { id: 'status', label: 'Status' },
    { id: 'lastLogin', label: 'Last Login' },
    { id: 'createdDate', label: 'Created Date' },
    { id: 'actions', label: 'Actions', align: 'right' }
  ]);
  const [draggedAdminColIndex, setDraggedAdminColIndex] = useState<number | null>(null);

  const handleAdminColDragStart = (e: React.DragEvent, index: number) => {
    setDraggedAdminColIndex(index);
    e.dataTransfer.setData('text/plain', String(index));
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleAdminColDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleAdminColDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    const dragIndexStr = e.dataTransfer.getData('text/plain');
    const dragIndex = dragIndexStr !== '' ? Number(dragIndexStr) : draggedAdminColIndex;
    if (dragIndex === null || dragIndex === dropIndex) {
      setDraggedAdminColIndex(null);
      return;
    }
    const updated = [...adminColumns];
    const [movedItem] = updated.splice(dragIndex, 1);
    updated.splice(dropIndex, 0, movedItem);
    setAdminColumns(updated);
    setDraggedAdminColIndex(null);
  };

  const checkScrollState = () => {
    const el = tableScrollRef.current;
    if (!el) return;
    setShowLeftNav(el.scrollLeft > 5);
    setShowRightNav(el.scrollLeft < (el.scrollWidth - el.clientWidth - 5));
  };

  const startHoverScroll = (direction: 'left' | 'right') => {
    stopHoverScroll();
    const step = direction === 'right' ? 65 : -65;
    scrollIntervalRef.current = setInterval(() => {
      if (tableScrollRef.current) {
        tableScrollRef.current.scrollLeft += step;
      }
    }, 16);
  };

  const stopHoverScroll = () => {
    if (scrollIntervalRef.current) {
      clearInterval(scrollIntervalRef.current);
      scrollIntervalRef.current = null;
    }
  };

  useEffect(() => {
    const el = tableScrollRef.current;
    if (!el) return;
    checkScrollState();
    el.addEventListener('scroll', checkScrollState);
    window.addEventListener('resize', checkScrollState);
    return () => {
      el.removeEventListener('scroll', checkScrollState);
      window.removeEventListener('resize', checkScrollState);
      stopHoverScroll();
    };
  }, [admins]);

  // Modals state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<AdminUserItem | null>(null);
  const [resettingPasswordAdmin, setResettingPasswordAdmin] = useState<AdminUserItem | null>(null);
  const [deletingAdmin, setDeletingAdmin] = useState<AdminUserItem | null>(null);

  // Form states
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPassword, setFormPassword] = useState('');
  const [formConfirmPassword, setFormConfirmPassword] = useState('');
  const [formRole, setFormRole] = useState<'super_admin' | 'admin'>('admin');
  const [formIsActive, setFormIsActive] = useState(true);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchAdmins = async () => {
    try {
      setIsLoading(true);
      const apiBase = getApiBase();
      const res = await fetch(`${apiBase}/admin/users`, { credentials: 'include' });
      const data = await res.json();
      if (res.ok && data.success && data.admins) {
        setAdmins(data.admins);
      } else {
        showToast(data.error || 'Failed to fetch admin users', 'error');
      }
    } catch (e) {
      showToast('Network error while fetching admin list.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  // Filtered admins
  const filteredAdmins = admins.filter(a => {
    const matchesSearch =
      a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole =
      roleFilter === 'all' ||
      (roleFilter === 'super_admin' && (a.role === 'super_admin' || a.role === 'Super Admin')) ||
      (roleFilter === 'admin' && a.role === 'admin');

    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'active' && a.is_active) ||
      (statusFilter === 'inactive' && !a.is_active);

    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!formName || !formEmail || !formPassword) {
      setFormError('Name, email, and password are required.');
      return;
    }

    if (formPassword !== formConfirmPassword) {
      setFormError('Passwords do not match.');
      return;
    }

    if (formPassword.length < 6) {
      setFormError('Password must be at least 6 characters.');
      return;
    }

    try {
      setIsSubmitting(true);
      const apiBase = getApiBase();
      const res = await fetch(`${apiBase}/admin/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name: formName,
          email: formEmail,
          password: formPassword,
          role: formRole
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        showToast('🔑 New admin created successfully!', 'success');
        setShowCreateModal(false);
        setFormName('');
        setFormEmail('');
        setFormPassword('');
        setFormConfirmPassword('');
        fetchAdmins();
      } else {
        setFormError(data.error || 'Failed to create admin.');
      }
    } catch (e) {
      setFormError('Network error while creating admin.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAdmin) return;
    setFormError(null);

    try {
      setIsSubmitting(true);
      const apiBase = getApiBase();
      const res = await fetch(`${apiBase}/admin/users/${editingAdmin.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name: formName,
          email: formEmail,
          role: formRole,
          is_active: formIsActive
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        showToast('Admin user updated successfully.', 'success');
        setEditingAdmin(null);
        fetchAdmins();
      } else {
        setFormError(data.error || 'Failed to update admin user.');
      }
    } catch (e) {
      setFormError('Network error while updating admin.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = async (targetAdmin: AdminUserItem) => {
    try {
      const apiBase = getApiBase();
      const newStatus = !targetAdmin.is_active;
      const res = await fetch(`${apiBase}/admin/users/${targetAdmin.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ is_active: newStatus })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        showToast(data.message || 'Status updated', 'success');
        fetchAdmins();
      } else {
        showToast(data.error || 'Failed to update status', 'error');
      }
    } catch (e) {
      showToast('Network error while toggling status', 'error');
    }
  };

  const handleResetPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resettingPasswordAdmin) return;
    setFormError(null);

    if (!formPassword || formPassword.length < 6) {
      setFormError('Password must be at least 6 characters.');
      return;
    }

    if (formPassword !== formConfirmPassword) {
      setFormError('Passwords do not match.');
      return;
    }

    try {
      setIsSubmitting(true);
      const apiBase = getApiBase();
      const res = await fetch(`${apiBase}/admin/users/${resettingPasswordAdmin.id}/password`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ password: formPassword })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        showToast('🔒 Admin password reset successfully!', 'success');
        setResettingPasswordAdmin(null);
        setFormPassword('');
        setFormConfirmPassword('');
      } else {
        setFormError(data.error || 'Failed to reset password.');
      }
    } catch (e) {
      setFormError('Network error while resetting password.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingAdmin) return;

    try {
      setIsSubmitting(true);
      const apiBase = getApiBase();
      const res = await fetch(`${apiBase}/admin/users/${deletingAdmin.id}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      const data = await res.json();
      if (res.ok && data.success) {
        showToast('Admin deleted successfully.', 'success');
        setDeletingAdmin(null);
        fetchAdmins();
      } else {
        showToast(data.error || 'Failed to delete admin', 'error');
      }
    } catch (e) {
      showToast('Network error while deleting admin.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      style={{
        padding: '32px 24px',
        maxWidth: '1200px',
        margin: '0 auto',
        fontFamily: "'Outfit', 'Inter', sans-serif",
        color: '#0f172a'
      }}
    >
      {/* HEADER BAR */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '28px'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                background: '#eff6ff',
                color: '#2563eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Users size={22} />
            </div>
            <h1 style={{ margin: 0, fontSize: '1.6rem', fontWeight: 900, color: '#0f172a' }}>
              Admin Management
            </h1>

          </div>
          <p style={{ margin: '6px 0 0 0', fontSize: '0.88rem', color: '#64748b' }}>
            Manage system administrators, roles, permissions, and status controls.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={() => { window.location.href = '#/admin/dashboard'; }}
            style={{
              padding: '10px 16px',
              borderRadius: '12px',
              border: '1px solid #cbd5e1',
              background: '#ffffff',
              color: '#334155',
              fontWeight: 800,
              fontSize: '0.86rem',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <ArrowLeft size={16} /> Dashboard
          </button>

          <button
            onClick={() => {
              setFormName('');
              setFormEmail('');
              setFormPassword('');
              setFormConfirmPassword('');
              setFormRole('admin');
              setFormError(null);
              setShowCreateModal(true);
            }}
            style={{
              padding: '10px 20px',
              borderRadius: '12px',
              border: 'none',
              background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
              color: '#ffffff',
              fontWeight: 800,
              fontSize: '0.88rem',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 14px rgba(37,99,235,0.3)',
              transition: 'all 0.15s ease'
            }}
          >
            <UserPlus size={18} /> Create Admin
          </button>
        </div>
      </div>

      {/* FILTER BAR */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: '16px',
          padding: '16px 20px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '24px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: '260px' }}>
          <div style={{ position: 'relative', width: '100%' }}>
            <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search admin by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '9px 14px 9px 38px',
                borderRadius: '10px',
                border: '1px solid #cbd5e1',
                fontSize: '0.86rem',
                outline: 'none',
                background: '#f8fafc',
                boxSizing: 'border-box'
              }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#f8fafc', padding: '4px 10px', borderRadius: '10px', border: '1px solid #cbd5e1' }}>
            <Filter size={14} color="#64748b" />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              style={{
                border: 'none',
                background: 'transparent',
                fontSize: '0.84rem',
                outline: 'none',
                color: '#334155',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              <option value="all">All Roles</option>
              <option value="super_admin">Super Admin</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#f8fafc', padding: '4px 10px', borderRadius: '10px', border: '1px solid #cbd5e1' }}>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{
                border: 'none',
                background: 'transparent',
                fontSize: '0.84rem',
                outline: 'none',
                color: '#334155',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              <option value="all">All Status</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive Only</option>
            </select>
          </div>

          <button
            onClick={fetchAdmins}
            title="Refresh List"
            style={{
              height: '34px',
              padding: '0 12px',
              borderRadius: '10px',
              border: '1px solid #cbd5e1',
              background: '#ffffff',
              color: '#475569',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              fontSize: '0.84rem',
              fontWeight: 700
            }}
          >
            <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>
      </div>

      {/* TABLE DATA */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: '20px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 10px 30px rgba(0,0,0,0.04)',
          overflow: 'hidden'
        }}
      >
        {isLoading ? (
          <div style={{ padding: '60px', textAlign: 'center', color: '#64748b' }}>
            <Loader2 size={32} style={{ animation: 'spin 1s linear infinite', marginBottom: '12px' }} />
            <div>Loading admin accounts...</div>
          </div>
        ) : filteredAdmins.length === 0 ? (
          <div style={{ padding: '60px', textAlign: 'center', color: '#64748b' }}>
            <Users size={40} color="#cbd5e1" style={{ marginBottom: '12px' }} />
            <h3 style={{ margin: '0 0 6px 0', fontSize: '1.1rem', color: '#0f172a' }}>No admin accounts found</h3>
            <p style={{ margin: 0, fontSize: '0.86rem' }}>Try adjusting your search query or filters.</p>
          </div>
        ) : (
          <div style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden' }}>
            
            {/* Hover Scroll Navigator - LEFT */}
            <div
              onMouseEnter={() => startHoverScroll('left')}
              onMouseLeave={stopHoverScroll}
              onClick={() => {
                if (tableScrollRef.current) tableScrollRef.current.scrollLeft -= 750;
              }}
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                bottom: 0,
                width: '44px',
                zIndex: 20,
                display: showLeftNav ? 'flex' : 'none',
                alignItems: 'center',
                justifyContent: 'flex-start',
                background: 'linear-gradient(to right, rgba(241,245,249,0.85) 0%, rgba(241,245,249,0) 100%)',
                cursor: 'pointer',
                transition: 'opacity 0.2s ease',
                pointerEvents: 'auto'
              }}
              title="Hover or Click to Scroll Left"
            >
              <div
                style={{
                  width: '36px',
                  height: '60px',
                  borderTopRightRadius: '30px',
                  borderBottomRightRadius: '30px',
                  background: 'rgba(226, 232, 240, 0.9)',
                  backdropFilter: 'blur(4px)',
                  boxShadow: '2px 0 8px rgba(0,0,0,0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#334155'
                }}
              >
                <ArrowLeft size={18} style={{ strokeWidth: 3 }} />
              </div>
            </div>

            {/* Hover Scroll Navigator - RIGHT */}
            <div
              onMouseEnter={() => startHoverScroll('right')}
              onMouseLeave={stopHoverScroll}
              onClick={() => {
                if (tableScrollRef.current) tableScrollRef.current.scrollLeft += 750;
              }}
              style={{
                position: 'absolute',
                right: 0,
                top: 0,
                bottom: 0,
                width: '44px',
                zIndex: 20,
                display: showRightNav ? 'flex' : 'none',
                alignItems: 'center',
                justifyContent: 'flex-end',
                background: 'linear-gradient(to left, rgba(241,245,249,0.85) 0%, rgba(241,245,249,0) 100%)',
                cursor: 'pointer',
                transition: 'opacity 0.2s ease',
                pointerEvents: 'auto'
              }}
              title="Hover or Click to Scroll Right"
            >
              <div
                style={{
                  width: '36px',
                  height: '60px',
                  borderTopLeftRadius: '30px',
                  borderBottomLeftRadius: '30px',
                  background: 'rgba(226, 232, 240, 0.9)',
                  backdropFilter: 'blur(4px)',
                  boxShadow: '-2px 0 8px rgba(0,0,0,0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#334155'
                }}
              >
                <ArrowLeft size={18} style={{ transform: 'rotate(180deg)', strokeWidth: 3 }} />
              </div>
            </div>

            <div ref={tableScrollRef} style={{ overflowX: 'auto', scrollBehavior: 'smooth' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                  {adminColumns.map((col, index) => (
                    <th
                      key={col.id}
                      draggable
                      onDragStart={(e) => handleAdminColDragStart(e, index)}
                      onDragOver={handleAdminColDragOver}
                      onDrop={(e) => handleAdminColDrop(e, index)}
                      onDragEnd={() => setDraggedAdminColIndex(null)}
                      style={{
                        padding: '8px 14px',
                        fontWeight: 800,
                        color: '#475569',
                        fontSize: '0.72rem',
                        textTransform: 'uppercase',
                        cursor: 'grab',
                        userSelect: 'none',
                        textAlign: (col.align as any) || 'left',
                        background: draggedAdminColIndex === index ? '#e2e8f0' : 'transparent',
                        borderLeft: draggedAdminColIndex === index ? '2px solid #3b82f6' : 'none',
                        transition: 'background 0.15s ease'
                      }}
                      title="Drag left or right to reorder column position"
                    >
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <span style={{ opacity: 0.5, fontSize: '0.65rem', cursor: 'grab' }}>⋮⋮</span>
                        {col.label}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredAdmins.map((item) => {
                  const isSuper = item.role === 'super_admin' || item.role === 'Super Admin';
                  const isCurrentSelf = currentAdmin?.id === item.id;

                  return (
                    <tr key={item.id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.15s ease' }}>
                      {adminColumns.map((col) => {
                        if (col.id === 'name') {
                          return (
                            <td key={col.id} style={{ padding: '8px 14px' }}>
                              <div style={{ fontWeight: 800, color: '#0f172a' }}>
                                {item.name} {isCurrentSelf && <span style={{ fontSize: '0.7rem', background: '#dbeafe', color: '#1d4ed8', padding: '1px 6px', borderRadius: '4px', marginLeft: '6px' }}>You</span>}
                              </div>
                              <div style={{ fontSize: '0.76rem', color: '#64748b' }}>{item.email}</div>
                            </td>
                          );
                        }

                        if (col.id === 'role') {
                          return (
                            <td key={col.id} style={{ padding: '8px 14px' }}>
                              <span
                                style={{
                                  padding: '3px 8px',
                                  borderRadius: '6px',
                                  fontSize: '0.72rem',
                                  fontWeight: 800,
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                  background: isSuper ? '#f3e8ff' : '#eff6ff',
                                  color: isSuper ? '#7e22ce' : '#1d4ed8',
                                  border: `1px solid ${isSuper ? '#e9d5ff' : '#bfdbfe'}`
                                }}
                              >
                                {isSuper ? <ShieldCheck size={13} /> : <Shield size={13} />}
                                {isSuper ? 'Super Admin' : 'Admin'}
                              </span>
                            </td>
                          );
                        }

                        if (col.id === 'status') {
                          return (
                            <td key={col.id} style={{ padding: '8px 14px' }}>
                              <span
                                style={{
                                  padding: '3px 8px',
                                  borderRadius: '6px',
                                  fontSize: '0.72rem',
                                  fontWeight: 800,
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                  background: item.is_active ? '#ecfdf5' : '#fef2f2',
                                  color: item.is_active ? '#047857' : '#b91c1c',
                                  border: `1px solid ${item.is_active ? '#a7f3d0' : '#fecaca'}`
                                }}
                              >
                                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: item.is_active ? '#10b981' : '#ef4444' }} />
                                {item.is_active ? 'Active' : 'Inactive'}
                              </span>
                            </td>
                          );
                        }

                        if (col.id === 'lastLogin') {
                          return (
                            <td key={col.id} style={{ padding: '8px 14px', color: '#64748b', fontSize: '0.78rem' }}>
                              {item.last_login_at ? new Date(item.last_login_at).toLocaleDateString() : 'Never'}
                            </td>
                          );
                        }

                        if (col.id === 'createdDate') {
                          return (
                            <td key={col.id} style={{ padding: '8px 14px', color: '#64748b', fontSize: '0.78rem' }}>
                              {item.created_at ? new Date(item.created_at).toLocaleDateString() : 'N/A'}
                            </td>
                          );
                        }

                        if (col.id === 'actions') {
                          return (
                            <td key={col.id} style={{ padding: '8px 14px', textAlign: 'right' }}>
                              <div style={{ display: 'inline-flex', gap: '6px' }}>
                                {/* EDIT BUTTON */}
                                <button
                                  onClick={() => {
                                    setEditingAdmin(item);
                                    setFormName(item.name);
                                    setFormEmail(item.email);
                                    setFormRole((item.role === 'super_admin' || item.role === 'Super Admin') ? 'super_admin' : 'admin');
                                    setFormIsActive(item.is_active);
                                    setFormError(null);
                                  }}
                                  title="Edit Admin"
                                  style={{
                                    padding: '6px 10px',
                                    borderRadius: '8px',
                                    border: '1px solid #cbd5e1',
                                    background: '#ffffff',
                                    color: '#475569',
                                    cursor: 'pointer'
                                  }}
                                >
                                  <Edit2 size={14} />
                                </button>

                                {/* RESET PASSWORD BUTTON */}
                                <button
                                  onClick={() => {
                                    setResettingPasswordAdmin(item);
                                    setFormPassword('');
                                    setFormConfirmPassword('');
                                    setFormError(null);
                                  }}
                                  title="Reset Password"
                                  style={{
                                    padding: '6px 10px',
                                    borderRadius: '8px',
                                    border: '1px solid #cbd5e1',
                                    background: '#ffffff',
                                    color: '#0284c7',
                                    cursor: 'pointer'
                                  }}
                                >
                                  <Key size={14} />
                                </button>

                                {/* TOGGLE STATUS BUTTON */}
                                <button
                                  onClick={() => handleToggleStatus(item)}
                                  disabled={isCurrentSelf}
                                  title={isCurrentSelf ? 'Self Protection: Cannot deactivate yourself' : (item.is_active ? 'Deactivate Admin' : 'Activate Admin')}
                                  style={{
                                    padding: '6px 10px',
                                    borderRadius: '8px',
                                    border: '1px solid #cbd5e1',
                                    background: item.is_active ? '#fff7ed' : '#ecfdf5',
                                    color: item.is_active ? '#c2410c' : '#047857',
                                    cursor: isCurrentSelf ? 'not-allowed' : 'pointer',
                                    opacity: isCurrentSelf ? 0.5 : 1
                                  }}
                                >
                                  <Power size={14} />
                                </button>

                                {/* DELETE BUTTON */}
                                <button
                                  onClick={() => setDeletingAdmin(item)}
                                  disabled={isCurrentSelf}
                                  title={isCurrentSelf ? 'Self Protection: Cannot delete yourself' : 'Delete Admin'}
                                  style={{
                                    padding: '6px 10px',
                                    borderRadius: '8px',
                                    border: '1px solid #fecaca',
                                    background: '#fef2f2',
                                    color: '#dc2626',
                                    cursor: isCurrentSelf ? 'not-allowed' : 'pointer',
                                    opacity: isCurrentSelf ? 0.5 : 1
                                  }}
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </td>
                          );
                        }

                        return null;
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          </div>
        )}
      </div>

      {/* CREATE ADMIN MODAL */}
      {showCreateModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 999999, background: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: '#ffffff', borderRadius: '24px', padding: '32px', width: '100%', maxWidth: '460px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.3)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 900, color: '#0f172a' }}>Create New Admin</h3>
              <button onClick={() => setShowCreateModal(false)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#64748b' }}><X size={20} /></button>
            </div>

            {formError && (
              <div style={{ padding: '10px 14px', borderRadius: '10px', background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', fontSize: '0.82rem', fontWeight: 700, marginBottom: '16px' }}>
                {formError}
              </div>
            )}

            <form onSubmit={handleCreateSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: '#334155', marginBottom: '4px' }}>Full Name</label>
                <input type="text" required value={formName} onChange={(e) => setFormName(e.target.value)} placeholder="John Doe" style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.88rem', boxSizing: 'border-box' }} />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: '#334155', marginBottom: '4px' }}>Email Address</label>
                <input type="email" required value={formEmail} onChange={(e) => setFormEmail(e.target.value)} placeholder="admin@example.com" style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.88rem', boxSizing: 'border-box' }} />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: '#334155', marginBottom: '4px' }}>Role</label>
                <select value={formRole} onChange={(e) => setFormRole(e.target.value as any)} style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.88rem', boxSizing: 'border-box', background: '#ffffff' }}>
                  <option value="admin">Admin</option>
                  <option value="super_admin">Super Admin</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: '#334155', marginBottom: '4px' }}>Password</label>
                <input type="password" required value={formPassword} onChange={(e) => setFormPassword(e.target.value)} placeholder="••••••••" style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.88rem', boxSizing: 'border-box' }} />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: '#334155', marginBottom: '4px' }}>Confirm Password</label>
                <input type="password" required value={formConfirmPassword} onChange={(e) => setFormConfirmPassword(e.target.value)} placeholder="••••••••" style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.88rem', boxSizing: 'border-box' }} />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
                <button type="button" onClick={() => setShowCreateModal(false)} style={{ flex: 1, padding: '10px', borderRadius: '10px', border: '1px solid #cbd5e1', background: '#ffffff', color: '#475569', fontWeight: 700 }}>Cancel</button>
                <button type="submit" disabled={isSubmitting} style={{ flex: 1, padding: '10px', borderRadius: '10px', border: 'none', background: '#2563eb', color: '#ffffff', fontWeight: 800 }}>{isSubmitting ? 'Creating...' : 'Create Account'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT ADMIN MODAL */}
      {editingAdmin && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 999999, background: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: '#ffffff', borderRadius: '24px', padding: '32px', width: '100%', maxWidth: '460px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.3)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 900, color: '#0f172a' }}>Edit Admin Account</h3>
              <button onClick={() => setEditingAdmin(null)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#64748b' }}><X size={20} /></button>
            </div>

            {formError && (
              <div style={{ padding: '10px 14px', borderRadius: '10px', background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', fontSize: '0.82rem', fontWeight: 700, marginBottom: '16px' }}>
                {formError}
              </div>
            )}

            <form onSubmit={handleEditSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: '#334155', marginBottom: '4px' }}>Full Name</label>
                <input type="text" required value={formName} onChange={(e) => setFormName(e.target.value)} style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.88rem', boxSizing: 'border-box' }} />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: '#334155', marginBottom: '4px' }}>Email Address</label>
                <input type="email" required value={formEmail} onChange={(e) => setFormEmail(e.target.value)} style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.88rem', boxSizing: 'border-box' }} />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: '#334155', marginBottom: '4px' }}>Role</label>
                <select value={formRole} onChange={(e) => setFormRole(e.target.value as any)} style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.88rem', boxSizing: 'border-box', background: '#ffffff' }}>
                  <option value="admin">Admin</option>
                  <option value="super_admin">Super Admin</option>
                </select>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '6px' }}>
                <input type="checkbox" id="edit-active" checked={formIsActive} onChange={(e) => setFormIsActive(e.target.checked)} />
                <label htmlFor="edit-active" style={{ fontSize: '0.86rem', fontWeight: 700, color: '#334155', cursor: 'pointer' }}>Account Active</label>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
                <button type="button" onClick={() => setEditingAdmin(null)} style={{ flex: 1, padding: '10px', borderRadius: '10px', border: '1px solid #cbd5e1', background: '#ffffff', color: '#475569', fontWeight: 700 }}>Cancel</button>
                <button type="submit" disabled={isSubmitting} style={{ flex: 1, padding: '10px', borderRadius: '10px', border: 'none', background: '#2563eb', color: '#ffffff', fontWeight: 800 }}>{isSubmitting ? 'Saving...' : 'Save Changes'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* RESET PASSWORD MODAL */}
      {resettingPasswordAdmin && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 999999, background: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: '#ffffff', borderRadius: '24px', padding: '32px', width: '100%', maxWidth: '440px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.3)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 900, color: '#0f172a' }}>Reset Admin Password</h3>
              <button onClick={() => setResettingPasswordAdmin(null)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#64748b' }}><X size={20} /></button>
            </div>

            <p style={{ margin: '0 0 16px 0', fontSize: '0.84rem', color: '#64748b' }}>
              Reset password for <strong>{resettingPasswordAdmin.name}</strong> ({resettingPasswordAdmin.email})
            </p>

            {formError && (
              <div style={{ padding: '10px 14px', borderRadius: '10px', background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', fontSize: '0.82rem', fontWeight: 700, marginBottom: '16px' }}>
                {formError}
              </div>
            )}

            <form onSubmit={handleResetPasswordSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: '#334155', marginBottom: '4px' }}>New Password</label>
                <input type="password" required value={formPassword} onChange={(e) => setFormPassword(e.target.value)} placeholder="••••••••" style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.88rem', boxSizing: 'border-box' }} />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: '#334155', marginBottom: '4px' }}>Confirm New Password</label>
                <input type="password" required value={formConfirmPassword} onChange={(e) => setFormConfirmPassword(e.target.value)} placeholder="••••••••" style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.88rem', boxSizing: 'border-box' }} />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
                <button type="button" onClick={() => setResettingPasswordAdmin(null)} style={{ flex: 1, padding: '10px', borderRadius: '10px', border: '1px solid #cbd5e1', background: '#ffffff', color: '#475569', fontWeight: 700 }}>Cancel</button>
                <button type="submit" disabled={isSubmitting} style={{ flex: 1, padding: '10px', borderRadius: '10px', border: 'none', background: '#0284c7', color: '#ffffff', fontWeight: 800 }}>{isSubmitting ? 'Resetting...' : 'Reset Password'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deletingAdmin && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 999999, background: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: '#ffffff', borderRadius: '24px', padding: '32px', width: '100%', maxWidth: '420px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.3)', textAlign: 'center' }}>
            <div style={{ width: '54px', height: '54px', borderRadius: '50%', background: '#fef2f2', color: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto' }}>
              <AlertCircle size={28} />
            </div>

            <h3 style={{ margin: '0 0 8px 0', fontSize: '1.2rem', fontWeight: 900, color: '#0f172a' }}>Delete Admin Account?</h3>
            <p style={{ margin: '0 0 20px 0', fontSize: '0.86rem', color: '#64748b', lineHeight: 1.5 }}>
              Are you sure you want to permanently delete <strong>{deletingAdmin.name}</strong> ({deletingAdmin.email})? This action cannot be undone.
            </p>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="button" onClick={() => setDeletingAdmin(null)} style={{ flex: 1, padding: '10px', borderRadius: '10px', border: '1px solid #cbd5e1', background: '#ffffff', color: '#475569', fontWeight: 700 }}>Cancel</button>
              <button type="button" onClick={handleDeleteConfirm} disabled={isSubmitting} style={{ flex: 1, padding: '10px', borderRadius: '10px', border: 'none', background: '#dc2626', color: '#ffffff', fontWeight: 800 }}>{isSubmitting ? 'Deleting...' : 'Delete Admin'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
