// MASSA CORPOREA — peso e massa grassa, serie Garmin Index S2 + plicometrie Zappitelli.
// Spostata qui dalla home il 06/10/2026 per alleggerirla.
function CorpoPage() {
  return (
    <TelemetryChrome active="CORPO">
      <BodyComposition />
      <Vo2maxChart />
    </TelemetryChrome>
  );
}

function BodyComposition() {
  var BODY = window.TRAINING.BODY || [];
  var PLICO = window.TRAINING.PLICO || [];
  var BT = window.TRAINING.BODY_TREND || { pts: [], soglie: { kg: 0.3, bf: 0.3 } };
  var ZA = window.TRAINING.ZAP_ANCORE || [];
  var T = BT.pts || [];
  if (!BODY.length || !T.length) return null;

  var W = 1000, H = 220, PAD = 34;
  var DAY = 86400000;
  var ms = function (d) { return new Date(d).getTime(); };
  var t0 = ms(BODY[0].d), t1 = ms(T[T.length - 1].d);
  PLICO.forEach(function (p) { var t = ms(p.d); if (t < t0) t0 = t; if (t > t1) t1 = t; });
  var span = Math.max(1, t1 - t0);
  var X = function (d) { return PAD + ((ms(d) - t0) / span) * (W - PAD * 2); };

  var plicoKg = PLICO.filter(function (p) { return p.kg; });
  var plicoBf = PLICO.filter(function (p) { return p.bf; });
  var bodyBf = BODY.filter(function (b) { return b.bf; });
  var kgs = BODY.map(function (b) { return b.kg; }).concat(plicoKg.map(function (p) { return p.kg; }));
  var bfs = bodyBf.map(function (b) { return b.bf; }).concat(plicoBf.map(function (p) { return p.bf; }));
  var kgLo = Math.floor(Math.min.apply(null, kgs) - 1), kgHi = Math.ceil(Math.max.apply(null, kgs) + 1);
  var bfLo = Math.floor(Math.min.apply(null, bfs) - 1), bfHi = Math.ceil(Math.max.apply(null, bfs) + 1);
  var Ykg = function (v) { return H - ((v - kgLo) / (kgHi - kgLo)) * H; };
  var Ybf = function (v) { return H - ((v - bfLo) / (bfHi - bfLo)) * H; };

  function line(pts, yf, key) {
    return 'M' + pts.map(function (p) { return X(p.d) + ',' + yf(p[key]); }).join(' L');
  }
  // linea di tendenza: si interrompe dove fra due giorni con pesate passano piu' di 7 giorni (li' la media non esiste)
  function trendPath(key, yf) {
    var out = '', prev = null;
    T.forEach(function (p) {
      if (p[key] === null || p[key] === undefined) { prev = null; return; }
      var cmd = (prev && ms(p.d) - ms(prev.d) <= 7 * DAY) ? ' L' : ' M';
      out += cmd + X(p.d) + ',' + yf(p[key]);
      prev = p;
    });
    return out.trim();
  }

  var now = T[T.length - 1];
  var nowBf = T.filter(function (p) { return p.bf7 !== null; }).slice(-1)[0];
  var nowZ = T.filter(function (p) { return p.z7 !== null && p.z7 !== undefined; }).slice(-1)[0];
  var ancNow = nowZ ? ZA.filter(function (a) { return a.d === nowZ.za; })[0] : null;
  var errMax = (function () { var e = ZA.filter(function (a) { return a.err !== null; }).map(function (a) { return Math.abs(a.err); }); return e.length ? Math.max.apply(null, e) : null; })();
  if (!ancNow) nowZ = null;
  var fatNow = now.kg7 * nowBf.bf7 / 100, leanNow = now.kg7 - fatNow;
  var c2 = function (v) { return v.toFixed(2).replace('.', ','); };
  var n = function (v, dec) { return (v > 0 ? '+' : v < 0 ? '−' : '') + Math.abs(v).toFixed(dec === undefined ? 1 : dec).replace('.', ','); };
  var fd = function (d) { return d.split('-').reverse().join('/'); };
  var col = function (st) { return st === 'discesa' ? '#39E75F' : st === 'salita' ? '#FFB454' : 'var(--fg-3)'; };
  var stTxt = function (st, delta, u) {
    if (!st) return 'settimana prima senza pesate';
    return st.toUpperCase() + ' · ' + n(delta, 2) + u + ' sulla media di 7 gg prima';
  };

  // confronto con un anno fa: ultimo punto di tendenza con massa grassa ad almeno 365 giorni da oggi
  var ref = T.filter(function (p) { return p.bf7 !== null && ms(p.d) <= ms(now.d) - 365 * DAY; }).slice(-1)[0];
  // escursione massima dentro uno stesso giorno, dai grammi esatti
  var spread = (function () {
    var g = {}, best = { d: null, v: 0 };
    BODY.forEach(function (b) { (g[b.d] = g[b.d] || []).push(b.g); });
    Object.keys(g).forEach(function (d) { var v = (Math.max.apply(null, g[d]) - Math.min.apply(null, g[d])) / 1000; if (v > best.v) best = { d: d, v: v }; });
    return best;
  })();
  var nIdx = BODY.filter(function (b) { return !b.man; }).length, nMan = BODY.length - nIdx;
  var MN = ['GEN', 'FEB', 'MAR', 'APR', 'MAG', 'GIU', 'LUG', 'AGO', 'SET', 'OTT', 'NOV', 'DIC'];

  function AxisX() {
    var d0 = new Date(t0), d1 = new Date(t1);
    var ticks = [];
    var cur = new Date(d0.getFullYear(), d0.getMonth() <= 5 ? 0 : 6, 1);
    while (cur.getTime() < d0.getTime()) { cur = new Date(cur.getFullYear(), cur.getMonth() + 6, 1); }
    while (cur.getTime() <= d1.getTime()) {
      ticks.push({ t: cur.getTime(), lab: MN[cur.getMonth()] + ' ' + String(cur.getFullYear()).slice(2) });
      cur = new Date(cur.getFullYear(), cur.getMonth() + 6, 1);
    }
    return (
      <div style={{ position: 'relative', height: 16, marginTop: 4 }}>
        {ticks.map(function (k, i) {
          var pct = ((k.t - t0) / span) * 100;
          return (
            <span key={i} style={{
              position: 'absolute', left: pct + '%', transform: 'translateX(-50%)',
              fontSize: 9, color: 'var(--fg-3)', letterSpacing: '0.08em', whiteSpace: 'nowrap'
            }}>{k.lab}</span>
          );
        })}
      </div>
    );
  }

  var box = { border: '1px solid var(--line)', padding: '12px 14px', background: 'var(--bg)', minWidth: 0 };
  var lab = { fontSize: 9, color: 'var(--fg-3)', letterSpacing: '0.16em' };
  var cell = { padding: '5px 8px', borderBottom: '1px solid var(--line)', whiteSpace: 'nowrap' };

  return (
    <div style={{ border: '1px solid var(--line)', padding: 16, marginBottom: 16, background: 'var(--bg-2)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: 8, marginBottom: 14 }}>
        <div>
          <div style={{ fontSize: 10, color: 'var(--fg-3)', letterSpacing: '0.18em' }}>{'// BODY_COMP · ' + BODY.length + ' pesate (' + nIdx + ' Index S2' + (nMan ? ', ' + nMan + ' scritte a mano' : '') + ')' + (PLICO.length ? ' + ' + PLICO.length + ' plicometrie Zappitelli' : '')}</div>
          <div className="display" style={{ fontSize: 26, lineHeight: 1, marginTop: 6 }}>PESO E MASSA GRASSA · TENDENZA</div>
        </div>
        <div style={{ fontSize: 10, color: 'var(--fg-3)', letterSpacing: '0.12em', textAlign: 'right' }}>
          {fd(new Date(t0).toISOString().slice(0, 10)) + ' → ' + fd(now.d)}
        </div>
      </div>

      {/* numeri chiave: medie di 7 giorni */}
      <div className="r-grid r-grid-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 16 }}>
        <div style={box}>
          <div style={lab}>PESO · MEDIA 7 GG</div>
          <div className="display tabular" style={{ fontSize: 30, lineHeight: 1.1 }}>{c2(now.kg7)}<span style={{ fontSize: 13, color: 'var(--fg-3)' }}> kg</span></div>
          <div className="tabular" style={{ fontSize: 11, color: col(now.sKg), marginTop: 4 }}>{stTxt(now.sKg, now.dKg, ' kg')}</div>
          <div className="tabular" style={{ fontSize: 10, color: 'var(--fg-3)', marginTop: 2 }}>{now.n + ' pesate dal ' + fd(new Date(ms(now.d) - 6 * DAY).toISOString().slice(0, 10)) + ' al ' + fd(now.d)}</div>
        </div>
        <div style={box}>
          <div style={lab}>MASSA GRASSA · MEDIA 7 GG</div>
          <div className="display tabular" style={{ fontSize: 30, lineHeight: 1.1, color: '#FF6B9D' }}>{c2(nowBf.bf7)}<span style={{ fontSize: 13, color: 'var(--fg-3)' }}> %</span></div>
          <div className="tabular" style={{ fontSize: 11, color: col(nowBf.sBf), marginTop: 4 }}>{stTxt(nowBf.sBf, nowBf.dBf, ' punti')}</div>
          <div className="tabular" style={{ fontSize: 10, color: 'var(--fg-3)', marginTop: 2 }}>{nowBf.nbf + ' pesate con massa grassa'}</div>
        </div>
        <div style={box}>
          <div style={lab}>GRASSO IN KG</div>
          <div className="display tabular" style={{ fontSize: 30, lineHeight: 1.1 }}>{c2(fatNow)}<span style={{ fontSize: 13, color: 'var(--fg-3)' }}> kg</span></div>
          <div className="tabular" style={{ fontSize: 11, color: 'var(--fg-3)', marginTop: 4 }}>{'media peso × media massa grassa'}</div>
          {ref && <div className="tabular" style={{ fontSize: 10, color: 'var(--fg-3)', marginTop: 2 }}>{n(fatNow - ref.kg7 * ref.bf7 / 100, 2) + ' kg dal ' + fd(ref.d)}</div>}
        </div>
        <div style={box}>
          <div style={lab}>MASSA MAGRA</div>
          <div className="display tabular" style={{ fontSize: 30, lineHeight: 1.1 }}>{c2(leanNow)}<span style={{ fontSize: 13, color: 'var(--fg-3)' }}> kg</span></div>
          <div className="tabular" style={{ fontSize: 11, color: 'var(--fg-3)', marginTop: 4 }}>{'media peso − grasso in kg'}</div>
          {ref && <div className="tabular" style={{ fontSize: 10, color: 'var(--fg-3)', marginTop: 2 }}>{n(leanNow - (ref.kg7 - ref.kg7 * ref.bf7 / 100), 2) + ' kg dal ' + fd(ref.d)}</div>}
        </div>
      </div>

      {/* grafico peso */}
      <div style={{ ...box, marginBottom: 10 }}>
        <div style={{ ...lab, marginBottom: 8 }}>{'PESO · kg · scala ' + kgLo + '–' + kgHi + ' · punti = pesate · linea = media 7 gg'}</div>
        <svg viewBox={'0 0 ' + W + ' ' + H} style={{ width: '100%', height: 170, display: 'block', overflow: 'visible' }} preserveAspectRatio="none">
          {[kgLo, (kgLo + kgHi) / 2, kgHi].map(function (g, i) {
            return <line key={i} x1="0" y1={Ykg(g)} x2={W} y2={Ykg(g)} stroke="var(--line)" strokeWidth="1" strokeDasharray="3 5" />;
          })}
          {BODY.map(function (b, i) {
            return <circle key={i} cx={X(b.d)} cy={Ykg(b.kg)} r="2.2" fill={b.man ? 'none' : '#FFFFFF'} stroke="#FFFFFF" strokeWidth="1" opacity="0.4" vectorEffect="non-scaling-stroke">
              <title>{fd(b.d) + ' ' + b.h + ' · ' + b.kg + ' kg' + (b.bf ? ' · ' + b.bf + '% grasso' : '') + (b.man ? ' · scritta a mano' : '')}</title>
            </circle>;
          })}
          <path d={trendPath('kg7', Ykg)} fill="none" stroke="#FFFFFF" strokeWidth="2" vectorEffect="non-scaling-stroke" />
          <circle cx={X(now.d)} cy={Ykg(now.kg7)} r="4" fill="#39E75F" vectorEffect="non-scaling-stroke"><title>{'media 7 gg al ' + fd(now.d) + ' · ' + c2(now.kg7) + ' kg'}</title></circle>
          {plicoKg.length > 1 && <path d={line(plicoKg, Ykg, 'kg')} fill="none" stroke="#FFB454" strokeWidth="2" strokeDasharray="5 4" vectorEffect="non-scaling-stroke" />}
          {plicoKg.map(function (p, i) {
            return <g key={'p' + i}>
              <line x1={X(p.d)} y1="0" x2={X(p.d)} y2={H} stroke="#FFB454" strokeWidth="1" strokeDasharray="2 4" vectorEffect="non-scaling-stroke" />
              <rect x={X(p.d) - 5} y={Ykg(p.kg) - 5} width="10" height="10" fill="#FFB454" vectorEffect="non-scaling-stroke">
                <title>{'ZAPPITELLI ' + fd(p.d) + ' · ' + p.kg + ' kg' + (p.bf ? ' · ' + p.bf + '% (plicometria)' : '')}</title>
              </rect>
            </g>;
          })}
        </svg>
        <AxisX />
      </div>

      {/* grafico massa grassa */}
      <div style={{ ...box, marginBottom: 12 }}>
        <div style={{ ...lab, marginBottom: 8 }}>{'MASSA GRASSA · % · scala ' + bfLo + '–' + bfHi + ' · punti = pesate · linea = media 7 gg'}</div>
        <svg viewBox={'0 0 ' + W + ' ' + H} style={{ width: '100%', height: 170, display: 'block', overflow: 'visible' }} preserveAspectRatio="none">
          {[bfLo, (bfLo + bfHi) / 2, bfHi].map(function (g, i) {
            return <line key={i} x1="0" y1={Ybf(g)} x2={W} y2={Ybf(g)} stroke="var(--line)" strokeWidth="1" strokeDasharray="3 5" />;
          })}
          {bodyBf.map(function (b, i) {
            return <circle key={i} cx={X(b.d)} cy={Ybf(b.bf)} r="2.2" fill="#FF6B9D" opacity="0.4" vectorEffect="non-scaling-stroke">
              <title>{fd(b.d) + ' ' + b.h + ' · ' + b.bf + '%'}</title>
            </circle>;
          })}
          <path d={trendPath('bf7', Ybf)} fill="none" stroke="#FF6B9D" strokeWidth="2" vectorEffect="non-scaling-stroke" />
          <circle cx={X(nowBf.d)} cy={Ybf(nowBf.bf7)} r="4" fill="#39E75F" vectorEffect="non-scaling-stroke"><title>{'media 7 gg al ' + fd(nowBf.d) + ' · ' + c2(nowBf.bf7) + '%'}</title></circle>
          <path d={trendPath('z7', Ybf)} fill="none" stroke="#FFB454" strokeWidth="2" vectorEffect="non-scaling-stroke" />
          {plicoBf.length > 1 && <path d={line(plicoBf, Ybf, 'bf')} fill="none" stroke="#FFB454" strokeWidth="2" strokeDasharray="5 4" vectorEffect="non-scaling-stroke" />}
          {plicoBf.map(function (p, i) {
            return <rect key={'pb' + i} x={X(p.d) - 5} y={Ybf(p.bf) - 5} width="10" height="10" fill="#FFB454" vectorEffect="non-scaling-stroke">
              <title>{'ZAPPITELLI ' + fd(p.d) + ' · ' + p.bf + '% (plicometria)'}</title>
            </rect>;
          })}
        </svg>
        <AxisX />
      </div>

      {/* legenda */}
      <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap', marginBottom: 10 }}>
        <span style={{ ...lab, display: 'flex', alignItems: 'center', gap: 6 }}><i style={{ width: 10, height: 2, background: '#FFFFFF', display: 'inline-block' }} />PESO, MEDIA 7 GG</span>
        <span style={{ ...lab, display: 'flex', alignItems: 'center', gap: 6 }}><i style={{ width: 10, height: 2, background: '#FF6B9D', display: 'inline-block' }} />MASSA GRASSA, MEDIA 7 GG</span>
        <span style={{ ...lab, display: 'flex', alignItems: 'center', gap: 6 }}><i style={{ width: 6, height: 6, borderRadius: 3, background: 'var(--fg-3)', display: 'inline-block' }} />SINGOLA PESATA (VUOTA = SCRITTA A MANO)</span>
        <span style={{ ...lab, display: 'flex', alignItems: 'center', gap: 6 }}><i style={{ width: 9, height: 9, background: '#FFB454', display: 'inline-block' }} />ZAPPITELLI (PLICOMETRIA)</span>
        <span style={{ ...lab, display: 'flex', alignItems: 'center', gap: 6 }}><i style={{ width: 10, height: 2, background: '#FFB454', display: 'inline-block' }} />STIMA ZAPPITELLI DALLA BILANCIA</span>
      </div>

      {/* stima Zappitelli: la plicometria fa da ancora per la massa grassa della bilancia */}
      {ZA.length > 0 && nowZ && (
        <div style={{ ...box, marginBottom: 12, overflowX: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: 8, marginBottom: 8 }}>
            <div style={lab}>{'STIMA ZAPPITELLI · massa grassa della bilancia riportata sulla plicometria'}</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, flexWrap: 'wrap', marginBottom: 6 }}>
            <div className="display tabular" style={{ fontSize: 30, lineHeight: 1.1, color: '#FFB454' }}>{c2(nowZ.z7)}<span style={{ fontSize: 13, color: 'var(--fg-3)' }}> %</span></div>
            <div className="tabular" style={{ fontSize: 11, color: 'var(--fg-3)', lineHeight: 1.6 }}>
              {'bilancia ' + c2(nowZ.bf7) + '% (media 7 gg al ' + fd(nowZ.d) + ') × ' + ancNow.k.toFixed(4).replace('.', ',')}
              <br />{'ancora: visita del ' + fd(ancNow.d) + ', plicometria ' + String(ancNow.plico).replace('.', ',') + '% contro ' + c2(ancNow.bil) + '% della bilancia (' + ancNow.n + ' pesate entro 7 giorni)'}
            </div>
          </div>
          {errMax !== null && <div className="tabular" style={{ fontSize: 11, color: 'var(--fg-3)', marginBottom: 8 }}>{'Alle visite passate la stima ha sbagliato fino a ' + errMax.toFixed(2).replace('.', ',') + ' punti: va letta con questo margine.'}</div>}
          <table className="tabular" style={{ borderCollapse: 'collapse', fontSize: 11, width: '100%' }}>
            <thead><tr style={{ color: 'var(--fg-3)', textAlign: 'left' }}>
              <th style={cell}>VISITA</th><th style={cell}>PLICOMETRIA</th><th style={cell}>BILANCIA ±7 GG</th><th style={cell}>RAPPORTO</th><th style={cell}>STIMA PRIMA DELLA VISITA</th><th style={cell}>ERRORE</th>
            </tr></thead>
            <tbody>
              {ZA.slice().reverse().map(function (a, i) {
                return <tr key={i}>
                  <td style={cell}>{fd(a.d)}</td>
                  <td style={cell}>{String(a.plico).replace('.', ',') + '%'}</td>
                  <td style={cell}>{c2(a.bil) + '% · ' + a.n + ' pesate'}</td>
                  <td style={cell}>{a.k.toFixed(4).replace('.', ',')}</td>
                  <td style={cell}>{a.stima === null ? '—' : c2(a.stima) + '% (ancora ' + fd(a.da) + ')'}</td>
                  <td style={cell}>{a.err === null ? '—' : n(a.err, 2) + ' punti'}</td>
                </tr>;
              })}
            </tbody>
          </table>
        </div>
      )}

      <div style={{ fontSize: 11, color: 'var(--fg-3)', lineHeight: 1.7, borderTop: '1px solid var(--line)', paddingTop: 10, whiteSpace: 'pre-line' }}>
        {'La singola pesata conta poco: nello stesso giorno il peso è arrivato a variare di ' + spread.v.toFixed(3).replace('.', ',') + ' kg (' + fd(spread.d) + '). Conta la linea, cioè la media di tutte le pesate degli ultimi 7 giorni. La tendenza confronta la media di oggi con quella di 7 giorni prima: sotto ' + String(BT.soglie.kg).replace('.', ',') + ' kg (peso) e ' + String(BT.soglie.bf).replace('.', ',') + ' punti (massa grassa) è stabile.'}
        {ref ? '\nRispetto alla media di 7 giorni al ' + fd(ref.d) + ': peso ' + n(now.kg7 - ref.kg7, 2) + ' kg, grasso ' + n(fatNow - ref.kg7 * ref.bf7 / 100, 2) + ' kg, massa magra ' + n(leanNow - (ref.kg7 - ref.kg7 * ref.bf7 / 100), 2) + ' kg.' : ''}
        {PLICO.length
          ? (function () {
            var lp = plicoBf[plicoBf.length - 1];
            return '\nLE DUE SERIE NON COINCIDONO: la bilancia legge ' + c2(nowBf.bf7) + '% di massa grassa (media 7 gg), l\'ultima plicometria di Zappitelli ' + String(lp.bf).replace('.', ',') + '% (' + fd(lp.d) + '). Sono due metodi diversi: la bioimpedenza domestica risente di idratazione, pasti e allenamento recente, le formule su pliche sono tarate su corporature medie. Le due serie non si mediano: la plicometria fa da ancora e la linea arancione riporta la bilancia sulla sua scala, con il rapporto dell\'ultima visita. A ogni visita nuova il rapporto si aggiorna.';
          })()
          : ''}
      </div>
    </div>
  );
}


