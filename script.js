// ===== GLOBAL VARIABLES =====
let isMenuOpen = false;
let currentProjectTab = 'apps';

// ===== DOM ELEMENTS =====
const navbar = document.querySelector('.navbar');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');
const backToTopBtn = document.getElementById('backToTop');
const projectTabs = document.querySelectorAll('.project-tab');
const tabContents = document.querySelectorAll('.tab-content');
const skillBars = document.querySelectorAll('.skill-progress');
const contactForm = document.getElementById('contact-form');
const navLinks = document.querySelectorAll('.nav-link');

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    animateOnScroll();
    typeWriterEffect();
});

// ===== APP INITIALIZATION =====
function initializeApp() {
    // Set active project tab
    const activeTab = document.querySelector('.project-tab.active');
    if (activeTab) {
        currentProjectTab = activeTab.dataset.tab;
    }
    
    // Initialize skill bars animation observer
    setupSkillBarsObserver();
    
    // Initialize stats counter animation
    setupStatsCounter();
    
    // Initialize smooth scrolling
    setupSmoothScrolling();
    
    // Add loading animation
    document.body.classList.add('loaded');
}

// ===== EVENT LISTENERS SETUP =====
function setupEventListeners() {
    // Navbar scroll effect
    window.addEventListener('scroll', handleScroll);
    
    // Mobile menu toggle
    if (hamburger) {
        hamburger.addEventListener('click', toggleMobileMenu);
    }
    
    // Project tabs
    projectTabs.forEach(tab => {
        tab.addEventListener('click', (e) => handleProjectTabClick(e, tab.dataset.tab));
    });
    
    // Back to top button
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', scrollToTop);
    }
    
    // Contact form
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactForm);
    }
    
    // Navigation links smooth scroll
    navLinks.forEach(link => {
        link.addEventListener('click', handleNavLinkClick);
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', handleOutsideClick);
    
    // Keyboard navigation
    document.addEventListener('keydown', handleKeyboardNavigation);
    
    // Window resize handler
    window.addEventListener('resize', handleResize);
}

// ===== SCROLL HANDLER =====
function handleScroll() {
    const scrollY = window.scrollY;
    
    // Navbar scroll effect
    if (scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    // Back to top button
    if (scrollY > 300) {
        backToTopBtn.classList.add('show');
    } else {
        backToTopBtn.classList.remove('show');
    }
    
    // Update active navigation link
    updateActiveNavLink();
    
    // Parallax effect for floating shapes
    updateParallaxEffect(scrollY);
}

// ===== MOBILE MENU TOGGLE =====
function toggleMobileMenu() {
    isMenuOpen = !isMenuOpen;
    
    if (isMenuOpen) {
        navMenu.classList.add('active');
        hamburger.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Animate hamburger
        animateHamburger(true);
    } else {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
        document.body.style.overflow = 'auto';
        
        // Animate hamburger
        animateHamburger(false);
    }
}

// ===== HAMBURGER ANIMATION =====
function animateHamburger(isOpen) {
    const spans = hamburger.querySelectorAll('span');
    
    if (isOpen) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
    } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    }
}

// ===== PROJECT TAB SWITCHING =====
function handleProjectTabClick(e, tabId) {
    e.preventDefault();
    
    if (currentProjectTab === tabId) return;
    
    // Remove active class from all tabs and contents
    projectTabs.forEach(tab => tab.classList.remove('active'));
    tabContents.forEach(content => {
        content.classList.remove('active');
        content.style.opacity = '0';
    });
    
    // Add active class to clicked tab
    e.target.closest('.project-tab').classList.add('active');
    
    // Show corresponding content with animation
    setTimeout(() => {
        const targetContent = document.getElementById(tabId);
        if (targetContent) {
            targetContent.classList.add('active');
            targetContent.style.opacity = '1';
        }
    }, 150);
    
    currentProjectTab = tabId;
    
    // Add ripple effect
    addRippleEffect(e.target.closest('.project-tab'), e);
}

// ===== RIPPLE EFFECT =====
function addRippleEffect(element, event) {
    const ripple = document.createElement('span');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.classList.add('ripple');
    
    element.style.position = 'relative';
    element.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 1000);
}

// ===== SCROLL TO TOP =====
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// ===== SMOOTH SCROLLING SETUP =====
function setupSmoothScrolling() {
    // Add smooth scroll behavior to all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.getBoundingClientRect().top + window.pageYOffset - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ===== NAVIGATION LINK HANDLER =====
function handleNavLinkClick(e) {
    const href = e.currentTarget.getAttribute('href');
    
    if (href.startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(href);
        
        if (target) {
            const offsetTop = target.getBoundingClientRect().top + window.pageYOffset - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
        
        // Close mobile menu if open
        if (isMenuOpen) {
            toggleMobileMenu();
        }
    }
}

// ===== UPDATE ACTIVE NAV LINK =====
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.getBoundingClientRect().top;
        const sectionHeight = section.offsetHeight;
        
        if (sectionTop <= 100 && sectionTop + sectionHeight > 100) {
            currentSection = section.getAttribute('id');
        }
    });
    
    // Special case for hero section
    if (window.scrollY < 100) {
        currentSection = 'hero';
    }
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

