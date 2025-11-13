// Toggle del menu mobile (hamburger) – usato sia in home sia in availability
(function(){
  const btn = document.getElementById('hamburger');
  const menu = document.getElementById('mobileMenu');
  if(!btn || !menu) return;

  function openMenu(){
    btn.setAttribute('aria-expanded','true');
    menu.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeMenu(){
    btn.setAttribute('aria-expanded','false');
    menu.classList.remove('open');
    document.body.style.overflow = '';
  }

  btn.addEventListener('click', ()=>{
    const open = btn.getAttribute('aria-expanded') === 'true';
    open ? closeMenu() : openMenu();
  });

  // Chiudi con ESC
  document.addEventListener('keydown', (e)=>{
    if(e.key === 'Escape') closeMenu();
  });

  // Chiudi cliccando fuori
  document.addEventListener('click', (e)=>{
    if(!menu.classList.contains('open')) return;
    const withinToggle = e.target.closest('#hamburger');
    const withinMenu = e.target.closest('#mobileMenu');
    if(!withinToggle && !withinMenu) closeMenu();
  });

  // Chiudi quando si clicca una voce del menu
  menu.addEventListener('click', (e)=>{
    if(e.target.tagName === 'A') closeMenu();
  });
})();
