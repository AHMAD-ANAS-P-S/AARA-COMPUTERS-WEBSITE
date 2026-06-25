/* ============================================================
   AARA COMPUTERS – Main JavaScript
   Custom Cursor | GSAP Animations | Interactions
   ============================================================ */

// ── Cursor ──────────────────────────────────────────────────
const dot = document.getElementById('cursor-dot');
const ring = document.getElementById('cursor-ring');
let mouseX = 0, mouseY = 0;
let ringX = 0, ringY = 0;

if (dot && ring && window.innerWidth > 768) {
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = mouseX + 'px';
    dot.style.top  = mouseY + 'px';
  });

  function animateCursor() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    ring.style.left = ringX + 'px';
    ring.style.top  = ringY + 'px';
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  // Expand on hover
  const hoverTargets = document.querySelectorAll(
    'a, button, .card, .course-card, .service-card, .feature-card, .gallery-item, .award-card, .fab-btn, .btn, .filter-btn'
  );
  hoverTargets.forEach(el => {
    el.addEventListener('mouseenter', () => {
      ring.classList.add('expanded');
      dot.style.transform = 'translate(-50%, -50%) scale(0.5)';
    });
    el.addEventListener('mouseleave', () => {
      ring.classList.remove('expanded');
      dot.style.transform = 'translate(-50%, -50%) scale(1)';
    });
  });

  // Dark sections
  const darkSections = document.querySelectorAll('.section-navy, .founder-section, .stats-bar');
  darkSections.forEach(sec => {
    sec.addEventListener('mouseenter', () => ring.classList.add('on-dark'));
    sec.addEventListener('mouseleave', () => ring.classList.remove('on-dark'));
  });
}

// ── Navbar Scroll & Back to Top ────────────────────────────────────────────
const navbar = document.querySelector('.navbar');
const backToTop = document.createElement('button');
backToTop.id = 'back-to-top';
backToTop.className = 'back-to-top';
backToTop.setAttribute('aria-label', 'Back to top');
backToTop.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 15l-6-6-6 6"/></svg>';
document.body.appendChild(backToTop);

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

if (navbar) {
  const topbarH = document.querySelector('.sticky-top-bar') ? 40 : 0;
  window.addEventListener('scroll', () => {
    if (window.scrollY > topbarH + 10) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    
    // Back to top visibility (only show when scrolled near the very bottom of the document)
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 120) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  });
}

// ── Active Nav Link ───────────────────────────────────────────
(function highlightNav() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-nav a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === path || (path === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });
})();

// ── Mobile Nav ────────────────────────────────────────────────
const hamburger = document.querySelector('.hamburger');
const mobileNav = document.querySelector('.mobile-nav');
const overlay   = document.querySelector('.mobile-nav-overlay');
const closeBtn  = document.querySelector('.mobile-nav .close-btn');

function openMobileNav() {
  mobileNav?.classList.add('open');
  overlay?.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeMobileNav() {
  mobileNav?.classList.remove('open');
  overlay?.classList.remove('open');
  document.body.style.overflow = '';
}

hamburger?.addEventListener('click', openMobileNav);
closeBtn?.addEventListener('click', closeMobileNav);
overlay?.addEventListener('click', closeMobileNav);

// Close menu when a link is clicked
document.querySelectorAll('.mobile-nav a').forEach(link => {
  link.addEventListener('click', closeMobileNav);
});

// ── Scroll Reveal ─────────────────────────────────────────────
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('revealed');
      }, (entry.target.dataset.delay || 0) * 1);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach((el, i) => {
  if (!el.dataset.delay) el.dataset.delay = (i % 6) * 100;
  revealObserver.observe(el);
});

