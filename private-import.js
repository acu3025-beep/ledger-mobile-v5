'use strict';

(function () {
  const KEY = 'ledger-mobile-v5-personal-20261117';
  let imported = null;
  const example = DEMO_DATA.map(t => ({ ...t }));

  const numeric = v => typeof v === 'number' && Number.isFinite(v);

  function validate(d) {
    if (!d || d.format !== 'ledger-private-demo-v1' || !Array.isArray(d.transactions) || d.transactions.length < 1 || d.transactions.length > 25000 || !numeric(d.openingBalance) || typeof d.owner !== 'string' || typeof d.account !== 'string') {
      throw Error('Invalid data structure.');
    }
    const ids = new Set();
    for (const t of d.transactions) {
      if (!t || typeof t.id !== 'string' || ids.has(t.id) || typeof t.name !== 'string' || typeof t.description !== 'string' || typeof t.account !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(t.date) || !numeric(t.amount) || !['card', 'direct-debit', 'income', 'transfer'].includes(t.type) || !numeric(t.originalAmount) || !/^\d{4}-\d{2}-\d{2}$/.test(t.originalDate)) {
        throw Error('Invalid transaction entry.');
      }
      ids.add(t.id);
    }
    return d;
  }

  function balances() {
    const value = (imported ? imported.openingBalance : 0) + DEMO_DATA.reduce((s, t) => s + t.amount, 0);
    const balStr = money(value);
    if ($('balance')) $('balance').textContent = balStr;
    if ($('overviewBalance')) $('overviewBalance').textContent = balStr;

    const owner = imported ? imported.owner : 'Hr M Black';
    const acc = imported ? imported.account : 'NL67 INGB 0665 9381 52';

    if ($('overviewOwner')) $('overviewOwner').textContent = owner;
    if ($('accountOwner')) $('accountOwner').textContent = owner;
    if ($('overviewAccount')) $('overviewAccount').textContent = acc;
    if ($('accountIban')) $('accountIban').textContent = acc;
  }

  const oldRender = render;
  render = function () {
    oldRender();
    if (imported && $('count')) {
      $('count').textContent = imported.transactions.length + ' transactions · DEMO';
    }
  };

  function activate(d) {
    imported = d;
    DEMO_DATA.splice(0, DEMO_DATA.length, ...d.transactions);
    balances();
    render();
  }

  const oldShow = show;
  show = function (t) {
    oldShow(t);
    const note = document.querySelector('.demoNote');
    if (!imported) {
      if (note) note.textContent = 'Demo transaction';
      return;
    }
    if (note) note.textContent = t.modified ? 'DEMO: amount and date adjusted' : 'Source transaction · DEMO';
    const fieldsEl = $('detailFields');
    fieldsEl.replaceChildren();
    const values = {
      'Date': dateLabel(t.date),
      'Type': t.sourceType || t.type,
      'Account': t.account,
      'Page in statement': String(t.sourcePage || '1'),
      'Description': t.description
    };
    if (t.modified) {
      values['Original date'] = dateLabel(t.originalDate);
      values['Original amount'] = money(t.originalAmount);
      values['DEMO modification'] = 'Scenario adjustment: EUR -1.050,00 on the 25th.';
    }
    for (const [key, value] of Object.entries(values)) {
      const dt = document.createElement('dt');
      const dd = document.createElement('dd');
      dt.textContent = key;
      dd.textContent = value;
      dd.style.whiteSpace = 'pre-wrap';
      fieldsEl.append(dt, dd);
    }
  };

  // Wire settings button to data management
  const settingsBtns = [...document.querySelectorAll('[data-demo]')].filter(b => b.dataset.demo === 'Settings');
  for (const b of settingsBtns) {
    b.onclick = () => {
      lastFocus = b;
      $('detailName').textContent = 'Personal Data';
      $('detailAmount').textContent = 'DEMO';
      const note = document.querySelector('.demoNote');
      if (note) note.textContent = 'Data is stored locally on this device.';
      const fieldsEl = $('detailFields');
      fieldsEl.replaceChildren();

      const text = document.createElement('p');
      text.style.fontSize = '14px';
      text.textContent = imported ? `Loaded: ${imported.transactions.length} transactions.` : 'Load personal DEMO dataset. Nothing is sent to GitHub or external servers.';

      const label = document.createElement('label');
      label.style.display = 'block';
      label.style.marginTop = '12px';
      label.textContent = 'Select JSON data file:';

      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.json,application/json';
      input.style.marginTop = '6px';
      input.setAttribute('aria-label', 'Personal data file');
      label.append(input);

      const status = document.createElement('p');
      status.setAttribute('role', 'status');
      status.style.fontSize = '13px';
      status.style.marginTop = '8px';

      input.onchange = async () => {
        try {
          const file = input.files[0];
          if (!file) return;
          if (file.size > 15000000) throw Error('File is too large.');
          const d = validate(JSON.parse(await file.text()));
          let saved = true;
          try {
            localStorage.setItem(KEY, JSON.stringify(d));
          } catch {
            saved = false;
          }
          activate(d);
          text.textContent = `Loaded: ${d.transactions.length} transactions.`;
          status.style.color = '#00875a';
          status.textContent = saved ? 'Saved on this device.' : 'Loaded for this session.';
        } catch (e) {
          status.style.color = '#e3001b';
          status.textContent = 'Import failed: ' + e.message;
        }
      };

      fieldsEl.append(text, label, status);

      if (imported) {
        const reset = document.createElement('button');
        reset.className = 'purpleOutline';
        reset.style.marginTop = '16px';
        reset.textContent = 'Clear personal data from this device';
        reset.onclick = () => {
          localStorage.removeItem(KEY);
          imported = null;
          DEMO_DATA.splice(0, DEMO_DATA.length, ...example);
          balances();
          render();
          location.reload();
        };
        fieldsEl.append(reset);
      }
      $('detail').showModal();
    };
  }

  window.LedgerPrivate = {
    getStatus: () => ({ loaded: !!imported, count: imported?.transactions.length || 0 }),
    load(d) {
      d = validate(d);
      let saved = true;
      try {
        localStorage.setItem(KEY, JSON.stringify(d));
      } catch {
        saved = false;
      }
      activate(d);
      return { saved, count: d.transactions.length };
    }
  };

  try {
    const saved = localStorage.getItem(KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      // If saved data is older, allow fresh vault to take over if requested
      activate(validate(parsed));
    }
  } catch (e) {
    console.warn('Personal data not loaded from storage.');
  }

  if (window.PRIVATE_DEMO_DATA && !imported) {
    activate(validate(window.PRIVATE_DEMO_DATA));
  }
})();
