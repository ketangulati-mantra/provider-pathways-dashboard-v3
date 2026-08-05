import React, { useState, useEffect, useRef } from 'react';
import { getCurrentUserId, MANTRA_CONFIG } from '../../mantra';
import {
  CheckCircle2, Circle, ArrowRight, ArrowLeft, Lock, BookOpen, Clock, Target,
  Award, Sparkles, ChevronRight, ChevronDown, Play, GraduationCap, BarChart3,
  Building2
} from 'lucide-react';
import CORP_ACADEMY_MODULES from './academyModuleContent';

const API_BASE = MANTRA_CONFIG.apiBaseUrl !== undefined && MANTRA_CONFIG.apiBaseUrl !== null
  ? MANTRA_CONFIG.apiBaseUrl
  : (import.meta.env.PROD ? '' : 'http://localhost:5000');

const TOTAL_MODULES = CORP_ACADEMY_MODULES.length;

// ─── Reusable Section Renderers ───────────────────────────────────────────────

function SectionBadge({ text }) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#eff6ff', border: '1px solid #bfdbfe', padding: '3px 10px', borderRadius: '20px', fontSize: '0.62rem', fontWeight: 800, color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>
      {text}
    </div>
  );
}

function CalloutBox({ text, color = '#2563eb' }) {
  return (
    <div style={{ background: `${color}08`, border: `1px solid ${color}30`, borderLeft: `3px solid ${color}`, borderRadius: '10px', padding: '12px 14px', marginBottom: '14px', fontSize: '0.82rem', color: '#334155', lineHeight: 1.55, fontStyle: 'italic' }}>
      {text}
    </div>
  );
}

function BulletPoints({ points }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '14px' }}>
      {points.map((p, i) => (
        <div key={i} style={{ display: 'flex', gap: '8px', fontSize: '0.8rem', color: '#334155', lineHeight: 1.5 }}>
          <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#2563eb', flexShrink: 0, marginTop: '6px' }} />
          <span>{p}</span>
        </div>
      ))}
    </div>
  );
}

function ContentCards({ cards }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px', marginBottom: '14px' }}>
      {cards.map((c, i) => (
        <div key={i} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '14px' }}>
          <h5 style={{ margin: '0 0 4px', fontSize: '0.82rem', fontWeight: 800, color: '#0f172a' }}>{c.title}</h5>
          <p style={{ margin: 0, fontSize: '0.76rem', color: '#475569', lineHeight: 1.5 }}>{c.desc}</p>
        </div>
      ))}
    </div>
  );
}

function InfoGraphicCards({ items }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '10px', marginBottom: '14px' }}>
      {items.map((item, i) => (
        <div key={i} style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '16px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
          <div style={{ fontSize: '1.6rem', fontWeight: 900, color: item.color, lineHeight: 1 }}>{item.stat}</div>
          <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '4px', lineHeight: 1.4 }}>{item.label}</div>
        </div>
      ))}
    </div>
  );
}

function BenefitGroups({ groups }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px', marginBottom: '14px' }}>
      {groups.map((g, i) => (
        <div key={i} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '14px' }}>
          <h5 style={{ margin: '0 0 8px', fontSize: '0.82rem', fontWeight: 800, color: '#0f172a' }}>{g.groupTitle}</h5>
          {g.items.map((item, j) => (
            <div key={j} style={{ display: 'flex', gap: '6px', fontSize: '0.76rem', color: '#475569', lineHeight: 1.5, marginBottom: '4px' }}>
              <CheckCircle2 size={13} color="#059669" style={{ flexShrink: 0, marginTop: '2px' }} />
              <span>{item}</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

function SolutionCards({ items }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '14px' }}>
      {items.map((s, i) => (
        <div key={i} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '14px' }}>
          <h5 style={{ margin: '0 0 4px', fontSize: '0.84rem', fontWeight: 800, color: '#0f172a' }}>{s.title}</h5>
          <p style={{ margin: '0 0 6px', fontSize: '0.76rem', color: '#475569', lineHeight: 1.5 }}>{s.desc}</p>
          <div style={{ display: 'inline-flex', background: '#ecfdf5', color: '#059669', border: '1px solid #a7f3d0', borderRadius: '6px', padding: '2px 8px', fontSize: '0.68rem', fontWeight: 700 }}>
            💡 Recommend when: {s.when}
          </div>
        </div>
      ))}
    </div>
  );
}

