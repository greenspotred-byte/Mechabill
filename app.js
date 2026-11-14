/* Garage Checkout – POS + Image Scan
   Deploy: Cloudflare Pages / Workers static assets
*/

const PRODUCTS = [
  // 🔧 Maintenance
  { id: 'air-filter', name: 'Air Filter', price: 900, cat: 'maintenance', unit: 1, aliases: ['air filter'] },
  { id: 'engine-oil', name: 'Engine Oil', price: 600, cat: 'maintenance', unit: 1, aliases: ['engine oil'] },
  { id: 'spark-plug', name: 'Spark Plug', price: 300, cat: 'maintenance', unit: 4, aliases: ['spark plug'] },
  { id: 'brakepad', name: 'Brakepad Replacement', price: 900, cat: 'maintenance', unit: 4, aliases: ['brakepad replacement', 'brakepad'] },
  { id: 'clutch', name: 'Clutch Replacement', price: 900, cat: 'maintenance', unit: 1, aliases: ['clutch replacement', 'clutch'] },
  { id: 'suspension-parts', name: 'Suspension Parts', price: 900, cat: 'maintenance', unit: 1, aliases: ['suspension parts'] },
  { id: 'tyre-replacement', name: 'Tyre Replacement', price: 600, cat: 'maintenance', unit: 4, aliases: ['tyre replacement', 'tire replacement'] },
  { id: 'repair-kit', name: 'Repair Kit', price: 600, cat: 'maintenance', unit: 1, aliases: ['repair kit'] },
  { id: 'full-service', name: 'Full Service', price: 10000, cat: 'maintenance', unit: 1, aliases: ['full service'] },

  // 🎨 Cosmetic — ชื่อหลักตรงตามในเกม (หลัง ·)
  { id: 'cosmetic-parts', name: 'Cosmetic Parts', price: 900, cat: 'cosmetic', unit: 1, aliases: [
    'cosmetic parts',
    // รายการไทย/อังกฤษที่ขึ้นเป็น Cosmetic Parts ในเกม
    'livery', 'กันชนหน้า', 'กันชนหลัง', 'สเกิร์ตข้าง', 'ฝากระโปรง', 'แก้มข้างท้าย', 'แก้มข้างซ้าย', 'แก้มข้างขวา',
    'สปอยเลอร์', 'ท่อไอเสีย', 'โครงสร้าง', 'หลังคา', 'trimextra', 'airfilter', 'aerials', 'tank', 'plate'
  ]},
  { id: 'extras-kit', name: 'Extras Kit', price: 1200, cat: 'cosmetic', unit: 1, aliases: [
    'extras kit', 'extra1', 'extra2', 'extra10', 'extra'
  ]},
  { id: 'lighting-controller', name: 'Lighting Controller', price: 1200, cat: 'cosmetic', unit: 1, aliases: [
    'lighting controller', 'xenon', 'neon'
  ]},
  { id: 'respray-kit', name: 'Respray Kit', price: 600, cat: 'cosmetic', unit: 1, aliases: [
    'respray kit', 'สีมุก', 'สีหลัก', 'สีรอง', 'สีดำ', 'สีเทา', 'สีขาว', 'interiorcolor'
  ]},
  { id: 'stancer-kit', name: 'Stancer Kit', price: 1800, cat: 'cosmetic', unit: 1, aliases: [
    'stancer kit', 'ปรับทรง'
  ]},
  { id: 'tyre-smoke', name: 'Tyre Smoke Kit', price: 600, cat: 'cosmetic', unit: 1, aliases: [
    'tyre smoke kit', 'tyre smoke'
  ]},
  { id: 'wheels-set', name: 'Vehicle Wheels Set', price: 900, cat: 'cosmetic', unit: 1, aliases: [
    'vehicle wheels set', 'wheels set'
  ]},

  // 🛞 Tyres
  { id: 'offroad-tyres', name: 'Offroad Tyres', price: 600, cat: 'tyres', unit: 1, aliases: ['offroad tyres'] },
  { id: 'semi-slick', name: 'Semi Slick Tyres', price: 600, cat: 'tyres', unit: 1, aliases: ['semi slick tyres', 'semi slick'] },
  { id: 'slick-tyres', name: 'Slick Tyres', price: 600, cat: 'tyres', unit: 1, aliases: ['slick tyres'] },

  // ⚙️ Engine
  { id: 'engine-stock', name: 'ชุดแต่งเครื่องยนต์ Stock Plus Lv.0', price: 7500, cat: 'engine', unit: 1, aliases: ['stock plus', 'lv.0'] },
  { id: 'engine-street', name: 'ชุดแต่งเครื่องยนต์ Street Lv.1', price: 15000, cat: 'engine', unit: 1, aliases: ['ชุดแต่งเครื่องยนต์ street', 'street lv.1'] },
  { id: 'engine-sport', name: 'ชุดแต่งเครื่องยนต์ Sport Lv.2', price: 22500, cat: 'engine', unit: 1, aliases: ['ชุดแต่งเครื่องยนต์ sport'] },
  { id: 'engine-race', name: 'ชุดแต่งเครื่องยนต์ Race Lv.3', price: 30000, cat: 'engine', unit: 1, aliases: [
    'ชุดแต่งเครื่องยนต์ race lv.3', 'ชุดแต่งเครื่องยนต์ race', 'race lv.3', 'เครื่องยนต์'
  ]},

  // 🛑 Brake
  { id: 'brake-street', name: 'ชุดเบรก Street Lv.1', price: 15000, cat: 'brake', unit: 1, aliases: ['ชุดเบรก street'] },
  { id: 'brake-race', name: 'ชุดเบรก Race Lv.2', price: 30000, cat: 'brake', unit: 1, aliases: [
    'ชุดเบรก race lv.2', 'ชุดเบรก race', 'ชุดเบรก', 'เบรก'
  ]},

  // 🛞 Suspension
  { id: 'suspension-sport', name: 'ชุดช่วงล่าง Sport', price: 30000, cat: 'suspension', unit: 1, aliases: [
    'ชุดช่วงล่าง sport', 'ชุดช่วงล่าง', 'ช่วงล่าง'
  ]},

  // ⚙️ Transmission
  { id: 'trans-street', name: 'ชุดเกียร์ Street Lv.1', price: 15000, cat: 'transmission', unit: 1, aliases: ['ชุดเกียร์ street'] },
  { id: 'trans-race', name: 'ชุดเกียร์ Race Lv.2', price: 30000, cat: 'transmission', unit: 1, aliases: [
    'ชุดเกียร์ race lv.2', 'ชุดเกียร์ race', 'ชุดเกียร์', 'เกียร์'
  ]},

  // 💨 Turbo
  { id: 'turbo', name: 'ชุดเทอร์โบ', price: 30000, cat: 'turbo', unit: 1, aliases: [
    'ชุดเทอร์โบ', 'เทอร์โบ', 'turbo'
  ]},

  // 🛡️ Armor
  { id: 'armor-20', name: 'ชุดเกราะ 20%', price: 7500, cat: 'armor', unit: 1, aliases: ['ชุดเกราะ 20%', 'เกราะ 20'] },
  { id: 'armor-40', name: 'ชุดเกราะ 40%', price: 15000, cat: 'armor', unit: 1, aliases: ['ชุดเกราะ 40%', 'เกราะ 40'] },
  { id: 'armor-60', name: 'ชุดเกราะ 60%', price: 22500, cat: 'armor', unit: 1, aliases: ['ชุดเกราะ 60%', 'เกราะ 60'] },
  { id: 'armor-100', name: 'ชุดเกราะ 100%', price: 30000, cat: 'armor', unit: 1, aliases: ['ชุดเกราะ 100%', 'เกราะ 100', 'ชุดเกราะ'] },

  // ⚡ EV
  { id: 'ev-battery', name: 'EV Battery', price: 900, cat: 'ev', unit: 1, aliases: ['ev battery'] },
  { id: 'ev-coolant', name: 'EV Coolant', price: 900, cat: 'ev', unit: 1, aliases: ['ev coolant'] },
  { id: 'ev-motor', name: 'EV Motor', price: 900, cat: 'ev', unit: 1, aliases: ['ev motor'] },
];

