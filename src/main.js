// ╔══════════════════════════════════════════════════════════════╗
// ║  GKj's — GEEZ KICK JUICY JUICE · CINEMATIC ENGINE v5.0     ║
// ║  Lenis · GSAP 3 · ScrollTrigger · Three.js r168             ║
// ║  Howler.js · Custom Cursor · Cart Arc VFX                    ║
// ╚══════════════════════════════════════════════════════════════╝

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import * as THREE from 'three';

gsap.registerPlugin(ScrollTrigger);

// ═══════════════════════════════════════════
// 1. CONFIGURATION
// ═══════════════════════════════════════════
const TOTAL_FRAMES = 182;
const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) || window.innerWidth < 768;

const FLAVORS = [
  { id: 'apple', name: 'Apple Surge', tagline: 'Crisp. Bold. Electric.', hex: '#00FF85', img: '/gkk1.jpg', cal: '120', price: '$4.99', desc: 'A turbocharged blast of crisp green apple — tart on the tongue, electric on the finish. Nature\'s sharpest fruit, amplified.' },
  { id: 'orange', name: 'Orange Kick', tagline: 'Citrus overload. Pure fire.', hex: '#FF9F1C', img: '/gkk2.jpg', cal: '130', price: '$4.99', desc: 'Sun-soaked Valencia oranges squeezed at peak ripeness. Every sip is a citrus supernova lighting up your taste buds.' },
  { id: 'grapes', name: 'Grape Nebula', tagline: 'Deep space. Deep flavor.', hex: '#8A2BE2', img: '/gkk3.jpg', cal: '110', price: '$4.99', desc: 'Dark Concord grapes from the finest vineyards, crushed into a deep purple elixir that tastes like the cosmos itself.' },
  { id: 'mango', name: 'Mango Solar', tagline: 'Tropical supernova energy.', hex: '#FFEA00', img: '/gkk4.jpg', cal: '140', price: '$4.99', desc: 'Alphonso mangoes harvested at their golden peak. Thick, tropical, and dangerously addictive — liquid sunshine.' },
  { id: 'mixed', name: 'Supernova Mix', tagline: 'All flavors. Maximum impact.', hex: '#FF2D00', img: '/gkk5.jpg', cal: '150', price: '$5.49', desc: 'Every flavor collides in a cosmic chain reaction. The ultimate fruit fusion — sweet, tart, tropical, electric. All at once.' }
];

// ═══════════════════════════════════════════
// 2. DOM REFERENCES
// ═══════════════════════════════════════════
const $ = (s, p = document) => p.querySelector(s);
const $$ = (s, p = document) => [...p.querySelectorAll(s)];

const heroCanvas = $('#hero-canvas');
const heroCtx = heroCanvas.getContext('2d');
const preloaderEl = $('#preloader');
const preloaderFill = $('#preloader-fill');
const preloaderBar = $('#preloader-bar');
const preloaderStat = $('#preloader-status');
const curDot = $('#cursor-dot');
const curRing = $('#cursor-ring');
const trailCanvas = $('#cursor-trail-canvas');
const trailCtx = trailCanvas.getContext('2d');
const modal = $('#product-modal');
const cartCountEl = $('#cart-count');
const cartBtn = $('#cart-btn');
const flyingCan = $('#flying-can');
const flyingCanImg = $('#flying-can-img');
const juiceCanvas = $('#juice-trail-canvas');
const juiceCtx = juiceCanvas.getContext('2d');
const splashVfx = $('#cart-splash-vfx');
const webglBg = $('#webgl-bg');

// ═══════════════════════════════════════════
// 3. LENIS SMOOTH SCROLL
// ═══════════════════════════════════════════
const lenis = new Lenis({
  duration: 1.4,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  orientation: 'vertical',
  smoothWheel: true,
  touchMultiplier: 1.5,
});

lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);

// ═══════════════════════════════════════════
// 4. THREE.JS COSMIC NEBULA BACKGROUND
// ═══════════════════════════════════════════
let scene, camera, renderer, particleMesh;
const PARTICLE_COUNT = 0;
const juiceColors = [0xFF2D00, 0xFF9F1C, 0x8A2BE2, 0x00FF85, 0xFFEA00];

