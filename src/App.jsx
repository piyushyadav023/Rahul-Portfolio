import { useEffect, useRef, useState } from "react";
import { portfolio } from "./portfolio";

const motionOk = () => !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Supports a full YouTube Shorts URL, a regular YouTube URL, or a raw video ID.
const getYouTubeId = (value = "") => {
  if (!value || value.includes("PASTE_YOUR")) return "";
  const match = value.match(/(?:youtu\.be\/|youtube\.com\/(?:shorts\/|watch\?v=|embed\/))([\w-]{11})/);
  return match?.[1] || (/^[\w-]{11}$/.test(value) ? value : "");
};

const getYouTubeThumbnail = (url, fallback) => {
  const id = getYouTubeId(url);
  return id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : fallback;
};

function Arrow({ direction = "down" }) {
  return <span className={`arrow arrow--${direction}`} aria-hidden="true">{direction === "down" ? "↓" : "↗"}</span>;
}

function ImageSlot({ src, alt, className = "", tone }) {
  const [loaded, setLoaded] = useState(true);
  return (
    <div className={`image-slot ${className} ${tone ? `tone-${tone}` : ""} ${loaded ? "" : "image-slot--fallback"}`}>
      {loaded && <img src={src} alt={alt} loading="lazy" onError={() => setLoaded(false)} />}
      {!loaded && <span className="image-slot__placeholder" aria-hidden="true" />}
    </div>
  );
}

function Loader() {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), motionOk() ? 1150 : 0);
    return () => clearTimeout(timer);
  }, []);
  return <div className={`loader ${visible ? "" : "loader--done"}`} aria-hidden={!visible}>
    <span>RAHUL KUMAR</span><small>VIDEO EDITOR / 2026</small><i />
  </div>;
}

