import { CanvasEngine } from './engine/CanvasEngine.js';
import { Recorder } from './engine/Recorder.js';
import { UIController } from './ui/UIController.js';

document.addEventListener('DOMContentLoaded', () => {
    // 1. Kanvas Motorunu Çalıştır
    const engine = new CanvasEngine('starCanvas');

    // 2. Medya Kaydediciyi Bağla
    const recorder = new Recorder(engine.canvas);

    // 3. UI Kontrolörünü Çalıştır
    new UIController(engine, recorder);

    console.log('Astral Trail Studio initialized successfully.');
});