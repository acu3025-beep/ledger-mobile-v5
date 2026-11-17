'use strict';

const $ = id => document.getElementById(id);

const fmtNumber = n => new Intl.NumberFormat('nl-NL', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
}).format(n);

const money = n => '€ ' + fmtNumber(n);

const dateLabel = s => {
  const d = new Date(s + 'T12:00:00');
  const day = d.getDate();
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  return `${day} ${months[d.getMonth()]}`;
};

const fields = ['search', 'amount', 'direction', 'from', 'to', 'type'];

// SVG Brand & Category Icons
const brandIcons = {
  // Orange Transfer circle with (€) -> (Exact match for Screenshot 2)
  orangeTransfer: `<svg viewBox="0 0 38 38" fill="none"><circle cx="19" cy="19" r="19" fill="#ff6200"/><circle cx="13" cy="19" r="7.5" stroke="#ffffff" stroke-width="1.8"/><path d="M14.5 16.5c-.4-.6-1-1-1.8-1-1.3 0-2.2 1.1-2.2 2.5 0 1.5.9 2.5 2.2 2.5.8 0 1.4-.4 1.8-1M10 18h4.5M10 20h4.5" stroke="#ffffff" stroke-width="1.4" stroke-linecap="round"/><path d="M23 19h7m-3-3 3 3-3 3" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,

  // KFC Logo (Screenshot 2)
  kfc: `<svg viewBox="0 0 38 38"><rect width="38" height="38" rx="8" fill="#a3080c"/><rect x="6" y="5" width="26" height="28" rx="3" fill="#ffffff"/><path d="M10 5h5v28h-5zM23 5h5v28h-5z" fill="#a3080c"/><text x="19" y="22" font-family="-apple-system,BlinkMacSystemFont,Arial,sans-serif" font-weight="900" font-size="9" fill="#a3080c" text-anchor="middle" letter-spacing="-0.5">KFC</text></svg>`,

  // Shell Logo (Screenshot 2)
  shell: `<svg viewBox="0 0 38 38"><rect width="38" height="38" rx="8" fill="#ffffff"/><path d="M19 6c-6.6 0-11.5 4.5-12 11.5-.4 4.5 2.2 9 6.5 11.5l1.5 3h8l1.5-3c4.3-2.5 6.9-7 6.5-11.5C30.5 10.5 25.6 6 19 6z" fill="#fbce07" stroke="#dd1d21" stroke-width="2"/><path d="M19 6v22M14 9l2 19M24 9l-2 19M10 14l5 13M28 14l-5 13" stroke="#dd1d21" stroke-width="1.5"/></svg>`,

  // TMC Logo (Screenshot 2)
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

  // Special match for Screenshot 2 items
  if (upper.includes('GEMEENTE') || upper.includes('AMSTERDAM') && t.amount > 0) {
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

function screen(accountView) {
  $('overview').hidden = accountView;
  $('account').hidden = !accountView;
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

$('openAccount').onclick = () => {
  window.location.hash = 'account';
  screen(true);
  searchMode(false);
};
$('back').onclick = () => {
  window.location.hash = '';
  screen(false);
};
$('home').onclick = () => {
  window.location.hash = '';
  screen(false);
};
$('searchToggle').onclick = () => searchMode(true);
$('searchClose').onclick = () => searchMode(false);

window.addEventListener('hashchange', () => {
  screen(window.location.hash === '#account');
});
if (window.location.hash === '#account') {
  screen(true);
}

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
  if ($('count')) $('count').textContent = '';
  if ($('resultTotal')) $('resultTotal').textContent = '';

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

function show(t) {
  lastFocus = document.activeElement;
  $('detailName').textContent = t.name;
  $('detailAmount').textContent = (t.amount > 0 ? '€ +' : '€ -') + fmtNumber(Math.abs(t.amount));
  
  $('detailFields').replaceChildren();
  const names = {
    income: 'Income',
    transfer: 'Transfer',
    card: 'Card payment',
    'direct-debit': 'Direct debit'
  };

  const values = {
    'Date': dateLabel(t.date),
    'Category': t.category || 'Payment',
    'Type': names[t.type] || t.type,
    'Account': t.account || 'NL67 INGB 0665 9381 52',
    'Description': t.description || ''
  };

  if (t.modified) {
    values['Original date'] = dateLabel(t.originalDate);
    values['Original amount'] = money(t.originalAmount);
    values['DEMO Scenario'] = 'EUR -1.050,00 on the 25th of the month.';
  }

  for (const [key, value] of Object.entries(values)) {
    const dt = document.createElement('dt');
    const dd = document.createElement('dd');
    dt.textContent = key;
    dd.textContent = value;
    dd.style.whiteSpace = 'pre-wrap';
    $('detailFields').append(dt, dd);
  }

  $('detail').showModal();
}

$('close').onclick = () => $('detail').close();
$('detail').addEventListener('close', () => lastFocus?.focus());

fields.forEach(id => $(id).addEventListener('input', () => render()));
$('reset').onclick = () => {
  fields.forEach(id => $(id).value = '');
  render();
};

document.querySelectorAll('[data-demo]').forEach(b => {
  b.onclick = () => {
    lastFocus = b;
    $('detailName').textContent = b.dataset.demo;
    $('detailAmount').textContent = 'DEMO';
    $('detailFields').textContent = 'This action is a demo preview.';
    $('detail').showModal();
  };
});

function network() {
  $('connection').textContent = navigator.onLine ? 'Online' : 'Offline';
}

window.addEventListener('online', network);
window.addEventListener('offline', network);
network();
render();
