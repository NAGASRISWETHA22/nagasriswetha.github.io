
const themeToggle = document.getElementById('themeToggle');
const mobileMenu = document.getElementById('mobileMenu');
const navLinks = document.querySelector('.nav-links');
const contactForm = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');
const formMessage = document.getElementById('formMessage');
const projectFilters = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('#real-projects-grid .project-card');
const skeletonGrid = document.getElementById('skeleton-grid');
const realProjectsGrid = document.getElementById('real-projects-grid');
const noProjectsMessage = document.getElementById('noProjectsMessage');
const GOOGLE_SCRIPT_URL = 'google sheet url';

function toggleTheme() {
    const currentTheme = document.body.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
}

function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.body.setAttribute('data-theme', savedTheme);
}

function toggleMobileMenu() {
    navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
    if (navLinks.style.display === 'flex') {
        navLinks.style.flexDirection = 'column';
        navLinks.style.position = 'absolute';
        navLinks.style.top = '100%';
        navLinks.style.left = '0';
        navLinks.style.width = '100%';
        navLinks.style.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue('--bg-color');
        navLinks.style.padding = '20px';
        navLinks.style.boxShadow = '0 10px 20px var(--shadow)';
    }
}

function closeMobileMenu() {
    if (window.innerWidth <= 768) {
        navLinks.style.display = 'none';
    }
}

function updateCurrentYear() {
    document.getElementById('currentYear').textContent = new Date().getFullYear();
}

function animateSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    skillBars.forEach(bar => {
        const width = bar.getAttribute('data-width');
        bar.style.width = width + '%';
    });
}

function initSkillBars() {
    // Small delay to ensure DOM is ready
    setTimeout(animateSkillBars, 500);
}

function filterProjects(filter) {
    let hasVisibleProjects = false;
    
    projectCards.forEach(card => {
        const categories = card.getAttribute('data-category').split(' ');
        
        if (filter === 'all' || categories.includes(filter)) {
            card.style.display = 'block';
            hasVisibleProjects = true;
        } else {
            card.style.display = 'none';
        }
    });
    
    // Show/hide no projects message
    if (hasVisibleProjects) {
        noProjectsMessage.style.display = 'none';
    } else {
        noProjectsMessage.style.display = 'block';
    }
}

// Handle project filter clicks
function handleFilterClick(e) {
    const filter = e.target.getAttribute('data-filter');
    projectFilters.forEach(btn => btn.classList.remove('active'));
    e.target.classList.add('active');
    filterProjects(filter);
}

// Simulate loading projects
function loadProjects() {
    setTimeout(() => {
        skeletonGrid.style.display = 'none';
        realProjectsGrid.style.display = 'grid';
    }, 3000);
}

async function handleContactFormSubmit(e) {
    e.preventDefault();
    
    // Get form data
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const subject = document.getElementById('subject').value.trim();
    const message = document.getElementById('message').value;
    
    // Validate form
    if (!name || !email || !message) {
        showFormMessage('Please fill in all fields', 'error');
        return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showFormMessage('Please enter a valid email address', 'error');
        return;
    }
    
    // Show loading state
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    
    // Prepare data for Google Sheets
    const formData = {
        name: name,
        email: email,
        subject: subject,
        message: message,
        timestamp: new Date().toISOString()
    };
    
    try {
        // Send to Google Sheets
        const response = await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams(formData).toString()
        });
        showFormMessage('Message sent successfully! ✅', 'success');
        
        // Reset form
        contactForm.reset();
        
        console.log('Form submitted successfully:', formData);
        
    } catch (error) {
        console.error('Error submitting form:', error);
        showFormMessage('Failed to send message. You can also email me directly at nagasriswethamurugan@gmail.com', 'error');
    } finally {
        // Reset button state
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
        setTimeout(() => {
            formMessage.style.display = 'none';
        }, 5000);
    }
}

function showFormMessage(message, type) {
    formMessage.textContent = message;
    formMessage.className = `form-message ${type}`;
    formMessage.style.display = 'block';
}
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 100,
                    behavior: 'smooth'
                });
                closeMobileMenu();
            }
        });
    });
}

// Test Google Sheets connection
async function testGoogleSheetsConnection() {
    try {
        const testData = { name: 'Test', email: 'test@example.com', message: 'Test connection' };
        const response = await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            body: new URLSearchParams(testData).toString()
        });
        console.log('Google Sheets connection test completed');
    } catch (error) {
        console.warn('Google Sheets might not be properly configured:', error);
    }
}

// Initialize everything
function init() {

    initTheme();
    themeToggle.addEventListener('click', toggleTheme);
    
    // Mobile menu
    mobileMenu.addEventListener('click', toggleMobileMenu);
    
    document.addEventListener('click', (e) => {
        if (!mobileMenu.contains(e.target) && !navLinks.contains(e.target)) {
            if (window.innerWidth <= 768) {
                navLinks.style.display = 'none';
            }
        }
    });
    
    updateCurrentYear();
    initSkillBars();
    
    // Project filtering
    if (projectFilters.length > 0) {
        projectFilters.forEach(btn => {
            btn.addEventListener('click', handleFilterClick);
        });
        
        // Load projects with skeleton loading
        loadProjects();
    }
    
    // Contact form
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactFormSubmit);
        
        // Test connection on page load
        setTimeout(testGoogleSheetsConnection, 2000);
    }
    
    // Smooth scrolling
    initSmoothScrolling();
    const observerOptions = {
        threshold: 0.5
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateSkillBars();
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    const skillsSection = document.getElementById('skills');
    if (skillsSection) {
        observer.observe(skillsSection);
    }
    
    console.log('Portfolio initialized successfully');
}

document.addEventListener('DOMContentLoaded', init);
