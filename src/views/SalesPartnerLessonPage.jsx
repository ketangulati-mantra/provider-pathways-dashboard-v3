import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLessonCompletion } from '../hooks/useLessonCompletion';
import {
  Header, StepTimeline,
  InfoCallout,
  VideoSection,
  SalesPartnerApplicationForm,
  useToast
} from '../components';
import { completeLesson, goToDashboard } from '../mantra';
import { 
  Building2, MessageSquare, Share2, Users, Coins, Trophy, 
  Rocket, Heart, CheckCircle2, Search, ArrowRight, PenTool, Award, BookOpen
} from 'lucide-react';

const LESSON_ID = 'sales-partner';
const REWARD_POINTS = 10;

export default function SalesPartnerLessonPage({ onBack }) {
  const { t } = useTranslation('sales-partner');
  const LESSON_TITLE = t('title');

  const WAYS_TO_HELP = [
    { icon: Building2, title: t('help_items.intro_companies'), description: t('help_items.intro_companies_desc') },
    { icon: MessageSquare, title: t('help_items.make_intros'), description: t('help_items.make_intros_desc') },
    { icon: Share2, title: t('help_items.share_opps'), description: t('help_items.share_opps_desc') },
    { icon: Users, title: t('help_items.connect_dm'), description: t('help_items.connect_dm_desc') }
  ];

  const BENEFITS = [
    { icon: Coins, title: t('benefits.commission') },
    { icon: Trophy, title: t('benefits.points') },
    { icon: Rocket, title: t('benefits.no_targets') },
    { icon: Heart, title: t('benefits.expand') }
  ];

  const TIMELINE = [
    { icon: Search, title: t('timeline.identify'), description: t('timeline.identify_desc') },
    { icon: MessageSquare, title: t('timeline.intro'), description: t('timeline.intro_desc') },
    { icon: ArrowRight, title: t('timeline.biz_team'), description: t('timeline.biz_team_desc') },
    { icon: PenTool, title: t('timeline.signup'), description: t('timeline.signup_desc') },
    { icon: Award, title: t('timeline.earn'), description: t('timeline.earn_desc') }
  ];

  const WAYS_TO_PARTICIPATE = [
    { icon: Users, title: t('participate_items.intro_client'), description: t('participate_items.intro_client_desc') },
    { icon: Building2, title: t('participate_items.rec_companies'), description: t('participate_items.rec_companies_desc') },
    { icon: Share2, title: t('participate_items.make_intro'), description: t('participate_items.make_intro_desc') },
    { icon: BookOpen, title: t('participate_items.learn_more'), description: t('participate_items.learn_more_desc') }
  ];


  const { 
    lessonProgress, handleActionComplete 
  } = useLessonCompletion(LESSON_ID, onBack, {
    hasVideo: false,
    hasQuiz: false,
    hasAction: true
  });

  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--bg-app)' }} className="animate-fade-in">
      <Header title={LESSON_TITLE} onBack={onBack} progress={lessonProgress} />

      <main className="academy-main-container" style={{
        flex: 1, padding: '40px 24px 80px', maxWidth: '900px', margin: '0 auto', width: '100%',
        display: 'flex', flexDirection: 'column', gap: '48px'
      }}>

        <header style={{ textAlign: 'center' }}>
          <div style={{ 
            display: 'inline-block', padding: '6px 12px', background: '#e0e7ff', 
            color: '#4338ca', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 600,
            marginBottom: '16px', display: 'inline-flex', alignItems: 'center', gap: '6px'
          }}>
            <Building2 size={14} /> {t('badges.business_dev')}
          </div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.4rem', fontWeight: 800, margin: '0 0 16px', color: '#0f172a' }}>
            {LESSON_TITLE}
          </h1>
          <p style={{ fontSize: '1.1rem', color: '#64748b', maxWidth: '650px', margin: '0 auto', lineHeight: '1.6' }}>
            {t('description')}
          </p>
          
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: '#f0fdf4', color: '#15803d', padding: '10px 16px',
            borderRadius: '12px', fontSize: '0.95rem', fontWeight: 600, marginTop: '24px',
            border: '1px solid #bbf7d0'
          }}>
            <Coins size={18} fill="currentColor" /> {t('badges.earn_commission')}
          </div>
        </header>

        {/* Video Section */}
        <section>
          <VideoSection 
            title={LESSON_TITLE}
            duration="3 min"
            posterUrl="https://res.cloudinary.com/hxbamdqf/image/upload/v1784698598/Become-mantra-sales-partner_thumbnail_exfkdy.avif"
            videoUrl="https://vimeo.com/1132020422?fl=pl&fe=cm"
          />
        </section>

        {/* Custom Tab Navigation */}
        <div style={{ 
          display: 'flex', background: '#fff', padding: '8px', borderRadius: '16px', 
          boxShadow: '0 2px 10px rgba(0,0,0,0.03)', border: '1px solid #e2e8f0', gap: '8px',
          flexWrap: 'wrap'
        }}>
          {[
            { id: 'overview', label: t('sections.why_join'), icon: Award },
            { id: 'participate', label: t('sections.ways_to_participate'), icon: Users },
            { id: 'how-it-works', label: t('sections.how_it_works'), icon: ArrowRight }
          ].map(tab => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  flex: '1 1 200px', padding: '12px 16px', borderRadius: '10px',
                  background: isActive ? 'var(--color-primary)' : 'transparent',
                  color: isActive ? '#fff' : '#64748b',
                  border: 'none', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  fontSize: '0.95rem', fontWeight: 600, transition: 'all 0.2s'
                }}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content Area */}
        <div style={{ 
          background: '#fff', borderRadius: '20px', padding: '32px', 
          border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
          minHeight: '400px'
        }}>
          
          {/* TAB 1: OVERVIEW & BENEFITS */}
          {activeTab === 'overview' && (
            <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <InfoCallout 
                type="info" 
                title={t('info.not_sell_title')}
                text={t('info.not_sell_desc')}
              />
              <div>
                <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', fontWeight: 800, margin: '0 0 20px', color: '#0f172a' }}>
                  {t('sections.why_join')}
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
                  {BENEFITS.map((cat, idx) => (
                    <div key={idx} style={{
                      display: 'flex', alignItems: 'center', gap: '16px', padding: '20px',
                      background: '#f8fafc', borderRadius: '12px', border: '1px solid #eef2f6'
                    }}>
                      <div style={{ color: 'var(--color-primary)', width: '24px', display: 'flex', justifyContent: 'center' }}>
                        <cat.icon size={24} />
                      </div>
                      <span style={{ fontSize: '1.05rem', fontWeight: 600, color: '#1e293b' }}>
                        {cat.title}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PARTICIPATE */}
          {activeTab === 'participate' && (
            <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
              <div>
                <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', fontWeight: 800, margin: '0 0 20px', color: '#0f172a' }}>
                  {t('sections.ways_to_help')}
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                  {WAYS_TO_HELP.map((item, idx) => (
                    <div key={idx} style={{
                      display: 'flex', flexDirection: 'column', gap: '12px', padding: '20px',
                      background: '#f8fafc', borderRadius: '12px', border: '1px solid #eef2f6'
                    }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <item.icon size={20} />
                      </div>
                      <div>
                        <h3 style={{ margin: '0 0 4px', fontSize: '1.05rem', fontWeight: 700, color: '#0f172a' }}>{item.title}</h3>
                        <p style={{ margin: 0, fontSize: '0.9rem', color: '#64748b', lineHeight: '1.5' }}>{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', fontWeight: 800, margin: '0 0 16px', color: '#0f172a' }}>
                  {t('sections.ways_to_participate')}
                </h2>
                <p style={{ margin: '0 0 20px', fontSize: '1rem', color: '#64748b' }}>
                  {t('sections.participate_subtitle')}
                </p>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                  {WAYS_TO_PARTICIPATE.map((item, idx) => (
                    <div key={idx} style={{ 
                      display: 'flex', flexDirection: 'column', gap: '12px', padding: '24px',
                      background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px'
                    }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#f0f9ff', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <item.icon size={20} />
                      </div>
                      <div>
                        <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: '0 0 8px', color: '#0f172a' }}>{item.title}</h3>
                        <p style={{ margin: 0, fontSize: '0.95rem', color: '#475569', lineHeight: '1.5' }}>{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: HOW IT WORKS */}
          {activeTab === 'how-it-works' && (
            <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ width: '100%', maxWidth: '600px' }}>
                <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', fontWeight: 800, margin: '0 0 24px', color: '#0f172a' }}>
                  {t('sections.how_it_works')}
                </h2>
                <StepTimeline steps={TIMELINE} />
              </div>
            </div>
          )}
        </div>

        {/* Application Form */}
        <section>
          <SalesPartnerApplicationForm 
            onSuccess={handleActionComplete} 
          />
        </section>

      </main>
    </div>
  );
}