function initThreeBackground() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 5;

  renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false, powerPreference: 'high-performance' });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  webglBg.appendChild(renderer.domElement);

  // Instanced particles
  const geo = new THREE.SphereGeometry(0.015, 4, 4);
  const mat = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.6 });
  particleMesh = new THREE.InstancedMesh(geo, mat, PARTICLE_COUNT);

  const dummy = new THREE.Object3D();
  const colorAttr = new THREE.InstancedBufferAttribute(new Float32Array(PARTICLE_COUNT * 3), 3);

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    dummy.position.set(
      (Math.random() - 0.5) * 16,
      (Math.random() - 0.5) * 12,
      (Math.random() - 0.5) * 8
    );
    dummy.scale.setScalar(0.3 + Math.random() * 1.5);
    dummy.updateMatrix();
    particleMesh.setMatrixAt(i, dummy.matrix);

    const col = new THREE.Color(juiceColors[Math.floor(Math.random() * juiceColors.length)]);
    colorAttr.setXYZ(i, col.r, col.g, col.b);
  }
  particleMesh.instanceColor = colorAttr;
  scene.add(particleMesh);

  // Soft nebula fog spheres
  for (let j = 0; j < 3; j++) {
    const fogGeo = new THREE.SphereGeometry(2 + j, 16, 16);
    const fogMat = new THREE.MeshBasicMaterial({
      color: juiceColors[j],
      transparent: true,
      opacity: 0.015,
      depthWrite: false,
    });
    const fogSphere = new THREE.Mesh(fogGeo, fogMat);
    fogSphere.position.set(
      (Math.random() - 0.5) * 6,
      (Math.random() - 0.5) * 4,
      -3 - j * 2
    );
    scene.add(fogSphere);
  }

  animateThree();
}

function animateThree() {
  requestAnimationFrame(animateThree);

  const t = performance.now() * 0.0001;
  const dummy = new THREE.Object3D();

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particleMesh.getMatrixAt(i, dummy.matrix);
    dummy.matrix.decompose(dummy.position, dummy.quaternion, dummy.scale);

    dummy.position.y += Math.sin(t * 3 + i * 0.1) * 0.0003;
    dummy.position.x += Math.cos(t * 2 + i * 0.05) * 0.0002;

    dummy.updateMatrix();
    particleMesh.setMatrixAt(i, dummy.matrix);
  }
  particleMesh.instanceMatrix.needsUpdate = true;

  // Gentle camera sway
  camera.position.x = Math.sin(t * 0.5) * 0.3;
  camera.position.y = Math.cos(t * 0.4) * 0.2;
  camera.lookAt(0, 0, 0);

  renderer.render(scene, camera);
}

// ═══════════════════════════════════════════
// 5. HERO FRAME SEQUENCE (subtle bg texture)
// ═══════════════════════════════════════════
const frameImages = new Array(TOTAL_FRAMES);
let framesLoaded = 0;
let currentFrameIdx = 0;

function resizeCanvas(canvas) {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function drawFrame(idx) {
  const img = frameImages[Math.max(0, Math.min(idx, TOTAL_FRAMES - 1))];
  if (!img || !img.complete || !img.naturalWidth) return;
  heroCtx.clearRect(0, 0, heroCanvas.width, heroCanvas.height);
  const scale = Math.max(heroCanvas.width / img.naturalWidth, heroCanvas.height / img.naturalHeight);
  const w = img.naturalWidth * scale;
  const h = img.naturalHeight * scale;
  heroCtx.drawImage(img, (heroCanvas.width - w) / 2, (heroCanvas.height - h) / 2, w, h);
}

// ═══════════════════════════════════════════
// 6. AUDIO SYSTEM (Howler.js)
// ═══════════════════════════════════════════
let audioReady = false;
let sndHover, sndPop, sndPour, sndSplash;

function initAudio() {
  if (audioReady) return;
  try {
    sndHover = new Howl({ src: ['https://assets.mixkit.co/active_storage/sfx/2578/2578-preview.mp3'], volume: 0.06, preload: true });
    sndPop = new Howl({ src: ['https://assets.mixkit.co/active_storage/sfx/1110/1110-preview.mp3'], volume: 0.25, preload: true });
    sndPour = new Howl({ src: ['https://assets.mixkit.co/active_storage/sfx/188/188-preview.mp3'], volume: 0.15, preload: true });
    sndSplash = new Howl({ src: ['https://assets.mixkit.co/active_storage/sfx/2515/2515-preview.mp3'], volume: 0.2, preload: true });
    audioReady = true;
  } catch (e) { /* Auto-play policy — silent fail */ }
}
document.addEventListener('click', initAudio, { once: true });
document.addEventListener('touchstart', initAudio, { once: true });

// ═══════════════════════════════════════════
// 7. STATE
// ═══════════════════════════════════════════
let selectedIdx = -1;
let modalActive = false;
let cartItems = []; // Array of { id, name, price, img, quantity }
let animating = false;

// ═══════════════════════════════════════════
// 8. CUSTOM CURSOR WITH PARTICLE TRAILS
// ═══════════════════════════════════════════
let mouseX = 0, mouseY = 0;
const particles = [];

class CursorParticle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = Math.random() * 3 + 1;
    this.life = 1;
    this.decay = Math.random() * 0.03 + 0.015;
    this.vx = (Math.random() - 0.5) * 0.5;
    this.vy = Math.random() * 1.5 + 0.5;
    const colors = ['#FF2D00', '#FF9F1C', '#8A2BE2', '#00FF85', '#FFEA00'];
    this.color = colors[Math.floor(Math.random() * colors.length)];
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.life -= this.decay;
    this.size *= 0.98;
  }
  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = Math.max(0, this.life);
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

