document.addEventListener('astro:page-load', () => {
  document.querySelectorAll('.faq3_question').forEach(question => {
    question.addEventListener('click', () => {
      const answer = question.nextElementSibling;
      if (!answer || !answer.classList.contains('faq3_answer')) return;

      const isOpen = question.getAttribute('aria-expanded') === 'true';
      const icon = question.querySelector('.faq3_icon-wrapper');

      if (isOpen) {
        answer.style.height = answer.scrollHeight + 'px';
        requestAnimationFrame(() => {
          answer.style.height = '0px';
        });
        question.setAttribute('aria-expanded', 'false');
        if (icon) icon.style.transform = 'rotate(0deg)';
      } else {
        answer.style.height = answer.scrollHeight + 'px';
        answer.addEventListener('transitionend', function handler() {
          answer.removeEventListener('transitionend', handler);
          if (question.getAttribute('aria-expanded') === 'true') {
            answer.style.height = 'auto';
          }
        });
        question.setAttribute('aria-expanded', 'true');
        if (icon) icon.style.transform = 'rotate(180deg)';
      }
    });
  });
});
