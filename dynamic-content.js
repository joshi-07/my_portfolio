/**
 * Dynamic Content Flow System
 * Handles smooth scroll-based transitions between portfolio sections
 * Enhances the flowing content experience without robot distractions
 */

class DynamicContentFlow {
    constructor() {
        this.sections = [];
        this.currentSection = 'home';
        this.isTransitioning = false;
        this.scrollDirection = 'down';
        this.lastScrollY = 0;
        this.parallaxElements = [];

        // Performance optimization
        this.ticking = false;
        this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        // Touch/swipe detection for mobile
        this.touchStartY = 0;
        this.touchEndY = 0;
        this.isTouchDevice = 'ontouchstart' in window;

        // Initialize system
        this.init();
    }

    init() {
        this.setupSections();
        this.setupIntersectionObserver();
        this.setupScrollHandler();
        this.setupKeyboardNavigation();
        this.setupTouchGestures();
        this.setupProgressIndicator();
        this.setupParallaxEffects();
        this.startAnimationLoop();
    }

    setupSections() {
        // Get all portfolio sections
        const sectionElements = document.querySelectorAll('.portfolio-section, .home-section');

        sectionElements.forEach(section => {
            const sectionData = {
                element: section,
                id: section.id,
                isVisible: false,
                progress: 0,
                animatedElements: []
            };

            // Prepare animated elements within section
            this.prepareAnimatedElements(sectionData);

            this.sections.push(sectionData);
        });
    }

    prepareAnimatedElements(sectionData) {
        const selectors = [
            '.section-header',
            '.timeline-item',
            '.skill-category',
            '.project-card',
            '.contact-method',
            '.about-text',
            '.stats-recap-content',
            '.form-group'
        ];

        selectors.forEach(selector => {
            const elements = sectionData.element.querySelectorAll(selector);
            elements.forEach((element, index) => {
                sectionData.animatedElements.push({
                    element: element,
                    index: index,
                    animated: false,
                    delay: index * 0.1
                });
            });
        });
    }