const CATEGORIES = [
  { id: 'all', label: 'ทั้งหมด', icon: '✦' },
  { id: 'maintenance', label: 'ซ่อมบำรุง', icon: '🔧' },
  { id: 'cosmetic', label: 'ตกแต่ง', icon: '🎨' },
  { id: 'tyres', label: 'ยาง', icon: '🛞' },
  { id: 'engine', label: 'เครื่องยนต์', icon: '⚙️' },
  { id: 'brake', label: 'ระบบเบรก', icon: '🛑' },
  { id: 'suspension', label: 'ช่วงล่าง', icon: '🛞' },
  { id: 'transmission', label: 'ระบบเกียร์', icon: '⚙️' },
  { id: 'turbo', label: 'เทอร์โบ', icon: '💨' },
  { id: 'armor', label: 'ชุดเกราะ', icon: '🛡️' },
  { id: 'ev', label: 'อะไหล่ EV', icon: '⚡' },
];

const CAT_META = {
  maintenance: { title: 'ซ่อมบำรุง', sub: 'Maintenance', icon: '🔧' },
  cosmetic: { title: 'ตกแต่ง', sub: 'Cosmetic / Styling', icon: '🎨' },
  tyres: { title: 'ยาง', sub: 'Tyres', icon: '🛞' },
  engine: { title: 'เครื่องยนต์', sub: 'Engine Upgrade', icon: '⚙️' },
  brake: { title: 'ระบบเบรก', sub: 'Brake Upgrade', icon: '🛑' },
  suspension: { title: 'ช่วงล่าง', sub: 'Suspension', icon: '🛞' },
  transmission: { title: 'ระบบเกียร์', sub: 'Transmission', icon: '⚙️' },
  turbo: { title: 'เทอร์โบ', sub: 'Turbo', icon: '💨' },
  armor: { title: 'ชุดเกราะ', sub: 'Armor', icon: '🛡️' },
  ev: { title: 'อะไหล่ EV', sub: 'EV Parts', icon: '⚡' },
};

