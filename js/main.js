import { CanvasEngine } from './engine/CanvasEngine.js';
import { Recorder } from './engine/Recorder.js';
import { UIController } from './ui/UIController.js';

document.addEventListener('DOMContentLoaded', () => {
    // 1. Kanvas Motoru
    const engine = new CanvasEngine('starCanvas');

    // 2. Medya Kaydedici
    const recorder = new Recorder(engine.canvas);

    // 3. UI Kontrolörü
    new UIController(engine, recorder);

    // 4. PWA Service Worker Kaydı (Çevrimdışı Çalışma Desteği)
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('./sw.js')
                .then(reg => console.log('SW Registered:', reg.scope))
                .catch(err => console.error('SW Register Error:', err));
        });
    }

    console.log('Astral Trail Studio initialized successfully.');
});