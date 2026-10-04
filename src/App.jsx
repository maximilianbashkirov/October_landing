import React, { useState, useEffect, useRef, useMemo, useId } from 'react'
import './styles.css'

/* ============================================================
   ДАННЫЕ БРЕНДА — правь тексты здесь под свой док
============================================================ */
const BRAND = {
  name: 'OCTOBER',
  tagline: 'алый по светло-серому',
  drop: 'DROP 04 «ЧЁРНАЯ ВДОВА»',
  dropDate: '31.10 // 00:00 MSK',
}

const TICKER = ['OCTOBER', 'АЛЫЙ ПО СВЕТЛО-СЕРОМУ', 'ПАУТИНА — НАША ПОДПИСЬ', 'DROP 04 — 31.10', 'LIMITED 31 ШТ', 'НЕ ЖДЁМ ТЕПЛА']

const MANIFESTO = [
  <>ОКТЯБРЬ — НЕ МЕСЯЦ.</>,
  <>ЭТО <span className="mark">СОСТОЯНИЕ</span>.</>,
  <>СЕРЫЙ ГОРОД НОСИТ СЕРЫЙ.</>,
  <>МЫ НОСИМ <span className="mark">АЛЫЙ</span>.</>,
]

const MANIFESTO_TEXT =
  'OCTOBER — молодой и дерзкий бренд из города, где октябрь длится круглый год. Мышиваем серость как холст: алый по светло-серому — наша единственная формула. Limited-дропы, ручные принты, паутина как подпись. Кто попал — уже не выпутается.'

const STATS = [
  { n: '10/31', t: 'дата силы' },
  { n: '31 шт', t: 'макс. тираж дропа' },
  { n: '0 ₽', t: 'на рекламу. только сарафан' },
]

const PRODUCTS = [
  { id: '04-01', type: 'hoodie', name: 'Худи «Паутина»', price: '7 900 ₽', tag: 'NEW' },
  { id: '04-02', type: 'tee',    name: 'Футболка «Алый по серому»', price: '3 900 ₽', tag: 'NEW' },
  { id: '04-03', type: 'cargo',  name: 'Карго «Октябрь»', price: '8 500 ₽', tag: 'HOT' },
  { id: '04-04', type: 'long',   name: 'Лонгслив «Вдова»', price: '4 900 ₽', tag: '' },
  { id: '04-05', type: 'cap',    name: 'Кепка «Сердце»', price: '2 900 ₽', tag: '', sold: true },
  { id: '04-06', type: 'beanie', name: 'Шапка «Поздний»', price: '2 500 ₽', tag: '' },
]

const LOOKS = [
  { n: '01', title: 'СЕРДЦЕ В ПАУТИНЕ', motif: 'web' },
  { n: '02', title: 'АЛЫЙ КОНТУР', motif: 'arc' },
  { n: '03', title: 'ВДОВА НА НИТИ', motif: 'spider' },
  { n: '04', title: 'ДЕСЯТЫЙ МЕСЯЦ', motif: 'ten' },
  { n: '05', title: 'ПОЛОТНО №10', motif: 'repeat' },
]

/* ============================================================
   SVG-КОМПОНЕНТЫ БРЕНДА
============================================================ */

