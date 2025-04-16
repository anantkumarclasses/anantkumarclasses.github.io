---
layout: post
title: "Interactive Motion Graphs"
---

<p>This animation shows how position, velocity, and acceleration change over time as you move the slider:</p>

<div style="text-align:center;">
  <canvas id="canvas" width="800" height="600"></canvas><br>
  <input type="range" id="slider" min="0" max="100" value="50">
</div>

<script>
  const slider = document.getElementById("slider");
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");

  const WIDTH = canvas.width;
  const HEIGHT = canvas.height;
  const GRAPH_HEIGHT = HEIGHT / 3;

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

  function drawGraph(values, yOffset, label, color) {
    ctx.save();
    ctx.translate(0, yOffset);
    ctx.fillStyle = "#f9f9f9";
    ctx.fillRect(0, 0, WIDTH, GRAPH_HEIGHT);
    ctx.strokeStyle = "#000";
    ctx.strokeRect(0, 0, WIDTH, GRAPH_HEIGHT);
    ctx.fillStyle = "#000";
    ctx.fillText(label, 10, 15);

    ctx.beginPath();
    ctx.strokeStyle = color;

    const max = Math.max(...values.map(v => Math.abs(v))) || 1;

    for (let i = 0; i < values.length; i++) {
      const x = (i / MAX_POINTS) * WIDTH;
      const y = GRAPH_HEIGHT / 2 - (values[i] / max) * (GRAPH_HEIGHT / 2) * 0.9;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }

    ctx.stroke();
    ctx.restore();
  }

  function draw() {
    updateData();

    ctx.clearRect(0, 0, WIDTH, HEIGHT);

    const positions = data.map(d => d.pos);
    const velocities = data.map(d => d.vel);
    const accelerations = data.map(d => d.acc);

    drawGraph(positions, 0, "Position", "blue");
    drawGraph(velocities, GRAPH_HEIGHT, "Velocity", "green");
    drawGraph(accelerations, 2 * GRAPH_HEIGHT, "Acceleration", "red");

    requestAnimationFrame(draw);
  }

  draw();
</script>

