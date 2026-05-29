import { bgVert, bgFrag } from './shaders.js';
import { params } from './params.js';

const container = document.getElementById('bg-container');
if (!container) {
  console.error('No div with id "bg-container" found.');
}

const scene = new THREE.Scene();
const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setPixelRatio(0.75);
renderer.setSize(window.innerWidth, window.innerHeight);
container.appendChild(renderer.domElement);

const geometry = new THREE.PlaneGeometry(2, 2);

const blendModes = {
  normal: THREE.NormalBlending,
  additive: THREE.AdditiveBlending,
  subtractive: THREE.SubtractiveBlending,
  multiply: THREE.MultiplyBlending,
};

function newSeed() {
  return [Math.random() * 10, Math.random() * 10];
}
const seed = newSeed();

const bgMat = new THREE.ShaderMaterial({
  vertexShader: bgVert,
  fragmentShader: bgFrag,
  uniforms: {
    uTime: { value: 0.0 },
    uAspect: { value: window.innerWidth / window.innerHeight },
    uScale: { value: params.scale * 0.5 },
    uSeed: { value: new THREE.Vector2(seed[0], seed[1]) },
    uSpeed: { value: params.speed },
    uFbmOctaves: { value: params.fbmOctaves },
    uRidgeOctaves: { value: params.ridgeOctaves - 1 },
    uWarp1: { value: params.warp1 },
    uWarp2: { value: params.warp2 },
    uDetailsAmp: { value: params.detailsAmp },
    uVeilsAmp: { value: params.veilsAmp },
    uCMin: { value: params.contrastMin },
    uCMax: { value: params.contrastMax },
    uHotspotOn: { value: params.hotspotOn ? 1 : 0 },
    uHotspot: {
      value: new THREE.Vector4(
        params.hotspotX, params.hotspotY,
        params.hotspotInner * params.hotspotInner,
        params.hotspotOuter * params.hotspotOuter
      ),
    },
    uHotspotStrength: { value: params.hotspotStrength },
    uCanvasOpacity: { value: params.canvasOpacity },
    uBaseColor: {
      value: new THREE.Vector3(params.baseColorR, params.baseColorG, params.baseColorB),
    },
  },
  transparent: true,
  side: THREE.DoubleSide,
  blending: blendModes[params.blendMode] || THREE.NormalBlending,
});

const mesh = new THREE.Mesh(geometry, bgMat);
scene.add(mesh);

if (params.gradientOpacity > 0) {
  const gradientMaterial = new THREE.ShaderMaterial({
    vertexShader: `
      varying vec2 vUV;
      void main() {
        vUV = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      precision mediump float;
      varying vec2 vUV;
      uniform vec3 uCenterColor;
      uniform vec3 uOuterColor;
      uniform vec2 uCenter;
      uniform float uRadius;
      uniform float uStrength;
      uniform float uOpacity;
      void main() {
        float dist = distance(vUV, uCenter);
        float t = smoothstep(0.0, uRadius, dist);
        vec3 color = mix(uCenterColor, uOuterColor, t);
        gl_FragColor = vec4(color, uOpacity * uStrength);
      }
    `,
    uniforms: {
      uCenterColor: { value: new THREE.Color(params.gradientCenterColorR, params.gradientCenterColorG, params.gradientCenterColorB) },
      uOuterColor: { value: new THREE.Color(params.gradientOuterColorR, params.gradientOuterColorG, params.gradientOuterColorB) },
      uCenter: { value: new THREE.Vector2(params.gradientCenterX, params.gradientCenterY) },
      uRadius: { value: params.gradientRadius },
      uStrength: { value: params.gradientStrength },
      uOpacity: { value: params.gradientOpacity },
    },
    transparent: true,
    side: THREE.DoubleSide,
    blending: blendModes[params.gradientBlendMode] || THREE.NormalBlending,
  });
  const gradientMesh = new THREE.Mesh(geometry, gradientMaterial);
  scene.add(gradientMesh);
}

const clock = new THREE.Clock();
function animate() {
  requestAnimationFrame(animate);
  bgMat.uniforms.uTime.value = clock.getElapsedTime();
  renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
  const width = window.innerWidth;
  const height = window.innerHeight;
  renderer.setSize(width, height);
  bgMat.uniforms.uAspect.value = width / height;
});
