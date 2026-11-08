// ANALISI GARA - CEDAS WE RUN 10 KM · MIRAFIORI 08/11/2026
// Dati in window.TRAINING.GARA_CEDAS_10K (data.js), ricavati dal FIT Garmin: niente numeri scritti a mano nei grafici.
function GaraCedasPage() {
  var G = window.TRAINING.GARA_CEDAS_10K;
  var DMAX = 10068.91;
  var hs = React.useState(null), hover = hs[0], setHover = hs[1];

  var it = function (x, k) { return x.toFixed(k == null ? 2 : k).replace('.', ','); };
  var pace = function (s) { var m = Math.floor(s / 60); var r = s - 60 * m; return m + ':' + (r < 10 ? '0' : '') + r.toFixed(1); };
  var t3 = function (s) { var m = Math.floor(s / 60); var r = s - 60 * m; return m + ':' + (r < 10 ? '0' : '') + r.toFixed(3); };
  var mt = function (d) { return Math.round(d).toLocaleString('it-IT') + ' m'; };

  var big = G.climbs.filter(function (c) { return c.big; });
  var minor = G.climbs.filter(function (c) { return !c.big; });

  // serie per i grafici: x = metri
  var sAlt = G.alt.map(function (p) { return [p[0], p[1]]; });
  var sPace = G.prof.map(function (p) { return [p[0] + 50, p[1] * 10]; });
  var sHr = G.prof.map(function (p) { return [p[0] + 50, p[2]]; });
  var sPw = G.prof.map(function (p) { return [p[0] + 50, p[3]]; });
  var near = function (s, d) { var b = s[0]; for (var i = 1; i < s.length; i++) { if (Math.abs(s[i][0] - d) < Math.abs(b[0] - d)) b = s[i]; } return b; };

  var Sec = function (p) {
    return (
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 10, borderBottom: '1px solid var(--line-2)', paddingBottom: 6 }}>
          <span style={{ fontFamily: 'var(--display)', fontSize: 18, letterSpacing: '0.04em', color: 'var(--accent)' }}>{p.n}</span>
          <span style={{ fontFamily: 'var(--display)', fontSize: 18, letterSpacing: '0.04em' }}>{p.t}</span>
        </div>
        {p.children}
      </div>
    );
  };
  var P = function (p) { return <div style={{ fontSize: 12, color: 'var(--fg-2)', lineHeight: 1.75, marginBottom: 10, whiteSpace: 'pre-line', maxWidth: 900 }}>{p.children}</div>; };
  var Box = function (p) {
    var c = p.tone === 'warn' ? 'var(--warn)' : (p.tone === 'ok' ? 'var(--accent)' : 'var(--line)');
    return (
      <div style={{ border: '1px solid ' + c, borderLeft: '3px solid ' + c, background: 'var(--bg-2)', padding: '10px 14px', marginBottom: 12, maxWidth: 900 }}>
        {p.title && <div style={{ fontFamily: 'var(--display)', fontSize: 13, letterSpacing: '0.08em', color: c, marginBottom: 6 }}>{p.title}</div>}
        <div style={{ fontSize: 11.5, color: 'var(--fg-2)', lineHeight: 1.7, whiteSpace: 'pre-line' }}>{p.children}</div>
      </div>
    );
  };
  var Tab = function (p) {
    return (
      <div style={{ overflowX: 'auto', marginBottom: 14 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--mono)', fontSize: 11 }}>
          <thead><tr style={{ borderBottom: '1px solid var(--line)' }}>
            {p.h.map(function (x, i) { return <th key={i} style={{ textAlign: i === 0 ? 'left' : 'right', padding: '7px 8px', color: 'var(--fg-3)', letterSpacing: '0.1em', fontWeight: 600, whiteSpace: 'nowrap' }}>{x}</th>; })}
          </tr></thead>
          <tbody>
            {p.r.map(function (row, ri) {
              var hi = p.hi && p.hi.indexOf(ri) >= 0;
              return (
                <tr key={ri} style={{ borderBottom: '1px solid var(--line-2)', background: hi ? 'rgba(184,255,87,0.07)' : 'transparent' }}>
                  {row.map(function (c, ci) {
                    return <td key={ci} style={{ textAlign: ci === 0 ? 'left' : 'right', padding: '6px 8px', whiteSpace: 'nowrap', color: ci === 0 ? 'var(--accent)' : (hi ? '#fff' : 'var(--fg-2)'), fontWeight: (ci === 0 || hi) ? 700 : 400 }}>{c}</td>;
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  // ── grafico a serie singola, asse x condiviso (metri) ──
  var W = 1000, PL = 56, PR = 12, PT = 10, PB = 18;
  var xs = function (d) { return PL + (d / DMAX) * (W - PL - PR); };
  var Chart = function (p) {
    var H = p.h || 120;
    var ys = p.data.map(function (q) { return q[1]; });
    var lo = p.lo != null ? p.lo : Math.min.apply(null, ys), hi = p.hi != null ? p.hi : Math.max.apply(null, ys);
    var y = function (v) { var f = (v - lo) / (hi - lo); if (p.invert) f = 1 - f; return PT + (1 - f) * (H - PT - PB); };
    var path = p.data.map(function (q, i) { return (i ? 'L' : 'M') + xs(q[0]).toFixed(1) + ' ' + y(q[1]).toFixed(1); }).join(' ');
    var ticks = p.ticks || [lo, (lo + hi) / 2, hi];
    var onMove = function (e) {
      var r = e.currentTarget.getBoundingClientRect();
      var px = (e.clientX - r.left) / r.width * W;
      var d = (px - PL) / (W - PL - PR) * DMAX;
      setHover(Math.max(0, Math.min(DMAX, d)));
    };
    var cur = hover != null ? near(p.data, hover) : null;
    return (
      <div style={{ marginBottom: 6 }}>
        <div style={{ fontSize: 10, color: 'var(--fg-3)', letterSpacing: '0.15em', marginBottom: 2 }}>{p.title}</div>
        <svg viewBox={'0 0 ' + W + ' ' + H} style={{ width: '100%', height: 'auto', display: 'block', touchAction: 'pan-y' }}
             onMouseMove={onMove} onMouseLeave={function () { setHover(null); }} onTouchStart={function (e) { onMove(e.touches[0] ? { currentTarget: e.currentTarget, clientX: e.touches[0].clientX } : e); }}>
          {G.climbs.map(function (c) {
            return <rect key={c.n} x={xs(c.d0)} y={PT} width={Math.max(2, xs(c.d1) - xs(c.d0))} height={H - PT - PB}
                         fill={c.big ? 'rgba(184,255,87,0.16)' : 'rgba(255,255,255,0.05)'} />;
          })}
          {ticks.map(function (t, i) {
            return <g key={i}>
              <line x1={PL} x2={W - PR} y1={y(t)} y2={y(t)} stroke="var(--line)" strokeWidth="1" />
              <text x={PL - 6} y={y(t) + 3.5} textAnchor="end" fontSize="10" fill="var(--fg-3)" fontFamily="var(--mono)">{p.fmt(t)}</text>
            </g>;
          })}
          {p.refV != null && <g>
            <line x1={PL} x2={W - PR} y1={y(p.refV)} y2={y(p.refV)} stroke="var(--warn)" strokeWidth="1" strokeDasharray="4 4" />
            <text x={W - PR - 4} y={y(p.refV) - 4} textAnchor="end" fontSize="10" fill="var(--fg-2)" fontFamily="var(--mono)">{p.refLabel}</text>
          </g>}
          <path d={path} fill="none" stroke="var(--fg)" strokeWidth="2" strokeLinejoin="round" />
          {[0, 2000, 4000, 6000, 8000, 10000].map(function (k) {
            return <text key={k} x={xs(k)} y={H - 4} textAnchor="middle" fontSize="10" fill="var(--fg-3)" fontFamily="var(--mono)">{k / 1000 + ' km'}</text>;
          })}
          {cur && <g>
            <line x1={xs(hover)} x2={xs(hover)} y1={PT} y2={H - PB} stroke="var(--fg-2)" strokeWidth="1" />
            <circle cx={xs(cur[0])} cy={y(cur[1])} r="4" fill="var(--accent)" stroke="var(--bg)" strokeWidth="2" />
          </g>}
          <rect x={PL} y={0} width={W - PL - PR} height={H} fill="transparent" />
        </svg>
      </div>
    );
  };

  var read = hover == null ? null : {
    d: hover, alt: near(sAlt, hover)[1], pace: near(sPace, hover)[1], hr: near(sHr, hover)[1], pw: near(sPw, hover)[1],
    c: G.climbs.filter(function (c) { return hover >= c.d0 && hover <= c.d1; })[0]
  };

  // ── mappa del percorso ──
  var lats = G.gps.map(function (g) { return g[0]; }), lons = G.gps.map(function (g) { return g[1]; });
  var la0 = Math.min.apply(null, lats), la1 = Math.max.apply(null, lats), lo0 = Math.min.apply(null, lons), lo1 = Math.max.apply(null, lons);
  var kx = Math.cos((la0 + la1) / 2 * Math.PI / 180);
  var MW = 1000, MH = Math.round(MW * (la1 - la0) / ((lo1 - lo0) * kx)) + 40;
  var mx = function (lo) { return 20 + (lo - lo0) * kx / ((lo1 - lo0) * kx) * (MW - 40); };
  var my = function (la) { return 20 + (la1 - la) / (la1 - la0) * (MH - 40); };
  var mpath = function (pts) { return pts.map(function (g, i) { return (i ? 'L' : 'M') + mx(g[1]).toFixed(1) + ' ' + my(g[0]).toFixed(1); }).join(' '); };
  var kmPts = [1, 2, 3, 4, 5, 6, 7, 8, 9].map(function (k) { return [k, near(G.gps.map(function (g) { return [g[2], g]; }), k * 1000)[1]]; });
  var hovPt = hover != null ? near(G.gps.map(function (g) { return [g[2], g]; }), hover)[1] : null;

  var restT = 2660 - big.reduce(function (a, c) { return a + c.t; }, 0);
  var bigLen = big.reduce(function (a, c) { return a + c.len; }, 0), bigT = big.reduce(function (a, c) { return a + c.t; }, 0);

  return (
    <TelemetryChrome active="STORICO">
      <div style={{ border: '1px solid var(--accent)', background: 'var(--bg-2)', padding: '18px 20px', marginBottom: 20 }}>
        <div style={{ fontSize: 10, color: 'var(--fg-3)', letterSpacing: '0.2em', marginBottom: 6 }}>// ANALISI_GARA · 08 NOV 2026 · BENCHMARK RUN 10 KM</div>
        <div className="display" style={{ fontSize: 34, lineHeight: 1, marginBottom: 8 }}>CEDAS WE RUN 10 KM · 44:19.316</div>
        <div style={{ fontSize: 12, color: 'var(--fg-2)', letterSpacing: '0.04em' }}>Mirafiori, Torino · 10 km competitiva FIDAL · pettorale 957 · categoria SM45 · partenza 09:01:01</div>
        <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap', marginTop: 14 }}>
          {[['TEMPO (GARMIN)', '44:19.316'], ['DISTANZA GPS', '10.068,91 m'], ['PASSO', '4:24.1/km'], ['ASSOLUTO', '112°'], ['UOMINI', '100°'], ['SM45', '10°'], ['FC MEDIA', '159,75'], ['FC MAX', '166']].map(function (x, i) {
            return <div key={i}><div style={{ fontSize: 9.5, color: 'var(--fg-3)', letterSpacing: '0.14em' }}>{x[0]}</div><div className="display" style={{ fontSize: 20, lineHeight: 1.2 }}>{x[1]}</div></div>;
          })}
        </div>
      </div>

      <Box title="COME LEGGERE QUESTA PAGINA">
        {'Tutti i numeri vengono dal FIT del Garmin: 2.660 record, uno al secondo. Il tempo ufficiale è quello del Garmin (scelta di Federico); dal diploma si prendono solo i piazzamenti.\nObiettivo del coach 4:15/km e le 4 salite della pista prove: dichiarati da Federico.\n[CALC] = calcolato dai record · [IPOTESI] = interpretazione, da confermare.'}
      </Box>

      <Sec n="01" t="LA GARA IN QUATTRO NUMERI">
        <Tab h={['TRATTO', 'METRI', 'TEMPO', 'PASSO /KM', 'FC', 'POTENZA']} hi={[2]} r={[
          ['Primi 5 km', '5.000', '21:40.855', '4:20.2', '157,58', '530,4 W'],
          ['Secondi 5 km', '5.000', '22:20.393', '4:28.1', '161,84', '509,3 W'],
          ['5 km migliore (da 75,37 m)', '5.000', '21:33.432', '4:18.7', '159,11', '532,8 W'],
          ['Gara', '10.068,91', '44:19.316', '4:24.1', '159,75', '519,6 W'],
        ]} />
        <P>{'Il 5 km migliore è quello che Garmin segna come record (21:33): da 75,37 m a 5.075,37 m, dalle 09:01:28 alle 09:23:01. Contiene tutte e quattro le salite. [CALC]\nA 4:15/km i 10.068,91 m sarebbero 42:47.6: mancano 1:31.7, cioè +9,1 s al km. [CALC]\nSeconda metà: +39,538 s, FC +4,27, potenza −21,1 W (−4,0%), efficienza −5,51%. [CALC]'}</P>
      </Sec>

      <Sec n="02" t="IL PROFILO, METRO PER METRO">
        <P>{'Quattro grafici con lo stesso asse dei metri. In verde le 4 salite marcate, in grigio le 3 lievi. Passa il dito o il mouse sopra: la riga sotto dà i valori in quel punto.'}</P>
        <div style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--fg-2)', minHeight: 20, marginBottom: 6 }}>
          {read ? (mt(read.d) + ' · altitudine ' + it(read.alt, 1) + ' m · passo ' + pace(read.pace) + '/km · FC ' + it(read.hr, 1) + ' · ' + it(read.pw, 1) + ' W' + (read.c ? ' · SALITA ' + read.c.n : '')) : 'tocca un grafico'}
        </div>
        <Chart title="ALTITUDINE (m) · ogni 20 m, barometro livellato su 5 s" data={sAlt} h={110} lo={246} hi={259} ticks={[247, 252, 257]} fmt={function (v) { return v.toFixed(0); }} />
        <Chart title="PASSO (/km) · ogni 100 m · più in alto = più veloce" data={sPace.slice(1)} h={130} lo={240} hi={300} invert ticks={[240, 255, 270, 285, 300]} fmt={function (v) { return pace(v).slice(0, 4); }} refV={255} refLabel="obiettivo 4:15" />
        <Chart title="FREQUENZA CARDIACA (bpm) · ogni 100 m" data={sHr} h={110} lo={90} hi={170} ticks={[110, 135, 157]} fmt={function (v) { return v.toFixed(0); }} refV={157} refLabel="inizio Z5 157" />
        <Chart title="POTENZA DI CORSA (W, scala Garmin) · ogni 100 m" data={sPw.slice(1)} h={110} lo={440} hi={600} ticks={[450, 500, 550, 600]} fmt={function (v) { return v.toFixed(0); }} />
        <P>{'I primi 100 m (32,8 s, partenza nel gruppo) sono fuori scala nel grafico del passo e della potenza: sono nella tabella in fondo.'}</P>
      </Sec>

      <Sec n="03" t="LE SALITE">
        <Tab h={['#', 'DA M', 'A M', 'LUNGA', 'DISLIVELLO', 'PENDENZA', 'TEMPO', 'PASSO', '200 M PRIMA', 'FC IN → OUT', 'POTENZA', '200 M PRIMA', 'ORA']}
          hi={G.climbs.map(function (c, i) { return c.big ? i : -1; }).filter(function (i) { return i >= 0; })}
          r={G.climbs.map(function (c) {
            return [String(c.n) + (c.big ? '' : ' lieve'), it(c.d0), it(c.d1), it(c.len) + ' m', '+' + it(c.gain) + ' m', it(c.grade) + '%', c.t + ' s', c.pace, c.pre, c.hr0 + ' → ' + c.hr1, it(c.pw, 1) + ' W', it(c.prepw, 1) + ' W', c.clock];
          })} />
        <Box tone="ok" title="QUANTO HANNO PESATO [CALC]">
          {'Le 4 salite marcate (dislivello ≥ 3 m e pendenza ≥ 3%) sono fra 1.877 e 3.631 m, dalle 09:09 alle 09:16.\nInsieme: ' + it(bigLen) + ' m in ' + bigT + ' s, a ' + pace(bigT / bigLen * 1000) + '/km. Il resto della gara: ' + it(DMAX - bigLen) + ' m in ' + restT + ' s, a ' + pace(restT / (DMAX - bigLen) * 1000) + '/km.\nAl passo del resto della gara, quei metri sarebbero costati 9,9 s in meno.\nSulle rampe la potenza sale (543-568 W) rispetto ai 200 m prima (509-549 W): lo sforzo c\'è, il passo cala.'}
        </Box>
        <Box tone="warn" title="DOVE STA IL RESTO DEL DISTACCO">
          {'Dei 91,7 s che mancano al 4:15, le rampe ne spiegano direttamente 9,9. [CALC]\nLa seconda metà ha meno salita della prima (16,6 m contro 34,2) ma è 39,5 s più lenta, con FC più alta e potenza più bassa: dal 6° al 9° km 503-512 W contro 520-540 W dei primi 5, con la FC ferma a 161-162. [CALC]\nI km più lenti, il 6°, il 9° e il 10° (4:30), salgono piano ma senza interruzioni: +3,6, +3,2 e +6,2 m netti. [CALC]\n[IPOTESI] La fatica accumulata sulle rampe e il test Hybrid Race del giorno prima sono entrambi compatibili con il calo: i dati da soli non separano le due cause.'}
        </Box>
      </Sec>

      <Sec n="04" t="IL PERCORSO">
        <P>{'Traccia GPS, ' + G.gps.length + ' punti. In verde le 4 salite marcate. Partenza e arrivo nello stesso punto.'}</P>
        <svg viewBox={'0 0 ' + MW + ' ' + MH} style={{ width: '100%', maxWidth: 900, height: 'auto', display: 'block', background: 'var(--bg-2)', border: '1px solid var(--line)', marginBottom: 14 }}>
          <path d={mpath(G.gps)} fill="none" stroke="var(--fg-3)" strokeWidth="2.5" strokeLinejoin="round" />
          {big.map(function (c) {
            var seg = G.gps.filter(function (g) { return g[2] >= c.d0 && g[2] <= c.d1; });
            return <path key={c.n} d={mpath(seg)} fill="none" stroke="var(--accent)" strokeWidth="6" strokeLinecap="round" />;
          })}
          {kmPts.map(function (k) {
            return <g key={k[0]}><circle cx={mx(k[1][1])} cy={my(k[1][0])} r="9" fill="var(--bg)" stroke="var(--fg-2)" strokeWidth="1.5" /><text x={mx(k[1][1])} y={my(k[1][0]) + 3.5} textAnchor="middle" fontSize="10" fill="var(--fg)" fontFamily="var(--mono)">{k[0]}</text></g>;
          })}
          <circle cx={mx(G.gps[0][1])} cy={my(G.gps[0][0])} r="7" fill="var(--warn)" stroke="var(--bg)" strokeWidth="2" />
          {hovPt && <circle cx={mx(hovPt[1])} cy={my(hovPt[0])} r="7" fill="var(--accent)" stroke="var(--bg)" strokeWidth="2" />}
        </svg>
        <P>{'Cerchio rosso: partenza e arrivo. Numeri: i km. Il punto verde segue il dito sui grafici.'}</P>
      </Sec>

      <Sec n="05" t="KM PER KM">
        <Tab h={['KM', 'TEMPO', 'PASSO /KM', 'SALITA', 'DISCESA', 'NETTO', 'FC', 'POTENZA', 'CADENZA']} hi={[5, 8, 9]}
          r={G.kms.map(function (k) { return ['km ' + k[0], t3(k[1]), pace(k[1]), it(k[2], 1) + ' m', it(k[3], 1) + ' m', it(k[4], 1) + ' m', it(k[5]), it(k[6], 1) + ' W', it(k[7], 1)]; })} />
        <P>{'Tempi dai lap automatici del Garmin. Salita e discesa sommano le variazioni dell\'altitudine livellata: includono il rumore del barometro, per questo il totale (51 m) supera il D+ 39 m del Garmin. Cadenza in passi al minuto.'}</P>
      </Sec>

      <Sec n="06" t="OGNI 100 METRI">
        <details>
          <summary style={{ cursor: 'pointer', fontSize: 11, color: 'var(--accent)', letterSpacing: '0.12em', marginBottom: 10 }}>APRI LA TABELLA (100 RIGHE)</summary>
          <Tab h={['DA M', 'A M', 'TEMPO', 'PASSO /KM', 'NETTO', 'FC', 'POTENZA']}
            r={G.prof.map(function (p) { return [String(p[0]), String(Math.min(p[0] + 100, 10000)), it(p[1], 1) + ' s', pace(p[1] * 10), it(p[4], 1) + ' m', it(p[2], 1), it(p[3], 1) + ' W']; })} />
        </details>
      </Sec>

      <div style={{ fontSize: 10.5, color: 'var(--fg-3)', letterSpacing: '0.06em', borderTop: '1px solid var(--line-2)', paddingTop: 12, marginTop: 8 }}>
        Fonti: FIT Garmin <code>FIT/cedas_werun_10k_08nov2026/</code> · piazzamenti dal diploma della classifica ufficiale · serie al secondo in <code>dati/CEDAS_WERUN_10K_20261108_per_secondo.csv</code>.
        <br />Versione testuale in <code>dati/CEDAS_WERUN_10K_2026_ANALISI.md</code> · <a href="storico.html" style={{ color: 'var(--accent)' }}>← torna allo storico</a> · <a href="dashboard.html" style={{ color: 'var(--accent)' }}>record</a>
      </div>
    </TelemetryChrome>
  );
}
