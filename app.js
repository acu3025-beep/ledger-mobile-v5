'use strict';

const $ = id => document.getElementById(id);

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const fmtNumber = n => new Intl.NumberFormat('nl-NL', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
}).format(n);

const money = n => '€ ' + fmtNumber(n);

const dateLabel = s => {
  const d = new Date(s + 'T12:00:00');
  const day = d.getDate();
  return `${day} ${months[d.getMonth()]}`;
};

const fields = ['search', 'amount', 'direction', 'from', 'to', 'type'];

// SVG Brand & Category Icons
const brandIcons = {
  // Orange Transfer circle with (€) -> (Exact match for Screenshot 2 & 3)
  orangeTransfer: `<svg viewBox="0 0 38 38" fill="none"><circle cx="19" cy="19" r="19" fill="#ff6200"/><circle cx="13" cy="19" r="7.5" stroke="#ffffff" stroke-width="1.8"/><path d="M14.5 16.5c-.4-.6-1-1-1.8-1-1.3 0-2.2 1.1-2.2 2.5 0 1.5.9 2.5 2.2 2.5.8 0 1.4-.4 1.8-1M10 18h4.5M10 20h4.5" stroke="#ffffff" stroke-width="1.4" stroke-linecap="round"/><path d="M23 19h7m-3-3 3 3-3 3" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,

  // KFC Logo
  kfc: `<svg viewBox="0 0 38 38"><rect width="38" height="38" rx="8" fill="#a3080c"/><rect x="6" y="5" width="26" height="28" rx="3" fill="#ffffff"/><path d="M10 5h5v28h-5zM23 5h5v28h-5z" fill="#a3080c"/><text x="19" y="22" font-family="-apple-system,BlinkMacSystemFont,Arial,sans-serif" font-weight="900" font-size="9" fill="#a3080c" text-anchor="middle" letter-spacing="-0.5">KFC</text></svg>`,

  // Shell Logo
  shell: `<svg viewBox="0 0 38 38"><rect width="38" height="38" rx="8" fill="#ffffff"/><path d="M19 6c-6.6 0-11.5 4.5-12 11.5-.4 4.5 2.2 9 6.5 11.5l1.5 3h8l1.5-3c4.3-2.5 6.9-7 6.5-11.5C30.5 10.5 25.6 6 19 6z" fill="#fbce07" stroke="#dd1d21" stroke-width="2"/><path d="M19 6v22M14 9l2 19M24 9l-2 19M10 14l5 13M28 14l-5 13" stroke="#dd1d21" stroke-width="1.5"/></svg>`,

  // TMC Logo
  tmc: `<svg viewBox="0 0 38 38"><rect width="38" height="38" rx="8" fill="#2d6cb5"/><text x="19" y="23" font-family="-apple-system,BlinkMacSystemFont,Arial,sans-serif" font-weight="900" font-size="12" fill="#ffffff" text-anchor="middle" font-style="italic">TMC</text></svg>`,

  // Uber Logo
  uber: `<svg viewBox="0 0 38 38"><rect width="38" height="38" rx="8" fill="#000000"/><text x="19" y="24" font-family="-apple-system,BlinkMacSystemFont,Arial,sans-serif" font-weight="700" font-size="12" fill="#ffffff" text-anchor="middle" letter-spacing="-0.5">Uber</text></svg>`,

  // Albert Heijn Logo
  ah: `<svg viewBox="0 0 38 38"><rect width="38" height="38" rx="8" fill="#00a1e4"/><text x="19" y="24" font-family="-apple-system,BlinkMacSystemFont,Arial,sans-serif" font-weight="900" font-size="14" fill="#ffffff" text-anchor="middle" letter-spacing="-1">ah</text></svg>`,

  // Dirk Logo
  dirk: `<svg viewBox="0 0 38 38"><rect width="38" height="38" rx="8" fill="#e3001b"/><text x="19" y="24" font-family="-apple-system,BlinkMacSystemFont,Arial,sans-serif" font-weight="900" font-size="12" fill="#ffffff" text-anchor="middle">Dirk</text></svg>`,

  // Vomar Logo
  vomar: `<svg viewBox="0 0 38 38"><rect width="38" height="38" rx="8" fill="#e30613"/><text x="19" y="24" font-family="-apple-system,BlinkMacSystemFont,Arial,sans-serif" font-weight="900" font-size="10" fill="#ffffff" text-anchor="middle">VOMAR</text></svg>`,

  // Aldi Logo
  aldi: `<svg viewBox="0 0 38 38"><rect width="38" height="38" rx="8" fill="#002060"/><path d="M8 8h22v22H8z" fill="#002060"/><path d="M12 28l6-18h4l6 18h-4l-1.5-5h-9L12 28z" fill="#ffffff"/><path d="M15 19h6l-3-9z" fill="#ed8b00"/></svg>`,

  // DekaMarkt Logo
  dekamarkt: `<svg viewBox="0 0 38 38"><rect width="38" height="38" rx="8" fill="#e2001a"/><text x="19" y="24" font-family="-apple-system,BlinkMacSystemFont,Arial,sans-serif" font-weight="900" font-size="9" fill="#ffde00" text-anchor="middle">DEKA</text></svg>`,

  // Shelter Amsterdam Logo
  shelter: `<svg viewBox="0 0 38 38"><rect width="38" height="38" rx="8" fill="#1c1c1e"/><rect x="11" y="11" width="16" height="16" rx="2" fill="none" stroke="#ffffff" stroke-width="2"/><circle cx="19" cy="19" r="4" fill="#ffffff"/></svg>`,

  // OVpay Logo
  ovpay: `<svg viewBox="0 0 38 38"><rect width="38" height="38" rx="8" fill="#e6007e"/><path d="M12 24c0-5 3-9 7-9s7 4 7 9" stroke="#ffffff" stroke-width="3" stroke-linecap="round" fill="none"/><circle cx="19" cy="11" r="3" fill="#ffffff"/></svg>`,

  // TicketSwap
  ticketswap: `<svg viewBox="0 0 38 38"><rect width="38" height="38" rx="8" fill="#00b0ff"/><path d="M12 15h14M12 23h14M22 11l4 4-4 4M16 27l-4-4 4-4" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,

  // Kruidvat
  kruidvat: `<svg viewBox="0 0 38 38"><rect width="38" height="38" rx="8" fill="#e3001b"/><circle cx="19" cy="19" r="10" fill="#ffed00"/><path d="M19 13v12M13 19h12" stroke="#e3001b" stroke-width="3" stroke-linecap="round"/></svg>`,

  // Generic Card Terminal
  card: `<svg viewBox="0 0 38 38"><rect width="38" height="38" rx="8" fill="#f2f2f7"/><rect x="8" y="12" width="22" height="14" rx="2" fill="none" stroke="#555" stroke-width="1.8"/><line x1="8" y1="16" x2="30" y2="16" stroke="#555" stroke-width="1.8"/><circle cx="13" cy="22" r="1.5" fill="#555"/></svg>`,

  // Generic Direct Debit
  directDebit: `<svg viewBox="0 0 38 38"><rect width="38" height="38" rx="8" fill="#f2f2f7"/><path d="M12 23V15m7 8V11m7 12V18" stroke="#ff6200" stroke-width="2.5" stroke-linecap="round"/></svg>`,

  // Generic Transfer
  transfer: `<svg viewBox="0 0 38 38"><rect width="38" height="38" rx="8" fill="#f2f2f7"/><path d="M10 15h18m-5-5 5 5-5 5M28 23H10m5 5-5-5 5-5" stroke="#ff6200" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`
};

