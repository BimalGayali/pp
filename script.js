// ========== SOUND SYSTEM ==========
let audioCtx = null;

function getAudioContext() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    return audioCtx;
}

// Play a pleasant chime/bell tone
function playChime(frequency, duration, type) {
    try {
        const ctx = getAudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = type || 'sine';
        osc.frequency.setValueAtTime(frequency, ctx.currentTime);

        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + (duration || 0.5));

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + (duration || 0.5));
    } catch (e) {
        // Silently fail if audio not supported
    }
}

// Magical sparkle sound (envelope open)
function playEnvelopeSound() {
    const notes = [523, 659, 784, 1047]; // C5, E5, G5, C6
    notes.forEach((freq, i) => {
        setTimeout(() => playChime(freq, 0.4, 'sine'), i * 100);
    });
}

// Page transition whoosh sound
function playPageSound() {
    try {
        const ctx = getAudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(300, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.15);
        osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.3);

        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.3);
    } catch (e) {}
}

// Celebration fanfare sound (Yes button)
function playCelebrationSound() {
    const melody = [
        { freq: 523, delay: 0 },    // C5
        { freq: 659, delay: 100 },   // E5
        { freq: 784, delay: 200 },   // G5
        { freq: 1047, delay: 300 },  // C6
        { freq: 784, delay: 450 },   // G5
        { freq: 1047, delay: 550 },  // C6
        { freq: 1318, delay: 700 },  // E6
    ];
    melody.forEach(note => {
        setTimeout(() => playChime(note.freq, 0.6, 'sine'), note.delay);
    });
}

// Card flip sound
function playFlipSound() {
    playChime(880, 0.15, 'sine');
    setTimeout(() => playChime(1100, 0.15, 'sine'), 80);
}

// "I Love You" voice using SpeechSynthesis
function sayILoveYou() {
    try {
        if ('speechSynthesis' in window) {
            const phrases = [
                'I love you',
                'I love you janu',
                'I love you so much',
            ];
            const msg = new SpeechSynthesisUtterance(
                phrases[Math.floor(Math.random() * phrases.length)]
            );
            msg.rate = 0.85;
            msg.pitch = 1.1;
            msg.volume = 0.8;

            // Try to use a female voice
            const voices = speechSynthesis.getVoices();
            const femaleVoice = voices.find(v =>
                v.name.includes('Female') || v.name.includes('Zira') ||
                v.name.includes('Samantha') || v.name.includes('Google')
            );
            if (femaleVoice) msg.voice = femaleVoice;

            speechSynthesis.speak(msg);
        }
    } catch (e) {}
}

// No button dodge sound
function playDodgeSound() {
    playChime(500, 0.1, 'square');
    setTimeout(() => playChime(400, 0.1, 'square'), 100);
}


// ========== PAGE NAVIGATION ==========
let currentPage = 1;

function goToPage(pageNumber) {
    if (pageNumber === currentPage) return;

    const currentPageElement = document.getElementById(`page-${currentPage}`);
    const newPageElement = document.getElementById(`page-${pageNumber}`);

    if (!currentPageElement || !newPageElement) return;

    // Play page transition sound
    playPageSound();

    // Remove all state classes from all pages first
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active', 'prev');
    });

    // Set current page as prev (zooming out)
    currentPageElement.classList.add('prev');

    // Set new page as active (zooming in)
    newPageElement.classList.add('active');

    // Update progress dots
    updateProgressDots(pageNumber);

    // Update current page number
    currentPage = pageNumber;
}

