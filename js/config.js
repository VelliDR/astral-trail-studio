/**
 * Global Uygulama Konfigürasyonu ve Anlık Durumu (State)
 */
export const state = {
    shape: 'star',        // 'star', 'heart', 'dot', 'diamond'
    color: 'rainbow',     // 'rainbow', 'white', 'yellow', 'purple', 'red'
    motionMode: 'circle', // 'circle' (Matris Çember), 'free' (Serbest Akış)
    decayRate: 0.003,     // Kuyruğun silinme/kaybolma hızı
    density: 2,           // Tıklama başına parçacık sayısı
    baseSize: 8,          // Şekil boyutu
    bgImage: null,        // Arka plan görseli
    isRecording: false,
    isChaos: false      // YENİ: Kaos Modu Açık/Kapalı
};

export const COLOR_PALETTES = {
    white: ['#ffffff'],
    yellow: ['#facc15', '#fef08a'],
    purple: ['#c084fc', '#e879f9'],
    red: ['#f87171', '#fb7185'],
    rainbow: ['#ffffff', '#facc15', '#f87171', '#c084fc', '#38bdf8', '#4ade80'],
    zenGold: ['#fef3c7', '#fde047', '#eab308', '#ca8a04', '#78350f'],
    zenLavender: ['#f472b6', '#c084fc', '#818cf8', '#38bdf8', '#e0e7ff']
};