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

    // Scroll animations for sections
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    document.querySelectorAll('section').forEach(section => {
        sectionObserver.observe(section);
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

    // Tooltip for social buttons
    document.querySelectorAll('.buttons button').forEach(button => {
        button.addEventListener('mouseenter', function(e) {
            const tooltip = document.createElement('div');
            tooltip.textContent = button.id.charAt(0).toUpperCase() + button.id.slice(1);
            tooltip.style.position = 'absolute';
            tooltip.style.background = 'rgba(0,0,0,0.8)';
            tooltip.style.color = 'white';
            tooltip.style.padding = '5px 10px';
            tooltip.style.borderRadius = '5px';
            tooltip.style.fontSize = '12px';
            tooltip.style.pointerEvents = 'none';
            tooltip.style.zIndex = '1000';
            document.body.appendChild(tooltip);

            const rect = button.getBoundingClientRect();
            tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
            tooltip.style.top = rect.top - 30 + 'px';

            button.addEventListener('mouseleave', function() {
                document.body.removeChild(tooltip);
            });
        });
    });
});
