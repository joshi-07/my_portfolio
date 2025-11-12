/**
 * AI-7 Robot Companion System
 * A futuristic 3D robot companion that interacts with users on the home page
 * Features cursor tracking, device tilt detection, and playful animations
 */

class RobotCompanion {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            console.error('Robot companion container not found');
            return;
        }

        this.isVisible = true;
        this.isEnabled = true;
        this.isScrollingPastHome = false;

        // Robot properties
        this.robot = {
            head: { x: 0, y: 0, targetX: 0, targetY: 0 },
            body: { y: 0, targetY: 0 },
            eyes: { blink: false, left: 0, right: 0 },
            state: 'idle', // idle, excited, curious, greeting, sleeping
            scale: 1,
            opacity: 1
        };

        // Animation properties
        this.animations = {
            idle: { time: 0, bounce: 0, tilt: 0 },
            particles: [],
            lastBlink: 0,
            lastInteraction: Date.now()
        };

        // Device detection
        this.isMobile = this.detectMobile();
        this.isTouchDevice = 'ontouchstart' in window;
        this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        // Initialize system
        this.init();
    }

    detectMobile() {
        return window.innerWidth <= 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    init() {
        if (!this.container || this.prefersReducedMotion) return;

        this.createRobotStructure();
        this.createParticleSystem();
        this.setupEventListeners();
        this.startAnimationLoop();
        this.startIdleAnimations();

        // Initial greeting animation
        setTimeout(() => this.greet(), 1000);
    }

    createRobotStructure() {
        // Create robot DOM structure
        this.container.innerHTML = `
            <div class="robot-wrapper" data-robot-state="idle">
                <div class="robot-body">
                    <div class="robot-torso">
                        <div class="robot-chest">
                            <div class="chest-panel"></div>
                            <div class="chest-light"></div>
                        </div>
                        <div class="robot-hips"></div>
                    </div>
                    <div class="robot-head">
                        <div class="robot-eyes">
                            <div class="eye eye-left">
                                <div class="eye-glow"></div>
                                <div class="eye-pupil"></div>
                            </div>
                            <div class="eye eye-right">
                                <div class="eye-glow"></div>
                                <div class="eye-pupil"></div>
                            </div>
                        </div>
                        <div class="robot-antenna">
                            <div class="antenna-tip"></div>
                        </div>
                        <div class="robot-mouth"></div>
                    </div>
                    <div class="robot-arms">
                        <div class="arm arm-left">
                            <div class="arm-segment upper"></div>
                            <div class="arm-segment lower"></div>
                            <div class="hand"></div>
                        </div>
                        <div class="arm arm-right">
                            <div class="arm-segment upper"></div>
                            <div class="arm-segment lower"></div>
                            <div class="hand"></div>
                        </div>
                    </div>
                </div>
                <div class="robot-shadow"></div>
                <div class="particle-field" id="particle-field"></div>
            </div>
        `;

        // Cache DOM elements
        this.robotElement = this.container.querySelector('.robot-wrapper');
        this.headElement = this.container.querySelector('.robot-head');
        this.eyesElement = this.container.querySelector('.robot-eyes');
        this.leftEye = this.container.querySelector('.eye-left');
        this.rightEye = this.container.querySelector('.eye-right');
        this.leftPupil = this.container.querySelector('.eye-left .eye-pupil');
        this.rightPupil = this.container.querySelector('.eye-right .eye-pupil');
        this.bodyElement = this.container.querySelector('.robot-body');
        this.particleField = this.container.querySelector('.particle-field');
    }

    createParticleSystem() {
        // Create floating particles around robot
        for (let i = 0; i < 20; i++) {
            this.createParticle();
        }
    }

    createParticle() {
        const particle = document.createElement('div');
        particle.className = 'robot-particle';

        // Random initial position and properties
        const particleData = {
            element: particle,
            x: Math.random() * 200 - 100,
            y: Math.random() * 300 - 150,
            z: Math.random() * 100 - 50,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            vz: (Math.random() - 0.5) * 0.5,
            size: Math.random() * 4 + 2,
            opacity: Math.random() * 0.5 + 0.3,
            hue: Math.random() * 60 + 180 // Cyan to blue range
        };

        particle.style.width = particleData.size + 'px';
        particle.style.height = particleData.size + 'px';
        particle.style.background = `hsl(${particleData.hue}, 100%, 60%)`;
        particle.style.boxShadow = `0 0 ${particleData.size * 2}px hsl(${particleData.hue}, 100%, 60%)`;

        this.particleField.appendChild(particle);
        this.animations.particles.push(particleData);
    }

    setupEventListeners() {
        if (this.isTouchDevice) {
            this.setupTouchEvents();
            this.setupDeviceOrientation();
        } else {
            this.setupCursorTracking();
        }

        // Scroll events for fade out/in
        window.addEventListener('scroll', this.handleScroll.bind(this), { passive: true });

        // Theme change events
        const observer = new MutationObserver(this.handleThemeChange.bind(this));
        observer.observe(document.body, {
            attributes: true,
            attributeFilter: ['class']
        });

        // Hover events for home page interactive elements
        this.setupHomeInteractions();
    }

    setupCursorTracking() {
        let mouseX = 0, mouseY = 0;

        document.addEventListener('mousemove', (e) => {
            if (!this.isVisible || !this.isEnabled || this.isScrollingPastHome) return;

            mouseX = e.clientX;
            mouseY = e.clientY;

            // Calculate robot position relative to viewport
            const robotRect = this.container.getBoundingClientRect();
            const robotCenterX = robotRect.left + robotRect.width / 2;
            const robotCenterY = robotRect.top + robotRect.height / 2;

            // Calculate angle and distance from robot center
            const deltaX = mouseX - robotCenterX;
            const deltaY = mouseY - robotCenterY;
            const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

            if (distance < 200) { // Within interaction radius
                // Calculate head rotation (limited to ±30 degrees)
                const maxRotation = 30;
                this.robot.head.targetX = Math.max(-maxRotation, Math.min(maxRotation, (deltaY / distance) * maxRotation));
                this.robot.head.targetY = Math.max(-maxRotation, Math.min(maxRotation, (deltaX / distance) * maxRotation));

                // Eye tracking
                this.robot.eyes.left = Math.max(-15, Math.min(15, (deltaX / distance) * 15));
                this.robot.eyes.right = Math.max(-15, Math.min(15, (deltaX / distance) * 15));

                // Update state based on distance
                if (distance < 100) {
                    this.setState('excited');
                } else {
                    this.setState('curious');
                }

                this.animations.lastInteraction = Date.now();
            }
        });
    }

    setupTouchEvents() {
        document.addEventListener('touchstart', (e) => {
            if (!this.isVisible || !this.isEnabled || this.isScrollingPastHome) return;

            const touch = e.touches[0];
            const robotRect = this.container.getBoundingClientRect();

            // Check if touch is near robot
            if (touch.clientX >= robotRect.left - 50 &&
                touch.clientX <= robotRect.right + 50 &&
                touch.clientY >= robotRect.top - 50 &&
                touch.clientY <= robotRect.bottom + 50) {

                this.setState('excited');
                this.createTouchEffect(touch.clientX, touch.clientY);
                this.animations.lastInteraction = Date.now();
            }
        });
    }

    setupDeviceOrientation() {
        if (!window.DeviceOrientationEvent) return;

        // Request permission for iOS 13+
        if (typeof DeviceOrientationEvent.requestPermission === 'function') {
            DeviceOrientationEvent.requestPermission()
                .then(response => {
                    if (response === 'granted') {
                        this.enableDeviceOrientation();
                    }
                })
                .catch(console.error);
        } else {
            this.enableDeviceOrientation();
        }
    }

    enableDeviceOrientation() {
        window.addEventListener('deviceorientation', (e) => {
            if (!this.isVisible || !this.isEnabled || this.isScrollingPastHome) return;

            if (e.beta !== null && e.gamma !== null) {
                // Beta: front-back tilt (-180 to 180)
                // Gamma: left-right tilt (-90 to 90)
                this.robot.head.targetX = Math.max(-30, Math.min(30, e.beta * 0.3));
                this.robot.head.targetY = Math.max(-30, Math.min(30, e.gamma * 0.3));

                this.setState('curious');
                this.animations.lastInteraction = Date.now();
            }
        });
    }

    setupHomeInteractions() {
        // Monitor hover over home page elements
        const homeElements = document.querySelectorAll('.hero-content a, .btn, .social-icon');

        homeElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                if (this.isVisible && !this.isScrollingPastHome) {
                    this.setState('excited');
                    this.animations.lastInteraction = Date.now();
                }
            });
        });
    }

    handleScroll() {
        const homeSection = document.getElementById('home');
        if (!homeSection) return;

        const homeRect = homeSection.getBoundingClientRect();
        const scrollThreshold = homeRect.bottom;

        // Check if user has scrolled past home section
        const wasScrollingPast = this.isScrollingPastHome;
        this.isScrollingPastHome = scrollThreshold < 0;

        if (wasScrollingPast !== this.isScrollingPastHome) {
            if (this.isScrollingPastHome) {
                // User scrolled down - fade out robot
                this.farewell();
                this.fadeOut();
            } else {
                // User scrolled back to top - fade in robot
                this.fadeIn();
                setTimeout(() => this.greet(), 500);
            }
        }
    }

    handleThemeChange(mutations) {
        mutations.forEach((mutation) => {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                const isLightMode = document.body.classList.contains('light-mode');
                this.updateRobotTheme(isLightMode);
            }
        });
    }

    updateRobotTheme(isLightMode) {
        if (isLightMode) {
            this.robotElement.classList.add('light-theme');
        } else {
            this.robotElement.classList.remove('light-theme');
        }
    }

    setState(newState) {
        if (this.robot.state === newState) return;

        this.robot.state = newState;
        this.robotElement.setAttribute('data-robot-state', newState);

        // Trigger state-specific animations
        switch (newState) {
            case 'excited':
                this.playExcitedAnimation();
                break;
            case 'curious':
                this.playCuriousAnimation();
                break;
            case 'greeting':
                this.playGreetingAnimation();
                break;
            case 'sleeping':
                this.playSleepingAnimation();
                break;
        }
    }

    playExcitedAnimation() {
        // Quick bouncing motion
        this.bodyElement.style.transition = 'transform 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
        this.bodyElement.style.transform = 'translateY(-10px) scale(1.05)';

        setTimeout(() => {
            this.bodyElement.style.transform = 'translateY(0) scale(1)';
        }, 300);

        // Excited particle burst
        this.createParticleBurst();
    }

    playCuriousAnimation() {
        // Gentle head tilt
        this.headElement.style.transition = 'transform 0.5s ease-out';
        this.headElement.style.transform = `rotateX(${this.robot.head.targetX * 0.5}deg) rotateY(${this.robot.head.targetY * 0.5}deg)`;
    }

    playGreetingAnimation() {
        // Wave arm animation
        const rightArm = this.container.querySelector('.arm-right');
        rightArm.style.transition = 'transform 0.6s ease-in-out';
        rightArm.style.transform = 'rotateZ(-45deg)';

        setTimeout(() => {
            rightArm.style.transform = 'rotateZ(45deg)';
        }, 300);

        setTimeout(() => {
            rightArm.style.transform = 'rotateZ(0deg)';
        }, 600);
    }

    playSleepingAnimation() {
        // Gentle breathing
        this.bodyElement.style.transition = 'transform 2s ease-in-out infinite';
        let breathing = 0;
        const breathe = () => {
            breathing += 0.1;
            const scale = 1 + Math.sin(breathing) * 0.02;
            this.bodyElement.style.transform = `scaleY(${scale})`;
            requestAnimationFrame(breathe);
        };
        breathe();
    }

    createTouchEffect(x, y) {
        const effect = document.createElement('div');
        effect.className = 'touch-effect';
        effect.style.left = x + 'px';
        effect.style.top = y + 'px';
        document.body.appendChild(effect);

        setTimeout(() => effect.remove(), 1000);
    }

    createParticleBurst() {
        const burstCount = 5;
        for (let i = 0; i < burstCount; i++) {
            setTimeout(() => this.createParticle(), i * 50);
        }
    }

    greet() {
        this.setState('greeting');
        setTimeout(() => {
            if (this.robot.state === 'greeting') {
                this.setState('idle');
            }
        }, 2000);
    }

    farewell() {
        this.setState('greeting'); // Use greeting animation for farewell
        setTimeout(() => {
            this.setState('sleeping');
        }, 1500);
    }

    fadeOut() {
        this.robotElement.style.transition = 'opacity 0.8s ease-in-out, transform 0.8s ease-in-out';
        this.robotElement.style.opacity = '0';
        this.robotElement.style.transform = 'translateY(20px) scale(0.9)';
        this.isVisible = false;
    }

    fadeIn() {
        this.robotElement.style.transition = 'opacity 0.8s ease-in-out, transform 0.8s ease-in-out';
        this.robotElement.style.opacity = '1';
        this.robotElement.style.transform = 'translateY(0) scale(1)';
        this.isVisible = true;
        this.setState('idle');
    }

    startIdleAnimations() {
        // Eye blinking
        setInterval(() => {
            if (this.isVisible && !this.isScrollingPastHome) {
                const now = Date.now();
                if (now - this.animations.lastBlink > 3000 + Math.random() * 2000) {
                    this.blink();
                    this.animations.lastBlink = now;
                }
            }
        }, 1000);

        // Random head movements
        setInterval(() => {
            if (this.isVisible && !this.isScrollingPastHome && this.robot.state === 'idle') {
                if (Date.now() - this.animations.lastInteraction > 5000) {
                    this.randomHeadMovement();
                }
            }
        }, 4000);

        // Sleep mode after inactivity
        setInterval(() => {
            if (Date.now() - this.animations.lastInteraction > 30000 && this.robot.state !== 'sleeping') {
                this.setState('sleeping');
            }
        }, 5000);
    }

    blink() {
        this.robot.eyes.blink = true;
        this.leftEye.style.transition = 'transform 0.15s ease-in-out';
        this.rightEye.style.transition = 'transform 0.15s ease-in-out';
        this.leftEye.style.transform = 'scaleY(0.1)';
        this.rightEye.style.transform = 'scaleY(0.1)';

        setTimeout(() => {
            this.leftEye.style.transform = 'scaleY(1)';
            this.rightEye.style.transform = 'scaleY(1)';
            this.robot.eyes.blink = false;
        }, 150);
    }

    randomHeadMovement() {
        const randomX = (Math.random() - 0.5) * 10;
        const randomY = (Math.random() - 0.5) * 10;
        this.robot.head.targetX = randomX;
        this.robot.head.targetY = randomY;

        setTimeout(() => {
            this.robot.head.targetX = 0;
            this.robot.head.targetY = 0;
        }, 2000);
    }

    startAnimationLoop() {
        const animate = () => {
            if (this.isEnabled) {
                this.updateAnimations();
                this.updateParticles();
            }
            requestAnimationFrame(animate);
        };
        animate();
    }

    updateAnimations() {
        if (!this.isVisible || this.isScrollingPastHome) return;

        // Smooth head rotation
        this.robot.head.x += (this.robot.head.targetX - this.robot.head.x) * 0.1;
        this.robot.head.y += (this.robot.head.targetY - this.robot.head.y) * 0.1;

        // Apply head rotation
        this.headElement.style.transition = 'none';
        this.headElement.style.transform = `rotateX(${this.robot.head.x}deg) rotateY(${this.robot.head.y}deg)`;

        // Update eye pupils
        this.leftPupil.style.transform = `translateX(${this.robot.eyes.left}px)`;
        this.rightPupil.style.transform = `translateX(${this.robot.eyes.right}px)`;

        // Idle bouncing
        this.animations.idle.time += 0.02;
        const bounce = Math.sin(this.animations.idle.time) * 5;
        this.bodyElement.style.transform = `translateY(${bounce}px)`;
    }

    updateParticles() {
        this.animations.particles.forEach(particle => {
            // Update particle position
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.z += particle.vz;

            // Add some random movement
            particle.vx += (Math.random() - 0.5) * 0.1;
            particle.vy += (Math.random() - 0.5) * 0.1;

            // Keep particles within bounds
            const maxDistance = 150;
            if (Math.abs(particle.x) > maxDistance) particle.vx *= -0.8;
            if (Math.abs(particle.y) > maxDistance) particle.vy *= -0.8;
            if (Math.abs(particle.z) > maxDistance) particle.vz *= -0.8;

            // Apply position
            particle.element.style.transform = `translate3d(${particle.x}px, ${particle.y}px, ${particle.z}px)`;

            // Pulse opacity
            const pulse = Math.sin(Date.now() * 0.001 + particle.x) * 0.2 + 0.3;
            particle.element.style.opacity = this.isVisible ? pulse : 0;
        });
    }

    // Public methods
    enable() {
        this.isEnabled = true;
        this.robotElement.style.display = 'block';
    }

    disable() {
        this.isEnabled = false;
        this.robotElement.style.display = 'none';
    }

    destroy() {
        this.disable();
        // Clean up event listeners and DOM elements
        if (this.container) {
            this.container.innerHTML = '';
        }
    }
}

// Initialize robot companion when DOM is ready
let robotCompanion = null;

document.addEventListener('DOMContentLoaded', function() {
    // Only initialize on home page and if not reduced motion
    if (window.location.pathname === '/' || window.location.pathname.endsWith('index.html')) {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (!prefersReducedMotion && typeof THREE !== 'undefined') {
            robotCompanion = new RobotCompanion('robot-companion');

            // Expose to global scope for debugging
            window.robotCompanion = robotCompanion;
        }
    }
});

// Clean up on page unload
window.addEventListener('beforeunload', function() {
    if (robotCompanion) {
        robotCompanion.destroy();
    }
});