function ProcessFlow({ steps }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginBottom: '14px' }}>
      {steps.map((s, i) => (
        <div key={i}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', padding: '10px 12px', background: s.owner === 'You' ? '#eff6ff' : '#f8fafc', border: `1px solid ${s.owner === 'You' ? '#bfdbfe' : '#e2e8f0'}`, borderRadius: '10px' }}>
            <div style={{ width: '30px', height: '30px', borderRadius: '8px', background: s.owner === 'You' ? '#2563eb' : '#64748b', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 900, flexShrink: 0 }}>{s.step}</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                <h5 style={{ margin: 0, fontSize: '0.82rem', fontWeight: 800, color: '#0f172a' }}>{s.title}</h5>
                <span style={{ fontSize: '0.6rem', fontWeight: 800, padding: '1px 6px', borderRadius: '4px', background: s.owner === 'You' ? '#2563eb' : '#94a3b8', color: '#fff' }}>{s.owner}</span>
              </div>
              <p style={{ margin: 0, fontSize: '0.74rem', color: '#475569', lineHeight: 1.4 }}>{s.desc}</p>
            </div>
          </div>
          {i < steps.length - 1 && <div style={{ width: '2px', height: '8px', background: '#cbd5e1', margin: '0 0 0 26px' }} />}
        </div>
      ))}
    </div>
  );
}

function OpportunityCards({ items }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '14px' }}>
      {items.map((o, i) => (
        <div key={i} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '14px' }}>
          <h5 style={{ margin: '0 0 4px', fontSize: '0.82rem', fontWeight: 800, color: '#0f172a' }}>{o.title}</h5>
          <p style={{ margin: '0 0 6px', fontSize: '0.76rem', color: '#475569', lineHeight: 1.5 }}>{o.desc}</p>
          {o.example && (
            <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '8px', padding: '8px 10px', fontSize: '0.72rem', color: '#1e40af', fontStyle: 'italic', lineHeight: 1.4 }}>
              💬 {o.example}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function DecisionMakerCards({ items }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '14px' }}>
      {items.map((d, i) => (
        <div key={i} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '12px 14px' }}>
          <h5 style={{ margin: '0 0 2px', fontSize: '0.82rem', fontWeight: 800, color: '#0f172a' }}>{d.role}</h5>
          <div style={{ fontSize: '0.72rem', color: '#64748b', marginBottom: '4px' }}><strong>Cares about:</strong> {d.cares}</div>
          <div style={{ fontSize: '0.72rem', color: '#1e40af' }}>💡 <strong>Approach:</strong> {d.approach}</div>
        </div>
      ))}
    </div>
  );
}

