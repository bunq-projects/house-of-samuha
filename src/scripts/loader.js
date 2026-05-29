document.addEventListener('astro:page-load', () => {
  if (sessionStorage.getItem('loaderShown')) {
    const loader = document.getElementById('loader-wrapper');
    if (loader) loader.style.display = 'none';
    return;
  }

  sessionStorage.setItem('loaderShown', 'true');

  const loader = document.getElementById('loader-wrapper');
  if (!loader) return;

  const video = loader.querySelector('video');

  function hideLoader() {
    loader.style.transition = 'opacity 0.8s ease';
    loader.style.opacity = '0';
    setTimeout(() => {
      loader.style.display = 'none';
    }, 800);
  }

  if (video) {
    video.addEventListener('ended', hideLoader);
    setTimeout(hideLoader, 5000);
  } else {
    setTimeout(hideLoader, 2000);
  }
});