function animateCursorTrail() {
  requestAnimationFrame(animateCursorTrail);
  trailCtx.clearRect(0, 0, trailCanvas.width, trailCanvas.height);

  // Spawn particles at cursor
  if (Math.random() > 0.6) {
    particles.push(new CursorParticle(mouseX, mouseY));
  }

  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].update();
    particles[i].draw(trailCtx);
    if (particles[i].life <= 0) particles.splice(i, 1);
  }
}

if (!isMobile) {
  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    curDot.style.left = e.clientX + 'px';
    curDot.style.top = e.clientY + 'px';
    gsap.to(curRing, { left: e.clientX, top: e.clientY, duration: 0.3, ease: 'power2.out' });
  });

  resizeCanvas(trailCanvas);
  animateCursorTrail();
}

// Hover class for interactable elements
function bindHoverEffects() {
  $$('.interactable').forEach(el => {
    el.addEventListener('mouseenter', () => {
      document.body.classList.add('cursor-hover');
      if (audioReady && sndHover) sndHover.play();
    });
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });
}

// ═══════════════════════════════════════════
// 9. PRODUCT MODAL (360° Rotation)
// ═══════════════════════════════════════════
let dragRotation = 0;
let isDragging = false;
let dragStartX = 0;
let dragVelocity = 0;
let lastDragX = 0;
let momentumRaf = null;

const modalCanImg = $('#modal-can-img');
const modalCanContainer = $('#modal-can-container');
const modalRim = $('#modal-rim');
const modalDrip = $('#modal-drip');

function openModal(idx) {
  if (animating || modalActive) return;
  animating = true;
  modalActive = true;
  selectedIdx = idx;
  const cfg = FLAVORS[idx];

  if (audioReady) { sndPop.play(); sndPour.play(); }

  // Populate
  $('#modal-title').textContent = cfg.name;
  $('#modal-edition').textContent = `Sequence 0${idx + 1}`;
  $('#modal-story').textContent = cfg.desc;
  $('#stat-cal').textContent = cfg.cal;
  $('#modal-glow').style.backgroundColor = cfg.hex;
  modalCanImg.src = cfg.img;
  modalCanImg.alt = cfg.name;
  dragRotation = 0;
  modalCanImg.style.transform = 'rotateY(0deg)';

  // Style the Shop Now button glow
  $('#shop-now-btn').style.setProperty('--accent', cfg.hex);

  modal.classList.add('active');
  gsap.fromTo('.modal-panel',
    { y: 50, scale: 0.95, opacity: 0 },
    { y: 0, scale: 1, opacity: 1, duration: 0.7, ease: 'power3.out', onComplete: () => { animating = false; } }
  );
}

function closeModal() {
  if (!modalActive || animating) return;
  animating = true;
  modalActive = false;
  selectedIdx = -1;

  gsap.to('.modal-panel', {
    y: 40, scale: 0.95, opacity: 0, duration: 0.4, ease: 'power2.in',
    onComplete: () => {
      modal.classList.remove('active');
      animating = false;
      if (momentumRaf) cancelAnimationFrame(momentumRaf);
    }
  });
}

// 360° Drag rotation
function onDragStart(e) {
  isDragging = true;
  dragStartX = e.clientX || e.touches?.[0]?.clientX || 0;
  lastDragX = dragStartX;
  dragVelocity = 0;
  if (momentumRaf) cancelAnimationFrame(momentumRaf);
  modalCanContainer.style.cursor = 'grabbing';
}

function onDragMove(e) {
  if (!isDragging) return;
  const x = e.clientX || e.touches?.[0]?.clientX || 0;
  const dx = x - lastDragX;
  dragVelocity = dx;
  dragRotation += dx * 0.8;
  lastDragX = x;

  // Apply rotation + lighting shift
  modalCanImg.style.transform = `rotateY(${dragRotation}deg)`;
  const lightAngle = 105 + (dragRotation % 360) * 0.3;
  modalRim.style.background = `linear-gradient(${lightAngle}deg, transparent 35%, rgba(255,255,255,${0.08 + Math.abs(Math.sin(dragRotation * 0.02)) * 0.12}) 50%, transparent 65%)`;

  // Condensation drip speed synced to rotation velocity
  const dripSpeed = Math.min(Math.abs(dragVelocity) * 0.3, 15);
  modalDrip.style.animation = dripSpeed > 1 ? `drip ${Math.max(0.3, 2 - dripSpeed * 0.1)}s linear infinite` : 'none';
}

function onDragEnd() {
  isDragging = false;
  modalCanContainer.style.cursor = 'grab';

  // Momentum
  const decel = () => {
    dragVelocity *= 0.95;
    dragRotation += dragVelocity * 0.5;
    modalCanImg.style.transform = `rotateY(${dragRotation}deg)`;
    if (Math.abs(dragVelocity) > 0.1) {
      momentumRaf = requestAnimationFrame(decel);
    } else {
      modalDrip.style.animation = 'none';
    }
  };
  momentumRaf = requestAnimationFrame(decel);
}

