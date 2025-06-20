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
            const href = link.getAttribute('href');
            
            // If link contains "../" or starts with "http", it's an external/cross-page link
            if (href.includes('../') || href.startsWith('http') || href.includes('.html')) {
                // Let the browser handle the navigation normally
                return;
            }
            
            // Handle same-page navigation
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetSection = document.getElementById(targetId);
                
                if (targetSection) {
                    targetSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
                
                // Update active link
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            }
            
            // Close mobile menu
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
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
            const href = link.getAttribute('href');
            
            // If link contains "../" or starts with "http", it's an external/cross-page link
            if (href.includes('../') || href.startsWith('http') || href.includes('.html')) {
                // Let the browser handle the navigation normally
                return;
            }
            
            // Handle same-page navigation
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetSection = document.getElementById(targetId);
                
                if (targetSection) {
                    targetSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
                
                // Update active link
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            }
            
            // Close mobile menu
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
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

// Gallery Carousel functionality
let currentSlideIndex = 0;
const slides = document.querySelectorAll('.carousel-slide');
const indicators = document.querySelectorAll('.indicator');

function showSlide(index) {
    if (!slides.length) return;
    
    // Hide all slides
    slides.forEach(slide => slide.classList.remove('active'));
    indicators.forEach(indicator => indicator.classList.remove('active'));
    
    // Show current slide
    if (slides[index]) {
        slides[index].classList.add('active');
        indicators[index].classList.add('active');
    }
    
    // Update carousel track position
    const track = document.querySelector('.carousel-track');
    if (track) {
        track.style.transform = `translateX(-${index * 100}%)`;
    }
}

function nextSlide() {
    currentSlideIndex = (currentSlideIndex + 1) % slides.length;
    showSlide(currentSlideIndex);
}

function previousSlide() {
    currentSlideIndex = (currentSlideIndex - 1 + slides.length) % slides.length;
    showSlide(currentSlideIndex);
}

function currentSlide(index) {
    currentSlideIndex = index - 1;
    showSlide(currentSlideIndex);
}

// Auto-advance carousel
function initCarousel() {
    setInterval(nextSlide, 5000); // Change slide every 5 seconds
}

// Login System functionality
function openLoginModal() {
    document.getElementById('loginModal').style.display = 'block';
}

function closeLoginModal() {
    document.getElementById('loginModal').style.display = 'none';
}

// Developer credentials (in real app, this should be server-side)
const devCredentials = {
    username: 'SpicyMatters',
    password: 'admin123'
};

function initLoginSystem() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const statusDiv = document.getElementById('loginStatus');
            
            if (username === devCredentials.username && password === devCredentials.password) {
                statusDiv.innerHTML = 'Login successful! Welcome, Developer.';
                statusDiv.className = 'login-status success';
                
                setTimeout(() => {
                    closeLoginModal();
                    showAdminPanel();
                }, 1500);
            } else {
                statusDiv.innerHTML = 'Invalid credentials. Please try again.';
                statusDiv.className = 'login-status error';
            }
        });
    }
}

function showAdminPanel() {
    document.getElementById('adminPanel').style.display = 'block';
    document.querySelector('.login-btn').innerHTML = '<i class="fas fa-user-shield"></i> Admin';
}

function logout() {
    document.getElementById('adminPanel').style.display = 'none';
    document.querySelector('.login-btn').innerHTML = '<i class="fas fa-user"></i> Login';
}

function editMode() {
    alert('Edit mode activated! (Feature coming soon)');
}

function viewAnalytics() {
    alert('Analytics dashboard (Feature coming soon)');
}

// Customer Support Chat functionality
let chatOpen = false;

function toggleChat() {
    const chatWindow = document.getElementById('chatWindow');
    chatOpen = !chatOpen;
    
    if (chatOpen) {
        chatWindow.style.display = 'flex';
        document.getElementById('chatInput').focus();
    } else {
        chatWindow.style.display = 'none';
    }
}

function closeChat() {
    document.getElementById('chatWindow').style.display = 'none';
    chatOpen = false;
}

function minimizeChat() {
    closeChat();
}

function sendMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    
    if (message) {
        addMessage(message, 'user');
        input.value = '';
        
        // Simulate bot response
        setTimeout(() => {
            const botResponse = generateBotResponse(message);
            addMessage(botResponse, 'bot');
        }, 1000);
    }
}