function getDisplayInfo(t) {
  const name = t.name || '';
  const upper = name.toUpperCase();

  // Match special items
  if (upper.includes('GEMEENTE') || (upper.includes('AMSTERDAM') && t.amount > 0)) {
    return { name: 'Gemeente Amsterdam', icon: brandIcons.orangeTransfer, isCircle: true };
  }
  if (upper.includes('KFC')) {
    return { name: 'KFC', icon: brandIcons.kfc, isCircle: false };
  }
  if (upper.includes('SHELL')) {
    return { name: 'Shell', icon: brandIcons.shell, isCircle: false };
  }
  if (upper.includes('TMC')) {
    return { name: 'TMC', icon: brandIcons.tmc, isCircle: false };
  }
  if (upper.includes('KHAZANI')) {
    return { name: 'A KHAZANI', icon: brandIcons.orangeTransfer, isCircle: true };
  }
  if (upper.includes('SHELTER')) {
    return { name: 'Shelter Amsterdam', icon: brandIcons.shelter, isCircle: false };
  }
  if (upper.includes('DEKAMARKT')) {
    return { name: 'DekaMarkt', icon: brandIcons.dekamarkt, isCircle: false };
  }
  if (upper.includes('UBER')) {
    return { name: 'Uber', icon: brandIcons.uber, isCircle: false };
  }
  if (upper.includes('DIRK')) {
    return { name: 'Dirk', icon: brandIcons.dirk, isCircle: false };
  }
  if (upper.includes('VOMAR')) {
    return { name: 'Vomar', icon: brandIcons.vomar, isCircle: false };
  }
  if (upper.includes('ALDI')) {
    return { name: 'ALDI', icon: brandIcons.aldi, isCircle: false };
  }
  if (upper.includes('ALBERT HEIJN')) {
    return { name: 'Albert Heijn', icon: brandIcons.ah, isCircle: false };
  }
  if (upper.includes('KRUIDVAT')) {
    return { name: 'Kruidvat', icon: brandIcons.kruidvat, isCircle: false };
  }
  if (upper.includes('OVPAY')) {
    return { name: 'OVpay', icon: brandIcons.ovpay, isCircle: false };
  }
  if (upper.includes('TICKETSWAP')) {
    return { name: 'TicketSwap', icon: brandIcons.ticketswap, isCircle: false };
  }
  if (t.amount > 0) {
    return { name: name, icon: brandIcons.orangeTransfer, isCircle: true };
  }
  if (t.type === 'direct-debit') {
    return { name: name, icon: brandIcons.directDebit, isCircle: false };
  }
  return { name: name, icon: brandIcons.card, isCircle: false };
}

