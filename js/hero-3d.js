// Full-page kinetic 3D backdrop for the refreshed portfolio UI.
(function () {
    let activeScene = null;

    function hasReducedMotion() {
        return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    }

    function initKineticHeroScene() {
        if (activeScene || !window.THREE || hasReducedMotion()) return;

        const canvas = document.getElementById("hero-canvas");
        if (!canvas) return;

        const THREE = window.THREE;
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(58, 1, 0.1, 180);
        const renderer = new THREE.WebGLRenderer({
            canvas,
            alpha: true,
            antialias: true,
            powerPreference: "high-performance"
        });

        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.8));
        camera.position.set(0, 0, 28);

        const root = new THREE.Group();
        const wireGroup = new THREE.Group();
        const ribbonGroup = new THREE.Group();
        scene.add(root);
        root.add(wireGroup, ribbonGroup);

        const palette = [0x55b9b3, 0x77909c, 0xc7a86b, 0x8d98aa, 0x86b99b];

        const particleCount = 1500;
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        const color = new THREE.Color();

        for (let i = 0; i < particleCount; i += 1) {
            const i3 = i * 3;
            positions[i3] = (Math.random() - 0.5) * 86;
            positions[i3 + 1] = (Math.random() - 0.5) * 48;
            positions[i3 + 2] = (Math.random() - 0.5) * 68;

            color.setHex(palette[i % palette.length]);
            colors[i3] = color.r;
            colors[i3 + 1] = color.g;
            colors[i3 + 2] = color.b;
        }

        const particleGeometry = new THREE.BufferGeometry();
        particleGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
        particleGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

        const particleMaterial = new THREE.PointsMaterial({
            size: 0.09,
            vertexColors: true,
            transparent: true,
            opacity: 0.72,
            depthWrite: false,
            blending: THREE.AdditiveBlending
        });

        const particles = new THREE.Points(particleGeometry, particleMaterial);
        root.add(particles);
        window.heroStarMaterial = particleMaterial;

        const gridMaterial = new THREE.LineBasicMaterial({
            color: 0x54eadf,
            transparent: true,
            opacity: 0.14
        });
        const grid = new THREE.GridHelper(70, 32, 0x54eadf, 0x5c5f6c);
        grid.material = gridMaterial;
        grid.position.y = -12;
        grid.rotation.x = Math.PI * 0.04;
        root.add(grid);

        function addWireObject(geometry, materialColor, position, scale, speed) {
            const material = new THREE.MeshBasicMaterial({
                color: materialColor,
                wireframe: true,
                transparent: true,
                opacity: 0.45
            });
            const mesh = new THREE.Mesh(geometry, material);
            mesh.position.set(position[0], position[1], position[2]);
            mesh.scale.setScalar(scale);
            mesh.userData.speed = speed;
            wireGroup.add(mesh);
            return mesh;
        }

        const objects = [
            addWireObject(new THREE.IcosahedronGeometry(2.8, 1), 0x55b9b3, [-14, 6, 0], 1.15, 0.45),
            addWireObject(new THREE.TorusKnotGeometry(2.2, 0.48, 96, 10), 0x77909c, [13, 5, -5], 1.05, 0.3),
            addWireObject(new THREE.OctahedronGeometry(3.4, 1), 0xc7a86b, [11, -7, -1], 0.85, 0.55),
            addWireObject(new THREE.BoxGeometry(4.8, 4.8, 4.8, 5, 5, 5), 0x8d98aa, [-11, -8, -6], 0.82, 0.38)
        ];

        function createRibbon(hex, y, z, phase) {
            const points = [];
            for (let i = -80; i <= 80; i += 1) {
                const x = i * 0.44;
                points.push(new THREE.Vector3(
                    x,
                    y + Math.sin(i * 0.17 + phase) * 1.6,
                    z + Math.cos(i * 0.11 + phase) * 2.4
                ));
            }

            const geometry = new THREE.BufferGeometry().setFromPoints(points);
            const material = new THREE.LineBasicMaterial({
                color: hex,
                transparent: true,
                opacity: 0.36
            });
            const line = new THREE.Line(geometry, material);
            line.userData.phase = phase;
            ribbonGroup.add(line);
            return line;
        }

        const ribbons = [
            createRibbon(0x55b9b3, 7.5, -10, 0),
            createRibbon(0x77909c, 1.5, -17, 2.4),
            createRibbon(0xc7a86b, -5.8, -13, 4.8)
        ];

        const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
        let scrollDepth = 0;
        let frameId = 0;
        const clock = new THREE.Clock();

        function resize() {
            const width = canvas.clientWidth || window.innerWidth || 1;
            const height = canvas.clientHeight || window.innerHeight || 1;
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            renderer.setSize(width, height, false);
        }

        function onMouseMove(event) {
            mouse.tx = (event.clientX / Math.max(window.innerWidth, 1) - 0.5) * 2;
            mouse.ty = (event.clientY / Math.max(window.innerHeight, 1) - 0.5) * 2;
        }

        function onScroll() {
            const doc = document.documentElement;
            const max = Math.max(doc.scrollHeight - window.innerHeight, 1);
            scrollDepth = window.scrollY / max;
        }

        function animate() {
            const t = clock.getElapsedTime();
            mouse.x += (mouse.tx - mouse.x) * 0.045;
            mouse.y += (mouse.ty - mouse.y) * 0.045;

            root.rotation.y = t * 0.025 + mouse.x * 0.08;
            root.rotation.x = -mouse.y * 0.045 + scrollDepth * 0.08;
            particles.rotation.y = t * 0.018;
            particles.rotation.z = Math.sin(t * 0.16) * 0.04;

            grid.position.z = -12 + Math.sin(t * 0.24) * 2;
            grid.rotation.z = Math.sin(t * 0.06) * 0.025;

            objects.forEach((object, index) => {
                object.rotation.x = t * object.userData.speed * 0.45 + index;
                object.rotation.y = t * object.userData.speed + mouse.x * 0.4;
                object.position.y += Math.sin(t * 0.7 + index) * 0.002;
            });

            ribbons.forEach((line, index) => {
                line.rotation.y = Math.sin(t * 0.16 + index) * 0.08;
                line.position.x = Math.sin(t * 0.18 + line.userData.phase) * 1.4;
            });

            camera.position.x += (mouse.x * 2.8 - camera.position.x) * 0.035;
            camera.position.y += (-mouse.y * 1.8 - camera.position.y) * 0.035;
            camera.position.z = 28 + scrollDepth * 5;
            camera.lookAt(0, 0, 0);

            renderer.render(scene, camera);
            frameId = requestAnimationFrame(animate);
        }

        resize();
        onScroll();
        animate();

        window.addEventListener("resize", resize, { passive: true });
        window.addEventListener("mousemove", onMouseMove, { passive: true });
        window.addEventListener("scroll", onScroll, { passive: true });

        activeScene = {
            destroy() {
                cancelAnimationFrame(frameId);
                window.removeEventListener("resize", resize);
                window.removeEventListener("mousemove", onMouseMove);
                window.removeEventListener("scroll", onScroll);
                particleGeometry.dispose();
                particleMaterial.dispose();
                grid.material.dispose();
                objects.forEach((object) => {
                    object.geometry.dispose();
                    object.material.dispose();
                });
                ribbons.forEach((line) => {
                    line.geometry.dispose();
                    line.material.dispose();
                });
                renderer.dispose();
                activeScene = null;
            }
        };
    }

    window.initHeroStarfield = initKineticHeroScene;
    window.initKineticHeroScene = initKineticHeroScene;

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initKineticHeroScene, { once: true });
    } else {
        initKineticHeroScene();
    }
})();
