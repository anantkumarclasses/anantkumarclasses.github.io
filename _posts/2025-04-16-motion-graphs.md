
---
layout: post
title: "Interactive Motion Graphs "
---

<p>Slide the slider below to see how position, velocity, and acceleration change dynamically over time:</p>

<div class="motion-graph-container">
  <canvas id="canvas" width="1000" height="600"></canvas>
  <input type="range" id="slider" min="0" max="100" value="50">
</div>

<style>
  .motion-graph-container {
    max-width: 1000px;
    margin: 0 auto;
  }

  canvas {
    width: 100%;
    height: auto;
    border: 1px solid #ccc;
  }

  #slider {
    width: 100%;
    margin: 1rem auto;
    display: block;
  }
</style>

<script>
  const slider = document.getElementById("slider");
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");

  let data = [];
  let lastTime = performance.now();
  let lastPos = +slider.value;
  let lastVel = 0;
  const MAX_POINTS = 300;

  function updateData() {
    const now = performance.now();
    const dt = (now - lastTime) / 1000;
    const pos = +slider.value;
    const vel = (pos - lastPos) / dt;
    const acc = (vel - lastVel) / dt;
    data.push({ t: now / 1000, pos, vel, acc });
    if (data.length > MAX_POINTS) data.shift();
    lastTime = now;
    lastPos = pos;
    lastVel = vel;
  }

  function drawGraph(values, yOffset, label, color, graphHeight, width) {
    ctx.save();
    ctx.translate(0, yOffset);
    ctx.fillStyle = "#f9f9f9";
    ctx.fillRect(0, 0, width, graphHeight);
    ctx.strokeStyle = "#000";
    ctx.strokeRect(0, 0, width, graphHeight);
    ctx.fillStyle = "#000";
    ctx.fillText(label, 10, 15);
    ctx.beginPath();
    ctx.strokeStyle = color;

    const max = Math.max(...values.map(v => Math.abs(v))) || 1;

    for (let i = 0; i < values.length; i++) {
      const x = (i / MAX_POINTS) * width;
      const y = graphHeight / 2 - (values[i] / max) * (graphHeight / 2) * 0.9;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }

    ctx.stroke();
    ctx.restore();
  }

  function draw() {
    updateData();
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    canvas.width = width;
    canvas.height = height;

    const graphHeight = height / 3;

    ctx.clearRect(0, 0, width, height);

 function smooth(array, windowSize = 5) {
  const result = [];
  for (let i = 0; i < array.length; i++) {
    const start = Math.max(0, i - windowSize + 1);
    const slice = array.slice(start, i + 1);
    const avg = slice.reduce((sum, val) => sum + val, 0) / slice.length;
    result.push(avg);
  }
  return result;
}

// Smooth the raw data
const positions = smooth(data.map(d => d.pos));
const velocities = smooth(data.map(d => d.vel));
const accelerations = smooth(data.map(d => d.acc));


    drawGraph(positions, 0, "Position", "blue", graphHeight, width);
    drawGraph(velocities, graphHeight, "Velocity", "green", graphHeight, width);
    drawGraph(accelerations, 2 * graphHeight, "Acceleration", "red", graphHeight, width);

    requestAnimationFrame(draw);
  }

  draw();
</script>

