/* Senura — Vol. I. Editorial interactions. */

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- footer year ---------- */
const year = document.querySelector("[data-year]");
if (year) year.textContent = new Date().getFullYear();

/* ---------- live clock (Sydney) ---------- */
const clock = document.querySelector("[data-clock]");
if (clock) {
  const fmt = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Australia/Sydney",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
  const tick = () => {
    clock.textContent = fmt.format(new Date());
  };
  tick();
  setInterval(tick, 1000);
}

/* ---------- scroll progress line ---------- */
const progress = document.querySelector("[data-progress]");
const syncProgress = () => {
  if (!progress) return;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.width = `${max > 0 ? (window.scrollY / max) * 100 : 0}%`;
};

/* ---------- custom cursor ---------- */
const cursor = document.querySelector("[data-cursor]");
if (cursor && window.matchMedia("(pointer: fine)").matches) {
  let cx = -100;
  let cy = -100;
  let tx = cx;
  let ty = cy;

  window.addEventListener("pointermove", (e) => {
    tx = e.clientX;
    ty = e.clientY;
    cursor.style.opacity = "1";
  });

  document.addEventListener("mouseleave", () => {
    cursor.style.opacity = "0";
  });

  document.addEventListener("pointerover", (e) => {
    cursor.classList.toggle(
      "is-active",
      Boolean(e.target.closest("a, button, [data-ink]"))
    );
  });

  const follow = () => {
    cx += (tx - cx) * 0.18;
    cy += (ty - cy) * 0.18;
    cursor.style.left = `${cx}px`;
    cursor.style.top = `${cy}px`;
    requestAnimationFrame(follow);
  };
  follow();
}

/* ---------- fade-in on scroll ---------- */
const fadeObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        fadeObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);
document.querySelectorAll("[data-fade]").forEach((el) => fadeObserver.observe(el));

/* ---------- foreword: word-by-word reveal ---------- */
const foreword = document.querySelector("[data-reveal-words]");
let forewordWords = [];
if (foreword) {
  const words = foreword.textContent.trim().split(/\s+/);
  foreword.innerHTML = words
    .map((w) => `<span class="w">${w}</span>`)
    .join(" ");
  forewordWords = Array.from(foreword.querySelectorAll(".w"));
}

const syncForeword = () => {
  if (!forewordWords.length || prefersReducedMotion) return;
  const rect = foreword.getBoundingClientRect();
  const vh = window.innerHeight;
  // 0 as the block enters the lower viewport, 1 once it has risen past centre
  const t = (vh * 0.85 - rect.top) / (rect.height + vh * 0.5);
  const lit = Math.floor(Math.max(0, Math.min(1, t)) * forewordWords.length);
  forewordWords.forEach((w, i) => w.classList.toggle("is-lit", i < lit));
};

/* ---------- chapters: horizontal scroll ---------- */
const chaptersSection = document.querySelector("[data-chapters]");
const chaptersTrack = document.querySelector("[data-chapters-track]");
const horizontalEnabled = () =>
  window.matchMedia("(min-width: 900px) and (pointer: fine)").matches &&
  !prefersReducedMotion;

const sizeChapters = () => {
  if (!chaptersSection || !chaptersTrack) return;
  if (!horizontalEnabled()) {
    chaptersSection.style.height = "";
    return;
  }
  const extra = chaptersTrack.scrollWidth - window.innerWidth;
  chaptersSection.style.height = `${window.innerHeight + extra}px`;
};

const syncChapters = () => {
  if (!chaptersSection || !chaptersTrack || !horizontalEnabled()) return;
  const extra = chaptersTrack.scrollWidth - window.innerWidth;
  if (extra <= 0) return;
  const start = chaptersSection.offsetTop;
  const t = Math.max(0, Math.min(1, (window.scrollY - start) / extra));
  chaptersTrack.style.transform = `translateX(${-t * extra}px)`;
};