// VO2MAX — stima Garmin (corsa) nel tempo, aggiunta l'11/10/2026. Dati da scripts/garmin_corpo.py.
function Vo2maxChart() {
  var V = window.TRAINING.VO2MAX || [];
  var VB = window.TRAINING.VO2MAX_BICI || [];
  if (V.length < 2) return null;
  var W = 1000, H = 220, PAD = 34;
  var t0 = new Date(V[0].d).getTime(), t1 = new Date(V[V.length - 1].d).getTime();
  var span = Math.max(1, t1 - t0);
  var X = function (d) { return PAD + ((new Date(d).getTime() - t0) / span) * (W - PAD * 2); };
  var vs = V.map(function (p) { return p.v; });
  var lo = Math.floor(Math.min.apply(null, vs) - 0.5), hi = Math.ceil(Math.max.apply(null, vs) + 0.5);
  var Y = function (v) { return H - ((v - lo) / (hi - lo)) * H; };
  var path = 'M' + V.map(function (p) { return X(p.d) + ',' + Y(p.v); }).join(' L');
  var fd = function (d) { return d.split('-').reverse().join('/'); };
  var c = function (v) { return String(v).replace('.', ','); };
  var last = V[V.length - 1];
  var max = V.reduce(function (a, p) { return p.v >= a.v ? p : a; }, V[0]);
  var min = V.reduce(function (a, p) { return p.v < a.v ? p : a; }, V[0]);
  var anno = last.d.slice(0, 4);
  var primoAnno = V.filter(function (p) { return p.d.slice(0, 4) === anno; })[0];
  var dAnno = Math.round((last.v - primoAnno.v) * 10) / 10;
  var MN = ['GEN', 'FEB', 'MAR', 'APR', 'MAG', 'GIU', 'LUG', 'AGO', 'SET', 'OTT', 'NOV', 'DIC'];
  var ticks = [];
  var d0 = new Date(t0), cur = new Date(d0.getFullYear(), d0.getMonth() <= 5 ? 0 : 6, 1);
  while (cur.getTime() < t0) { cur = new Date(cur.getFullYear(), cur.getMonth() + 6, 1); }
  while (cur.getTime() <= t1) { ticks.push({ t: cur.getTime(), lab: MN[cur.getMonth()] + ' ' + String(cur.getFullYear()).slice(2) }); cur = new Date(cur.getFullYear(), cur.getMonth() + 6, 1); }
  var box = { border: '1px solid var(--line)', padding: '12px 14px', background: 'var(--bg)' };
  var lab = { fontSize: 9, color: 'var(--fg-3)', letterSpacing: '0.16em' };
  var tile = function (titolo, valore, sotto, colore) {
    return (
      <div style={box}>
        <div style={lab}>{titolo}</div>
        <div className="display tabular" style={{ fontSize: 30, lineHeight: 1.1, color: colore || 'inherit' }}>{valore}</div>
        <div className="tabular" style={{ fontSize: 11, color: 'var(--fg-3)', marginTop: 4 }}>{sotto}</div>
      </div>
    );
  };
  return (
    <div style={{ border: '1px solid var(--line)', padding: 16, marginBottom: 16, background: 'var(--bg-2)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: 8, marginBottom: 14 }}>
        <div>
          <div style={{ fontSize: 10, color: 'var(--fg-3)', letterSpacing: '0.18em' }}>{'// VO2MAX · ' + V.length + ' aggiornamenti Garmin · corsa'}</div>
          <div className="display" style={{ fontSize: 26, lineHeight: 1, marginTop: 6 }}>VO2MAX</div>
        </div>
        <div style={{ fontSize: 10, color: 'var(--fg-3)', letterSpacing: '0.12em', textAlign: 'right' }}>{fd(V[0].d) + ' → ' + fd(last.d)}</div>
      </div>
      <div className="r-grid r-grid-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 16 }}>
        {tile('ULTIMO', c(last.v), fd(last.d), '#39E75F')}
        {tile('DA INIZIO ' + anno, (dAnno > 0 ? '+' : dAnno < 0 ? '−' : '') + c(Math.abs(dAnno)), 'da ' + c(primoAnno.v) + ' del ' + fd(primoAnno.d))}
        {tile('MASSIMO', c(max.v), fd(max.d))}
        {tile('MINIMO', c(min.v), fd(min.d))}
      </div>
      <div style={{ ...box, marginBottom: 10 }}>
        <div style={{ ...lab, marginBottom: 8 }}>{'VO2MAX CORSA · ml/kg/min · scala ' + lo + '–' + hi}</div>
        <svg viewBox={'0 0 ' + W + ' ' + H} style={{ width: '100%', height: 170, display: 'block', overflow: 'visible' }} preserveAspectRatio="none">
          {[lo, (lo + hi) / 2, hi].map(function (g, i) {
            return <line key={i} x1="0" y1={Y(g)} x2={W} y2={Y(g)} stroke="var(--line)" strokeWidth="1" strokeDasharray="3 5" />;
          })}
          <path d={path} fill="none" stroke="#FFFFFF" strokeWidth="2" vectorEffect="non-scaling-stroke" />
          {V.map(function (p, i) {
            return <circle key={i} cx={X(p.d)} cy={Y(p.v)} r="3" fill={i === V.length - 1 ? '#39E75F' : '#FFFFFF'} vectorEffect="non-scaling-stroke">
              <title>{fd(p.d) + ' · VO2max ' + c(p.v)}</title>
            </circle>;
          })}
        </svg>
        <div style={{ position: 'relative', height: 16, marginTop: 4 }}>
          {ticks.map(function (k, i) {
            return <span key={i} style={{ position: 'absolute', left: (((k.t - t0) / span) * 100) + '%', transform: 'translateX(-50%)', fontSize: 9, color: 'var(--fg-3)', letterSpacing: '0.08em', whiteSpace: 'nowrap' }}>{k.lab}</span>;
          })}
        </div>
      </div>
      <div style={{ fontSize: 11, color: 'var(--fg-3)', lineHeight: 1.7, borderTop: '1px solid var(--line)', paddingTop: 10, whiteSpace: 'pre-line' }}>
        {'Stima di Garmin Connect, valore a un decimale (l\'app mostra l\'intero). Un punto per ogni giorno in cui Garmin l\'ha aggiornata.'}
        {VB.length ? '\nBICI (stima separata, solo uscite col misuratore di potenza): ' + VB.map(function (p) { return fd(p.d) + ' ' + c(p.v); }).join(' · ') + '.' : ''}
      </div>
    </div>
  );
}
