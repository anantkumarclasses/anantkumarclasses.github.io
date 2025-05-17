import * as THREE from './three/three.module.js';
import { OrbitControls } from './three/controls/OrbitControls.js';
import { TransformControls } from './three/controls/TransformControls.js';
import { drawStreamlines, clearFieldLines, drawConductor } from './field-utils.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(6, 4, 6);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(5, 1, 1);
scene.add(directionalLight);

const fieldLines = [];
let conductorType = 'sphere';

const realCharge = {
  q: 1,
  position: new THREE.Vector3(2.5, 0, 0)
};

const chargeMesh = new THREE.Mesh(
  new THREE.SphereGeometry(0.1, 32, 32),
  new THREE.MeshPhysicalMaterial({ color: 0xffff00 })
);
chargeMesh.position.copy(realCharge.position);
scene.add(chargeMesh);

const transformControls = new TransformControls(camera, renderer.domElement);
transformControls.setMode('translate');
transformControls.attach(chargeMesh);
scene.add(transformControls);

transformControls.addEventListener('dragging-changed', function (event) {
  controls.enabled = !event.value;
});

transformControls.addEventListener('objectChange', () => {
  realCharge.position.copy(chargeMesh.position);
  clearFieldLines(scene, fieldLines);
  drawStreamlines(realCharge, conductorType, scene, fieldLines);
 });

drawConductor(scene, conductorType);
drawStreamlines(realCharge, conductorType, scene, fieldLines);

//const dropdown = document.createElement('select');
//['plane', 'sphere'].forEach(type => {
//  const option = document.createElement('option');
 // option.value = type;
 // option.text = type;
 // dropdown.appendChild(option);
//});
//dropdown.value = conductorType;
//dropdown.onchange = () => {
//  conductorType = dropdown.value;
//  clearFieldLines(scene, fieldLines);
//  drawConductor(scene, conductorType);
//  drawStreamlines(realCharge, conductorType, scene, fieldLines);
//};
//document.body.appendChild(dropdown);

//const checkbox = document.createElement('input');
//checkbox.type = 'checkbox';
//checkbox.checked = true;
//checkbox.onchange = () => {
//  fieldLines.forEach(line => line.visible = checkbox.checked);
//};
//document.body.appendChild(checkbox);


document.getElementById('conductor-select').addEventListener('change', (e) => {
  conductorType = e.target.value;
  clearFieldLines(scene, fieldLines);
  drawConductor(scene, conductorType);
  drawStreamlines(realCharge, conductorType, scene, fieldLines);
});

document.getElementById('toggle-field').addEventListener('change', (e) => {
  fieldLines.forEach(line => line.visible = e.target.checked);
});

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();




