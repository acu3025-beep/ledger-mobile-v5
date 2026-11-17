'use strict';

(function () {
  const setup = document.getElementById('setup');
  const status = document.getElementById('unlockStatus');
  const button = document.getElementById('unlockButton');
  const input = document.getElementById('vaultPassword');

  const decode = s => Uint8Array.from(atob(s), c => c.charCodeAt(0));

  setup.addEventListener('cancel', e => {
    if (!LedgerPrivate.getStatus().loaded) e.preventDefault();
  });

  if (!LedgerPrivate.getStatus().loaded) {
    setup.showModal();
  }

  async function unlock(password, vault) {
    if (vault.format !== 'ledger-vault-v1' || vault.iterations !== 600000 || vault.aad !== 'ledger-mobile-v5') {
      throw Error('INVALID_VAULT');
    }
    const base = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(password),
      'PBKDF2',
      false,
      ['deriveKey']
    );
    const key = await crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        hash: 'SHA-256',
        salt: decode(vault.salt),
        iterations: vault.iterations
      },
      base,
      { name: 'AES-GCM', length: 256 },
      false,
      ['decrypt']
    );
    const clear = await crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: decode(vault.iv),
        additionalData: new TextEncoder().encode(vault.aad)
      },
      key,
      decode(vault.ciphertext)
    );
    return JSON.parse(new TextDecoder().decode(clear));
  }

  window.LedgerVault = { unlock };

  document.getElementById('unlockForm').onsubmit = async e => {
    e.preventDefault();
    button.disabled = true;
    status.textContent = 'Unlocking data…';
    try {
      if (!crypto.subtle) throw Error('HTTPS_REQUIRED');
      const response = await fetch('./vault.json');
      if (!response.ok) throw Error('VAULT_UNAVAILABLE');
      const data = await unlock(input.value.trim(), await response.json());
      const result = LedgerPrivate.load(data);
      input.value = '';
      setup.close();
      if (window.location.hash === '#account') {
        screen(true);
      } else {
        screen(false);
      }
      if (!result.saved) {
        alert('Data loaded, but could not be saved to local storage. You will need your access code again on reload.');
      }
    } catch (err) {
      status.textContent =
        err.message === 'HTTPS_REQUIRED'
          ? 'Please open this app over HTTPS.'
          : err.message === 'VAULT_UNAVAILABLE' || err.name === 'TypeError'
          ? 'Data not available. Check your network connection.'
          : 'Incorrect access code or corrupted vault file.';
    } finally {
      button.disabled = false;
    }
  };

  let refreshing = false;
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (!refreshing) {
        refreshing = true;
        location.reload();
      }
    });
    navigator.serviceWorker
      .register('./sw.js', { updateViaCache: 'none' })
      .then(async registration => {
        await navigator.serviceWorker.ready;
        document.getElementById('offline').textContent = 'Version 5 · Offline ready.';
        registration.update().catch(() => {});
      })
      .catch(() => {
        document.getElementById('offline').textContent = 'Version 5 · Offline caching pending.';
      });
  } else {
    document.getElementById('offline').textContent = 'Version 5 · Use HTTPS for installation.';
  }
})();
