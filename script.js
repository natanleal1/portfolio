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
        if (!win.classList.contains('maximized')) {
          // Remember dragged position before maximizing
          win.dataset.prevLeft = win.style.left || '';
          win.dataset.prevTop = win.style.top || '';
          win.classList.add('maximized');
          win.style.left = '';
          win.style.top = '';
          win.style.right = '';
        } else {
          win.classList.remove('maximized');
          const pl = win.dataset.prevLeft || '';
          const pt = win.dataset.prevTop || '';
          if (pl) {
            win.style.left = pl;
            win.style.top = pt;
            win.style.right = 'auto';
          } else {
            win.style.left = '';
            win.style.top = '';
            win.style.right = '';
          }
        }
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

  // Drag windows freely by their titlebar (Windows-style)
  aeroWindows.forEach(win => {
    const titlebar = win.querySelector('.win-titlebar');
    if (!titlebar) return;

    let dragging = false;
    let startX = 0, startY = 0, originLeft = 0, originTop = 0;

    titlebar.addEventListener('mousedown', (e) => {
      // Ignore clicks on window control buttons
      if (e.target.closest('.win-control')) return;
      if (win.classList.contains('maximized') || win.classList.contains('closed')) return;

      const desktop = win.closest('.aero-desktop') || win.parentElement;
      const desktopRect = desktop.getBoundingClientRect();
      const winRect = win.getBoundingClientRect();

      dragging = true;
      startX = e.clientX;
      startY = e.clientY;
      originLeft = winRect.left - desktopRect.left;
      originTop = winRect.top - desktopRect.top;

      // Convert from CSS right-positioning to explicit left/top
      win.style.left = originLeft + 'px';
      win.style.top = originTop + 'px';
      win.style.right = 'auto';
      win.classList.add('dragging');
      e.preventDefault();
    });

    document.addEventListener('mousemove', (e) => {
      if (!dragging) return;
      win.style.left = (originLeft + (e.clientX - startX)) + 'px';
      win.style.top = (originTop + (e.clientY - startY)) + 'px';
    });

    document.addEventListener('mouseup', () => {
      if (dragging) {
        dragging = false;
        win.classList.remove('dragging');
      }
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

  // -------------------------------------------------------------------
  // 5. Scroll Reveal Animations (text & images fade in while scrolling)
  // -------------------------------------------------------------------
  const revealTargets = document.querySelectorAll(
    '.home-content, .home-img, .about-img, .about-content, .section-header-center, ' +
    '.service-box, .project-card, .terminal-window, ' +
    'footer.contact h1, footer.contact h3, footer.contact p, .contact-icons'
  );
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (revealTargets.length && !prefersReducedMotion) {
    const REVEAL_EDGE = 40; // px above the viewport bottom edge

    const isInView = (el) => {
      const rect = el.getBoundingClientRect();
      return rect.top < window.innerHeight - REVEAL_EDGE && rect.bottom > 0;
    };

    const revealEl = (el) => {
      if (el.dataset.revealed) return;
      el.dataset.revealed = '1';

      const delay = parseFloat(el.style.transitionDelay) || 0;
      el.classList.add('visible');

      // Remove helper classes after the reveal so the element's original
      // CSS transitions (e.g. card hover effects) are fully restored
      setTimeout(() => {
        el.classList.remove('reveal', 'visible');
        el.style.transitionDelay = '';
      }, 900 + delay * 1000);
    };

    let revealObserver = null;
    if ('IntersectionObserver' in window) {
      revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            revealEl(entry.target);
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    }

    // Fallback check (also covers environments where observer
    // callbacks never fire because frames are not rendered)
    let revealTickPending = false;
    const revealCheck = () => {
      revealTickPending = false;
      revealTargets.forEach(el => {
        if (!el.dataset.revealed && isInView(el)) {
          revealEl(el);
          if (revealObserver) revealObserver.unobserve(el);
        }
      });
    };

    const requestRevealCheck = () => {
      if (!revealTickPending) {
        revealTickPending = true;
        requestAnimationFrame(revealCheck);
      }
    };

    revealTargets.forEach(el => {
      el.classList.add('reveal');

      // Stagger siblings inside the same parent for a cascading effect
      const parent = el.parentElement;
      const groupIndex = parent
        ? Array.from(parent.children).filter(c => c.classList.contains('reveal')).indexOf(el)
        : 0;
      el.style.transitionDelay = (Math.min(groupIndex, 4) * 0.1) + 's';

      if (revealObserver) revealObserver.observe(el);
    });

    window.addEventListener('scroll', requestRevealCheck, { passive: true });
    window.addEventListener('resize', requestRevealCheck);
    requestRevealCheck();
  }
});