    setupIntersectionObserver() {
        const observerOptions = {
            threshold: [0, 0.1, 0.5, 1],
            rootMargin: '-50px 0px -50px 0px'
        };

        this.sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const sectionData = this.sections.find(s => s.element === entry.target);
                if (sectionData) {
                    sectionData.isVisible = entry.isIntersecting;
                    sectionData.progress = entry.intersectionRatio;

                    if (entry.isIntersecting) {
                        this.onSectionEnter(sectionData);
                    } else {
                        this.onSectionLeave(sectionData);
                    }
                }
            });
        }, observerOptions);

        // Observe all sections
        this.sections.forEach(sectionData => {
            this.sectionObserver.observe(sectionData.element);
        });
    }

    onSectionEnter(sectionData) {
        // Add visible class for CSS transitions
        sectionData.element.classList.add('visible');

        // Update current section
        this.currentSection = sectionData.id;

        // Animate elements within section
        if (!this.prefersReducedMotion) {
            this.animateSectionElements(sectionData);
        }

        // Update progress indicator
        this.updateProgressIndicator(sectionData.id);

        // Update active navigation
        this.updateActiveNavigation(sectionData.id);

        // Emit custom event
        this.emitSectionEvent('sectionEnter', sectionData.id);
    }

    onSectionLeave(sectionData) {
        sectionData.element.classList.remove('visible');
        this.emitSectionEvent('sectionLeave', sectionData.id);
    }

    animateSectionElements(sectionData) {
        sectionData.animatedElements.forEach((item, index) => {
            if (!item.animated) {
                const delay = item.delay * 1000; // Convert to milliseconds

                setTimeout(() => {
                    item.element.style.opacity = '1';
                    item.element.style.transform = 'translateY(0) translateX(0)';
                    item.element.classList.add('animated');
                    item.animated = true;
                }, delay);
            }
        });
    }

    setupScrollHandler() {
        let lastScrollY = window.scrollY;
        let scrollTimeout;

        window.addEventListener('scroll', () => {
            // Determine scroll direction
            const currentScrollY = window.scrollY;
            this.scrollDirection = currentScrollY > lastScrollY ? 'down' : 'up';
            lastScrollY = currentScrollY;

            // Throttle scroll events
            if (!this.ticking) {
                requestAnimationFrame(() => {
                    this.handleScroll();
                    this.ticking = false;
                });
                this.ticking = true;
            }

            // Debounced scroll end detection
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                this.handleScrollEnd();
            }, 150);
        }, { passive: true });
    }

    handleScroll() {
        // Update parallax effects
        if (!this.prefersReducedMotion) {
            this.updateParallaxEffects();
        }

        // Update scroll progress
        this.updateScrollProgress();

        // Handle scroll-based transitions
        this.handleScrollTransitions();
    }

    handleScrollEnd() {
        this.emitSectionEvent('scrollEnd', this.currentSection);
    }

    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            // Skip if user is typing in a form
            const activeElement = document.activeElement;
            if (activeElement && (
                activeElement.tagName === 'INPUT' ||
                activeElement.tagName === 'TEXTAREA' ||
                activeElement.contentEditable === 'true'
            )) {
                return;
            }

            switch(e.key) {
                case 'ArrowDown':
                case 'PageDown':
                case ' ':
                    e.preventDefault();
                    this.navigateToNextSection();
                    break;
                case 'ArrowUp':
                case 'PageUp':
                    e.preventDefault();
                    this.navigateToPreviousSection();
                    break;
                case 'Home':
                    e.preventDefault();
                    this.navigateToSection('home');
                    break;
                case 'End':
                    e.preventDefault();
                    this.navigateToSection(this.sections[this.sections.length - 1].id);
                    break;
            }
        });
    }

    setupTouchGestures() {
        if (!this.isTouchDevice) return;

        let touchStartY = 0;
        let touchEndY = 0;
        let touchStartTime = 0;

        document.addEventListener('touchstart', (e) => {
            touchStartY = e.touches[0].clientY;
            touchStartTime = Date.now();
        }, { passive: true });

        document.addEventListener('touchend', (e) => {
            touchEndY = e.changedTouches[0].clientY;
            const touchDuration = Date.now() - touchStartTime;
            const touchDistance = Math.abs(touchEndY - touchStartY);

            // Detect swipe gesture
            if (touchDuration < 500 && touchDistance > 50) {
                if (touchEndY < touchStartY) {
                    // Swipe up - next section
                    this.navigateToNextSection();
                } else {
                    // Swipe down - previous section
                    this.navigateToPreviousSection();
                }
            }
        }, { passive: true });
    }

    setupProgressIndicator() {
        // Create or enhance existing progress indicator
        let progressContainer = document.querySelector('.progress-container');

        if (!progressContainer) {
            progressContainer = document.createElement('div');
            progressContainer.className = 'progress-container';
            progressContainer.innerHTML = `
                <div class="progress-bar">
                    <div class="progress-fill"></div>
                </div>
                <div class="progress-dots">
                    ${this.sections.map(section =>
                        `<span class="progress-dot" data-section="${section.id}"></span>`
                    ).join('')}
                </div>
            `;
            document.body.appendChild(progressContainer);
        }

        this.progressFill = progressContainer.querySelector('.progress-fill');
        this.progressDots = progressContainer.querySelectorAll('.progress-dot');

        // Add click handlers to dots
        this.progressDots.forEach(dot => {
            dot.addEventListener('click', () => {
                const sectionId = dot.dataset.section;
                this.navigateToSection(sectionId);
            });
        });
    }

    setupParallaxEffects() {
        // Find elements that should have parallax effects
        const parallaxSelectors = [
            '.section-background-animation .bubble',
            '.floating-icon',
            '.shape',
            '.parallax-element'
        ];

        parallaxSelectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                this.parallaxElements.push({
                    element: element,
                    speed: Math.random() * 0.5 + 0.1,
                    direction: Math.random() > 0.5 ? 1 : -1
                });
            });
        });
    }

    updateParallaxEffects() {
        const scrolled = window.scrollY;

        this.parallaxElements.forEach(item => {
            const speed = item.speed * item.direction;
            const yPos = -(scrolled * speed);
            const xPos = Math.sin(scrolled * 0.001) * 20;

            item.element.style.transform = `translateY(${yPos}px) translateX(${xPos}px)`;
        });
    }

    updateScrollProgress() {
        if (!this.progressFill) return;

        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;

        this.progressFill.style.width = scrollPercent + '%';
    }

    updateProgressIndicator(sectionId) {
        if (!this.progressDots) return;

        this.progressDots.forEach(dot => {
            dot.classList.toggle('active', dot.dataset.section === sectionId);
        });
    }

    updateActiveNavigation(sectionId) {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${sectionId}`);
        });
    }

    handleScrollTransitions() {
        // Handle section transitions based on scroll position
        this.sections.forEach(sectionData => {
            const rect = sectionData.element.getBoundingClientRect();
            const viewportHeight = window.innerHeight;

            // Calculate how much of the section is visible
            const visibleHeight = Math.max(0, Math.min(rect.bottom, viewportHeight) - Math.max(rect.top, 0));
            const visiblePercent = visibleHeight / rect.height;

            // Apply scroll-based effects
            if (visiblePercent > 0 && visiblePercent < 1) {
                this.applyScrollEffect(sectionData, visiblePercent);
            }
        });
    }

    applyScrollEffect(sectionData, visiblePercent) {
        // Apply subtle transformations based on scroll progress
        const element = sectionData.element;
        const yOffset = (1 - visiblePercent) * 50;
        const opacity = Math.max(0.3, visiblePercent);

        element.style.transform = `translateY(${yOffset}px)`;
        element.style.opacity = opacity;
    }

    navigateToSection(sectionId) {
        if (this.isTransitioning) return;

        const targetSection = this.sections.find(s => s.id === sectionId);
        if (!targetSection) return;

        this.isTransitioning = true;

        // Calculate offset for fixed navbar
        const navbar = document.querySelector('.navbar');
        const navbarHeight = navbar ? navbar.offsetHeight : 80;
        const targetPosition = targetSection.element.offsetTop - navbarHeight - 20;

        // Smooth scroll with easing
        this.smoothScrollTo(targetPosition, () => {
            this.isTransitioning = false;
            this.emitSectionEvent('navigationComplete', sectionId);
        });
    }

    navigateToNextSection() {
        const currentIndex = this.sections.findIndex(s => s.id === this.currentSection);
        const nextIndex = (currentIndex + 1) % this.sections.length;
        this.navigateToSection(this.sections[nextIndex].id);
    }

    navigateToPreviousSection() {
        const currentIndex = this.sections.findIndex(s => s.id === this.currentSection);
        const prevIndex = currentIndex > 0 ? currentIndex - 1 : this.sections.length - 1;
        this.navigateToSection(this.sections[prevIndex].id);
    }

    smoothScrollTo(targetY, callback) {
        const startY = window.pageYOffset;
        const distance = targetY - startY;
        const duration = Math.abs(distance) * 0.5; // 0.5ms per pixel
        const startTime = performance.now();

        const animateScroll = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function (easeInOutCubic)
            const easeProgress = progress < 0.5
                ? 4 * progress * progress * progress
                : 1 - Math.pow(-2 * progress + 2, 3) / 2;

            const currentY = startY + (distance * easeProgress);
            window.scrollTo(0, currentY);

            if (progress < 1) {
                requestAnimationFrame(animateScroll);
            } else if (callback) {
                callback();
            }
        };

        requestAnimationFrame(animateScroll);
    }

    startAnimationLoop() {
        const animate = () => {
            // Update any continuous animations
            this.updateContinuousAnimations();
            requestAnimationFrame(animate);
        };
        animate();
    }

    updateContinuousAnimations() {
        if (this.prefersReducedMotion) return;

        // Subtle floating animations for visible sections
        const time = Date.now() * 0.001;

        this.sections.forEach(sectionData => {
            if (sectionData.isVisible) {
                const floatingElements = sectionData.element.querySelectorAll('.floating-icon, .shape');
                floatingElements.forEach((element, index) => {
                    const floatY = Math.sin(time + index) * 10;
                    const floatX = Math.cos(time + index) * 5;
                    element.style.transform = `translateY(${floatY}px) translateX(${floatX}px)`;
                });
            }
        });
    }

    emitSectionEvent(eventType, sectionId) {
        const event = new CustomEvent('contentFlow', {
            detail: {
                type: eventType,
                sectionId: sectionId,
                currentSection: this.currentSection,
                scrollDirection: this.scrollDirection
            }
        });
        document.dispatchEvent(event);
    }

    // Public API methods
    getCurrentSection() {
        return this.currentSection;
    }

    getSectionProgress(sectionId) {
        const section = this.sections.find(s => s.id === sectionId);
        return section ? section.progress : 0;
    }

    isSectionVisible(sectionId) {
        const section = this.sections.find(s => s.id === sectionId);
        return section ? section.isVisible : false;
    }

    refresh() {
        // Recalculate sections and elements
        this.sections = [];
        this.setupSections();
    }

    destroy() {
        // Clean up event listeners and observers
        if (this.sectionObserver) {
            this.sectionObserver.disconnect();
        }

        // Remove custom event listeners
        document.removeEventListener('keydown', this.handleKeyDown);

        // Clean up progress indicator if created
        const progressContainer = document.querySelector('.progress-container');
        if (progressContainer && progressContainer.dataset.dynamic === 'true') {
            progressContainer.remove();
        }
    }
}

// Initialize dynamic content flow system
let dynamicContentFlow = null;

document.addEventListener('DOMContentLoaded', function() {
    // Only initialize on pages with portfolio sections
    if (document.querySelector('.portfolio-section, .home-section')) {
        dynamicContentFlow = new DynamicContentFlow();

        // Expose to global scope for debugging
        window.dynamicContentFlow = dynamicContentFlow;

        // Listen for custom events
        document.addEventListener('contentFlow', function(e) {
            console.log('Content Flow Event:', e.detail);
        });
    }
});

// Clean up on page unload
window.addEventListener('beforeunload', function() {
    if (dynamicContentFlow) {
        dynamicContentFlow.destroy();
    }
});