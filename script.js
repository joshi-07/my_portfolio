document.addEventListener('DOMContentLoaded', function() {
    let hasScrolled = false;

    // Check for prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Detect touch device
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    // Cursor Trail Effect (only for non-touch devices)
    const cursorTrail = document.querySelector('.cursor-trail');
    let mouseX = 0, mouseY = 0;
    let trailX = 0, trailY = 0;

    if (cursorTrail && !prefersReducedMotion && !isTouchDevice) {
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursorTrail.classList.add('active');
        });

        function animateTrail() {
            const dx = mouseX - trailX;
            const dy = mouseY - trailY;
            trailX += dx * 0.1;
            trailY += dy * 0.1;
            
            cursorTrail.style.left = trailX + 'px';
            cursorTrail.style.top = trailY + 'px';
            
            requestAnimationFrame(animateTrail);
        }
        animateTrail();

        // Hide trail when mouse leaves window
        document.addEventListener('mouseleave', () => {
            cursorTrail.classList.remove('active');
        });
    } else if (cursorTrail) {
        // Hide cursor trail on touch devices
        cursorTrail.style.display = 'none';
    }

    // Glitch Effect for Section Titles
    if (!prefersReducedMotion) {
        const sectionTitles = document.querySelectorAll('.section-title');
        sectionTitles.forEach(title => {
            title.addEventListener('mouseenter', function() {
                this.style.animation = 'none';
                setTimeout(() => {
                    this.style.animation = 'glitch 0.3s';
                }, 10);
            });
        });
    }

    // Track if user has scrolled
    window.addEventListener('scroll', () => {
        hasScrolled = true;
    });

    // Enhanced Typewriter effect for hero title with blinking cursor
    if (!prefersReducedMotion) {
        const heroTitle = document.querySelector('.hero-title');
        if (heroTitle) {
            const originalText = heroTitle.textContent.replace('|', '').trim();
            heroTitle.textContent = '';
            let i = 0;
            const typeSpeed = 80; // milliseconds per character

            const typeWriter = () => {
                if (i < originalText.length) {
                    heroTitle.innerHTML = originalText.substring(0, i + 1) + '<span class="cursor-blink">|</span>';
                    i++;
                    setTimeout(typeWriter, typeSpeed);
                } else {
                    // Keep blinking cursor after typing is complete
                    heroTitle.innerHTML = originalText + '<span class="cursor-blink">|</span>';
                }
            };
            setTimeout(typeWriter, 1000); // Start after 1 second
        }
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

    // Mobile menu toggle with backdrop
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const body = document.body;

    function toggleMobileMenu() {
        const isOpen = navMenu.classList.contains('open');
        navMenu.classList.toggle('open');
        mobileMenuToggle.classList.toggle('active');
        body.classList.toggle('menu-open');
        
        // Prevent body scroll when menu is open
        if (navMenu.classList.contains('open')) {
            body.style.overflow = 'hidden';
        } else {
            body.style.overflow = '';
        }
    }

    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            e.preventDefault();
            toggleMobileMenu();
        });

        // Touch event for better mobile support
        mobileMenuToggle.addEventListener('touchend', function(e) {
            e.stopPropagation();
            e.preventDefault();
            toggleMobileMenu();
        });
    }

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('open');
            mobileMenuToggle.classList.remove('active');
            body.classList.remove('menu-open');
            body.style.overflow = '';
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (navMenu && navMenu.classList.contains('open') && 
            !navMenu.contains(e.target) && 
            mobileMenuToggle && !mobileMenuToggle.contains(e.target)) {
            navMenu.classList.remove('open');
            mobileMenuToggle.classList.remove('active');
            body.classList.remove('menu-open');
            body.style.overflow = '';
        }
    });

    // Close mobile menu on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && navMenu && navMenu.classList.contains('open')) {
            navMenu.classList.remove('open');
            mobileMenuToggle.classList.remove('active');
            body.classList.remove('menu-open');
            body.style.overflow = '';
        }
    });

    // Theme toggle with localStorage persistence
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = themeToggle.querySelector('i');
    
    // Load saved theme preference
    const savedTheme = localStorage.getItem('theme') || 'dark';
    if (savedTheme === 'light') {
        document.body.classList.add('light-mode');
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
    }
    
    themeToggle.addEventListener('click', function() {
        const isLightMode = document.body.classList.contains('light-mode');
        if (isLightMode) {
            document.body.classList.remove('light-mode');
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
            localStorage.setItem('theme', 'dark');
        } else {
            document.body.classList.add('light-mode');
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
            localStorage.setItem('theme', 'light');
        }
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

        // Individual elements (project cards handled separately with staggered animation)
        const elements = [
            { selector: '.timeline-item', animation: 'fade-in-up', delay: 0.2 },
            { selector: '.skill-category', animation: 'fade-in-up', delay: 0.1 },
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

        // Skill progress bars with neon animation
        document.querySelectorAll('.skill-progress').forEach(progress => {
            animationObserver.observe(progress);
            // Animate progress on scroll
            const progressObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !prefersReducedMotion) {
                        const targetProgress = entry.target.dataset.progress;
                        setTimeout(() => {
                            entry.target.style.width = targetProgress + '%';
                        }, 200);
                        progressObserver.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.5 });
            progressObserver.observe(progress);
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

                // Update active dot and nav link based on current section
                let currentSection = '';
                sections.forEach(section => {
                    const rect = section.getBoundingClientRect();
                    const sectionTop = rect.top + window.scrollY;
                    const sectionHeight = rect.height;
                    const scrollPosition = window.scrollY + window.innerHeight / 2;
                    
                    if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                        currentSection = section.id;
                    }
                });

                progressDots.forEach(dot => {
                    dot.classList.remove('active');
                    if (dot.dataset.section === currentSection) {
                        dot.classList.add('active');
                    }
                });

                // Update active nav link
                document.querySelectorAll('.nav-link').forEach(link => {
                    link.classList.remove('active');
                    const href = link.getAttribute('href');
                    if (href === `#${currentSection}`) {
                        link.classList.add('active');
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

    // Typing effect for stats (About section)
    const statNumbers = document.querySelectorAll('.stat-number');
    const originalNumbers = Array.from(statNumbers).map(stat => {
        const text = stat.textContent;
        const num = parseFloat(text.replace(/[^\d.]/g, ''));
        return { value: num, suffix: text.replace(/[\d.]/g, '') };
    });

    function animateStats() {
        if (prefersReducedMotion) return;

        statNumbers.forEach((stat, index) => {
            const target = originalNumbers[index];
            let current = 0;
            const increment = target.value / 50;
            const animate = () => {
                current += increment;
                if (current >= target.value) {
                    current = target.value;
                    stat.textContent = current.toFixed(target.suffix.includes('.') ? 1 : 0) + target.suffix;
                    return;
                }
                stat.textContent = current.toFixed(target.suffix.includes('.') ? 1 : 0) + target.suffix;
                requestAnimationFrame(animate);
            };
            requestAnimationFrame(animate);
        });
    }

    // Trigger stats animation on scroll (About section)
    const aboutStats = document.querySelector('.about-stats');
    if (aboutStats) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateStats();
                    statsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        aboutStats.querySelectorAll('.stat-item').forEach(stat => {
            statsObserver.observe(stat);
        });
    }

    // Animate stats recap numbers
    const recapNumbers = document.querySelectorAll('.recap-number');
    const recapOriginalNumbers = Array.from(recapNumbers).map(stat => {
        const text = stat.textContent;
        const num = parseInt(text.replace(/[^\d]/g, ''));
        return num;
    });

    function animateRecapStats() {
        if (prefersReducedMotion) return;

        recapNumbers.forEach((stat, index) => {
            const target = recapOriginalNumbers[index];
            if (!target) return;
            
            let current = 0;
            const increment = target / 50;
            const animate = () => {
                current += increment;
                if (current >= target) {
                    current = target;
                    stat.textContent = Math.floor(current);
                    return;
                }
                stat.textContent = Math.floor(current);
                requestAnimationFrame(animate);
            };
            requestAnimationFrame(animate);
        });
    }

    // Trigger recap stats animation on scroll
    const statsRecapSection = document.querySelector('.stats-recap-section');
    if (statsRecapSection) {
        const recapStatsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateRecapStats();
                    recapStatsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        recapStatsObserver.observe(statsRecapSection);
    }



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

    // Enhanced Parallax effect with smoke/drift animation (throttled with requestAnimationFrame)
    let parallaxTicking = false;

    function updateParallax() {
        if (prefersReducedMotion) return;

        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;

        document.querySelectorAll('.section-parallax').forEach((element, index) => {
            const speed = (index % 2 === 0) ? 0.3 : -0.3;
            const drift = Math.sin(scrolled * 0.001 + index) * 20;
            element.style.transform = `translateY(${rate * speed + drift}px) translateX(${drift * 0.5}px)`;
        });

        // Animate background particles
        document.querySelectorAll('.particle').forEach((particle, index) => {
            const speed = 0.1 + (index % 3) * 0.05;
            const offset = scrolled * speed;
            particle.style.transform = `translateY(${offset}px)`;
        });

        parallaxTicking = false;
    }

    function onScrollParallax() {
        if (!parallaxTicking) {
            parallaxTicking = true;
            requestAnimationFrame(updateParallax);
        }
    }

    window.addEventListener('scroll', onScrollParallax, { passive: true });

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

    // Enhanced hover effects with neon glow
    document.querySelectorAll('.timeline-content, .contact-method, .skill-category').forEach(element => {
        element.addEventListener('mouseenter', function() {
            this.style.transition = 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
            // Add subtle glow pulse
            this.style.filter = 'brightness(1.1)';
        });
        element.addEventListener('mouseleave', function() {
            this.style.transition = 'all 0.3s ease';
            this.style.filter = 'brightness(1)';
        });
    });

    // 3D Tilt Effect for Project Cards (only for non-touch devices)
    const projectCards = document.querySelectorAll('.project-card');

    if (!prefersReducedMotion && !isTouchDevice) {
        projectCards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transition = 'transform 0.1s ease-out';
            });

            card.addEventListener('mousemove', function(e) {
                const rect = this.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                const rotateX = (y - centerY) / 10;
                const rotateY = (centerX - x) / 10;

                this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px) scale(1.02)`;
            });

            card.addEventListener('mouseleave', function() {
                this.style.transition = 'transform 0.5s ease-out';
                this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0) scale(1)';
            });
        });
    }

    // Staggered Entrance Animations for Project Cards
    const projectsSection = document.querySelector('.projects-section');
    if (projectsSection) {
        const projectCardsObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting && !prefersReducedMotion) {
                    const card = entry.target;
                    const delay = index * 0.15; // Stagger delay
                    
                    // Determine animation direction based on index
                    const direction = index % 2 === 0 ? 'left' : 'right';
                    
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0) translateX(0) scale(1)';
                        card.classList.add('card-visible');
                    }, delay * 1000);
                    
                    projectCardsObserver.unobserve(card);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        });

        projectCards.forEach((card, index) => {
            // Set initial state for animation
            card.style.opacity = '0';
            const direction = index % 2 === 0 ? '-100px' : '100px';
            card.style.transform = `translateY(50px) translateX(${direction}) scale(0.9)`;
            card.style.transition = 'opacity 0.6s cubic-bezier(0.645, 0.045, 0.355, 1), transform 0.6s cubic-bezier(0.645, 0.045, 0.355, 1)';
            
            projectCardsObserver.observe(card);
        });
    }

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

    // Form validation and submission handling
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        const formInputs = contactForm.querySelectorAll('input, textarea');
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.innerHTML;

        // Real-time validation
        formInputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });

            input.addEventListener('input', function() {
                if (this.classList.contains('error')) {
                    validateField(this);
                }
            });
        });

        function validateField(field) {
            const value = field.value.trim();
            let isValid = true;
            let errorMessage = '';

            // Remove previous error
            field.classList.remove('error');
            const existingError = field.parentElement.querySelector('.error-message');
            if (existingError) {
                existingError.remove();
            }

            // Validation rules
            if (field.hasAttribute('required') && !value) {
                isValid = false;
                errorMessage = 'This field is required';
            } else if (field.type === 'email' && value) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    isValid = false;
                    errorMessage = 'Please enter a valid email address';
                }
            } else if (field.type === 'text' && field.id === 'name' && value) {
                if (value.length < 2) {
                    isValid = false;
                    errorMessage = 'Name must be at least 2 characters';
                }
            } else if (field.tagName === 'TEXTAREA' && value) {
                if (value.length < 10) {
                    isValid = false;
                    errorMessage = 'Message must be at least 10 characters';
                }
            }

            if (!isValid) {
                field.classList.add('error');
                const errorDiv = document.createElement('div');
                errorDiv.className = 'error-message';
                errorDiv.textContent = errorMessage;
                field.parentElement.appendChild(errorDiv);
            }

            return isValid;
        }

        // Form submission
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            // Validate all fields
            let isFormValid = true;
            formInputs.forEach(input => {
                if (!validateField(input)) {
                    isFormValid = false;
                }
            });

            if (!isFormValid) {
                showFormMessage('Please fix the errors above', 'error');
                return;
            }

            // Show loading state
            submitButton.disabled = true;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitButton.classList.add('loading');

            try {
                const formData = new FormData(contactForm);
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    showFormMessage('Message sent successfully! I\'ll get back to you soon.', 'success');
                    contactForm.reset();
                    formInputs.forEach(input => {
                        input.classList.remove('error');
                        const errorMsg = input.parentElement.querySelector('.error-message');
                        if (errorMsg) errorMsg.remove();
                    });
                } else {
                    throw new Error('Form submission failed');
                }
            } catch (error) {
                showFormMessage('Failed to send message. Please try again or email me directly.', 'error');
            } finally {
                submitButton.disabled = false;
                submitButton.innerHTML = originalButtonText;
                submitButton.classList.remove('loading');
            }
        });

        function showFormMessage(message, type) {
            // Remove existing message
            const existingMessage = contactForm.querySelector('.form-message');
            if (existingMessage) {
                existingMessage.remove();
            }

            const messageDiv = document.createElement('div');
            messageDiv.className = `form-message ${type}`;
            messageDiv.textContent = message;
            contactForm.insertBefore(messageDiv, submitButton);

            // Auto-remove after 5 seconds
            setTimeout(() => {
                messageDiv.remove();
            }, 5000);
        }
    }

    // Back to top button
    const backToTopButton = document.createElement('button');
    backToTopButton.className = 'back-to-top';
    backToTopButton.setAttribute('aria-label', 'Back to top');
    backToTopButton.innerHTML = '<i class="fas fa-arrow-up"></i>';
    document.body.appendChild(backToTopButton);

    function toggleBackToTop() {
        if (window.scrollY > 300) {
            backToTopButton.classList.add('show');
        } else {
            backToTopButton.classList.remove('show');
        }
    }

    window.addEventListener('scroll', toggleBackToTop, { passive: true });
    toggleBackToTop();

    backToTopButton.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Smooth scroll with offset for fixed navbar
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = target.offsetTop - navbarHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Lazy load images
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        img.classList.add('loaded');
                    }
                    observer.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }

});
