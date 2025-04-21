// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.z = 30;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new THREE.OrbitControls(camera, renderer.domElement);

// Parameters
const params = {
  R: 5,
  M: 2
};

// Function to generate geometry
function generateSurface(R, M) {
  const geometry = new THREE.PlaneGeometry(40, 40, 100, 100);
  const positionAttr = geometry.attributes.position;
  
  for (let i = 0; i < positionAttr.count; i++) {
    const x = positionAttr.getX(i);
    const y = positionAttr.getY(i);
    const denom = (x**2 + y**3)/(R**2) + M;
    const z = -1 / denom;
    positionAttr.setZ(i, z);
  }

  positionAttr.needsUpdate = true;
  geometry.computeVertexNormals();
  return geometry;
}

// Mesh and material
let material = new THREE.MeshNormalMaterial({ wireframe: false, side: THREE.DoubleSide });
let mesh = new THREE.Mesh(generateSurface(params.R, params.M), material);
scene.add(mesh);

// GUI
const gui = new dat.GUI();
gui.add(params, 'R', 1, 10).onChange(updateSurface);
gui.add(params, 'M', 0.1, 10).onChange(updateSurface);

function updateSurface() {
  scene.remove(mesh);
  mesh.geometry.dispose();
  mesh = new THREE.Mesh(generateSurface(params.R, params.M), material);
  scene.add(mesh);
}

// Animate
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();