// ── Counter Animation ─────────────────────────────────────────
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const suffix = el.dataset.suffix || '';
  const prefix = el.dataset.prefix || '';
  const duration = 2000;
  const startTime = performance.now();

  function update(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(eased * target);
    el.textContent = prefix + current.toLocaleString() + suffix;
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-num[data-target]').forEach(el => counterObserver.observe(el));

// ── Ripple Effect ─────────────────────────────────────────────
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('click', function(e) {
    const rect = btn.getBoundingClientRect();
    const ripple = document.createElement('span');
    ripple.classList.add('ripple');
    const size = Math.max(rect.width, rect.height);
    ripple.style.width  = size + 'px';
    ripple.style.height = size + 'px';
    ripple.style.left   = (e.clientX - rect.left - size/2) + 'px';
    ripple.style.top    = (e.clientY - rect.top - size/2) + 'px';
    btn.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove());
  });
});

// ── Card 3D Tilt ──────────────────────────────────────────────
function init3DTilt(selector) {
  document.querySelectorAll(selector).forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width  - 0.5;
      const y = (e.clientY - rect.top)  / rect.height - 0.5;
      card.style.transform = `perspective(800px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}
init3DTilt('.course-card');
init3DTilt('.service-card');
init3DTilt('.feature-card');

// ── Magnetic Buttons ──────────────────────────────────────────
document.querySelectorAll('.btn-primary, .btn-whatsapp').forEach(btn => {
  btn.addEventListener('mousemove', e => {
    const rect = btn.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width  / 2) * 0.25;
    const y = (e.clientY - rect.top  - rect.height / 2) * 0.25;
    btn.style.transform = `translate(${x}px, ${y}px) translateY(-2px)`;
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = '';
  });
});

// ── Founder Parallax ─────────────────────────────────────────
const founderSection = document.querySelector('.founder-section');
const founderFrame   = document.querySelector('.founder-photo-frame');
if (founderSection && founderFrame && window.innerWidth > 768) {
  founderSection.addEventListener('mousemove', e => {
    const rect = founderSection.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width  / 2) * 0.015;
    const y = (e.clientY - rect.top  - rect.height / 2) * 0.015;
    founderFrame.style.transform = `translateY(-16px) translate(${x}px, ${y}px)`;
  });
  founderSection.addEventListener('mouseleave', () => {
    founderFrame.style.transform = '';
  });
}

// ── Gallery Filters ───────────────────────────────────────────
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', function() {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    this.classList.add('active');
    const cat = this.dataset.filter;
    document.querySelectorAll('.gallery-item').forEach(item => {
      if (cat === 'all' || item.dataset.category === cat) {
        item.style.display = '';
        item.style.animation = 'none';
        requestAnimationFrame(() => {
          item.style.animation = '';
        });
      } else {
        item.style.display = 'none';
      }
    });
  });
});

// ── Premium Lightbox ──────────────────────────────────────────────────
(function initPremiumLightbox() {
  const galleryItems = document.querySelectorAll('.gallery-item img, .zoomable-photo-card img');
  if (galleryItems.length === 0) return;

  const images = Array.from(galleryItems).map(img => img.src);
  let currentIndex = 0;
  let scale = 1;
  let pointX = 0, pointY = 0;
  let startX = 0, startY = 0;
  let panning = false;

  const lbHTML = `
    <div id="premium-lightbox" style="position:fixed; inset:0; z-index:99999; background:rgba(11,27,53,0.95); opacity:0; pointer-events:none; transition:opacity 0.3s; display:flex; align-items:center; justify-content:center; backdrop-filter:blur(8px);">
      <div id="lb-close" style="position:absolute; top:20px; right:20px; color:#fff; cursor:pointer; padding:10px; z-index:10;"><svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></div>
      <div id="lb-prev" style="position:absolute; left:20px; color:#fff; cursor:pointer; padding:20px; z-index:10;"><svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg></div>
      <div id="lb-next" style="position:absolute; right:20px; color:#fff; cursor:pointer; padding:20px; z-index:10;"><svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg></div>
      <div style="position:absolute; bottom:20px; display:flex; gap:15px; z-index:10;">
        <div id="lb-zoom-out" style="color:#fff; cursor:pointer; background:rgba(255,255,255,0.1); padding:8px; border-radius:50%;"><svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="8" y1="11" x2="14" y2="11"/></svg></div>
        <div id="lb-zoom-in" style="color:#fff; cursor:pointer; background:rgba(255,255,255,0.1); padding:8px; border-radius:50%;"><svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg></div>
      </div>
      <div id="lb-img-container" style="overflow:hidden; width:100%; height:100%; display:flex; align-items:center; justify-content:center;">
        <img id="lb-img" style="max-width:90%; max-height:90vh; object-fit:contain; transform-origin:center; cursor:grab; transition:transform 0.1s ease-out; user-select:none;" draggable="false" />
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', lbHTML);

  const lb = document.getElementById('premium-lightbox');
  const lbImg = document.getElementById('lb-img');
  const lbContainer = document.getElementById('lb-img-container');

  function setTransform() {
    lbImg.style.transform = 'translate(' + pointX + 'px, ' + pointY + 'px) scale(' + scale + ')';
  }

  function resetTransform() {
    scale = 1; pointX = 0; pointY = 0;
    setTransform();
    lbImg.style.transition = 'transform 0.3s ease';
  }

  function openLightbox(index) {
    currentIndex = index;
    lbImg.src = images[currentIndex];
    lb.style.opacity = '1';
    lb.style.pointerEvents = 'auto';
    document.body.style.overflow = 'hidden';
    resetTransform();
  }

  function closeLightbox() {
    lb.style.opacity = '0';
    lb.style.pointerEvents = 'none';
    document.body.style.overflow = '';
    setTimeout(() => { lbImg.src = ''; }, 300);
  }

  galleryItems.forEach((img, idx) => {
    const parent = img.closest('.gallery-item') || img.closest('.zoomable-photo-card');
    if (parent) {
      parent.onclick = (e) => {
        e.preventDefault(); e.stopPropagation();
        openLightbox(idx);
      };
    }
  });

  document.getElementById('lb-close').onclick = closeLightbox;
  document.getElementById('lb-prev').onclick = (e) => { e.stopPropagation(); currentIndex = (currentIndex - 1 + images.length) % images.length; lbImg.src = images[currentIndex]; resetTransform(); };
  document.getElementById('lb-next').onclick = (e) => { e.stopPropagation(); currentIndex = (currentIndex + 1) % images.length; lbImg.src = images[currentIndex]; resetTransform(); };

  document.getElementById('lb-zoom-in').onclick = (e) => { e.stopPropagation(); scale = Math.min(scale + 0.5, 4); setTransform(); };
  document.getElementById('lb-zoom-out').onclick = (e) => { e.stopPropagation(); scale = Math.max(scale - 0.5, 0.5); setTransform(); };

  // Wheel zoom
  lbContainer.onwheel = (e) => {
    e.preventDefault();
    lbImg.style.transition = 'none';
    const delta = e.deltaY * -0.001;
    scale = Math.min(Math.max(0.5, scale + delta), 5);
    setTransform();
  };

  // Drag pan
  lbImg.onmousedown = (e) => {
    e.preventDefault();
    if(scale > 1) {
      panning = true;
      startX = e.clientX - pointX;
      startY = e.clientY - pointY;
      lbImg.style.cursor = 'grabbing';
      lbImg.style.transition = 'none';
    }
  };
  window.onmousemove = (e) => {
    if (!panning) return;
    pointX = e.clientX - startX;
    pointY = e.clientY - startY;
    setTransform();
  };
  window.onmouseup = () => {
    panning = false;
    lbImg.style.cursor = 'grab';
  };

  // Touch swipe support for mobile
  let touchStartX = 0;
  let touchEndX = 0;
  lbContainer.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
  }, {passive: true});
  lbContainer.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].screenX;
    if (scale === 1) { // Only swipe if not zoomed in
      if (touchEndX < touchStartX - 50) document.getElementById('lb-next').click();
      if (touchEndX > touchStartX + 50) document.getElementById('lb-prev').click();
    }
  }, {passive: true});

  lbContainer.onclick = (e) => {
    if(e.target === lbContainer) closeLightbox();
  };

  // Add global ESC key
  window.addEventListener('keydown', e => {
    if(e.key === 'Escape' && lb.style.opacity === '1') closeLightbox();
    if(e.key === 'ArrowRight' && lb.style.opacity === '1') document.getElementById('lb-next').click();
    if(e.key === 'ArrowLeft' && lb.style.opacity === '1') document.getElementById('lb-prev').click();
  });
})();

