document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.nav-toggle');
  const menu = document.getElementById('nav-menu');
  const year = document.getElementById('year');
  const waLinks = document.querySelectorAll('.js-cta-whatsapp');
  const form = document.getElementById('contact-form');
  const privacy = document.getElementById('privacy');

  if (year) year.textContent = new Date().getFullYear();

  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      const open = menu.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (id && id.length > 1) {
        const el = document.querySelector(id);
        if (el) {
          e.preventDefault();
          el.scrollIntoView({behavior:'smooth', block:'start'});
          if (menu && menu.classList.contains('open')) menu.classList.remove('open');
        }
      }
    });
  });

  const business = 'Taká appartamenti';
  function buildWaHref(apartment, phone) {
    const target = phone.trim();
    const base = `https://wa.me/${target}`;
    const msg = apartment
      ? `Ciao ${business}, vorrei info su "${apartment}". Date: __ / __ - __ / __. Ospiti: __.`
      : `Ciao ${business}, vorrei verificare disponibilità. Date: __ / __ - __ / __. Ospiti: __.`;
    const url = new URL(base);
    url.searchParams.set('text', msg);
    return url.toString();
  }

  waLinks.forEach(link => {
    const apt = link.getAttribute('data-apartment') || '';
    const phone = link.getAttribute('data-phone') || '393667273951';
    link.setAttribute('href', buildWaHref(apt, phone));
    link.addEventListener('click', () => {
      link.setAttribute('href', buildWaHref(apt, phone));
    });
  });

  if (form) {
    form.addEventListener('submit', (e) => {
      if (privacy && !privacy.checked) {
        e.preventDefault();
        alert('Per inviare il modulo devi accettare la Privacy Policy.');
        privacy.focus();
      }
    });
  }
});
document.querySelectorAll('.image-carousel').forEach(carousel => {
  let currentIndex = 0;
  const images = carousel.querySelectorAll('.carousel-image');
  const prevBtn = carousel.querySelector('.carousel-prev');
  const nextBtn = carousel.querySelector('.carousel-next');

  function showImage(index) {
    images.forEach(img => img.classList.add('hidden'));
    images[index].classList.remove('hidden');
  }

  prevBtn?.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    showImage(currentIndex);
  });

  nextBtn?.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % images.length;
    showImage(currentIndex);
  });
});