function updateProgressDots(pageNumber) {
    const dots = document.querySelectorAll('.progress-dot');
    dots.forEach((dot, index) => {
        if (index + 1 === pageNumber) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
}


// ========== FLOATING HEARTS ==========
function createFloatingHearts() {
    const heartsContainer = document.querySelector('.hearts-container');
    const heartSymbols = ['❤️', '💕', '💖', '💗', '💝', '💓'];

    setInterval(() => {
        const heart = document.createElement('div');
        heart.classList.add('heart');
        heart.textContent = heartSymbols[Math.floor(Math.random() * heartSymbols.length)];
        heart.style.left = Math.random() * 100 + '%';
        heart.style.animationDuration = (Math.random() * 3 + 5) + 's';
        heart.style.fontSize = (Math.random() * 20 + 15) + 'px';

        heartsContainer.appendChild(heart);

        setTimeout(() => heart.remove(), 10000);
    }, 300);
}


// ========== FLIP CARDS ==========
function revealReason(card) {
    card.classList.toggle('flipped');
    playFlipSound();
}


// ========== ENVELOPES ==========
function openEnvelope(element) {
    const wasOpened = element.classList.contains('opened');
    element.classList.toggle('opened');

    if (!wasOpened) {
        // Play sounds
        playEnvelopeSound();
        setTimeout(() => sayILoveYou(), 800);

        // Create animations
        createEnvelopePopups(element);
    }
}

function createEnvelopePopups(envelope) {
    const rect = envelope.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Love emoji popups
    const loveEmojis = ['💕', '💖', '💗', '💝', '💓', '💞', '💘', '❤️', '💜', '🩷'];

    for (let i = 0; i < 8; i++) {
        setTimeout(() => {
            const popup = document.createElement('div');
            popup.classList.add('love-popup');

            const styles = ['', 'bounce', 'sparkle'];
            const randomStyle = styles[Math.floor(Math.random() * styles.length)];
            if (randomStyle) popup.classList.add(randomStyle);

            popup.textContent = loveEmojis[Math.floor(Math.random() * loveEmojis.length)];

            const angle = (i * 45) * (Math.PI / 180);
            const distance = 50;
            popup.style.left = (centerX + Math.cos(angle) * distance) + 'px';
            popup.style.top = (centerY + Math.sin(angle) * distance) + 'px';

            document.body.appendChild(popup);
            setTimeout(() => popup.remove(), 2000);
        }, i * 50);
    }

    // Cute message popup
    const messages = [
        '🥰 Aww so cute!',
        '💖 Love you janu!',
        '✨ You are special!',
        '🌸 So sweet bubu!',
        '💕 Beautiful!',
        '🌈 Made with love!'
    ];

    setTimeout(() => {
        const cutePopup = document.createElement('div');
        cutePopup.classList.add('cute-popup');
        cutePopup.innerHTML = messages[Math.floor(Math.random() * messages.length)];
        cutePopup.style.left = Math.max(10, centerX - 80) + 'px';
        cutePopup.style.top = Math.max(10, centerY - 100) + 'px';

        document.body.appendChild(cutePopup);
        setTimeout(() => cutePopup.remove(), 3000);
    }, 400);

    // Confetti
    createConfetti(centerX, centerY);

    // Heart burst
    createHeartBurst(centerX, centerY);
}

function createConfetti(x, y) {
    const colors = ['#ff69b4', '#ff1493', '#ff6eb4', '#ffc0cb', '#ffb6c1', '#f093fb'];

    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.classList.add('confetti-particle');
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.left = x + (Math.random() - 0.5) * 120 + 'px';
            confetti.style.top = y + 'px';
            confetti.style.width = (Math.random() * 8 + 5) + 'px';
            confetti.style.height = (Math.random() * 8 + 5) + 'px';
            confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
            confetti.style.animationDelay = (Math.random() * 0.3) + 's';

            document.body.appendChild(confetti);
            setTimeout(() => confetti.remove(), 3000);
        }, i * 25);
    }
}