function ConversationTemplates({ items }) {
  const [openIdx, setOpenIdx] = useState(0);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '14px' }}>
      {items.map((t, i) => (
        <div key={i} style={{ border: '1px solid #e2e8f0', borderRadius: '10px', overflow: 'hidden' }}>
          <button onClick={() => setOpenIdx(openIdx === i ? null : i)} style={{ width: '100%', padding: '10px 14px', background: openIdx === i ? '#eff6ff' : '#f8fafc', border: 'none', textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: 800, color: '#0f172a' }}>
            <span>📝 {t.method}</span>
            <ChevronDown size={14} style={{ transform: openIdx === i ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }} />
          </button>
          {openIdx === i && (
            <div style={{ padding: '12px 14px', borderTop: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.72rem', color: '#64748b', marginBottom: '6px' }}><strong>Scenario:</strong> {t.scenario}</div>
              <div style={{ background: '#f1f5f9', borderRadius: '8px', padding: '10px 12px', fontSize: '0.76rem', color: '#334155', lineHeight: 1.5, whiteSpace: 'pre-line', marginBottom: '6px', fontFamily: 'inherit' }}>
                {t.template}
              </div>
              <div style={{ fontSize: '0.72rem', color: '#059669', fontWeight: 700 }}>💡 Tip: {t.tip}</div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function ObjectionCards({ items }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '14px' }}>
      {items.map((o, i) => (
        <div key={i} style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden' }}>
          <div style={{ background: '#fef2f2', padding: '10px 14px', borderBottom: '1px solid #fecaca' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#dc2626' }}>🗣️ {o.objection}</span>
          </div>
          <div style={{ padding: '12px 14px' }}>
            <div style={{ fontSize: '0.78rem', color: '#334155', lineHeight: 1.5, marginBottom: '8px' }}>
              <strong style={{ color: '#059669' }}>✅ Your Response:</strong><br />{o.response}
            </div>
            <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '8px', padding: '6px 10px', fontSize: '0.72rem', color: '#1e40af' }}>
              🔄 <strong>Hand Off:</strong> {o.handoff}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function StepByStep({ steps }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginBottom: '14px' }}>
      {steps.map((s, i) => (
        <div key={i}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', padding: '10px 12px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#059669', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.72rem', fontWeight: 900, flexShrink: 0 }}>{s.step}</div>
            <div>
              <h5 style={{ margin: '0 0 2px', fontSize: '0.82rem', fontWeight: 800, color: '#0f172a' }}>{s.title}</h5>
              <p style={{ margin: 0, fontSize: '0.76rem', color: '#475569', lineHeight: 1.4 }}>{s.desc}</p>
            </div>
          </div>
          {i < steps.length - 1 && <div style={{ width: '2px', height: '6px', background: '#a7f3d0', margin: '0 0 0 24px' }} />}
        </div>
      ))}
    </div>
  );
}

function ConductRules({ items }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '14px' }}>
      {items.map((r, i) => (
        <div key={i} style={{ display: 'flex', gap: '10px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '12px' }}>
          <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: '#0f172a', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 900, flexShrink: 0 }}>⚖️</div>
          <div>
            <h5 style={{ margin: '0 0 2px', fontSize: '0.82rem', fontWeight: 800, color: '#0f172a' }}>{r.rule}</h5>
            <p style={{ margin: 0, fontSize: '0.76rem', color: '#475569', lineHeight: 1.4 }}>{r.desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function SupportChannels({ items }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px', marginBottom: '14px' }}>
      {items.map((s, i) => (
        <div key={i} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '12px' }}>
          <h5 style={{ margin: '0 0 4px', fontSize: '0.82rem', fontWeight: 800, color: '#0f172a' }}>{s.channel}</h5>
          <p style={{ margin: 0, fontSize: '0.74rem', color: '#475569', lineHeight: 1.4 }}>{s.detail}</p>
        </div>
      ))}
    </div>
  );
}

// ─── Generic Section Renderer ─────────────────────────────────────────────────

function renderSection(section, themeColor) {
  return (
    <div style={{ marginBottom: '20px' }}>
      <SectionBadge text={section.badge} />
      <h3 style={{ margin: '0 0 8px', fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.3 }}>{section.heading}</h3>
      {section.callout && <CalloutBox text={section.callout} color={themeColor} />}
      {section.points && <BulletPoints points={section.points} />}
      {section.cards && <ContentCards cards={section.cards} />}
      {section.infographicCards && <InfoGraphicCards items={section.infographicCards} />}
      {section.benefitGroups && <BenefitGroups groups={section.benefitGroups} />}
      {section.solutionCards && <SolutionCards items={section.solutionCards} />}
      {section.processFlow && <ProcessFlow steps={section.processFlow} />}
      {section.opportunityCards && <OpportunityCards items={section.opportunityCards} />}
      {section.decisionMakerCards && <DecisionMakerCards items={section.decisionMakerCards} />}
      {section.conversationTemplates && <ConversationTemplates items={section.conversationTemplates} />}
      {section.objectionCards && <ObjectionCards items={section.objectionCards} />}
      {section.stepByStep && <StepByStep steps={section.stepByStep} />}
      {section.conductRules && <ConductRules items={section.conductRules} />}
      {section.supportChannels && <SupportChannels items={section.supportChannels} />}
    </div>
  );
}

// ─── Module Viewer Component ──────────────────────────────────────────────────

function ModuleViewer({ module, isCompleted, onComplete, onPrevious, onNext, canGoNext, hasPrevious, isLast }) {
  const Icon = module.icon;
  const topRef = useRef(null);

  useEffect(() => {
    topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [module.moduleId]);

  return (
    <div ref={topRef} className="animate-fade-in" style={{ maxWidth: '820px', margin: '0 auto', padding: '20px 16px 60px' }}>
      {/* Module Header */}
      <div style={{
        background: `linear-gradient(135deg, ${module.themeColor}10 0%, ${module.themeColor}05 100%)`,
        border: `1px solid ${module.themeBorder}`,
        borderRadius: '16px',
        padding: '20px',
        marginBottom: '20px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
          <span style={{ fontSize: '0.62rem', fontWeight: 800, color: module.themeColor, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Module {module.moduleNumber} of {TOTAL_MODULES}
          </span>
          {isCompleted && <CheckCircle2 size={14} color="#059669" />}
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: module.themeBg, border: `1px solid ${module.themeBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: module.themeColor, flexShrink: 0 }}>
            <Icon size={20} />
          </div>
          <div style={{ flex: 1 }}>
            <h2 style={{ margin: '0 0 4px', fontSize: '1.2rem', fontWeight: 900, color: '#0f172a' }}>{module.title}</h2>
            <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b', lineHeight: 1.4 }}>{module.subtitle}</p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px', marginTop: '12px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.7rem', color: '#64748b' }}>
            <Clock size={13} /> {module.estimatedMinutes} min read
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.7rem', color: '#64748b' }}>
            <Target size={13} /> {module.objectives.length} learning objectives
          </div>
        </div>
      </div>

      {/* Learning Objectives */}
      <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '14px 16px', marginBottom: '20px' }}>
        <h4 style={{ margin: '0 0 8px', fontSize: '0.84rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Target size={15} color={module.themeColor} /> Learning Objectives
        </h4>
        {module.objectives.map((obj, i) => (
          <div key={i} style={{ display: 'flex', gap: '6px', fontSize: '0.78rem', color: '#334155', lineHeight: 1.5, marginBottom: '4px' }}>
            <CheckCircle2 size={14} color={module.themeColor} style={{ flexShrink: 0, marginTop: '2px' }} />
            <span>{obj}</span>
          </div>
        ))}
      </div>

      {/* Module Content Sections */}
      {module.sections.map((section, i) => (
        <div key={i}>{renderSection(section, module.themeColor)}</div>
      ))}

      {/* Key Takeaway */}
      <div style={{ background: `linear-gradient(135deg, ${module.themeColor}12 0%, ${module.themeColor}06 100%)`, border: `1px solid ${module.themeBorder}`, borderRadius: '14px', padding: '16px', marginBottom: '16px' }}>
        <h4 style={{ margin: '0 0 6px', fontSize: '0.84rem', fontWeight: 800, color: module.themeColor, display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Sparkles size={15} /> Key Takeaway
        </h4>
        <p style={{ margin: 0, fontSize: '0.8rem', color: '#334155', lineHeight: 1.5 }}>{module.takeaway}</p>
      </div>

      {/* Checklist */}
      {module.checklist && (
        <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '12px', padding: '14px', marginBottom: '20px' }}>
          <h4 style={{ margin: '0 0 8px', fontSize: '0.82rem', fontWeight: 800, color: '#059669' }}>✅ Before You Continue</h4>
          {module.checklist.map((item, i) => (
            <div key={i} style={{ display: 'flex', gap: '6px', fontSize: '0.78rem', color: '#065f46', lineHeight: 1.5, marginBottom: '3px' }}>
              <CheckCircle2 size={14} color="#059669" style={{ flexShrink: 0, marginTop: '2px' }} />
              <span>{item}</span>
            </div>
          ))}
        </div>
      )}

      {/* Navigation Buttons */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px', paddingTop: '8px' }}>
        {hasPrevious ? (
          <button onClick={onPrevious} style={{ padding: '8px 16px', borderRadius: '10px', border: '1px solid #cbd5e1', background: '#fff', color: '#475569', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ArrowLeft size={15} /> Previous Module
          </button>
        ) : <div />}

        {!isCompleted ? (
          <button onClick={onComplete} style={{
            padding: '10px 22px', borderRadius: '10px', border: 'none',
            background: `linear-gradient(135deg, ${module.themeColor} 0%, ${module.themeColor}dd 100%)`,
            color: '#fff', fontWeight: 800, fontSize: '0.84rem', cursor: 'pointer',
            boxShadow: `0 4px 12px ${module.themeColor}40`,
            display: 'flex', alignItems: 'center', gap: '6px'
          }}>
            Mark Complete & Continue <ArrowRight size={15} />
          </button>
        ) : canGoNext ? (
          <button onClick={onNext} style={{
            padding: '10px 22px', borderRadius: '10px', border: 'none',
            background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
            color: '#fff', fontWeight: 800, fontSize: '0.84rem', cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(5, 150, 105, 0.3)',
            display: 'flex', alignItems: 'center', gap: '6px'
          }}>
            {isLast ? 'Academy Complete! 🎓' : <>Next Module <ArrowRight size={15} /></>}
          </button>
        ) : (
          <div style={{ padding: '8px 16px', borderRadius: '10px', background: '#ecfdf5', color: '#059669', fontWeight: 800, fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <CheckCircle2 size={15} /> Module Completed
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main Academy Component ───────────────────────────────────────────────────

export default function CorporateLearningAcademy({ onBack }) {
  const userId = getCurrentUserId();
  const [loading, setLoading] = useState(true);
  const [activeModuleIdx, setActiveModuleIdx] = useState(0);
  const [completedIds, setCompletedIds] = useState([]);
  const [progressPercent, setProgressPercent] = useState(0);
  const [showSidebar, setShowSidebar] = useState(true);
  const [showCelebration, setShowCelebration] = useState(false);
  const moduleStartTime = useRef(Date.now());

  // Load progress from backend
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/api/corporate-program/learning/progress?userId=${encodeURIComponent(userId)}`);
        const json = await res.json();
        if (json.success) {
          const d = json.data;
          setCompletedIds(d.completedModuleIds || []);
          setProgressPercent(d.progressPercent || 0);
          // Resume at current module
          const idx = CORP_ACADEMY_MODULES.findIndex(m => m.moduleId === d.currentModuleId);
          if (idx >= 0) setActiveModuleIdx(idx);
        }
      } catch (err) {
        console.error('[CorporateLearningAcademy] Error loading progress:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, [userId]);

  const getTimeSpent = () => Math.floor((Date.now() - moduleStartTime.current) / 1000);

  const handleCompleteModule = async () => {
    const mod = CORP_ACADEMY_MODULES[activeModuleIdx];
    const timeSpent = getTimeSpent();
    try {
      const res = await fetch(`${API_BASE}/api/corporate-program/learning/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, moduleId: mod.moduleId, timeSpentSeconds: timeSpent })
      });
      const json = await res.json();
      if (json.success) {
        setCompletedIds(json.data.completedModuleIds || []);
        setProgressPercent(json.data.progressPercent || 0);
        setShowCelebration(true);
        setTimeout(() => {
          setShowCelebration(false);
          if (activeModuleIdx < TOTAL_MODULES - 1) {
            setActiveModuleIdx(activeModuleIdx + 1);
            moduleStartTime.current = Date.now();
          }
        }, 1500);
      }
    } catch (err) {
      console.error('[CorporateLearningAcademy] Error completing module:', err);
    }
  };

  const handleNavigate = async (idx) => {
    const mod = CORP_ACADEMY_MODULES[idx];
    // Check if allowed (must have completed all previous)
    const canAccess = idx === 0 || CORP_ACADEMY_MODULES.slice(0, idx).every(m => completedIds.includes(m.moduleId));
    if (!canAccess) return;

    const timeSpent = getTimeSpent();
    setActiveModuleIdx(idx);
    moduleStartTime.current = Date.now();

    try {
      await fetch(`${API_BASE}/api/corporate-program/learning/navigate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, moduleId: mod.moduleId, timeSpentSeconds: timeSpent })
      });
    } catch (err) {
      console.error('[CorporateLearningAcademy] Error navigating:', err);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', color: '#64748b', fontWeight: 700, fontSize: '0.9rem' }}>
        Loading Learning Academy...
      </div>
    );
  }

  const activeModule = CORP_ACADEMY_MODULES[activeModuleIdx];
  const isModuleCompleted = (id) => completedIds.includes(id);
  const canAccessModule = (idx) => idx === 0 || CORP_ACADEMY_MODULES.slice(0, idx).every(m => completedIds.includes(m.moduleId));

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc' }}>

      {/* Celebration Overlay */}
      {showCelebration && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 99999,
          background: 'rgba(5, 150, 105, 0.15)', backdropFilter: 'blur(3px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div style={{
            background: '#ffffff', borderRadius: '20px', padding: '32px 36px', textAlign: 'center',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.2)', animation: 'scaleUp 0.2s ease-out',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px'
          }}>
            <div style={{ fontSize: '3rem' }}>🎉</div>
            <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 900, color: '#059669' }}>Module Complete!</h3>
            <p style={{ margin: 0, fontSize: '0.84rem', color: '#64748b' }}>Great job! Moving to the next module...</p>
            <div style={{ width: '100%', height: '4px', borderRadius: '2px', background: '#e2e8f0', overflow: 'hidden' }}>
              <div style={{ width: `${progressPercent}%`, height: '100%', background: 'linear-gradient(90deg, #059669, #10b981)', borderRadius: '2px', transition: 'width 0.5s' }} />
            </div>
            <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#059669' }}>{progressPercent}% Complete</span>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <div style={{
        width: showSidebar ? '280px' : '0px',
        flexShrink: 0,
        background: '#ffffff',
        borderRight: '1px solid #e2e8f0',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        transition: 'width 0.2s',
        position: 'sticky',
        top: 0,
        height: '100vh'
      }}>
        {/* Sidebar Header */}
        <div style={{ padding: '14px 16px', borderBottom: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
              <GraduationCap size={15} />
            </div>
            <div>
              <div style={{ fontSize: '0.6rem', fontWeight: 800, color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Corporate Partner</div>
              <div style={{ fontSize: '0.84rem', fontWeight: 900, color: '#0f172a' }}>Learning Academy</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div style={{ marginTop: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.66rem', fontWeight: 700, color: '#64748b', marginBottom: '4px' }}>
              <span>{completedIds.length}/{TOTAL_MODULES} Modules</span>
              <span>{progressPercent}%</span>
            </div>
            <div style={{ width: '100%', height: '6px', borderRadius: '3px', background: '#e2e8f0', overflow: 'hidden' }}>
              <div style={{ width: `${progressPercent}%`, height: '100%', background: 'linear-gradient(90deg, #2563eb, #7c3aed)', borderRadius: '3px', transition: 'width 0.5s' }} />
            </div>
          </div>
        </div>

        {/* Module List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '8px' }}>
          {CORP_ACADEMY_MODULES.map((mod, idx) => {
            const Icon = mod.icon;
            const completed = isModuleCompleted(mod.moduleId);
            const accessible = canAccessModule(idx);
            const isActive = idx === activeModuleIdx;

            return (
              <button
                key={mod.moduleId}
                onClick={() => accessible && handleNavigate(idx)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '8px 10px',
                  marginBottom: '2px',
                  borderRadius: '10px',
                  border: 'none',
                  background: isActive ? '#eff6ff' : 'transparent',
                  cursor: accessible ? 'pointer' : 'not-allowed',
                  opacity: accessible ? 1 : 0.5,
                  textAlign: 'left',
                  transition: 'background 0.1s'
                }}
              >
                <div style={{
                  width: '26px', height: '26px', borderRadius: '8px', flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: completed ? '#ecfdf5' : isActive ? mod.themeBg : '#f1f5f9',
                  border: `1px solid ${completed ? '#a7f3d0' : isActive ? mod.themeBorder : '#e2e8f0'}`,
                  color: completed ? '#059669' : isActive ? mod.themeColor : '#94a3b8'
                }}>
                  {completed ? <CheckCircle2 size={13} /> : !accessible ? <Lock size={11} /> : <Icon size={13} />}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: isActive ? 800 : 600, color: isActive ? '#0f172a' : '#475569', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {mod.title}
                  </div>
                  <div style={{ fontSize: '0.6rem', color: '#94a3b8' }}>{mod.estimatedMinutes} min</div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Back Button */}
        <div style={{ padding: '10px 12px', borderTop: '1px solid #e2e8f0' }}>
          <button onClick={onBack} style={{
            width: '100%', padding: '7px', borderRadius: '8px', border: '1px solid #cbd5e1',
            background: '#fff', color: '#475569', fontWeight: 700, fontSize: '0.74rem', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
          }}>
            <ArrowLeft size={13} /> Back to Program
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Top Bar */}
        <div style={{
          background: '#ffffff', borderBottom: '1px solid #e2e8f0',
          padding: '10px 20px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          position: 'sticky', top: 0, zIndex: 50
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button onClick={() => setShowSidebar(!showSidebar)} style={{
              width: '28px', height: '28px', borderRadius: '6px', border: '1px solid #e2e8f0',
              background: '#f8fafc', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b'
            }}>
              <BookOpen size={14} />
            </button>
            <div>
              <span style={{ fontSize: '0.64rem', fontWeight: 800, color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Module {activeModule.moduleNumber}
              </span>
              <h3 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 800, color: '#0f172a' }}>{activeModule.title}</h3>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.72rem', fontWeight: 700, color: '#059669' }}>
              <BarChart3 size={14} /> {progressPercent}% Complete
            </div>
            {isModuleCompleted(activeModule.moduleId) && (
              <span style={{ background: '#ecfdf5', color: '#059669', border: '1px solid #a7f3d0', padding: '2px 8px', borderRadius: '6px', fontSize: '0.66rem', fontWeight: 800 }}>
                ✅ Completed
              </span>
            )}
          </div>
        </div>

        {/* Module Content */}
        <ModuleViewer
          module={activeModule}
          isCompleted={isModuleCompleted(activeModule.moduleId)}
          onComplete={handleCompleteModule}
          onPrevious={() => handleNavigate(activeModuleIdx - 1)}
          onNext={() => activeModuleIdx < TOTAL_MODULES - 1 && handleNavigate(activeModuleIdx + 1)}
          canGoNext={activeModuleIdx < TOTAL_MODULES - 1 && canAccessModule(activeModuleIdx + 1)}
          hasPrevious={activeModuleIdx > 0}
          isLast={activeModuleIdx === TOTAL_MODULES - 1}
        />
      </div>
    </div>
  );
}
