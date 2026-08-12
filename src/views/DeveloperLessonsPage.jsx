import React, { useState, useEffect, useRef } from 'react';
import { Search, BookOpen, Database, Menu, GraduationCap, Building2, Clock, ArrowRight, Filter, X, ChevronRight, LogOut, ShieldCheck } from 'lucide-react';
import SubmissionsTable from '../components/SubmissionsTable';
import CampusAdminDashboard from '../components/admin/CampusAdminDashboard';
import CorporateAdminDashboard from '../components/admin/CorporateAdminDashboard';
import { activities as mantraActivities, getCurrentService, setServiceContext, preserveQueryParams, SUPPORTED_SERVICES, normalizeService } from '../mantra';
import { useAuth } from '../auth/AuthContext';

const MANTRA_LOGO_URL = 'https://res.cloudinary.com/hxbamdqf/image/upload/v1784698269/Mantra_logo_yptwwe.svg';

export default function DeveloperLessonsPage({ onNavigate }) {
  const { admin: currentAdmin, logout } = useAuth();
  
  const storedAdminJson = typeof sessionStorage !== 'undefined' ? sessionStorage.getItem('admin_user') : null;
  let storedAdmin = null;
  try {
    storedAdmin = storedAdminJson ? JSON.parse(storedAdminJson) : null;
  } catch (e) {
    storedAdmin = null;
  }
  const displayAdmin = currentAdmin || storedAdmin || {
    name: 'Ketan Gulati',
    email: (typeof sessionStorage !== 'undefined' && sessionStorage.getItem('user_id')) || 'ketan.gulati@mantra.care',
    role: 'super_admin'
  };

  const isSuperAdmin = true;
  const [selectedService, setSelectedService] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const getInitialTab = () => {
    if (typeof window !== 'undefined') {
      const hash = (window.location.hash || '').toLowerCase();
      if (hash.includes('campus')) return 'campus_admin';
      if (hash.includes('corporate') || hash.includes('eap')) return 'corporate_admin';
      if (hash.includes('users') || hash.includes('management')) return 'users';
      if (hash.includes('lessons') || hash.includes('pathways')) return 'lessons';
      if (hash.includes('submissions')) return 'submissions';
      
      const savedTab = sessionStorage.getItem('mantra_active_tab');
      if (savedTab) return savedTab;
    }
    return 'submissions';
  };

  const [activeTab, setActiveTab] = useState(getInitialTab);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const searchInputRef = useRef(null);

  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('mantra_active_tab', tabName);
      if (tabName === 'campus_admin') window.location.hash = '#/admin/campus';
      else if (tabName === 'corporate_admin') window.location.hash = '#/admin/corporate';
      else if (tabName === 'submissions') window.location.hash = '#/admin/dashboard';
      else if (tabName === 'lessons') window.location.hash = '#/admin/pathways';
    }
  };

  useEffect(() => {
    const handleHashChange = () => {
      const hash = (window.location.hash || '').toLowerCase();
      if (hash.includes('campus')) setActiveTab('campus_admin');
      else if (hash.includes('corporate') || hash.includes('eap')) setActiveTab('corporate_admin');
      else if (hash.includes('lessons') || hash.includes('pathways')) setActiveTab('lessons');
      else if (hash.includes('submissions')) setActiveTab('submissions');
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    if (!isSuperAdmin && activeTab === 'lessons') {
      handleTabChange('submissions');
    }
  }, [isSuperAdmin, activeTab]);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search || '');
    let serviceInUrl = searchParams.get('service') || searchParams.get('source');

    if (!serviceInUrl && window.location.hash) {
      const hashQueryIndex = window.location.hash.indexOf('?');
      if (hashQueryIndex !== -1) {
        const hashParams = new URLSearchParams(window.location.hash.substring(hashQueryIndex));
        serviceInUrl = hashParams.get('service') || hashParams.get('source');
      }
    }

    if (serviceInUrl) {
      setSelectedService(normalizeService(serviceInUrl));
    } else {
      setSelectedService('all');
    }

    const handleServiceChange = (e) => {
      if (e.detail && e.detail.service) {
        setSelectedService(normalizeService(e.detail.service));
      }
    };

    window.addEventListener('mantra_service_changed', handleServiceChange);

    return () => {
      window.removeEventListener('mantra_service_changed', handleServiceChange);
    };
  }, []);

  const handleServiceSelect = (svc) => {
    setSelectedService(svc);
    if (svc !== 'all') {
      setServiceContext(svc);
    }
  };

  const serviceOptions = ['all', ...(SUPPORTED_SERVICES || ['therapy', 'listener', 'yoga', 'diet', 'physiotherapy', 'coaching', 'women_wellness'])];

  const filteredActivities = (mantraActivities || []).filter(act => {
    if (!act) return false;
    const actServices = Array.isArray(act.services) ? act.services : (act.services ? [act.services] : ['*']);
    
    // 1. Check service match
    const normSelected = normalizeService(selectedService);
    const matchesService = 
      selectedService === 'all' || 
      normSelected === 'all' ||
      actServices.includes('*') || 
      actServices.some(s => normalizeService(s) === normSelected) || 
      (act.service && normalizeService(act.service) === normSelected);

    // 2. Check search query match
    const query = searchQuery.trim().toLowerCase();
    const matchesSearch = !query ||
      act.title?.toLowerCase().includes(query) ||
      act.lessonId?.toLowerCase().includes(query) ||
      act.route?.toLowerCase().includes(query);

    return matchesService && matchesSearch;
  });

  const launchPathway = (act) => {
    if (act.services && act.services.length > 0 && act.services[0] !== '*') {
      setServiceContext(act.services[0]);
    }
    const targetRoute = act.route || `/task/${act.lessonId}`;
    const p = window.location.pathname;
    const subpathMatch = p.match(/^(\/[^\/]+)/);
    const subpath = (subpathMatch && subpathMatch[1] && !subpathMatch[1].startsWith('/task') && !subpathMatch[1].startsWith('/api')) ? subpathMatch[1] : '';
    const fullRoute = subpath ? `${subpath}${targetRoute}` : targetRoute;
    const targetUrl = preserveQueryParams(fullRoute);
    window.open(targetUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f4f7fb', color: '#0f172a' }}>
      
      {/* MANTRA CARE TOP NAVBAR HEADER */}
      <header style={{
        background: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
        padding: '12px 28px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        {/* Left Logo Section & Menu Trigger */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
          <button 
            onClick={() => setIsSidebarOpen(true)}
            title="Open Navigation Menu"
            style={{ 
              background: '#f8fafc', 
              border: '1px solid #cbd5e1', 
              borderRadius: '8px',
              cursor: 'pointer', 
              padding: '6px 8px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              color: '#043263',
              transition: 'background 0.15s ease'
            }}
          >
            <Menu size={22} />
          </button>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img 
              src={MANTRA_LOGO_URL} 
              alt="Mantra Care" 
              style={{ height: '32px', objectFit: 'contain' }}
            />
          </div>
        </div>

        {/* Right Active Section Indicator */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: '#eff6ff',
          border: '1px solid #bfdbfe',
          padding: '6px 14px',
          borderRadius: '10px',
          color: '#043263',
          fontSize: '0.84rem',
          fontWeight: 800
        }}>
          {activeTab === 'campus_admin' && <><GraduationCap size={16} /> Campus Program</>}
          {activeTab === 'submissions' && <><Database size={16} /> Form Submissions</>}
          {activeTab === 'lessons' && <><BookOpen size={16} /> Pathways ({filteredActivities.length})</>}
        </div>
      </header>

      {/* SIDEBAR NAVIGATION DRAWER */}
      {isSidebarOpen && (
        <div 
          onClick={() => setIsSidebarOpen(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(15, 23, 42, 0.45)',
            backdropFilter: 'blur(3px)',
            zIndex: 9999,
            display: 'flex',
            transition: 'opacity 0.2s ease'
          }}
          className="animate-fade-in"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '250px',
              maxWidth: '85vw',
              height: '100%',
              background: '#ffffff',
              boxShadow: '8px 0 30px rgba(0,0,0,0.15)',
              display: 'flex',
              flexDirection: 'column',
              padding: '16px 14px',
              gap: '16px',
              position: 'relative'
            }}
          >
            {/* Sidebar Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '12px', borderBottom: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <img 
                  src={MANTRA_LOGO_URL} 
                  alt="Mantra Care" 
                  style={{ height: '22px', objectFit: 'contain' }}
                />
              </div>
              <button 
                onClick={() => setIsSidebarOpen(false)}
                style={{ background: '#f1f5f9', border: 'none', borderRadius: '6px', padding: '4px', cursor: 'pointer', color: '#64748b' }}
              >
                <X size={15} />
              </button>
            </div>

            {/* Nav Menu Items */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div style={{ fontSize: '0.68rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', padding: '0 6px 4px' }}>
                Platform Modules
              </div>

              <button
                onClick={() => { handleTabChange('submissions'); setIsSidebarOpen(false); }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: 'none',
                  background: activeTab === 'submissions' ? '#043263' : '#f8fafc',
                  color: activeTab === 'submissions' ? '#ffffff' : '#334155',
                  fontWeight: 700,
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  boxShadow: activeTab === 'submissions' ? '0 2px 8px rgba(4, 50, 99, 0.2)' : 'none',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Database size={15} color={activeTab === 'submissions' ? '#ffffff' : '#043263'} />
                  <span>Form Submissions</span>
                </div>
                <ChevronRight size={14} opacity={0.6} />
              </button>

              <button
                onClick={() => { handleTabChange('campus_admin'); setIsSidebarOpen(false); }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: 'none',
                  background: activeTab === 'campus_admin' ? '#043263' : '#f8fafc',
                  color: activeTab === 'campus_admin' ? '#ffffff' : '#334155',
                  fontWeight: 700,
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  boxShadow: activeTab === 'campus_admin' ? '0 2px 8px rgba(4, 50, 99, 0.2)' : 'none',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <GraduationCap size={15} color={activeTab === 'campus_admin' ? '#ffffff' : '#043263'} />
                  <span>Campus Program</span>
                </div>
                <ChevronRight size={14} opacity={0.6} />
              </button>

              <button
                onClick={() => { handleTabChange('corporate_admin'); setIsSidebarOpen(false); }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: 'none',
                  background: activeTab === 'corporate_admin' ? '#043263' : '#f8fafc',
                  color: activeTab === 'corporate_admin' ? '#ffffff' : '#334155',
                  fontWeight: 700,
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  boxShadow: activeTab === 'corporate_admin' ? '0 2px 8px rgba(4, 50, 99, 0.2)' : 'none',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Building2 size={15} color={activeTab === 'corporate_admin' ? '#ffffff' : '#043263'} />
                  <span>EAP Interests</span>
                </div>
                <ChevronRight size={14} opacity={0.6} />
              </button>

              {/* Super Admin Only: Pathways Tab */}
              {isSuperAdmin && (
                <button
                  onClick={() => { handleTabChange('lessons'); setIsSidebarOpen(false); }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: 'none',
                    background: activeTab === 'lessons' ? '#043263' : '#f8fafc',
                    color: activeTab === 'lessons' ? '#ffffff' : '#334155',
                    fontWeight: 700,
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    boxShadow: activeTab === 'lessons' ? '0 2px 8px rgba(4, 50, 99, 0.2)' : 'none',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <BookOpen size={15} color={activeTab === 'lessons' ? '#ffffff' : '#043263'} />
                    <span>Pathways ({filteredActivities.length})</span>
                  </div>
                  <ChevronRight size={14} opacity={0.6} />
                </button>
              )}

              {/* Super Admin Only: Admin Management Navigation (Last Option) */}
              {isSuperAdmin && (
                <button
                  onClick={() => {
                    setIsSidebarOpen(false);
                    window.location.href = '#/admin/users';
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: 'none',
                    background: '#f3e8ff',
                    color: '#7e22ce',
                    fontWeight: 700,
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <ShieldCheck size={15} color="#7e22ce" />
                    <span>Admin Management</span>
                  </div>
                  <ChevronRight size={14} opacity={0.6} />
                </button>
              )}
            </div>

            {/* LOGGED IN USER INFO & SIGN-OUT AT SIDEBAR BOTTOM */}
            <div style={{ marginTop: 'auto', paddingTop: '12px', borderTop: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ padding: '8px 10px', borderRadius: '8px', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0f172a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {displayAdmin?.name || 'Ketan Gulati'}
                </div>
                <div style={{ fontSize: '0.72rem', color: '#64748b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: '2px' }}>
                  {displayAdmin?.email || (typeof sessionStorage !== 'undefined' && sessionStorage.getItem('user_id')) || 'ketan.gulati@mantra.care'}
                </div>
                <div style={{ marginTop: '4px' }}>
                  <span style={{
                    fontSize: '0.65rem',
                    fontWeight: 800,
                    color: '#2563eb',
                    background: '#eff6ff',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    textTransform: 'uppercase'
                  }}>
                    {String(displayAdmin?.role || 'SUPER ADMIN').replace('_', ' ').toUpperCase()}
                  </span>
                </div>
              </div>

              <button
                onClick={async () => {
                  setIsSidebarOpen(false);
                  await logout();
                  window.location.href = '#/admin/login';
                }}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: '1px solid #fecaca',
                  background: '#fef2f2',
                  color: '#dc2626',
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  transition: 'background 0.15s ease'
                }}
              >
                <LogOut size={14} /> Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MAIN CONTAINER CONTENT */}
      <div style={{ maxWidth: '1720px', margin: '0 auto', padding: '24px 28px' }}>

        {/* TAB 1: CAMPUS PROGRAM ADMIN */}
        {activeTab === 'campus_admin' && (
          <div className="animate-fade-in">
            <CampusAdminDashboard />
          </div>
        )}

        {/* TAB 2: CORPORATE EAP SUBMISSIONS ADMIN */}
        {activeTab === 'corporate_admin' && (
          <div className="animate-fade-in">
            <CorporateAdminDashboard />
          </div>
        )}

        {/* TAB 3: FORM SUBMISSIONS TABLE DATA */}
        {activeTab === 'submissions' && (
          <div className="animate-fade-in">
            <SubmissionsTable />
          </div>
        )}

        {/* TAB 3: LESSONS & ACTIVITIES PATHWAYS (Super Admin Only) */}
        {activeTab === 'lessons' && isSuperAdmin && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }} className="animate-fade-in">
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h1 style={{ margin: '0 0 4px', fontSize: '1.6rem', fontWeight: 900, color: '#03254c' }}>
                  Pathways & Lessons ({filteredActivities.length})
                </h1>
                <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>
                  Explore and test provider pathways across services
                </p>
              </div>

              {/* Service Filter Pills Bar */}
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px', marginRight: '4px' }}>
                  <Filter size={14} /> Service:
                </span>
                {serviceOptions.map(svc => {
                  const isActive = selectedService === svc;
                  return (
                    <button
                      key={svc}
                      onClick={() => handleServiceSelect(svc)}
                      style={{
                        padding: '5px 12px',
                        borderRadius: '20px',
                        border: isActive ? '1px solid #043263' : '1px solid #cbd5e1',
                        background: isActive ? '#043263' : '#ffffff',
                        color: isActive ? '#ffffff' : '#334155',
                        fontWeight: isActive ? 800 : 600,
                        fontSize: '0.78rem',
                        cursor: 'pointer',
                        textTransform: 'capitalize',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      {svc === 'all' ? 'All Services' : svc.replace('_', ' ')}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Search Bar */}
            <div style={{ position: 'relative', marginTop: '4px' }}>
              <div style={{
                position: 'absolute',
                left: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#94a3b8',
                display: 'flex',
                alignItems: 'center',
                pointerEvents: 'none'
              }}>
                <Search size={18} />
              </div>
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search pathways by name or route..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px 12px 44px',
                  borderRadius: '12px',
                  border: '2px solid #00a8e8',
                  fontSize: '0.92rem',
                  outline: 'none',
                  boxSizing: 'border-box',
                  background: '#ffffff'
                }}
              />
            </div>

            {/* Pathways Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px', marginTop: '8px' }}>
              {filteredActivities.length === 0 ? (
                <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '48px 16px', background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', color: '#64748b' }}>
                  <div style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>No Pathways Found</div>
                  <div style={{ fontSize: '0.82rem', marginTop: '4px' }}>No pathways match service <strong>"{selectedService}"</strong> and search <strong>"{searchQuery}"</strong></div>
                </div>
              ) : (
                filteredActivities.map(act => {
                  const completed = (() => {
                    try {
                      const uId = getCurrentUserId();
                      const lId = act.lessonId || act.activityId;
                      const saved = localStorage.getItem(`lesson_progress_${uId}_${lId}`);
                      if (saved) {
                        const parsed = JSON.parse(saved);
                        return !!parsed.celebrationShown || !!parsed.actionDone || !!parsed.quizDone;
                      }
                    } catch (e) {}
                    return false;
                  })();

                  return (
                    <div
                      key={act.lessonId || act.route}
                      style={{
                        background: completed ? '#f0fdf4' : '#ffffff',
                        borderRadius: '16px',
                        border: completed ? '1.5px solid #86efac' : '1px solid #e2e8f0',
                        padding: '20px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                        transition: 'transform 0.15s ease, box-shadow 0.15s ease'
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ fontSize: '0.73rem', fontWeight: 800, color: '#043263', background: '#eff6ff', border: '1px solid #bfdbfe', padding: '2px 8px', borderRadius: '6px' }}>
                              +{act.rewardPoints || 5} Points
                            </span>
                            {completed && (
                              <span style={{ fontSize: '0.73rem', fontWeight: 800, color: '#15803d', background: '#dcfce7', border: '1px solid #bbf7d0', padding: '2px 8px', borderRadius: '6px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                <CheckCircle2 size={12} color="#15803d" /> Completed
                              </span>
                            )}
                          </div>
                          <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Clock size={13} /> {act.estimatedDuration || '3 min'}
                          </span>
                        </div>

                        <h3 style={{ margin: '0 0 6px', fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.35 }}>
                          {act.title}
                        </h3>

                        <div style={{ fontSize: '0.76rem', color: '#64748b', fontFamily: 'monospace', margin: '4px 0 12px' }}>
                          {act.route || `/task/${act.lessonId}`}
                        </div>
                      </div>

                      <div style={{ paddingTop: '12px', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'capitalize' }}>
                          Services: {Array.isArray(act.services) ? act.services.join(', ') : (act.services || 'All')}
                        </span>

                        <button
                          onClick={() => launchPathway(act)}
                          style={{
                            padding: '6px 14px',
                            borderRadius: '8px',
                            border: 'none',
                            background: completed ? '#16a34a' : '#00a8e8',
                            color: '#ffffff',
                            fontWeight: 800,
                            fontSize: '0.8rem',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px'
                          }}
                        >
                          {completed ? 'Review Pathway' : 'Open Pathway'} <ArrowRight size={14} />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
