/* TasKurir.id: engine mount, indeks halaman, kursor kustom, dan Stempel Kursor (act 3). */
(function () {
  'use strict';

  var root = document.documentElement;
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  function $(s, c) { return (c || document).querySelector(s); }
  function $$(s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); }

  /* --------------------------------------------- klien (Dipercaya) ---- */
  // Disisipkan sebelum mount supaya engine ikut menghitung posisinya.
  (function klien() {
    var hero = document.getElementById('polos');
    if (!hero || document.getElementById('klien')) return;
    var base = (root.getAttribute('data-asset-base') || 'https://wanwan-ito.github.io/taskurir-id/') + 'assets/klien/';
    var alt = 'Logo klien yang memakai tas kurir, tas obrok dan tas delivery Indah Tas Obrok: Indofood, Mayora, J&T, Paxel, Shopee Xpress, JNE, Indomaret, Honda, Toyota-Astra Motor dan lainnya';
    var sec = document.createElement('section');
    sec.className = 'klien';
    sec.id = 'klien';
    sec.setAttribute('aria-labelledby', 'klien-h');
    sec.innerHTML =
      '<div class="sc-wrap klien__in" data-sc-in="">' +
        '<h2 class="sc-display sc-display--md klien__h" id="klien-h">Dipercaya 1000+</h2>' +
        '<p class="sc-body klien__p">Perusahaan nasional maupun usaha lokal sudah memakai tas dari kami.</p>' +
        '<picture class="klien__logos">' +
          '<source media="(max-width: 720px)" srcset="' + base + 'logo-klien-tas-kurir-tas-obrok-taskurir-mobile.webp" width="709" height="581">' +
          '<img src="' + base + 'logo-klien-tas-kurir-tas-obrok-taskurir.webp" width="2560" height="525" loading="lazy" decoding="async" alt="' + alt + '">' +
        '</picture>' +
      '</div>';
    hero.parentNode.insertBefore(sec, hero.nextSibling);
  })();

  // Act Cap logo: scroll hanya memutar 3 logo (lihat SCROLL_BRANDS), jadi pin dipendekkan
  // dari 3.4 ke 2.2 layar. Logo lain tetap bisa dipasang lewat klik tas atau tombol logo.
  // Judul "Pasang logo..." tidak lagi memudar di akhir (dulu fade-out 30% terakhir = logo ke-3 tampil pudar).
  (function () {
    var c = document.getElementById('cap');
    if (!c) return;
    c.setAttribute('data-sc-span', '2.2');
    var says = c.querySelectorAll('.cap__says > [data-sc-cue]');
    if (says[1]) says[1].setAttribute('data-sc-cue', '0.26 1 0.3 0.04');
  })();

  if (window.ScrollCraft) { window.ScrollCraft.mount(document.body); }

  /* ----------------------------------------------------------- logo ---- */
  // Warna = warna merek, dipakai hanya sebagai tint latar saat logo "dicap".
  var BASE = root.getAttribute('data-asset-base') || '';
  var BRANDS = [
    { f: 'shopee-xpress', n: 'Shopee Xpress', c: '#EE4D2D' },
    { f: 'jne',           n: 'JNE Express',   c: '#1E3A8A' },
    { f: 'maxim',         n: 'Maxim',         c: '#FFD21E' },
    { f: 'jt-cargo',      n: 'J&T Cargo',     c: '#1C8F4F' },
    { f: 'cimory',        n: 'Cimory',        c: '#E01E5A' },
    { f: 'indofood',      n: 'Indofood',      c: '#0A5BA8' },
    { f: 'best-meat',     n: 'Best Meat',     c: '#F28A1E' },
    { f: 'paxel',         n: 'Paxel',         c: '#5B49C8' },
    { f: 'indomaret',     n: 'Indomaret',     c: '#E4202A' },
    { f: 'nippon-paint',  n: 'Nippon Paint',  c: '#1A4FA0' }
  ];
  BRANDS.forEach(function (b) { b.src = BASE + 'assets/logo/' + b.f + '.png'; var im = new Image(); im.src = b.src; });
  var N = BRANDS.length;
  // Logo yang diputar saat scroll (indeks BRANDS): Shopee Xpress, Indofood, Indomaret.
  var SCROLL_BRANDS = [0, 5, 8];
  var NEUTRAL = '#F4F3EF';
  function tint(c) { return 'color-mix(in oklab, ' + c + ' 26%, ' + NEUTRAL + ')'; }

  /* ------------------------------------------------------- indeks ------ */
  var navLinks = $$('[data-nav]');
  var navMap = [['polos', 'polos'], ['sama', 'polos'], ['cap', 'cap'], ['hasil', 'hasil'], ['portofolio', 'portofolio'], ['jenis', 'jenis'], ['pesan', 'pesan']];
  function navTick() {
    var mid = innerHeight * 0.5, cur = 'polos';
    navMap.forEach(function (m) {
      var el = document.getElementById(m[0]);
      if (el && el.getBoundingClientRect().top <= mid) cur = m[1];
    });
    navLinks.forEach(function (a) { a.classList.toggle('is-active', a.getAttribute('data-nav') === cur); });
  }

  /* ------------------------------------------------ stempel kursor ------ */
  var cap = document.getElementById('cap');
  var frame = $('.cap__frame', cap), shot = $('.cap__shot', cap), ground = $('.cap__ground', cap);
  var patches = $$('.patch', cap);
  var nameEl = $('[data-brand-name]', cap), dotsEl = $('[data-brand-dots]', cap);
  var chipImg = $('.cursor__chip img');
  var st = { cur: -1, scrollIdx: -2, tint: NEUTRAL, px: null, py: null, over: false };

  BRANDS.forEach(function (b, i) {
    var li = document.createElement('li'), btn = document.createElement('button'), im = document.createElement('img');
    btn.type = 'button'; btn.setAttribute('aria-label', 'Pasang logo ' + b.n); btn.setAttribute('aria-pressed', 'false');
    im.src = b.src; im.alt = ''; im.width = 160; im.height = 60; im.loading = 'lazy';
    btn.appendChild(im); li.appendChild(btn); dotsEl.appendChild(li);
    btn.addEventListener('click', function () {
      var r = btn.getBoundingClientRect();
      stamp(i, { x: r.left + r.width / 2, y: r.top + r.height / 2 });
    });
  });
  var dotBtns = $$('button', dotsEl);

  function originIn(client) {
    var g = ground.getBoundingClientRect();
    if (!client) { var f = frame.getBoundingClientRect(); client = { x: f.left + f.width / 2, y: f.top + f.height / 2 }; }
    return { x: client.x - g.left, y: client.y - g.top, w: g.width, h: g.height };
  }

  function setGround(color) { st.tint = color; ground.style.setProperty('--ground', color); }

  function flood(color, o) {
    if (reduce) { setGround(color); return; }
    var rad = Math.max(Math.hypot(o.x, o.y), Math.hypot(o.w - o.x, o.y), Math.hypot(o.x, o.h - o.y), Math.hypot(o.w - o.x, o.h - o.y));
    var node = document.createElement('div');
    node.className = 'flood';
    node.style.left = o.x + 'px'; node.style.top = o.y + 'px';
    node.style.setProperty('--flood', color);
    node.style.setProperty('--flood-scale', String((rad * 2) / 200 + 0.2));
    node.addEventListener('animationend', function () { setGround(st.tint); node.remove(); });
    st.tint = color;
    ground.appendChild(node);
  }

  function syncSays() { cap.classList.toggle('is-forced', st.cur >= 0 && st.scrollIdx < 0); }

  function setChip() {
    if (chipImg) chipImg.src = BRANDS[(st.cur + 1 + N) % N].src;
  }

  function stamp(i, client) {
    var b = BRANDS[i];
    st.cur = i;
    patches.forEach(function (p) {
      $('img', p).src = b.src;
      p.classList.remove('is-on'); void p.offsetWidth; p.classList.add('is-on');
    });
    shot.classList.remove('is-bump'); void shot.offsetWidth; shot.classList.add('is-bump');
    nameEl.textContent = b.n;
    dotBtns.forEach(function (d, k) { d.setAttribute('aria-pressed', k === i ? 'true' : 'false'); });
    flood(tint(b.c), originIn(client || (st.over && st.px != null ? { x: st.px, y: st.py } : null)));
    setChip();
    syncSays();
  }

  function reset() {
    st.cur = -1;
    patches.forEach(function (p) { p.classList.remove('is-on'); });
    nameEl.textContent = 'Belum dipasang';
    dotBtns.forEach(function (d) { d.setAttribute('aria-pressed', 'false'); });
    flood(NEUTRAL, originIn(null));
    setChip();
    syncSays();
  }

  frame.addEventListener('click', function (e) {
    stamp((st.cur + 1) % N, { x: e.clientX, y: e.clientY });
  });
  frame.addEventListener('pointermove', function (e) { st.px = e.clientX; st.py = e.clientY; st.over = true; });
  frame.addEventListener('pointerleave', function () { st.over = false; });
  setChip();

  function scrollIdx() {
    var p = parseFloat(cap.style.getPropertyValue('--sc-p')) || 0;
    var SN = SCROLL_BRANDS.length;
    var idx = p < 0.26 ? -1 : Math.min(SN - 1, Math.floor(((p - 0.26) / 0.72) * SN));
    if (idx !== st.scrollIdx) {
      var first = st.scrollIdx === -2;
      st.scrollIdx = idx;
      syncSays();
      if (idx >= 0) stamp(SCROLL_BRANDS[idx]);
      else if (!first) reset();
    }
  }

  /* ---------------------------------------------------------- kursor ---- */
  if (fine && !reduce) {
    root.classList.add('has-cursor');
    var cur = $('.cursor'), dot = $('.cursor__dot'), ring = $('.cursor__ring'), chip = $('.cursor__chip'), lab = $('.cursor__label');
    var mx = -200, my = -200, rx = -200, ry = -200, seen = false;
    addEventListener('pointermove', function (e) {
      mx = e.clientX; my = e.clientY;
      if (!seen) { seen = true; rx = mx; ry = my; cur.style.opacity = '1'; }
      var t = e.target && e.target.closest ? (e.target.closest('[data-cursor]') || e.target.closest('a, button')) : null;
      var kind = !t ? '' : t.getAttribute('data-cursor') || 'link';
      if (t && t.classList && (t.classList.contains('btn') || t.classList.contains('social__a'))) kind = 'hand'; // tombol CTA: kursor tangan bawaan
      if (kind === 'look') lab.textContent = 'Tanya';
      cur.setAttribute('data-state', kind);
    }, { passive: true });
    addEventListener('pointerdown', function () { cur.classList.add('is-down'); });
    addEventListener('pointerup', function () { cur.classList.remove('is-down'); });
    document.addEventListener('pointerleave', function () { cur.style.opacity = '0'; seen = false; });
    (function loop() {
      rx += (mx - rx) * 0.22; ry += (my - ry) * 0.22;
      dot.style.translate = mx + 'px ' + my + 'px';
      ring.style.translate = rx + 'px ' + ry + 'px';
      chip.style.translate = rx + 'px ' + ry + 'px';
      lab.style.translate = rx + 'px ' + ry + 'px';
      requestAnimationFrame(loop);
    })();
  }

  /* ------------------------------------------------------- tick umum ---- */
  var ticking = false;
  function frameTick() { navTick(); scrollIdx(); ticking = false; }
  function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(frameTick); } }
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', onScroll);
  // --sc-p dituliskan engine tiap frame; baca juga lewat loop ringan.
  (function poll() { scrollIdx(); requestAnimationFrame(poll); })();
  navTick();
})();