/* Глянцевая красная дуга-баллон (логотип) */
function GlossyArc({ className = '', style, withText = false }) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '')
  return (
    <svg viewBox="0 0 600 240" className={className} style={style} aria-hidden="true">
      <defs>
        <linearGradient id={uid + 'g'} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#F27777" />
          <stop offset=".38" stopColor="#C42222" />
          <stop offset=".75" stopColor="#9E1B1B" />
          <stop offset="1" stopColor="#6B0F0F" />
        </linearGradient>
        <filter id={uid + 'b9'}><feGaussianBlur stdDeviation="9" /></filter>
        <filter id={uid + 'b4'}><feGaussianBlur stdDeviation="4" /></filter>
        <filter id={uid + 'b1'}><feGaussianBlur stdDeviation="1.2" /></filter>
        <path id={uid + 'p'} d="M70 182 Q300 52 530 182" fill="none" />
      </defs>
      {/* тень снизу */}
      <use href={'#' + uid + 'p'} stroke="#5E0D0D" strokeWidth="94" strokeLinecap="round" opacity=".45" filter={`url(#${uid}b9)`} transform="translate(0 12)" />
      {/* тело баллона */}
      <use href={'#' + uid + 'p'} stroke={`url(#${uid}g)`} strokeWidth="92" strokeLinecap="round" />
      {/* блики глянца */}
      <path d="M98 164 Q300 60 502 164" stroke="#FF9C9C" strokeWidth="18" strokeLinecap="round" opacity=".5" filter={`url(#${uid}b4)`} fill="none" />
      <path d="M126 146 Q300 66 474 146" stroke="#FFFFFF" strokeWidth="7" strokeLinecap="round" opacity=".9" filter={`url(#${uid}b1)`} fill="none" />
      <path d="M120 206 Q300 104 480 206" stroke="#FF6B6B" strokeWidth="5" strokeLinecap="round" opacity=".22" filter={`url(#${uid}b4)`} fill="none" />
      {withText && (
        <text className="arc-text" style={{ dominantBaseline: 'central' }}>
          <textPath href={'#' + uid + 'p'} startOffset="50%" textAnchor="middle">October</textPath>
        </text>
      )}
    </svg>
  )
}

/* Генератор паутины (органичная, с jitter) */
function buildWeb(spokes, rings, R, sag, seed) {
  const rand = (i) => { const x = Math.sin(i * 127.1 + seed * 311.7) * 43758.5453; return x - Math.floor(x) }
  const angs = Array.from({ length: spokes }, (_, s) => (s / spokes) * Math.PI * 2 - Math.PI / 2 + (rand(s) - 0.5) * 0.12)
  let spokeD = '', ringD = ''
  angs.forEach((a, s) => {
    const len = R * (1.12 + (rand(s + 50) - 0.5) * 0.1)
    spokeD += `M0 0 L${(Math.cos(a) * len).toFixed(1)} ${(Math.sin(a) * len).toFixed(1)} `
  })
  for (let r = 1; r <= rings; r++) {
    const rad = R * Math.pow(r / rings, 1.12)
    for (let s = 0; s < spokes; s++) {
      let a1 = angs[s], a2 = angs[(s + 1) % spokes]
      if (a2 <= a1) a2 += Math.PI * 2
      const mid = (a1 + a2) / 2
      const x1 = (Math.cos(a1) * rad).toFixed(1), y1 = (Math.sin(a1) * rad).toFixed(1)
      const x2 = (Math.cos(a2) * rad).toFixed(1), y2 = (Math.sin(a2) * rad).toFixed(1)
      const cx = (Math.cos(mid) * rad * (1 - sag)).toFixed(1), cy = (Math.sin(mid) * rad * (1 - sag)).toFixed(1)
      ringD += `M${x1} ${y1} Q${cx} ${cy} ${x2} ${y2} `
    }
  }
  return { spokeD, ringD }
}

function Web({ R = 100, spokes = 14, rings = 4, stroke = '#141414', sw = 1.6, heart = true, heartFill = null, className = '', style }) {
  const { spokeD, ringD } = useMemo(() => buildWeb(spokes, rings, R, 0.16, 7), [spokes, rings, R])
  const K = R * 1.25
  return (
    <svg viewBox={`${-K} ${-K} ${K * 2} ${K * 2}`} className={className} style={style} aria-hidden="true">
      <path d={spokeD} stroke={stroke} strokeWidth={sw} fill="none" strokeLinecap="round" />
      <path d={ringD} stroke={stroke} strokeWidth={sw} fill="none" strokeLinecap="round" />
      {heart && (
        <path
          transform={`scale(${R / 100}) translate(0 -14)`}
          d="M0 12 C0 4 -6 -2 -12 2 C-19 7 -17 16 0 30 C17 16 19 7 12 2 C6 -2 0 4 0 12 Z"
          fill={heartFill || 'none'} stroke={heartFill ? 'none' : stroke} strokeWidth={sw * 1.6}
        />
      )}
    </svg>
  )
}

