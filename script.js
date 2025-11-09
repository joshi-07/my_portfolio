document.addEventListener('DOMContentLoaded', function() {
    let hasScrolled = false;

    // Check for prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Track if user has scrolled
    window.addEventListener('scroll', () => {
        hasScrolled = true;
    });

    // Typewriter effect for hero title (skip if reduced motion)
    if (!prefersReducedMotion) {
        const heroTitle = document.querySelector('.hero-title');
        const originalText = heroTitle.textContent;
        heroTitle.textContent = '';
        let i = 0;
        const typeWriter = () => {
            if (i < originalText.length) {
                heroTitle.textContent += originalText.charAt(i);
                i++;
                requestAnimationFrame(typeWriter);
            }
        };
        setTimeout(typeWriter, 1000); // Start after 1 second
    }

    const links = {
        gmail: 'mailto:sughoshak6@gmail.com',
        instagram: 'https://www.instagram.com/sughosha_joshi_07/',
        discord: 'https://discord.com/users/suguff',
        linkedin: 'https://www.linkedin.com/in/sughosha-k-joshi-74b96b395',
        github: 'https://github.com/joshi-07'
    };

    Object.keys(links).forEach(id => {
        const button = document.getElementById(id);
        if (button) {
            button.addEventListener('click', function() {
                window.open(links[id], '_blank');
            });
        }
    });

    // Mobile menu toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');

    mobileMenuToggle.addEventListener('click', function() {
        navMenu.classList.toggle('open');
        // Toggle hamburger animation
        const spans = mobileMenuToggle.querySelectorAll('span');
        spans.forEach(span => span.classList.toggle('active'));
    });

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('open');
            const spans = mobileMenuToggle.querySelectorAll('span');
            spans.forEach(span => span.classList.remove('active'));
        });
    });

    // Theme toggle
    const themeToggle = document.getElementById('theme-toggle');
    themeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark');
        themeToggle.textContent = document.body.classList.contains('dark') ? '☀️' : '🌙';
    });

    // Language toggle removed as element does not exist

    // Unified IntersectionObserver for all animations
    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting && !prefersReducedMotion) {
                const element = entry.target;
                const animationType = element.dataset.animation || 'fade-in-up';
                const delay = parseFloat(element.dataset.delay) || 0;

                // Use requestAnimationFrame for smoother animations
                requestAnimationFrame(() => {
                    setTimeout(() => {
                        element.classList.add(`animate-${animationType}`);
                    }, delay * 1000);
                });
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    // Set up animation data attributes and observe elements
    const setupAnimations = () => {
        // Sections
        document.querySelectorAll('section').forEach((section, index) => {
            section.dataset.animation = 'slide-in-left';
            section.dataset.delay = index * 0.15;
            animationObserver.observe(section);
        });

        // Individual elements
        const elements = [
            { selector: '.timeline-item', animation: 'fade-in-up', delay: 0.2 },
            { selector: '.skill-category', animation: 'fade-in-up', delay: 0.1 },
            { selector: '.project-card', animation: 'fade-in-up', delay: 0.1 },
            { selector: '.contact-method', animation: 'fade-in-up', delay: 0.1 },
            { selector: '.form-group', animation: 'fade-in-up', delay: 0.1 },
            { selector: '.about-lead', animation: 'fade-in-left', delay: 0.1 },
            { selector: '.about-text p', animation: 'fade-in-left', delay: 0.1 },
            { selector: '.stat-item', animation: 'fade-in-up', delay: 0.1 }
        ];

        elements.forEach(({ selector, animation, delay }) => {
            document.querySelectorAll(selector).forEach((el, index) => {
                el.dataset.animation = animation;
                el.dataset.delay = index * delay;
                animationObserver.observe(el);
            });
        });

        // Skill progress bars
        document.querySelectorAll('.skill-progress').forEach(progress => {
            animationObserver.observe(progress);
        });

        // Skill badges
        document.querySelectorAll('.badge').forEach((badge, index) => {
            badge.style.opacity = '0';
            badge.style.transform = 'translateY(20px)';
            badge.style.transition = 'all 0.5s ease';
            badge.dataset.animation = 'badge-reveal';
            badge.dataset.delay = index * 0.1;
            animationObserver.observe(badge);
        });

        // Tech tags
        document.querySelectorAll('.tech-tag').forEach((tag, index) => {
            tag.style.opacity = '0';
            tag.style.transform = 'translateX(-20px)';
            tag.style.transition = 'all 0.5s ease';
            tag.dataset.animation = 'tag-reveal';
            tag.dataset.delay = index * 0.05;
            animationObserver.observe(tag);
        });
    };

    setupAnimations();

    // Progress indicators and scroll tracking
    const progressFill = document.querySelector('.progress-fill');
    const progressDots = document.querySelectorAll('.progress-dot');
    const sections = document.querySelectorAll('section');

    let ticking = false;
    function updateProgress() {
        if (!ticking) {
            requestAnimationFrame(() => {
                const scrollTop = window.pageYOffset;
                const docHeight = document.documentElement.scrollHeight - window.innerHeight;
                const scrollPercent = (scrollTop / docHeight) * 100;
                progressFill.style.width = scrollPercent + '%';

                // Update active dot based on current section
                let currentSection = '';
                sections.forEach(section => {
                    const rect = section.getBoundingClientRect();
                    if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
                        currentSection = section.id;
                    }
                });

                progressDots.forEach(dot => {
                    dot.classList.remove('active');
                    if (dot.dataset.section === currentSection) {
                        dot.classList.add('active');
                    }
                });
                ticking = false;
            });
            ticking = true;
        }
    }

    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();

    // Progress dot navigation
    progressDots.forEach(dot => {
        dot.addEventListener('click', function() {
            const targetSection = document.getElementById(this.dataset.section);
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Typing effect for stats
    const statNumbers = document.querySelectorAll('.stat-number');
    const originalNumbers = Array.from(statNumbers).map(stat => parseInt(stat.textContent.replace(/[^\d]/g, '')));

    function animateStats() {
        if (prefersReducedMotion) return;

        statNumbers.forEach((stat, index) => {
            const target = originalNumbers[index];
            let current = 0;
            const increment = target / 50;
            const animate = () => {
                current += increment;
                if (current >= target) {
                    current = target;
                    stat.textContent = Math.floor(current) + (stat.textContent.includes('+') ? '+' : '');
                    return;
                }
                stat.textContent = Math.floor(current) + (stat.textContent.includes('+') ? '+' : '');
                requestAnimationFrame(animate);
            };
            requestAnimationFrame(animate);
        });
    }

    // Trigger stats animation on scroll
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateStats();
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    document.querySelector('.about-stats').querySelectorAll('.stat-item').forEach(stat => {
        statsObserver.observe(stat);
    });



    // Enhanced tooltip system
    const tooltip = document.getElementById('tooltip');
    let tooltipTimeout;

    function showTooltip(content, x, y) {
        clearTimeout(tooltipTimeout);
        tooltip.textContent = content;
        tooltip.style.left = x + 'px';
        tooltip.style.top = (y - 10) + 'px';
        tooltip.classList.add('show');
    }

    function hideTooltip() {
        tooltipTimeout = setTimeout(() => {
            tooltip.classList.remove('show');
        }, 200);
    }

    // Tooltips for skills
    document.querySelectorAll('.skill-item').forEach(item => {
        item.addEventListener('mouseenter', function(e) {
            const skillName = this.querySelector('.skill-name').textContent;
            const skillPercent = this.querySelector('.skill-percent').textContent;
            const content = `${skillName}: ${skillPercent} proficiency`;
            showTooltip(content, e.pageX, e.pageY);
        });
        item.addEventListener('mouseleave', hideTooltip);
        item.addEventListener('mousemove', function(e) {
            tooltip.style.left = e.pageX + 'px';
            tooltip.style.top = (e.pageY - 10) + 'px';
        });
    });

    // Tooltips for projects
    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('mouseenter', function(e) {
            const title = this.querySelector('.project-title').textContent;
            const description = this.querySelector('.project-description').textContent;
            const content = `${title}: ${description.substring(0, 100)}...`;
            showTooltip(content, e.pageX, e.pageY);
        });
        card.addEventListener('mouseleave', hideTooltip);
        card.addEventListener('mousemove', function(e) {
            tooltip.style.left = e.pageX + 'px';
            tooltip.style.top = (e.pageY - 10) + 'px';
        });
    });

    // Tooltips for contact methods
    document.querySelectorAll('.contact-method').forEach(method => {
        method.addEventListener('mouseenter', function(e) {
            const title = this.querySelector('h4').textContent;
            const link = this.querySelector('a').textContent;
            const content = `${title}: ${link}`;
            showTooltip(content, e.pageX, e.pageY);
        });
        method.addEventListener('mouseleave', hideTooltip);
        method.addEventListener('mousemove', function(e) {
            tooltip.style.left = e.pageX + 'px';
            tooltip.style.top = (e.pageY - 10) + 'px';
        });
    });

    // Parallax effect for section elements
    function updateParallax() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;

        document.querySelectorAll('.section-parallax').forEach((element, index) => {
            const speed = (index % 2 === 0) ? 0.3 : -0.3;
            element.style.transform = `translateY(${rate * speed}px)`;
        });
    }

    window.addEventListener('scroll', updateParallax);

    // Add floating elements to sections
    const sectionsList = ['about', 'experience', 'skills', 'projects', 'contact'];
    sectionsList.forEach(sectionId => {
        const section = document.getElementById(sectionId + '-section') || document.getElementById(sectionId);
        if (section) {
            for (let i = 0; i < 2; i++) {
                const element = document.createElement('div');
                element.className = 'section-floating-element';
                section.appendChild(element);
            }
            for (let i = 0; i < 2; i++) {
                const element = document.createElement('div');
                element.className = 'section-parallax';
                section.appendChild(element);
            }
        }
    });

    // Enhanced hover effects with sound-like feedback (visual)
    document.querySelectorAll('.timeline-content, .project-card, .contact-method').forEach(element => {
        element.addEventListener('mouseenter', function() {
            this.style.transition = 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        });
        element.addEventListener('mouseleave', function() {
            this.style.transition = 'all 0.3s ease';
        });
    });

    // Tooltip for social buttons (updated)
    document.querySelectorAll('.buttons button').forEach(button => {
        button.addEventListener('mouseenter', function(e) {
            const content = button.id.charAt(0).toUpperCase() + button.id.slice(1) + ' - Click to connect';
            showTooltip(content, e.pageX, e.pageY);
        });
        button.addEventListener('mouseleave', hideTooltip);
        button.addEventListener('mousemove', function(e) {
            tooltip.style.left = e.pageX + 'px';
            tooltip.style.top = (e.pageY - 10) + 'px';
        });
    });


});
