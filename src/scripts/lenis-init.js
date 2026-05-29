document.addEventListener('astro:page-load', () => {
  const isMacOSDesktop = (() => {
    const ua = navigator.userAgent || '';
    const isMacToken = /Macintosh|Mac OS X/.test(ua);
    const isIOS = /iPhone|iPad|iPod/.test(ua);
    return isMacToken && !isIOS;
  })();

  if (!isMacOSDesktop && typeof Lenis !== 'undefined') {
    const lenis = new Lenis({
      duration: 1.7,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  }
});
