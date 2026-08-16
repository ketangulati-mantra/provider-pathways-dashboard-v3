import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as THREE from 'three';
import {
  Sparkles,
  TrendingUp,
  Award,
  CheckCircle2,
  Zap,
  Star,
  BarChart3,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Check,
  SkipForward,
  Info,
  Share2
} from 'lucide-react';
import { completeLesson } from '../mantra/api';
import { handleExit, goBack, goToDashboard } from '../mantra/navigation';
import { useLessonCompletion } from '../hooks/useLessonCompletion';
import { CompletionScreen } from '../components';

gsap.registerPlugin(ScrollTrigger);

const LESSON_ID = 'growth-journey';
const MANTRA_LOGO_URL = 'https://res.cloudinary.com/hxbamdqf/image/upload/v1784698269/Mantra_logo_yptwwe.svg';

// ------------------------------------------------------------------------------
// DESIGN TOKENS
// ------------------------------------------------------------------------------
const TOKENS = {
  bg: '#FAFBFD',
  ink: '#0B1220',
  sub: '#5B667A',
  line: 'rgba(15, 23, 42, 0.08)',
  indigo: '#2F5FFF',
  indigoDeep: '#13245C',
  emerald: '#0EA772',
  amber: '#D97706',
  violet: '#7C5CFF',
  sky: '#0284C7'
};

// The five stages of the journey — this array is the single source of truth.
// It drives the hero flow chips, the 3D lattice nodes, and the live accent
// color of the whole page as the reader scrolls through each section.
const STAGES = [
  { key: 'activities', title: 'Activities', icon: Zap, color: TOKENS.indigo, rgb: '47,95,255' },
  { key: 'points', title: 'Points', icon: Star, color: TOKENS.amber, rgb: '217,119,6' },
  { key: 'score', title: 'Score', icon: BarChart3, color: TOKENS.emerald, rgb: '14,167,114' },
  { key: 'rank', title: 'Rank', icon: Award, color: TOKENS.violet, rgb: '124,92,255' },
  { key: 'growth', title: 'Growth', icon: TrendingUp, color: TOKENS.sky, rgb: '2,132,199' }
];