// ── Video Lightbox ────────────────────────────────────────────
const videoLightbox = document.getElementById('video-lightbox');
const videoEl = document.getElementById('lightbox-video');
const videoClose = document.querySelector('.video-lightbox-close');
const videoTrigger = document.querySelector('.video-wrapper');

videoTrigger?.addEventListener('click', () => {
  videoLightbox?.classList.add('open');
  videoEl?.play();
  document.body.style.overflow = 'hidden';
});
videoClose?.addEventListener('click', () => {
  videoLightbox?.classList.remove('open');
  if (videoEl) { videoEl.pause(); videoEl.currentTime = 0; }
  document.body.style.overflow = '';
});
videoLightbox?.addEventListener('click', e => {
  if (e.target === videoLightbox) {
    videoLightbox.classList.remove('open');
    if (videoEl) { videoEl.pause(); videoEl.currentTime = 0; }
    document.body.style.overflow = '';
  }
});

// ── Contact Form ──────────────────────────────────────────────
const contactForm = document.getElementById('contact-form');
const formMsg     = document.getElementById('form-message');
if (contactForm) {
  contactForm.addEventListener('submit', e => {
    e.preventDefault();
    // Simulate success
    formMsg.textContent = '✅ Thank you! We will contact you shortly.';
    formMsg.style.display = 'block';
    formMsg.style.background = '#ECFDF5';
    formMsg.style.color = '#059669';
    formMsg.style.padding = '12px 16px';
    formMsg.style.borderRadius = '8px';
    formMsg.style.marginTop = '1rem';
    formMsg.style.fontWeight = '600';
    contactForm.reset();
    setTimeout(() => { formMsg.style.display = 'none'; }, 6000);
  });
}