/* Паук-вдова на нити (с алым часом на брюхе) */
function Spider({ className = '', style, stroke = '#141414' }) {
  return (
    <svg viewBox="0 0 120 170" className={className} style={style} aria-hidden="true">
      <path d="M60 0 V64" stroke={stroke} strokeWidth="1.4" />
      <g stroke={stroke} strokeWidth="3" strokeLinecap="round" fill="none">
        <path d="M60 82 C46 76 38 66 34 52" /><path d="M60 82 C74 76 82 66 86 52" />
        <path d="M60 88 C44 86 32 80 24 70" /><path d="M60 88 C76 86 88 80 96 70" />
        <path d="M60 94 C46 96 34 100 26 108" /><path d="M60 94 C74 96 86 100 94 108" />
        <path d="M60 100 C48 108 42 118 38 130" /><path d="M60 100 C72 108 78 118 82 130" />
        <path d="M56 78 C54 72 52 70 50 68" /><path d="M64 78 C66 72 68 70 70 68" />
      </g>
      <ellipse cx="60" cy="88" rx="8.5" ry="9.5" fill={stroke} />
      <ellipse cx="60" cy="112" rx="15" ry="19" fill={stroke} />
      <path d="M60 104 l4.5 7 l-4.5 7 l-4.5 -7 Z" fill="#B22222" />
    </svg>
  )
}

/* Лайн-арт одежды для карточек */
function Garment({ type }) {
  const P = { stroke: 'currentColor', strokeWidth: 2.4, fill: 'none', strokeLinejoin: 'round', strokeLinecap: 'round' }
  return (
    <svg viewBox="0 0 100 100" className="garment" aria-hidden="true">
      {type === 'tee' && (<><path {...P} d="M31 20 L42 14 Q50 21 58 14 L69 20 L79 33 L68 40 L68 86 L32 86 L32 40 L21 33 Z" /><path {...P} d="M42 14 Q50 25 58 14" /></>)}
      {type === 'hoodie' && (<><path {...P} d="M32 28 L41 22 Q50 28 59 22 L68 28 L79 43 L68 50 L68 88 L32 88 L32 50 L21 43 Z" /><path {...P} d="M41 22 Q50 4 59 22 Q54 17 50 17 Q46 17 41 22 Z" /><path {...P} d="M40 72 H60 L63 84 H37 Z" /><path {...P} d="M47 27 L45.5 38 M53 27 L54.5 38" /></>)}
      {type === 'cargo' && (<><path {...P} d="M37 12 H63 L67 48 L64 88 H53 L50.5 50 H49.5 L47 88 H36 L33 48 Z" /><path {...P} d="M37 19 H63" /><path {...P} d="M35 55 h9 v11 h-9 Z M56 55 h9 v11 h-9 Z" /></>)}
      {type === 'long' && (<><path {...P} d="M31 20 L42 14 Q50 21 58 14 L69 20 L80 58 L70 62 L66 40 L66 86 L34 86 L34 40 L30 62 L20 58 Z" /><path {...P} d="M42 14 Q50 25 58 14" /></>)}
      {type === 'cap' && (<><path {...P} d="M28 56 A24 26 0 0 1 72 56 Z" /><path {...P} d="M24 56 Q50 70 76 56 Q50 63 24 56 Z" /><path {...P} d="M50 30 Q40 40 38 56 M50 30 Q60 40 62 56" /><circle cx="50" cy="29" r="2" fill="currentColor" /></>)}
      {type === 'beanie' && (<><path {...P} d="M30 62 Q30 30 50 30 Q70 30 70 62 Z" /><path {...P} d="M28 62 H72 V74 H28 Z" /><path {...P} d="M36 62 V74 M44 62 V74 M52 62 V74 M60 62 V74 M68 62 V74" /><circle {...P} cx="50" cy="25" r="5" /></>)}
    </svg>
  )
}

/* Бегущая строка */
function Marquee({ items, speed = 22, reverse = false, className = '' }) {
  const group = (
    <div className="marquee__group">
      {items.map((t, i) => (<React.Fragment key={i}><span>{t}</span><i className="mq-heart">♥</i></React.Fragment>))}
    </div>
  )
  return (
    <div className={'marquee ' + className} style={{ '--dur': speed + 's' }}>
      <div className={'marquee__track' + (reverse ? ' rev' : '')}>{group}{group}</div>
    </div>
  )
}

