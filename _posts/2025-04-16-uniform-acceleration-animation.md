---
title: "Motion with Uniform Acceleration – Interactive Animation"
date: 2025-04-16 20:00:00 +0530
categories: [Physics, Animation]
tags: [kinematics, animation, motion, javascript, velocity, acceleration]
math: true
---

In this interactive animation, you can visualize the motion of an object moving along a straight line with **uniform acceleration**. You can specify the initial velocity and acceleration, and see how the object moves in real time.

The motion is based on the equation:

$$
x(t) = ut + \\frac{1}{2} a t^2
$$

where:
- \\( x(t) \\): displacement at time \\( t \\)
- \\( u \\): initial velocity (m/s)
- \\( a \\): acceleration (m/s²)

---

## 🔧 Try It Yourself!

<iframe style="width: 100%; height: 300px; border: none;" srcdoc="
<!DOCTYPE html>
<html>
<head>
  <meta charset='UTF-8'>
  <style>
    body {
      font-family: sans-serif;
      margin: 10px;
    }
    #controls {
      margin-bottom: 10px;
    }
    canvas {
      border: 1px solid #ccc;
      background: #f9f9f9;
      display: block;
    }
  </style>
</head>
<body>
  <div id='controls'>
    <label>Initial Velocity (u) [m/s]:
      <input type='number' id='initialVelocity' value='2'>
    </label>
    <label>Acceleration (a) [m/s²]:
      <input type='number' id='acceleration' value='1'>
    </label>
    <button id='startBtn'>Start</button>
    <button id='resetBtn'>Reset</button>
  </div>
  <canvas id='motionCanvas' width='700' height='150'></canvas>
  <script>
    const canvas = document.getElementById('motionCanvas');
    const ctx = canvas.getContext('2d');
    const startBtn = document.getElementById('startBtn');
    const resetBtn = document.getElementById('resetBtn');
    let u = 0, a = 0, startTime = null, animationId;

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
      const px = x * 50;

      resetCanvas();
      drawObject(px);

      if (px < canvas.width) {
        animationId = requestAnimationFrame(animate);
      }
    }

    function startAnimation() {
      cancelAnimationFrame(animationId);
      u = parseFloat(document.getElementById('initialVelocity').value);
      a = parseFloat(document.getElementById('acceleration').value);
      startTime = null;
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

## 🧠 What You Can Observe

- A **positive acceleration** causes the object to speed up.
- A **negative acceleration** (deceleration) will slow it down.
- You can try setting acceleration to zero and observe **uniform motion**.

Let me know if you'd like to extend this with velocity/time graphs or a pause/resume button!

---

