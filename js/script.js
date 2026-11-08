'use strict';

// All page behavior is native DOM code. QR and device utilities are local, plain JS.
(async function initializeLandingPage() {
  const locale = document.documentElement.dataset.locale || 'en';
  const [config, translations] = await Promise.all([
    loadJSON('/locales/config.json'),
    loadJSON(`/locales/${locale}.json`)
  ]);
  const { UAParser } = window.BrawlUtilities;
  const parser = new UAParser();
  const os = (parser.getOS().name || '').toLowerCase();
  const select = document.getElementById('locales');
  const action = getAction(window.location.search);
  const button = document.getElementById('open-game-button');
  const heading = document.querySelector('.download-links-heading');
  const downloads = document.querySelector('.download-links');
  const qrContainer = document.querySelector('.qr-code-container');

  select.value = locale;
  select.addEventListener('change', () => {
    const nextLocale = select.value;
    const currentPath = window.location.pathname;
    let nextPath;
    if (/^\/[a-z]{2,3}\/$/.test(currentPath)) nextPath = `/${nextLocale}/`;
    else nextPath = nextLocale === 'en' ? '/index.html' : `/locales/${nextLocale}/index.html`;
    window.location.assign(nextPath + window.location.search);
  });

  // Match the original platform filtering, including desktop's two store badges.
  for (const platform of ['android', 'ios']) {
    if (['android', 'ios'].includes(os) && platform !== os) {
      document.getElementById(`${platform}-download-link`).remove();
    }
  }
  downloads.dataset.linksAmount = downloads.children.length;
  heading.textContent = (action === 'default' ? '' : '1. ') + translations.general_download_game;
  const leadKeys = {
    add_friend: 'lead_add_friend', join_clan: 'lead_join_clan', join_team: 'lead_join_team',
    support_creator: 'lead_support_creator', scid_friend: 'lead_scid_friend', voucher: 'lead_voucher', invite: 'lead_invite'
  };
  // Keep action-specific instructions without restoring the default tagline.
  let leadWrapper = document.querySelector('.lead-wrapper');
  const leadText = translations[leadKeys[action]];
  if (leadText) {
    if (!leadWrapper) {
      leadWrapper = document.createElement('div');
      leadWrapper.className = 'lead-wrapper';
      leadWrapper.append(document.createElement('p'));
      document.querySelector('.qr-button-wrapper').before(leadWrapper);
    }
    leadWrapper.querySelector('p').textContent = '2. ' + leadText.replaceAll(/&shy;/g, '\u00ad');
  } else {
    leadWrapper?.remove();
  }
  button.querySelector('span').innerHTML = translations[`cta_${action}`] || translations.cta_default;
  button.dataset.testid = 'open-game-button';

  // Preserve the original special-voucher download destinations.
  const params = new URLSearchParams(window.location.search);
  if (params.get('code') && params.get('action') === 'voucher') {
    let hash = '';
    try {
      const bytes = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(params.get('code')));
      hash = Array.from(new Uint8Array(bytes), byte => byte.toString(16).padStart(2, '0')).join('');
    } catch { /* Keep the standard store links if hashing is unavailable. */ }
    if (config.hashedSpecialVoucherCodes.includes(hash)) {
      for (const [platform, href] of Object.entries(config.specialDownloadLinks)) {
        document.getElementById(`${platform}-download-link`)?.setAttribute('href', href);
      }
    }
  }

  // Translated pages share this script; replace their legacy QR canvas too.
  const legacyCanvas = qrContainer.querySelector('canvas');
  if (legacyCanvas) {
    legacyCanvas.outerHTML = '<img src="/qr_code.png" alt="QR Code" class="qr-code page-qr" width="400" height="400">';
  }
  const qrImage = qrContainer.querySelector('img');
  // Keep the existing square size despite the general content-image height rule.
  qrImage.style.height = getComputedStyle(qrImage).width;
  const showQRCode = () => qrContainer.classList.remove('loading');
  qrImage.addEventListener('load', showQRCode, { once: true });
  qrImage.addEventListener('error', () => qrContainer.classList.add('hidden'), { once: true });
  if (qrImage.complete && qrImage.naturalWidth > 0) showQRCode();

  function getAction(search) {
    if (search.includes('invite')) return 'invite';
    if (search.includes('action') && search.includes('voucher')) return 'voucher';
    if (search.includes('addFriend') || search.includes('add_friend')) return 'add_friend';
    if (search.includes('copyDeck')) return 'copy_deck';
    if (search.includes('join_team')) return 'join_team';
    if (search.includes('join_clan')) return 'join_clan';
    if (search.includes('supercell_id')) return 'scid_friend';
    if (search.includes('supportcreator')) return 'support_creator';
    return 'default';
  }
})().catch(error => console.error('Could not initialize the landing page:', error));

async function loadJSON(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Could not load ${url}: HTTP ${response.status}`);
  return response.json();
}
