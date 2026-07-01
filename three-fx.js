import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const FX = {
  scene: null, camera: null, renderer: null, canvas: null,
  particles: null,
  _enabled: false,
  _currentScreen: 'home-screen',
  _pointer: { x: 0, y: 0 },
};

function webglAvailable() {
  try {
    const c = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && (c.getContext('webgl') || c.getContext('experimental-webgl')));
  } catch (e) { return false; }
}

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function computeDefaultEnabled() {
  const stored = localStorage.getItem('qcm_fx_enabled');
  if (stored === 'true') return true;
  if (stored === 'false') return false;
  // Défaut : activé sauf appareil faible ou reduced-motion
  if (prefersReducedMotion()) return false;
  if ((navigator.hardwareConcurrency || 4) <= 2) return false;
  return true;
}

function buildBackground() {
  const COUNT = 800;
  const positions = new Float32Array(COUNT * 3);
  for (let i = 0; i < COUNT * 3; i++) positions[i] = (Math.random() - 0.5) * 30;
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  FX.particles = new THREE.Points(
    geo,
    new THREE.PointsMaterial({ color: 0x818cf8, size: 0.06, transparent: true, opacity: 0.5 })
  );
  FX.scene.add(FX.particles);
}

function buildCap() {
  FX.cap = new THREE.Group();
  const mat = new THREE.MeshStandardMaterial({ color: 0x4f46e5, metalness: 0.3, roughness: 0.4 });

  // Calotte (demi-sphère aplatie)
  const crown = new THREE.Mesh(new THREE.SphereGeometry(0.55, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2), mat);
  crown.scale.y = 0.5;
  crown.position.y = -0.05;
  FX.cap.add(crown);

  // Plaque carrée (mortarboard)
  const board = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.06, 1.5), mat);
  board.position.y = 0.25;
  FX.cap.add(board);

  // Bouton central
  const knob = new THREE.Mesh(new THREE.SphereGeometry(0.08, 16, 16),
    new THREE.MeshStandardMaterial({ color: 0x818cf8, metalness: 0.4, roughness: 0.3 }));
  knob.position.y = 0.3;
  FX.cap.add(knob);

  // Pompon (fil + gland)
  const tasselMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.2, roughness: 0.5 });
  const cord = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.7, 8), tasselMat);
  cord.position.set(0.55, 0.05, 0.55);
  FX.cap.add(cord);
  const tassel = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.22, 12), tasselMat);
  tassel.position.set(0.55, -0.35, 0.55);
  FX.cap.add(tassel);

  FX.cap.visible = false;
  FX.scene.add(FX.cap);

  FX.controls = new OrbitControls(FX.camera, FX.canvas);
  FX.controls.enableDamping = true;
  FX.controls.enablePan = false;
  FX.controls.enableZoom = false;
  FX.controls.enabled = false; // activé seulement sur l'accueil
}

function updateScreenVisibility() {
  const onHome = FX._currentScreen === 'home-screen';
  if (FX.cap) FX.cap.visible = onHome;
  if (FX.controls) FX.controls.enabled = onHome;
  if (FX.canvas) FX.canvas.classList.toggle('fx-interactive', onHome);
}

function onResize() {
  if (!FX.renderer) return;
  FX.camera.aspect = window.innerWidth / window.innerHeight;
  FX.camera.updateProjectionMatrix();
  FX.renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  requestAnimationFrame(animate);
  if (!FX._enabled || !FX.renderer || document.hidden) return;
  if (!prefersReducedMotion()) {
    FX.particles.rotation.y += 0.0003;
    FX.particles.position.x += (FX._pointer.x * 1.5 - FX.particles.position.x) * 0.02;
    FX.particles.position.y += (-FX._pointer.y * 1.5 - FX.particles.position.y) * 0.02;
    if (FX.cap && FX.cap.visible) FX.cap.rotation.y += 0.006;
  }
  if (FX.controls && FX.controls.enabled) FX.controls.update();
  FX.renderer.render(FX.scene, FX.camera);
}

function init() {
  FX.canvas = document.getElementById('fx-canvas');
  if (!FX.canvas) return;
  FX._enabled = computeDefaultEnabled();

  if (!webglAvailable()) {
    FX._enabled = false;
    FX.canvas.classList.add('fx-hidden');
    return; // no-op total : l'app marche comme avant
  }

  FX.renderer = new THREE.WebGLRenderer({ canvas: FX.canvas, antialias: true, alpha: true });
  FX.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  FX.renderer.setSize(window.innerWidth, window.innerHeight);

  FX.scene = new THREE.Scene();
  FX.camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
  FX.camera.position.z = 6;

  FX.scene.add(new THREE.AmbientLight(0xffffff, 0.5));
  const key = new THREE.DirectionalLight(0xffffff, 1.1);
  key.position.set(3, 4, 5);
  FX.scene.add(key);

  buildBackground();
  buildCap();

  window.addEventListener('resize', onResize);
  window.addEventListener('pointermove', (e) => {
    FX._pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
    FX._pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
  });

  FX.canvas.classList.toggle('fx-hidden', !FX._enabled);
  updateScreenVisibility();
  animate();
}

// ─── API publique ───
window.ThreeFX = {
  isEnabled() { return FX._enabled; },
  setEnabled(on) {
    FX._enabled = !!on && webglAvailable();
    localStorage.setItem('qcm_fx_enabled', FX._enabled ? 'true' : 'false');
    if (FX.canvas) FX.canvas.classList.toggle('fx-hidden', !FX._enabled);
  },
  setScreen(screenId) { FX._currentScreen = screenId; updateScreenVisibility(); },
  celebrate() { /* complété Task 4 */ },
  showTrophy(_percent) { /* complété Task 3 */ },
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