/* Обратный отсчёт до 31.10 */
function useCountdown() {
  const target = useMemo(() => {
    const now = new Date()
    let t = new Date(now.getFullYear(), 9, 31, 0, 0, 0)
    if (now > t) t = new Date(now.getFullYear() + 1, 9, 31, 0, 0, 0)
    return t
  }, [])
  const [left, setLeft] = useState(target - new Date())
  useEffect(() => { const i = setInterval(() => setLeft(target - new Date()), 1000); return () => clearInterval(i) }, [target])
  const s = Math.max(0, Math.floor(left / 1000))
  const p = (n) => String(n).padStart(2, '0')
  return { d: p(Math.floor(s / 86400)), h: p(Math.floor(s / 3600) % 24), m: p(Math.floor(s / 60) % 60), sec: p(s % 60) }
}

/* Появление при скролле */
function useReveal() {
  useEffect(() => {
    const io = new IntersectionObserver((es) => es.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target) }
    }), { threshold: 0.15 })
    document.querySelectorAll('.reveal').forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])
}

/* ============================================================
   APP
============================================================ */
export default function App() {
  const [loaded, setLoaded] = useState(false)
  const [menu, setMenu] = useState(false)
  const [cart, setCart] = useState(0)
  const [bump, setBump] = useState(0)
  const [scrolled, setScrolled] = useState(false)
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const dangleRef = useRef(null)
  const looksRef = useRef(null)
  const t = useCountdown()
  useReveal()

  /* прелоадер */
  useEffect(() => { const id = setTimeout(() => setLoaded(true), 1500); return () => clearTimeout(id) }, [])

  /* скролл: шапка + параллакс паука */
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40)
      if (dangleRef.current) dangleRef.current.style.transform = `translateY(${window.scrollY * 0.14}px)`
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /* кастомный курсор */
  const dotRef = useRef(null), ringRef = useRef(null)
  useEffect(() => {
    if (!window.matchMedia('(pointer:fine)').matches) return
    document.body.classList.add('has-cursor')
    let mx = 0, my = 0, rx = 0, ry = 0, raf
    const mm = (e) => {
      mx = e.clientX; my = e.clientY
      dotRef.current.style.transform = `translate(${mx}px,${my}px)`
      const hov = e.target.closest('a,button,input,[data-cur]')
      document.body.classList.toggle('cur-hover', !!hov)
    }
    const loop = () => { rx += (mx - rx) * .16; ry += (my - ry) * .16; ringRef.current.style.transform = `translate(${rx}px,${ry}px)`; raf = requestAnimationFrame(loop) }
    window.addEventListener('mousemove', mm)
    raf = requestAnimationFrame(loop)
    return () => { window.removeEventListener('mousemove', mm); cancelAnimationFrame(raf); document.body.classList.remove('has-cursor') }
  }, [])

  /* drag-scroll лукбука */
  const drag = useRef({ down: false, x: 0, sl: 0 })
  const onDown = (e) => { drag.current = { down: true, x: e.clientX, sl: looksRef.current.scrollLeft }; looksRef.current.style.scrollSnapType = 'none' }
  const onMove = (e) => { if (drag.current.down) looksRef.current.scrollLeft = drag.current.sl - (e.clientX - drag.current.x) }
  const onUp = () => { drag.current.down = false; if (looksRef.current) looksRef.current.style.scrollSnapType = '' }

  const addToCart = () => { setCart((c) => c + 1); setBump((b) => b + 1) }

  const NAV = [['#drop', 'дроп'], ['#manifest', 'манифест'], ['#looks', 'лукбук'], ['#capsule', 'капсула']]

  return (
    <>
      {/* курсор */}
      <div className="cur-dot" ref={dotRef} /><div className="cur-ring" ref={ringRef} />

      {/* прелоадер */}
      <div className={'preloader' + (loaded ? ' done' : '')}>
        <GlossyArc className="preloader__arc" withText />
        <div className="preloader__txt">алый по светло-серому</div>
      </div>

      {/* шапка */}
      <header className={'header' + (scrolled ? ' scrolled' : '')}>
        <a href="#top" className="header__logo" data-cur>
          <GlossyArc className="header__arc" />
          <span>OCTOBER</span>
        </a>
        <nav className="header__nav">
          {NAV.map(([h, l]) => <a key={h} href={h}>{l}</a>)}
        </nav>
        <div className="header__right">
          <button className="header__cart" onClick={() => setMenu(true)} data-cur>
            корзина
            <b key={bump} className={'cart-badge' + (cart ? ' on bump' : '')}>{cart}</b>
          </button>
          <button className="header__burger" onClick={() => setMenu(true)} aria-label="меню"><span /><span /><span /></button>
        </div>
      </header>

      {/* мобильное меню */}
      <div className={'menu' + (menu ? ' open' : '')}>
        <button className="menu__close" onClick={() => setMenu(false)}>✕ закрыть</button>
        <Web className="menu__web" R={100} spokes={12} rings={4} stroke="#B22222" sw={1.2} />
        <nav>
          {NAV.map(([h, l], i) => (
            <a key={h} href={h} onClick={() => setMenu(false)} style={{ '--d': i * 70 + 'ms' }}>{l}</a>
          ))}
        </nav>
        <div className="menu__meta">drop 04 — 31.10 00:00 msk</div>
      </div>

      <main id="top">
        {/* ============ HERO ============ */}
        <section className="hero">
          <Web className="hero__web" R={100} spokes={16} rings={5} stroke="#141414" sw={1.1} opacity={0.5} />
          <div className="hero__dangle" ref={dangleRef}><Spider style={{ height: 230 }} /></div>
          <div className="hero__word" aria-hidden="true">ОКТЯБРЬ</div>

          <div className="hero__center">
            <GlossyArc className="hero__arc arc-float" withText />
            <p className="hero__kick mono reveal in">молодой и дерзкий бренд одежды</p>
            <h1 className="hero__h1">
              {BRAND.drop}<br /><span className="thin">{BRAND.dropDate}</span>
            </h1>
            <div className="hero__cta">
              <a href="#drop" className="btn" data-cur>смотреть дроп</a>
              <a href="#manifest" className="btn-ghost" data-cur>манифест</a>
            </div>
          </div>

          <div className="hero__meta mono">
            <span>est. 2024 — msk</span>
            <span className="hero__scroll">↓ листай</span>
            <span>алый по светло-серому</span>
          </div>
        </section>

        {/* ============ TICKER ============ */}
        <div className="ticker"><Marquee items={TICKER} speed={26} /></div>

        {/* ============ МАНИФЕСТ ============ */}
        <section className="manifest" id="manifest">
          <div className="manifest__lines">
            {MANIFESTO.map((line, i) => (
              <h2 className="reveal" style={{ '--d': i * 110 + 'ms' }} key={i}>{line}</h2>
            ))}
          </div>
          <div className="manifest__bottom">
            <p className="reveal">{MANIFESTO_TEXT}</p>
            <div className="manifest__stats">
              {STATS.map((s, i) => (
                <div className="stat reveal" style={{ '--d': i * 90 + 'ms' }} key={i}>
                  <b>{s.n}</b><span className="mono">{s.t}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============ ДРОП ============ */}
        <section className="drop" id="drop">
          <div className="sec-head reveal">
            <h2>DROP 04 — ЧЁРНАЯ ВДОВА</h2>
            <span className="mono">31 предмет // после дропа матрица уничтожается</span>
          </div>
          <div className="drop__grid">
            {PRODUCTS.map((p, i) => (
              <article className={'card reveal' + (p.sold ? ' sold' : '')} style={{ '--d': (i % 3) * 90 + 'ms' }} key={p.id} data-cur>
                <div className="card__top mono">
                  <span>{p.id}</span>
                  {p.tag && <em className={'chip ' + p.tag.toLowerCase()}>{p.tag}</em>}
                  {p.sold && <em className="chip soldout">SOLD OUT</em>}
                </div>
                <Garment type={p.type} />
                {p.sold && <div className="stamp">SOLD OUT</div>}
                <div className="card__bot">
                  <div>
                    <h3 className="card__name">{p.name}</h3>
                    <span className="card__price mono">{p.price}</span>
                  </div>
                  {!p.sold && <button className="card__add" onClick={addToCart} aria-label="в корзину">+</button>}
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ============ ЛУКБУК ============ */}
        <section className="looks-sec" id="looks">
          <div className="sec-head reveal">
            <h2>LOOKBOOK // СПУСК В ПАУТИНУ</h2>
            <span className="mono">тяни →</span>
          </div>
          <div className="looks" ref={looksRef} onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerLeave={onUp}>
            {LOOKS.map((l, i) => (
              <div className={'look reveal' + (i % 2 ? ' tilt-r' : ' tilt-l')} style={{ '--d': i * 80 + 'ms' }} key={l.n} data-cur>
                <div className="look__art">
                  {l.motif === 'web' && <Web R={90} spokes={14} rings={5} stroke="#141414" sw={1.4} />}
                  {l.motif === 'arc' && <GlossyArc withText />}
                  {l.motif === 'spider' && <Spider style={{ height: '78%' }} />}
                  {l.motif === 'ten' && <b className="look__ten">10</b>}
                  {l.motif === 'repeat' && (
                    <div className="look__repeat">{Array.from({ length: 24 }, (_, k) => <span key={k}>ОКТЯБРЬ</span>)}</div>
                  )}
                </div>
                <div className="look__cap mono"><b>LOOK {l.n}</b><span>{l.title}</span></div>
              </div>
            ))}
          </div>
        </section>

        {/* ============ FLASH-КАПСУЛА (красная инверсия) ============ */}
        <section className="capsule" id="capsule">
          <Spider className="capsule__spider" stroke="#E8E8E8" style={{ height: 190 }} />
          <Web className="capsule__web" R={100} spokes={16} rings={5} stroke="#E8E8E8" sw={1.1} heartFill="#E8E8E8" />
          <div className="capsule__inner">
            <span className="mono capsule__kick reveal">flash-capsule №04</span>
            <h2 className="reveal">ЧЁРНАЯ ВДОВА</h2>
            <p className="reveal">
              31 предмет. Тату-флэш паутина, нанесённая вручную иглой и алым пигментом на серый хлопок.
              Каждый экземпляр подписан номером: от 10/01 до 10/31. После дропа матрица уничтожается.
            </p>
            <a href="#community" className="btn-light reveal" data-cur>занять номер</a>
          </div>
        </section>

        {/* ============ COUNTDOWN ============ */}
        <section className="count">
          <span className="mono reveal">до дропа осталось:</span>
          <div className="count__row reveal">
            {[['д', t.d], ['ч', t.h], ['м', t.m], ['с', t.sec]].map(([l, v], i) => (
              <React.Fragment key={l}>
                <div className="count__box"><b>{v}</b><span className="mono">{l}</span></div>
                {i < 3 && <i className="count__sep">:</i>}
              </React.Fragment>
            ))}
          </div>
          <span className="mono count__date reveal">31 . 10 // 00:00 msk</span>
        </section>

        {/* ============ СООБЩЕСТВО ============ */}
        <section className="community" id="community">
          <Web className="community__web" R={60} spokes={12} rings={4} stroke="#B22222" sw={1.6} />
          <h2 className="reveal">ВОЙДИ В ПАУТИНУ</h2>
          <p className="reveal">Закрытые дропы приходят за 24 часа до остальных. Без спама — только сигнал.</p>
          {subscribed ? (
            <div className="community__ok reveal in mono">ты в паутине ♥ номер 1047</div>
          ) : (
            <form className="community__form reveal" onSubmit={(e) => { e.preventDefault(); if (email.includes('@')) setSubscribed(true) }}>
              <input type="email" required placeholder="твой@email.ru" value={email} onChange={(e) => setEmail(e.target.value)} />
              <button className="btn" type="submit" data-cur>подписаться</button>
            </form>
          )}
        </section>
      </main>

      {/* ============ ФУТЕР ============ */}
      <footer className="footer">
        <div className="footer__mega"><Marquee items={['OCTOBER', 'ОКТЯБРЬ']} speed={40} className="mega" /></div>
        <div className="footer__grid">
          <div>
            <GlossyArc className="footer__arc" withText />
            <p className="mono footer__tag">{BRAND.tagline}</p>
          </div>
          <div className="mono">
            <b>menu</b>
            {NAV.map(([h, l]) => <a key={h} href={h}>{l}</a>)}
          </div>
          <div className="mono">
            <b>social</b>
            <a href="#">telegram</a><a href="#">vk</a><a href="#">youtube</a>
          </div>
          <div className="mono">
            <b>info</b>
            <a href="#">размерная сетка</a><a href="#">доставка и возврат</a><a href="#">уход: х/б, холодная стирка</a>
          </div>
        </div>
        <div className="footer__bot mono">
          <span>© 2026 OCTOBER</span>
          <span>сделано с ♥ и ядом</span>
        </div>
      </footer>
    </>
  )
}