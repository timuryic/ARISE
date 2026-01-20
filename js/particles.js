/**
 * ARISE - Particle System
 */

const ParticleSystem = {
    container: null,

    init() {
        if (!this.container) {
            this.container = document.createElement('div');
            this.container.id = 'particle-container';
            this.container.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                pointer-events: none;
                z-index: 9999;
            `;
            document.body.appendChild(this.container);
        }
    },

    spawnText(x, y, text, color = '#00d9ff') {
        this.init();

        const el = document.createElement('div');
        el.textContent = text;
        el.style.cssText = `
            position: absolute;
            left: ${x}px;
            top: ${y}px;
            color: ${color};
            font-family: 'Orbitron', sans-serif;
            font-weight: bold;
            font-size: 1.2rem;
            text-shadow: 0 0 10px ${color};
            pointer-events: none;
            user-select: none;
            transform: translate(-50%, -50%);
            animation: floatUp 1s ease-out forwards;
        `;

        this.container.appendChild(el);

        setTimeout(() => {
            el.remove();
        }, 1000);
    },

    spawnSparkles(x, y, color = '#00d9ff') {
        this.init();

        for (let i = 0; i < 8; i++) {
            const p = document.createElement('div');
            const angle = Math.random() * Math.PI * 2;
            const velocity = 20 + Math.random() * 30;
            const tx = Math.cos(angle) * velocity;
            const ty = Math.sin(angle) * velocity;

            p.style.cssText = `
                position: absolute;
                left: ${x}px;
                top: ${y}px;
                width: 4px;
                height: 4px;
                background: ${color};
                border-radius: 50%;
                box-shadow: 0 0 6px ${color};
                transition: all 0.5s ease-out;
            `;

            this.container.appendChild(p);

            requestAnimationFrame(() => {
                p.style.transform = `translate(${tx}px, ${ty}px) scale(0)`;
                p.style.opacity = '0';
            });

            setTimeout(() => p.remove(), 500);
        }
    }
};

const style = document.createElement('style');
style.innerHTML = `
  @keyframes floatUp {
    0% { transform: translate(-50%, -50%) translateY(0) scale(1); opacity: 1; }
    100% { transform: translate(-50%, -50%) translateY(-50px) scale(1.2); opacity: 0; }
  }
`;
document.head.appendChild(style);
