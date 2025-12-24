document.addEventListener('DOMContentLoaded', function() {
    // Initialize floating icons in orbit
    initOrbitingIcons();
    
    // Add hover effect to hero title
    const heroTitle = document.getElementById('hero-title');
    if (heroTitle) {
        heroTitle.addEventListener('mousemove', (e) => {
            const { left, top, width, height } = heroTitle.getBoundingClientRect();
            const x = (e.clientX - left) / width - 0.5;
            const y = (e.clientY - top) / height - 0.5;
            
            heroTitle.style.transform = `perspective(1000px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg)`;
            heroTitle.style.textShadow = `
                ${x * 10}px ${y * 10}px 10px rgba(8, 247, 254, 0.5),
                ${-x * 10}px ${-y * 10}px 10px rgba(254, 83, 187, 0.5)
            `;
        });

        heroTitle.addEventListener('mouseleave', () => {
            heroTitle.style.transform = 'perspective(1000px) rotateY(0) rotateX(0)';
            heroTitle.style.textShadow = '0 0 20px rgba(8, 247, 254, 0.8)';
        });
    }

    // Add random RGB glitch effect
    setInterval(triggerRGBGlitch, 5000);
});

function initOrbitingIcons() {
    const iconsContainer = document.getElementById('floating-icons-3d');
    if (!iconsContainer) return;

    // Tech stack icons with their respective colors
    const icons = [
        { icon: 'fa-html5', color: '#E34F26' },
        { icon: 'fa-css3-alt', color: '#1572B6' },
        { icon: 'fa-js-square', color: '#F7DF1E' },
        { icon: 'fa-react', color: '#61DAFB' },
        { icon: 'fa-node-js', color: '#339933' },
        { icon: 'fa-python', color: '#3776AB' },
        { icon: 'fa-git-alt', color: '#F05032' },
        { icon: 'fa-database', color: '#336791' },
        { icon: 'fa-terminal', color: '#4CAF50' },
        { icon: 'fa-server', color: '#9C27B0' }
    ];
    
    // Circular layout configuration
    const centerX = 50;  // Center X of the circle (percentage of container)
    const centerY = 50;  // Center Y of the circle (percentage of container)
    const radius = 50;    // Slightly larger radius for the circle
    const angleStep = (2 * Math.PI) / icons.length;  // Angle between each icon
    const baseSize = 48;  // Increased base size for icons
    const sizeVariation = 8; // Slightly more size variation

    // Clear and set up container
    iconsContainer.innerHTML = '';
    iconsContainer.style.position = 'relative';
    iconsContainer.style.width = '100%';
    iconsContainer.style.height = '100%';

    // Create container for the circular cluster
    const clusterContainer = document.createElement('div');
    clusterContainer.className = 'tech-cluster';
    clusterContainer.style.position = 'absolute';
    clusterContainer.style.top = '50%';
    clusterContainer.style.left = '50%';
    clusterContainer.style.transform = 'translate(-50%, -50%)';
    clusterContainer.style.width = '100%';
    clusterContainer.style.height = '100%';
    clusterContainer.style.pointerEvents = 'none';
    iconsContainer.appendChild(clusterContainer);

    // Create icons in a perfect circle
    icons.forEach((iconData, index) => {
        const icon = document.createElement('div');
        icon.className = 'floating-icon';
        icon.innerHTML = `<i class="fab ${iconData.icon}"></i>`;
        icon.style.color = iconData.color;
        
        // Calculate position in circle
        const angle = index * angleStep;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;
        const size = baseSize + (Math.random() * sizeVariation * 2 - sizeVariation);
        
        // Position icon
        icon.style.position = 'absolute';
        icon.style.left = `${x}%`;
        icon.style.top = `${y}%`;
        icon.style.transform = 'translate(-50%, -50%)';
        icon.style.width = `${size}px`;
        icon.style.height = `${size}px`;
        icon.style.transition = 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        
        // Add slight rotation for more natural look
        const rotation = (Math.random() * 20) - 10; // -10 to 10 degrees
        icon.style.transform = `translate(-50%, -50%) rotate(${rotation}deg)`;
        
        // Add hover effect
        icon.addEventListener('mouseenter', () => {
            icon.style.transform = `translate(-50%, -50%) translateY(-8px) scale(1.3) rotate(${rotation}deg)`;
            icon.style.boxShadow = `0 10px 30px ${iconData.color}80`;
            icon.style.zIndex = '10';
        });
        
        icon.addEventListener('mouseleave', () => {
            icon.style.transform = `translate(-50%, -50%) rotate(${rotation}deg)`;
            icon.style.boxShadow = '';
            icon.style.zIndex = '1';
        });
        
        clusterContainer.appendChild(icon);
        const duration = 3 + Math.random() * 2; // 3-5s for floating animation
        const delay = Math.random() * 2; // 0-2s delay
        icon.style.animation = `float ${duration}s ease-in-out ${delay}s infinite`;
    });

    // Add keyframes for floating animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes float {
            0%, 100% { transform: translateY(0) rotate(0deg); }
            50% { transform: translateY(-10px) rotate(2deg); }
        }
        
        .floating-icon {
            display: flex;
            align-items: center;
            justify-content: center;
            background: rgba(10, 15, 25, 0.7);
            backdrop-filter: blur(5px);
            border-radius: 50%;
            border: 1px solid rgba(8, 247, 254, 0.2);
            box-shadow: 0 0 15px rgba(8, 247, 254, 0.1);
            transform-origin: center center;
            will-change: transform;
            transition: all 0.3s ease;
        }
        
        .floating-icon i {
            font-size: 1.1em;  // Increased icon size
        }
    `;
    document.head.appendChild(style);

    iconsContainer.appendChild(clusterContainer);
}

function triggerRGBGlitch() {
    const glitch = document.querySelector('.rgb-glitch');
    if (!glitch) return;
    
    // Random glitch effect
    glitch.style.opacity = '0.2';
    glitch.style.transform = `translate(${Math.random() * 10 - 5}px, ${Math.random() * 10 - 5}px)`;
    glitch.style.filter = `hue-rotate(${Math.random() * 360}deg)`;
    
    // Reset after a short delay
    setTimeout(() => {
        glitch.style.opacity = '0.1';
        glitch.style.transform = 'translate(0, 0)';
        glitch.style.filter = 'hue-rotate(0deg)';
    }, 100);
}

// Handle window resize
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        initFloatingIcons();
    }, 250);
});
