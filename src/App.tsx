import { useState, useEffect, useRef, useCallback } from 'react';


// ─── Data ─────────────────────────────────────────────────────────────────────

const NAV_LINKS = [
  { label: 'Портфолио', href: '#portfolio' },
  { label: 'Обо мне', href: '#about' },
  { label: 'Процесс', href: '#process' },
  { label: 'Контакты', href: '#contacts' },
];

const PROJECTS = [
  {
    id: 1,
    title: 'Branded Content',
    category: 'Рекламный ролик',
    duration: '0:37',
    preview: '/previews/1.png',
    video: '/videos/1.mp4',
    tags: ['Motion', 'Brand'],
  },
  {
    id: 2,
    title: 'Dynamic Promo',
    category: 'Промо-ролик',
    duration: '0:17',
    preview: '/previews/2.png',
    video: '/videos/2.mp4',
    tags: ['Edit', 'Promo'],
  },
  {
    id: 3,
    title: 'Social Reels',
    category: 'Reels / Shorts',
    duration: '0:16',
    preview: '/previews/3.png',
    video: '/videos/3.mp4',
    tags: ['Reels', 'Social'],
  },
  {
    id: 4,
    title: 'Event Recap',
    category: 'Event видео',
    duration: '0:23',
    preview: '/previews/4.png',
    video: '/videos/4.mp4',
    tags: ['Event', 'Edit'],
  },
  {
    id: 5,
    title: 'Motion Graphics',
    category: 'Анимация',
    duration: '0:49',
    preview: '/previews/5.png',
    video: '/videos/5.mp4',
    tags: ['Motion', 'Graphics'],
  },
  {
    id: 6,
    title: 'Cinematic Edit',
    category: 'Монтаж',
    duration: '1:03',
    preview: '/previews/6.png',
    video: '/videos/6.mp4',
    tags: ['Cinema', 'Edit'],
  },
];

const PROCESS_STEPS = [
  {
    num: '01',
    title: 'Задача',
    desc: 'Вы отправляете материал, референсы и цель ролика.',
  },
  {
    num: '02',
    title: 'Монтаж',
    desc: 'Собираю первый вариант под формат, задачу и площадку.',
  },
  {
    num: '03',
    title: 'Правки',
    desc: 'Быстро вносим правки при наличии.',
  },
  {
    num: '04',
    title: 'Финал',
    desc: 'Отдаю готовый ролик. Типо такого.',
  },
];

const MARQUEE_ITEMS = [
  'Motion Design',
  'Video Editing',
  'After Effects',
  'Premiere Pro',
  'Color Grading',
  'Reels & Shorts',
  'Motion Design',
  'Video Editing',
  'After Effects',
  'Premiere Pro',
  'Color Grading',
  'Reels & Shorts',
];

// ─── Custom Cursor ─────────────────────────────────────────────────────────────

function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const posRef = useRef({ x: 0, y: 0 });
  const ringPosRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      posRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', onMove);

    const animate = () => {
      if (dotRef.current) {
        dotRef.current.style.left = posRef.current.x + 'px';
        dotRef.current.style.top = posRef.current.y + 'px';
      }
      ringPosRef.current.x += (posRef.current.x - ringPosRef.current.x) * 0.12;
      ringPosRef.current.y += (posRef.current.y - ringPosRef.current.y) * 0.12;
      if (ringRef.current) {
        ringRef.current.style.left = ringPosRef.current.x + 'px';
        ringRef.current.style.top = ringPosRef.current.y + 'px';
      }
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <>
      <div className="cursor-dot" ref={dotRef} />
      <div className="cursor-ring" ref={ringRef} />
    </>
  );
}

// ─── Sound Hook ────────────────────────────────────────────────────────────────

function useClickSound() {
  const playClick = useCallback(() => {
    try {
      const audio = new Audio('/sfx/click.mp3');
      audio.volume = 0.08;
      audio.play().catch(() => {});
    } catch {}
  }, []);

  return playClick;
}

// ─── Video Modal ───────────────────────────────────────────────────────────────