// ── Escape key closes overlays ────────────────────────────────
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    const oldLightbox = document.getElementById('lightbox');
    if (oldLightbox) oldLightbox.classList.remove('open');
    videoLightbox?.classList.remove('open');
    closeMobileNav();
    if (videoEl) { videoEl.pause(); videoEl.currentTime = 0; }
    document.body.style.overflow = '';
  }
});

// ── Hero Particle Canvas ──────────────────────────────────────
const canvas = document.getElementById('hero-canvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  function resize() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const particles = [];
  for (let i = 0; i < 55; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.8 + 0.4,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      opacity: Math.random() * 0.4 + 0.1
    });
  }

  let heroMX = canvas.width / 2;
  let heroMY = canvas.height / 2;
  canvas.closest('.hero-section')?.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    heroMX = e.clientX - rect.left;
    heroMY = e.clientY - rect.top;
  });

  function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Draw connections
    particles.forEach((p, i) => {
      particles.slice(i + 1).forEach(q => {
        const dx = p.x - q.x;
        const dy = p.y - q.y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < 120) {
          ctx.strokeStyle = `rgba(15,111,255,${0.15 * (1 - dist/120)})`;
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.stroke();
        }
      });
    });

    // Cursor glow
    const grad = ctx.createRadialGradient(heroMX, heroMY, 0, heroMX, heroMY, 120);
    grad.addColorStop(0, 'rgba(15,111,255,0.08)');
    grad.addColorStop(1, 'transparent');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > canvas.width)  p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(15,111,255,${p.opacity})`;
      ctx.fill();
    });

    requestAnimationFrame(drawParticles);
  }
  drawParticles();
}