// State
let cart = []; // { id, name, price, qty }
let activeCat = 'all';
let searchQ = '';
let pendingScan = []; // items found from OCR waiting confirm

// DOM
const $ = (s) => document.querySelector(s);
const $$ = (s) => document.querySelectorAll(s);

function formatMoney(n) {
  return '$' + Number(n).toLocaleString('en-US');
}

function toast(msg, ms = 2200) {
  const el = $('#toast');
  el.textContent = msg;
  el.classList.remove('hidden');
  clearTimeout(el._t);
  el._t = setTimeout(() => el.classList.add('hidden'), ms);
}

// ---------- Catalog ----------
function renderTabs() {
  const wrap = $('#category-tabs');
  wrap.innerHTML = CATEGORIES.map(c => `
    <button data-cat="${c.id}" class="cat-btn inline-flex h-8 items-center gap-1.5 rounded-full border px-3 text-xs font-medium transition
      ${activeCat === c.id ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-muted text-zinc-300 hover:border-primary/40'}">
      <span>${c.icon}</span>${c.label}
    </button>
  `).join('');
  wrap.querySelectorAll('.cat-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      activeCat = btn.dataset.cat;
      renderTabs();
      renderProducts();
    });
  });
}

function filteredProducts() {
  let list = PRODUCTS;
  if (activeCat !== 'all') list = list.filter(p => p.cat === activeCat);
  if (searchQ.trim()) {
    const q = searchQ.toLowerCase();
    list = list.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.aliases.some(a => a.toLowerCase().includes(q))
    );
  }
  return list;
}

function renderProducts() {
  const grid = $('#product-grid');
  const list = filteredProducts();
  if (!list.length) {
    grid.innerHTML = `<p class="py-12 text-center text-zinc-500">ไม่พบอะไหล่ที่ค้นหา</p>`;
    return;
  }

  // group by category
  const groups = {};
  list.forEach(p => {
    if (!groups[p.cat]) groups[p.cat] = [];
    groups[p.cat].push(p);
  });

  grid.innerHTML = Object.entries(groups).map(([cat, items]) => {
    const meta = CAT_META[cat] || { title: cat, sub: '', icon: '' };
    return `
      <div>
        <div class="mb-3 flex items-center gap-2">
          <span class="text-lg">${meta.icon}</span>
          <h2 class="font-display text-base font-semibold">${meta.title}</h2>
          <span class="text-xs text-zinc-500">${meta.sub}</span>
        </div>
        <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          ${items.map(p => productCard(p)).join('')}
        </div>
      </div>
    `;
  }).join('');

  grid.querySelectorAll('[data-add]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.add;
      const prod = PRODUCTS.find(x => x.id === id);
      if (!prod) return;
      addToCart(prod, prod.unit || 1);
    });
  });
}

const CAT_IMG = {
  maintenance: 'img/maintenance.jpg',
  cosmetic: 'img/cosmetic.jpg',
  tyres: 'img/tyres.jpg',
  engine: 'img/engine.jpg',
  brake: 'img/brake.jpg',
  suspension: 'img/suspension.jpg',
  transmission: 'img/transmission.jpg',
  turbo: 'img/turbo.jpg',
  armor: 'img/armor.jpg',
  ev: 'img/ev.jpg',
};

function productCard(p) {
  const multi = (p.unit || 1) > 1;
  const img = CAT_IMG[p.cat] || '';
  return `
    <article class="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5">
      <div class="relative aspect-[4/3] overflow-hidden bg-muted">
        ${img
          ? `<img src="${img}" alt="" loading="lazy" class="size-full object-cover transition-transform duration-500 group-hover:scale-105" />`
          : `<div class="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-zinc-800 to-zinc-900"><span class="text-4xl opacity-30">${(CAT_META[p.cat] || {}).icon || '🔧'}</span></div>`
        }
        <div class="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent"></div>
        <span class="absolute left-2 top-2 rounded-md bg-background/80 px-2 py-0.5 text-[11px] font-medium backdrop-blur">
          ${(CAT_META[p.cat] || {}).icon || ''} ${(CAT_META[p.cat] || {}).sub || p.cat}
        </span>
      </div>
      <div class="flex flex-1 flex-col gap-3 p-3">
        <h3 class="font-medium leading-snug">${p.name}</h3>
        ${multi ? `<p class="text-xs text-zinc-500">ปกติใช้ ${p.unit} ชิ้น · ${formatMoney(p.price)} /ชิ้น</p>` : ''}
        <div class="mt-auto flex items-end justify-between gap-2">
          <p class="tabular font-display text-xl font-semibold">${formatMoney(p.price)}${multi ? ' <span class="text-sm font-normal text-zinc-400">/ชิ้น</span>' : ''}</p>
        </div>
        <button data-add="${p.id}" class="inline-flex h-9 w-full items-center justify-center gap-1.5 rounded-md bg-primary text-sm font-medium text-primary-foreground hover:bg-orange-500">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
          ${multi ? `เพิ่ม ×${p.unit}` : 'เพิ่มลงบิล'}
        </button>
      </div>
    </article>
  `;
}

