---
title: "Motion with Uniform Acceleration – Animation & Graphs"
date: 2025-04-16 21:00:00 +0530
categories: [Physics, Animation]
tags: [kinematics, animation, motion, velocity, acceleration, graph]
pin: false
math: true
---

This interactive visualization lets you explore the motion of an object moving along a straight line with **uniform acceleration**. You can specify the initial velocity $$ u $$ and acceleration $$ a $$. The animation and graphs update in real time.

### Equation of Motion

$$
x(t) = ut + \frac{1}{2} a t^2 \quad\text{and}\quad v(t) = u + at
$$

---

## 🎬 Animation + Graphs

<iframe style="width: 100%; height: 500px; border: none;" srcdoc="
<!DOCTYPE html>
<html>
<head>
  <meta charset='UTF-8'>
  <script src='https://cdn.jsdelivr.net/npm/chart.js'></script>
  <style>
    body {
      font-family: sans-serif;
      margin: 0;
      padding: 10px;
    }
    #controls {
      margin-bottom: 10px;
    }
    canvas {
      border: 1px solid #ccc;
      background: #f9f9f9;
    }
    #layout {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
    }
    #animationArea {
      flex: 1 1 100%;
    }
    #graphs {
      display: flex;
      flex-direction: column;
      gap: 10px;
      flex: 1 1 100%;
    }
    @media (min-width: 800px) {
      #animationArea {
        flex: 1 1 40%;
      }
      #graphs {
        flex: 1 1 58%;
      }
    }
  </style>
</head>
<body>
  <div id='controls'>
    <label>Initial Velocity (u) [m/s]: <input type='number' id='initialVelocity' value='2'></label>
    <label>Acceleration (a) [m/s²]: <input type='number' id='acceleration' value='1'></label>
    <button id='startBtn'>Start</button>
    <button id='resetBtn'>Reset</button>
  </div>

  <div id='layout'>
    <div id='animationArea'>
      <canvas id='motionCanvas' width='600' height='150'></canvas>
    </div>
    <div id='graphs'>
      <canvas id='positionGraph'></canvas>
      <canvas id='velocityGraph'></canvas>
    </div>
  </div>

  <script>
    const canvas = document.getElementById('motionCanvas');
    const ctx = canvas.getContext('2d');
    const startBtn = document.getElementById('startBtn');
    const resetBtn = document.getElementById('resetBtn');
    let u = 0, a = 0, startTime = null, animationId;
    let dataTime = [], dataX = [], dataV = [];

    const posCtx = document.getElementById('positionGraph').getContext('2d');
    const velCtx = document.getElementById('velocityGraph').getContext('2d');

    const positionChart = new Chart(posCtx, {
      type: 'line',
      data: {
        labels: dataTime,
        datasets: [{
          label: 'Displacement (m)',
          data: dataX,
          borderColor: 'blue',
          tension: 0.2
        }]
      },
      options: {
        scales: {
          x: { title: { display: true, text: 'Time (s)' }},
          y: { title: { display: true, text: 'Position (m)' }}
        }
      }
    });

    const velocityChart = new Chart(velCtx, {
      type: 'line',
      data: {
        labels: dataTime,
        datasets: [{
          label: 'Velocity (m/s)',
          data: dataV,
          borderColor: 'green',
          tension: 0.2
        }]
      },
      options: {
        scales: {
          x: { title: { display: true, text: 'Time (s)' }},
          y: { title: { display: true, text: 'Velocity (m/s)' }}
        }
      }
    });

    function resetCanvas() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#000';
      ctx.fillRect(0, canvas.height / 2 - 2, canvas.width, 4);
    }

    function drawObject(x) {
      ctx.fillStyle = 'red';
      ctx.beginPath();
      ctx.arc(x, canvas.height / 2, 10, 0, 2 * Math.PI);
      ctx.fill();
    }

    function animate(timestamp) {
      if (!startTime) startTime = timestamp;
      const t = (timestamp - startTime) / 1000;
      const x = u * t + 0.5 * a * t * t;
      const v = u + a * t;
      const px = x * 50;

      resetCanvas();
      drawObject(px);

      if (t - (dataTime.at(-1) || -1) > 0.1) {
        dataTime.push(t.toFixed(2));
        dataX.push(x.toFixed(2));
        dataV.push(v.toFixed(2));
        positionChart.update();
        velocityChart.update();
      }

      if (px < canvas.width) {
        animationId = requestAnimationFrame(animate);
      }
    }

    function startAnimation() {
      cancelAnimationFrame(animationId);
      u = parseFloat(document.getElementById('initialVelocity').value);
      a = parseFloat(document.getElementById('acceleration').value);
      startTime = null;
      dataTime.length = 0;
      dataX.length = 0;
      dataV.length = 0;
      positionChart.update();
      velocityChart.update();
      resetCanvas();
      animationId = requestAnimationFrame(animate);
    }

    startBtn.addEventListener('click', startAnimation);
    resetBtn.addEventListener('click', startAnimation);

    resetCanvas();
  </script>
</body>
</html>
"></iframe>

---

## 🧠 What You Can Learn

- How position and velocity evolve under constant acceleration
- Effect of changing initial velocity or acceleration
- The parabolic shape of the **position-time** graph
- The linear shape of the **velocity-time** graph

---

