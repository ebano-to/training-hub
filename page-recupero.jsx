// RECOVERY — HRV / RHR / sonno / carico + readiness del giorno (dati Garmin, aggiornati ogni mattina 09:00)
function RecuperoPage() {
  var R = window.TRAINING.RECOVERY;
  var ATHLETE = window.TRAINING.ATHLETE;
  var T = R.today;
  var B = R.baseline;
  var days = R.days;

  var C = { green: '#39E75F', blue: '#58ADF7', amber: '#FFB84D', red: '#FF4444', purple: '#6C68D7' };

  // ── Verdict → colore + etichetta ──
  var verdictMap = {
    go_hard: { c: C.green, label: 'SPINGI' },
    steady:  { c: 'var(--accent)', label: 'REGOLARE' },
    easy:    { c: C.amber, label: 'LEGGERO' },
    rest:    { c: C.red, label: 'RIPOSO' }
  };
  var V = verdictMap[T.verdict] || verdictMap.steady;

  function fmtSleep(min) { return Math.floor(min / 60) + 'h' + (min % 60 < 10 ? '0' : '') + (min % 60) + '\''; }

  // ── ALERT calcolati dai dati di oggi ──
  var alerts = [];
  // ACWR
  if (T.acwr > 1.3) alerts.push({ lvl: 'alert', t: 'Carico acuto alto', d: 'ACWR ' + T.acwr.toFixed(2) + ' — stai salendo troppo in fretta, attento al sovraccarico' });
  else if (T.acwr < 0.8) alerts.push({ lvl: 'warn', t: 'Carico in calo', d: 'ACWR ' + T.acwr.toFixed(2) + ' — stai scaricando, fitness in leggero calo' });
  else alerts.push({ lvl: 'ok', t: 'Carico in equilibrio', d: 'ACWR ' + T.acwr.toFixed(2) + ' — zona ottimale (0,8–1,3)' });
  // Monotonia
  if (T.monotony > 2) alerts.push({ lvl: 'alert', t: 'Monotonia alta', d: 'Monotonia ' + T.monotony.toFixed(2) + ' — allenamenti troppo uguali, varia gli stimoli' });
  else if (T.monotony > 1.5) alerts.push({ lvl: 'warn', t: 'Monotonia in salita', d: 'Monotonia ' + T.monotony.toFixed(2) + ' — inizia a diversificare i carichi' });
  else alerts.push({ lvl: 'ok', t: 'Varietà sana', d: 'Monotonia ' + T.monotony.toFixed(2) + ' — buona alternanza duro/facile' });
  // Debito sonno
  if (T.sleepDebtMin > 120) alerts.push({ lvl: (T.sleepDebtMin > 240 ? 'alert' : 'warn'), t: 'Debito di sonno', d: 'Accumulati ' + fmtSleep(T.sleepDebtMin) + ' — recupera ore nei prossimi giorni' });
  else alerts.push({ lvl: 'ok', t: 'Sonno in pari', d: 'Debito ' + fmtSleep(T.sleepDebtMin) + ' — sotto controllo' });
  // Ultima notte
  if (T.sleepMin < 420) alerts.push({ lvl: 'alert', t: 'Notte corta', d: 'Solo ' + fmtSleep(T.sleepMin) + ' stanotte — recupero compromesso oggi' });
  else alerts.push({ lvl: 'ok', t: 'Buona notte', d: fmtSleep(T.sleepMin) + ' · score ' + T.sleepScore });
  // HRV vs baseline
  if (T.hrv < B.hrv * 0.88) alerts.push({ lvl: 'alert', t: 'HRV sotto la norma', d: T.hrv + ' vs baseline ' + B.hrv + ' — segnale di stress/fatica' });
  else if (T.hrv < B.hrv * 0.95) alerts.push({ lvl: 'warn', t: 'HRV leggermente bassa', d: T.hrv + ' vs baseline ' + B.hrv });
  else alerts.push({ lvl: 'ok', t: 'HRV in linea', d: T.hrv + ' vs baseline ' + B.hrv });
  // RHR vs baseline
  if (T.rhr > B.rhr + 4) alerts.push({ lvl: 'warn', t: 'FC riposo elevata', d: T.rhr + ' vs baseline ' + B.rhr + ' — possibile stress/fatica' });
  else alerts.push({ lvl: 'ok', t: 'FC riposo ok', d: T.rhr + ' bpm vs baseline ' + B.rhr });

  var lvlColor = { ok: C.green, warn: C.amber, alert: C.red };

  // ── Sparkline SVG ──
  function Sparkline(props) {
    var vals = props.data, color = props.color, refs = props.refs || [];
    var pts = vals.map(function (v, i) { return { i: i, v: v }; }).filter(function (p) { return p.v != null; });
    var allv = pts.map(function (p) { return p.v; });
    var mn = props.min != null ? props.min : Math.min.apply(null, allv);
    var mx = props.max != null ? props.max : Math.max.apply(null, allv);
    if (mx === mn) mx = mn + 1;
    var W = 100, Hh = 100, pad = 6;
    function x(i) { return pad + (i / (vals.length - 1)) * (W - 2 * pad); }
    function y(v) { return Hh - pad - ((v - mn) / (mx - mn)) * (Hh - 2 * pad); }
    var d = pts.map(function (p, k) { return (k === 0 ? 'M' : 'L') + x(p.i).toFixed(1) + ' ' + y(p.v).toFixed(1); }).join(' ');
    var last = pts[pts.length - 1];
    return (
      <svg viewBox={'0 0 ' + W + ' ' + Hh} preserveAspectRatio="none" style={{ width: '100%', height: 90, display: 'block' }}>
        {refs.map(function (r, k) {
          return <line key={k} x1={pad} x2={W - pad} y1={y(r.v)} y2={y(r.v)} stroke={r.color || 'var(--line)'} strokeWidth="0.5" strokeDasharray="2 2" />;
        })}
        <path d={d} fill="none" stroke={color} strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" />
        <circle cx={x(last.i)} cy={y(last.v)} r="2.2" fill={color} />
      </svg>
    );
  }

  // ── Bar chart (sonno / carico) ──
  function Bars(props) {
    var vals = props.data, color = props.color, refs = props.refs || [];
    var allv = vals.filter(function (v) { return v != null; });
    var mx = props.max != null ? props.max : Math.max.apply(null, allv);
    return (
      <div style={{ position: 'relative', display: 'flex', alignItems: 'flex-end', gap: 2, height: 90 }}>
        {refs.map(function (r, k) {
          return <div key={k} style={{ position: 'absolute', left: 0, right: 0, bottom: (r.v / mx * 100) + '%', borderTop: '1px dashed ' + (r.color || 'var(--line)'), fontSize: 8, color: r.color || 'var(--fg-3)' }}>
            <span style={{ position: 'absolute', right: 0, top: -10 }}>{r.label}</span>
          </div>;
        })}
        {vals.map(function (v, i) {
          var h = v == null ? 0 : (v / mx * 100);
          var col = props.colorFn ? props.colorFn(v) : color;
          return <div key={i} style={{ flex: 1, height: h + '%', minHeight: v == null ? 0 : 2, background: col, opacity: v == null ? 0 : 0.85 }} title={v == null ? '' : v} />;
        })}
      </div>
    );
  }

  // ── Stat grande ──
  function BigStat(props) {
    var anim = useCountUp(props.v, 1100);
    return (
      <div style={{ border: '1px solid ' + (props.accent || 'var(--line)'), background: 'var(--bg-2)', padding: 18, textAlign: 'center' }}>
        <div style={{ fontSize: 10, color: 'var(--fg-3)', letterSpacing: '0.18em', marginBottom: 8 }}>// {props.code}</div>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 4 }}>
          <span className="display tabular" style={{ fontSize: 46, lineHeight: 1, color: props.color || 'var(--fg)' }}>{Math.round(anim)}</span>
          <span style={{ fontSize: 13, color: 'var(--fg-3)' }}>{props.u}</span>
        </div>
        <div style={{ fontSize: 10, color: 'var(--fg-3)', letterSpacing: '0.08em', marginTop: 6 }}>{props.sub}</div>
      </div>
    );
  }

  var hrvSeries = days.map(function (d) { return d.hrv; });
  var rhrSeries = days.map(function (d) { return d.rhr; });
  var sleepH = days.map(function (d) { return d.sleepMin != null ? +(d.sleepMin / 60).toFixed(2) : null; });
  var loadSeries = days.map(function (d) { return d.load; });
  var hrvDelta = T.hrv - B.hrv;
  var rhrDelta = T.rhr - B.rhr;

  return (
    <TelemetryChrome active="RECUPERO">
      {/* TITLE */}
      <div style={{ border: '1px solid var(--line)', background: 'var(--bg-2)', padding: 24, marginBottom: 12 }}>
        <div style={{ fontSize: 11, color: 'var(--fg-3)', letterSpacing: '0.18em', marginBottom: 8 }}>
          // RECOVERY · GARMIN · aggiornato {R.updated} · 30 giorni
        </div>
        <div className="display r-display-hero" style={{ fontSize: 'var(--display-hero)', lineHeight: 0.9 }}>
          RECO<span style={{ color: 'var(--accent)' }}>VERY.</span>
        </div>
        <div style={{ fontSize: 11, color: 'var(--fg-3)', letterSpacing: '0.1em', marginTop: 10 }}>
          HRV · FC a riposo · sonno · carico · readiness · si aggiorna in automatico ogni mattina alle 09:00
        </div>
      </div>

      {/* READINESS DEL GIORNO */}
      <div style={{ border: '1px solid ' + V.c, background: 'var(--bg-2)', padding: 20, marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ fontSize: 10, color: 'var(--fg-3)', letterSpacing: '0.18em', marginBottom: 6 }}>// READINESS · {T.date}</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
              <span className="display tabular" style={{ fontSize: 68, lineHeight: 0.9, color: V.c }}>{T.readiness}</span>
              <span style={{ fontFamily: 'var(--display)', fontSize: 22, fontWeight: 800, color: V.c, letterSpacing: '0.04em' }}>{V.label}</span>
            </div>
            <div style={{ fontSize: 11, color: 'var(--fg-3)', marginTop: 6 }}>TSB {T.tsb > 0 ? '+' : ''}{T.tsb} (freschezza) · CTL {T.ctl} (fitness)</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, minWidth: 260 }}>
            <div style={{ border: '1px solid var(--line)', padding: '10px 14px' }}>
              <div style={{ fontSize: 9, color: 'var(--fg-3)', letterSpacing: '0.14em' }}>HRV</div>
              <div className="display tabular" style={{ fontSize: 26 }}>{T.hrv}<span style={{ fontSize: 12, color: hrvDelta >= 0 ? C.green : C.red, marginLeft: 6 }}>{hrvDelta >= 0 ? '+' : ''}{hrvDelta}</span></div>
            </div>
            <div style={{ border: '1px solid var(--line)', padding: '10px 14px' }}>
              <div style={{ fontSize: 9, color: 'var(--fg-3)', letterSpacing: '0.14em' }}>FC RIPOSO</div>
              <div className="display tabular" style={{ fontSize: 26 }}>{T.rhr}<span style={{ fontSize: 12, color: rhrDelta <= 0 ? C.green : C.amber, marginLeft: 6 }}>{rhrDelta > 0 ? '+' : ''}{rhrDelta}</span></div>
            </div>
            <div style={{ border: '1px solid var(--line)', padding: '10px 14px' }}>
              <div style={{ fontSize: 9, color: 'var(--fg-3)', letterSpacing: '0.14em' }}>SONNO</div>
              <div className="display tabular" style={{ fontSize: 26 }}>{fmtSleep(T.sleepMin)}<span style={{ fontSize: 12, color: 'var(--fg-3)', marginLeft: 6 }}>{T.sleepScore}</span></div>
            </div>
            <div style={{ border: '1px solid var(--line)', padding: '10px 14px' }}>
              <div style={{ fontSize: 9, color: 'var(--fg-3)', letterSpacing: '0.14em' }}>RECOVERY</div>
              <div className="display tabular" style={{ fontSize: 26 }}>{T.recovery}<span style={{ fontSize: 12, color: 'var(--fg-3)', marginLeft: 4 }}>/100</span></div>
            </div>
          </div>
        </div>
      </div>

      {/* ALERT */}
      <ModulePanel code="MOD.ALERT" title="Segnali del giorno" sub="calcolati automaticamente dai dati di oggi">
        <div className="r-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
          {alerts.map(function (a, i) {
            var col = lvlColor[a.lvl];
            return (
              <div key={i} style={{ border: '1px solid ' + col, borderLeft: '4px solid ' + col, background: 'var(--bg)', padding: '10px 14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ width: 8, height: 8, borderRadius: 8, background: col, display: 'inline-block' }} />
                  <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--fg)' }}>{a.t}</span>
                </div>
                <div style={{ fontSize: 11, color: 'var(--fg-3)', marginTop: 5, lineHeight: 1.4 }}>{a.d}</div>
              </div>
            );
          })}
        </div>
      </ModulePanel>

      {/* TREND */}
      <div className="r-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <ModulePanel code="MOD.HRV" title="HRV · 30 giorni" sub={'oggi ' + T.hrv + ' ms · baseline ' + B.hrv}>
          <Sparkline data={hrvSeries} color={C.green} refs={[{ v: B.hrv, color: 'var(--fg-3)' }]} />
        </ModulePanel>
        <ModulePanel code="MOD.RHR" title="FC a riposo · 30 giorni" sub={'oggi ' + T.rhr + ' bpm · baseline ' + B.rhr}>
          <Sparkline data={rhrSeries} color={C.blue} refs={[{ v: B.rhr, color: 'var(--fg-3)' }]} />
        </ModulePanel>
        <ModulePanel code="MOD.SLEEP" title="Sonno · 30 giorni" sub="ore per notte · linee: 7h minimo · 8,8h fabbisogno">
          <Bars data={sleepH} max={9.5} colorFn={function (v) { return v == null ? 'var(--line)' : (v < 7 ? C.red : (v < 8 ? C.amber : C.green)); }}
            refs={[{ v: 7, color: C.amber, label: '7h' }, { v: 8.78, color: C.green, label: '8,8h' }]} />
        </ModulePanel>
        <ModulePanel code="MOD.LOAD" title="Carico giornaliero · 30 giorni" sub="training load (Foster) per giorno">
          <Bars data={loadSeries} color={C.purple} />
        </ModulePanel>
      </div>

      {/* PATTERN */}
      <ModulePanel code="MOD.PATTERN" title="Pattern trovati" sub="correlazioni sui tuoi ultimi 30 giorni" accent>
        <div className="r-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {R.patterns.map(function (p, i) {
            return (
              <div key={i} style={{ border: '1px solid var(--line)', background: 'var(--bg)', padding: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <span style={{ fontSize: 18 }}>{p.icon}</span>
                  <span style={{ fontFamily: 'var(--display)', fontSize: 15, fontWeight: 700, color: 'var(--accent)' }}>{p.title}</span>
                </div>
                <div style={{ fontSize: 12, color: 'var(--fg-2)', lineHeight: 1.5 }}>{p.text}</div>
              </div>
            );
          })}
        </div>
      </ModulePanel>

    </TelemetryChrome>
  );
}

window.RecuperoPage = RecuperoPage;