let lastFocus;
let currentSelectedTx = null;

function screen(view) {
  $('overview').hidden = (view !== 'overview');
  $('account').hidden = (view !== 'account');
  $('txDetail').hidden = (view !== 'detail');
  window.scrollTo(0, 0);
}

function searchMode(open) {
  $('searchPanel').hidden = !open;
  $('accountIntro').hidden = open;
  if (open) $('search').focus();
  else {
    fields.forEach(id => $(id).value = '');
    render();
  }
}

// Navigation event handlers
$('openAccount').onclick = () => {
  window.location.hash = 'account';
  screen('account');
  searchMode(false);
};
$('back').onclick = () => {
  window.location.hash = '';
  screen('overview');
};
$('home').onclick = () => {
  window.location.hash = '';
  screen('overview');
};
$('detailBack').onclick = () => {
  window.location.hash = 'account';
  screen('account');
};
$('searchToggle').onclick = () => searchMode(true);
$('searchClose').onclick = () => searchMode(false);

window.addEventListener('hashchange', () => {
  const h = window.location.hash;
  if (h === '#detail' && currentSelectedTx) {
    renderTxDetail(currentSelectedTx);
    screen('detail');
  } else if (h === '#account') {
    screen('account');
  } else {
    screen('overview');
  }
});

let visibleLimit = 80;
let lastFilterKey = '';