function createHeartBurst(x, y) {
    const hearts = ['💕', '💖', '💗', '💝'];

    for (let i = 0; i < 12; i++) {
        setTimeout(() => {
            const heart = document.createElement('div');
            heart.classList.add('heart-burst');
            heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];

            const angle = (i * 30) * (Math.PI / 180);
            const distance = 40 + Math.random() * 30;
            heart.style.left = (x + Math.cos(angle) * distance) + 'px';
            heart.style.top = (y + Math.sin(angle) * distance) + 'px';
            heart.style.animationDelay = (i * 0.05) + 's';

            document.body.appendChild(heart);
            setTimeout(() => heart.remove(), 1500);
        }, i * 40);
    }
}


// ========== YES / NO QUESTION ==========
function showYesResponse() {
    const response = document.getElementById('yes-response');
    const buttons = document.querySelector('.answer-buttons');
    const questionText = document.querySelector('.the-question');

    response.classList.remove('hidden');
    buttons.style.display = 'none';
    questionText.style.display = 'none';

    // Play celebration sounds and say I love you
    playCelebrationSound();
    setTimeout(() => sayILoveYou(), 1000);

    // Create fireworks
    createFireworks();
}

function handleNoClick(button) {
    playDodgeSound();

    const questionBox = document.querySelector('.question-box');
    const boxRect = questionBox.getBoundingClientRect();

    const maxX = boxRect.width - button.offsetWidth - 40;
    const maxY = boxRect.height - button.offsetHeight - 40;

    const randomX = Math.floor(Math.random() * maxX) + 20;
    const randomY = Math.floor(Math.random() * maxY) + 20;

    button.style.position = 'absolute';
    button.style.left = randomX + 'px';
    button.style.top = randomY + 'px';
    button.textContent = 'No? 😊';

    if (!button.dataset.attempts) {
        button.dataset.attempts = 0;
    }
    button.dataset.attempts = parseInt(button.dataset.attempts) + 1;

    if (button.dataset.attempts >= 3) {
        button.textContent = 'Say Yes! 💕';
    }
}

function createFireworks() {
    const symbols = ['🎉', '🎊', '💖', '✨', '💕', '🌟', '💝', '🎆'];

    for (let i = 0; i < 40; i++) {
        setTimeout(() => {
            const firework = document.createElement('div');
            firework.textContent = symbols[Math.floor(Math.random() * symbols.length)];
            firework.style.position = 'fixed';
            firework.style.left = Math.random() * 100 + '%';
            firework.style.top = Math.random() * 100 + '%';
            firework.style.fontSize = (Math.random() * 20 + 20) + 'px';
            firework.style.pointerEvents = 'none';
            firework.style.zIndex = '9999';
            firework.style.animation = 'float-up 3s ease-out forwards';

            document.body.appendChild(firework);
            setTimeout(() => firework.remove(), 3000);
        }, i * 80);
    }
}


// ========== INITIALIZE ==========
document.addEventListener('DOMContentLoaded', () => {
    createFloatingHearts();
    updateProgressDots(1);

    // Preload voices for SpeechSynthesis
    if ('speechSynthesis' in window) {
        speechSynthesis.getVoices();
        speechSynthesis.onvoiceschanged = () => speechSynthesis.getVoices();
    }

    // Tap anywhere creates heart + initializes audio context
    document.addEventListener('click', (e) => {
        // Initialize audio on first click (mobile requirement)
        getAudioContext();

        if (e.target.tagName === 'BUTTON' ||
            e.target.closest('.reason-card') ||
            e.target.closest('.envelope') ||
            e.target.tagName === 'IFRAME') {
            return;
        }

        const heart = document.createElement('div');
        heart.textContent = '💖';
        heart.style.position = 'fixed';
        heart.style.left = e.clientX + 'px';
        heart.style.top = e.clientY + 'px';
        heart.style.fontSize = '25px';
        heart.style.pointerEvents = 'none';
        heart.style.zIndex = '9999';
        heart.style.animation = 'float-up 2s ease-out forwards';
        heart.style.transform = 'translate(-50%, -50%)';

        document.body.appendChild(heart);
        setTimeout(() => heart.remove(), 2000);
    });
});
