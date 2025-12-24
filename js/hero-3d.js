class Hero3D {
  constructor() {
    this.container = document.getElementById('hero-canvas');
    if (!this.container) return;

    this.initThree();
    this.createScene();
    this.createCamera();
    this.createRenderer();
    this.createParticles();
    this.addEventListeners();
    this.animate();
    this.addLights();
  }

  initThree() {
    this.scene = new THREE.Scene();
    this.clock = new THREE.Clock();
    this.mouse = new THREE.Vector2(0, 0);
    this.targetMouse = new THREE.Vector2(0, 0);
  }

  createScene() {
    this.scene.background = new THREE.Color(0x050505);
    this.scene.fog = new THREE.FogExp2(0x050505, 0.001);
  }

  addLights() {
    const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
    this.scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0x08F7FE, 1, 100);
    pointLight1.position.set(10, 10, 10);
    this.scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xFE53BB, 1, 100);
    pointLight2.position.set(-10, -10, -10);
    this.scene.add(pointLight2);
  }

  createCamera() {
    const fov = 75;
    const aspect = this.container.clientWidth / this.container.clientHeight;
    const near = 0.1;
    const far = 1000;
    this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    this.camera.position.z = 100;
  }

  createRenderer() {
    this.renderer = new THREE.WebGLRenderer({ 
      canvas: this.container,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance"
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.renderer.setClearColor(0x000000, 0);
  }

  createParticles() {
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 3000;
    const posArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 2000;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    
    const particlesMaterial = new THREE.PointsMaterial({
      size: 1.5,
      color: 0x08F7FE,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    });

    this.particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    this.scene.add(this.particlesMesh);
  }

  onWindowResize() {
    this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
  }

  onMouseMove(event) {
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  }

  addEventListeners() {
    window.addEventListener('resize', this.onWindowResize.bind(this));
    window.addEventListener('mousemove', this.onMouseMove.bind(this), { passive: true });
  }

  animate() {
    requestAnimationFrame(this.animate.bind(this));
    
    const elapsedTime = this.clock.getElapsedTime();
    
    // Animate particles
    if (this.particlesMesh) {
      this.particlesMesh.rotation.y = -elapsedTime * 0.1;
      this.particlesMesh.rotation.x = -elapsedTime * 0.05;
    }

    // Smooth mouse movement
    this.targetMouse.x = this.mouse.x * 20;
    this.targetMouse.y = this.mouse.y * 10;
    
    this.camera.position.x += (this.targetMouse.x - this.camera.position.x) * 0.05;
    this.camera.position.y += (this.targetMouse.y - this.camera.position.y) * 0.05;
    this.camera.lookAt(this.scene.position);

    this.renderer.render(this.scene, this.camera);
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new Hero3D();
});
