import { state, COLOR_PALETTES } from '../config.js';

const CHAOS_SHAPES = ['star', 'heart', 'dot', 'diamond'];
const CHAOS_COLORS = ['#ffffff', '#facc15', '#f87171', '#c084fc', '#38bdf8', '#4ade80', '#ff007f', '#00ffcc'];

export class Particle {
    constructor(x, y, centerPoint) {
        this.x = x;
        this.y = y;
        this.isChaos = state.isChaos;

        if (this.isChaos) {
            this.shape = CHAOS_SHAPES[Math.floor(Math.random() * CHAOS_SHAPES.length)];
            this.color = CHAOS_COLORS[Math.floor(Math.random() * CHAOS_COLORS.length)];
            
            this.angle = Math.random() * Math.PI * 2;
            this.radius = Math.hypot(x - centerPoint.x, y - centerPoint.y);
            this.speed = (Math.random() - 0.5) * 0.012;
            this.vx = (Math.random() - 0.5) * 3;
            this.vy = (Math.random() - 0.5) * 3;
            this.size = Math.random() * 14 + 4;
            this.decay = state.decayRate * (0.6 + Math.random() * 0.8);

        } else if (state.motionMode === 'zen') {
            this.shape = state.shape;
            this.motionMode = 'zen';

            this.radius = Math.max(10, Math.hypot(x - centerPoint.x, y - centerPoint.y));
            this.angle = Math.atan2(y - centerPoint.y, x - centerPoint.x);
            
            this.keplerSpeed = 0.035 / Math.sqrt(this.radius);
            this.decay = 0.0006;
            this.size = state.baseSize * (0.7 + Math.random() * 0.5);

            const palette = COLOR_PALETTES[state.color] || COLOR_PALETTES.zenGold || COLOR_PALETTES.rainbow;
            this.color = palette[Math.floor(Math.random() * palette.length)];

        } else {
            this.shape = state.shape;
            this.motionMode = state.motionMode;

            if (this.motionMode === 'circle') {
                const rawRadius = Math.hypot(x - centerPoint.x, y - centerPoint.y);
                const ringStep = 16; 
                this.radius = Math.round(rawRadius / ringStep) * ringStep;
                this.angle = Math.atan2(y - centerPoint.y, x - centerPoint.x);
                const ringIndex = Math.round(this.radius / ringStep);
                const direction = ringIndex % 2 === 0 ? 1 : -1;
                this.speed = (0.002 + Math.random() * 0.0015) * direction;
            } else {
                const randomAngle = Math.random() * Math.PI * 2;
                const speed = 0.8 + Math.random() * 1.5;
                this.vx = Math.cos(randomAngle) * speed;
                this.vy = Math.sin(randomAngle) * speed;
            }

            this.size = state.baseSize * (0.6 + Math.random() * 0.8);
            const palette = COLOR_PALETTES[state.color] || COLOR_PALETTES.rainbow;
            this.color = palette[Math.floor(Math.random() * palette.length)];
            this.decay = state.decayRate;
        }

        this.life = 1.0;
    }

    update(centerPoint, dtFactor = 1) {
        if (this.isChaos) {
            this.angle += this.speed * dtFactor;
            this.x += (Math.cos(this.angle) * 1.5 + this.vx + (Math.random() - 0.5) * 2) * dtFactor;
            this.y += (Math.sin(this.angle) * 1.5 + this.vy + (Math.random() - 0.5) * 2) * dtFactor;
            this.size *= Math.pow(0.992, dtFactor);

        } else if (this.motionMode === 'zen') {
            this.angle += this.keplerSpeed * dtFactor;
            
            const time = Date.now() * 0.001;
            const breathOffset = Math.sin(time + this.radius * 0.03) * 7;
            const currentRadius = Math.max(0, this.radius + breathOffset);

            this.x = centerPoint.x + Math.cos(this.angle) * currentRadius;
            this.y = centerPoint.y + Math.sin(this.angle) * currentRadius;

        } else if (this.motionMode === 'circle') {
            this.angle += this.speed * dtFactor;
            this.x = centerPoint.x + Math.cos(this.angle) * this.radius;
            this.y = centerPoint.y + Math.sin(this.angle) * this.radius;

        } else { // Serbest Akış ('free')
            this.x += this.vx * dtFactor;
            this.y += this.vy * dtFactor;
            this.vx *= Math.pow(0.985, dtFactor);
            this.vy *= Math.pow(0.985, dtFactor);
        }

        this.life -= this.decay * dtFactor;
    }

    draw(ctx) {
        if (this.life <= 0) return;

        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.fillStyle = this.color;
        ctx.strokeStyle = this.color;
        ctx.globalAlpha = Math.max(0, this.life);

        const s = this.size;

        switch (this.shape) {
            case 'star':
                ctx.beginPath();
                ctx.moveTo(0, -s);
                ctx.quadraticCurveTo(0, 0, s, 0);
                ctx.quadraticCurveTo(0, 0, 0, s);
                ctx.quadraticCurveTo(0, 0, -s, 0);
                ctx.quadraticCurveTo(0, 0, 0, -s);
                ctx.fill();
                break;

            case 'heart':
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.bezierCurveTo(-s / 2, -s / 2, -s, s / 3, 0, s);
                ctx.bezierCurveTo(s, s / 3, s / 2, -s / 2, 0, 0);
                ctx.fill();
                break;

            case 'diamond':
                ctx.beginPath();
                ctx.moveTo(0, -s);
                ctx.lineTo(s * 0.7, 0);
                ctx.lineTo(0, s);
                ctx.lineTo(-s * 0.7, 0);
                ctx.closePath();
                ctx.fill();
                break;

            case 'dot':
            default:
                ctx.beginPath();
                ctx.arc(0, 0, s / 2.5, 0, Math.PI * 2);
                ctx.fill();
                break;
        }

        ctx.restore();
    }
}