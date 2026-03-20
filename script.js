
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
const EMAILJS_PUBLIC_KEY = 'w8jT_hIx8DjFeQa31';
const EMAILJS_SERVICE_ID = 'service_n5qmx1p';
const EMAILJS_TEMPLATE_ID = 'template_fw89dkg';

const certificateModal = document.getElementById('certificateModal');
const closeModalBtn = document.getElementById('closeModal');
const modalOverlay = document.querySelector('.modal-overlay');
const modalImg = document.getElementById('modalImg');
const modalTitle = document.getElementById('modalTitle');
const modalDesc = document.getElementById('modalDesc');
const modalDownload = document.getElementById('modalDownload');

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

    // Prepare template parameters for EmailJS
    const templateParams = {
        name: name,       // Added for compatibility
        email: email,     // Added for compatibility
        from_name: name,
        from_email: email,
        subject: subject,
        message: message,
        to_name: 'Naga Sri Swetha M',
        reply_to: email
    };

    try {
        // Send using EmailJS
        const result = await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams);

        if (result.status === 200) {
            showFormMessage('Message sent successfully! ✅', 'success');
            contactForm.reset();
            console.log('EmailJS response:', result.text);
        } else {
            throw new Error('EmailJS returned an unexpected status');
        }

    } catch (error) {
        console.error('Error sending message:', error);
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
        anchor.addEventListener('click', function (e) {
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


function openModal(card) {
    const img = card.getAttribute('data-image');
    const title = card.getAttribute('data-full-title');
    const desc = card.getAttribute('data-full-desc');

    modalImg.src = img;
    modalTitle.textContent = title;
    modalDesc.textContent = desc;
    modalDownload.href = img;

    certificateModal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent scrolling
}

function closeModal() {
    certificateModal.classList.remove('active');
    document.body.style.overflow = 'auto'; // Restore scrolling

    // Clear image after transition to avoid flicker next time
    setTimeout(() => {
        modalImg.src = '';
    }, 400);
}

// Initialize everything
function init() {
    emailjs.init(EMAILJS_PUBLIC_KEY);
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

        // No test connection needed for EmailJS as it's initialized in init()
    }

    // Modal Event Listeners
    const clickableCards = document.querySelectorAll('.achievement-card.clickable, .experience-card.clickable');
    clickableCards.forEach(card => {
        card.addEventListener('click', () => openModal(card));
    });

    if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
    if (modalOverlay) modalOverlay.addEventListener('click', closeModal);

    // Close modal on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && certificateModal.classList.contains('active')) {
            closeModal();
        }
    });

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