// Bind drag events
modalCanContainer.addEventListener('mousedown', onDragStart);
modalCanContainer.addEventListener('touchstart', (e) => { e.preventDefault(); onDragStart(e.touches[0]); }, { passive: false });
window.addEventListener('mousemove', onDragMove);
window.addEventListener('touchmove', (e) => { if (isDragging) onDragMove(e.touches[0]); });
window.addEventListener('mouseup', onDragEnd);
window.addEventListener('touchend', onDragEnd);

// Modal close
$('#modal-backdrop').addEventListener('click', closeModal);
$('#modal-close').addEventListener('click', closeModal);

// ═══════════════════════════════════════════
// 10. ADD-TO-CART ARC ANIMATION
// ═══════════════════════════════════════════
const juiceTrailParticles = [];

class JuiceParticle {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.size = Math.random() * 5 + 2;
    this.life = 1;
    this.decay = Math.random() * 0.025 + 0.01;
    this.vx = (Math.random() - 0.5) * 3;
    this.vy = (Math.random() - 0.5) * 3;
    this.color = color;
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += 0.1; // gravity
    this.life -= this.decay;
    this.size *= 0.97;
  }
  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = Math.max(0, this.life * 0.7);
    ctx.fillStyle = this.color;
    ctx.shadowColor = this.color;
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

function animateJuiceTrail() {
  requestAnimationFrame(animateJuiceTrail);
  juiceCtx.clearRect(0, 0, juiceCanvas.width, juiceCanvas.height);
  for (let i = juiceTrailParticles.length - 1; i >= 0; i--) {
    juiceTrailParticles[i].update();
    juiceTrailParticles[i].draw(juiceCtx);
    if (juiceTrailParticles[i].life <= 0) juiceTrailParticles.splice(i, 1);
  }
}
resizeCanvas(juiceCanvas);
animateJuiceTrail();

function flyCanToCart(idx) {
  if (animating) return;
  animating = true;
  const cfg = FLAVORS[idx];

  if (audioReady) sndPop.play();
  closeModal();

  // Position flying can from modal center
  const modalRect = $('.modal-visual')?.getBoundingClientRect() || { left: window.innerWidth / 2 - 50, top: window.innerHeight / 2 - 75 };
  const cartRect = cartBtn.getBoundingClientRect();

  flyingCanImg.src = cfg.img;
  flyingCan.style.left = (modalRect.left + modalRect.width / 2 - 50) + 'px';
  flyingCan.style.top = (modalRect.top + modalRect.height / 2 - 75) + 'px';
  flyingCan.classList.add('active');

  const startX = modalRect.left + modalRect.width / 2 - 50;
  const startY = modalRect.top + modalRect.height / 2 - 75;
  const endX = cartRect.left + cartRect.width / 2 - 50;
  const endY = cartRect.top + cartRect.height / 2 - 50;

  // GSAP arc animation
  const tl = gsap.timeline({
    onUpdate: function () {
      // Emit juice trail particles along the path
      const rect = flyingCan.getBoundingClientRect();
      if (Math.random() > 0.3) {
        juiceTrailParticles.push(new JuiceParticle(
          rect.left + rect.width / 2,
          rect.top + rect.height / 2,
          cfg.hex
        ));
      }
    },
    onComplete: () => {
      flyingCan.classList.remove('active');
      cartLandingVFX(cfg.hex);
      addToCart(idx);
      animating = false;
    }
  });

  tl.to(flyingCan, {
    duration: 0.9,
    motionPath: {
      path: [
        { x: 0, y: 0 },
        { x: (endX - startX) * 0.3, y: -200 },
        { x: (endX - startX) * 0.7, y: -150 },
        { x: endX - startX, y: endY - startY }
      ],
      type: 'cubic',
    },
    scale: 0.3,
    rotation: 360,
    ease: 'power2.inOut',
    filter: 'blur(2px)',
  });

  // Fallback: simple arc if motionPath plugin not available
  tl.eventCallback('onError', () => {
    gsap.to(flyingCan, {
      left: endX + 'px',
      top: endY + 'px',
      scale: 0.3,
      rotation: 360,
      duration: 0.9,
      ease: 'power2.inOut',
      onComplete: () => {
        flyingCan.classList.remove('active');
        cartLandingVFX(cfg.hex);
        addToCart(idx);
        animating = false;
      }
    });
  });
}