// ------------------------------------------------------------------------------
// SIGNATURE VISUAL — "ASCENSION LATTICE"
// A vertical spine of five glowing nodes, one per stage of the journey.
// GSAP's ScrollTrigger scrubs the camera up the spine as the reader scrolls;
// each node ignites in sequence and the whole page's accent color shifts to
// match. A soft particle field drifts around the spine for depth. This is a
// live WebGL scene (three.js), not a canned globe — it's built directly from
// the STAGES data so it can never drift out of sync with the content.
// ------------------------------------------------------------------------------
function GrowthLatticeScene({ containerRef, isMobile, onStageChange }) {
  const canvasRef = useRef(null);
  const wrapRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap || !containerRef.current) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let destroyed = false;
    let width = wrap.clientWidth;
    let height = wrap.clientHeight;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(width, height, false);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 0, 9);

    scene.add(new THREE.AmbientLight(0xffffff, 0.55));
    const keyLight = new THREE.PointLight(0xffffff, 1.1, 40);
    keyLight.position.set(4, 4, 6);
    scene.add(keyLight);

    // Spine — a thin, faint tube running the length of the journey
    const spineCurve = new THREE.LineCurve3(new THREE.Vector3(0, -6, 0), new THREE.Vector3(0, 6, 0));
    const spineGeo = new THREE.TubeGeometry(spineCurve, 20, 0.012, 6, false);
    const spineMat = new THREE.MeshBasicMaterial({ color: 0x2f5fff, transparent: true, opacity: 0.16 });
    scene.add(new THREE.Mesh(spineGeo, spineMat));

    // Nodes — one icosahedron per stage, evenly spaced along the spine
    const nodeSpan = 4.6;
    const nodes = STAGES.map((stage, i) => {
      const t = STAGES.length === 1 ? 0 : i / (STAGES.length - 1);
      const y = -nodeSpan + t * nodeSpan * 2;
      const color = new THREE.Color(stage.color);

      const geo = new THREE.IcosahedronGeometry(0.34, 1);
      const mat = new THREE.MeshStandardMaterial({
        color,
        emissive: color,
        emissiveIntensity: 0.12,
        roughness: 0.35,
        metalness: 0.1,
        transparent: true,
        opacity: 0.35
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(0, y, 0);
      scene.add(mesh);

      // Wireframe halo for a bit of premium "engineered" texture
      const halo = new THREE.Mesh(
        new THREE.IcosahedronGeometry(0.5, 1),
        new THREE.MeshBasicMaterial({ color, wireframe: true, transparent: true, opacity: 0.12 })
      );
      halo.position.copy(mesh.position);
      scene.add(halo);

      return { mesh, mat, halo, y, color };
    });

    // Ambient particle field around the spine
    const particleCount = isMobile ? 180 : 340;
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const radius = 2.2 + Math.random() * 3.4;
      const theta = Math.random() * Math.PI * 2;
      const y = (Math.random() - 0.5) * 13;
      positions[i * 3] = Math.cos(theta) * radius;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = Math.sin(theta) * radius;
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x8fa6ff,
      size: 0.028,
      transparent: true,
      opacity: 0.5,
      sizeAttenuation: true
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    const state = { progress: 0, rotation: 0 };

    const resize = () => {
      if (destroyed) return;
      width = wrap.clientWidth;
      height = wrap.clientHeight;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', resize);

    // GSAP owns the scroll-to-3D mapping: as the reader moves through the
    // page, `progress` sweeps 0→1 and drives camera position + node ignition.
    const trigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.6,
      onUpdate: (self) => {
        state.progress = self.progress;
        const stageIndex = Math.min(STAGES.length - 1, Math.floor(self.progress * STAGES.length));
        onStageChange(stageIndex);
      }
    });

    let raf;
    const clock = new THREE.Clock();
    const animate = () => {
      if (destroyed) return;
      const dt = clock.getDelta();

      // Camera travels up the spine and orbits gently for parallax depth
      const targetY = -nodeSpan + state.progress * nodeSpan * 2;
      camera.position.y += (targetY - camera.position.y) * 0.06;
      if (!prefersReducedMotion) state.rotation += dt * 0.08;
      camera.position.x = Math.sin(state.rotation) * 6.6;
      camera.position.z = Math.cos(state.rotation) * 6.6;
      camera.lookAt(0, camera.position.y, 0);

      // Ignite nodes as the camera passes them
      const activeFloat = state.progress * (STAGES.length - 1);
      nodes.forEach((node, i) => {
        const dist = Math.abs(activeFloat - i);
        const lit = Math.max(0, 1 - dist);
        const scale = 1 + lit * 0.55;
        node.mesh.scale.setScalar(scale);
        node.halo.scale.setScalar(scale);
        node.mat.emissiveIntensity = 0.12 + lit * 1.4;
        node.mat.opacity = 0.35 + lit * 0.55;
        if (!prefersReducedMotion) {
          node.mesh.rotation.y += dt * (0.3 + lit * 0.6);
          node.halo.rotation.y -= dt * 0.15;
        }
      });

      if (!prefersReducedMotion) particles.rotation.y += dt * 0.012;

      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      destroyed = true;
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      trigger.kill();
      spineGeo.dispose();
      spineMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      nodes.forEach((n) => {
        n.mesh.geometry.dispose();
        n.mat.dispose();
        n.halo.geometry.dispose();
        n.halo.material.dispose();
      });
      renderer.dispose();
    };
  }, [containerRef, isMobile, onStageChange]);

  return (
    <div
      ref={wrapRef}
      aria-hidden
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1,
        pointerEvents: 'none'
      }}
    >
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />
    </div>
  );
}

