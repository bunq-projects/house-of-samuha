document.addEventListener('astro:page-load', () => {
  const audio = document.getElementById('backgroundAudio');
  const toggleButton = document.getElementById('audioToggle');
  if (!audio || !toggleButton) return;

  let isSoundOn = sessionStorage.getItem('audioSoundState') === null
    ? true
    : sessionStorage.getItem('audioSoundState') === 'true';
  let fadeInterval;

  const VOLUME_ON = 0.5;
  const VOLUME_OFF = 0;
  const fadeDuration = 1000;
  const fadeSteps = 20;
  const volumeStep = (VOLUME_ON - VOLUME_OFF) / fadeSteps;
  const fadeIntervalTime = fadeDuration / fadeSteps;

  function fadeIn() {
    audio.volume = VOLUME_OFF;
    audio.play().catch(() => {
      toggleButton.textContent = 'Sound: Off';
      isSoundOn = false;
      sessionStorage.setItem('audioSoundState', 'false');
    });
    let currentStep = 0;
    clearInterval(fadeInterval);
    fadeInterval = setInterval(() => {
      if (currentStep < fadeSteps) {
        audio.volume = Math.min(VOLUME_ON, audio.volume + volumeStep);
        currentStep++;
      } else {
        audio.volume = VOLUME_ON;
        clearInterval(fadeInterval);
      }
    }, fadeIntervalTime);
  }

  function fadeOut() {
    let currentStep = 0;
    clearInterval(fadeInterval);
    fadeInterval = setInterval(() => {
      if (currentStep < fadeSteps) {
        audio.volume = Math.max(VOLUME_OFF, audio.volume - volumeStep);
        currentStep++;
      } else {
        audio.volume = VOLUME_OFF;
        audio.pause();
        clearInterval(fadeInterval);
      }
    }, fadeIntervalTime);
  }

  function initAudio() {
    const savedTime = sessionStorage.getItem('audioTime');
    if (savedTime) audio.currentTime = parseFloat(savedTime);

    audio.volume = isSoundOn ? VOLUME_ON : VOLUME_OFF;
    toggleButton.textContent = isSoundOn ? 'Sound: On' : 'Sound: Off';

    if (isSoundOn) {
      audio.play().catch(() => {
        toggleButton.textContent = 'Sound: Off';
        isSoundOn = false;
        sessionStorage.setItem('audioSoundState', 'false');
      });
    } else if (!sessionStorage.getItem('audioStarted')) {
      const loaderWrapper = document.getElementById('loader-wrapper');
      if (loaderWrapper) {
        function startAudioOnInteraction() {
          loaderWrapper.removeEventListener('click', startAudioOnInteraction);
          loaderWrapper.removeEventListener('mousemove', startAudioOnInteraction);
          if (!sessionStorage.getItem('audioStarted')) {
            fadeIn();
            toggleButton.textContent = 'Sound: On';
            isSoundOn = true;
            sessionStorage.setItem('audioSoundState', 'true');
            sessionStorage.setItem('audioStarted', 'true');
          }
        }
        loaderWrapper.addEventListener('click', startAudioOnInteraction);
        loaderWrapper.addEventListener('mousemove', startAudioOnInteraction);
      }
    }
  }

  toggleButton.addEventListener('click', () => {
    if (isSoundOn) {
      fadeOut();
      toggleButton.textContent = 'Sound: Off';
      isSoundOn = false;
    } else {
      fadeIn();
      toggleButton.textContent = 'Sound: On';
      isSoundOn = true;
    }
    sessionStorage.setItem('audioSoundState', String(isSoundOn));
  });

  window.addEventListener('beforeunload', () => {
    sessionStorage.setItem('audioTime', String(audio.currentTime));
    sessionStorage.setItem('audioSoundState', String(isSoundOn));
  });

  audio.addEventListener('timeupdate', () => {
    sessionStorage.setItem('audioTime', String(audio.currentTime));
  });

  initAudio();
});