// ---------- Cart ----------
function addToCart(prod, qty = 1) {
  const existing = cart.find(c => c.id === prod.id);
  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({ id: prod.id, name: prod.name, price: prod.price, qty });
  }
  renderCart();
  toast(`เพิ่ม ${prod.name} ×${qty}`);
}

function setQty(id, qty) {
  const item = cart.find(c => c.id === id);
  if (!item) return;
  item.qty = Math.max(1, qty);
  renderCart();
}

function removeFromCart(id) {
  cart = cart.filter(c => c.id !== id);
  renderCart();
}

function clearCart() {
  if (!cart.length) return;
  if (!confirm('ล้างรายการในตะกร้าทั้งหมด?')) return;
  cart = [];
  renderCart();
  toast('ล้างตะกร้าแล้ว');
}

function renderCart() {
  const empty = $('#cart-empty');
  const list = $('#cart-items');
  const count = $('#cart-count');
  const subtotalEl = $('#subtotal');
  const totalEl = $('#total');
  const btn = $('#btn-checkout');
  const clearBtn = $('#btn-clear-cart');

  const totalQty = cart.reduce((s, c) => s + c.qty, 0);
  const total = cart.reduce((s, c) => s + c.price * c.qty, 0);

  count.textContent = `${totalQty} ชิ้น`;
  subtotalEl.textContent = formatMoney(total);
  totalEl.textContent = formatMoney(total);
  btn.disabled = cart.length === 0;

  if (cart.length) {
    clearBtn.classList.remove('hidden');
    clearBtn.classList.add('inline-flex');
  } else {
    clearBtn.classList.add('hidden');
    clearBtn.classList.remove('inline-flex');
  }

  if (!cart.length) {
    empty.classList.remove('hidden');
    list.classList.add('hidden');
    list.innerHTML = '';
    return;
  }

  empty.classList.add('hidden');
  list.classList.remove('hidden');
  list.innerHTML = cart.map(c => `
    <div class="flex items-start gap-3 px-4 py-3">
      <div class="min-w-0 flex-1">
        <p class="text-sm font-medium leading-snug">${c.name}</p>
        <p class="mt-0.5 text-xs text-zinc-500 tabular">${formatMoney(c.price)} × ${c.qty}</p>
      </div>
      <div class="flex items-center gap-1">
        <button data-dec="${c.id}" class="flex h-7 w-7 items-center justify-center rounded border border-border text-sm hover:bg-muted">−</button>
        <span class="w-7 text-center text-sm tabular">${c.qty}</span>
        <button data-inc="${c.id}" class="flex h-7 w-7 items-center justify-center rounded border border-border text-sm hover:bg-muted">+</button>
        <button data-rm="${c.id}" class="ml-1 flex h-7 w-7 items-center justify-center rounded text-zinc-500 hover:bg-red-500/10 hover:text-red-400">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
        </button>
      </div>
    </div>
  `).join('');

  list.querySelectorAll('[data-inc]').forEach(b => b.addEventListener('click', () => {
    const item = cart.find(c => c.id === b.dataset.inc);
    if (item) setQty(item.id, item.qty + 1);
  }));
  list.querySelectorAll('[data-dec]').forEach(b => b.addEventListener('click', () => {
    const item = cart.find(c => c.id === b.dataset.dec);
    if (item) setQty(item.id, item.qty - 1);
  }));
  list.querySelectorAll('[data-rm]').forEach(b => b.addEventListener('click', () => removeFromCart(b.dataset.rm)));
}

// ---------- Checkout ----------
function checkout() {
  const staff = $('#staff-name').value.trim();
  if (!staff) {
    toast('กรุณากรอกชื่อพนักงาน');
    $('#staff-name').focus();
    return;
  }
  if (!cart.length) return;

  const total = cart.reduce((s, c) => s + c.price * c.qty, 0);
  const bill = {
    id: 'BILL-' + Date.now().toString(36).toUpperCase(),
    staff,
    customer: $('#customer-info').value.trim() || '-',
    note: $('#note').value.trim() || '',
    items: cart.map(c => ({ ...c })),
    total,
    createdAt: new Date().toISOString(),
  };

  // save history
  const history = JSON.parse(localStorage.getItem('garage_bills') || '[]');
  history.unshift(bill);
  localStorage.setItem('garage_bills', JSON.stringify(history.slice(0, 50)));

  // print-friendly receipt
  const w = window.open('', '_blank', 'width=420,height=640');
  w.document.write(`
    <html><head><title>${bill.id}</title>
    <style>
      body{font-family:system-ui,sans-serif;padding:24px;color:#111}
      h1{font-size:18px;margin:0 0 4px}
      .muted{color:#666;font-size:12px}
      table{width:100%;border-collapse:collapse;margin:16px 0}
      td,th{padding:6px 0;border-bottom:1px solid #eee;font-size:13px;text-align:left}
      .r{text-align:right}
      .total{font-size:20px;font-weight:700;margin-top:12px}
    </style></head><body>
    <h1>Garage Checkout</h1>
    <div class="muted">${bill.id} · ${new Date(bill.createdAt).toLocaleString('th-TH')}</div>
    <div class="muted">พนักงาน: ${bill.staff} · ลูกค้า: ${bill.customer}</div>
    ${bill.note ? `<div class="muted">หมายเหตุ: ${bill.note}</div>` : ''}
    <table>
      <thead><tr><th>รายการ</th><th class="r">จำนวน</th><th class="r">รวม</th></tr></thead>
      <tbody>
        ${bill.items.map(i => `<tr><td>${i.name}</td><td class="r">${i.qty}</td><td class="r">${formatMoney(i.price * i.qty)}</td></tr>`).join('')}
      </tbody>
    </table>
    <div class="total">ยอดสุทธิ ${formatMoney(bill.total)}</div>
    <p class="muted" style="margin-top:24px">ขอบคุณที่ใช้บริการ</p>
    <script>window.print()</script>
    </body></html>
  `);
  w.document.close();

  cart = [];
  renderCart();
  toast('บันทึกบิลเรียบร้อย');
}

