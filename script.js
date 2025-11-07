document.addEventListener('DOMContentLoaded', function() {
    let hasScrolled = false;

    // Track if user has scrolled
    window.addEventListener('scroll', () => {
        hasScrolled = true;
    });

    // Typewriter effect for hero title
    const heroTitle = document.querySelector('.hero-title');
    const originalText = heroTitle.textContent;
    heroTitle.textContent = '';
    let i = 0;
    const typeWriter = () => {
        if (i < originalText.length) {
            heroTitle.textContent += originalText.charAt(i);
            i++;
            setTimeout(typeWriter, 100);
        }
    };
    setTimeout(typeWriter, 1000); // Start after 1 second

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

    // Language toggle (basic English/Hindi)
    const langToggle = document.getElementById('lang-toggle');
    let isEnglish = true;
    const translations = {
        en: {
            name: 'Sughosha K Joshi',
            subtitle: 'Portfolio',
            about: 'About Me',
            aboutText: 'I\'m Sughosha K Joshi, a passionate engineering student with a keen interest in programming and technology. I enjoy building projects and learning new skills in software development.',
            experience: 'Experience',
            expText: 'Engineering Student',
            expDesc: 'Currently pursuing engineering degree with focus on software development and programming.',
            skills: 'Skills',
            projects: 'Projects',
            testimonials: 'Testimonials',
            blog: 'Latest Articles',
            contact: 'Contact Me',
            connect: 'Connect with Me'
        },
        hi: {
            name: 'सुघोषा के जोशी',
            subtitle: 'पोर्टफोलियो',
            about: 'मेरे बारे में',
            aboutText: 'मैं सुघोषा के जोशी हूं, एक उत्साही इंजीनियरिंग छात्र जिसे प्रोग्रामिंग और तकनीक में गहरी रुचि है। मुझे प्रोजेक्ट बनाना और सॉफ्टवेयर डेवलपमेंट में नए कौशल सीखना पसंद है।',
            experience: 'अनुभव',
            expText: 'इंजीनियरिंग छात्र',
            expDesc: 'वर्तमान में इंजीनियरिंग की डिग्री प्राप्त कर रहा हूं जिसमें सॉफ्टवेयर डेवलपमेंट और प्रोग्रामिंग पर ध्यान केंद्रित है।',
            skills: 'कौशल',
            projects: 'प्रोजेक्ट',
            testimonials: 'प्रशंसापत्र',
            blog: 'नवीनतम लेख',
            contact: 'संपर्क करें',
            connect: 'मेरे साथ जुड़ें'
        }
    };

    langToggle.addEventListener('click', function() {
        isEnglish = !isEnglish;
        const lang = isEnglish ? 'en' : 'hi';
        document.getElementById('name').textContent = translations[lang].name;
        document.getElementById('subtitle').textContent = translations[lang].subtitle;
        document.querySelector('.about h2').textContent = translations[lang].about;
        document.querySelector('.about p').textContent = translations[lang].aboutText;
        document.querySelector('.experience h2').textContent = translations[lang].experience;
        document.querySelector('.exp-item h3').textContent = translations[lang].expText;
        document.querySelector('.exp-item p').textContent = translations[lang].expDesc;
        document.querySelector('.skills h2').textContent = translations[lang].skills;
        document.querySelector('.projects h2').textContent = translations[lang].projects;
        document.querySelector('.testimonials h2').textContent = translations[lang].testimonials;
        document.querySelector('.blog h2').textContent = translations[lang].blog;
        document.querySelector('.contact h2').textContent = translations[lang].contact;
        document.querySelector('.social-links h2').textContent = translations[lang].connect;
        langToggle.textContent = isEnglish ? 'EN' : 'HI';
    });

    // Slide-in-left animation for all sections on scroll
    const slideObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                const delay = index * 0.15; // Stagger animations slightly
                setTimeout(() => {
                    entry.target.classList.add('slide-in-left');
                }, delay * 1000);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    // Observe all sections for slide-in-left
    document.querySelectorAll('section').forEach(section => {
        slideObserver.observe(section);
    });

    // Also observe individual elements within sections for smoother animation
    const slideElements = document.querySelectorAll('.timeline-item, .skill-category, .project-card, .contact-method, .form-group, .about-lead, .about-text p, .stat-item');
    slideElements.forEach(element => {
        slideObserver.observe(element);
    });

    // Animate progress bars on scroll
    const progressObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progress = entry.target;
                const percent = progress.getAttribute('data-progress') || '0';
                progress.style.width = percent + '%';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    document.querySelectorAll('.skill-progress').forEach(progress => {
        progressObserver.observe(progress);
    });

    // Animate elements on scroll
    const animateObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const delay = index * 0.1; // Stagger animations
                setTimeout(() => {
                    element.classList.add('animate-fade-in-up');
                }, delay * 1000);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    // About section animations
    document.querySelectorAll('.about-lead, .about-text p').forEach(el => {
        animateObserver.observe(el);
    });

    document.querySelectorAll('.stat-item').forEach((el, index) => {
        el.style.transitionDelay = `${index * 0.1}s`;
        animateObserver.observe(el);
    });

    // Override animation class for about section to slide from left
    const aboutObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const delay = index * 0.1;
                setTimeout(() => {
                    element.classList.add('animate-fade-in-left');
                }, delay * 1000);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    document.querySelectorAll('.about-lead, .about-text p, .stat-item').forEach(el => {
        aboutObserver.observe(el);
    });

    // Experience section animations
    document.querySelectorAll('.timeline-item').forEach((el, index) => {
        el.style.transitionDelay = `${index * 0.2}s`;
        animateObserver.observe(el);
    });

    // Skills section animations
    document.querySelectorAll('.skill-category').forEach((el, index) => {
        el.style.transitionDelay = `${index * 0.1}s`;
        animateObserver.observe(el);
    });

    // Projects section animations
    document.querySelectorAll('.project-card').forEach((el, index) => {
        el.style.transitionDelay = `${index * 0.1}s`;
        animateObserver.observe(el);
    });

    // Contact section animations
    document.querySelectorAll('.contact-method').forEach((el, index) => {
        el.style.transitionDelay = `${index * 0.1}s`;
        animateObserver.observe(el);
    });

    document.querySelectorAll('.contact-form .form-group').forEach((el, index) => {
        el.style.transitionDelay = `${index * 0.1}s`;
        animateObserver.observe(el);
    });

    // Progress indicators and scroll tracking
    const progressFill = document.querySelector('.progress-fill');
    const progressDots = document.querySelectorAll('.progress-dot');
    const sections = document.querySelectorAll('section');

    function updateProgress() {
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
    }

    window.addEventListener('scroll', updateProgress);
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
        statNumbers.forEach((stat, index) => {
            const target = originalNumbers[index];
            let current = 0;
            const increment = target / 50;
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                stat.textContent = Math.floor(current) + (stat.textContent.includes('+') ? '+' : '');
            }, 30);
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

    // Staggered reveal for skill badges
    const skillBadges = document.querySelectorAll('.badge');
    const badgeObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
            }
        });
    }, { threshold: 0.1 });

    skillBadges.forEach(badge => {
        badge.style.opacity = '0';
        badge.style.transform = 'translateY(20px)';
        badge.style.transition = 'all 0.5s ease';
        badgeObserver.observe(badge);
    });

    // Staggered reveal for project tech tags
    const techTags = document.querySelectorAll('.tech-tag');
    const techObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateX(0)';
                }, index * 50);
            }
        });
    }, { threshold: 0.1 });

    techTags.forEach(tag => {
        tag.style.opacity = '0';
        tag.style.transform = 'translateX(-20px)';
        tag.style.transition = 'all 0.5s ease';
        techObserver.observe(tag);
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
