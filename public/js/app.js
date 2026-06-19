function initMenuToggle() {
  const menuToggle = document.getElementById('menu-toggle');
  const navMobileMenu = document.getElementById('nav-mobile-menu');

  if (!menuToggle || !navMobileMenu) return;

  menuToggle.addEventListener('click', () => {
    navMobileMenu.classList.toggle('hidden');
  });

  navMobileMenu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navMobileMenu.classList.add('hidden');
    });
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth >= 768) {
      navMobileMenu.classList.add('hidden');
    }
  });
}

function initCarousel() {
  const carousel = document.getElementById('default-carousel');

  if (!carousel) return;

  const items = Array.from(carousel.querySelectorAll('[data-carousel-item]'));
  const indicators = Array.from(carousel.querySelectorAll('[data-carousel-slide-to]'));
  const prevButton = carousel.querySelector('[data-carousel-prev]');
  const nextButton = carousel.querySelector('[data-carousel-next]');

  if (items.length === 0) return;

  let currentIndex = 0;

  function showSlide(index) {
    currentIndex = (index + items.length) % items.length;

    items.forEach((item, i) => {
      const isActive = i === currentIndex;
      item.classList.toggle('translate-x-0', isActive);
      item.classList.toggle('translate-x-full', !isActive && i > currentIndex);
      item.classList.toggle('-translate-x-full', !isActive && i < currentIndex);
      item.classList.toggle('pointer-events-none', !isActive);
      item.classList.toggle('opacity-100', isActive);
      item.classList.toggle('opacity-0', !isActive);
      item.setAttribute('aria-hidden', String(!isActive));
    });

    indicators.forEach((button, i) => {
      const isActive = i === currentIndex;
      button.setAttribute('aria-current', String(isActive));
      button.classList.toggle('bg-white', isActive);
      button.classList.toggle('bg-slate-400', !isActive);
      button.classList.toggle('scale-110', isActive);
    });
  }

  showSlide(0);

  prevButton?.addEventListener('click', () => showSlide(currentIndex - 1));
  nextButton?.addEventListener('click', () => showSlide(currentIndex + 1));
  indicators.forEach((button, i) => {
    button.addEventListener('click', () => showSlide(i));
  });

  setInterval(() => showSlide(currentIndex + 1), 5000);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initMenuToggle();
    initCarousel();
  });
} else {
  initMenuToggle();
  initCarousel();
}
