(function initApp() {
  const timeEl = document.querySelector('[data-testid="test-user-time"]');
  const avatarImg = document.querySelector('[data-testid="test-user-avatar"]');
  const urlInput = document.querySelector('[data-testid="test-avatar-url-input"]');
  const fileInput = document.querySelector('[data-testid="test-avatar-file-input"]');

  function renderTime() {
    if (!timeEl) return;
    timeEl.textContent = String(Date.now());
  }

  renderTime();
  const timeIntervalId = setInterval(renderTime, 1000);

  if (urlInput && avatarImg) {
    urlInput.addEventListener('input', () => {
      const value = urlInput.value.trim();
      if (value) {
        avatarImg.src = value;
      }
    });
  }

  if (fileInput && avatarImg) {
    fileInput.addEventListener('change', () => {
      const file = fileInput.files && fileInput.files[0];
      if (!file) return;
      const objectUrl = URL.createObjectURL(file);
      avatarImg.src = objectUrl;
      avatarImg.onload = () => {
        try { URL.revokeObjectURL(objectUrl); } catch {}
      };
    });
  }

  function initNavigation() {
    const navButtons = document.querySelectorAll('.nav-button');
    const pages = document.querySelectorAll('.page');

    function showPage(targetPage) {
      pages.forEach(page => {
        page.classList.remove('active');
        if (page.dataset.testid === targetPage) {
          page.classList.add('active');
        }
      });

      navButtons.forEach(button => {
        button.classList.remove('active');
        button.removeAttribute('aria-current');
        if (button.dataset.testid === `test-nav-${targetPage.split('-')[1]}`) {
          button.classList.add('active');
          button.setAttribute('aria-current', 'page');
        }
      });
    }

    navButtons.forEach(button => {
      button.addEventListener('click', () => {
        const targetPage = button.dataset.testid.replace('test-nav-', 'test-') + '-page';
        showPage(targetPage);
      });
    });
  }

  function initContactForm() {
    const form = document.querySelector('[data-testid="test-contact-form"]');
    const successMessage = document.querySelector('[data-testid="test-contact-success"]');
    
    if (!form) return;

    const validators = {
      name: (value) => value.trim().length > 0,
      email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()),
      subject: (value) => value.trim().length > 0,
      message: (value) => value.trim().length >= 10
    };

    const errorMessages = {
      name: 'Full name is required',
      email: 'Please enter a valid email address',
      subject: 'Subject is required',
      message: 'Message must be at least 10 characters long'
    };

    function showError(fieldName, message) {
      const errorEl = document.querySelector(`[data-testid="test-contact-error-${fieldName}"]`);
      if (errorEl) {
        errorEl.textContent = message;
      }
    }

    function clearError(fieldName) {
      const errorEl = document.querySelector(`[data-testid="test-contact-error-${fieldName}"]`);
      if (errorEl) {
        errorEl.textContent = '';
      }
    }

    function validateField(fieldName, value) {
      const isValid = validators[fieldName](value);
      if (!isValid) {
        showError(fieldName, errorMessages[fieldName]);
        return false;
      } else {
        clearError(fieldName);
        return true;
      }
    }

    function validateForm() {
      const formData = new FormData(form);
      let isFormValid = true;

      Object.keys(validators).forEach(fieldName => {
        const value = formData.get(fieldName) || '';
        const fieldValid = validateField(fieldName, value);
        if (!fieldValid) isFormValid = false;
      });

      return isFormValid;
    }

    Object.keys(validators).forEach(fieldName => {
      const input = form.querySelector(`[name="${fieldName}"]`);
      if (input) {
        input.addEventListener('blur', () => {
          validateField(fieldName, input.value);
        });

        input.addEventListener('input', () => {
          if (input.value.trim().length > 0) {
            clearError(fieldName);
          }
        });
      }
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      if (validateForm()) {
        successMessage.textContent = 'Thank you! Your message has been sent successfully.';
        successMessage.classList.add('show');
        form.reset();
        
        setTimeout(() => {
          successMessage.classList.remove('show');
        }, 5000);
      }
    });
  }

  initNavigation();
  initContactForm();

  window.addEventListener('beforeunload', () => {
    clearInterval(timeIntervalId);
  });
})();