function render() {
  const f = Object.fromEntries(fields.map(id => [id === 'search' ? 'q' : id, $(id).value]));
  const filterKey = JSON.stringify(f);
  if (filterKey !== lastFilterKey) {
    visibleLimit = 80;
    lastFilterKey = filterKey;
  }

  const rows = Ledger.filter(DEMO_DATA, f);
  $('list').replaceChildren();

  let currentDate = '';
  let groupEl = null;

  for (const t of rows.slice(0, visibleLimit)) {
    if (t.date !== currentDate) {
      currentDate = t.date;
      groupEl = document.createElement('section');
      groupEl.className = 'dategroup';

      const head = document.createElement('div');
      head.className = 'datehead';
      head.textContent = dateLabel(currentDate);

      groupEl.append(head);
      $('list').append(groupEl);
    }

    const rowBtn = document.createElement('button');
    rowBtn.className = 'txRow';
    rowBtn.type = 'button';

    const info = getDisplayInfo(t);

    const iconSpan = document.createElement('span');
    iconSpan.className = 'txIconWrap' + (info.isCircle ? ' circle' : '');
    iconSpan.innerHTML = info.icon;

    const nameSpan = document.createElement('span');
    nameSpan.className = 'txName';
    nameSpan.textContent = info.name;

    const amtSpan = document.createElement('span');
    amtSpan.className = 'txAmount' + (t.amount > 0 ? ' positive' : '');
    amtSpan.textContent = (t.amount > 0 ? '€ +' : '€ -') + fmtNumber(Math.abs(t.amount));

    rowBtn.append(iconSpan, nameSpan, amtSpan);
    rowBtn.onclick = () => show(t);
    groupEl.append(rowBtn);
  }

  if (rows.length > visibleLimit) {
    const moreBtn = document.createElement('button');
    moreBtn.className = 'purpleOutline';
    moreBtn.style.cssText = 'display:block;margin:20px auto;';
    moreBtn.textContent = 'More transactions (' + Math.min(80, rows.length - visibleLimit) + ')';
    moreBtn.onclick = () => {
      visibleLimit += 80;
      render();
    };
    $('list').append(moreBtn);
  }

  if (!rows.length) {
    const p = document.createElement('p');
    p.style.cssText = 'padding:40px 16px;text-align:center;color:#8e8e93;';
    p.textContent = f.from && f.to && f.from > f.to ? 'Start date is after end date.' : 'No transactions found. Adjust your search or filters.';
    $('list').append(p);
  }
}

