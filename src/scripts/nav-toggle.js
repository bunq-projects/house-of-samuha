document.addEventListener('astro:page-load', () => {
  const btn = document.querySelector('.navbar1_menu-button');
  const menu = document.querySelector('.navbar1_menu');
  if (!btn || !menu) return;

  btn.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('is-open');
    btn.setAttribute('aria-expanded', String(isOpen));
  });
});
