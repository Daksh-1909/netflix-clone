document.addEventListener('DOMContentLoaded', () => {
  initFAQAccordion();
  initCTAForms();
});

function initFAQAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    
    questionBtn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
          const btn = otherItem.querySelector('.faq-question');
          if (btn) btn.setAttribute('aria-expanded', 'false');
        }
      });

      if (isActive) {
        item.classList.remove('active');
        questionBtn.setAttribute('aria-expanded', 'false');
      } else {
        item.classList.add('active');
        questionBtn.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

function initCTAForms() {
  const forms = [
    { form: document.getElementById('hero-cta-form'), input: document.getElementById('hero-email-input'), error: document.getElementById('hero-email-error') },
    { form: document.getElementById('bottom-cta-form'), input: document.getElementById('bottom-email-input'), error: document.getElementById('bottom-email-error') }
  ];

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  forms.forEach(({ form, input, error }) => {
    if (!form || !input) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailValue = input.value.trim();

      if (!emailValue || !emailRegex.test(emailValue)) {
        if (error) {
          error.style.display = 'block';
          error.textContent = emailValue ? 'Please enter a valid email address.' : 'Email is required.';
        }
        input.focus();
        return;
      }

      if (error) {
        error.style.display = 'none';
      }

      localStorage.setItem('netflix_user_email', emailValue);
      window.location.href = 'browse.html';
    });

    input.addEventListener('input', () => {
      if (error && error.style.display === 'block') {
        error.style.display = 'none';
      }
    });
  });
}