// Simple bezier arc fallback (no motionPath plugin)
function flyCanToCartSimple(idx) {
  if (animating) return;
  animating = true;
  const cfg = FLAVORS[idx];

  if (audioReady) sndPop.play();

  // Get positions
  let startEl;
  if (modalActive) {
    startEl = $('.modal-visual');
    closeModal();
  } else {
    startEl = $(`.shop-card[data-idx="${idx}"] .shop-img`) || document.body;
  }

  const startRect = startEl?.getBoundingClientRect() || { left: window.innerWidth / 2, top: window.innerHeight / 2, width: 0, height: 0 };
  const cartRect = cartBtn.getBoundingClientRect();

  const startX = startRect.left + startRect.width / 2 - 50;
  const startY = startRect.top + startRect.height / 2 - 75;
  const endX = cartRect.left + cartRect.width / 2 - 50;
  const endY = cartRect.top;

  flyingCanImg.src = cfg.img;
  flyingCan.style.left = startX + 'px';
  flyingCan.style.top = startY + 'px';
  flyingCan.style.transform = 'scale(1) rotate(0deg)';
  flyingCan.style.filter = 'none';
  flyingCan.classList.add('active');

  // Animate with bezier-like arc using GSAP
  const duration = 0.85;
  const midX = (startX + endX) / 2;
  const midY = Math.min(startY, endY) - 180;

  gsap.to(flyingCan, {
    duration: duration,
    ease: 'power2.in',
    onUpdate: function () {
      const p = this.progress();
      // Quadratic bezier
      const t = p;
      const x = (1 - t) * (1 - t) * startX + 2 * (1 - t) * t * midX + t * t * endX;
      const y = (1 - t) * (1 - t) * startY + 2 * (1 - t) * t * midY + t * t * endY;
      flyingCan.style.left = x + 'px';
      flyingCan.style.top = y + 'px';
      flyingCan.style.transform = `scale(${1 - p * 0.65}) rotate(${p * 540}deg)`;
      flyingCan.style.filter = `blur(${p * 2}px)`;

      // Emit juice trail
      if (Math.random() > 0.35) {
        juiceTrailParticles.push(new JuiceParticle(x + 50, y + 50, cfg.hex));
      }
    },
    onComplete: () => {
      flyingCan.classList.remove('active');
      flyingCan.style.filter = 'none';
      cartLandingVFX(cfg.hex);
      addToCart(idx);
      animating = false;
    }
  });
}

function cartLandingVFX(color) {
  // Sound removed as requested

  // Update cart badge
  const totalQty = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  cartCountEl.textContent = totalQty;
  cartCountEl.classList.toggle('visible', totalQty > 0);

  // Cart bounce + shake
  gsap.fromTo(cartBtn,
    { scale: 1.4, rotation: -8 },
    { scale: 1, rotation: 0, duration: 0.6, ease: 'elastic.out(1, 0.35)' }
  );
  gsap.fromTo(cartCountEl,
    { scale: 2.5 },
    { scale: 1, duration: 0.5, ease: 'elastic.out(1, 0.4)' }
  );

  // Cart shake
  gsap.to(cartBtn, {
    x: '+=3', yoyo: true, repeat: 5, duration: 0.05, ease: 'none',
    onComplete: () => gsap.set(cartBtn, { x: 0 })
  });

  // Splash micro-particles
  const cartRect = cartBtn.getBoundingClientRect();
  splashVfx.style.left = (cartRect.left + cartRect.width / 2) + 'px';
  splashVfx.style.top = (cartRect.top + cartRect.height / 2) + 'px';

  for (let i = 0; i < 12; i++) {
    const p = document.createElement('div');
    p.className = 'splash-particle';
    const size = Math.random() * 6 + 3;
    p.style.width = size + 'px';
    p.style.height = size + 'px';
    p.style.background = color;
    p.style.boxShadow = `0 0 8px ${color}`;
    splashVfx.appendChild(p);

    gsap.fromTo(p,
      { x: 0, y: 0, scale: 1, opacity: 1 },
      {
        x: (Math.random() - 0.5) * 80,
        y: (Math.random() - 0.5) * 80,
        scale: 0,
        opacity: 0,
        duration: 0.6 + Math.random() * 0.3,
        ease: 'power2.out',
        onComplete: () => p.remove()
      }
    );
  }
}

// ═══════════════════════════════════════════
// 10.5 CART STATE & UI LOGIC
// ═══════════════════════════════════════════
function addToCart(flavorIdx) {
  const flavor = FLAVORS[flavorIdx];
  const existingItem = cartItems.find(item => item.id === flavor.id);

  if (existingItem) {
    existingItem.quantity++;
  } else {
    cartItems.push({
      id: flavor.id,
      name: flavor.name,
      price: parseFloat(flavor.price.replace('$', '')),
      img: flavor.img,
      quantity: 1,
      hex: flavor.hex
    });
  }
  updateCartUI();
}

function removeFromCart(id) {
  cartItems = cartItems.filter(item => item.id !== id);
  updateCartUI();
}

function updateQuantity(id, delta) {
  const item = cartItems.find(i => i.id === id);
  if (item) {
    item.quantity += delta;
    if (item.quantity <= 0) {
      removeFromCart(id);
    } else {
      updateCartUI();
    }
  }
}