function addMessage(message, sender) {
    const chatBody = document.getElementById('chatBody');
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${sender}-message`;
    
    const now = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    
    messageDiv.innerHTML = `
        <div class="message-content">
            <p>${message}</p>
            <span class="message-time">${now}</span>
        </div>
    `;
    
    chatBody.appendChild(messageDiv);
    chatBody.scrollTop = chatBody.scrollHeight;
}

function generateBotResponse(userMessage) {
    const responses = {
        'hello': 'Hello! How can I help you today?',
        'hi': 'Hi there! What can I assist you with?',
        'price': 'For pricing information, please contact SpicyMatters directly through the contact form.',
        'work': 'SpicyMatters specializes in digital art, Minecraft content creation, and game design. Check out the portfolio above!',
        'contact': 'You can reach SpicyMatters through the contact form on this website or via the social media links.',
        'portfolio': 'Feel free to browse through the projects and gallery sections to see SpicyMatters\' work!',
        'default': 'Thank you for your message! For detailed inquiries, please use the contact form or reach out directly.'
    };
    
    const lowerMessage = userMessage.toLowerCase();
    
    for (const key in responses) {
        if (lowerMessage.includes(key)) {
            return responses[key];
        }
    }
    
    return responses.default;
}

function handleChatEnter(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
}

// User Interface Management
function updateUserInterface() {
    const currentUser = userSystem.getCurrentUser();
    const loggedOutState = document.getElementById('loggedOutState');
    const loggedInState = document.getElementById('loggedInState');
    
    if (currentUser) {
        // Show logged in state
        loggedOutState.style.display = 'none';
        loggedInState.style.display = 'block';
        
        // Update user info
        document.getElementById('userName').textContent = currentUser.username;
        
        // Set profile picture (generated or custom)
        const profilePicElement = document.getElementById('userProfilePic');
        const profilePicSrc = userSystem.getUserProfilePic(currentUser.username);
        profilePicElement.src = profilePicSrc;

        // Show admin menu items if admin
        const adminMenuItems = document.getElementById('adminMenuItems');
        if (userSystem.isAdmin()) {
            adminMenuItems.style.display = 'block';
        } else {
            adminMenuItems.style.display = 'none';
        }
        
        // Apply user theme preference
        if (currentUser.preferences && currentUser.preferences.theme) {
            switchTheme(currentUser.preferences.theme);
        }
    } else {
        // Show logged out state
        loggedOutState.style.display = 'flex';
        loggedInState.style.display = 'none';
    }
}

// Modal Functions
function openLoginModal() {
    document.getElementById('loginModal').style.display = 'block';
}

function closeLoginModal() {
    document.getElementById('loginModal').style.display = 'none';
    document.getElementById('loginStatus').innerHTML = '';
}

function openRegisterModal() {
    document.getElementById('registerModal').style.display = 'block';
}

function closeRegisterModal() {
    document.getElementById('registerModal').style.display = 'none';
    document.getElementById('registerStatus').innerHTML = '';
}

function switchToRegister() {
    closeLoginModal();
    openRegisterModal();
}

function switchToLogin() {
    closeRegisterModal();
    openLoginModal();
}

// User Menu Functions
function toggleUserMenu() {
    const dropdown = document.getElementById('userDropdown');
    dropdown.classList.toggle('show');
}

function logoutUser() {
    userSystem.logout();
    updateUserInterface();
    document.getElementById('userDropdown').classList.remove('show');
}

// Profile Modal Functions
function openProfileModal() {
    const currentUser = userSystem.getCurrentUser();
    if (!currentUser) return;
    
    document.getElementById('profileUsername').textContent = currentUser.username;
    document.getElementById('profileEmail').textContent = currentUser.email;
    document.getElementById('profileRole').textContent = currentUser.role;
    document.getElementById('profileCreated').textContent = new Date(currentUser.createdAt).toLocaleDateString();
    document.getElementById('profileLastLogin').textContent = currentUser.lastLogin ? new Date(currentUser.lastLogin).toLocaleString() : 'Never';
    document.getElementById('profilePicPreview').src = currentUser.profilePic;
    
    // Set profile picture preview
    const profilePicPreview = document.getElementById('profilePicPreview');
    const profilePicSrc = userSystem.getUserProfilePic(currentUser.username);
    profilePicPreview.src = profilePicSrc;
    
    document.getElementById('profileModal').style.display = 'block';
    document.getElementById('userDropdown').classList.remove('show');
}

function closeProfileModal() {
    document.getElementById('profileModal').style.display = 'none';
}

// Preferences Modal Functions
function openPreferencesModal() {
    const currentUser = userSystem.getCurrentUser();
    if (!currentUser) return;
    
    const prefs = currentUser.preferences;
    document.getElementById('prefTheme').value = prefs.theme;
    document.getElementById('prefNotifications').checked = prefs.notifications;
    document.getElementById('prefEmailUpdates').checked = prefs.emailUpdates;
    
    document.getElementById('preferencesModal').style.display = 'block';
    document.getElementById('userDropdown').classList.remove('show');
}

function closePreferencesModal() {
    document.getElementById('preferencesModal').style.display = 'none';
}

// Profile picture management
function changeProfilePic() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    
    input.onchange = function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const result = e.target.result;
                
                // Update profile picture
                userSystem.updateCustomProfilePic(result);
                
                // Update UI
                document.getElementById('profilePicPreview').src = result;
                updateUserInterface();
                
                showStatusMessage('profileModal', 'Profile picture updated successfully!', 'success');
            };
            reader.readAsDataURL(file);
        }
    };
    
    input.click();
}

function resetToGeneratedAvatar() {
    const currentUser = userSystem.getCurrentUser();
    if (!currentUser) return;
    
    userSystem.resetToGeneratedAvatar();
    
    // Update UI with generated avatar
    const generatedAvatar = avatarGenerator.generateAvatarDataURL(currentUser.username, 100);
    document.getElementById('profilePicPreview').src = generatedAvatar;
    updateUserInterface();
    
    showStatusMessage('profileModal', 'Reset to generated avatar!', 'success');
}

function showStatusMessage(modalId, message, type) {
    const statusDiv = document.createElement('div');
    statusDiv.className = `status-message ${type}`;
    statusDiv.innerHTML = message;
    
    const modal = document.getElementById(modalId);
    const existingStatus = modal.querySelector('.status-message');
    if (existingStatus) {
        existingStatus.remove();
    }
    
    modal.querySelector('.modal-content').appendChild(statusDiv);
    
    setTimeout(() => {
        statusDiv.remove();
    }, 3000);
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

// Initialize all new features
document.addEventListener('DOMContentLoaded', () => {
    // ...existing code...
    
    // Initialize new features
    initCarousel();
    initLoginSystem();
    
    // Close modal when clicking outside
    window.onclick = function(event) {
        const modal = document.getElementById('loginModal');
        if (event.target === modal) {
            closeLoginModal();
        }
    };
});