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
  controls.update();
  renderer.render(scene, camera);
}
animate();