// ---------- Scan / OCR ----------
function openScan() {
  $('#scan-modal').classList.remove('hidden');
  $('#scan-modal').classList.add('flex');
  pendingScan = [];
  $('#preview-wrap').classList.add('hidden');
  $('#ocr-status').classList.add('hidden');
  $('#scan-results').classList.add('hidden');
  $('#scan-results').innerHTML = '';
  $('#scan-confirm').disabled = true;
  $('#file-input').value = '';
}

function closeScan() {
  $('#scan-modal').classList.add('hidden');
  $('#scan-modal').classList.remove('flex');
}

// ปรับภาพ UI มืดให้ OCR อ่านง่ายขึ้น (ขยาย + เพิ่ม contrast)
async function preprocessImage(fileOrBlob) {
  const bmp = await createImageBitmap(fileOrBlob);
  const scale = Math.min(2.5, Math.max(1.5, 1400 / bmp.width));
  const w = Math.round(bmp.width * scale);
  const h = Math.round(bmp.height * scale);
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = true;
  ctx.drawImage(bmp, 0, 0, w, h);
  const img = ctx.getImageData(0, 0, w, h);
  const d = img.data;
  // grayscale + boost contrast (UI มืด ตัวอักษรขาว)
  for (let i = 0; i < d.length; i += 4) {
    let g = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];
    // ดัน contrast
    g = (g - 128) * 1.6 + 128;
    g = Math.max(0, Math.min(255, g));
    // threshold อ่อน ๆ ช่วยแยกตัวอักษร
    if (g > 140) g = 255;
    else if (g < 60) g = 0;
    d[i] = d[i + 1] = d[i + 2] = g;
  }
  ctx.putImageData(img, 0, 0);
  return new Promise(resolve => canvas.toBlob(b => resolve(b || fileOrBlob), 'image/png'));
}

function addFound(found, id, qty) {
  if (qty <= 0) return;
  const prod = PRODUCTS.find(p => p.id === id);
  if (!prod) return;
  const cur = found.get(id);
  if (!cur || qty > cur.qty) found.set(id, { prod, qty });
}

function countRegex(text, pattern) {
  const re = typeof pattern === 'string'
    ? new RegExp(pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\s+/g, '\\s+'), 'gi')
    : pattern;
  const m = text.match(re);
  return m ? m.length : 0;
}

// OCR ไทยมักแทรกช่องว่างระหว่างตัวอักษร → ยุบช่องว่างในช่วงภาษาไทย
function normalizeOcrText(text) {
  let t = text;
  for (let i = 0; i < 4; i++) {
    t = t.replace(/([\u0E00-\u0E7F])\s+(?=[\u0E00-\u0E7F])/g, '$1');
  }
  t = t.replace(/race\s*lv\s*\.?\s*/gi, 'race lv.');
  return t;
}

