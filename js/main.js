// Matrix rain effect
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

// Theme switching functionality
function initThemeSwitcher() {
    const themeButtons = document.querySelectorAll('.theme-btn');
    const html = document.documentElement;
    
    // Theme-specific images
    const themeImages = {
        cyberpunk: ['CyberP.png', 'CyberP.png', 'CyberP.png'],
        minecraft: ['RTX.png', 'mcperender.png', 'BBart.png'],
        gamedev: ['CyberP.png', 'CyberP.png', 'CyberP.png']
    };
    
    // Set initial active theme button
    const currentTheme = html.getAttribute('data-theme') || 'cyberpunk';
    updateActiveThemeButton(currentTheme);
    
    // Add click event listeners with proper event handling
    themeButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            const newTheme = button.getAttribute('data-theme');
            console.log('Theme button clicked:', newTheme); // Debug log
            
            if (newTheme) {
                switchTheme(newTheme);
            }
        });
    });
    
    function switchTheme(theme) {
        console.log('Switching to theme:', theme); // Debug log
        
        // Update HTML data-theme attribute
        html.setAttribute('data-theme', theme);
        
        // Force a style recalculation
        html.offsetHeight;
        
        // Update active button
        updateActiveThemeButton(theme);
        
        // Update content based on theme
        updateThemeContent(theme);
        
        // Update project images
        updateProjectImages(theme);
        
        // Update skills visibility
        updateSkillsVisibility(theme);
        
        // Save theme preference
        localStorage.setItem('preferred-theme', theme);
        
        // Trigger a reflow to ensure changes take effect
        document.body.classList.add('theme-transition');
        setTimeout(() => {
            document.body.classList.remove('theme-transition');
        }, 500);
    }
    
    function updateActiveThemeButton(theme) {
        themeButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-theme') === theme) {
                btn.classList.add('active');
            }
        });
    }
    
    function updateThemeContent(theme) {
        // Update all elements with theme-specific data attributes
        document.querySelectorAll('[data-' + theme + ']').forEach(element => {
            const themeContent = element.getAttribute('data-' + theme);
            if (themeContent) {
                if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                    element.value = themeContent;
                } else {
                    element.textContent = themeContent;
                }
            }
        });
    }
    
    function updateProjectImages(theme) {
        const projectImages = document.querySelectorAll('.project-img');
        const images = themeImages[theme] || themeImages.cyberpunk;
        
        projectImages.forEach((img, index) => {
            if (images[index]) {
                const newSrc = `assets/images/${images[index]}`;
                console.log('Updating image:', newSrc); // Debug log
                
                // Preload image before switching
                const preloadImg = new Image();
                preloadImg.onload = () => {
                    img.src = newSrc;
                    img.alt = `${theme} project ${index + 1}`;
                };
                preloadImg.src = newSrc;
            }
        });
    }
    
    function updateSkillsVisibility(theme) {
        const skillsContainers = document.querySelectorAll('.skills .theme-content');
        
        skillsContainers.forEach(container => {
            const containerTheme = container.getAttribute('data-theme');
            if (containerTheme === theme) {
                container.style.display = 'grid';
                container.style.opacity = '0';
                setTimeout(() => {
                    container.style.opacity = '1';
                }, 50);
            } else {
                container.style.display = 'none';
                container.style.opacity = '0';
            }
        });
    }
    
    // Load saved theme preference on initialization
    const savedTheme = localStorage.getItem('preferred-theme');
    if (savedTheme && ['cyberpunk', 'minecraft', 'gamedev'].includes(savedTheme)) {
        switchTheme(savedTheme);
    }
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
    createMatrixRain();
    initNavigation();
    initScrollAnimations();
    initContactForm();
    initTypingEffect();
    initParallaxEffect();
    initSmoothScrolling();
    updateActiveNavigation();
    initThemeSwitcher(); // Make sure this is called
    
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
});

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