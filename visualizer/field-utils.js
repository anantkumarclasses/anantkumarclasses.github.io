import * as THREE from './three/three.module.js';

export function drawStreamlines(realCharge, conductorType, scene, fieldLines) {
  fieldLines.forEach(line => scene.remove(line));
  fieldLines.length = 0;

  const stepSize = 0.1;
  const steps = 200;
  const seeds = generateSeedPoints(realCharge.position, 90);
  const R = 1.0; // Radius of grounded sphere

  const charges = [
    { q: realCharge.q, pos: [realCharge.position.x, realCharge.position.y, realCharge.position.z] }
  ];

  // Add image charge based on conductor type
  if (conductorType === 'sphere') {
    const r0 = realCharge.position.length();
    const imageMag = -1 * R / r0;
    const imagePos = realCharge.position.clone().multiplyScalar(R * R / (r0 * r0));
    charges.push({ q: imageMag, pos: [imagePos.x, imagePos.y, imagePos.z] });
  } else if (conductorType === 'plane') {
    const imagePos = realCharge.position.clone();
    imagePos.x *= -1;
    charges.push({ q: -realCharge.q, pos: [imagePos.x, imagePos.y, imagePos.z] });
  }

  const isValid = (x, y, z) => {
    if (conductorType === 'plane') return x >= -0.01;
    if (conductorType === 'sphere') return Math.sqrt(x * x + y * y + z * z) >= 0.95 * R;
    return true;
  };

  for (let seed of seeds) {
    traceLine(seed, +1, charges, fieldLines, scene, stepSize, steps, isValid);
    traceLine(seed, -1, charges, fieldLines, scene, stepSize, steps, isValid);
  }
}


function generateSeedPoints(position, count) {
  const seeds = [];
  const radius = 0.7;
  for (let i = 0; i < count; i++) {
    const theta = Math.acos(1 - 2 * (i + 0.5) / count);
    const phi = Math.PI * (1 + Math.sqrt(5)) * i;
    const x = position.x + radius * Math.sin(theta) * Math.cos(phi);
    const y = position.y + radius * Math.sin(theta) * Math.sin(phi);
    const z = position.z + radius * Math.cos(theta);
    seeds.push([x, y, z]);
  }
  return seeds;
}

function electricFieldAt(x, y, z, charges) {
  let Ex = 0, Ey = 0, Ez = 0;
  for (let { q, pos } of charges) {
    const dx = x - pos[0];
    const dy = y - pos[1];
    const dz = z - pos[2];
    let r2 = dx * dx + dy * dy + dz * dz;
    if (r2 === 0) r2 = 0.0001;
    const r3 = Math.pow(r2, 1.5);
    Ex += q * dx / r3;
    Ey += q * dy / r3;
    Ez += q * dz / r3;
  }
  return [Ex, Ey, Ez];
}

function fieldStrengthColorOld(mag) {
  const c = Math.min(1, mag / 1.5);
  return new THREE.Color(c, c, 0);
}

function fieldStrengthColor(mag) {
  const minField = 0.01, maxField = 5.0;
  const t = Math.min(1, Math.max(0, (mag - minField) / (maxField - minField)));
  let r, g, b;
  if (t < 0.5) {
    r = 0;
    g = t * 2;
    b = 1 - t * 2;
  } else {
    r = (t - 0.5) * 2;
    g = 1 - (t - 0.5) * 2;
    b = 0;
  }
  return new THREE.Color(r, g, b);
}

function traceLine(seed, direction, charges, fieldLines, scene, stepSize, steps, isValid) {
  let [x, y, z] = seed;
  const controlPoints = [];
  for (let i = 0; i < steps; i++) {
    if (!isValid(x, y, z)) break;
    const [Ex, Ey, Ez] = electricFieldAt(x, y, z, charges);
    const mag = Math.sqrt(Ex * Ex + Ey * Ey + Ez * Ez);
    if (mag < 0.0001) break;
    controlPoints.push(new THREE.Vector3(x, y, z));
    const scale = direction * stepSize / mag;
    x += Ex * scale;
    y += Ey * scale;
    z += Ez * scale;
  }
  if (controlPoints.length < 2) return;
  const curve = new THREE.CatmullRomCurve3(controlPoints);
  const curvePoints = curve.getPoints(controlPoints.length * 5);
  const positions = [], colors = [];
  for (let point of curvePoints) {
    const [Ex, Ey, Ez] = electricFieldAt(point.x, point.y, point.z, charges);
    const mag = Math.sqrt(Ex * Ex + Ey * Ey + Ez * Ez);
    const color = fieldStrengthColor(mag);
    positions.push(point.x, point.y, point.z);
    colors.push(color.r, color.g, color.b);
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  const material = new THREE.LineBasicMaterial({ vertexColors: true });
  const line = new THREE.Line(geometry, material);
  scene.add(line);
  fieldLines.push(line);
}

export function clearFieldLines(scene, fieldLines) {
  fieldLines.forEach(obj => {
    if (obj instanceof THREE.Object3D) {
      scene.remove(obj);
      if (obj.geometry) obj.geometry.dispose();
      if (obj.material) obj.material.dispose();
    }
  });
  fieldLines.length = 0;
}

export function drawConductor(scene, conductorType) {
  // Remove old conductor
  if (scene.userData.conductor instanceof THREE.Object3D) {
    scene.remove(scene.userData.conductor);
    scene.userData.conductor.geometry.dispose();
    scene.userData.conductor.material.dispose();
    delete scene.userData.conductor; 
  }

  let conductor = null;

  if (conductorType === 'sphere') {
    const geometry = new THREE.SphereGeometry(1.0, 32, 32); // R = 1
    const material = new THREE.MeshStandardMaterial({
      color: 0x7debeb,
      metalness: 0.8,
      roughness: 0.2,
    });
    conductor = new THREE.Mesh(geometry, material);

  } else if (conductorType === 'plane') {
    const geometry = new THREE.BoxGeometry(40, 40, 0.08);
    const material = new THREE.MeshStandardMaterial({
      color: 0x7debeb,
      metalness: 0.8,
      roughness: 0.2,
      side: THREE.DoubleSide
    });
    conductor = new THREE.Mesh(geometry, material);
    conductor.rotation.y = Math.PI / 2;
    conductor.position.x = 0;
  }

  if (conductor) {
    scene.add(conductor);
    scene.userData.conductor = conductor;
  }
}



