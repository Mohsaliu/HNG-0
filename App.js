(function initProfileCard() {
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

  window.addEventListener('beforeunload', () => {
    clearInterval(timeIntervalId);
  });
})();