function Cursor() {
  const cursor = useRef(null);
  const [active, setActive] = useState("");
  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return undefined;
    const move = (event) => {
      if (cursor.current) cursor.current.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`;
    };
    const enter = (event) => setActive(event.target.closest("[data-cursor]")?.dataset.cursor || "");
    document.addEventListener("pointermove", move);
    document.addEventListener("pointerover", enter);
    return () => { document.removeEventListener("pointermove", move); document.removeEventListener("pointerover", enter); };
  }, []);
  return <div ref={cursor} className={`cursor ${active ? "cursor--active" : ""}`} aria-hidden="true"><span>{active}</span></div>;
}

function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const close = () => setOpen(false);
  const links = ["work", "about", "skills", "contact"];
  return <header className={`nav ${scrolled ? "nav--scrolled" : ""} ${open ? "nav--open" : ""}`}>
    <a href="#top" className="nav__name" onClick={close}>{portfolio.name}</a>
    <div className="nav__desk">
      <nav aria-label="Main navigation">{links.map((link) => <a key={link} href={`#${link}`}>{link}</a>)}</nav>
      <span className="availability"><i /> AVAILABLE FOR PROJECTS</span>
    </div>
    <button className="menu" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="mobile-navigation"><span /><span /></button>
    <div className="mobile-nav" id="mobile-navigation">
      <span className="eyebrow">Navigate / 01—04</span>
      <nav>{links.map((link, index) => <a key={link} href={`#${link}`} onClick={close}><b>0{index + 1}</b>{link}<Arrow direction="right" /></a>)}</nav>
      <span className="availability"><i /> AVAILABLE FOR PROJECTS</span>
    </div>
  </header>;
}

function Hero() {
  const visual = useRef(null);
  const parallax = (event) => {
    if (!motionOk() || !visual.current || !window.matchMedia("(pointer: fine)").matches) return;
    const { left, top, width, height } = visual.current.getBoundingClientRect();
    const x = (event.clientX - left - width / 2) / width;
    const y = (event.clientY - top - height / 2) / height;
    visual.current.style.setProperty("--mx", `${x * 9}px`);
    visual.current.style.setProperty("--my", `${y * 9}px`);
  };
  const reset = () => visual.current?.style.setProperty("--mx", "0px") || visual.current?.style.setProperty("--my", "0px");
  return <section className="hero" id="top" onPointerMove={parallax} onPointerLeave={reset}>
    <div className="hero__lede"><span className="eyebrow">Video editor / motion / storytelling</span><span>Based in India <i className="dot" /></span></div>
    <div className="hero__type" aria-label="Rahul Kumar"><h1>RAHUL</h1><h1>KUMAR</h1></div>
    <div ref={visual} className="hero__visual">
      <div className="hero__portrait"><ImageSlot src={portfolio.portrait} alt="Rahul Kumar, video editor" className="portrait-image" tone="portrait" /></div>
      <span className="hero__label hero__label--one">EDITOR<br />PREMIERE PRO<br />AFTER EFFECTS</span>
      <span className="hero__label hero__label--two">FRAME / 0001</span>
      <span className="orbit">TURN RAW INTO REMARKABLE —&nbsp;</span>
    </div>
    <div className="hero__bottom">
      <p>I EDIT IDEAS<br /><em>INTO STORIES.</em></p>
      <div><p className="intro">Video editor focused on YouTube content, storytelling, pacing, motion graphics and visual communication.</p><div className="hero__actions"><a className="button button--light" href="#work" data-cursor="OPEN">VIEW WORK <Arrow /></a><a className="text-link" href="#contact">LET'S WORK <Arrow direction="right" /></a></div></div>
    </div>
    <span className="hero__side">SCROLL TO CUT DEEPER <Arrow /></span>
  </section>;
}

function PlayMark() { return <span className="play-mark" aria-hidden="true"><i /></span>; }

function Showreel() {
  const [playing, setPlaying] = useState(false);
  const videoId = getYouTubeId(portfolio.showreel.youtubeUrl);
  const canEmbed = Boolean(videoId);
  return <section className="showreel section" id="work">
    <div className="section-label"><span>01 / SELECTED WORK</span><span>THE REEL</span></div>
    <div className="showreel__frame showreel__frame--short">
      {playing && canEmbed ? <iframe src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`} title={portfolio.showreel.title} allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen /> : <button className="showreel__cover" onClick={() => canEmbed && setPlaying(true)} data-cursor="PLAY" aria-label={canEmbed ? "Play showreel" : "Add your YouTube video ID in src/portfolio.js"}>
        <div className="showreel__art"><span>THE<br />REEL</span><b>RK</b><i /></div>
        <PlayMark />
        {!canEmbed && <small>PASTE YOUR SHORTS LINK IN <code>src/portfolio.js</code></small>}
      </button>}
      <span className="showreel__time">{portfolio.showreel.duration}</span>
      <span className="showreel__format">SHORT FORM</span>
    </div>
      <div className="showreel__meta"><div><span className="eyebrow">{portfolio.showreel.category}</span><h2>{portfolio.showreel.title}</h2></div><div><span>{portfolio.showreel.year}</span><button className="showreel__replay" onClick={() => canEmbed && setPlaying(true)} data-cursor="PLAY">PLAY HERE <Arrow direction="right" /></button></div></div>
  </section>;
}

function Marquee() {
  const text = "EDIT / CUT / MOTION / STORY / RHYTHM / FRAME / REPEAT / ";
  return <div className="marquee" aria-label="Edit, Cut, Motion, Story, Rhythm, Frame, Repeat"><div>{text.repeat(3)}<span>{text.repeat(3)}</span></div></div>;
}

function Project({ project }) {
  const [playing, setPlaying] = useState(false);
  const videoId = getYouTubeId(project.youtubeUrl);
  const hasVideo = Boolean(getYouTubeId(project.youtubeUrl));
  const thumbnail = getYouTubeThumbnail(project.youtubeUrl, project.image);
  return <article className={`project project--${project.number}`}>
    <div className={`project__image ${playing ? "project__image--playing" : ""}`}>
      {playing && hasVideo ? <><iframe src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`} title={project.title} allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen /><button className="player-close" onClick={() => setPlaying(false)} aria-label={`Close ${project.title}`}>CLOSE ×</button></> : <button className="project__trigger" onClick={() => hasVideo && setPlaying(true)} data-cursor="PLAY" aria-label={hasVideo ? `Play ${project.title}` : `Add a YouTube Short URL for ${project.title}`}>
        <ImageSlot src={thumbnail} alt={`${project.title} video thumbnail`} tone={project.tone} />
        <div className="project__overlay"><PlayMark /><span>PLAY HERE <Arrow direction="right" /></span></div>
        <i className="project__scan" />
      </button>}
    </div>
    <div className="project__meta"><span>{project.number} / {project.year}</span><span>{project.format}</span></div>
    <h3>{project.title}</h3><p>{project.description}</p>
  </article>;
}

function Projects() {
    return <section className="projects section"><div className="section-label"><span>02 / PROJECT INDEX</span><span>SELECT / PLAY / REPEAT</span></div><div className="projects__grid">{portfolio.projects.map((project) => <Project project={project} key={project.number} />)}</div></section>;
}