// นับจากชื่อสินค้า + pattern ที่รอดจาก OCR (Race Lv / Sport / ชื่ออังกฤษ)
function countProductsInText(rawText) {
  const found = new Map();
  const text = normalizeOcrText(rawText);
  const lower = text.toLowerCase();

  // 1) ชื่อสินค้าเต็มตาม catalog
  const ranked = [...PRODUCTS].sort((a, b) => b.name.length - a.name.length);
  for (const p of ranked) {
    const n = countRegex(text, p.name);
    if (n) addFound(found, p.id, n);
  }

  // 2) คำอังกฤษที่ OCR อ่านได้เสมอในหน้าชุดแต่ง
  const race3 = countRegex(lower, /race\s*lv\.?\s*3/gi);
  if (race3) addFound(found, 'engine-race', race3);

  const race2 = countRegex(lower, /race\s*lv\.?\s*2/gi);
  if (race2 >= 2) {
    addFound(found, 'trans-race', 1);
    addFound(found, 'brake-race', 1);
  } else if (race2 === 1) {
    if (/เกียร์|gear|trans/i.test(text)) addFound(found, 'trans-race', 1);
    else if (/เบรก|brake/i.test(text)) addFound(found, 'brake-race', 1);
    else {
      addFound(found, 'trans-race', 1);
      addFound(found, 'brake-race', 1);
    }
  }

  const sportEngine = countRegex(lower, /sport\s*lv\.?\s*2/gi);
  const sportBare = countRegex(lower, /\bsport\b/gi);
  if (sportEngine) addFound(found, 'engine-sport', sportEngine);
  if (sportBare > sportEngine) addFound(found, 'suspension-sport', Math.max(1, sportBare - sportEngine));

  {
    // เทอร์โบ: OCR มักอ่านไทยเพี้ยน/เว้นวรรค — ใช้หลาย pattern
    const tFull = countRegex(text, 'ชุดเทอร์โบ');
    const tShort = countRegex(text, 'เทอร์โบ');
    const tEng = countRegex(lower, /\bturbo\b/gi);
    // ตัวอักษรไทยห่างกัน (ท เ อ ร ์ โ บ) หลัง normalize แล้วยังเพี้ยน
    const tFuzzy = countRegex(lower, /ท\s*เ?\s*อ\s*ร\s*์?\s*โ\s*บ/gi)
      || countRegex(text, /ชุด\s*ท\s*เ?\s*อ\s*ร\s*์?\s*โ\s*บ/gi)
      || countRegex(lower, /เท\s*อ\s*ร\s*์?\s*โ\s*บ/gi)
      || countRegex(lower, /เห\s*อ\s*ร\s*์?\s*โ\s*บ/gi); // OCR เพี้ยน ท→ห
    let tQty = tFull || tEng || tFuzzy || (tShort ? Math.ceil(tShort / 2) : 0);
    // แพ็กชุดแต่งเต็ม (Sport + Race Lv.2 x2 + Race Lv.3) มักมีเทอร์โบด้วย
    if (!tQty) {
      const hasSport = (found.get('suspension-sport')?.qty || 0) > 0;
      const hasR2 = (found.get('trans-race')?.qty || 0) + (found.get('brake-race')?.qty || 0) >= 2;
      const hasR3 = (found.get('engine-race')?.qty || 0) > 0;
      if (hasSport && hasR2 && hasR3) tQty = 1;
    }
    addFound(found, 'turbo', tQty);
  }

  // ชื่อไทยหลัง normalize ช่องว่าง
  addFound(found, 'suspension-sport', Math.max(
    found.get('suspension-sport')?.qty || 0,
    countRegex(text, 'ชุดช่วงล่าง Sport'),
    countRegex(text, 'ชุดช่วงล่าง'),
    countRegex(text, 'ช่วงล่าง')
  ));
  addFound(found, 'trans-race', Math.max(
    found.get('trans-race')?.qty || 0,
    countRegex(text, 'ชุดเกียร์ Race'),
    countRegex(text, 'ชุดเกียร์')
  ));
  addFound(found, 'brake-race', Math.max(
    found.get('brake-race')?.qty || 0,
    countRegex(text, 'ชุดเบรก Race'),
    countRegex(text, 'ชุดเบรก')
  ));
  addFound(found, 'engine-race', Math.max(
    found.get('engine-race')?.qty || 0,
    countRegex(text, 'ชุดแต่งเครื่องยนต์ Race'),
    countRegex(text, 'ชุดแต่งเครื่องยนต์')
  ));

  addFound(found, 'trans-street', countRegex(text, 'ชุดเกียร์ Street'));
  addFound(found, 'brake-street', countRegex(text, 'ชุดเบรก Street'));
  addFound(found, 'engine-street', countRegex(text, 'ชุดแต่งเครื่องยนต์ Street'));
  addFound(found, 'engine-stock', countRegex(lower, /stock\s*plus|lv\.?\s*0/gi));

  // 3) อะไหล่ชื่ออังกฤษ
  const groups = [
    { id: 'cosmetic-parts', keys: ['cosmetic parts'] },
    { id: 'respray-kit', keys: ['respray kit'] },
    { id: 'stancer-kit', keys: ['stancer kit', 'ปรับทรง'] },
    { id: 'extras-kit', keys: ['extras kit', 'extra1', 'extra2', 'extra10'] },
    { id: 'lighting-controller', keys: ['lighting controller', 'xenon', 'neon'] },
    { id: 'wheels-set', keys: ['vehicle wheels set'] },
    { id: 'offroad-tyres', keys: ['offroad tyres'] },
    { id: 'semi-slick', keys: ['semi slick'] },
    { id: 'slick-tyres', keys: ['slick tyres'] },
    { id: 'tyre-smoke', keys: ['tyre smoke'] },
  ];
  for (const g of groups) {
    let n = 0;
    for (const key of g.keys) n += countRegex(text, key);
    addFound(found, g.id, n);
  }

  const pureThai = ['กันชนหน้า', 'กันชนหลัง', 'สเกิร์ตข้าง', 'ฝากระโปรง', 'แก้มข้างท้าย', 'แก้มข้างซ้าย', 'แก้มข้างขวา', 'สปอยเลอร์', 'ท่อไอเสีย', 'โครงสร้าง', 'หลังคา', 'livery'];
  let thaiCos = 0;
  for (const k of pureThai) thaiCos += countRegex(text, k);
  addFound(found, 'cosmetic-parts', Math.max(countRegex(text, 'Cosmetic Parts'), thaiCos));

  let rt = countRegex(text, 'respray kit');
  for (const k of ['สีมุก', 'สีหลัก', 'สีรอง', 'สีดำ', 'สีเทา', 'สีขาว', 'interiorcolor']) rt += countRegex(text, k);
  addFound(found, 'respray-kit', rt);

  return Array.from(found.values()).filter(x => x.qty > 0);
}

