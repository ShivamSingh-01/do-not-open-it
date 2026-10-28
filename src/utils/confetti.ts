/**
 * Romantic Confetti & Hearts Canvas Engine
 * Lightweight, zero-dependency, highly optimized for mobile 60fps.
 */

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  rotation: number;
  rotationSpeed: number;
  type: 'heart' | 'ribbon' | 'circle' | 'star';
  opacity: number;
  wobble: number;
  wobbleSpeed: number;
  gravity: number;
  drag: number;
}

const ROMANTIC_PALETTE = [
  '#FF758F', // Blush pink
  '#FFB3C1', // Soft rose
  '#E08D9D', // Dusty rose
  '#D4AF37', // Champagne gold
  '#FFF0F3', // Cream white
  '#FF4D6D', // Romantic red
  '#F9C784', // Warm amber
  '#FFCAD4'  // Pale pink
];

export function launchCelebrationConfetti(durationMs = 4000): () => void {
  const canvas = document.createElement('canvas');
  canvas.id = 'birthday-confetti-canvas';
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100vw';
  canvas.style.height = '100vh';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '9999';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    canvas.remove();
    return () => {};
  }

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  const onResize = () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  };
  window.addEventListener('resize', onResize);

  const particles: Particle[] = [];
  const particleCount = window.innerWidth < 768 ? 75 : 140;

  // Launch initial burst from lower center/sides
  for (let i = 0; i < particleCount; i++) {
    const isLeft = i % 2 === 0;
    const startX = isLeft ? width * 0.2 : width * 0.8;
    const startY = height * 0.85;

    const angle = isLeft
      ? -Math.PI / 4 + (Math.random() * 0.5 - 0.25)
      : -3 * Math.PI / 4 + (Math.random() * 0.5 - 0.25);

    const speed = 12 + Math.random() * 16;
    const types: Particle['type'][] = ['heart', 'heart', 'ribbon', 'circle', 'star'];

    particles.push({
      x: startX + (Math.random() * 40 - 20),
      y: startY + (Math.random() * 40 - 20),
      vx: Math.cos(angle) * speed + (Math.random() * 4 - 2),
      vy: Math.sin(angle) * speed - (Math.random() * 5),
      size: 6 + Math.random() * 8,
      color: ROMANTIC_PALETTE[Math.floor(Math.random() * ROMANTIC_PALETTE.length)],
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.15,
      type: types[Math.floor(Math.random() * types.length)],
      opacity: 1,
      wobble: Math.random() * 10,
      wobbleSpeed: 0.05 + Math.random() * 0.08,
      gravity: 0.28 + Math.random() * 0.15,
      drag: 0.985
    });
  }

  const startTime = performance.now();
  let animationId: number;

  const drawHeart = (c: CanvasRenderingContext2D, size: number) => {
    const s = size * 0.5;
    c.beginPath();
    c.moveTo(0, s * 0.3);
    c.bezierCurveTo(-s, -s * 0.6, -s * 1.3, s * 0.4, 0, s * 1.4);
    c.bezierCurveTo(s * 1.3, s * 0.4, s, -s * 0.6, 0, s * 0.3);
    c.fill();
  };

  const drawStar = (c: CanvasRenderingContext2D, size: number) => {
    const spikes = 4;
    const outerRadius = size;
    const innerRadius = size * 0.4;
    let rot = (Math.PI / 2) * 3;
    let x = 0;
    let y = 0;
    const step = Math.PI / spikes;

    c.beginPath();
    c.moveTo(0, -outerRadius);
    for (let i = 0; i < spikes; i++) {
      x = Math.cos(rot) * outerRadius;
      y = Math.sin(rot) * outerRadius;
      c.lineTo(x, y);
      rot += step;

      x = Math.cos(rot) * innerRadius;
      y = Math.sin(rot) * innerRadius;
      c.lineTo(x, y);
      rot += step;
    }
    c.lineTo(0, -outerRadius);
    c.closePath();
    c.fill();
  };

  const render = (now: number) => {
    const elapsed = now - startTime;
    ctx.clearRect(0, 0, width, height);

    let aliveCount = 0;

    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      p.vx *= p.drag;
      p.vy = p.vy * p.drag + p.gravity;
      p.rotation += p.rotationSpeed;
      p.wobble += p.wobbleSpeed;

      if (elapsed > durationMs - 1200) {
        p.opacity = Math.max(0, p.opacity - 0.02);
      }

      if (p.y < height + 50 && p.opacity > 0) {
        aliveCount++;
        ctx.save();
        ctx.translate(p.x + Math.sin(p.wobble) * 4, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = p.color;

        if (p.type === 'heart') {
          drawHeart(ctx, p.size);
        } else if (p.type === 'star') {
          drawStar(ctx, p.size);
        } else if (p.type === 'ribbon') {
          ctx.fillRect(-p.size * 0.6, -p.size * 0.2, p.size * 1.2, p.size * 0.4);
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, p.size * 0.4, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }
    }

    if (aliveCount > 0 && elapsed < durationMs) {
      animationId = requestAnimationFrame(render);
    } else {
      cleanup();
    }
  };

  const cleanup = () => {
    cancelAnimationFrame(animationId);
    window.removeEventListener('resize', onResize);
    if (canvas.parentNode) {
      canvas.parentNode.removeChild(canvas);
    }
  };

  animationId = requestAnimationFrame(render);
  return cleanup;
}

export function launchMiniSparkles(x: number, y: number): void {
  const count = 12;
  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.left = `${x}px`;
  container.style.top = `${y}px`;
  container.style.pointerEvents = 'none';
  container.style.zIndex = '99999';
  document.body.appendChild(container);

  for (let i = 0; i < count; i++) {
    const el = document.createElement('span');
    el.innerHTML = i % 2 === 0 ? '✨' : '💖';
    el.style.position = 'absolute';
    el.style.fontSize = `${10 + Math.random() * 12}px`;
    el.style.left = '0';
    el.style.top = '0';
    el.style.transition = 'all 0.7s cubic-bezier(0.2, 0.9, 0.3, 1)';
    el.style.opacity = '1';
    container.appendChild(el);

    const angle = (i / count) * Math.PI * 2 + (Math.random() * 0.4);
    const dist = 30 + Math.random() * 45;
    const destX = Math.cos(angle) * dist;
    const destY = Math.sin(angle) * dist;

    requestAnimationFrame(() => {
      el.style.transform = `translate(${destX}px, ${destY}px) scale(${0.5 + Math.random() * 0.8})`;
      el.style.opacity = '0';
    });
  }

  setTimeout(() => {
    if (container.parentNode) {
      container.parentNode.removeChild(container);
    }
  }, 800);
}
