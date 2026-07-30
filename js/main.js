import { CanvasEngine } from './engine/CanvasEngine.js';
import { Recorder } from './engine/Recorder.js';
import { UIController } from './ui/UIController.js';

document.addEventListener('DOMContentLoaded', () => {
    const engine = new CanvasEngine('starCanvas');
    const recorder = new Recorder(engine.canvas);
    new UIController(engine, recorder);

    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('./sw.js').catch(() => {});
        });
    }
});