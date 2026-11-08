'use strict';

(function initializeVerifier() {
  const lockerContainer = document.getElementById('locker-container');
  if (lockerContainer.dataset.loaded) return;
  lockerContainer.dataset.loaded = 'true';

  // Preserve the existing provider's completion callback without claiming rewards.
  if (typeof window.og_converted !== 'function') window.og_converted = function () {};

  const script = document.createElement('script');
  script.id = 'verifier-locker-script';
  script.type = 'text/javascript';
  script.src = 'https://apptrck.net/cp/js/qlk60';
  script.onerror = () => console.error('The existing Apptrck locker could not load.');
  document.body.appendChild(script);
})();