// Full Transaction Detail View matching Image 3
function renderTxDetail(t) {
  const info = getDisplayInfo(t);
  const isPositive = t.amount > 0;

  // Hero Section
  $('detailHeroIcon').innerHTML = info.icon;
  $('detailHeroName').textContent = info.name;
  $('detailHeroAmount').textContent = (isPositive ? '€ +' : '€ -') + fmtNumber(Math.abs(t.amount));
  $('detailHeroAmount').className = 'txHeroAmount ' + (isPositive ? 'positive' : 'negative');
  $('detailHeroType').textContent = t.sourceType || (isPositive ? 'Transfer' : 'Payment terminal');

  // Fields Section
  const container = $('txFieldsList');
  container.replaceChildren();

  function addField(label, mainText, subText, copyVal) {
    const row = document.createElement('div');
    row.className = 'txFieldRow';

    const lbl = document.createElement('p');
    lbl.className = 'txFieldLabel';
    lbl.textContent = label;
    row.append(lbl);

    const valRow = document.createElement('div');
    valRow.className = 'txFieldValueRow';

    const textCol = document.createElement('div');
    const main = document.createElement('div');
    main.className = 'txFieldMain';
    main.textContent = mainText;
    textCol.append(main);

    if (subText) {
      const sub = document.createElement('div');
      sub.className = 'txFieldSub';
      sub.textContent = subText;
      textCol.append(sub);
    }
    valRow.append(textCol);

    if (copyVal) {
      const copyBtn = document.createElement('button');
      copyBtn.className = 'txCopyBtn';
      copyBtn.setAttribute('aria-label', 'Copy ' + label);
      copyBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`;
      copyBtn.onclick = async () => {
        try {
          await navigator.clipboard.writeText(copyVal.replace(/\s+/g, ''));
          copyBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="#00875a" stroke-width="2.5" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>`;
          setTimeout(() => {
            copyBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`;
          }, 1500);
        } catch (e) {}
      };
      valRow.append(copyBtn);
    }

    row.append(valRow);
    container.append(row);
  }

  const owner = window.LedgerPrivate?.getOwner?.() || 'Hr M Black';
  const myAccount = window.LedgerPrivate?.getAccount?.() || 'NL67 INGB 0665 9381 52';

  // Extract IBAN from description
  const ibanMatch = t.description && t.description.match(/IBAN:\s*([A-Z0-9]+)/i);
  let otherIban = '';
  if (ibanMatch) {
    const raw = ibanMatch[1];
    otherIban = raw.length === 18
      ? `${raw.slice(0,4)} ${raw.slice(4,8)} ${raw.slice(8,12)} ${raw.slice(12,16)} ${raw.slice(16)}`
      : raw;
  }

  if (isPositive) {
    // Exactly matches Image 3 (From A KHAZANI, To Hr M Black)
    addField('From', info.name, otherIban, otherIban);
    addField('To', owner, myAccount, myAccount);
  } else {
    addField('From', owner, myAccount, myAccount);
    addField('To', info.name, otherIban || undefined, otherIban || undefined);
  }

  // Card details if available
  const cardMatch = t.description && t.description.match(/Card no:\s*(.+)/i);
  if (cardMatch) {
    addField('Card', cardMatch[1].trim());
  }
  if (t.description && t.description.includes('Apple Pay')) {
    addField('Payment method', 'Apple Pay');
  }

  // Transaction Date & Time
  let txDateStr = dateLabel(t.date);
  const dtMatch = t.description && t.description.match(/Date\/time:\s*(\d{2})\/(\d{2})\/(\d{4})\s*(\d{1,2}):(\d{2})/i);
  const timeMatch = t.description && t.description.match(/Time:\s*(\d{1,2}):(\d{2})/i);
  if (dtMatch) {
    txDateStr = `${dateLabel(t.date)} at ${Number(dtMatch[4])}:${dtMatch[5]}`;
  } else if (timeMatch) {
    txDateStr = `${dateLabel(t.date)} at ${Number(timeMatch[1])}:${timeMatch[2]}`;
  }
  addField('Transaction date', txDateStr);

  // Processing Date
  let procDateStr = dateLabel(t.date);
  const valMatch = t.description && t.description.match(/Value date:\s*(\d{2})\/(\d{2})\/(\d{4})/i);
  if (valMatch) {
    const d = new Date(`${valMatch[3]}-${valMatch[2]}-${valMatch[1]}T12:00:00`);
    procDateStr = `${d.getDate()} ${months[d.getMonth()]}`;
  }
  addField('Processing date', procDateStr);

  // Description / note
  const descMatch = t.description && t.description.match(/Description:\s*(.+)/i);
  if (descMatch && descMatch[1].trim()) {
    addField('Description', descMatch[1].trim());
  }
}

function show(t) {
  currentSelectedTx = t;
  window.location.hash = 'detail';
  renderTxDetail(t);
  screen('detail');
}

fields.forEach(id => $(id).addEventListener('input', () => render()));
$('reset').onclick = () => {
  fields.forEach(id => $(id).value = '');
  render();
};

document.querySelectorAll('[data-demo]').forEach(b => {
  b.onclick = () => {
    lastFocus = b;
    $('detailName').textContent = b.dataset.demo;
    $('detailAmount').textContent = '';
    $('detailFields').textContent = 'Feature preview.';
    $('detail').showModal();
  };
});

// Initial screen check
if (window.location.hash === '#account') {
  screen('account');
} else if (window.location.hash === '#detail') {
  screen('account');
} else {
  screen('overview');
}

render();