function updateCartUI() {
  const list = $('#cart-items-list');
  const subtotalEl = $('#cart-subtotal');
  const totalEl = $('#cart-total');
  const cartBadge = $('#cart-count');

  if (cartItems.length === 0) {
    list.innerHTML = `<div class="cart-empty-msg">Your collection is empty. Explore our flavors to add items.</div>`;
    subtotalEl.textContent = '$0.00';
    totalEl.textContent = '$0.00';
    cartBadge.classList.remove('visible');
    return;
  }

  let subtotal = 0;
  let totalQty = 0;

  list.innerHTML = cartItems.map(item => {
    const itemTotal = item.price * item.quantity;
    subtotal += itemTotal;
    totalQty += item.quantity;
    return `
      <div class="cart-item">
        <img src="${item.img}" alt="${item.name}" class="cart-item-img">
        <div class="cart-item-info">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-price">$${item.price.toFixed(2)}</div>
          <div class="cart-item-controls">
            <button class="qty-btn interactable" onclick="event.stopPropagation(); window.updateQty('${item.id}', -1)">−</button>
            <span class="qty-val">${item.quantity}</span>
            <button class="qty-btn interactable" onclick="event.stopPropagation(); window.updateQty('${item.id}', 1)">+</button>
          </div>
        </div>
        <button class="item-remove interactable" onclick="event.stopPropagation(); window.removeItem('${item.id}')">Remove</button>
      </div>
    `;
  }).join('');

  subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
  totalEl.textContent = `$${subtotal.toFixed(2)}`;
  cartBadge.textContent = totalQty;
  cartBadge.classList.add('visible');

  // Bind hover effects for new items
  bindHoverEffects();
}

// Global exposure for onclick handlers
window.updateQty = updateQuantity;
window.removeItem = removeFromCart;

function toggleCart(open) {
  const overlay = $('#cart-overlay');
  if (open) {
    overlay.classList.add('active');
    lenis.stop();
  } else {
    overlay.classList.remove('active');
    lenis.start();
  }
}

// Cart Events
$('#cart-btn').addEventListener('click', () => toggleCart(true));
$('#cart-close').addEventListener('click', () => toggleCart(false));
$('#cart-backdrop').addEventListener('click', () => toggleCart(false));

$('#checkout-btn').addEventListener('click', () => {
  if (cartItems.length === 0) return;
  const btn = $('#checkout-btn');
  const originalText = btn.querySelector('.btn-text').textContent;

  btn.querySelector('.btn-text').textContent = 'Processing...';
  btn.style.pointerEvents = 'none';

  setTimeout(() => {
    alert('Order Confirmed! Your cosmic collection is on its way.');
    cartItems = [];
    updateCartUI();
    toggleCart(false);
    btn.querySelector('.btn-text').textContent = originalText;
    btn.style.pointerEvents = 'auto';
  }, 2000);
});

// Shop Now button in modal
$('#shop-now-btn').addEventListener('click', () => {
  if (selectedIdx >= 0) flyCanToCartSimple(selectedIdx);
});

// Hero can interactions removed

// ═══════════════════════════════════════════
// 11. PREMIUM OVERLAYS & SEARCH
// ═══════════════════════════════════════════
function togglePremiumOverlay(id, open) {
  const overlay = $(`#${id}`);
  if (!overlay) return;

  if (open) {
    overlay.classList.add('active');
    lenis.stop();
  } else {
    overlay.classList.remove('active');
    lenis.start();
  }
}

// Bind overlay events
[
  { btn: '#search-btn', id: 'search-overlay' },
  { btn: '#account-btn', id: 'account-overlay' },
  { btn: '#track-order-btn', id: 'track-overlay' },
  { btn: '#support-btn', id: 'support-overlay' },
  { btn: '#community-btn', id: 'community-overlay' }
].forEach(item => {
  const btn = $(item.btn);
  if (btn) {
    btn.addEventListener('click', () => togglePremiumOverlay(item.id, true));
  }
  const overlay = $(`#${item.id}`);
  if (overlay) {
    overlay.querySelector('.overlay-backdrop').addEventListener('click', () => togglePremiumOverlay(item.id, false));
  }
});

// Search Logic
const searchInput = $('#juice-search-input');
const searchResults = $('#search-results');

if (searchInput) {
  searchInput.addEventListener('input', (e) => {
    const q = e.target.value.toLowerCase();
    if (!q) {
      searchResults.innerHTML = '';
      return;
    }

    const filtered = FLAVORS.filter(f => f.name.toLowerCase().includes(q));
    searchResults.innerHTML = filtered.map((f, i) => `
      <div class="search-result-item interactable" data-flavor="${FLAVORS.indexOf(f)}">
        <img src="${f.img}" alt="${f.name}" class="search-result-img">
        <div>
          <div style="font-weight:700; font-size: 0.9rem;">${f.name}</div>
          <div style="font-size: 0.75rem; color: var(--muted);">${f.price}</div>
        </div>
      </div>
    `).join('');

    // Bind clicks on search results
    searchResults.querySelectorAll('.search-result-item').forEach(item => {
      item.addEventListener('click', () => {
        const idx = parseInt(item.dataset.flavor);
        togglePremiumOverlay('search-overlay', false);
        openModal(idx);
      });
    });
    bindHoverEffects();
  });
}

// Shop Now / Grab Yours section polish
const heroCta = $('#hero-cta-btn');
if (heroCta) {
  heroCta.addEventListener('click', () => {
    lenis.scrollTo('#shop', { duration: 1.5, ease: (t) => Math.min(1, 1.001 * t * t * t) });
  });
}