async function fileToBase64(fileOrBlob) {
  const buf = await fileOrBlob.arrayBuffer();
  let binary = '';
  const bytes = new Uint8Array(buf);
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode.apply(null, bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
}

function getGeminiKey() {
  return (localStorage.getItem('gemini_api_key') || '').trim();
}

function setGeminiKey(key) {
  key = (key || '').trim();
  if (key) localStorage.setItem('gemini_api_key', key);
  else localStorage.removeItem('gemini_api_key');
  updateKeyStatus();
}

function updateKeyStatus() {
  const el = $('#key-status');
  const input = $('#gemini-key');
  if (!el) return;
  const k = getGeminiKey();
  if (k) {
    el.textContent = 'บันทึก key แล้ว · พร้อมสแกนด้วย Gemini';
    el.className = 'text-[11px] text-emerald-400';
    if (input && !input.value) input.placeholder = '••••••••  (บันทึกแล้ว)';
  } else {
    el.textContent = 'ยังไม่มี key — สแกนไม่ได้จนกว่าจะบันทึก';
    el.className = 'text-[11px] text-zinc-500';
  }
}

const GEMINI_CATALOG = PRODUCTS.map(p => p.name).join('\n');

function mapGeminiItems(items) {
  const found = new Map();
  for (const row of items || []) {
    let name = String(row.name || row.Name || '').trim();
    let qty = Math.max(1, parseInt(row.qty ?? row.quantity ?? 1, 10) || 1);
    if (!name) continue;

    // match กับ catalog
    let prod = PRODUCTS.find(p => p.name.toLowerCase() === name.toLowerCase());
    if (!prod) {
      const lower = name.toLowerCase();
      // alias / partial
      prod = PRODUCTS.find(p => lower.includes(p.name.toLowerCase()) || p.name.toLowerCase().includes(lower));
    }
    if (!prod) {
      for (const p of PRODUCTS) {
        if (p.aliases.some(a => name.toLowerCase().includes(a.toLowerCase()) || a.toLowerCase().includes(name.toLowerCase()))) {
          prod = p;
          break;
        }
      }
    }
    if (!prod) continue;
    const cur = found.get(prod.id);
    if (cur) cur.qty += qty;
    else found.set(prod.id, { prod, qty });
  }
  return Array.from(found.values());
}

function showScanResults(label) {
  const totalPieces = pendingScan.reduce((s, x) => s + x.qty, 0);
  $('#ocr-label').textContent = label || `พบ ${pendingScan.length} ชนิด · รวม ${totalPieces} ชิ้น`;
  $('#ocr-percent').textContent = '';
  $('#ocr-progress').style.width = '100%';
  $('#scan-results').classList.remove('hidden');
  $('#scan-results').innerHTML = `
    <div class="divide-y divide-border">
      ${pendingScan.map(({ prod, qty }, i) => `
        <div class="flex items-center gap-3 px-3 py-2.5">
          <input type="checkbox" checked data-idx="${i}" class="scan-check h-4 w-4 accent-orange-500" />
          <div class="min-w-0 flex-1">
            <p class="text-sm font-medium">${prod.name}</p>
            <p class="text-xs text-zinc-500">${formatMoney(prod.price)} × ${qty} = ${formatMoney(prod.price * qty)}</p>
          </div>
          <div class="flex items-center gap-1">
            <button data-sq="${i}" data-d="-1" class="h-6 w-6 rounded border border-border text-xs hover:bg-muted">−</button>
            <span class="w-6 text-center text-xs tabular" data-sqv="${i}">${qty}</span>
            <button data-sq="${i}" data-d="1" class="h-6 w-6 rounded border border-border text-xs hover:bg-muted">+</button>
          </div>
        </div>
      `).join('')}
    </div>
  `;
  $('#scan-results').querySelectorAll('[data-sq]').forEach(btn => {
    btn.addEventListener('click', () => {
      const i = +btn.dataset.sq;
      const d = +btn.dataset.d;
      pendingScan[i].qty = Math.max(1, pendingScan[i].qty + d);
      $(`[data-sqv="${i}"]`).textContent = pendingScan[i].qty;
    });
  });
  $('#scan-confirm').disabled = false;
}

async function processImage(fileOrBlob) {
  const url = URL.createObjectURL(fileOrBlob);
  $('#preview-img').src = url;
  $('#preview-wrap').classList.remove('hidden');
  $('#ocr-status').classList.remove('hidden');
  $('#ocr-label').textContent = 'กำลังส่งภาพไปเซิร์ฟเวอร์...';
  $('#ocr-percent').textContent = '';
  $('#ocr-progress').style.width = '25%';
  $('#scan-results').classList.add('hidden');
  $('#scan-confirm').disabled = true;
  pendingScan = [];

  try {
    const mime = fileOrBlob.type || 'image/png';
    const b64 = await fileToBase64(fileOrBlob);
    $('#ocr-progress').style.width = '50%';
    $('#ocr-label').textContent = 'Gemini กำลังอ่านรายการ...';

    // เรียก Cloudflare Pages Function ฝั่งหลังบ้าน (key อยู่บน server)
    const res = await fetch('/api/scan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image: b64, mime }),
    });

    $('#ocr-progress').style.width = '85%';
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      console.error('scan api error', res.status, data);
      let msg = data.error || `สแกนไม่สำเร็จ (${res.status})`;
      if (res.status === 404) msg = 'ยังไม่ได้ deploy API (/api/scan) — ดู README วิธีตั้ง Cloudflare';
      if (res.status === 500 && /GEMINI_API_KEY/.test(String(data.error || ''))) {
        msg = 'เซิร์ฟเวอร์ยังไม่มี GEMINI_API_KEY';
      }
      if (res.status === 429) msg = 'โควต้า Gemini เต็มชั่วคราว';
      if (res.status === 403) msg = 'API Key บนเซิร์ฟเวอร์ไม่ถูกต้อง';
      $('#ocr-label').textContent = msg;
      $('#ocr-progress').style.width = '0%';
      toast(msg);
      return;
    }

    const items = data.items || [];
    pendingScan = mapGeminiItems(items);

    if (!pendingScan.length) {
      $('#ocr-label').textContent = 'ไม่พบรายการอะไหล่ในภาพ';
      $('#scan-results').classList.remove('hidden');
      $('#scan-results').innerHTML = `<div class="p-4 text-sm text-zinc-400">ลองจับภาพให้เห็นรายการชัดขึ้น</div>`;
      return;
    }

    showScanResults(data.model ? `พบ ${pendingScan.length} ชนิด · ${data.model}` : undefined);
  } catch (err) {
    console.error(err);
    const msg = (err && err.message) || 'error';
    $('#ocr-label').textContent = 'เชื่อมต่อ API ไม่ได้ — ต้อง deploy บน Cloudflare Pages';
    $('#ocr-progress').style.width = '0%';
    toast('สแกนล้มเหลว: เปิดผ่าน Cloudflare เท่านั้น');
  }
}

