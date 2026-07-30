/**
 * Uygulama Durumu ve Konfigürasyonu
 */
export const state = {
    shape: 'star',        // 'star', 'heart', 'dot', 'diamond'
    color: 'rainbow',     // 'rainbow', 'white', 'yellow', 'purple', 'red'
    motionMode: 'circle', // 'circle', 'free', 'zen'
    decayRate: 0.002,     
    density: 2,           
    baseSize: 8,          
    bgImage: null,        
    isRecording: false,
    isChaos: false        
};

export const COLOR_PALETTES = {
    rainbow: ['#ffffff', '#facc15', '#f87171', '#c084fc', '#38bdf8', '#4ade80'],
    white: ['#ffffff'],
    yellow: ['#facc15', '#fef08a'],
    purple: ['#c084fc', '#e879f9'],
    red: ['#f87171', '#fb7185'],
    zenGold: ['#fef3c7', '#fde047', '#eab308', '#ca8a04', '#78350f']
};