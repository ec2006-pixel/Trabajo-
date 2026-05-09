import { services, testimonials } from './data.js';

function serviceCardHTML(s) {
  return `
    <div class="service-card reveal p-7 sm:p-8 rounded-3xl group cursor-pointer">
      <div class="service-icon-wrap w-14 h-14 rounded-2xl bg-[#E3F2FD] flex items-center justify-center mb-6">
        <i data-lucide="${s.icon}" class="w-7 h-7 text-[#1976D2]"></i>
      </div>
      <h3 class="font-serif text-xl font-semibold text-slate-900 mb-3 tracking-tight">${s.title}</h3>
      <p class="text-slate-600 leading-[1.7] text-[15px]">${s.desc}</p>
      <div class="mt-6 flex items-center text-sm font-medium text-[#D4AF37] opacity-0 group-hover:opacity-100 transition-opacity">
        Conocer más <i data-lucide="arrow-right" class="w-4 h-4 ml-2"></i>
      </div>
    </div>
  `;
}

function testimonialCardHTML(t) {
  return `
    <div class="testimonial-card p-7 sm:p-8 rounded-3xl">
      <div class="flex text-[#D4AF37] mb-4 text-lg tracking-wider">★★★★★</div>
      <p class="text-slate-700 leading-[1.75] mb-6 italic text-[15px]">"${t.text}"</p>
      <div class="flex items-center gap-3 pt-4 border-t border-slate-100/80">
        <div class="w-11 h-11 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#b08d20] text-white flex items-center justify-center font-semibold">
          ${t.initial}
        </div>
        <div>
          <div class="font-semibold text-slate-900 text-sm">${t.name}</div>
          <div class="text-xs text-slate-500 mt-0.5">${t.role}</div>
        </div>
      </div>
    </div>
  `;
}

function renderServices() {
  const grid = document.getElementById('servicesGrid');
  grid.innerHTML = services.map(serviceCardHTML).join('');
}

function renderTestimonials() {
  const grid = document.getElementById('testimonialsGrid');
  grid.innerHTML = testimonials.map(t => `<div class="reveal">${testimonialCardHTML(t)}</div>`).join('');

  const carousel = document.getElementById('testimonialsCarousel');
  carousel.innerHTML = testimonials.map(testimonialCardHTML).join('');

  const dots = document.getElementById('carouselDots');
  dots.innerHTML = testimonials.map((_, i) => `<button class="carousel-dot${i===0?' active':''}" data-index="${i}" aria-label="Ir al testimonio ${i+1}"></button>`).join('');

  initCarousel(carousel, dots);
}

function initCarousel(carousel, dots) {
  const dotEls = dots.querySelectorAll('.carousel-dot');
  const cards = carousel.children;

  const updateActive = () => {
    const scrollLeft = carousel.scrollLeft;
    const cardWidth = cards[0]?.offsetWidth || 1;
    const gap = 16;
    const idx = Math.round(scrollLeft / (cardWidth + gap));
    dotEls.forEach((d, i) => d.classList.toggle('active', i === idx));
  };

  carousel.addEventListener('scroll', () => {
    window.requestAnimationFrame(updateActive);
  }, { passive: true });

  dotEls.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      const cardWidth = cards[0]?.offsetWidth || 1;
      const gap = 16;
      carousel.scrollTo({ left: i * (cardWidth + gap), behavior: 'smooth' });
    });
  });
}

function initReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        const delay = Math.min(i * 60, 300);
        window.setTimeout(() => {
          window.requestAnimationFrame(() => entry.target.classList.add('visible'));
        }, delay);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

function initNavbar() {
  const nav = document.getElementById('navbar');
  let ticking = false;
  const handler = () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        if (window.scrollY > 20) nav.classList.add('scrolled');
        else nav.classList.remove('scrolled');
        ticking = false;
      });
      ticking = true;
    }
  };
  window.addEventListener('scroll', handler, { passive: true });
  handler();

  const menuBtn = document.getElementById('menuBtn');
  const menu = document.getElementById('mobileMenu');
  const menuIcon = document.getElementById('menuIcon');

  const toggleMenu = (force) => {
    const willOpen = force !== undefined ? force : !menu.classList.contains('open');
    menu.classList.toggle('open', willOpen);
    menuIcon.setAttribute('data-lucide', willOpen ? 'x' : 'menu');
    if (window.lucide) window.lucide.createIcons();
  };

  menuBtn.addEventListener('click', () => toggleMenu());
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => toggleMenu(false)));
}

function init() {
  renderServices();
  renderTestimonials();
  if (window.lucide) window.lucide.createIcons();
  initReveal();
  initNavbar();
}

document.addEventListener('DOMContentLoaded', init);
