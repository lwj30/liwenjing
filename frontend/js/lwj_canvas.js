/*
 * 姓名：李汶静 | 学号：24001011030 | 时间：2026-11-19 | 大模型：Tencent Hunyuan Hy
 */
(function lwj_initBackground() {
  const lwj_canvas = document.getElementById('lwj_canvas');
  if (!lwj_canvas) {
    console.error('[lwj_canvas] 未找到画布元素 #lwj_canvas');
    return;
  }

  const lwj_ctx = lwj_canvas.getContext('2d');
  const lwj_particleCount = 72;
  const lwj_linkDistance = 132;
  let lwj_width = 0;
  let lwj_height = 0;
  let lwj_particles = [];

  function lwj_resize() {
    lwj_width = window.innerWidth;
    lwj_height = window.innerHeight;
    lwj_canvas.width = lwj_width;
    lwj_canvas.height = lwj_height;
  }

  function lwj_createParticle() {
    return {
      lwj_x: Math.random() * lwj_width,
      lwj_y: Math.random() * lwj_height,
      lwj_vx: (Math.random() - 0.5) * 0.45,
      lwj_vy: (Math.random() - 0.5) * 0.45,
      lwj_radius: Math.random() * 1.6 + 0.8
    };
  }

  function lwj_buildParticles() {
    lwj_particles = [];
    for (let lwj_i = 0; lwj_i < lwj_particleCount; lwj_i += 1) {
      lwj_particles.push(lwj_createParticle());
    }
  }

  function lwj_moveParticle(lwj_particle) {
    lwj_particle.lwj_x += lwj_particle.lwj_vx;
    lwj_particle.lwj_y += lwj_particle.lwj_vy;

    if (lwj_particle.lwj_x < 0 || lwj_particle.lwj_x > lwj_width) {
      lwj_particle.lwj_vx *= -1;
    }
    if (lwj_particle.lwj_y < 0 || lwj_particle.lwj_y > lwj_height) {
      lwj_particle.lwj_vy *= -1;
    }
  }

  function lwj_drawLinks() {
    for (let lwj_i = 0; lwj_i < lwj_particles.length; lwj_i += 1) {
      for (let lwj_j = lwj_i + 1; lwj_j < lwj_particles.length; lwj_j += 1) {
        const lwj_a = lwj_particles[lwj_i];
        const lwj_b = lwj_particles[lwj_j];
        const lwj_dx = lwj_a.lwj_x - lwj_b.lwj_x;
        const lwj_dy = lwj_a.lwj_y - lwj_b.lwj_y;
        const lwj_distance = Math.sqrt(lwj_dx * lwj_dx + lwj_dy * lwj_dy);

        if (lwj_distance < lwj_linkDistance) {
          lwj_ctx.strokeStyle = `rgba(130, 170, 255, ${(1 - lwj_distance / lwj_linkDistance) * 0.22})`;
          lwj_ctx.lineWidth = 0.7;
          lwj_ctx.beginPath();
          lwj_ctx.moveTo(lwj_a.lwj_x, lwj_a.lwj_y);
          lwj_ctx.lineTo(lwj_b.lwj_x, lwj_b.lwj_y);
          lwj_ctx.stroke();
        }
      }
    }
  }

  function lwj_drawParticles() {
    for (let lwj_i = 0; lwj_i < lwj_particles.length; lwj_i += 1) {
      const lwj_particle = lwj_particles[lwj_i];
      lwj_ctx.fillStyle = 'rgba(186, 212, 255, 0.75)';
      lwj_ctx.beginPath();
      lwj_ctx.arc(lwj_particle.lwj_x, lwj_particle.lwj_y, lwj_particle.lwj_radius, 0, Math.PI * 2);
      lwj_ctx.fill();
    }
  }

  function lwj_animate() {
    lwj_ctx.clearRect(0, 0, lwj_width, lwj_height);
    for (let lwj_i = 0; lwj_i < lwj_particles.length; lwj_i += 1) {
      lwj_moveParticle(lwj_particles[lwj_i]);
    }
    lwj_drawLinks();
    lwj_drawParticles();
    window.requestAnimationFrame(lwj_animate);
  }

  window.addEventListener('resize', function lwj_onResize() {
    lwj_resize();
    lwj_buildParticles();
  });

  lwj_resize();
  lwj_buildParticles();
  lwj_animate();
  console.log('[lwj_canvas] 背景粒子动画已启动');
}());
