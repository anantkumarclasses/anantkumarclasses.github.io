import * as THREE from '../three/three.module.js';
import { OrbitControls } from '../three/controls/OrbitControls.js';
//import { CSS2DRenderer, CSS2DObject } from '../three/renderers/CSS2DRenderer.js';
import { TransformControls } from '../three/controls/TransformControls.js';



const wrap = document.getElementById('canvas-wrap');

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

const camera = new THREE.PerspectiveCamera(
    60,
    wrap.clientWidth / wrap.clientHeight,
    0.1,
    1000
);
// Default position for desktop
camera.position.set(6, 6, 8);

// If screen is narrow (mobile), zoom out more
if (window.innerWidth <= 768) {
    camera.position.set(10, 2, 10);
}

camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setSize(wrap.clientWidth, wrap.clientHeight);
renderer.setPixelRatio(window.devicePixelRatio || 1);
wrap.appendChild(renderer.domElement);


// Add a soft white light above the scene
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 10, 7);
scene.add(light);

// Add ambient light for softer shadows
const ambient = new THREE.AmbientLight(0xffffff, 0.3);
scene.add(ambient);

const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

// axis labels in overlay
const xLabel = makeTextSprite("X", { fontsize: 48, backgroundColor: { r: 255, g: 200, b: 200, a: 1 } });
xLabel.position.set(5, 0, -0.5);
scene.add(xLabel);

const yLabel = makeTextSprite("Y", { fontsize: 48, backgroundColor: { r: 200, g: 255, b: 200, a: 1 } });
yLabel.position.set(0.5, 5, 0.5);
scene.add(yLabel);

const zLabel = makeTextSprite("Z", { fontsize: 48, backgroundColor: { r: 200, g: 200, b: 255, a: 1 } });
zLabel.position.set(0.5, 0, 5);
scene.add(zLabel);


const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;


window.addEventListener('resize', () => {
    renderer.setSize(wrap.clientWidth, wrap.clientHeight);
    camera.aspect = wrap.clientWidth / wrap.clientHeight;

    if (window.innerWidth <= 768) {
        camera.position.set(8, 8, 10);
    } else {
        camera.position.set(6, 6, 8);
    }

    camera.updateProjectionMatrix();
});


// Simple sphere at the origin
//const sphereGeometry = new THREE.SphereGeometry(0.05, 32, 32);
//const sphereMaterial = new THREE.MeshStandardMaterial({ color: 0xff5555 });
//const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
//scene.add(sphere);

const particleGeo = new THREE.SphereGeometry(0.1,32,32);
const particleMat = new THREE.MeshStandardMaterial({emissive:0x77ccff,emissiveIntensity:0.6,metalness:0.3,roughness:0.4});
const particle = new THREE.Mesh(particleGeo,particleMat);
scene.add(particle);

let state = {
      pos: new THREE.Vector3(0,0,0),
      vel: new THREE.Vector3(1,0,0),
      t: 0
    };
    
// ---- TRAIL SETUP ----
const MAX_TRAIL_POINTS = 50000; // how many positions to keep
const trailPositions = new Float32Array(MAX_TRAIL_POINTS * 3); // x,y,z for each point
let trailIndex = 0;

const trailGeometry = new THREE.BufferGeometry();
trailGeometry.setAttribute('position', new THREE.BufferAttribute(trailPositions, 3));

const trailMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
const trailLine = new THREE.Line(trailGeometry, trailMaterial);
scene.add(trailLine);


    function getE(){
      return new THREE.Vector3(
        parseFloat(document.getElementById('Ex').value)||0,
        parseFloat(document.getElementById('Ey').value)||0,
        parseFloat(document.getElementById('Ez').value)||0
      );
    }
    function getB(){
      return new THREE.Vector3(
        parseFloat(document.getElementById('Bx').value)||0,
        parseFloat(document.getElementById('By').value)||0,
        parseFloat(document.getElementById('Bz').value)||0
      );
    }
    function getParams(){
      return {
        q: parseFloat(document.getElementById('q').value) || 0,
        m: parseFloat(document.getElementById('m').value) || 1,
        dt: parseFloat(document.getElementById('dt').value) || 0.01
      };
    }

    function lorentzAccel(v, E, B, q, m){
      //Calculate v x B
      const vxB = new THREE.Vector3().copy(v).cross(B);
      // Start with (q/m) (E + v × B)
      const accel = new THREE.Vector3().copy(E).add(vxB).multiplyScalar(q / m);

    // If damping is enabled, add -k * v term
      const dampingEnabled = document.getElementById('enableDamping')?.checked;
      if (dampingEnabled) {
        const k = parseFloat(document.getElementById('damping')?.value) || 0;
        accel.add(v.clone().multiplyScalar(-k / m));
      }

      return accel;
    }

    function rk4Step(pos, vel, dt, E, B, q, m){
      const a1 = lorentzAccel(vel, E, B, q, m);
      const k1v = a1.clone().multiplyScalar(dt);
      const k1x = vel.clone().multiplyScalar(dt);

      const vel2 = vel.clone().add(k1v.clone().multiplyScalar(0.5));
      const a2 = lorentzAccel(vel2, E, B, q, m);
      const k2v = a2.clone().multiplyScalar(dt);
      const k2x = vel.clone().add(k1v.clone().multiplyScalar(0.5)).multiplyScalar(dt);

      const vel3 = vel.clone().add(k2v.clone().multiplyScalar(0.5));
      const a3 = lorentzAccel(vel3, E, B, q, m);
      const k3v = a3.clone().multiplyScalar(dt);
      const k3x = vel.clone().add(k2v.clone().multiplyScalar(0.5)).multiplyScalar(dt);

      const vel4 = vel.clone().add(k3v);
      const a4 = lorentzAccel(vel4, E, B, q, m);
      const k4v = a4.clone().multiplyScalar(dt);
      const k4x = vel.clone().add(k3v).multiplyScalar(dt);

      const dv = k1v.clone().add(k2v.clone().multiplyScalar(2)).add(k3v.clone().multiplyScalar(2)).add(k4v).multiplyScalar(1/6);
      const dx = k1x.clone().add(k2x.clone().multiplyScalar(2)).add(k3x.clone().multiplyScalar(2)).add(k4x).multiplyScalar(1/6);

      pos.add(dx);
      vel.add(dv);
    }
  
  

