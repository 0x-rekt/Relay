function oscillator(phase = 0, offset = 0, frequency = 0.001, amplitude = 1) {
  let p = phase;
  return {
    update: () => {
      p += frequency;
      return offset + Math.sin(p) * amplitude;
    },
  };
}

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

interface LineConfig {
  spring: number;
  friction: number;
  nodes: Node[];
}

function createLine(spring: number, friction: number, size: number, pos: { x: number; y: number }): LineConfig {
  const nodes: Node[] = [];
  for (let i = 0; i < size; i++) {
    nodes.push({ x: pos.x, y: pos.y, vx: 0, vy: 0 });
  }
  return {
    spring: spring + 0.1 * Math.random() - 0.05,
    friction: friction + 0.01 * Math.random() - 0.005,
    nodes,
  };
}

function updateLine(line: LineConfig, pos: { x: number; y: number }, dampening: number, tension: number) {
  let spring = line.spring;
  const first = line.nodes[0];
  first.vx += (pos.x - first.x) * spring;
  first.vy += (pos.y - first.y) * spring;

  for (let i = 0; i < line.nodes.length; i++) {
    const node = line.nodes[i];
    if (i > 0) {
      const prev = line.nodes[i - 1];
      node.vx += (prev.x - node.x) * spring;
      node.vy += (prev.y - node.y) * spring;
      node.vx += prev.vx * dampening;
      node.vy += prev.vy * dampening;
    }
    node.vx *= line.friction;
    node.vy *= line.friction;
    node.x += node.vx;
    node.y += node.vy;
    spring *= tension;
  }
}

function drawLine(ctx: CanvasRenderingContext2D, line: LineConfig) {
  const first = line.nodes[0];
  ctx.beginPath();
  ctx.moveTo(first.x, first.y);

  for (let i = 1; i < line.nodes.length - 2; i++) {
    const current = line.nodes[i];
    const next = line.nodes[i + 1];
    const cpx = (current.x + next.x) / 2;
    const cpy = (current.y + next.y) / 2;
    ctx.quadraticCurveTo(current.x, current.y, cpx, cpy);
  }

  const last = line.nodes[line.nodes.length - 2];
  const end = line.nodes[line.nodes.length - 1];
  ctx.quadraticCurveTo(last.x, last.y, end.x, end.y);
  ctx.stroke();
  ctx.closePath();
}

export function renderCanvas() {
  const canvas = document.getElementById("canvas") as HTMLCanvasElement | null;
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const canvasEl = canvas;

  const pos = { x: 0, y: 0 };
  const config = {
    friction: 0.5,
    trails: 80,
    size: 50,
    dampening: 0.025,
    tension: 0.99,
  };

  const hue = oscillator(Math.random() * 2 * Math.PI, 285, 0.0015, 85);

  function onMouseMove(e: MouseEvent | TouchEvent) {
    if ("touches" in e) {
      const touch = e.touches[0];
      if (touch) {
        pos.x = touch.pageX;
        pos.y = touch.pageY;
      }
    } else {
      pos.x = e.clientX;
      pos.y = e.clientY;
    }
    e.preventDefault();
  }

  function onTouchStart(e: TouchEvent) {
    if (e.touches.length === 1) {
      pos.x = e.touches[0].pageX;
      pos.y = e.touches[0].pageY;
    }
  }

  function resizeCanvas() {
    canvasEl.width = window.innerWidth;
    canvasEl.height = window.innerHeight;
  }

  const lines: LineConfig[] = [];

  function initLines() {
    lines.length = 0;
    for (let i = 0; i < config.trails; i++) {
      lines.push(createLine(0.45 + (i / config.trails) * 0.025, config.friction, config.size, pos));
    }
  }

  function render() {
    if (!ctx) return;
    ctx.globalCompositeOperation = "source-over";
    ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);
    ctx.globalCompositeOperation = "lighter";
    ctx.strokeStyle = `hsla(${Math.round(hue.update())},100%,50%,0.025)`;
    ctx.lineWidth = 10;

    for (let i = 0; i < config.trails; i++) {
      const line = lines[i];
      updateLine(line, pos, config.dampening, config.tension);
      drawLine(ctx, line);
    }

    requestAnimationFrame(render);
  }

  document.addEventListener("mousemove", onMouseMove);
  document.addEventListener("touchmove", onMouseMove, { passive: false });
  document.addEventListener("touchstart", onTouchStart);
  window.addEventListener("resize", resizeCanvas);

  resizeCanvas();
  initLines();
  render();
}
