document.addEventListener('DOMContentLoaded', function() {
    // Initialize GSAP ScrollTrigger
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
        
        // Project card animations
        const projectCards = gsap.utils.toArray('.project-card');
        
        projectCards.forEach((card, index) => {
            // Add data attributes for animation
            card.setAttribute('data-animate', 'true');
            
            // Set up the initial state
            gsap.set(card, {
                y: 60,
                opacity: 0,
                rotationX: 5,
                transformPerspective: 1000,
                transformOrigin: 'center center'
            });
            
            // Create the animation
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: card,
                    start: 'top bottom-=100',
                    toggleActions: 'play none none none',
                    once: true
                },
                defaults: { 
                    duration: 0.8, 
                    ease: 'power3.out',
                    stagger: 0.1 
                }
            });
            
            // Animate the card in
            tl.to(card, {
                y: 0,
                opacity: 1,
                rotationX: 0,
                delay: index * 0.1
            });
            
            // Add hover effects
            card.addEventListener('mouseenter', () => {
                gsap.to(card, {
                    y: -10,
                    scale: 1.02,
                    duration: 0.5,
                    ease: 'power2.out'
                });
                
                // Animate in tech stack icons with staggered delay
                const techIcons = card.querySelectorAll('.tech-icon');
                gsap.to(techIcons, {
                    opacity: 1,
                    scale: 1,
                    duration: 0.3,
                    stagger: 0.05,
                    ease: 'back.out(1.7)'
                });
            });
            
            card.addEventListener('mouseleave', () => {
                gsap.to(card, {
                    y: 0,
                    scale: 1,
                    duration: 0.5,
                    ease: 'power2.out'
                });
                
                // Reset tech stack icons
                const techIcons = card.querySelectorAll('.tech-icon');
                gsap.to(techIcons, {
                    opacity: 0,
                    scale: 0.8,
                    duration: 0.2,
                    stagger: 0.02
                });
            });
        });
        
        // Magnetic button effect
        const buttons = document.querySelectorAll('.project-btn');
        
        buttons.forEach(button => {
            button.addEventListener('mousemove', (e) => {
                const rect = button.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const deltaX = (x - centerX) / 10;
                const deltaY = (y - centerY) / 10;
                
                gsap.to(button, {
                    x: deltaX,
                    y: deltaY,
                    duration: 0.5,
                    ease: 'power2.out'
                });
                
                // Add cursor glow effect
                const glow = document.querySelector('.cursor-glow') || createCursorGlow();
                gsap.to(glow, {
                    left: e.clientX,
                    top: e.clientY,
                    opacity: 1,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            });
            
            button.addEventListener('mouseleave', () => {
                gsap.to(button, {
                    x: 0,
                    y: 0,
                    duration: 0.5,
                    ease: 'elastic.out(1, 0.5)'
                });
                
                // Hide cursor glow
                const glow = document.querySelector('.cursor-glow');
                if (glow) {
                    gsap.to(glow, {
                        opacity: 0,
                        duration: 0.3
                    });
                }
            });
        });
        
        // Parallax effect for project images
        const projectImages = document.querySelectorAll('.project-image');
        
        projectImages.forEach(image => {
            const img = image.querySelector('img');
            
            image.addEventListener('mousemove', (e) => {
                const rect = image.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const deltaX = (x - centerX) / 20;
                const deltaY = (y - centerY) / 20;
                
                gsap.to(img, {
                    x: deltaX,
                    y: deltaY,
                    duration: 0.8,
                    ease: 'power2.out'
                });
            });
            
            image.addEventListener('mouseleave', () => {
                gsap.to(img, {
                    x: 0,
                    y: 0,
                    duration: 0.8,
                    ease: 'elastic.out(1, 0.5)'
                });
            });
        });
    }
});

// Create cursor glow element
function createCursorGlow() {
    const glow = document.createElement('div');
    glow.className = 'cursor-glow';
    document.body.appendChild(glow);
    return glow;
}

// Initialize cursor glow on page load
if (!document.querySelector('.cursor-glow')) {
    createCursorGlow();
}

// Handle reduced motion preference
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (prefersReducedMotion) {
    // Disable animations for users who prefer reduced motion
    document.documentElement.classList.add('reduced-motion');
    
    // Remove cursor glow
    const glow = document.querySelector('.cursor-glow');
    if (glow) {
        glow.style.display = 'none';
    }
}