// ═══════════════════════════════════════════
// 12. FLAVOR CARD INTERACTIONS
// ═══════════════════════════════════════════
const frameAnimCache = {};

$$('.flavor-card').forEach(card => {
  const frameEl = card.querySelector('.card-frame-anim');
  const startFrame = parseInt(frameEl?.dataset.start || 1);
  const endFrame = parseInt(frameEl?.dataset.end || 36);
  let animInterval = null;
  let currentFrame = startFrame;

  card.addEventListener('click', () => {
    const idx = parseInt(card.dataset.flavor);
    if (!isNaN(idx)) openModal(idx);
  });

  card.addEventListener('mouseenter', () => {
    if (isMobile) return;
    // Start cycling through frames for splash-pour animation
    currentFrame = startFrame;
    animInterval = setInterval(() => {
      if (frameEl) {
        frameEl.style.backgroundImage = `url('/frames/ezgif-frame-${String(currentFrame).padStart(3, '0')}.jpg')`;
      }
      currentFrame++;
      if (currentFrame > endFrame) currentFrame = startFrame;
    }, 80);
  });

  card.addEventListener('mouseleave', () => {
    if (animInterval) clearInterval(animInterval);
    if (frameEl) frameEl.style.opacity = '0';
    setTimeout(() => {
      if (frameEl) frameEl.style.backgroundImage = '';
    }, 400);
  });
});

// ═══════════════════════════════════════════
// 13. SHOP SECTION — DYNAMIC CARDS
// ═══════════════════════════════════════════
const shopGrid = $('#shop-grid');
FLAVORS.forEach((cfg, i) => {
  const card = document.createElement('div');
  card.className = 'shop-card interactable';
  card.dataset.idx = i;
  card.innerHTML = `
    <div class="shop-card-glow" style="background:radial-gradient(circle, ${cfg.hex} 0%, transparent 70%)"></div>
    <img src="${cfg.img}" alt="${cfg.name}" class="shop-img" loading="lazy">
    <div class="shop-name">${cfg.name}</div>
    <div class="shop-price">${cfg.price}</div>
    <div class="shop-actions">
      <button class="view-details-btn interactable" data-idx="${i}">Detail</button>
      <button class="quick-add-btn interactable" data-idx="${i}">Add →</button>
    </div>
  `;
  shopGrid.appendChild(card);

  card.querySelector('.quick-add-btn').addEventListener('click', (e) => {
    e.stopPropagation();
    quickAddFromShop(i, card);
  });

  card.querySelector('.view-details-btn').addEventListener('click', (e) => {
    e.stopPropagation();
    openModal(i);
  });

  // Click card to open modal
  card.addEventListener('click', () => openModal(i));
});

function quickAddFromShop(idx, cardEl) {
  const cfg = FLAVORS[idx];
  if (animating) return;
  animating = true;

  if (audioReady) sndPop.play();

  const imgEl = cardEl.querySelector('.shop-img');
  const imgRect = imgEl.getBoundingClientRect();
  const cartRect = cartBtn.getBoundingClientRect();

  const startX = imgRect.left + imgRect.width / 2 - 50;
  const startY = imgRect.top;
  const endX = cartRect.left + cartRect.width / 2 - 50;
  const endY = cartRect.top;

  flyingCanImg.src = cfg.img;
  flyingCan.style.left = startX + 'px';
  flyingCan.style.top = startY + 'px';
  flyingCan.style.transform = 'scale(1) rotate(0deg)';
  flyingCan.style.filter = 'none';
  flyingCan.classList.add('active');

  const midX = (startX + endX) / 2;
  const midY = Math.min(startY, endY) - 140;
  const duration = 0.75;

  gsap.to(flyingCan, {
    duration,
    ease: 'power2.in',
    onUpdate: function () {
      const t = this.progress();
      const x = (1 - t) * (1 - t) * startX + 2 * (1 - t) * t * midX + t * t * endX;
      const y = (1 - t) * (1 - t) * startY + 2 * (1 - t) * t * midY + t * t * endY;
      flyingCan.style.left = x + 'px';
      flyingCan.style.top = y + 'px';
      flyingCan.style.transform = `scale(${1 - t * 0.65}) rotate(${t * 480}deg)`;
      flyingCan.style.filter = `blur(${t * 1.5}px)`;

      if (Math.random() > 0.4) {
        juiceTrailParticles.push(new JuiceParticle(x + 50, y + 40, cfg.hex));
      }
    },
    onComplete: () => {
      flyingCan.classList.remove('active');
      flyingCan.style.filter = 'none';
      cartLandingVFX(cfg.hex);
      addToCart(idx);
      animating = false;
    }
  });

  // Visual feedback on button
  const btn = cardEl.querySelector('.quick-add-btn');
  btn.textContent = '✓ Added';
  btn.style.background = cfg.hex;
  btn.style.color = '#000';
  setTimeout(() => { btn.textContent = 'Quick Add →'; btn.style.background = ''; btn.style.color = ''; }, 1800);
}

