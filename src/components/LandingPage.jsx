import React, { useRef, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import * as THREE from 'three';
import { ArrowRight, BadgeIndianRupee, Bot, Check, Eye, Globe, Link2, Pencil, Rocket, X, Zap } from 'lucide-react';
import Login from './Login';

// ─── Shader Hero (21st.dev style) ───────────────────────────────────────────
function ShaderHero() {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;

    const vertexShader = `
      void main() {
        gl_Position = vec4(position, 1.0);
      }
    `;

    const fragmentShader = `
      #define TWO_PI 6.2831853072
      #define PI 3.14159265359

      precision highp float;
      uniform vec2 resolution;
      uniform float time;

      void main(void) {
        vec2 uv = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);
        float t = time * 0.05;
        float lineWidth = 0.003;

        vec3 color = vec3(0.0);
        for(int j = 0; j < 3; j++){
          for(int i = 0; i < 5; i++){
            color[j] += lineWidth * float(i * i) / abs(
              fract(t - 0.01 * float(j) + float(i) * 0.01) * 5.0
              - length(uv)
              + mod(uv.x + uv.y, 0.2)
            );
          }
        }

        // Boost brightness significantly + tint cyan/teal
        vec3 boosted = color * 3.0;
        vec3 tinted = vec3(boosted[0] * 0.3 + boosted[2] * 0.7, boosted[1] * 0.7 + boosted[2] * 0.5, boosted[2]);
        gl_FragColor = vec4(tinted, 1.0);
      }
    `;

    const camera = new THREE.Camera();
    camera.position.z = 1;
    const scene = new THREE.Scene();
    const geometry = new THREE.PlaneGeometry(2, 2);

    const uniforms = {
      time: { type: 'f', value: 1.0 },
      resolution: { type: 'v2', value: new THREE.Vector2() },
    };

    const material = new THREE.ShaderMaterial({ uniforms, vertexShader, fragmentShader });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    const onResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      renderer.setSize(w, h);
      uniforms.resolution.value.x = renderer.domElement.width;
      uniforms.resolution.value.y = renderer.domElement.height;
    };
    onResize();
    window.addEventListener('resize', onResize);

    let animId;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      uniforms.time.value += 0.05;
      renderer.render(scene, camera);
    };
    sceneRef.current = { renderer };
    animate();

    return () => {
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(animId);
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
    };
  }, []);

  return <div ref={containerRef} className="absolute inset-0 w-full h-full" style={{ overflow: 'hidden' }} />;
}

// ─── Floating Particles ──────────────────────────────────────────────────────
function Particles() {
  const particles = Array.from({ length: 35 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    duration: Math.random() * 8 + 4,
    delay: Math.random() * 4,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-cyan-400/40"
          style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size }}
          animate={{ y: [0, -30, 0], opacity: [0, 0.9, 0], scale: [0, 1, 0] }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
}

// ─── Animated Badge ──────────────────────────────────────────────────────────
function Badge() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/30 rounded-full px-4 py-1.5 mb-8"
    >
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500" />
      </span>
      <span className="text-cyan-400 text-sm font-medium tracking-wide">AI-Powered Website Builder</span>
    </motion.div>
  );
}

// ─── Typing Effect ───────────────────────────────────────────────────────────
function TypingText({ words }) {
  const [index, setIndex] = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const word = words[index];
    let timeout;
    if (!deleting && displayed.length < word.length) {
      timeout = setTimeout(() => setDisplayed(word.slice(0, displayed.length + 1)), 80);
    } else if (!deleting && displayed.length === word.length) {
      timeout = setTimeout(() => setDeleting(true), 2000);
    } else if (deleting && displayed.length > 0) {
      timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 50);
    } else if (deleting && displayed.length === 0) {
      setDeleting(false);
      setIndex((i) => (i + 1) % words.length);
    }
    return () => clearTimeout(timeout);
  }, [displayed, deleting, index, words]);

  return (
    <span className="bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">
      {displayed}
      <span className="animate-pulse text-cyan-400">|</span>
    </span>
  );
}

// ─── Stats Row ───────────────────────────────────────────────────────────────
function StatsRow() {
  const stats = [
    { value: '10K+', label: 'Websites Built' },
    { value: '2s', label: 'Avg Generation' },
    { value: '99.9%', label: 'Uptime' },
  ];
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1, duration: 0.6 }}
      className="flex gap-10 justify-center mt-12"
    >
      {stats.map((s, i) => (
        <div key={i} className="text-center">
          <div className="text-2xl font-bold text-cyan-400">{s.value}</div>
          <div className="text-xs text-gray-400 mt-0.5">{s.label}</div>
        </div>
      ))}
    </motion.div>
  );
}