function confirmScan() {
  const checks = $$('.scan-check');
  let added = 0;
  checks.forEach((cb, i) => {
    if (cb.checked && pendingScan[i]) {
      const { prod, qty } = pendingScan[i];
      addToCart(prod, qty);
      added++;
    }
  });
  closeScan();
  if (added) toast(`เพิ่ม ${added} รายการจากภาพแล้ว`);
}

// ---------- Events ----------
function init() {
  renderTabs();
  renderProducts();
  renderCart();

  $('#search').addEventListener('input', e => {
    searchQ = e.target.value;
    renderProducts();
  });

  $('#btn-scan').addEventListener('click', openScan);
  $('#btn-scan-inline').addEventListener('click', openScan);
  $('#scan-close').addEventListener('click', closeScan);
  $('#scan-cancel').addEventListener('click', closeScan);
  $('#scan-confirm').addEventListener('click', confirmScan);
  $('#btn-checkout').addEventListener('click', checkout);
  $('#btn-clear-cart').addEventListener('click', clearCart);

  // file input
  $('#file-input').addEventListener('change', e => {
    const f = e.target.files?.[0];
    if (f) processImage(f);
  });

  // drag & drop
  const dz = $('#dropzone');
  ['dragenter', 'dragover'].forEach(ev => {
    dz.addEventListener(ev, e => { e.preventDefault(); dz.classList.add('dragover'); });
  });
  ['dragleave', 'drop'].forEach(ev => {
    dz.addEventListener(ev, e => { e.preventDefault(); dz.classList.remove('dragover'); });
  });
  dz.addEventListener('drop', e => {
    const f = e.dataTransfer.files?.[0];
    if (f && f.type.startsWith('image/')) processImage(f);
  });

  // paste anywhere while modal open
  document.addEventListener('paste', e => {
    if ($('#scan-modal').classList.contains('hidden')) return;
    const items = e.clipboardData?.items;
    if (!items) return;
    for (const item of items) {
      if (item.type.startsWith('image/')) {
        const blob = item.getAsFile();
        if (blob) processImage(blob);
        break;
      }
    }
  });

  // history button
  $('#btn-history').addEventListener('click', () => {
    const history = JSON.parse(localStorage.getItem('garage_bills') || '[]');
    if (!history.length) {
      toast('ยังไม่มีประวัติบิล');
      return;
    }
    const lines = history.slice(0, 10).map(b =>
      `${b.id} · ${new Date(b.createdAt).toLocaleString('th-TH')} · ${b.staff} · ${formatMoney(b.total)}`
    ).join('\n');
    alert('ประวัติบิลล่าสุด\n\n' + lines);
  });
}

init();
