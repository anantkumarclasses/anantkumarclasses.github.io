---
title: "Electric Field near Conductors"
date: 2025-05-17
categories: [Physics, Interactive]
tags: [electric field, visualization, simulation, JavaScript, 3D]
pin: true
---

Understanding how conductors interact with electric fields is critical, yet visualizing them in 3D can be a challenge — until now!

I am excited to share an **interactive 3D electric field visualizer near a conductor** that allows you to:

- Choose between two conductor configurations:
  - A **grounded conducting plane**.
  - A **grounded conducting sphere**.
- Watch how the **electric field lines** automatically update in real-time based on the charge's position.
- Toggle between configurations and streamline visibility using the simple UI overlay.

<div align="center">
  <a href="/visualizer/" class="btn btn--primary">Launch Visualizer</a>
</div>

## 💡 What’s Happening Behind the Scenes?

The **method of images** to simulate how conductors alter the field pattern:
- For the **plane**, a mirror image charge is created.
- For the **sphere**, an image charge is calculated using the classic result from electrostatics.

The electric field is computed numerically and visualized using **streamlines**. Their **color changes with field strength**, giving you both direction and intensity information.

## 🛠 Built With
- [Three.js](https://threejs.org/) for 3D rendering
- JavaScript modules for real-time field calculations
- Custom streamline tracing logic using Catmull-Rom curves


📬 Let me know what features you'd like to see next — multiple charges? Capacitor plates?


