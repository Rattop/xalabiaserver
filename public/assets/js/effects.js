/**
 * XalabiaServer — effects.js
 * Particle / network background effect on canvas.
 * Lightweight — respects prefers-reduced-motion.
 */

'use strict';

(function initBackground() {

    // Respect reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    // Config
    const CONFIG = {
        particleCount:   55,
        particleColor:   '0, 207, 255',    // cyan RGB
        lineColor:       '0, 207, 255',
        lineDistance:    140,
        particleRadius:  1.5,
        speedMin:        0.08,
        speedMax:        0.25,
        opacity:         0.35,
        lineOpacityMax:  0.08,
    };

    let W, H, particles = [], animId;

    // Resize handler
    function resize() {
        W = canvas.width  = window.innerWidth;
        H = canvas.height = window.innerHeight;
    }

    // Particle factory
    function createParticle() {
        const speed = CONFIG.speedMin + Math.random() * (CONFIG.speedMax - CONFIG.speedMin);
        const angle = Math.random() * Math.PI * 2;
        return {
            x:  Math.random() * W,
            y:  Math.random() * H,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            r:  CONFIG.particleRadius * (0.5 + Math.random()),
        };
    }

    function init() {
        resize();
        particles = Array.from({ length: CONFIG.particleCount }, createParticle);
    }

    function update() {
        particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;

            // Wrap around edges
            if (p.x < -10)  p.x = W + 10;
            if (p.x > W + 10) p.x = -10;
            if (p.y < -10)  p.y = H + 10;
            if (p.y > H + 10) p.y = -10;
        });
    }

    function draw() {
        ctx.clearRect(0, 0, W, H);

        // Draw connections
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const a = particles[i];
                const b = particles[j];
                const dx = a.x - b.x;
                const dy = a.y - b.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < CONFIG.lineDistance) {
                    const alpha = (1 - dist / CONFIG.lineDistance) * CONFIG.lineOpacityMax;
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(${CONFIG.lineColor}, ${alpha})`;
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(a.x, a.y);
                    ctx.lineTo(b.x, b.y);
                    ctx.stroke();
                }
            }
        }

        // Draw particles
        particles.forEach(p => {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${CONFIG.particleColor}, ${CONFIG.opacity})`;
            ctx.fill();
        });
    }

    function loop() {
        update();
        draw();
        animId = requestAnimationFrame(loop);
    }

    // Pause when tab is hidden (save CPU)
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            cancelAnimationFrame(animId);
        } else {
            loop();
        }
    });

    // Resize debounce
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            resize();
            // Reposition any out-of-bounds particles
            particles.forEach(p => {
                p.x = Math.min(p.x, W);
                p.y = Math.min(p.y, H);
            });
        }, 200);
    });

    init();
    loop();

    console.log('%c[XalabiaServer] effects.js carregado ✓', 'color:#2EF08A;');

})();
