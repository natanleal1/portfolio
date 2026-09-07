/**
 * NaloNet / Natan Leal Portfolio JS Engine
 * Handles:
 * - Particle Constellation Canvas & Cyber Grid Background
 * - Windows XP / 7 Aero Interactive Desktop (Tech Stack Explorer)
 * - Typing Code Terminal Effect
 * - Mobile Navigation Menu & Theme Switcher
 */

document.addEventListener('DOMContentLoaded', () => {
  // -------------------------------------------------------------------
  // 1. Mobile Menu & Theme Controls
  // -------------------------------------------------------------------
  const navbar = document.querySelector(".navbar");
  const lightModeBtn = document.querySelector(".fa-gear");
  const menuIcon = document.querySelector(".fa-bars");

  if (menuIcon && navbar) {
    menuIcon.addEventListener("click", () => {
      navbar.classList.toggle("active");
      menuIcon.classList.toggle("fa-xmark");
    });

    // Close navbar when clicking a nav link on mobile
    navbar.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        navbar.classList.remove("active");
        if (menuIcon) menuIcon.classList.remove("fa-xmark");
      });
    });
  }

  if (lightModeBtn) {
    // Check local storage for theme preference
    const savedTheme = localStorage.getItem("nalo_theme");
    if (savedTheme === "light") {
      document.body.classList.add("light");
    }

    lightModeBtn.addEventListener("click", () => {
      document.body.classList.toggle("light");
      const isLight = document.body.classList.contains("light");
      localStorage.setItem("nalo_theme", isLight ? "light" : "dark");
    });
  }

  // -------------------------------------------------------------------
  // 2. Interactive Canvas Particles & Cyber Constellation
  // -------------------------------------------------------------------
  const canvas = document.getElementById("bg-canvas");
  if (canvas) {
    const ctx = canvas.getContext("2d");
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let particles = [];
    const particleCount = window.innerWidth < 768 ? 35 : 70;
    const maxDistance = 120;

    let mouse = { x: null, y: null, radius: 150 };

    window.addEventListener("mousemove", (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    window.addEventListener("mouseleave", () => {
      mouse.x = null;
      mouse.y = null;
    });

    window.addEventListener("resize", () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initParticles();
    });

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.8;
        this.vy = (Math.random() - 0.5) * 0.8;
        this.size = Math.random() * 2 + 1;
        this.color = Math.random() > 0.3 ? "#00F0FF" : "#0072FF";
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

        // Mouse interaction
        if (mouse.x !== null && mouse.y !== null) {
          let dx = mouse.x - this.x;
          let dy = mouse.y - this.y;
          let dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouse.radius) {
            let angle = Math.atan2(dy, dx);
            let force = (mouse.radius - dist) / mouse.radius;
            this.x -= Math.cos(angle) * force * 2;
            this.y -= Math.sin(angle) * force * 2;
          }
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 8;
        ctx.shadowColor = this.color;
        ctx.fill();
        ctx.shadowBlur = 0; // Reset
      }
    }

    function initParticles() {
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);

      // Draw faint grid
      const isLight = document.body.classList.contains("light");
      ctx.strokeStyle = isLight ? "rgba(0, 102, 255, 0.03)" : "rgba(0, 240, 255, 0.03)";
      ctx.lineWidth = 1;
      const gridSize = 40;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw particles & links
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();

        for (let j = i + 1; j < particles.length; j++) {
          let dx = particles[i].x - particles[j].x;
          let dy = particles[i].y - particles[j].y;
          let dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDistance) {
            let opacity = 1 - dist / maxDistance;
            ctx.strokeStyle = isLight 
              ? `rgba(0, 102, 255, ${opacity * 0.25})` 
              : `rgba(0, 240, 255, ${opacity * 0.25})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(animate);
    }

    initParticles();
    animate();
  }

  // -------------------------------------------------------------------
  // 3. Typing Code Terminal Effect
  // -------------------------------------------------------------------
  const typewriterElements = document.querySelectorAll('.typewriter-text');
  typewriterElements.forEach(el => {
    const fullText = el.getAttribute('data-text') || el.innerText;
    el.innerText = '';
    let idx = 0;

    function type() {
      if (idx < fullText.length) {
        el.innerText += fullText.charAt(idx);
        idx++;
        setTimeout(type, Math.random() * 50 + 40);
      } else if (el.dataset.highlight === 'print') {
        // Colorize typed code like a real editor: fn in blue, args in green
        const m = fullText.match(/^([A-Za-z_]\w*)\((.*)\)$/);
        if (m) {
          const args = m[2].replace(/&/g, '&amp;').replace(/</g, '&lt;');
          el.innerHTML = `<span class="code-fn">${m[1]}</span>(<span class="code-str">${args}</span>)`;
        }
      }
    }
    type();
  });

  // -------------------------------------------------------------------
  // Typing Card Effect
  // -------------------------------------------------------------------
  const typingCard = document.querySelector('.typing-card');
  if (typingCard) {
    const typingArea = typingCard.querySelector('.typing-area');
    const phrases = ['Python', 'JavaScript', 'TypeScript', 'React', 'Node.js'];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typeSpeed = 100;
    const deleteSpeed = 50;
    const pausePause = 1500;

    function type() {
      const currentPhrase = phrases[phraseIndex];

      if (isDeleting) {
        charIndex--;
        typingArea.innerText = currentPhrase.substring(0, charIndex);
      } else {
        charIndex++;
        typingArea.innerText = currentPhrase.substring(0, charIndex);
      }

      let typeSpeedVal = isDeleting ? deleteSpeed : typeSpeed;

      if (!isDeleting && charIndex === currentPhrase.length) {
        typeSpeedVal = pausePause;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        typeSpeedVal = pausePause;
      }

      setTimeout(type, typeSpeedVal);
    }

    setTimeout(type, 1000);
  }

  // -------------------------------------------------------------------
  // 4. Windows XP / 7 Aero Desktop Tech Explorer Interactive Engine
  // -------------------------------------------------------------------
  const desktopIcons = document.querySelectorAll('.aero-desktop-icon');
  const aeroWindows = document.querySelectorAll('.aero-window');
  const taskbarTabs = document.querySelector('.taskbar-tabs');
  const startBtn = document.querySelector('.aero-start-btn');
  const startMenu = document.querySelector('.aero-start-menu');
  const clockEl = document.getElementById('taskbar-clock');

  // Update Taskbar Digital Clock
  function updateClock() {
    if (clockEl) {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      clockEl.textContent = `${hours}:${minutes}`;
    }
  }
  updateClock();
  setInterval(updateClock, 10000);

  // Toggle Start Menu
  if (startBtn && startMenu) {
    startBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      startMenu.classList.toggle('active');
      startBtn.classList.toggle('active');
    });

    document.addEventListener('click', (e) => {
      if (!startMenu.contains(e.target) && !startBtn.contains(e.target)) {
        startMenu.classList.remove('active');
        startBtn.classList.remove('active');
      }
    });
  }

  // Open Window function
  function openTechWindow(techId) {
    aeroWindows.forEach(win => {
      if (win.id === `window-${techId}`) {
        win.classList.remove('minimized', 'closed');
        win.classList.add('active');
        bringToFront(win);
        updateTaskbar();
      } else {
        win.classList.remove('active');
      }
    });

    // Close start menu if open
    if (startMenu) startMenu.classList.remove('active');
  }

  function bringToFront(win) {
    aeroWindows.forEach(w => w.style.zIndex = '10');
    win.style.zIndex = '30';
  }

  // Attach click to Desktop Icons
  desktopIcons.forEach(icon => {
    icon.addEventListener('click', () => {
      const tech = icon.getAttribute('data-tech');
      desktopIcons.forEach(i => i.classList.remove('selected'));
      icon.classList.add('selected');
      if (tech) {
        openTechWindow(tech);
      }
    });
  });

  // Attach Window Controls (Minimize, Maximize, Close)
  aeroWindows.forEach(win => {
    const minBtn = win.querySelector('.win-control.minimize');
    const maxBtn = win.querySelector('.win-control.maximize');
    const closeBtn = win.querySelector('.win-control.close');

    if (minBtn) {
      minBtn.addEventListener('click', () => {
        win.classList.add('minimized');
        win.classList.remove('active');
        updateTaskbar();
      });
    }

    if (maxBtn) {
      maxBtn.addEventListener('click', () => {
        win.classList.toggle('maximized');
      });
    }

    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        win.classList.add('closed');
        win.classList.remove('active');
        updateTaskbar();
      });
    }

    win.addEventListener('mousedown', () => {
      bringToFront(win);
      aeroWindows.forEach(w => w.classList.remove('active'));
      win.classList.add('active');
      updateTaskbar();
    });
  });

  // Update Taskbar Buttons dynamically
  function updateTaskbar() {
    if (!taskbarTabs) return;
    taskbarTabs.innerHTML = '';

    aeroWindows.forEach(win => {
      if (!win.classList.contains('closed')) {
        const techId = win.id.replace('window-', '');
        const title = win.querySelector('.win-title-text')?.textContent || techId;
        const iconClass = win.getAttribute('data-icon') || 'fa-solid fa-code';

        const btn = document.createElement('button');
        btn.className = `taskbar-tab ${win.classList.contains('active') && !win.classList.contains('minimized') ? 'active' : ''}`;
        btn.innerHTML = `<i class="${iconClass}"></i> <span>${title}</span>`;

        btn.addEventListener('click', () => {
          if (win.classList.contains('minimized') || !win.classList.contains('active')) {
            win.classList.remove('minimized');
            win.classList.remove('closed');
            aeroWindows.forEach(w => w.classList.remove('active'));
            win.classList.add('active');
            bringToFront(win);
          } else {
            win.classList.add('minimized');
            win.classList.remove('active');
          }
          updateTaskbar();
        });

        taskbarTabs.appendChild(btn);
      }
    });
  }

  // Initial taskbar update
  updateTaskbar();
});
