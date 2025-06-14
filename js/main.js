// Theme-specific background effects
function createThemeBackground() {
    // Remove existing matrix canvas if it exists
    const existingCanvas = document.getElementById('matrix-canvas');
    if (existingCanvas) {
        existingCanvas.remove();
    }
    
    // Create background container
    const bgContainer = document.createElement('div');
    bgContainer.id = 'theme-background';
    bgContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: -1;
        pointer-events: none;
        opacity: 0;
        transition: opacity 0.5s ease;
    `;
    document.body.appendChild(bgContainer);
    
    updateThemeBackground();
}

function updateThemeBackground() {
    const bgContainer = document.getElementById('theme-background');
    if (!bgContainer) return;
    
    const theme = document.documentElement.getAttribute('data-theme') || 'cyberpunk';
    
    // Background configurations
    const backgrounds = {
        cyberpunk: {
            type: 'image',
            src: 'assets/images/cyberpunk-bg.jpg', // You'll upload this
            fallback: 'matrix'
        },
        minecraft: {
            type: 'image', 
            src: 'assets/images/minecraft-bg.jpg', // You'll upload this
            fallback: 'blocks'
        },
        gamedev: {
            type: 'image',
            src: 'assets/images/gamedev-bg.jpg', // You'll upload this  
            fallback: 'particles'
        }
    };
    
    const config = backgrounds[theme];
    
    if (config.type === 'image') {
        // Try to load background image
        const img = new Image();
        img.onload = () => {
            bgContainer.style.backgroundImage = `url(${config.src})`;
            bgContainer.style.backgroundSize = 'cover';
            bgContainer.style.backgroundPosition = 'center';
            bgContainer.style.backgroundRepeat = 'no-repeat';
            bgContainer.style.opacity = '0.3';
        };
        img.onerror = () => {
            // Fallback to procedural background
            createFallbackBackground(bgContainer, config.fallback);
        };
        img.src = config.src;
    }
}

function createFallbackBackground(container, type) {
    container.innerHTML = '';
    
    switch(type) {
        case 'matrix':
            createMatrixEffect(container);
            break;
        case 'blocks':
            createBlockEffect(container);
            break;
        case 'particles':
            createParticleEffect(container);
            break;
    }
    
    container.style.opacity = '0.2';
}

function createMatrixEffect(container) {
    // Original matrix rain effect
    const canvas = document.createElement('canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    container.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    const matrix = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*";
    const matrixArray = matrix.split("");
    const fontSize = 10;
    const columns = canvas.width / fontSize;
    const drops = [];
    
    for(let x = 0; x < columns; x++) {
        drops[x] = 1;
    }
    
    function draw() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.04)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#00ffff';
        ctx.font = fontSize + 'px monospace';
        
        for(let i = 0; i < drops.length; i++) {
            const text = matrixArray[Math.floor(Math.random() * matrixArray.length)];
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);
            
            if(drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    }
    
    setInterval(draw, 35);
}

function createBlockEffect(container) {
    // Animated minecraft-style blocks
    for(let i = 0; i < 20; i++) {
        const block = document.createElement('div');
        block.style.cssText = `
            position: absolute;
            width: 30px;
            height: 30px;
            background: #4CAF50;
            border: 2px solid #388E3C;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: float ${3 + Math.random() * 4}s ease-in-out infinite;
            animation-delay: ${Math.random() * 2}s;
        `;
        container.appendChild(block);
    }
}

function createParticleEffect(container) {
    // Floating geometric shapes for game dev theme
    const shapes = ['◆', '●', '▲', '■', '♦'];
    
    for(let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.textContent = shapes[Math.floor(Math.random() * shapes.length)];
        particle.style.cssText = `
            position: absolute;
            color: #9C27B0;
            font-size: ${10 + Math.random() * 20}px;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: float ${4 + Math.random() * 6}s ease-in-out infinite;
            animation-delay: ${Math.random() * 3}s;
            opacity: 0.6;
        `;
        container.appendChild(particle);
    }
}

// Navigation functionality
function initNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
            
            // Close mobile menu
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            
            // Update active link
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });
}

// Scroll animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                
                // Animate progress bars
                if (entry.target.classList.contains('about')) {
                    animateProgressBars();
                }
                
                // Animate skill cards
                if (entry.target.classList.contains('skills')) {
                    animateSkillCards();
                }
            }
        });
    }, observerOptions);

    // Observe all sections
    document.querySelectorAll('section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });
}

// Animate progress bars
function animateProgressBars() {
    const progressBars = document.querySelectorAll('.progress');
    progressBars.forEach(bar => {
        const width = bar.style.width;
        bar.style.width = '0%';
        setTimeout(() => {
            bar.style.width = width;
        }, 500);
    });
}

// Animate skill cards
function animateSkillCards() {
    const skillCards = document.querySelectorAll('.skill-category');
    skillCards.forEach((card, index) => {
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0) scale(1)';
        }, index * 200);
    });
}

// Contact form functionality
function initContactForm() {
    const form = document.getElementById('contactForm');
    
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const formData = new FormData(form);
            const name = formData.get('name');
            const email = formData.get('email');
            const message = formData.get('message');
            
            // Basic validation
            if (!name || !email || !message) {
                showNotification('Please fill in all fields', 'error');
                return;
            }
            
            if (!isValidEmail(email)) {
                showNotification('Please enter a valid email address', 'error');
                return;
            }
            
            // Simulate form submission
            showNotification('Message sent successfully!', 'success');
            form.reset();
        });
    }
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Show notification
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 2rem;
        background: ${type === 'success' ? '#00ff00' : '#ff0000'};
        color: #000;
        border-radius: 5px;
        font-family: 'Orbitron', sans-serif;
        font-weight: 600;
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease forwards';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Simple theme switching functionality
function initThemeSwitcher() {
    // Wait for DOM to be fully ready
    if (document.readyState !== 'complete') {
        window.addEventListener('load', initThemeSwitcher);
        return;
    }
    
    console.log('Theme switcher starting...');
    
    // Get theme buttons
    const buttons = document.querySelectorAll('.theme-btn');
    console.log('Buttons found:', buttons.length);
    
    if (buttons.length === 0) {
        console.error('No theme buttons found!');
        return;
    }
    
    // Theme images mapping
    const images = {
        cyberpunk: ['CyberP.png', 'CyberP.png', 'CyberP.png'],
        minecraft: ['RTX.png', 'mcperender.png', 'BBart.png'],
        gamedev: ['CyberP.png', 'CyberP.png', 'CyberP.png']
    };
    
    // Add click handlers
    buttons.forEach(button => {
        button.onclick = function() {
            const theme = this.dataset.theme;
            console.log('Clicked theme:', theme);
            changeTheme(theme);
        };
    });
    
    function changeTheme(theme) {
        console.log('Changing to theme:', theme);
        
        // Update HTML attribute
        document.documentElement.setAttribute('data-theme', theme);
        
        // Update active button
        buttons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.theme === theme) {
                btn.classList.add('active');
            }
        });
        
        // Control matrix canvas visibility
        const matrixCanvas = document.getElementById('matrix-canvas');
        if (matrixCanvas) {
            if (theme === 'cyberpunk') {
                matrixCanvas.style.display = 'block';
                matrixCanvas.style.opacity = '0.1';
            } else {
                matrixCanvas.style.display = 'none';
            }
        }
        
        // Update text content
        updateText(theme);
        
        // Update images
        updateImages(theme, images[theme]);
        
        // Update skills
        updateSkills(theme);
        
        console.log('Theme changed to:', theme);
    }
    
    function updateText(theme) {
        const elements = document.querySelectorAll(`[data-${theme}]`);
        console.log('Text elements to update:', elements.length);
        
        elements.forEach(el => {
            const text = el.getAttribute(`data-${theme}`);
            if (text) {
                el.textContent = text;
            }
        });
    }
    
    function updateImages(theme, imageList) {
        const imgs = document.querySelectorAll('.project-img');
        console.log('Images to update:', imgs.length);
        
        imgs.forEach((img, i) => {
            if (imageList[i]) {
                img.src = `assets/images/${imageList[i]}`;
                console.log('Updated image:', img.src);
            }
        });
    }
    
    function updateSkills(theme) {
        const skillSections = document.querySelectorAll('.theme-content');
        console.log('Skill sections:', skillSections.length);
        
        skillSections.forEach(section => {
            const sectionTheme = section.getAttribute('data-theme');
            if (sectionTheme === theme) {
                section.style.display = 'grid';
            } else {
                section.style.display = 'none';
            }
        });
    }
    
    // Test click handler
    console.log('Theme switcher initialized successfully');
}

// Update typing effect for different themes
function initTypingEffect() {
    const themeTexts = {
        cyberpunk: [
            "Cyberpunk Artist",
            "Digital Designer",
            "Visual Creator",
            "Art Director",
            "3D Modeler"
        ],
        minecraft: [
            "Minecraft Creator",
            "Block Builder",
            "RTX Renderer",
            "World Designer",
            "Texture Artist"
        ],
        gamedev: [
            "Game Designer",
            "Unity Developer",
            "Interactive Media",
            "VR Creator",
            "Gameplay Programmer"
        ]
    };
    
    const subtitle = document.querySelector('.subtitle');
    if (!subtitle) return;
    
    let currentTheme = document.documentElement.getAttribute('data-theme') || 'cyberpunk';
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    
    function typeText() {
        const currentTexts = themeTexts[currentTheme];
        const currentText = currentTexts[textIndex];
        
        if (isDeleting) {
            subtitle.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
        } else {
            subtitle.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
        }
        
        let typeSpeed = isDeleting ? 100 : 200;
        
        if (!isDeleting && charIndex === currentText.length) {
            typeSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % currentTexts.length;
            typeSpeed = 500;
        }
        
        setTimeout(typeText, typeSpeed);
    }
    
    // Update theme when theme changes
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
                currentTheme = document.documentElement.getAttribute('data-theme') || 'cyberpunk';
                textIndex = 0;
                charIndex = 0;
                isDeleting = false;
            }
        });
    });
    
    observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['data-theme']
    });
    
    setTimeout(typeText, 1000);
}

// Initialize all functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing...');
    createThemeBackground(); // Replace createMatrixRain()
    initNavigation();
    initScrollAnimations();
    initContactForm();
    initTypingEffect();
    initParallaxEffect();
    initSmoothScrolling();
    updateActiveNavigation();
    
    // Initialize theme switcher last
    setTimeout(initThemeSwitcher, 500);
});

// Also try on window load as backup
window.addEventListener('load', function() {
    console.log('Window loaded');
    initThemeSwitcher();
});

// Debug: Check if theme buttons exist
console.log('Theme buttons found:', document.querySelectorAll('.theme-btn').length);

// Add some CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    .skill-category {
        opacity: 0;
        transform: translateY(30px) scale(0.95);
        transition: all 0.6s ease;
    }
`;
document.head.appendChild(style);

// Add some interactive effects
document.addEventListener('mousemove', (e) => {
    const cursor = document.createElement('div');
    cursor.className = 'cursor-trail';
    cursor.style.cssText = `
        position: fixed;
        width: 10px;
        height: 10px;
        background: radial-gradient(circle, #00ffff 0%, transparent 70%);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        left: ${e.clientX - 5}px;
        top: ${e.clientY - 5}px;
        animation: fadeOut 0.5s ease-out forwards;
    `;
    
    document.body.appendChild(cursor);
    
    setTimeout(() => {
        if (cursor.parentNode) {
            cursor.parentNode.removeChild(cursor);
        }
    }, 500);
});

// Add fadeOut animation
const fadeOutStyle = document.createElement('style');
fadeOutStyle.textContent = `
    @keyframes fadeOut {
        from { opacity: 1; transform: scale(1); }
        to { opacity: 0; transform: scale(0); }
    }
`;
document.head.appendChild(fadeOutStyle);

// Matrix rain effect - only for cyberpunk theme
function createMatrixRain() {
    const canvas = document.createElement('canvas');
    canvas.id = 'matrix-canvas';
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.zIndex = '-1';
    canvas.style.pointerEvents = 'none';
    canvas.style.opacity = '0.1';
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const matrix = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()*&^%+-/~{[|`]}";
    const matrixArray = matrix.split("");
    
    const fontSize = 10;
    let columns = Math.floor(canvas.width / fontSize);
    let drops = [];
    
    function initDrops() {
        drops = [];
        for(let x = 0; x < columns; x++) {
            drops[x] = 1;
        }
    }
    
    initDrops();
    
    function draw() {
        // Only draw if cyberpunk theme is active
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'cyberpunk';
        if (currentTheme !== 'cyberpunk') {
            return;
        }
        
        ctx.fillStyle = 'rgba(0, 0, 0, 0.04)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#00ffff';
        ctx.font = fontSize + 'px monospace';
        
        for(let i = 0; i < drops.length; i++) {
            const text = matrixArray[Math.floor(Math.random() * matrixArray.length)];
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);
            
            if(drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    }
    
    setInterval(draw, 35);
}