function QuickShort({ short }) {
  const [playing, setPlaying] = useState(false);
  const videoId = getYouTubeId(short.youtubeUrl);
  const hasVideo = Boolean(videoId);
  const thumbnail = getYouTubeThumbnail(short.youtubeUrl, short.image);
  return <article className="quick-short">
    <div className="quick-short__player">
      {playing && hasVideo ? <><iframe src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`} title={short.title} allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen /><button className="player-close" onClick={() => setPlaying(false)} aria-label={`Close ${short.title}`}>CLOSE ×</button></> : <button className="quick-short__trigger" onClick={() => hasVideo && setPlaying(true)} data-cursor="PLAY" aria-label={hasVideo ? `Play ${short.title}` : `Add a YouTube Short URL for ${short.title}`}><ImageSlot src={thumbnail} alt={`${short.title} video thumbnail`} tone={short.tone} /><PlayMark /><span>{hasVideo ? "PLAY SHORT" : "ADD SHORT URL"}</span></button>}
    </div>
    <div><span>{short.number} / 9:16</span><h3>{short.title}</h3><p>{short.category}</p></div>
  </article>;
}

function QuickShorts() {
  return <section className="quick-shorts section"><div className="section-label"><span>02A / QUICK CUTS</span><span>TWO MORE SHORTS</span></div><div className="quick-shorts__grid">{portfolio.quickShorts.map((short) => <QuickShort short={short} key={short.number} />)}</div></section>;
}

function About() {
  return <section className="about section" id="about"><div className="section-label"><span>03 / THE EDITOR</span><span>NO EMPTY FRAMES</span></div><div className="about__statement"><span>I DON'T JUST</span><h2>CUT <em>CLIPS.</em></h2><h2>I BUILD <strong>FLOW.</strong></h2></div><div className="about__detail"><p>Rahul Kumar is a video editor focused on turning raw footage into engaging visual stories for YouTube and digital platforms.</p><ul><li>VIDEO EDITOR</li><li>YOUTUBE</li><li>MOTION GRAPHICS</li><li>VISUAL STORYTELLING</li></ul></div></section>;
}

function Timeline() { return <div className="timeline" aria-hidden="true"><span>CUT</span><i /><span>TRANSITION</span><b /><span>MOTION</span><i /><span>SFX</span><b /><span>COLOR</span><i /><span>STORY</span></div>; }

function Skills() {
  const [active, setActive] = useState(0);
    return <section className="skills section" id="skills"><div className="section-label"><span>04 / TOOLSET</span><span>THREE TOOLS. ONE LANGUAGE.</span></div><div className="skills__list">{portfolio.skills.map((skill, index) => <button key={skill.name} className={`skill ${active === index ? "skill--active" : ""}`} onMouseEnter={() => setActive(index)} onFocus={() => setActive(index)} onClick={() => setActive(index)}><span className="skill__no">{skill.number}</span><span className="skill__name"><i className={`skill__logo skill__logo--${skill.brand}`} aria-hidden="true">{skill.icon}</i>{skill.name}</span><span className="skill__detail">{skill.detail}</span><span className="skill__tag">{skill.label}</span><Arrow direction="right" /></button>)}</div><Timeline /></section>;
}

function PortraitSpread() {
  return <section className="portrait-spread section"><div className="portrait-spread__word">KEEP<br />LOOKING</div><div className="portrait-spread__image"><ImageSlot src={portfolio.portrait} alt="Rahul Kumar in an editorial portrait" tone="portrait" /><span className="portrait-spread__stamp">RK<br />EDITS</span></div><div className="portrait-spread__caption"><span>PERSON / PROCESS / PACE</span><p>Every frame earns<br />the next one.</p><span>2026&nbsp;&nbsp; — &nbsp;&nbsp;INDIA</span></div></section>;
}

function Contact() { return <section className="contact section" id="contact"><div className="section-label"><span>05 / START A PROJECT</span><span>THE NEXT CUT STARTS HERE</span></div><h2>HAVE A VIDEO<br />THAT NEEDS<br /><em>TO HIT HARDER?</em></h2><a className="contact__cta" href={`mailto:${portfolio.email}`} data-cursor="OPEN">LET'S TALK <Arrow direction="right" /></a><div className="contact__links"><a href={`mailto:${portfolio.email}`}>{portfolio.email}</a><a href={portfolio.instagram} target="_blank" rel="noreferrer">INSTAGRAM <Arrow direction="right" /></a><a href={portfolio.youtube} target="_blank" rel="noreferrer">YOUTUBE <Arrow direction="right" /></a></div></section>; }

function Footer() { return <footer><a href="#top">RAHUL KUMAR</a><span>VIDEO EDITOR</span><span>© 2026</span><a href="#top">BACK TO TOP <Arrow direction="right" /></a></footer>; }

export default function App() {
  return <><Loader /><Cursor /><Nav /><main><Hero /><Showreel /><Marquee /><Projects /><QuickShorts /><About /><Skills /><PortraitSpread /><Contact /></main><Footer /></>;
}
