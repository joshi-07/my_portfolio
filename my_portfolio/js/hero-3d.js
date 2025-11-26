// Hero 3D starfield background using Three.js
// Standalone initializer attached to window, no modules.

(function () {
    function initHeroStarfield() {
        if (!window.THREE) return;

        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) return;

        const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

        const heroCanvas = document.getElementById('hero-canvas');
        if (!heroCanvas) return;

        const heroSection = document.querySelector('.hero-section');
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ canvas: heroCanvas, antialias: true, alpha: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.8));

        function resizeRenderer() {
            const width = heroCanvas.clientWidth || window.innerWidth;
            const height = heroCanvas.clientHeight || window.innerHeight;
            renderer.setSize(width, height, false);
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
        }

        resizeRenderer();
        window.addEventListener('resize', resizeRenderer);

        camera.position.z = 60;

        const starGeometry = new THREE.BufferGeometry();
        const starCount = 800;
        const positions = new Float32Array(starCount * 3);

        for (let i = 0; i < starCount * 3; i += 3) {
            positions[i] = (Math.random() - 0.5) * 200;
            positions[i + 1] = (Math.random() - 0.5) * 120;
            positions[i + 2] = -Math.random() * 200;
        }

        starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

        const starMaterial = new THREE.PointsMaterial({
            color: 0x08f7fe,
            size: 0.38,
            transparent: true,
            opacity: 0.7,
            sizeAttenuation: true,
        });

        // Expose for other scripts (e.g., project-card hover highlights)
        window.heroStarMaterial = starMaterial;

        const stars = new THREE.Points(starGeometry, starMaterial);
        scene.add(stars);

        let scrollFactor = 0;
        function updateHeroScrollFactor() {
            if (!heroSection) return;
            const rect = heroSection.getBoundingClientRect();
            const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
            const visible = Math.min(Math.max((viewportHeight - rect.top) / (rect.height + viewportHeight), 0), 1);
            scrollFactor = visible;
        }

        updateHeroScrollFactor();
        window.addEventListener('scroll', updateHeroScrollFactor, { passive: true });

        let targetCamX = 0;
        let targetCamY = 0;
        if (!isTouchDevice) {
            window.addEventListener('mousemove', (e) => {
                const xNorm = e.clientX / window.innerWidth - 0.5;
                const yNorm = e.clientY / window.innerHeight - 0.5;
                const maxOffset = 5;
                targetCamX = xNorm * maxOffset;
                targetCamY = -yNorm * maxOffset;
            });
        }

        let animationFrameId;
        const animate = () => {
            stars.rotation.y += 0.00045;
            stars.rotation.x += 0.0002;

            const maxZRotation = Math.PI / 18;
            stars.rotation.z = scrollFactor * maxZRotation;

            const baseOpacity = 0.45;
            const maxExtraOpacity = 0.18;
            const targetOpacity = baseOpacity + scrollFactor * maxExtraOpacity;
            starMaterial.opacity += (targetOpacity - starMaterial.opacity) * 0.025;

            camera.position.x += (targetCamX - camera.position.x) * 0.02;
            camera.position.y += (targetCamY - camera.position.y) * 0.02;
            camera.lookAt(0, 0, 0);

            renderer.render(scene, camera);
            animationFrameId = requestAnimationFrame(animate);
        };
        animate();

        window.addEventListener('beforeunload', () => {
            cancelAnimationFrame(animationFrameId);
            starGeometry.dispose();
            starMaterial.dispose();
            renderer.dispose();
        });
    }

    window.initHeroStarfield = initHeroStarfield;
})();