// ------------------------------------------------------------------------------
// SMALL UI PRIMITIVES
// ------------------------------------------------------------------------------
function Reveal({ children, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.65, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

function SectionCard({ children, style, ...rest }) {
  return (
    <motion.section
      whileHover={{ y: -2 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      style={{
        background: 'rgba(255,255,255,0.86)',
        backdropFilter: 'blur(14px) saturate(160%)',
        border: `1px solid ${TOKENS.line}`,
        borderRadius: '28px',
        boxShadow: '0 1px 2px rgba(15,23,42,0.04), 0 24px 48px -30px rgba(15,23,42,0.22)',
        ...style
      }}
      {...rest}
    >
      {children}
    </motion.section>
  );
}

function Eyebrow({ children, color = TOKENS.indigo, bg = 'rgba(47,95,255,0.08)' }) {
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '7px',
        padding: '5px 14px',
        borderRadius: '999px',
        background: bg,
        color,
        fontSize: '0.72rem',
        fontWeight: 700,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        fontFamily: "'JetBrains Mono', ui-monospace, monospace"
      }}
    >
      {children}
    </div>
  );
}

function ScoreRing({ progress, size = 128, stroke = 8, color = TOKENS.emerald, track = 'rgba(14,167,114,0.12)' }) {
  const r = (size - stroke) / 2;
  const circumference = 2 * Math.PI * r;
  const dash = useTransform(progress, (v) => circumference * (1 - v));
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)', flexShrink: 0 }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={track} strokeWidth={stroke} />
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={circumference}
        style={{ strokeDashoffset: dash }}
      />
    </svg>
  );
}

// Magnetic CTA — the button leans toward the cursor within a small radius.
// One deliberate flourish, kept to the single button on the page.
function MagneticButton({ children, style, ...rest }) {
  const ref = useRef(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const relX = e.clientX - (rect.left + rect.width / 2);
    const relY = e.clientY - (rect.top + rect.height / 2);
    setOffset({ x: relX * 0.14, y: relY * 0.22 });
  };
  const handleLeave = () => setOffset({ x: 0, y: 0 });

  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      animate={{ x: offset.x, y: offset.y }}
      transition={{ type: 'spring', stiffness: 200, damping: 18, mass: 0.4 }}
      whileTap={{ scale: 0.97 }}
      className="mgj-btn"
      style={style}
      {...rest}
    >
      {children}
    </motion.button>
  );
}