// ─── Smooth scroll helper ────────────────────────────────────────────────────
const scrollTo = (id) => {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
};

const featureIcons = {
  'AI-Powered Generation': Bot,
  'Live Preview': Eye,
  'Built-in Editor': Pencil,
  'One-Click Deploy': Rocket,
  'Credit System': BadgeIndianRupee,
  'Instant Sharing': Link2,
};

const keyFeatureIcons = {
  'Deploy in One Click': Zap,
  'Share Instantly': Link2,
  'Build Any Website': Globe,
};

// ─── Main Component ──────────────────────────────────────────────────────────
const LandingPage = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const navigate = useNavigate();

  const openLoginModal = () => setShowLoginModal(true);
  const closeLoginModal = () => setShowLoginModal(false);
  const handleAuthSuccess = () => {
    setShowLoginModal(false);
    navigate('/home');
  };

  useEffect(() => {
    if (!showLoginModal) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [showLoginModal]);

  const navLinks = [
    { label: 'Features', id: 'features' },
    { label: 'How it Works', id: 'how-it-works' },
    { label: 'Pricing', id: 'pricing' },
  ];

  const features = [
    { icon: '🤖', title: 'AI-Powered Generation', desc: 'Describe your vision, get a complete website in seconds' },
    { icon: '👀', title: 'Live Preview', desc: 'See your website come to life in real-time' },
    { icon: '✏️', title: 'Built-in Editor', desc: 'Tweak HTML, CSS, JS directly in the browser' },
    { icon: '🚀', title: 'One-Click Deploy', desc: 'Deploy to production instantly with a single click' },
    { icon: '💳', title: 'Credit System', desc: 'Fair pay-as-you-go pricing with flexible credits' },
    { icon: '🔗', title: 'Instant Sharing', desc: 'Share your live website with a single link' },
  ];

  const keyFeatures = [
    {
      icon: '⚡',
      title: 'Deploy in One Click',
      desc: "Go from idea to live website instantly. No servers to configure, no pipelines to set up — AiVora handles it all. Your site is live before you finish your coffee.",
      highlight: 'Zero DevOps required',
    },
    {
      icon: '🔗',
      title: 'Share Instantly',
      desc: 'Every website you build gets a unique shareable link the moment it is generated. Send it to clients, teammates, or the world — no extra steps needed.',
      highlight: 'Live link, instantly',
    },
    {
      icon: '🌐',
      title: 'Build Any Website',
      desc: 'Portfolios, landing pages, SaaS dashboards, e-commerce stores — just describe what you need in plain English and AiVora builds it, pixel-perfect.',
      highlight: 'Any idea, any style',
    },
  ];

  const steps = [
    { num: '01', title: 'Describe', desc: 'Type what website you want to build' },
    { num: '02', title: 'Generate', desc: 'AI creates HTML, CSS, JS in seconds' },
    { num: '03', title: 'Edit', desc: 'Customize with our built-in editor' },
    { num: '04', title: 'Deploy', desc: 'Launch your website with one click' },
  ];

  const pricing = [
    {
      name: 'Free',
      price: '₹0',
      credits: '3 websites',
      features: ['AI Generation', 'Live Preview', 'Code Editor', 'Community Support'],
      popular: false,
    },
    {
      name: 'Pro',
      price: '₹499',
      credits: '20 websites',
      features: ['Everything in Free', 'Priority Generation', 'Custom Domains', 'Priority Support'],
      popular: true,
    },
    {
      name: 'Enterprise',
      price: '₹1,999',
      credits: '100 websites',
      features: ['Everything in Pro', 'Dedicated Support', 'Team Collaboration', 'Advanced Analytics'],
      popular: false,
    },
  ];

  return (
    <div className="bg-black text-white font-['Outfit'] overflow-x-hidden">

      {/* ── Navbar ── */}
      <nav className="fixed top-0 w-full bg-black/80 backdrop-blur-lg border-b border-cyan-500/20 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">

            {/* Brand */}
            <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">
              AiVora
            </span>

            {/* Nav Links */}
            <div className="hidden md:flex space-x-8">
              {navLinks.map((item) => (
                <button
                  key={item.label}
                  onClick={() => scrollTo(item.id)}
                  className="text-gray-400 hover:text-cyan-400 transition text-sm font-medium"
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* CTA */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={openLoginModal}
              className="hidden md:block bg-gradient-to-r from-cyan-500 to-teal-500 px-5 py-2 rounded-full font-semibold text-sm"
            >
              Start Building
            </motion.button>

            {/* Mobile hamburger */}
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2">
              <div className="w-6 h-0.5 bg-white mb-1" />
              <div className="w-6 h-0.5 bg-white mb-1" />
              <div className="w-6 h-0.5 bg-white" />
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden bg-black border-t border-cyan-500/20"
          >
            <div className="px-4 py-4 space-y-3">
              {navLinks.map((item) => (
                <button
                  key={item.label}
                  onClick={() => { scrollTo(item.id); setMobileMenuOpen(false); }}
                  className="block w-full text-left text-gray-400 hover:text-cyan-400 text-sm"
                >
                  {item.label}
                </button>
              ))}
              <button
                onClick={() => { openLoginModal(); setMobileMenuOpen(false); }}
                className="w-full bg-gradient-to-r from-cyan-500 to-teal-500 px-6 py-2 rounded-full font-semibold text-sm"
              >
                Start Building
              </button>
            </div>
          </motion.div>
        )}
      </nav>

      {/* ── Hero Section ── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Shader — very minimal overlay so it POPS */}
        <ShaderHero />

        {/* Light overlay — just enough for text readability */}
        <div className="absolute inset-0 bg-black/25" />

        {/* Vignette at edges only */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at center, transparent 35%, rgba(0,0,0,0.75) 100%)',
          }}
        />

        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(rgba(6,182,212,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,0.4) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        <Particles />

        {/* Content */}
        <div className="relative z-10 text-center max-w-5xl px-4 pt-20">
          <Badge />

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.9, ease: 'easeOut' }}
            className="text-6xl md:text-8xl font-bold mb-4 leading-tight"
            style={{ textShadow: '0 0 40px rgba(6,182,212,0.5)' }}
          >
            <span className="text-white">Build with</span>
            <br />
            <TypingText words={['AI. Fast.', 'Zero Code.', 'Pure Magic.', 'AiVora.']} />
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="text-lg md:text-xl text-gray-200 mb-10 max-w-2xl mx-auto leading-relaxed"
            style={{ textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}
          >
            Describe your vision in plain English. AiVora's AI turns it into a production-ready website — in seconds, not months.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="flex justify-center"
          >
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 0 50px rgba(6,182,212,0.7)' }}
              whileTap={{ scale: 0.95 }}
              onClick={openLoginModal}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-teal-500 px-10 py-4 rounded-full font-bold text-lg shadow-[0_0_30px_rgba(6,182,212,0.4)]"
            >
              <span>Get Started Free</span>
              <ArrowRight size={20} />
            </motion.button>
          </motion.div>

          <StatsRow />
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-300 text-xs"
        >
          <span>Scroll</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-0.5 h-6 bg-gradient-to-b from-cyan-500 to-transparent rounded-full"
          />
        </motion.div>
      </section>

      {/* ── Key Features of AiVora ── */}
      <section className="py-24 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-cyan-950/10 to-black pointer-events-none" />
        <div className="max-w-6xl mx-auto relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-cyan-400 text-sm font-medium tracking-widest uppercase mb-3">Why AiVora</p>
            <h2 className="text-4xl md:text-5xl font-bold text-white">
              Everything you need,{' '}
              <span className="bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">
                nothing you don't
              </span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {keyFeatures.map((kf, idx) => {
              const Icon = keyFeatureIcons[kf.title] ?? Zap;

              return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.15 }}
                whileHover={{ y: -8 }}
                className="relative group bg-gradient-to-br from-white/5 to-cyan-500/5 rounded-3xl border border-white/10 hover:border-cyan-500/40 p-8 transition-all duration-300 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 to-teal-500/0 group-hover:from-cyan-500/10 group-hover:to-teal-500/5 transition-all duration-500 rounded-3xl" />
                <div className="mb-6 text-cyan-300 group-hover:scale-110 transition-transform duration-300">
                  <Icon size={42} strokeWidth={1.8} />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-white">{kf.title}</h3>
                <p className="text-gray-400 leading-relaxed mb-5 text-sm">{kf.desc}</p>
                <div className="inline-block bg-cyan-500/10 border border-cyan-500/30 rounded-full px-3 py-1 text-xs text-cyan-400 font-medium">
                  {kf.highlight}
                </div>
              </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-cyan-400 text-sm font-medium tracking-widest uppercase mb-3">What you get</p>
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">
              Powerful Features
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, idx) => {
              const Icon = featureIcons[feature.title] ?? Bot;

              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.08 }}
                  whileHover={{ y: -6 }}
                  className="bg-white/3 p-6 rounded-2xl border border-white/10 hover:border-cyan-500/40 transition-all duration-300 group"
                >
                  <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-300 mb-5 group-hover:scale-110 transition-transform duration-300">
                    <Icon size={22} strokeWidth={1.8} />
                  </div>
                  <h3 className="text-lg font-bold mb-2 text-white">{feature.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{feature.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── How it Works ── */}
      <section id="how-it-works" className="py-24 px-4 bg-gradient-to-b from-black via-cyan-950/10 to-black">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-cyan-400 text-sm font-medium tracking-widest uppercase mb-3">Simple process</p>
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">
              How It Works
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.15 }}
                className="relative group"
              >
                <div className="text-7xl font-bold bg-gradient-to-b from-cyan-500/40 to-transparent bg-clip-text text-transparent mb-4 select-none">
                  {step.num}
                </div>
                <h3 className="text-xl font-bold mb-2 text-white group-hover:text-cyan-400 transition-colors">
                  {step.title}
                </h3>
                <p className="text-gray-500 text-sm">{step.desc}</p>
                {idx < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-10 -right-4 w-8 h-px bg-gradient-to-r from-cyan-500/50 to-transparent" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section id="pricing" className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-cyan-400 text-sm font-medium tracking-widest uppercase mb-3">Transparent pricing</p>
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">
              Simple Pricing
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            {pricing.map((plan, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.15 }}
                whileHover={{ y: -8 }}
                className={`relative p-8 rounded-2xl border transition-all duration-300 ${
                  plan.popular
                    ? 'bg-gradient-to-br from-cyan-500/15 to-teal-500/10 border-cyan-500/60 shadow-[0_0_40px_rgba(6,182,212,0.15)] scale-105'
                    : 'bg-white/3 border-white/10 hover:border-cyan-500/30'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-cyan-500 to-teal-500 px-5 py-1.5 rounded-full text-xs font-bold tracking-wide">
                    MOST POPULAR
                  </div>
                )}
                <h3 className="text-xl font-bold mb-1 text-gray-300">{plan.name}</h3>
                <div className="text-5xl font-bold mb-1 text-white">{plan.price}</div>
                <p className="text-cyan-400/70 text-sm mb-6">{plan.credits}</p>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm">
                      <span className="w-5 h-5 rounded-full bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 text-xs flex-shrink-0">✓</span>
                      <span className="text-gray-400">{f}</span>
                    </li>
                  ))}
                </ul>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={openLoginModal}
                  className={`w-full py-3 rounded-full font-semibold text-sm transition-all duration-300 ${
                    plan.popular
                      ? 'bg-gradient-to-r from-cyan-500 to-teal-500 hover:shadow-[0_0_20px_rgba(6,182,212,0.4)]'
                      : 'border border-cyan-500/40 hover:bg-cyan-500/10 hover:border-cyan-500/70'
                  }`}
                >
                  Get Started
                </motion.button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative rounded-3xl border border-cyan-500/30 bg-gradient-to-br from-cyan-500/10 to-teal-500/5 p-12 text-center overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-transparent to-teal-500/5 animate-pulse pointer-events-none" />
            <h2 className="text-4xl md:text-5xl font-bold mb-4 relative z-10">Ready to build?</h2>
            <p className="text-gray-400 mb-8 relative z-10">Start for free. No credit card required.</p>
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(6,182,212,0.5)' }}
              whileTap={{ scale: 0.95 }}
              onClick={openLoginModal}
              className="relative z-10 inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-teal-500 px-10 py-4 rounded-full font-bold text-lg"
            >
              <span>Start Building Free</span>
              <ArrowRight size={20} />
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-cyan-500/10 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent mb-3">
                AiVora
              </h3>
              <p className="text-gray-600 text-sm">Build stunning websites with the power of AI</p>
            </div>
            {[
              { title: 'Product', links: ['Features', 'Pricing'] },
              { title: 'Company', links: ['About', 'Blog', 'Careers'] },
              { title: 'Legal', links: ['Privacy', 'Terms', 'Security'] },
            ].map((col) => (
              <div key={col.title}>
                <h4 className="font-semibold mb-4 text-cyan-400 text-sm tracking-wide">{col.title}</h4>
                <ul className="space-y-2">
                  {col.links.map((link) => (
                    <li key={link}>
                      <a href="#" className="text-gray-600 hover:text-cyan-400 transition text-sm">{link}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="text-center text-gray-700 border-t border-cyan-500/10 pt-8 text-sm">
            © 2025 AiVora. All rights reserved.
          </div>
        </div>
      </footer>

      <AnimatePresence>
        {showLoginModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] bg-black/55 backdrop-blur-md flex items-center justify-center px-4"
            onClick={closeLoginModal}
          >
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={closeLoginModal}
                className="absolute -top-3 -right-3 w-9 h-9 rounded-full border border-cyan-500/40 bg-black/80 text-cyan-300 hover:text-white"
                aria-label="Close login dialog"
              >
                ×
              </button>
              <Login onSuccess={handleAuthSuccess} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LandingPage