interface VideoModalProps {
  project: (typeof PROJECTS)[0] | null;
  onClose: () => void;
}

function VideoModal({ project, onClose }: VideoModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!project) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [project, onClose]);

  if (!project) return null;

  return (
    <div
      className="video-modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="video-modal-content">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 flex items-center gap-2 text-white/60 hover:text-white transition-colors duration-200 text-sm tracking-wider uppercase"
          style={{ zIndex: 1 }}
        >
          <span>Закрыть</span>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        {/* Video player */}
        <div className="relative rounded-2xl overflow-hidden" style={{ background: '#000', boxShadow: '0 40px 100px rgba(0,0,0,0.9), 0 0 0 1px rgba(168,85,247,0.15)' }}>
          <video
            ref={videoRef}
            src={project.video}
            controls
            autoPlay
            className="w-full"
            style={{ maxHeight: '80vh', display: 'block' }}
          />
        </div>

        {/* Info */}
        <div className="mt-4 flex items-center justify-between px-1">
          <div>
            <h3 className="text-white font-semibold text-lg">{project.title}</h3>
            <p className="text-white/40 text-sm mt-0.5">{project.category}</p>
          </div>
          <div className="flex gap-2">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs text-purple-400/70 border border-purple-500/20 rounded-full px-3 py-1"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Navbar ────────────────────────────────────────────────────────────────────

function Navbar({ playClick }: { playClick: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const handleNav = (href: string) => {
    playClick();
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-40"
      style={{
        background: scrolled ? 'rgba(5,5,7,0.9)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(20px)' : 'none',
        transition: 'background 0.3s, backdrop-filter 0.3s',
        borderBottom: scrolled ? '1px solid rgba(168,85,247,0.1)' : 'none',
      }}
    >
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <a
          href="#"
          className="text-gradient font-bold text-xl tracking-wider"
          onClick={(e) => { e.preventDefault(); playClick(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
        >
          DINARIX
        </a>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((l) => (
            <li key={l.href}>
              <button
                onClick={() => handleNav(l.href)}
                className="text-white/50 hover:text-white text-sm tracking-wider uppercase transition-colors duration-200"
              >
                {l.label}
              </button>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <a
          href="https://t.me/dinarix_md"
          target="_blank"
          rel="noopener noreferrer"
          onClick={playClick}
          className="hidden md:inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium transition-all duration-300"
          style={{
            background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
            color: '#fff',
            boxShadow: '0 4px 20px rgba(124,58,237,0.3)',
          }}
        >
          Написать
        </a>

        {/* Mobile burger */}
        <button
          className="md:hidden text-white/60 hover:text-white"
          onClick={() => { playClick(); setMobileOpen(!mobileOpen); }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            {mobileOpen
              ? <path d="M18 6L6 18M6 6l12 12" />
              : <><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></>
            }
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          className="md:hidden"
          style={{ background: 'rgba(5,5,7,0.97)', borderTop: '1px solid rgba(168,85,247,0.1)' }}
        >
          <ul className="flex flex-col px-6 py-4 gap-4">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <button
                  onClick={() => handleNav(l.href)}
                  className="text-white/60 hover:text-white text-sm tracking-wider uppercase w-full text-left py-2 transition-colors"
                >
                  {l.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
}

// ─── Hero Section ──────────────────────────────────────────────────────────────

function HeroSection({ playClick }: { playClick: () => void }) {
  return (
    <section id="hero" style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
      {/* Background glow */}
      <div style={{
        position: 'absolute', top: '20%', left: '50%',
        transform: 'translateX(-50%)',
        width: 600, height: 600,
        background: 'radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div className="max-w-6xl mx-auto px-6 flex flex-col justify-center" style={{ minHeight: '100vh', paddingTop: 120 }}>
        {/* Badge */}
        <div className="flex items-center gap-3 mb-8">
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#a855f7', animation: 'pulse 2s infinite' }} />
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.3em', textTransform: 'uppercase' }}>
            Motion Designer & Video Editor
          </span>
        </div>

        {/* Title */}
        <h1 style={{ fontSize: 'clamp(48px, 8vw, 96px)', fontWeight: 700, lineHeight: 1.05, letterSpacing: '-0.02em', marginBottom: 32 }}>
          <span style={{ color: 'rgba(255,255,255,0.95)' }}>Создаю ролики,</span>
          <br />
          <span className="text-gradient">которые работают</span>
        </h1>

        {/* Sub */}
        <p style={{ fontSize: 'clamp(16px, 2vw, 20px)', color: 'rgba(255,255,255,0.45)', maxWidth: 520, lineHeight: 1.7, marginBottom: 48 }}>
          Монтаж и моушн-дизайн для брендов, блогеров и бизнеса. Быстро, чисто, с результатом.
        </p>

        {/* CTA */}
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <button
            onClick={() => {
              playClick();
              document.querySelector('#portfolio')?.scrollIntoView({ behavior: 'smooth' });
            }}
            style={{
              padding: '14px 32px',
              borderRadius: 50,
              background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
              color: '#fff',
              fontWeight: 600,
              fontSize: 15,
              border: 'none',
              cursor: 'none',
              boxShadow: '0 8px 30px rgba(124,58,237,0.35)',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
            onMouseEnter={(e) => {
              (e.target as HTMLElement).style.transform = 'translateY(-2px)';
              (e.target as HTMLElement).style.boxShadow = '0 12px 40px rgba(124,58,237,0.5)';
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLElement).style.transform = '';
              (e.target as HTMLElement).style.boxShadow = '0 8px 30px rgba(124,58,237,0.35)';
            }}
          >
            Смотреть работы
          </button>
          <a
            href="https://t.me/dinarix_md"
            target="_blank"
            rel="noopener noreferrer"
            onClick={playClick}
            style={{
              padding: '14px 32px',
              borderRadius: 50,
              background: 'transparent',
              color: 'rgba(255,255,255,0.7)',
              fontWeight: 500,
              fontSize: 15,
              border: '1px solid rgba(168,85,247,0.3)',
              cursor: 'none',
              textDecoration: 'none',
              transition: 'border-color 0.2s, color 0.2s',
              display: 'inline-flex',
              alignItems: 'center',
            }}
            onMouseEnter={(e) => {
              (e.target as HTMLElement).style.borderColor = 'rgba(168,85,247,0.7)';
              (e.target as HTMLElement).style.color = '#fff';
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLElement).style.borderColor = 'rgba(168,85,247,0.3)';
              (e.target as HTMLElement).style.color = 'rgba(255,255,255,0.7)';
            }}
          >
            Связаться
          </a>
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', gap: 48, marginTop: 64, paddingTop: 48, borderTop: '1px solid rgba(255,255,255,0.06)', flexWrap: 'wrap' }}>
          {[
            { val: '50+', label: 'Проектов' },
            { val: '3+', label: 'Года опыта' },
            { val: '30+', label: 'Клиентов' },
          ].map((s) => (
            <div key={s.label}>
              <div style={{ fontSize: 32, fontWeight: 700, color: '#fff' }}>{s.val}</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', marginTop: 4, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div style={{
        position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
      }}>
        <div style={{ width: 1, height: 48, background: 'linear-gradient(to bottom, transparent, rgba(168,85,247,0.5))' }} />
        <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.2)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>Scroll</span>
      </div>
    </section>
  );
}

// ─── Marquee Section ───────────────────────────────────────────────────────────

function MarqueeSection() {
  return (
    <div
      className="marquee-section"
      style={{
        padding: '20px 0',
        borderTop: '1px solid rgba(255,255,255,0.04)',
        borderBottom: '1px solid rgba(255,255,255,0.04)',
        overflow: 'hidden',
      }}
    >
      <div className="animate-marquee" style={{ display: 'flex', whiteSpace: 'nowrap', gap: 0 }}>
        {MARQUEE_ITEMS.map((item, i) => (
          <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 24, padding: '0 24px' }}>
            <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.2)', letterSpacing: '0.25em', textTransform: 'uppercase' }}>
              {item}
            </span>
            <span style={{ color: 'rgba(168,85,247,0.4)', fontSize: 6 }}>◆</span>
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── Video Card ────────────────────────────────────────────────────────────────

function VideoCard({ project, onOpen }: { project: (typeof PROJECTS)[0]; onOpen: () => void }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="video-card"
      onClick={onOpen}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderRadius: 16,
        overflow: 'hidden',
        border: hovered ? '1px solid rgba(168,85,247,0.25)' : '1px solid rgba(255,255,255,0.06)',
        background: hovered ? 'rgba(168,85,247,0.04)' : 'rgba(255,255,255,0.02)',
        cursor: 'none',
        position: 'relative',
        transition: 'border-color 0.3s, background 0.3s',
      }}
    >
      {/* Thumbnail */}
      <div style={{ position: 'relative', aspectRatio: '16/9', overflow: 'hidden' }}>
        <img
          src={project.preview}
          alt={project.title}
          style={{
            width: '100%', height: '100%', objectFit: 'cover',
            transition: 'transform 0.5s',
            transform: hovered ? 'scale(1.05)' : 'scale(1)',
          }}
        />
        {/* Gradient overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.8))',
        }} />
        {/* Play button */}
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          opacity: hovered ? 1 : 0,
          transition: 'opacity 0.3s',
        }}>
          <div style={{
            width: 60, height: 60, borderRadius: '50%',
            background: 'rgba(168,85,247,0.9)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 30px rgba(168,85,247,0.5)',
          }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
        {/* Duration */}
        <div style={{
          position: 'absolute', bottom: 10, right: 10,
          background: 'rgba(0,0,0,0.7)',
          color: 'rgba(255,255,255,0.8)',
          fontSize: 11, padding: '3px 8px', borderRadius: 4,
          backdropFilter: 'blur(4px)',
        }}>
          {project.duration}
        </div>
      </div>

      {/* Card body */}
      <div style={{ padding: '16px 20px 20px' }}>
        <p style={{ fontSize: 11, color: 'rgba(168,85,247,0.6)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 6 }}>
          {project.category}
        </p>
        <h3 style={{ fontSize: 17, fontWeight: 600, color: 'rgba(255,255,255,0.9)', marginBottom: 12 }}>
          {project.title}
        </h3>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {project.tags.map((tag) => (
            <span
              key={tag}
              style={{
                fontSize: 11, color: 'rgba(168,85,247,0.6)',
                border: '1px solid rgba(168,85,247,0.15)',
                borderRadius: 20, padding: '3px 10px',
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Portfolio Section ─────────────────────────────────────────────────────────

function PortfolioSection({
  playClick,
  onOpenVideo,
}: {
  playClick: () => void;
  onOpenVideo: (p: (typeof PROJECTS)[0]) => void;
}) {
  return (
    <section id="portfolio" style={{ minHeight: '100vh', padding: '100px 0' }}>
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div style={{ marginBottom: 60 }}>
          <p style={{ fontSize: 12, color: 'rgba(168,85,247,0.7)', letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: 16 }}>
            Портфолио
          </p>
          <h2 style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 700, color: '#fff', lineHeight: 1.1 }}>
            Избранные работы
          </h2>
        </div>

        {/* Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: 24,
          }}
        >
          {PROJECTS.map((project) => (
            <VideoCard
              key={project.id}
              project={project}
              onOpen={() => { playClick(); onOpenVideo(project); }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── About Section ─────────────────────────────────────────────────────────────

function AboutSection() {
  return (
    <section id="about" style={{ minHeight: '100vh', padding: '100px 0' }}>
      <div className="max-w-6xl mx-auto px-6">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 64, alignItems: 'center' }}>
          {/* Photo */}
          <div style={{ position: 'relative' }}>
            <div style={{
              position: 'absolute', inset: -2,
              borderRadius: 20,
              background: 'linear-gradient(135deg, rgba(124,58,237,0.3), transparent)',
              zIndex: 0,
            }} />
            <img
              src="/images/about.png"
              alt="Dinarix"
              style={{
                width: '100%', maxWidth: 380, borderRadius: 18,
                objectFit: 'cover', aspectRatio: '4/5',
                position: 'relative', zIndex: 1,
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            />
            {/* Floating badge */}
            <div style={{
              position: 'absolute', bottom: 24, right: 24, zIndex: 2,
              background: 'rgba(5,5,7,0.9)', backdropFilter: 'blur(16px)',
              border: '1px solid rgba(168,85,247,0.2)',
              borderRadius: 12, padding: '12px 18px',
            }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: '#fff' }}>3+</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 2, letterSpacing: '0.1em' }}>ГОДА В ДЕЛЕ</div>
            </div>
          </div>

          {/* Text */}
          <div>
            <p style={{ fontSize: 12, color: 'rgba(168,85,247,0.7)', letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: 16 }}>
              Обо мне
            </p>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 700, color: '#fff', lineHeight: 1.2, marginBottom: 24 }}>
              Монтирую контент,<br />
              <span className="text-gradient">который цепляет</span>
            </h2>
            <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.5)', lineHeight: 1.75, marginBottom: 20 }}>
              Привет, я Динар — видеограф и моушн-дизайнер. Работаю с брендами, блогерами и бизнесом, создавая ролики, которые выполняют задачу.
            </p>
            <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.4)', lineHeight: 1.75, marginBottom: 36 }}>
              Использую Premiere Pro, After Effects, Da Vinci. Понимаю площадки: YouTube, Instagram, TikTok, VK.
            </p>

            {/* Skills */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {['Premiere Pro', 'After Effects', 'DaVinci', 'Motion Graphics', 'Color Grade', 'Reels/Shorts'].map((skill) => (
                <span
                  key={skill}
                  style={{
                    fontSize: 12, color: 'rgba(255,255,255,0.6)',
                    border: '1px solid rgba(168,85,247,0.2)',
                    borderRadius: 20, padding: '6px 14px',
                    background: 'rgba(168,85,247,0.05)',
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Process Section ───────────────────────────────────────────────────────────

function ProcessSection() {
  return (
    <section id="process" style={{ minHeight: '100vh', padding: '100px 0' }}>
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 80 }}>
          <p style={{ fontSize: 12, color: 'rgba(168,85,247,0.7)', letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: 16 }}>
            Процесс
          </p>
          <h2 style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 700, color: '#fff', lineHeight: 1.1 }}>
            Как проходит работа
          </h2>
        </div>

        {/* Steps */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 24, position: 'relative' }}>
          {/* Connecting line (desktop) */}
          <div style={{
            position: 'absolute', top: 48, left: '12.5%', right: '12.5%', height: 1,
            background: 'linear-gradient(to right, transparent, rgba(168,85,247,0.2), transparent)',
            pointerEvents: 'none',
          }} />

          {PROCESS_STEPS.map((step, i) => (
            <div
              key={step.num}
              style={{
                position: 'relative',
                padding: '40px 28px 32px',
                borderRadius: 20,
                border: '1px solid rgba(255,255,255,0.06)',
                background: 'rgba(255,255,255,0.02)',
                transition: 'border-color 0.3s, background 0.3s, transform 0.3s',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(168,85,247,0.25)';
                (e.currentTarget as HTMLElement).style.background = 'rgba(168,85,247,0.04)';
                (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.06)';
                (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.02)';
                (e.currentTarget as HTMLElement).style.transform = '';
              }}
            >
              {/* Number */}
              <div style={{
                fontSize: 48, fontWeight: 800,
                background: 'linear-gradient(135deg, rgba(168,85,247,0.15), rgba(124,58,237,0.05))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                lineHeight: 1, marginBottom: 20,
                letterSpacing: '-0.02em',
              }}>
                {step.num}
              </div>

              {/* Dot indicator */}
              <div style={{
                position: 'absolute', top: 44, right: 28,
                width: 8, height: 8, borderRadius: '50%',
                background: i === 3 ? '#a855f7' : 'rgba(168,85,247,0.3)',
                boxShadow: i === 3 ? '0 0 12px rgba(168,85,247,0.6)' : 'none',
              }} />

              <h3 style={{ fontSize: 20, fontWeight: 600, color: 'rgba(255,255,255,0.9)', marginBottom: 12 }}>
                {step.title}
              </h3>
              <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.4)', lineHeight: 1.65 }}>
                {step.desc}
              </p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center', marginTop: 64 }}>
          <a
            href="https://t.me/dinarix_md"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 10,
              padding: '14px 32px', borderRadius: 50,
              background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
              color: '#fff', fontWeight: 600, fontSize: 15,
              textDecoration: 'none',
              boxShadow: '0 8px 30px rgba(124,58,237,0.3)',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
              (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 40px rgba(124,58,237,0.5)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.transform = '';
              (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 30px rgba(124,58,237,0.3)';
            }}
          >
            Начать проект
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}

// ─── Contacts Section ──────────────────────────────────────────────────────────

function ContactsSection({ playClick }: { playClick: () => void }) {
  const [copied, setCopied] = useState(false);
  const EMAIL = 'dinarix.md@gmail.com';

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(EMAIL).then(() => {
      setCopied(true);
      playClick();
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const CARDS = [
    {
      key: 'telegram',
      icon: (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248l-2.026 9.558c-.149.665-.54.828-1.094.515l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.332-.373-.12L6.39 14.617l-2.97-.927c-.645-.204-.658-.645.136-.953l11.594-4.47c.538-.194 1.009.131.832.98-.001 0 0 0-.42.001z" />
        </svg>
      ),
      label: 'Telegram',
      value: '@dinarix_md',
      href: 'https://t.me/dinarix_md',
      accent: '#229ED9',
      accentBg: 'rgba(34,158,217,0.08)',
      accentBorder: 'rgba(34,158,217,0.2)',
      action: 'Написать',
    },
    {
      key: 'email',
      icon: (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="2" y="4" width="20" height="16" rx="3" />
          <path d="M2 7l10 7 10-7" />
        </svg>
      ),
      label: 'Email',
      value: EMAIL,
      href: null,
      accent: '#a855f7',
      accentBg: 'rgba(168,85,247,0.08)',
      accentBorder: 'rgba(168,85,247,0.2)',
      action: copied ? '✓ Скопировано' : 'Скопировать',
    },
    {
      key: 'max',
      icon: (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/>
        </svg>
      ),
      label: 'MAX',
      value: 'Профиль в MAX',
      href: 'https://max.ru/u/f9LHodD0cOJylTeCWGav5B2LnEMTuGGDV26Iv8XhNlzfGIEnOucRJkZyLCQ',
      accent: '#FF6B35',
      accentBg: 'rgba(255,107,53,0.08)',
      accentBorder: 'rgba(255,107,53,0.2)',
      action: 'Открыть',
    },
  ];

  return (
    <section id="contacts" style={{ minHeight: '100vh', padding: '100px 0' }}>
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <p style={{ fontSize: 12, color: 'rgba(168,85,247,0.7)', letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: 16 }}>
            Контакты
          </p>
          <h2 style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 700, color: '#fff', lineHeight: 1.1, marginBottom: 16 }}>
            Давайте работать вместе
          </h2>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.4)', maxWidth: 400, margin: '0 auto', lineHeight: 1.65 }}>
            Напишите удобным способом — отвечу быстро
          </p>
        </div>

        {/* Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: 20,
          maxWidth: 900,
          margin: '0 auto',
        }}>
          {CARDS.map((card) => (
            <div
              key={card.key}
              className="contact-card"
              style={{
                borderRadius: 20,
                border: `1px solid ${card.accentBorder}`,
                background: card.accentBg,
                padding: '32px 28px',
                display: 'flex',
                flexDirection: 'column',
                gap: 0,
              }}
            >
              {/* Icon */}
              <div style={{
                width: 56, height: 56, borderRadius: 16,
                background: `${card.accentBg}`,
                border: `1px solid ${card.accentBorder}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: card.accent,
                marginBottom: 20,
              }}>
                {card.icon}
              </div>

              {/* Label */}
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 8 }}>
                {card.label}
              </p>

              {/* Value */}
              <p style={{ fontSize: 16, fontWeight: 500, color: 'rgba(255,255,255,0.85)', marginBottom: 24, wordBreak: 'break-all' }}>
                {card.value}
              </p>

              {/* CTA button */}
              {card.href ? (
                <a
                  href={card.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={playClick}
                  style={{
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    padding: '11px 22px', borderRadius: 50, marginTop: 'auto',
                    background: `${card.accent}18`,
                    border: `1px solid ${card.accentBorder}`,
                    color: card.accent, fontWeight: 600, fontSize: 14,
                    textDecoration: 'none', cursor: 'none',
                    transition: 'background 0.2s, transform 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background = `${card.accent}30`;
                    (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background = `${card.accent}18`;
                    (e.currentTarget as HTMLElement).style.transform = '';
                  }}
                >
                  {card.action}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M7 17L17 7M17 7H7M17 7v10" />
                  </svg>
                </a>
              ) : (
                <button
                  onClick={handleCopyEmail}
                  style={{
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    padding: '11px 22px', borderRadius: 50, marginTop: 'auto',
                    background: copied ? 'rgba(168,85,247,0.25)' : `${card.accent}18`,
                    border: `1px solid ${card.accentBorder}`,
                    color: card.accent, fontWeight: 600, fontSize: 14,
                    cursor: 'none', transition: 'background 0.2s, transform 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background = `${card.accent}30`;
                    (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background = copied ? 'rgba(168,85,247,0.25)' : `${card.accent}18`;
                    (e.currentTarget as HTMLElement).style.transform = '';
                  }}
                >
                  {copied ? (
                    <>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                      {card.action}
                    </>
                  ) : (
                    <>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <rect x="9" y="9" width="13" height="13" rx="2" />
                        <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                      </svg>
                      {card.action}
                    </>
                  )}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Footer ────────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer
      style={{
        padding: '40px 24px',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        textAlign: 'center',
        background: '#050507',
      }}
    >
      <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.2)', letterSpacing: '0.05em' }}>
        © {new Date().getFullYear()} DINARIX. Все права защищены.
      </p>
    </footer>
  );
}

// ─── App ───────────────────────────────────────────────────────────────────────

export default function App() {
  const [activeVideo, setActiveVideo] = useState<(typeof PROJECTS)[0] | null>(null);
  const playClick = useClickSound();

  // Snap scroll sections
  const SECTION_IDS = ['hero', 'portfolio', 'about', 'process', 'contacts'];
  const isScrolling = useRef(false);
  const currentSection = useRef(0);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (activeVideo) return;
      if (isScrolling.current) return;
      e.preventDefault();

      const direction = e.deltaY > 0 ? 1 : -1;
      const next = Math.max(0, Math.min(SECTION_IDS.length - 1, currentSection.current + direction));
      if (next === currentSection.current) return;

      currentSection.current = next;
      isScrolling.current = true;

      const el = document.getElementById(SECTION_IDS[next]);
      if (el) {
        // For last section, scroll to bottom to show footer
        if (next === SECTION_IDS.length - 1) {
          window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
        } else {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }

      setTimeout(() => { isScrolling.current = false; }, 900);
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [activeVideo]);

  // Track current section by intersection
  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    SECTION_IDS.forEach((id, idx) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) currentSection.current = idx;
        },
        { threshold: 0.4 }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  return (
    <div className="noise" style={{ background: '#050507', minHeight: '100vh' }}>
      <CustomCursor />
      <Navbar playClick={playClick} />

      <main>
        <HeroSection playClick={playClick} />
        <MarqueeSection />
        <PortfolioSection playClick={playClick} onOpenVideo={setActiveVideo} />
        <AboutSection />
        <ProcessSection />
        <ContactsSection playClick={playClick} />
      </main>

      <Footer />

      <VideoModal project={activeVideo} onClose={() => setActiveVideo(null)} />
    </div>
  );
}