// ===== SKILL BARS ANIMATION =====
function setupSkillBarsObserver() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const skillBar = entry.target.querySelector('.skill-progress');
                const width = skillBar.dataset.width;
                
                setTimeout(() => {
                    skillBar.style.width = width;
                }, 200);
                
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    document.querySelectorAll('.skill-item').forEach(item => {
        observer.observe(item);
    });
}

// ===== STATS COUNTER ANIMATION =====
function setupStatsCounter() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statNumber = entry.target.querySelector('.stat-number');
                const finalNumber = parseInt(statNumber.textContent.replace(/\D/g, ''));
                const suffix = statNumber.textContent.replace(/[0-9]/g, '');
                
                animateCounter(statNumber, 0, finalNumber, suffix, 2000);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    document.querySelectorAll('.stat-item').forEach(item => {
        observer.observe(item);
    });
}

// ===== COUNTER ANIMATION =====
function animateCounter(element, start, end, suffix, duration) {
    const increment = end / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= end) {
            current = end;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current) + suffix;
    }, 16);
}

// ===== TYPEWRITER EFFECT =====
function typeWriterEffect() {
    const typingText = document.querySelector('.typing-text');
    if (!typingText) return;
    
    const text = "Hi, I'm Islam Belghazi";
    const speed = 100;
    let i = 0;
    
    typingText.textContent = '';
    
    function type() {
        if (i < text.length) {
            typingText.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        } else {
            // Start blinking cursor after typing
            setTimeout(() => {
                i = 0;
                typingText.textContent = '';
                type();
            }, 2000);
        }
    }
    
    type();
}

// ===== PARALLAX EFFECT =====
function updateParallaxEffect(scrollY) {
    const shapes = document.querySelectorAll('.shape');
    shapes.forEach((shape, index) => {
        const speed = (index + 1) * 0.5;
        const yPos = -(scrollY * speed);
        shape.style.transform = `translate3d(0, ${yPos}px, 0)`;
    });
}

// ===== ANIMATE ON SCROLL =====
function animateOnScroll() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, { 
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    // Elements to animate
    const elementsToAnimate = document.querySelectorAll(
        '.about-content, .skill-category, .project-card, .contact-item, .contact-form'
    );
    
    elementsToAnimate.forEach(el => {
        observer.observe(el);
    });
}

// ===== CONTACT FORM HANDLER =====
function handleContactForm(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const name = formData.get('name') || e.target.querySelector('input[type="text"]').value;
    const email = formData.get('email') || e.target.querySelector('input[type="email"]').value;
    const subject = formData.get('subject') || e.target.querySelectorAll('input[type="text"]')[1].value;
    const message = formData.get('message') || e.target.querySelector('textarea').value;
    
    // Basic validation
    if (!name || !email || !subject || !message) {
        showNotification('Please fill in all fields', 'error');
        return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showNotification('Please enter a valid email address', 'error');
        return;
    }
    
    // Simulate form submission
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;
    
    setTimeout(() => {
        showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
        e.target.reset();
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }, 2000);
}

// ===== NOTIFICATION SYSTEM =====
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 5000);
}

// ===== OUTSIDE CLICK HANDLER =====
function handleOutsideClick(e) {
    if (isMenuOpen && !navMenu.contains(e.target) && !hamburger.contains(e.target)) {
        toggleMobileMenu();
    }
}

// ===== KEYBOARD NAVIGATION =====
function handleKeyboardNavigation(e) {
    if (e.key === 'Escape' && isMenuOpen) {
        toggleMobileMenu();
    }
    
    // Tab navigation for accessibility
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
    }
}

// ===== RESIZE HANDLER =====
function handleResize() {
    if (window.innerWidth > 768 && isMenuOpen) {
        toggleMobileMenu();
    }
}

// ===== LOADING ANIMATION =====
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    
    // Animate hero elements
    setTimeout(() => {
        document.querySelector('.hero-text')?.classList.add('animate');
        document.querySelector('.hero-image')?.classList.add('animate');
    }, 500);
});

// ===== PROJECT CARD HOVER EFFECTS =====
document.addEventListener('DOMContentLoaded', () => {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    });
});

// ===== SMOOTH REVEAL ANIMATIONS =====
function addRevealAnimations() {
    const revealElements = document.querySelectorAll('.reveal');
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15
    });
    
    revealElements.forEach(el => {
        revealObserver.observe(el);
    });
}

// Call reveal animations when DOM is loaded
document.addEventListener('DOMContentLoaded', addRevealAnimations);