// ------------------------------------------------------------------------------
// MAIN PAGE
// ------------------------------------------------------------------------------
export default function MantraGrowthJourneyPage({ onBack }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completionError, setCompletionError] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [activeStage, setActiveStage] = useState(0);

  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 90, damping: 25, restDelta: 0.001 });

  const scoreProgress = useTransform(smoothProgress, [0.32, 0.6], [0, 1]);
  const scoreValue = useTransform(scoreProgress, [0, 1], [0, 750]);
  const [displayScore, setDisplayScore] = useState(0);

  const accent = STAGES[activeStage];

  const {
    lessonProgress,
    showCelebrate,
    handleCloseCelebration,
    handleActionComplete
  } = useLessonCompletion(LESSON_ID, onBack, {
    hasVideo: false,
    hasQuiz: false,
    hasAction: true
  });

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const unsubscribe = scoreValue.on('change', (val) => setDisplayScore(Math.round(val)));
    return () => unsubscribe();
  }, [scoreValue]);

  // Page-load choreography
  const heroRef = useRef(null);
  useEffect(() => {
    if (!heroRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.mgj-hero-el',
        { opacity: 0, y: 22 },
        { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', stagger: 0.09, delay: 0.1 }
      );
    }, heroRef);
    return () => ctx.revert();
  }, []);

  const heroOpacity = useTransform(smoothProgress, [0, 0.1, 0.22], [1, 1, 0]);
  const heroY = useTransform(smoothProgress, [0, 0.22], [0, -40]);

  const handleProceedToActivities = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setCompletionError(null);
    try {
      await handleActionComplete();
    } catch (err) {
      console.error('[Mantra] Completion error:', err);
      setCompletionError('Connection error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      ref={containerRef}
      style={{
        minHeight: '270vh',
        background: TOKENS.bg,
        color: TOKENS.ink,
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        position: 'relative',
        overflowX: 'hidden',
        '--accent': accent.color,
        '--accent-rgb': accent.rgb
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@500;600;700&family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;700&display=swap');
        .mgj-btn { position: relative; overflow: hidden; transition: background 0.4s ease; }
        .mgj-btn::after {
          content: '';
          position: absolute;
          top: 0; left: -60%;
          width: 40%; height: 100%;
          background: linear-gradient(120deg, transparent, rgba(19,36,92,0.16), transparent);
          transform: skewX(-20deg);
          transition: left 0.7s ease;
        }
        .mgj-btn:hover::after { left: 130%; }
        .mgj-btn:focus-visible, .mgj-back:focus-visible { outline: 2px solid ${TOKENS.indigo}; outline-offset: 3px; }
        .mgj-progress { transition: background 0.6s ease; }
        @media (prefers-reduced-motion: reduce) { .mgj-anim { animation: none !important; transition: none !important; } }
      `}</style>

      {/* Ultra-subtle film grain for depth */}
      <div
        aria-hidden
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 0,
          pointerEvents: 'none',
          opacity: 0.035,
          mixBlendMode: 'multiply',
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")"
        }}
      />

      {/* LAYER 1 — SIGNATURE VISUAL: the ascension lattice, live for the whole scroll */}
      <GrowthLatticeScene containerRef={containerRef} isMobile={isMobile} onStageChange={setActiveStage} />

      {/* LAYER 2 — STICKY NAV */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          background: 'rgba(250, 251, 253, 0.82)',
          backdropFilter: 'blur(18px) saturate(160%)',
          borderBottom: `1px solid ${TOKENS.line}`,
          padding: '14px 24px'
        }}
      >
        <div
          style={{
            maxWidth: '1200px',
            width: '94%',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px'
          }}
        >
          <motion.button
            whileHover={{ x: -2 }}
            whileTap={{ scale: 0.96 }}
            className="mgj-back"
            onClick={() => goBack(onBack)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: '#FFFFFF',
              border: `1px solid ${TOKENS.line}`,
              borderRadius: '10px',
              padding: '7px 16px',
              color: TOKENS.sub,
              fontWeight: 600,
              fontSize: '0.84rem',
              cursor: 'pointer',
              boxShadow: '0 1px 2px rgba(15,23,42,0.04)'
            }}
          >
            <ArrowLeft size={16} /> Back
          </motion.button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1, maxWidth: '420px', margin: '0 16px' }}>
            <img src={MANTRA_LOGO_URL} alt="Mantra Logo" style={{ height: '22px', display: 'block' }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.86rem', fontWeight: 700, color: TOKENS.ink, fontFamily: "'Instrument Sans', sans-serif" }}>
                Growth Journey
              </div>
              <div style={{ height: '3px', background: TOKENS.line, borderRadius: '999px', overflow: 'hidden', marginTop: '4px', position: 'relative' }}>
                <motion.div
                  className="mgj-progress"
                  style={{
                    height: '100%',
                    background: `linear-gradient(90deg, ${accent.color} 0%, ${TOKENS.emerald} 100%)`,
                    borderRadius: '999px',
                    scaleX: smoothProgress,
                    transformOrigin: '0%'
                  }}
                />
              </div>
            </div>
          </div>

          <button
            onClick={() => handleExit()}
            style={{ background: 'none', border: 'none', color: TOKENS.sub, fontWeight: 600, fontSize: '0.84rem', cursor: 'pointer' }}
          >
            Exit
          </button>
        </div>
      </header>

      {/* LAYER 3 — HERO */}
      <motion.section
        ref={heroRef}
        style={{
          position: 'relative',
          zIndex: 10,
          opacity: heroOpacity,
          y: heroY,
          maxWidth: '1200px',
          width: isMobile ? '100%' : '90%',
          margin: '0 auto',
          padding: isMobile ? '54px 20px 40px' : '96px 24px 64px',
          boxSizing: 'border-box'
        }}
      >
        <div className="mgj-hero-el">
          <Eyebrow>
            <Sparkles size={11} style={{ marginRight: '2px' }} /> Provider Activation
          </Eyebrow>
        </div>

        <h1
          className="mgj-hero-el"
          style={{
            fontFamily: "'Instrument Sans', sans-serif",
            fontSize: isMobile ? '2.4rem' : '4.2rem',
            fontWeight: 700,
            lineHeight: 1.02,
            margin: '18px 0 20px 0',
            color: TOKENS.ink,
            letterSpacing: '-0.03em',
            maxWidth: '620px'
          }}
        >
          Build your presence on{' '}
          <span style={{ background: `linear-gradient(100deg, ${TOKENS.indigo}, ${TOKENS.violet})`, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>
            Mantra.
          </span>
        </h1>

        <p
          className="mgj-hero-el"
          style={{
            fontSize: isMobile ? '1rem' : '1.2rem',
            color: TOKENS.sub,
            maxWidth: '480px',
            margin: '0 0 40px 0',
            fontWeight: 500,
            lineHeight: 1.55
          }}
        >
          Every activity you complete strengthens your score, your rank, and how visible you
          are to the clients comparing providers right now.
        </p>

        <div
          className="mgj-hero-el"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: isMobile ? '8px' : '16px',
            flexWrap: 'wrap',
            background: 'rgba(255,255,255,0.7)',
            backdropFilter: 'blur(10px)',
            padding: '14px 22px',
            borderRadius: '16px',
            border: `1px solid ${TOKENS.line}`
          }}
        >
          {STAGES.map((item, idx) => {
            const Icon = item.icon;
            const isActive = idx === activeStage;
            return (
              <React.Fragment key={item.title}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '7px',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    color: isActive ? item.color : TOKENS.ink,
                    transition: 'color 0.4s ease'
                  }}
                >
                  <Icon size={15} color={item.color} />
                  <span>{item.title}</span>
                </div>
                {idx < STAGES.length - 1 && <span style={{ color: '#B6BECC', fontSize: '0.85rem' }}>→</span>}
              </React.Fragment>
            );
          })}
        </div>
      </motion.section>

      {/* LAYER 4 — CONTENT SECTIONS */}
      <main
        style={{
          position: 'relative',
          zIndex: 10,
          maxWidth: '1200px',
          width: isMobile ? '100%' : '90%',
          margin: '0 auto',
          padding: isMobile ? '0 16px 48px' : '0 24px 72px',
          boxSizing: 'border-box'
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '20px' : '24px' }}>
          {/* WHAT ARE ACTIVITIES */}
          <Reveal>
            <SectionCard style={{ padding: isMobile ? '28px 20px' : '44px 48px' }}>
              <div style={{ marginBottom: '28px', maxWidth: '520px' }}>
                <h2 style={{ fontFamily: "'Instrument Sans', sans-serif", fontSize: isMobile ? '1.5rem' : '1.9rem', fontWeight: 700, color: TOKENS.ink, margin: '0 0 10px 0', letterSpacing: '-0.02em' }}>
                  What are activities?
                </h2>
                <p style={{ fontSize: '0.96rem', color: TOKENS.sub, fontWeight: 500, lineHeight: 1.5, margin: 0 }}>
                  Simple, concrete actions — the building blocks of a stronger profile.
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: '14px' }}>
                {[
                  { title: 'Complete', desc: 'Earn points by completing activities.', icon: CheckCircle2, color: TOKENS.indigo },
                  { title: 'Improve', desc: 'Strengthen your profile and presence.', icon: Share2, color: TOKENS.amber },
                  { title: 'Grow', desc: 'Build a stronger profile over time.', icon: TrendingUp, color: TOKENS.emerald }
                ].map((ex) => {
                  const Icon = ex.icon;
                  return (
                    <motion.div
                      key={ex.title}
                      whileHover={{ y: -3, borderColor: ex.color + '55' }}
                      style={{
                        background: TOKENS.bg,
                        border: `1px solid ${TOKENS.line}`,
                        borderRadius: '18px',
                        padding: '22px 20px',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '14px'
                      }}
                    >
                      <div style={{ width: '38px', height: '38px', borderRadius: '11px', background: '#FFFFFF', color: ex.color, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${TOKENS.line}`, flexShrink: 0 }}>
                        <Icon size={18} />
                      </div>
                      <div>
                        <div style={{ fontSize: '0.94rem', fontWeight: 700, color: TOKENS.ink, marginBottom: '3px' }}>{ex.title}</div>
                        <div style={{ fontSize: '0.82rem', color: TOKENS.sub, lineHeight: 1.4 }}>{ex.desc}</div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </SectionCard>
          </Reveal>

          {/* WHY SCORE MATTERS */}
          <Reveal delay={0.05}>
            <SectionCard style={{ padding: isMobile ? '28px 20px' : '44px 48px' }}>
              <div style={{ marginBottom: '26px', maxWidth: '560px' }}>
                <h2 style={{ fontFamily: "'Instrument Sans', sans-serif", fontSize: isMobile ? '1.5rem' : '1.9rem', fontWeight: 700, color: TOKENS.ink, margin: '0 0 10px 0', letterSpacing: '-0.02em' }}>
                  Why your score matters
                </h2>
                <p style={{ fontSize: '0.94rem', color: TOKENS.sub, fontWeight: 500, lineHeight: 1.55, margin: 0 }}>
                  Your score reflects the activity you complete on Mantra. Completing more
                  meaningful activities can increase your score and show clients that your
                  profile is active and complete.
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1.1fr 1fr', gap: '18px' }}>
                <div
                  style={{
                    background: `linear-gradient(150deg, #FFFFFF 0%, ${TOKENS.bg} 100%)`,
                    border: `1px solid ${TOKENS.line}`,
                    borderRadius: '22px',
                    padding: '28px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '20px',
                    flexWrap: 'wrap'
                  }}
                >
                  <ScoreRing progress={scoreProgress} size={isMobile ? 96 : 116} />
                  <div>
                    <Eyebrow color={TOKENS.emerald} bg="rgba(14,167,114,0.08)">Building Score</Eyebrow>
                    <div style={{ fontFamily: "'JetBrains Mono', ui-monospace, monospace", fontSize: isMobile ? '2.2rem' : '2.7rem', fontWeight: 700, color: TOKENS.ink, lineHeight: 1, marginTop: '14px' }}>
                      {displayScore}
                      <span style={{ fontSize: '0.95rem', color: TOKENS.sub, fontWeight: 600, marginLeft: '6px' }}>pts</span>
                    </div>
                    <div style={{ fontSize: '0.82rem', color: TOKENS.sub, marginTop: '8px', fontWeight: 500 }}>
                      Points contribute to your overall score
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    background: TOKENS.indigoDeep,
                    borderRadius: '22px',
                    padding: '28px',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  <div style={{ fontSize: '0.92rem', color: '#DCE4FF', fontWeight: 500, lineHeight: 1.55 }}>
                    A stronger, more complete profile helps you stand out when clients compare
                    providers side by side.
                  </div>
                </div>
              </div>
            </SectionCard>
          </Reveal>

          {/* RANK */}
          <Reveal delay={0.05}>
            <SectionCard style={{ padding: isMobile ? '28px 20px' : '40px 48px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr auto', gap: '20px', alignItems: 'center' }}>
                <div>
                  <h2 style={{ fontFamily: "'Instrument Sans', sans-serif", fontSize: isMobile ? '1.4rem' : '1.7rem', fontWeight: 700, color: TOKENS.ink, margin: '0 0 8px 0', letterSpacing: '-0.02em' }}>
                    Your rank
                  </h2>
                  <p style={{ fontSize: '0.92rem', color: TOKENS.sub, fontWeight: 500, lineHeight: 1.5, margin: 0, maxWidth: '460px' }}>
                    Your rank shows how your progress compares with other providers on Mantra.
                    Building your score can help improve your standing over time.
                  </p>
                </div>
                <div
                  style={{
                    background: 'rgba(124,92,255,0.06)',
                    border: '1px solid rgba(124,92,255,0.18)',
                    borderRadius: '16px',
                    padding: '14px 22px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    whiteSpace: 'nowrap'
                  }}
                >
                  <Award size={18} color={TOKENS.violet} />
                  <span style={{ fontSize: '0.86rem', fontWeight: 700, color: TOKENS.violet }}>Peer-relative standing</span>
                </div>
              </div>
            </SectionCard>
          </Reveal>

          {/* SKIP */}
          <Reveal delay={0.05}>
            <SectionCard
              style={{
                background: '#FFFCF5',
                border: '1px solid rgba(217,119,6,0.22)',
                padding: isMobile ? '26px 20px' : '32px 44px'
              }}
            >
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '24px', alignItems: 'center' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <SkipForward size={18} color={TOKENS.amber} />
                    <h2 style={{ fontFamily: "'Instrument Sans', sans-serif", fontSize: isMobile ? '1.25rem' : '1.4rem', fontWeight: 700, color: '#78350F', margin: 0 }}>
                      Some activities can be skipped
                    </h2>
                  </div>
                  <p style={{ fontSize: '0.88rem', color: '#92400E', lineHeight: 1.5, margin: '0 0 14px 0', fontWeight: 500 }}>
                    Optional activities can be skipped in favor of a replacement — no penalty
                    beyond the points you'd have earned.
                  </p>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#FEF2F2', border: '1px solid #FECACA', padding: '6px 12px', borderRadius: '999px', color: '#DC2626', fontSize: '0.76rem', fontWeight: 700 }}>
                    <Info size={13} /> Skipped activities do not earn points
                  </div>
                </div>

                <div
                  style={{
                    background: '#FFFFFF',
                    border: '1px solid rgba(217,119,6,0.2)',
                    borderRadius: '18px',
                    padding: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '8px'
                  }}
                >
                  {[
                    { title: 'Activity', desc: 'Current', color: TOKENS.ink },
                    { title: 'Skip', desc: '0 points', color: '#DC2626' },
                    { title: 'New activity', desc: 'Replacement', color: TOKENS.indigo }
                  ].map((s, idx) => (
                    <React.Fragment key={s.title}>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '0.78rem', fontWeight: 700, color: s.color }}>{s.title}</div>
                        <div style={{ fontSize: '0.68rem', color: '#94A3B8', fontWeight: 500 }}>{s.desc}</div>
                      </div>
                      {idx < 2 && <span style={{ color: TOKENS.amber, fontSize: '0.8rem' }}>→</span>}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </SectionCard>
          </Reveal>

          {/* CTA — the only button on the page */}
          <Reveal delay={0.08}>
            <SectionCard
              style={{
                background: `linear-gradient(135deg, ${TOKENS.indigoDeep} 0%, ${TOKENS.indigo} 100%)`,
                border: 'none',
                padding: isMobile ? '36px 22px' : '56px 48px',
                textAlign: 'center',
                boxShadow: '0 20px 44px -14px rgba(47,95,255,0.4)'
              }}
            >
              <h2 style={{ fontFamily: "'Instrument Sans', sans-serif", fontSize: isMobile ? '1.7rem' : '2.4rem', fontWeight: 700, color: '#FFFFFF', margin: '0 0 10px 0', letterSpacing: '-0.02em' }}>
                Ready to build your presence?
              </h2>
              <p style={{ fontSize: '0.98rem', color: '#C7D4FF', margin: '0 0 32px 0', fontWeight: 500 }}>
                Complete activities, earn points, and keep building your profile on Mantra.
              </p>

              {completionError && (
                <div
                  style={{
                    padding: '10px 16px',
                    borderRadius: '10px',
                    background: 'rgba(239,68,68,0.18)',
                    border: '1px solid rgba(239,68,68,0.35)',
                    color: '#FECACA',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    marginBottom: '20px',
                    maxWidth: '400px',
                    marginLeft: 'auto',
                    marginRight: 'auto'
                  }}
                >
                  {completionError}
                </div>
              )}

              <MagneticButton
                onClick={handleProceedToActivities}
                disabled={isSubmitting}
                style={{
                  width: isMobile ? '100%' : 'auto',
                  padding: '17px 46px',
                  borderRadius: '14px',
                  border: 'none',
                  background: '#FFFFFF',
                  color: TOKENS.indigoDeep,
                  fontWeight: 700,
                  fontSize: '1.02rem',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  boxShadow: '0 10px 26px rgba(0,0,0,0.2)',
                  opacity: isSubmitting ? 0.85 : 1
                }}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" /> Completing…
                  </>
                ) : (
                  <>
                    Proceed to activities <ArrowRight size={18} />
                  </>
                )}
              </MagneticButton>
            </SectionCard>
          </Reveal>
        </div>
      </main>

      {/* Completion Celebration Overlay Screen */}
      {showCelebrate && (
        <CompletionScreen
          lessonId={LESSON_ID}
          rewardPoints={25}
          onClose={handleCloseCelebration}
        />
      )}
    </div>
  );
}