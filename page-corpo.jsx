// MASSA CORPOREA — peso e massa grassa, serie Garmin Index S2 + plicometrie Zappitelli.
// Spostata qui dalla home il 06/10/2026 per alleggerirla.
function CorpoPage() {
  return (
    <TelemetryChrome active="CORPO">
      <BodyComposition />
    </TelemetryChrome>
  );
}

function BodyComposition() {
  var BODY = window.TRAINING.BODY || [];
  var PLICO = window.TRAINING.PLICO || [];
  if (!BODY.length) return null;

  var W = 1000, H = 220, PAD = 34;
  var all = BODY.concat(PLICO);
  var t0 = new Date(all[0].d).getTime();
  var t1 = new Date(BODY[BODY.length - 1].d).getTime();
  PLICO.forEach(function (p) { var t = new Date(p.d).getTime(); if (t < t0) t0 = t; if (t > t1) t1 = t; });
  var span = Math.max(1, t1 - t0);
  var X = function (d) { return PAD + ((new Date(d).getTime() - t0) / span) * (W - PAD * 2); };

  var plicoKg = PLICO.filter(function (p) { return p.kg; });
  var plicoBf = PLICO.filter(function (p) { return p.bf; });
  var kgs = BODY.map(function (b) { return b.kg; }).concat(plicoKg.map(function (p) { return p.kg; }));
  var bfs = BODY.filter(function (b) { return b.bf; }).map(function (b) { return b.bf; }).concat(plicoBf.map(function (p) { return p.bf; }));
  var kgLo = Math.floor(Math.min.apply(null, kgs) - 1), kgHi = Math.ceil(Math.max.apply(null, kgs) + 1);
  var bfLo = Math.floor(Math.min.apply(null, bfs) - 1), bfHi = Math.ceil(Math.max.apply(null, bfs) + 1);
  var Ykg = function (v) { return H - ((v - kgLo) / (kgHi - kgLo)) * H; };
  var Ybf = function (v) { return H - ((v - bfLo) / (bfHi - bfLo)) * H; };

  function line(pts, yf, key) {
    return 'M' + pts.map(function (p) { return X(p.d) + ',' + yf(p[key]); }).join(' L');
  }
  var bodyBf = BODY.filter(function (b) { return b.bf; });
  var first = BODY[0], last = BODY[BODY.length - 1];
  var fb = bodyBf[0], lb = bodyBf[bodyBf.length - 1];
  var fatKg0 = fb.kg * fb.bf / 100, fatKg1 = lb.kg * lb.bf / 100;
  var leanKg0 = fb.kg - fatKg0, leanKg1 = lb.kg - fatKg1;
  var dKg = last.kg - first.kg, dBf = lb.bf - fb.bf, dFat = fatKg1 - fatKg0, dLean = leanKg1 - leanKg0;
  var n = function (v, dec) { return (v > 0 ? '+' : v < 0 ? '−' : '') + Math.abs(v).toFixed(dec === undefined ? 1 : dec).replace('.', ','); };

  // etichette mese
  var months = [];
  BODY.forEach(function (b) { var k = b.d.slice(0, 7); if (months.indexOf(k) < 0) months.push(k); });
  var MN = ['GEN', 'FEB', 'MAR', 'APR', 'MAG', 'GIU', 'LUG', 'AGO', 'SET', 'OTT', 'NOV', 'DIC'];


  // asse x condiviso: tick posizionati sulla scala temporale reale
  function AxisX() {
    var d0 = new Date(t0), d1 = new Date(t1);
    var ticks = [];
    var y = d0.getFullYear(), m = d0.getMonth() <= 5 ? 0 : 6;
    var cur = new Date(y, m, 1);
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

  var box = { border: '1px solid var(--line)', padding: '12px 14px', background: 'var(--bg)' };
  var lab = { fontSize: 9, color: 'var(--fg-3)', letterSpacing: '0.16em' };

  return (
    <div style={{ border: '1px solid var(--line)', padding: 16, marginBottom: 16, background: 'var(--bg-2)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: 8, marginBottom: 14 }}>
        <div>
          <div style={{ fontSize: 10, color: 'var(--fg-3)', letterSpacing: '0.18em' }}>{'// BODY_COMP · ' + BODY.length + ' misure · Garmin Index S2' + (PLICO.length ? ' + ' + PLICO.length + ' plicometrie Zappitelli' : '')}</div>
          <div className="display" style={{ fontSize: 26, lineHeight: 1, marginTop: 6 }}>PESO E MASSA GRASSA</div>
        </div>
        <div style={{ fontSize: 10, color: 'var(--fg-3)', letterSpacing: '0.12em', textAlign: 'right' }}>
          {(function () {
            var a = PLICO.length ? (PLICO[0].d < first.d ? PLICO[0].d : first.d) : first.d;
            return a.split('-').reverse().join('/') + ' \u2192 ' + last.d.split('-').reverse().join('/');
          })()}
        </div>
      </div>

      {/* numeri chiave */}
      <div className="r-grid r-grid-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 16 }}>
        <div style={box}>
          <div style={lab}>PESO OGGI</div>
          <div className="display tabular" style={{ fontSize: 30, lineHeight: 1.1 }}>{String(last.kg).replace('.', ',')}<span style={{ fontSize: 13, color: 'var(--fg-3)' }}> kg</span></div>
          <div className="tabular" style={{ fontSize: 11, color: dKg < 0 ? '#39E75F' : 'var(--fg-3)', marginTop: 4 }}>{n(dKg) + ' kg in un anno'}</div>
        </div>
        <div style={box}>
          <div style={lab}>MASSA GRASSA</div>
          <div className="display tabular" style={{ fontSize: 30, lineHeight: 1.1, color: '#FF6B9D' }}>{String(lb.bf).replace('.', ',')}<span style={{ fontSize: 13, color: 'var(--fg-3)' }}> %</span></div>
          <div className="tabular" style={{ fontSize: 11, color: dBf < 0 ? '#39E75F' : 'var(--fg-3)', marginTop: 4 }}>{n(dBf) + ' punti'}</div>
        </div>
        <div style={box}>
          <div style={lab}>GRASSO IN KG</div>
          <div className="display tabular" style={{ fontSize: 30, lineHeight: 1.1 }}>{fatKg1.toFixed(1).replace('.', ',')}<span style={{ fontSize: 13, color: 'var(--fg-3)' }}> kg</span></div>
          <div className="tabular" style={{ fontSize: 11, color: dFat < 0 ? '#39E75F' : 'var(--fg-3)', marginTop: 4 }}>{n(dFat) + ' kg'}</div>
        </div>
        <div style={box}>
          <div style={lab}>MASSA MAGRA</div>
          <div className="display tabular" style={{ fontSize: 30, lineHeight: 1.1 }}>{leanKg1.toFixed(1).replace('.', ',')}<span style={{ fontSize: 13, color: 'var(--fg-3)' }}> kg</span></div>
          <div className="tabular" style={{ fontSize: 11, color: 'var(--fg-3)', marginTop: 4 }}>{n(dLean) + ' kg'}</div>
        </div>
      </div>

      {/* grafico peso */}
      <div style={{ ...box, marginBottom: 10 }}>
        <div style={{ ...lab, marginBottom: 8 }}>{'PESO · kg · scala ' + kgLo + '–' + kgHi}</div>
        <svg viewBox={'0 0 ' + W + ' ' + H} style={{ width: '100%', height: 170, display: 'block', overflow: 'visible' }} preserveAspectRatio="none">
          {[kgLo, (kgLo + kgHi) / 2, kgHi].map(function (g, i) {
            return <line key={i} x1="0" y1={Ykg(g)} x2={W} y2={Ykg(g)} stroke="var(--line)" strokeWidth="1" strokeDasharray="3 5" />;
          })}
          <path d={line(BODY, Ykg, 'kg')} fill="none" stroke="#FFFFFF" strokeWidth="2" vectorEffect="non-scaling-stroke" />
          {plicoKg.length > 1 && <path d={line(plicoKg, Ykg, 'kg')} fill="none" stroke="#FFB454" strokeWidth="2" strokeDasharray="5 4" vectorEffect="non-scaling-stroke" />}
          {BODY.map(function (b, i) {
            return <circle key={i} cx={X(b.d)} cy={Ykg(b.kg)} r="3" fill={i === BODY.length - 1 ? '#39E75F' : '#FFFFFF'} vectorEffect="non-scaling-stroke">
              <title>{b.d.split('-').reverse().join('/') + ' · ' + b.kg + ' kg' + (b.bf ? ' · ' + b.bf + '% grasso' : '')}</title>
            </circle>;
          })}
          {plicoKg.map(function (p, i) {
            return <g key={'p' + i}>
              <line x1={X(p.d)} y1="0" x2={X(p.d)} y2={H} stroke="#FFB454" strokeWidth="1" strokeDasharray="2 4" vectorEffect="non-scaling-stroke" />
              <rect x={X(p.d) - 5} y={Ykg(p.kg) - 5} width="10" height="10" fill="#FFB454" vectorEffect="non-scaling-stroke">
                <title>{'ZAPPITELLI ' + p.d.split('-').reverse().join('/') + ' · ' + p.kg + ' kg' + (p.bf ? ' · ' + p.bf + '% (plicometria)' : '')}</title>
              </rect>
            </g>;
          })}
        </svg>
        <AxisX />
      </div>

      {/* grafico massa grassa */}
      <div style={{ ...box, marginBottom: 12 }}>
        <div style={{ ...lab, marginBottom: 8 }}>{'MASSA GRASSA · % · scala ' + bfLo + '–' + bfHi}</div>
        <svg viewBox={'0 0 ' + W + ' ' + H} style={{ width: '100%', height: 170, display: 'block', overflow: 'visible' }} preserveAspectRatio="none">
          {[bfLo, (bfLo + bfHi) / 2, bfHi].map(function (g, i) {
            return <line key={i} x1="0" y1={Ybf(g)} x2={W} y2={Ybf(g)} stroke="var(--line)" strokeWidth="1" strokeDasharray="3 5" />;
          })}
          <path d={line(bodyBf, Ybf, 'bf')} fill="none" stroke="#FF6B9D" strokeWidth="2" vectorEffect="non-scaling-stroke" />
          {plicoBf.length > 1 && <path d={line(plicoBf, Ybf, 'bf')} fill="none" stroke="#FFB454" strokeWidth="2" strokeDasharray="5 4" vectorEffect="non-scaling-stroke" />}
          {bodyBf.map(function (b, i) {
            return <circle key={i} cx={X(b.d)} cy={Ybf(b.bf)} r="3" fill={i === bodyBf.length - 1 ? '#39E75F' : '#FF6B9D'} vectorEffect="non-scaling-stroke">
              <title>{b.d.split('-').reverse().join('/') + ' · ' + b.bf + '%'}</title>
            </circle>;
          })}
          {plicoBf.map(function (p, i) {
            return <rect key={'pb' + i} x={X(p.d) - 5} y={Ybf(p.bf) - 5} width="10" height="10" fill="#FFB454" vectorEffect="non-scaling-stroke">
              <title>{'ZAPPITELLI ' + p.d.split('-').reverse().join('/') + ' · ' + p.bf + '% (plicometria)'}</title>
            </rect>;
          })}
        </svg>
        <AxisX />
      </div>

      {/* legenda + lettura */}
      <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap', marginBottom: 10 }}>
        <span style={{ ...lab, display: 'flex', alignItems: 'center', gap: 6 }}><i style={{ width: 10, height: 2, background: '#FFFFFF', display: 'inline-block' }} />PESO (INDEX S2)</span>
        <span style={{ ...lab, display: 'flex', alignItems: 'center', gap: 6 }}><i style={{ width: 10, height: 2, background: '#FF6B9D', display: 'inline-block' }} />MASSA GRASSA (INDEX S2)</span>
        <span style={{ ...lab, display: 'flex', alignItems: 'center', gap: 6 }}><i style={{ width: 9, height: 9, background: '#FFB454', display: 'inline-block' }} />ZAPPITELLI (PLICOMETRIA)</span>
      </div>
      <div style={{ fontSize: 11, color: 'var(--fg-3)', lineHeight: 1.7, borderTop: '1px solid var(--line)', paddingTop: 10, whiteSpace: 'pre-line' }}>
        {'Sull\'ultimo anno di bilancia il peso scende di ' + Math.abs(dKg).toFixed(1).replace('.', ',') + ' kg, ma il dato che conta è la ripartizione: grasso ' + n(dFat) + ' kg, massa magra ' + n(dLean) + ' kg. Il calo è quasi tutto grasso.'}
        {PLICO.length
          ? (function () {
            var lp = plicoBf[plicoBf.length - 1], fp = plicoBf[0];
            return '\nLE DUE SERIE NON COINCIDONO, E LA DISTANZA È GRANDE: la bilancia legge ' + String(lb.bf).replace('.', ',') + '% di massa grassa, l\'ultima plicometria di Zappitelli ' + String(lp.bf).replace('.', ',') + '%. Quindici punti non sono un problema di taratura: i due numeri non possono essere entrambi giusti.'
              + '\nI due metodi sbagliano in direzioni note e opposte. La bioimpedenza domestica SOVRASTIMA il grasso, e idratazione, pasti e allenamento recente la spostano di giorno in giorno. Le formule su pliche SOTTOSTIMANO sui soggetti alti e pesanti, perché tarate su popolazioni di corporatura media. Il valore vero sta quasi certamente in mezzo.'
              + '\nQuello che va guardato è la TENDENZA di ciascuna serie, non il livello — e lì sono d\'accordo: la bilancia fa ' + String(fb.bf).replace('.', ',') + '% → ' + String(lb.bf).replace('.', ',') + '%, la plicometria ' + String(fp.bf).replace('.', ',') + '% → ' + String(lp.bf).replace('.', ',') + '% partendo dal ' + fp.d.split('-').reverse().join('/') + '. Scendono entrambe.'
              + '\nAnche i pesi non coincidono, con Zappitelli sempre circa due chili più alto: bilance diverse, ore e abbigliamento diversi. Ogni serie va letta contro sé stessa.';
          })()
          : '\nLe plicometrie di Zappitelli entreranno qui come quadrati arancioni, su una linea propria: metodo diverso dalla bioimpedenza, le due serie si leggono in parallelo e non si mediano.'}
      </div>
    </div>
  );
}
