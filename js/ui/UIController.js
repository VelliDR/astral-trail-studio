import { state } from '../config.js';

export class UIController {
    constructor(canvasEngine, recorder) {
        this.engine = canvasEngine;
        this.recorder = recorder;
        this.init();
    }

    init() {
        this.bindPanelToggle();
        this.bindSelectors();
        this.bindSliders();
        this.bindActions();
    }

    bindPanelToggle() {
        const panel = document.getElementById('controlsPanel');
        const header = document.getElementById('panelToggle');
        
        header.addEventListener('click', () => {
            panel.classList.toggle('collapsed');
        });
    }

    bindSelectors() {
        // Hareket Modu Seçimi
        document.getElementById('motionSelector').addEventListener('click', (e) => {
            const btn = e.target.closest('.btn');
            if (!btn) return;

            document.querySelectorAll('#motionSelector .btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            state.motionMode = btn.dataset.value;
        });

        // Şekil Seçimi
        document.getElementById('shapeSelector').addEventListener('click', (e) => {
            const btn = e.target.closest('.btn');
            if (!btn) return;
            
            document.querySelectorAll('#shapeSelector .btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            state.shape = btn.dataset.value;
        });

        // Renk Seçimi
        document.getElementById('colorSelector').addEventListener('click', (e) => {
            const btn = e.target.closest('.btn');
            if (!btn) return;

            document.querySelectorAll('#colorSelector .btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            state.color = btn.dataset.value;
        });
    }

    bindSliders() {
        const sliderDecay = document.getElementById('sliderDecay');
        const valDecay = document.getElementById('valDecay');
        sliderDecay.addEventListener('input', (e) => {
            state.decayRate = parseFloat(e.target.value);
            valDecay.textContent = state.decayRate;
        });

        const sliderDensity = document.getElementById('sliderDensity');
        const valDensity = document.getElementById('valDensity');
        sliderDensity.addEventListener('input', (e) => {
            state.density = parseInt(e.target.value, 10);
            valDensity.textContent = state.density;
        });

        const sliderSize = document.getElementById('sliderSize');
        const valSize = document.getElementById('valSize');
        sliderSize.addEventListener('input', (e) => {
            state.baseSize = parseInt(e.target.value, 10);
            valSize.textContent = state.baseSize;
        });
    }

    bindActions() {
        // KAOS MODU TOGGLE
        const btnChaos = document.getElementById('btnChaos');
        if (btnChaos) {
            btnChaos.addEventListener('click', () => {
                state.isChaos = !state.isChaos;
                btnChaos.classList.toggle('active', state.isChaos);
            });
        }

        // Temizle
        document.getElementById('btnClear').addEventListener('click', () => {
            this.engine.clear();
        });

        // Görsel Yükle
        document.getElementById('imgUpload').addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (evt) => {
                const img = new Image();
                img.onload = () => {
                    state.bgImage = img;
                    this.engine.redrawBackground();
                };
                img.src = evt.target.result;
            };
            reader.readAsDataURL(file);
        });

        // WebM Kaydet
        const btnRecord = document.getElementById('btnRecord');
        const recStatus = document.getElementById('recStatus');

        btnRecord.addEventListener('click', () => {
            this.recorder.toggleRecording((isRecording) => {
                if (isRecording) {
                    btnRecord.classList.add('recording');
                    btnRecord.textContent = '⏹️ Kaydı Bitir & İndir';
                    recStatus.textContent = 'REC 🔴';
                } else {
                    btnRecord.classList.remove('recording');
                    btnRecord.textContent = '🎥 .WebM Kaydet';
                    recStatus.textContent = 'IDLE';
                }
            });
        });
    }
}