import { state } from '../config.js';
import { Particle } from './Particle.js';

export class CanvasEngine {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.isDrawing = false;
        
        // Parmağın/Farenin son konumunu hafızada tutuyoruz (Sabit basılı tutma için)
        this.lastPointerX = 0;
        this.lastPointerY = 0;

        // Delta Time (120Hz/60Hz ekran bağımsızlığı) için zaman takibi
        this.lastTime = performance.now();
        this.dpr = window.devicePixelRatio || 1;

        this.init();
    }

    init() {
        this.resize();
        window.addEventListener('resize', () => this.resize());
        this.bindInputEvents();
        this.loop();
    }

    resize() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;

        this.canvas.width = this.width * this.dpr;
        this.canvas.height = this.height * this.dpr;

        this.canvas.style.width = `${this.width}px`;
        this.canvas.style.height = `${this.height}px`;

        this.ctx.scale(this.dpr, this.dpr);
        this.redrawBackground();
    }

    getCenter() {
        return { x: this.width / 2, y: this.height / 2 };
    }

    redrawBackground() {
        this.ctx.fillStyle = '#09090b';
        this.ctx.fillRect(0, 0, this.width, this.height);

        if (state.bgImage) {
            const scale = Math.max(this.width / state.bgImage.width, this.height / state.bgImage.height);
            const x = (this.width / 2) - (state.bgImage.width / 2) * scale;
            const y = (this.height / 2) - (state.bgImage.height / 2) * scale;
            
            this.ctx.globalAlpha = 0.35;
            this.ctx.drawImage(state.bgImage, x, y, state.bgImage.width * scale, state.bgImage.height * scale);
            this.ctx.globalAlpha = 1.0;
        }
    }

    spawnParticles(x, y) {
        const center = this.getCenter();
        for (let i = 0; i < state.density; i++) {
            const offsetX = (Math.random() - 0.5) * 10;
            const offsetY = (Math.random() - 0.5) * 10;
            this.particles.push(new Particle(x + offsetX, y + offsetY, center));
        }
    }

   bindInputEvents() {
        window.addEventListener('pointerdown', (e) => {
            // Panele veya Vega butonuna tıklandığında çizimi engelle
            if (e.target.closest('.controls-panel') || e.target.closest('.vega-star-btn')) return;
            
            this.isDrawing = true;
            this.lastPointerX = e.clientX;
            this.lastPointerY = e.clientY;
        });

        window.addEventListener('pointermove', (e) => {
            if (this.isDrawing) {
                this.lastPointerX = e.clientX;
                this.lastPointerY = e.clientY;
            }
        });

        window.addEventListener('pointerup', () => this.isDrawing = false);
        window.addEventListener('pointercancel', () => this.isDrawing = false);
    }

    clear() {
        this.particles = [];
        this.redrawBackground();
    }

    loop(currentTime = performance.now()) {
        // Delta Time hesabı (60 FPS standart baz alınarak dtFactor üretilir)
        const dt = (currentTime - this.lastTime) / 1000;
        this.lastTime = currentTime;
        const dtFactor = Math.min(dt * 60, 2.0); // Anlık kasmalar/sekme durumları için sınır

        // Ekrana basılı tutuluyorsa hareket olmasa bile her karede yıldız fışkırt
        if (this.isDrawing) {
            this.spawnParticles(this.lastPointerX, this.lastPointerY);
        }

        // Motion Blur karartması
        this.ctx.globalAlpha = 0.05;
        this.ctx.fillStyle = '#09090b';
        this.ctx.fillRect(0, 0, this.width, this.height);

        if (state.bgImage) {
            this.ctx.globalAlpha = 0.015;
            const scale = Math.max(this.width / state.bgImage.width, this.height / state.bgImage.height);
            const x = (this.width / 2) - (state.bgImage.width / 2) * scale;
            const y = (this.height / 2) - (state.bgImage.height / 2) * scale;
            this.ctx.drawImage(state.bgImage, x, y, state.bgImage.width * scale, state.bgImage.height * scale);
        }

        this.ctx.globalAlpha = 1.0;
        const center = this.getCenter();

        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.update(center, dtFactor);
            p.draw(this.ctx);

            if (p.life <= 0) {
                this.particles.splice(i, 1);
            }
        }

        requestAnimationFrame((time) => this.loop(time));
    }
}