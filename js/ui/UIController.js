import { state } from '../config.js';

export class UIController {
    constructor(canvasEngine, recorder) {
        this.engine = canvasEngine;
        this.recorder = recorder;
        this.uiLayer = document.querySelector('.ui-layer');
        this.init();
    }

    init() {
        this.bindVegaToggle();
        this.bindDelegatedSelectors();
        this.bindSliders();
        this.bindActions();
        this.bindAutoHide();
    }

    bindVegaToggle() {
        const vegaBtn = document.getElementById('btnVegaToggle');
        const panel = document.getElementById('controlsPanel');

        if (vegaBtn && panel) {
            vegaBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const isHidden = panel.classList.toggle('hidden');
                vegaBtn.classList.toggle('active', !isHidden);
            });
        }
    }

    bindAutoHide() {
        window.addEventListener('pointerdown', (e) => {
            if (e.target.closest('#controlsPanel') || e.target.closest('#btnVegaToggle')) return;
            this.uiLayer.classList.add('drawing-active');
        });

        const revealUI = () => this.uiLayer.classList.remove('drawing-active');
        window.addEventListener('pointerup', revealUI);
        window.addEventListener('pointercancel', revealUI);
    }

    bindDelegatedSelectors() {
        const setupGroup = (groupId, stateKey) => {
            const container = document.getElementById(groupId);
            if (!container) return;

            container.addEventListener('click', (e) => {
                const btn = e.target.closest('.btn');
                if (!btn) return;

                container.querySelectorAll('.btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                state[stateKey] = btn.dataset.value;
            });
        };

        setupGroup('motionSelector', 'motionMode');
        setupGroup('shapeSelector', 'shape');
        setupGroup('colorSelector', 'color');
    }

    bindSliders() {
        const bindInput = (id, targetKey, valId) => {
            const input = document.getElementById(id);
            const valDisplay = document.getElementById(valId);
            if (!input) return;

            input.addEventListener('input', (e) => {
                const val = parseFloat(e.target.value);
                state[targetKey] = val;
                if (valDisplay) valDisplay.textContent = val;
            });
        };

        bindInput('sliderDecay', 'decayRate', 'valDecay');
        bindInput('sliderDensity', 'density', 'valDensity');
        bindInput('sliderSize', 'baseSize', 'valSize');
    }

    bindActions() {
        const btnChaos = document.getElementById('btnChaos');
        if (btnChaos) {
            btnChaos.addEventListener('click', () => {
                state.isChaos = !state.isChaos;
                btnChaos.classList.toggle('active', state.isChaos);
            });
        }

        const btnClear = document.getElementById('btnClear');
        if (btnClear) {
            btnClear.addEventListener('click', () => this.engine.clear());
        }

        const imgUpload = document.getElementById('imgUpload');
        if (imgUpload) {
            imgUpload.addEventListener('change', (e) => {
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
        }

        const btnRecord = document.getElementById('btnRecord');
        if (btnRecord) {
            btnRecord.addEventListener('click', () => {
                this.recorder.toggleRecording((isRecording) => {
                    btnRecord.classList.toggle('recording', isRecording);
                    btnRecord.textContent = isRecording ? '⏹️ Kayıt 🔴' : '🎥 Kaydet';
                });
            });
        }
    }
}