/* ---------- chapter I: particle drift ---------- */
const particleCanvas = document.querySelector("[data-particles]");
if (particleCanvas) {
  const ctx = particleCanvas.getContext("2d");
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  let w = 0;
  let h = 0;
  let dots = [];
  let running = false;
  let t = 0;

  const setup = () => {
    w = particleCanvas.offsetWidth;
    h = particleCanvas.offsetHeight;
    particleCanvas.width = w * dpr;
    particleCanvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const gauss = () =>
      (Math.random() + Math.random() + Math.random() + Math.random() - 2) / 2;
    dots = Array.from({ length: 260 }, () => ({
      x: w * 0.5 + gauss() * w * 0.42,
      y: h * 0.5 + gauss() * h * 0.42,
      r: Math.random() * 1.4 + 0.5,
      p: Math.random() * Math.PI * 2,
      s: 0.2 + Math.random() * 0.5,
    }));
  };

  const frame = () => {
    t += 0.008;
    ctx.clearRect(0, 0, w, h);

    ctx.fillStyle = "rgba(32, 28, 22, 0.55)";
    dots.forEach((d) => {
      const x = d.x + Math.sin(t * d.s * 3 + d.p) * 6;
      const y = d.y + Math.cos(t * d.s * 2.4 + d.p) * 5;
      ctx.beginPath();
      ctx.arc(x, y, d.r, 0, Math.PI * 2);
      ctx.fill();
    });

    // roaming lens: a thin circle with a terracotta focus dot
    const lx = w * 0.5 + Math.cos(t * 0.7) * w * 0.3;
    const ly = h * 0.5 + Math.sin(t * 1.1) * h * 0.26;
    ctx.strokeStyle = "rgba(32, 28, 22, 0.8)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(lx, ly, 22, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = "#c2764f";
    ctx.beginPath();
    ctx.arc(lx + 26, ly - 4, 2.4, 0, Math.PI * 2);
    ctx.fill();
  };

  const loop = () => {
    if (!running) return;
    frame();
    requestAnimationFrame(loop);
  };

  const visibility = new IntersectionObserver(
    ([entry]) => {
      if (prefersReducedMotion) {
        if (entry.isIntersecting) frame(); // one static frame
        return;
      }
      const shouldRun = entry.isIntersecting;
      if (shouldRun && !running) {
        running = true;
        loop();
      } else if (!shouldRun) {
        running = false;
      }
    },
    { threshold: 0.1 }
  );

  setup();
  visibility.observe(particleCanvas);
  window.addEventListener("resize", setup);
}

/* ---------- chapter IV: generative ink ---------- */
const inkCanvas = document.querySelector("[data-ink]");
if (inkCanvas) {
  const ctx = inkCanvas.getContext("2d");
  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  const loopPoints = (cx, cy, rx, ry) => {
    const n = 5 + Math.floor(Math.random() * 4);
    const pts = [];
    for (let i = 0; i < n; i += 1) {
      const a = (i / n) * Math.PI * 2 + Math.random() * 0.6;
      pts.push({
        x: cx + Math.cos(a) * rx * (0.4 + Math.random() * 0.9),
        y: cy + Math.sin(a) * ry * (0.4 + Math.random() * 0.9),
      });
    }
    return pts;
  };

  const strokeLoop = (pts, jitter) => {
    const mid = (a, b) => ({
      x: (a.x + b.x) / 2 + (Math.random() - 0.5) * jitter,
      y: (a.y + b.y) / 2 + (Math.random() - 0.5) * jitter,
    });
    ctx.beginPath();
    let m = mid(pts[pts.length - 1], pts[0]);
    ctx.moveTo(m.x, m.y);
    for (let i = 0; i < pts.length; i += 1) {
      const p = pts[i];
      m = mid(p, pts[(i + 1) % pts.length]);
      ctx.quadraticCurveTo(p.x, p.y, m.x, m.y);
    }
    ctx.closePath();
    ctx.stroke();
  };

  const paint = () => {
    const w = inkCanvas.offsetWidth;
    const h = inkCanvas.offsetHeight;
    inkCanvas.width = w * dpr;
    inkCanvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);

    const loops = 6 + Math.floor(Math.random() * 4);
    for (let i = 0; i < loops; i += 1) {
      const cx = w * (0.15 + Math.random() * 0.7);
      const cy = h * (0.2 + Math.random() * 0.6);
      const rx = w * (0.1 + Math.random() * 0.22);
      const ry = h * (0.15 + Math.random() * 0.3);
      const terracotta = Math.random() < 0.35;
      const pts = loopPoints(cx, cy, rx, ry);

      // repeated jittered passes give the fuzzy hand-inked look
      for (let pass = 0; pass < 4; pass += 1) {
        ctx.strokeStyle = terracotta
          ? `rgba(194, 118, 79, ${0.1 + pass * 0.1})`
          : `rgba(32, 28, 22, ${0.08 + pass * 0.09})`;
        ctx.lineWidth = pass === 3 ? 1.1 : 2.2 - pass * 0.4;
        strokeLoop(pts, 5 + pass * 3);
      }
    }
  };

  paint();
  inkCanvas.addEventListener("click", paint);
  window.addEventListener("resize", paint);
}

/* ---------- header inversion over dark sections ---------- */
const siteHeader = document.querySelector("[data-header]");
const nightSection = document.querySelector(".night");
const syncHeader = () => {
  if (!siteHeader || !nightSection) return;
  const rect = nightSection.getBoundingClientRect();
  const probe = 40; // vertical centre of the header bar
  siteHeader.classList.toggle(
    "is-inverted",
    rect.top <= probe && rect.bottom >= probe
  );
};

/* ---------- scroll + resize wiring ---------- */
const onScroll = () => {
  syncProgress();
  syncForeword();
  syncChapters();
  syncHeader();
};

const onResize = () => {
  sizeChapters();
  onScroll();
};

sizeChapters();
onScroll();
window.addEventListener("scroll", onScroll, { passive: true });
window.addEventListener("resize", onResize);
window.addEventListener("load", onResize);