// ═══════════════════════════════════════════
// 14. GSAP SCROLL ANIMATIONS
// ═══════════════════════════════════════════

// Hero text entrance moved to launchSite()

// Hero cans staggered entrance removed

// Hero cans parallax removed

// Hero cans floating animation removed

// Scroll indicator fade
gsap.to('#scroll-indicator', {
  opacity: 0,
  scrollTrigger: { trigger: '#hero', start: '15% top', end: '35% top', scrub: true }
});

// Hero frame sequence scrub
ScrollTrigger.create({
  trigger: '#scroll-container',
  start: 'top top',
  end: 'bottom bottom',
  onUpdate: (self) => {
    currentFrameIdx = Math.floor(self.progress * (TOTAL_FRAMES - 1));
    drawFrame(currentFrameIdx);
  }
});

// Flavor cards staggered reveal
$$('.flavor-card').forEach((card, i) => {
  gsap.to(card, {
    opacity: 1, y: 0, duration: 0.8, delay: i * 0.1, ease: 'power3.out',
    scrollTrigger: {
      trigger: card, start: 'top 88%', once: true,
      onEnter: () => card.classList.add('revealed')
    }
  });
});

// Section headers reveal
$$('.section-header').forEach(header => {
  gsap.from(header, {
    opacity: 0, y: 40, duration: 1, ease: 'power3.out',
    scrollTrigger: { trigger: header, start: 'top 80%', once: true }
  });
});

// Story section reveals
gsap.to('#story-title', {
  opacity: 1, y: 0, duration: 1.2, ease: 'power3.out',
  scrollTrigger: { trigger: '#story', start: 'top 70%', once: true }
});
gsap.to('#story-desc', {
  opacity: 1, y: 0, duration: 1.2, delay: 0.15, ease: 'power3.out',
  scrollTrigger: { trigger: '#story', start: 'top 65%', once: true }
});
gsap.to('.story-stats', {
  opacity: 1, y: 0, duration: 1, delay: 0.3, ease: 'power3.out',
  scrollTrigger: { trigger: '#story', start: 'top 60%', once: true }
});

// Story orbs parallax
$$('.story-orb').forEach((orb, i) => {
  gsap.to(orb, {
    y: -(60 + i * 30),
    scrollTrigger: { trigger: '#story', start: 'top bottom', end: 'bottom top', scrub: 1 }
  });
});

// Shop cards reveal
setTimeout(() => {
  $$('.shop-card').forEach((card, i) => {
    gsap.to(card, {
      opacity: 1, y: 0, duration: 0.7, delay: i * 0.08, ease: 'power3.out',
      scrollTrigger: {
        trigger: card, start: 'top 90%', once: true,
        onEnter: () => card.classList.add('revealed')
      }
    });
  });
}, 100);

// ═══════════════════════════════════════════
// 15. RESIZE HANDLER
// ═══════════════════════════════════════════
window.addEventListener('resize', () => {
  resizeCanvas(heroCanvas);
  if (!isMobile) resizeCanvas(trailCanvas);
  resizeCanvas(juiceCanvas);
  drawFrame(currentFrameIdx);

  if (renderer) {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  }
});

// ═══════════════════════════════════════════
// 16. PRELOADER & INITIALIZATION
// ═══════════════════════════════════════════
function updatePreloader(pct) {
  const p = Math.min(pct, 100);
  preloaderFill.style.clipPath = `inset(${100 - p}% 0 0 0)`;
  preloaderBar.style.width = p + '%';
  preloaderStat.textContent = p >= 100 ? 'EXTRACTION COMPLETE' : `EXTRACTING JUICE ${Math.floor(p)}%`;
}

function init() {
  resizeCanvas(heroCanvas);

  // Init Three.js background
  try { initThreeBackground(); } catch (e) { console.warn('Three.js init failed:', e); }

  // Load frames
  let loaded = 0;
  for (let i = 0; i < TOTAL_FRAMES; i++) {
    const img = new Image();
    img.src = `/frames/ezgif-frame-${String(i + 1).padStart(3, '0')}.jpg`;
    img.onload = img.onerror = () => {
      loaded++;
      framesLoaded = loaded;
      updatePreloader((loaded / TOTAL_FRAMES) * 100);
      if (loaded >= TOTAL_FRAMES) launchSite();
    };
    frameImages[i] = img;
  }

  // Bind hover effects after shop cards are generated
  bindHoverEffects();
}

function launchSite() {
  updatePreloader(100);
  setTimeout(() => {
    preloaderEl.classList.add('done');
    setTimeout(() => preloaderEl.remove(), 1000);
    drawFrame(0);
    if (audioReady) sndPop.play();

    // Hero text entrance (delayed to follow intro)
    gsap.to('.hero-eyebrow', { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out', delay: 0.4 });
    gsap.to('.hero-title', { opacity: 1, y: 0, duration: 1.5, ease: 'power3.out', delay: 0.6 });
    gsap.to('.hero-subtitle', { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out', delay: 0.8 });

    // Re-bind hover effects for dynamically created elements
    bindHoverEffects();
  }, 600);
}

init();
