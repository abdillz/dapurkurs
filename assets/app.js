/* DapurKurs: purwarupa interaktif. Semua angka adalah data simulasi. */
(function () {
  const rp = (n) => 'Rp' + Math.round(n).toLocaleString('id-ID');
  const kg = (n) => Math.round(n).toLocaleString('id-ID') + ' kg';
  const pct = (n) => (n >= 0 ? '+' : '') + n.toLocaleString('id-ID', { maximumFractionDigits: 1, minimumFractionDigits: 1 }) + '%';

  const S = {
    kedelaiHari: 50, harga: 11300, prakiraanLow: 11600, prakiraanHigh: 11900,
    ragi: 15000, plastik: 25000, gas: 34000, upah: 100000, hargaJual: 20000,
    beliBareng: 300, kunci: 1300, saldo: 4650000,
    hargaKolektif: 11050, hargaKunci: 11300, offer: 'B',
    signed: false, shared: false,
  };
  const prakiraan = () => (S.prakiraanLow + S.prakiraanHigh) / 2;

  const icon = {
    leaf: '<svg viewBox="0 0 48 48" class="brand-mark" aria-hidden="true"><rect width="48" height="48" rx="14" fill="#2F5D3A"/><path d="M12 32c4-12 14-18 26-18-2 12-10 20-22 20-1.4 0-2.8-.6-4-2z" fill="#E4EDE1"/><circle cx="20" cy="27" r="2.6" fill="#D8A23B"/><circle cx="26" cy="23" r="2.6" fill="#D8A23B"/><circle cx="31" cy="19" r="2.6" fill="#D8A23B"/></svg>',
    lock: '<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#2F5D3A" stroke-width="2" stroke-linecap="round" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>',
  };

  function gauge(changePct) {
    // 0% sampai 12% dipetakan ke 180 derajat. Zona: <3 hijau, 3 sampai 8 kuning, >8 merah.
    const cx = 110, cy = 104, r = 84;
    const toXY = (p) => { const a = Math.PI * (1 - Math.min(Math.max(p, 0), 12) / 12); return [cx + r * Math.cos(a), cy - r * Math.sin(a)]; };
    const arc = (a, b, c) => { const [x1, y1] = toXY(a); const [x2, y2] = toXY(b); return `<path d="M${x1} ${y1} A${r} ${r} 0 0 1 ${x2} ${y2}" stroke="${c}" stroke-width="18" fill="none"/>`; };
    const [nx, ny] = toXY(changePct);
    return `<svg class="gauge" width="220" height="122" viewBox="0 0 220 122" role="img" aria-label="Radar kedelai menunjukkan perkiraan kenaikan ${pct(changePct)}">
      ${arc(0, 3, 'var(--sig-green)')}${arc(3, 8, 'var(--sig-yellow)')}${arc(8, 12, 'var(--sig-red)')}
      <line x1="${cx}" y1="${cy}" x2="${nx}" y2="${ny}" stroke="var(--ink)" stroke-width="4" stroke-linecap="round"/>
      <circle cx="${cx}" cy="${cy}" r="8" fill="var(--ink)"/>
    </svg>`;
  }
  const signal = () => {
    const c = (prakiraan() - S.harga) / S.harga * 100;
    if (c < 3) return { c, name: 'Hijau', cls: 'green', saran: 'Beli seperti biasa.' };
    if (c <= 8) return { c, name: 'Kuning', cls: 'yellow', saran: 'Ikut Beli Bareng dan siapkan Kartu Harga.' };
    return { c, name: 'Merah', cls: 'red', saran: 'Kunci harga lewat akad salam.' };
  };
  const calc = () => {
    const lain = S.ragi + S.plastik + S.gas + S.upah;
    const lainPerLonjor = lain / S.kedelaiHari;
    const hpp = S.harga + lainPerLonjor;
    const hppNext = prakiraan() + lainPerLonjor;
    const laba = S.hargaJual - hpp;
    const labaNext = S.hargaJual - hppNext;
    const jualNext = Math.ceil((hppNext + laba) / 500) * 500;
    return { lain, hpp, hppNext, laba, labaNext, jualNext, naik: (hppNext - hpp) / hpp * 100, labaBulan: laba * S.kedelaiHari * 26, labaBulanNext: labaNext * S.kedelaiHari * 26 };
  };

  const bar = (time) => `<div class="statusbar"><span>${time || '07.12'}</span><span class="notch"></span><span>4G  86%</span></div>`;
  const appbar = (t, s, kopti) => `<div class="appbar${kopti ? ' kopti' : ''}"><span class="back" aria-hidden="true">‹</span><div><div class="t">${t}</div>${s ? `<div class="s">${s}</div>` : ''}</div></div>`;

  const SCREENS = {
    chat: {
      title: 'Sinyal radar masuk', role: 'Perajin', desc: 'Senin pagi, perajin menerima sinyal Radar Kedelai lewat WhatsApp.',
      render() {
        const g = signal();
        return `<div class="screen chat">${bar('07.02')}
        <div class="appbar"><span class="avatar" aria-hidden="true">${icon.leaf.replace('class="brand-mark"', 'width="34" height="34"')}</span><div><div class="t">DapurKurs</div><div class="s">Akun resmi Koperasi Tempe Sanan</div></div></div>
        <div class="body">
          <div class="day"><span>Senin, 12 Oktober 2026</span></div>
          <div class="bubble">Selamat pagi, Pak Darto. Ini Radar Kedelai minggu ini.
            ${gauge(g.c)}
            <div class="gauge-label"><span class="pill ${g.cls}">Sinyal ${g.name.toLowerCase()}</span></div>
            <p style="margin:8px 0 2px">Harga kedelai di gudang Bapak sekarang <b>${rp(S.harga)}/kg</b>. Perkiraan 4 minggu lagi <b>${rp(S.prakiraanLow)} sampai ${rp(S.prakiraanHigh)}/kg</b> (${pct(g.c)}).</p>
            <p class="small muted" style="margin:6px 0 0">Penyebab: harga kontrak kedelai dunia naik dan rupiah melemah.</p>
            <div class="quick">
              <button data-go="hpp">Hitung biaya saya</button>
              <button data-go="pesan">Ikut Beli Bareng</button>
              <button data-go="pesan">Kunci harga bulan depan</button>
            </div>
            <span class="time">07.02</span>
          </div>
          <div class="bubble out">Hitung biaya saya<span class="time">07.05 ✓✓</span></div>
          <div class="bubble">Baik. Saya buka kalkulator dengan data usaha Bapak: ${kg(S.kedelaiHari)} kedelai per hari.<span class="time">07.05</span></div>
        </div></div>`;
      },
    },
    hpp: {
      title: 'Hitung dampak ke biaya', role: 'Perajin', desc: 'Kalkulator menerjemahkan perkiraan harga kedelai menjadi harga pokok per lonjor.',
      render() {
        const c = calc();
        const f = (k, l, step) => `<label class="field"><span>${l}</span><input type="number" inputmode="numeric" step="${step || 1000}" data-k="${k}" value="${S[k]}"></label>`;
        return `<div class="screen">${bar('07.06')}${appbar('Kalkulator Harga Pokok', 'Tempe lonjor, 1 kg kedelai per lonjor')}
        <div class="body">
          <div class="card">
            ${f('kedelaiHari', 'Kedelai per hari (kg)', 1)}
            ${f('harga', 'Harga kedelai sekarang (Rp/kg)', 50)}
            ${f('ragi', 'Ragi per hari (Rp)')}
            ${f('plastik', 'Plastik dan daun per hari (Rp)')}
            ${f('gas', 'Gas atau kayu per hari (Rp)')}
            ${f('upah', 'Upah per hari (Rp)')}
            ${f('hargaJual', 'Harga jual per lonjor (Rp)', 500)}
          </div>
          <div class="card">
            <div class="row"><span>Harga pokok sekarang</span><b>${rp(c.hpp)}</b></div>
            <div class="row"><span>Harga pokok 4 minggu lagi</span><b>${rp(c.hppNext)} <span class="pill yellow">${pct(c.naik)}</span></b></div>
            <div class="row"><span>Laba per bulan sekarang</span><b>${rp(c.labaBulan)}</b></div>
            <div class="row"><span>Laba per bulan jika tidak bertindak</span><b style="color:var(--sig-red)">${rp(c.labaBulanNext)}</b></div>
          </div>
          <div class="card" style="background:var(--soy-soft);border-color:#EBD7A8">
            <h3>Saran untuk Bapak</h3>
            <p class="small" style="margin:0 0 10px">Ikut Beli Bareng minggu ini dan kunci harga untuk kebutuhan bulan depan. Jika harga jual tetap perlu disesuaikan, naikkan bertahap ke ${rp(c.jualNext)} per lonjor dengan Kartu Harga.</p>
            <button class="btn" data-go="pesan">Pesan kedelai</button>
          </div>
        </div></div>`;
      },
    },
    pesan: {
      title: 'Pesan dan setor', role: 'Perajin', desc: 'Perajin memesan lewat Beli Bareng dan ikut mengunci harga untuk bulan depan.',
      render() {
        const bb = S.beliBareng * S.hargaKolektif;
        const kc = S.kunci * S.hargaKunci;
        const dp = kc * 0.3;
        const step = (k, n) => `<div style="display:flex;align-items:center;gap:8px"><button class="btn ghost" style="width:40px;padding:6px" data-step="${k}" data-d="-${n}" aria-label="Kurangi">−</button><b style="min-width:76px;text-align:center">${kg(S[k])}</b><button class="btn ghost" style="width:40px;padding:6px;margin:0" data-step="${k}" data-d="${n}" aria-label="Tambah">+</button></div>`;
        return `<div class="screen">${bar('07.09')}${appbar('Pesan Kedelai', 'Koperasi Tempe Sanan')}
        <div class="body">
          <div class="card">
            <h3>Beli Bareng minggu ini</h3>
            <p class="small muted" style="margin:0 0 8px">Pesanan ditutup Selasa pukul 17.00. Kopti menegosiasikan harga untuk semua anggota.</p>
            <div class="row"><span>Jumlah</span>${step('beliBareng', 50)}</div>
            <div class="row"><span>Perkiraan harga kolektif</span><b>${rp(S.hargaKolektif)}/kg</b></div>
            <div class="row"><span>Dibayar saat pengambilan</span><b>${rp(bb)}</b></div>
          </div>
          <div class="card">
            <h3>Kunci harga bulan depan</h3>
            <p class="small muted" style="margin:0 0 8px">Akad salam: Kopti membayar di muka, kedelai dikirim 2 November 2026.</p>
            <div class="row"><span>Jumlah</span>${step('kunci', 100)}</div>
            <div class="row"><span>Harga terkunci</span><b>${rp(S.hargaKunci)}/kg</b></div>
            <div class="row"><span>Nilai pesanan</span><b>${rp(kc)}</b></div>
            <div class="row"><span>Setoran 30% dari Tabungan Kedelai</span><b>${rp(dp)}</b></div>
            <div class="row"><span>Dibiayai BMT mitra (murabahah)</span><b>${rp(kc - dp)}</b></div>
          </div>
          <div class="card"><div class="row"><span>Saldo Tabungan Kedelai</span><b>${rp(S.saldo)}</b></div>
            <div class="row"><span>Sisa setelah setoran</span><b>${rp(S.saldo - dp)}</b></div></div>
          <button class="btn" data-toast="Pesanan terkirim ke Koperasi Tempe Sanan.">Kirim pesanan</button>
        </div></div>`;
      },
    },
    rekap: {
      title: 'Kopti merekap pesanan', role: 'Pengurus Kopti', desc: 'Pengurus melihat total pesanan semua anggota dalam satu layar.',
      render() {
        const m = [['DA', 'Pak Darto', S.beliBareng], ['SR', 'Bu Sri', 450], ['YG', 'Mas Yoga', 250], ['NR', 'Bu Nur', 400], ['HD', 'Pak Hadi', 350]];
        return `<div class="screen">${bar('17.10')}${appbar('Rekap Pesanan', 'Koperasi Tempe Sanan, minggu ke-2 Oktober', true)}
        <div class="body">
          <div class="card"><div class="small muted">Beli Bareng minggu ini</div><div class="big">12.000 kg</div><div class="small muted">dari 40 perajin, ditutup Selasa 17.00</div>
            <div class="bar"><i style="width:80%"></i></div><div class="small muted">80% dari kapasitas gudang 15 ton</div></div>
          <div class="card"><div class="small muted">Kunci harga bulan depan</div><div class="big">38.000 kg</div><div class="small muted">dari 31 perajin, Tabungan Kedelai terkumpul ${rp(128820000)}</div></div>
          <div class="card"><h3>Pesanan terbesar</h3>
            ${m.map(([i, n, q]) => `<div class="member"><span class="ini">${i}</span><span>${n}</span><b>${kg(q)}</b></div>`).join('')}
            <div class="small muted" style="margin-top:6px">dan 35 anggota lainnya</div></div>
          <button class="btn" data-go="penawaran">Bandingkan penawaran distributor</button>
        </div></div>`;
      },
    },
    penawaran: {
      title: 'Kopti membandingkan penawaran', role: 'Pengurus Kopti', desc: 'Tiga distributor terverifikasi mengajukan harga untuk 12 ton.',
      render() {
        const offers = [['A', 'Distributor A', 11150, '3 hari'], ['B', 'Distributor B', 11050, '4 hari'], ['C', 'Distributor C', 11200, '2 hari']];
        const chosen = offers.find((o) => o[0] === S.offer);
        return `<div class="screen">${bar('17.24')}${appbar('Penawaran untuk 12.000 kg', 'Harga pasar setempat ' + rp(11300) + '/kg', true)}
        <div class="body">
          ${offers.map(([id, n, p, t]) => `<button class="offer${S.offer === id ? ' best' : ''}" style="width:100%;text-align:left" data-offer="${id}" aria-pressed="${S.offer === id}">
            <span><b>${n}</b><br><span class="small muted">Terverifikasi, kirim ${t}</span></span>
            <span class="price">${rp(p)}</span>
            <span class="small muted">Hemat ${rp((11300 - p))}/kg dari harga pasar</span>${S.offer === id ? '<span class="pill green">Dipilih</span>' : '<span></span>'}
          </button>`).join('')}
          <div class="card"><div class="row"><span>Total penghematan anggota</span><b>${rp((11300 - chosen[2]) * 12000)}</b></div>
            <div class="row"><span>Penghematan Pak Darto (${kg(S.beliBareng)})</span><b>${rp((11300 - chosen[2]) * S.beliBareng)}</b></div></div>
          <button class="btn" data-go="kontrak">Lanjut ke kontrak</button>
        </div></div>`;
      },
    },
    kontrak: {
      title: 'Kontrak salam ditandatangani', role: 'Pengurus Kopti', desc: 'Harga bulan depan dikunci dengan akad salam yang syaratnya tertulis jelas.',
      render() {
        return `<div class="screen">${bar('17.40')}${appbar('Kontrak Salam Digital', 'Nomor KS/SANAN/2026/10/07', true)}
        <div class="body">
          <div class="card"><dl class="contract" style="margin:0">
            <dt>Pembeli (muslam)</dt><dd>Koperasi Tempe Sanan, atas nama 31 anggota</dd>
            <dt>Penjual (muslam ilaih)</dt><dd>Distributor B, terverifikasi</dd>
            <dt>Barang</dt><dd>Kedelai impor, mutu sesuai standar perajin, 38.000 kg</dd>
            <dt>Harga</dt><dd>${rp(S.hargaKunci)}/kg, total ${rp(S.hargaKunci * 38000)}</dd>
            <dt>Pembayaran</dt><dd>Penuh di muka, 13 Oktober 2026</dd>
            <dt>Penyerahan</dt><dd>2 November 2026, gudang Koperasi Tempe Sanan</dd>
            <dt>Sumber dana</dt><dd>Tabungan Kedelai ${rp(128820000)} dan BMT mitra ${rp(S.hargaKunci * 38000 - 128820000)}</dd>
            <dt>Dasar</dt><dd>Fatwa DSN-MUI Nomor 05/DSN-MUI/IV/2000</dd>
          </dl>
          <div class="sign">${S.signed ? 'Ditandatangani pengurus dan penjual, 12 Oktober 2026' : 'Belum ditandatangani'}</div></div>
          <button class="btn" data-sign="1">${S.signed ? 'Kontrak sudah ditandatangani' : 'Tanda tangani kontrak'}</button>
          <button class="btn ghost" data-go="siap">Lihat notifikasi anggota</button>
        </div></div>`;
      },
    },
    siap: {
      title: 'Kedelai siap diambil', role: 'Perajin', desc: 'Perajin mendapat jadwal pengambilan dan konfirmasi harga yang terkunci.',
      render() {
        const hemat = (11300 - S.hargaKolektif) * S.beliBareng;
        return `<div class="screen">${bar('09.15')}${appbar('Notifikasi', 'Kamis, 15 Oktober 2026')}
        <div class="body">
          <div class="card center"><div class="lock">${icon.lock}</div>
            <h3 style="font-size:18px">Kedelai Beli Bareng siap diambil</h3>
            <p class="small muted" style="margin:0">Gudang Koperasi Tempe Sanan, hari ini pukul 13.00 sampai 16.00</p></div>
          <div class="card">
            <div class="row"><span>Jumlah</span><b>${kg(S.beliBareng)}</b></div>
            <div class="row"><span>Harga kolektif</span><b>${rp(S.hargaKolektif)}/kg</b></div>
            <div class="row"><span>Hemat dibanding pasar</span><b style="color:var(--sig-green)">${rp(hemat)}</b></div>
          </div>
          <div class="card" style="background:var(--leaf-soft);border-color:#C9DAC4">
            <h3>Kebutuhan bulan depan sudah aman</h3>
            <div class="row"><span>${kg(S.kunci)} terkunci di</span><b>${rp(S.hargaKunci)}/kg</b></div>
            <div class="row"><span>Perkiraan harga pasar</span><b>${rp(prakiraan())}/kg</b></div>
            <div class="row"><span>Perkiraan selisih</span><b style="color:var(--sig-green)">${rp((prakiraan() - S.hargaKunci) * S.kunci)}</b></div>
          </div>
          <button class="btn" data-go="kartu">Buat Kartu Harga</button>
        </div></div>`;
      },
    },
    kartu: {
      title: 'Kartu Harga dibagikan', role: 'Perajin', desc: 'Penyesuaian harga dijelaskan terbuka kepada pedagang dan pembeli.',
      render() {
        const c = calc();
        const naik = c.jualNext - S.hargaJual;
        return `<div class="screen">${bar('10.02')}${appbar('Kartu Harga', 'Siap dibagikan ke pedagang dan pembeli')}
        <div class="body">
          <div class="pricecard">
            <div class="small" style="opacity:.85">Tempe Pak Darto, Sanan</div>
            <h2>Harga tempe lonjor mulai 9 November 2026</h2>
            <div style="margin-top:8px"><span class="old">${rp(S.hargaJual)}</span></div>
            <div class="new">${rp(c.jualNext)}</div>
            <p>Harga kedelai impor diperkirakan naik ${((prakiraan() - S.harga) / S.harga * 100).toLocaleString('id-ID', { maximumFractionDigits: 1, minimumFractionDigits: 1 })}% karena harga dunia naik dan rupiah melemah. Kami memilih menaikkan ${rp(naik)} secara terbuka daripada membuat tempe lebih tipis.</p>
            <p style="opacity:.75;font-size:12px">Ukuran dan ketebalan tetap sama. Terima kasih sudah setia.</p>
          </div>
          <div style="height:12px"></div>
          <button class="btn soy" data-toast="Kartu Harga dibagikan ke 18 pedagang langganan.">Bagikan lewat WhatsApp</button>
          <button class="btn ghost" data-toast="Kartu Harga disimpan ke galeri.">Simpan gambar</button>
        </div></div>`;
      },
    },
    tabungan: {
      title: 'Riwayat dan Tabungan Kedelai', role: 'Perajin', desc: 'Perajin memantau saldo, pesanan, dan kontrak yang sedang berjalan.',
      render() {
        const dp = S.kunci * S.hargaKunci * 0.3;
        const tx = [['12 Okt', 'Setoran untuk kunci harga', -dp], ['10 Okt', 'Setor Tabungan Kedelai', 500000], ['3 Okt', 'Setor Tabungan Kedelai', 500000], ['1 Okt', 'Beli Bareng 300 kg', 0]];
        return `<div class="screen">${bar('20.30')}${appbar('Tabungan Kedelai', 'Pak Darto, anggota sejak 2026')}
        <div class="body">
          <div class="card"><div class="small muted">Saldo</div><div class="big">${rp(S.saldo - dp)}</div>
            <div class="small muted">Disarankan menyisihkan ${rp(50000)} per hari produksi</div></div>
          <div class="card"><h3>Sedang berjalan</h3>
            <div class="row"><span>Kunci harga ${kg(S.kunci)}</span><span class="pill green">Terkunci ${rp(S.hargaKunci)}</span></div>
            <div class="row"><span>Pengiriman</span><b>2 November 2026</b></div>
            <div class="row"><span>Cicilan BMT</span><b>${rp((S.kunci * S.hargaKunci - dp) / 4)} x 4 pekan</b></div></div>
          <div class="card"><h3>Riwayat</h3>
            ${tx.map(([d, t, v]) => `<div class="row"><span><span class="small muted">${d}</span><br>${t}</span><b style="color:${v < 0 ? 'var(--sig-red)' : 'var(--ink)'}">${v === 0 ? 'Lunas' : (v > 0 ? '+' : '−') + rp(Math.abs(v))}</b></div>`).join('')}
          </div>
        </div></div>`;
      },
    },
    wilayah: {
      title: 'Dasbor wilayah', role: 'Gakoptindo dan pemerintah', desc: 'Kebutuhan riil dan harga beli perajin per wilayah untuk subsidi yang tepat sasaran.',
      render() {
        const k = [['Koperasi Tempe Sanan', 98, 11050], ['Kopti Kota Batu', 54, 11120], ['Kopti Kab. Malang', 61, 11090], ['Kopti Pasuruan', 39, 11150], ['Kopti Blitar', 26, 11060], ['Kopti Kediri', 18, 11020]];
        const max = 98;
        return `<div class="screen">${bar('08.00')}${appbar('Dasbor Wilayah', 'Puskopti Jawa Timur, Oktober 2026', true)}
        <div class="body">
          <div class="card" style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
            <div><div class="small muted">Perajin aktif</div><div class="big">312</div></div>
            <div><div class="small muted">Kebutuhan bulan ini</div><div class="big">296 ton</div></div>
            <div><div class="small muted">Harga beli rata-rata</div><div style="font-weight:800;font-size:18px">${rp(11080)}</div><div class="small muted">pasar ${rp(11300)}</div></div>
            <div><div class="small muted">Menyesuaikan harga sebelum naik</div><div style="font-weight:800;font-size:18px">64%</div></div>
          </div>
          <div class="card"><h3>Kebutuhan per koperasi (ton)</h3>
            ${k.map(([n, t, p]) => `<div class="small" style="display:flex;justify-content:space-between;margin-top:8px"><span>${n}</span><b>${t} ton, ${rp(p)}</b></div><div class="bar"><i style="width:${t / max * 100}%"></i></div>`).join('')}
          </div>
          <button class="btn" data-toast="Data penerima per anggota diekspor untuk penyaluran subsidi.">Ekspor data untuk penyaluran subsidi</button>
        </div></div>`;
      },
    },
  };

  const ORDER = ['chat', 'hpp', 'pesan', 'rekap', 'penawaran', 'kontrak', 'siap', 'kartu', 'tabungan', 'wilayah'];
  const SETS = {
    esai: ['chat', 'hpp', 'pesan', 'rekap', 'siap', 'kartu'],
    lampiran: ['chat', 'hpp', 'kartu', 'tabungan', 'rekap', 'penawaran', 'kontrak', 'wilayah'],
    semua: ORDER,
  };

  function bind(root, rerender) {
    root.querySelectorAll('[data-go]').forEach((b) => b.addEventListener('click', () => go(b.dataset.go)));
    root.querySelectorAll('input[data-k]').forEach((i) => i.addEventListener('change', () => { const v = Number(i.value); if (!Number.isNaN(v) && v > 0) S[i.dataset.k] = v; rerender(); }));
    root.querySelectorAll('[data-step]').forEach((b) => b.addEventListener('click', () => { S[b.dataset.step] = Math.max(0, S[b.dataset.step] + Number(b.dataset.d)); rerender(); }));
    root.querySelectorAll('[data-offer]').forEach((b) => b.addEventListener('click', () => { S.offer = b.dataset.offer; S.hargaKolektif = { A: 11150, B: 11050, C: 11200 }[S.offer]; rerender(); }));
    root.querySelectorAll('[data-sign]').forEach((b) => b.addEventListener('click', () => { S.signed = true; rerender(); toast(root, 'Kontrak salam ditandatangani. Anggota mendapat notifikasi.'); }));
    root.querySelectorAll('[data-toast]').forEach((b) => b.addEventListener('click', () => toast(root, b.dataset.toast)));
  }
  function toast(root, msg) {
    const scr = root.querySelector('.screen'); if (!scr) return;
    let t = scr.querySelector('.toast'); if (!t) { t = document.createElement('div'); t.className = 'toast'; t.setAttribute('role', 'status'); scr.appendChild(t); }
    t.textContent = msg; requestAnimationFrame(() => t.classList.add('on'));
    clearTimeout(t._h); t._h = setTimeout(() => t.classList.remove('on'), 2600);
  }

  // ---------- Showcase ----------
  let current = 'chat';
  function go(id) { if (!SCREENS[id]) return; current = id; if (location.hash !== '#' + id) history.replaceState(null, '', '#' + id); renderShow(); }
  function renderShow() {
    const phone = document.getElementById('phone');
    if (!phone) return;
    phone.innerHTML = SCREENS[current].render();
    bind(phone, renderShow);
    document.querySelectorAll('.steps button').forEach((b) => b.setAttribute('aria-current', b.dataset.id === current ? 'step' : 'false'));
    const i = ORDER.indexOf(current);
    document.getElementById('prev').disabled = i === 0;
    document.getElementById('next').disabled = i === ORDER.length - 1;
  }
  function initShow() {
    const list = document.getElementById('steps');
    list.innerHTML = ORDER.map((id, i) => `<li><button data-id="${id}"><span class="num">${i + 1}</span><span><span class="st-title">${SCREENS[id].title}</span><span class="st-desc">${SCREENS[id].desc} <span class="role">${SCREENS[id].role}</span></span></span></button></li>`).join('');
    list.querySelectorAll('button').forEach((b) => b.addEventListener('click', () => go(b.dataset.id)));
    document.getElementById('prev').addEventListener('click', () => go(ORDER[Math.max(0, ORDER.indexOf(current) - 1)]));
    document.getElementById('next').addEventListener('click', () => go(ORDER[Math.min(ORDER.length - 1, ORDER.indexOf(current) + 1)]));
    const h = location.hash.slice(1); if (SCREENS[h]) current = h;
    renderShow();
  }

  // ---------- Storyboard ----------
  function initBoard() {
    const params = new URLSearchParams(location.search);
    const set = SETS[params.get('set')] || SETS.semua;
    const grid = document.getElementById('board');
    grid.innerHTML = set.map((id, i) => `<figure class="board-item" style="margin:0"><figcaption><span class="num">${i + 1}</span>${SCREENS[id].title}</figcaption><div class="phone" data-screen="${id}"></div></figure>`).join('');
    grid.querySelectorAll('[data-screen]').forEach((el) => {
      const r = () => { el.innerHTML = SCREENS[el.dataset.screen].render(); bind(el, r); };
      r();
    });
    document.querySelectorAll('[data-set]').forEach((a) => a.setAttribute('aria-current', (params.get('set') || 'semua') === a.dataset.set ? 'page' : 'false'));
  }

  // single-screen page for screenshots: layar.html?id=chat
  function initSingle() {
    const id = new URLSearchParams(location.search).get('id') || 'chat';
    const el = document.getElementById('single');
    const r = () => { el.innerHTML = (SCREENS[id] || SCREENS.chat).render(); bind(el, r); };
    r();
  }

  window.DapurKurs = { initShow, initBoard, initSingle, icon };
})();
