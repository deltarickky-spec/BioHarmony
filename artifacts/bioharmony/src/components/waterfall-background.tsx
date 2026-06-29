import { useRef, useEffect } from "react";

interface WaterfallBackgroundProps {
  opacity?: number;
  color1?: string;
  color2?: string;
  speed?: number;
}

export default function WaterfallBackground({
  opacity = 0.15,
  color1 = "rgba(27, 77, 77, 0.4)",
  color2 = "rgba(191, 161, 74, 0.15)",
  speed = 1,
}: WaterfallBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let particles: Particle[] = [];
    let drops: Drop[] = [];
    let ripples: Ripple[] = [];
    let time = 0;

    function resize() {
      if (!canvas) return;
      canvas.width = canvas.parentElement?.clientWidth ?? window.innerWidth;
      canvas.height = canvas.parentElement?.clientHeight ?? window.innerHeight;
    }

    resize();
    window.addEventListener("resize", resize);

    // Water drops (falling streaks)
    class Drop {
      x: number;
      y: number;
      length: number;
      speed: number;
      opacity: number;
      width: number;

      constructor() {
        this.x = Math.random() * (canvas?.width ?? 1920);
        this.y = -Math.random() * (canvas?.height ?? 1080);
        this.length = 20 + Math.random() * 60;
        this.speed = 2 + Math.random() * 4;
        this.opacity = 0.02 + Math.random() * 0.06;
        this.width = 0.5 + Math.random() * 1.5;
      }

      update() {
        this.y += this.speed * speed;
        if (this.y > (canvas?.height ?? 1080) + this.length) {
          // Create ripple when drop hits bottom
          ripples.push(new Ripple(this.x, (canvas?.height ?? 1080)));
          this.y = -this.length;
          this.x = Math.random() * (canvas?.width ?? 1920);
          this.speed = 2 + Math.random() * 4;
        }
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x + (Math.sin(time * 0.002 + this.y * 0.01) * 2), this.y + this.length);
        ctx.strokeStyle = `rgba(200, 220, 225, ${this.opacity})`;
        ctx.lineWidth = this.width;
        ctx.stroke();
      }
    }

    // Floating particles (mist / spray)
    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;

      constructor() {
        this.x = Math.random() * (canvas?.width ?? 1920);
        this.y = Math.random() * (canvas?.height ?? 1080);
        this.size = 1 + Math.random() * 3;
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.speedY = -0.1 - Math.random() * 0.3;
        this.opacity = 0.01 + Math.random() * 0.03;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.y < -10) {
          this.y = (canvas?.height ?? 1080) + 10;
          this.x = Math.random() * (canvas?.width ?? 1920);
        }
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200, 220, 235, ${this.opacity})`;
        ctx.fill();
      }
    }

    // Ripple effect at bottom
    class Ripple {
      x: number;
      y: number;
      radius: number;
      maxRadius: number;
      opacity: number;
      alive: boolean;

      constructor(x: number, y: number) {
        this.x = x;
        this.y = y - 20;
        this.radius = 2;
        this.maxRadius = 30 + Math.random() * 40;
        this.opacity = 0.08;
        this.alive = true;
      }

      update() {
        this.radius += 0.5 * speed;
        this.opacity -= 0.002;
        if (this.opacity <= 0 || this.radius > this.maxRadius) {
          this.alive = false;
        }
      }

      draw(ctx: CanvasRenderingContext2D) {
        if (!this.alive) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(180, 210, 220, ${this.opacity})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
        // Inner ripple
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius * 0.6, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(191, 161, 74, ${this.opacity * 0.3})`;
        ctx.lineWidth = 0.3;
        ctx.stroke();
      }
    }

    // Waterfall streams (wider vertical bands)
    class Stream {
      x: number;
      width: number;
      opacity: number;
      speed: number;
      segments: number[];

      constructor() {
        this.x = Math.random() * (canvas?.width ?? 1920);
        this.width = 5 + Math.random() * 20;
        this.opacity = 0.01 + Math.random() * 0.03;
        this.speed = 0.5 + Math.random() * 1.5;
        this.segments = [];
        const segCount = 5 + Math.floor(Math.random() * 8);
        for (let i = 0; i < segCount; i++) {
          this.segments.push(Math.random() * (canvas?.height ?? 1080));
        }
      }

      update() {
        for (let i = 0; i < this.segments.length; i++) {
          this.segments[i] += this.speed * speed;
          if (this.segments[i] > (canvas?.height ?? 1080) + 20) {
            this.segments[i] = -20;
          }
        }
      }

      draw(ctx: CanvasRenderingContext2D) {
        for (const seg of this.segments) {
          ctx.beginPath();
          ctx.rect(this.x, seg, this.width, 10 + Math.random() * 15);
          ctx.fillStyle = `rgba(200, 225, 230, ${this.opacity})`;
          ctx.fill();
        }
      }
    }

    // Initialize
    const numDrops = Math.floor(((canvas?.width ?? 1920) * (canvas?.height ?? 1080)) / 15000);
    const numParticles = Math.floor(((canvas?.width ?? 1920) * (canvas?.height ?? 1080)) / 8000);
    const numStreams = Math.floor((canvas?.width ?? 1920) / 80);

    for (let i = 0; i < numDrops; i++) drops.push(new Drop());
    for (let i = 0; i < numParticles; i++) particles.push(new Particle());
    for (let i = 0; i < numStreams; i++) drops.push(new Drop());

    function animate() {
      if (!canvas || !ctx) return;
      time++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw subtle gradient overlay first
      const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
      grad.addColorStop(0, color1.replace("0.4", "0.02"));
      grad.addColorStop(0.4, "rgba(27, 77, 77, 0.01)");
      grad.addColorStop(0.8, `rgba(27, 77, 77, 0.02)`);
      grad.addColorStop(1, "rgba(191, 161, 74, 0.01)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw drops
      for (const drop of drops) {
        drop.update();
        drop.draw(ctx);
      }

      // Draw particles
      for (const particle of particles) {
        particle.update();
        particle.draw(ctx);
      }

      // Draw ripples
      for (let i = ripples.length - 1; i >= 0; i--) {
        ripples[i].update();
        ripples[i].draw(ctx);
        if (!ripples[i].alive) ripples.splice(i, 1);
      }

      if (ripples.length > 80) ripples.splice(0, 20);

      animId = requestAnimationFrame(animate);
    }

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, [opacity, color1, color2, speed]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-[1]"
      style={{ opacity }}
    />
  );
}
