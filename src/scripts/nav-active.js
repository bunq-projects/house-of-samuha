document.addEventListener('astro:page-load', () => {
  const path = window.location.pathname;

  document.querySelectorAll('.navbar1_link.w-nav-link, .navbar1_link.w-nav-brand').forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;

    const isActive = href === '/'
      ? path === '/' || path === ''
      : path.startsWith(href);

    if (link.classList.contains('w-nav-brand')) return;

    link.classList.toggle('w--current', isActive);
    if (isActive) {
      link.setAttribute('aria-current', 'page');
    } else {
      link.removeAttribute('aria-current');
    }
  });

  // Toggle background shader visibility for homepage vs other pages
  const bgPersist = document.querySelector('.bg-persist');
  if (bgPersist) {
    const isHome = path === '/' || path === '';
    bgPersist.classList.toggle('bg-hidden', isHome);
  }
});
