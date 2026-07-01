import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const canvas = document.getElementById('scene');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.z = 5;

// Lumières
scene.add(new THREE.AmbientLight(0xffffff, 0.4));
const keyLight = new THREE.DirectionalLight(0xffffff, 1.2);
keyLight.position.set(3, 4, 5);
scene.add(keyLight);

// Objet héros : un icosaèdre "cristal"
const hero = new THREE.Mesh(
  new THREE.IcosahedronGeometry(1.3, 0),
  new THREE.MeshStandardMaterial({ color: 0x6c8cff, metalness: 0.3, roughness: 0.25, flatShading: true })
);
scene.add(hero);

// Contrôle souris
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.enablePan = false;
controls.minDistance = 3;
controls.maxDistance = 8;

// Particules de fond
const PARTICLE_COUNT = 900;
const positions = new Float32Array(PARTICLE_COUNT * 3);
for (let i = 0; i < PARTICLE_COUNT * 3; i++) {
  positions[i] = (Math.random() - 0.5) * 24;
}
const particleGeo = new THREE.BufferGeometry();
particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
const particles = new THREE.Points(
  particleGeo,
  new THREE.PointsMaterial({ color: 0x8fa0ff, size: 0.05, transparent: true, opacity: 0.8 })
);
scene.add(particles);

// Suivi du pointeur (parallaxe)
const pointer = { x: 0, y: 0 };
window.addEventListener('pointermove', (e) => {
  pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
  pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
});

// Scène immersive (section 3) : le héros pourra se fondre en entrant dedans
hero.material.transparent = true;
const immersive = new THREE.Group();
const palette = [0xff7a7a, 0x7affc4, 0xffd97a, 0x9b7aff, 0x7ad0ff];
for (let i = 0; i < 5; i++) {
  const m = new THREE.Mesh(
    new THREE.TorusKnotGeometry(0.4, 0.14, 80, 12),
    new THREE.MeshStandardMaterial({ color: palette[i], metalness: 0.2, roughness: 0.4 })
  );
  m.position.set((i - 2) * 2.2, 0, -i * 4 - 4);
  m.scale.setScalar(0.01); // caché au départ, révélé au scroll
  immersive.add(m);
}
scene.add(immersive);

// Progression du scroll sur toute la page (0..1)
function scrollProgress() {
  const max = document.body.scrollHeight - window.innerHeight;
  return max > 0 ? window.scrollY / max : 0;
}

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function onResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', onResize);

function animate() {
  requestAnimationFrame(animate);
  if (document.hidden) return;
  if (!prefersReducedMotion()) {
    hero.rotation.y += 0.005;
    particles.rotation.y += 0.0004;
    particles.rotation.x += 0.0002;
    // Parallaxe : on décale le champ de particules (pas la caméra, pour ne pas
    // entrer en conflit avec OrbitControls qui pilote la caméra en section 1).
    particles.position.x += (pointer.x * 1.2 - particles.position.x) * 0.03;
    particles.position.y += (-pointer.y * 1.2 - particles.position.y) * 0.03;
  }

  // Section 3 : au scroll, les objets avancent vers la caméra (fly-through) et
  // apparaissent un par un ; le héros se fond pour laisser la place.
  const p = scrollProgress();
  const depth = Math.max(0, (p - 0.66) / 0.34); // 0 avant la section 3, ->1 en bas
  immersive.position.z = depth * 18;
  hero.material.opacity = 1 - THREE.MathUtils.clamp(depth * 1.4, 0, 1);
  immersive.children.forEach((mesh, i) => {
    const appear = THREE.MathUtils.clamp(depth * 5 - i, 0, 1);
    mesh.scale.setScalar(0.01 + appear * 0.99);
    if (!prefersReducedMotion()) mesh.rotation.z += 0.01;
  });

  controls.update();
  renderer.render(scene, camera);
}
animate();