// ---- UPDATE TRAIL ----
function updateTrail() {
    // Shift points left if full (like a moving window)
    if (trailIndex >= MAX_TRAIL_POINTS) {
        for (let i = 0; i < (MAX_TRAIL_POINTS - 1) * 3; i++) {
            trailPositions[i] = trailPositions[i + 3];
        }
        trailIndex = MAX_TRAIL_POINTS - 1;
    }

    // Write new point
    trailPositions[trailIndex * 3]     = state.pos.x;
    trailPositions[trailIndex * 3 + 1] = state.pos.y;
    trailPositions[trailIndex * 3 + 2] = state.pos.z;

    trailIndex++;

    // Update the draw range (so it doesn't show garbage for unused points)
    trailGeometry.setDrawRange(0, trailIndex);

    // Tell WebGL to re-upload the changed vertex positions
    trailGeometry.attributes.position.needsUpdate = true;
}


    document.getElementById('start').addEventListener('click', ()=>{running=true});
    document.getElementById('pause').addEventListener('click', ()=>{running=false});
    document.getElementById('reset').addEventListener('click', ()=>{resetSim()});
    document.getElementById('step').addEventListener('click', ()=>{stepSim()});

function resetSim(){
    state.pos.set(0, 0, 0);
    state.vel.set(
        parseFloat(document.getElementById('vx').value) || 0,
        parseFloat(document.getElementById('vy').value) || 0,
        parseFloat(document.getElementById('vz').value) || 0
    );
    state.t = 0;

    // Clear all trail points to origin
    for (let i = 0; i < trailPositions.length; i++) {
        trailPositions[i] = 0;
    }
    trailIndex = 0;

    // Tell Three.js the geometry has changed
    trailGeometry.attributes.position.needsUpdate = true;

    updateObjects();
}



    function stepSim(){
      const p = getParams();
      rk4Step(state.pos, state.vel, p.dt, getE(), getB(), p.q, p.m);
      state.t += p.dt;
      trailPoints.push(state.pos.clone());
      updateTrail();
      updateObjects();
    }

function makeTextSprite(message, parameters) {
    if (parameters === undefined) parameters = {};
    const fontface = parameters.hasOwnProperty("fontface") ? parameters["fontface"] : "Arial";
    const fontsize = parameters.hasOwnProperty("fontsize") ? parameters["fontsize"] : 48;
    const borderThickness = parameters.hasOwnProperty("borderThickness") ? parameters["borderThickness"] : 4;
    const borderColor = parameters.hasOwnProperty("borderColor") ? parameters["borderColor"] : { r:0, g:0, b:0, a:1.0 };
    const backgroundColor = parameters.hasOwnProperty("backgroundColor") ? parameters["backgroundColor"] : { r:255, g:255, b:255, a:1.0 };
    const textColor = parameters.hasOwnProperty("textColor") ? parameters["textColor"] : { r:0, g:0, b:0, a:1.0 };

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    context.font = fontsize + "px " + fontface;

    // background
    context.fillStyle = `rgba(${backgroundColor.r},${backgroundColor.g},${backgroundColor.b},${backgroundColor.a})`;
    const textWidth = context.measureText(message).width;
    context.fillRect(0, 0, textWidth + borderThickness * 4, fontsize + borderThickness * 4);

    // border
    context.strokeStyle = `rgba(${borderColor.r},${borderColor.g},${borderColor.b},${borderColor.a})`;
    context.lineWidth = borderThickness;
    context.strokeRect(0, 0, textWidth + borderThickness * 4, fontsize + borderThickness * 4);

    // text
    context.fillStyle = `rgba(${textColor.r},${textColor.g},${textColor.b},${textColor.a})`;
    context.fillText(message, borderThickness, fontsize + borderThickness / 2);

    const texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;

    const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
    const sprite = new THREE.Sprite(spriteMaterial);
    sprite.scale.set(1.5, 0.75, 1); // adjust size in scene
    return sprite;
}


function updateObjects() {
    particle.position.copy(state.pos);

    document.getElementById('time').textContent = state.t.toFixed(3);
    document.getElementById('speed').textContent = state.vel.length().toFixed(4);

    const params = getParams();
    const E = getE();
    const B = getB();
    const F = lorentzAccel(state.vel, E, B, params.q, 1).multiplyScalar(params.m);

    document.getElementById('force').textContent = F.length().toFixed(4);
   
    
}


    let running = false;
    let lastRAF = performance.now();
    function animate(now){
      requestAnimationFrame(animate);
      const elapsed = (now-lastRAF)/1000;
      lastRAF = now;
      if(running){
        const p = getParams();
        const steps = Math.max(1, Math.ceil(elapsed / p.dt));
        for(let i=0;i<steps;i++){
          rk4Step(state.pos, state.vel, p.dt, getE(), getB(), p.q, p.m);
          state.t += p.dt;
          updateTrail();
        }
        updateObjects();
      }
      renderer.render(scene,camera);
      
    }
    animate(performance.now());

    resetSim();

