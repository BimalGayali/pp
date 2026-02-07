// Smooth scroll to section
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    section.scrollIntoView({ behavior: 'smooth' });
}

// Create floating hearts
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

        // Remove heart after animation completes
        setTimeout(() => {
            heart.remove();
        }, 8000);
    }, 300);
}

// Animate elements on scroll
function animateOnScroll() {
    const elements = document.querySelectorAll('.reason-card, .envelope, .song-card');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
            }
        });
    }, { threshold: 0.1 });

    elements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'all 0.6s ease';
        observer.observe(element);
    });
}

// Add parallax effect to sections
function addParallaxEffect() {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.section');

        parallaxElements.forEach((element, index) => {
            const speed = 0.5;
            const yPos = -(scrolled * speed);
            element.style.backgroundPosition = `center ${yPos}px`;
        });
    });
}

// Initialize all animations
document.addEventListener('DOMContentLoaded', () => {
    createFloatingHearts();
    animateOnScroll();
    addParallaxEffect();

    // Add click effect to hearts
    document.addEventListener('click', (e) => {
        const heart = document.createElement('div');
        heart.textContent = '❤️';
        heart.style.position = 'fixed';
        heart.style.left = e.clientX + 'px';
        heart.style.top = e.clientY + 'px';
        heart.style.fontSize = '30px';
        heart.style.pointerEvents = 'none';
        heart.style.zIndex = '9999';
        heart.style.animation = 'float-up 2s ease-out forwards';

        document.body.appendChild(heart);

        setTimeout(() => {
            heart.remove();
        }, 2000);
    });
});

// Add keyboard navigation
document.addEventListener('keydown', (e) => {
    const sections = ['landing', 'love-letter', 'reasons', 'messages', 'songs', 'question', 'final'];
    const currentSection = Math.floor(window.scrollY / window.innerHeight);

    if (e.key === 'ArrowDown' && currentSection < sections.length - 1) {
        scrollToSection(sections[currentSection + 1]);
    } else if (e.key === 'ArrowUp' && currentSection > 0) {
        scrollToSection(sections[currentSection - 1]);
    }
});

// Flip reason cards on click
function revealReason(card) {
    card.classList.toggle('flipped');
}

// Handle Yes button click
function showYesResponse() {
    const response = document.getElementById('yes-response');
    const buttons = document.querySelector('.answer-buttons');
    const questionText = document.querySelector('.the-question');

    response.classList.remove('hidden');
    buttons.style.display = 'none';
    questionText.style.display = 'none';

    // Create fireworks effect
    createFireworks();
}

// Handle No button - make it run away
function handleNoClick(button) {
    const maxX = window.innerWidth - button.offsetWidth - 100;
    const maxY = window.innerHeight - button.offsetHeight - 100;

    const randomX = Math.floor(Math.random() * maxX);
    const randomY = Math.floor(Math.random() * maxY);

    button.style.position = 'fixed';
    button.style.left = randomX + 'px';
    button.style.top = randomY + 'px';
    button.textContent = 'Try again! 😊';
}

// Create fireworks effect
function createFireworks() {
    const symbols = ['🎉', '🎊', '💖', '✨', '💕', '🌟'];

    for (let i = 0; i < 30; i++) {
        setTimeout(() => {
            const firework = document.createElement('div');
            firework.textContent = symbols[Math.floor(Math.random() * symbols.length)];
            firework.style.position = 'fixed';
            firework.style.left = Math.random() * 100 + '%';
            firework.style.top = Math.random() * 100 + '%';
            firework.style.fontSize = '30px';
            firework.style.pointerEvents = 'none';
            firework.style.zIndex = '9999';
            firework.style.animation = 'float-up 3s ease-out forwards';

            document.body.appendChild(firework);

            setTimeout(() => {
                firework.remove();
            }, 3000);
        }, i * 100);
    }
}
