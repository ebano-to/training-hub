// DASHBOARD — Telemetry style + responsive
function DashboardPage() {
  const { ATHLETE, STATIONS, VOLUME, VOL_ROWER, VOL_SKI, VOL_RUN, VOL_BIKE, VOL_SWIM, TOTALS, PBS } = window.TRAINING;
  const totalKm = TOTALS.total;
  const totalKmAnim = useCountUp(Math.round(totalKm), 1600);

  return (
    <TelemetryChrome active="DASHBOARD">
      {/* Title */}
      <div style={{ border: '1px solid var(--line)', background: 'var(--bg-2)', padding: 24, marginBottom: 12 }}>
        <div style={{ fontSize: 11, color: 'var(--fg-3)', letterSpacing: '0.18em', marginBottom: 8 }}>
          // METRICS_AGGREGATE · S{ATHLETE.programWeek} · {ATHLETE.programWeek} WEEKS TRACKED
        </div>
        <div className="display r-display-hero" style={{ fontSize: 'var(--display-hero)', lineHeight: 0.9 }}>
          DASH<span style={{ color: 'var(--accent)' }}>BOARD.</span>
        </div>
      </div>

      {/* Top stats */}
      <div className="r-grid r-grid-3" style={{ gap: 12, marginBottom: 12 }}>
        <BigStat code="VOL.TOT" v={Math.round(totalKmAnim)} u="km" sub={'row ' + Math.round(TOTALS.rower) + ' · ski ' + Math.round(TOTALS.ski) + ' · run ' + Math.round(TOTALS.run) + ' · bike ' + Math.round(TOTALS.bike) + ' · swim ' + Math.round(TOTALS.swim)} sparkData={VOLUME} />
        <BigStat code="SESS.TOT" v={window.TRAINING.HISTORY.length} u="" sub="ultimi workout registrati" />
        <BigStat code="PB.TESTS" v={'0' + PBS.length} u="" sub={PBS.map(p => p.station.split(' ')[0]).join(' · ')} highlight />
      </div>

      {/* Program weeks — tracked so far */}
      <ModulePanel code="MOD.PROGRAM · weeks_tracked" sub={'S1 → S' + ATHLETE.programWeek}>
        <div className="r-program-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(' + ATHLETE.programWeek + ', 1fr)', gap: 4 }}>
          {Array.from({ length: ATHLETE.programWeek }).map((_, i) => {
            const isCurrent = i === ATHLETE.programWeek - 1;
            return (
              <div key={i}>
                <div style={{
                  height: 40,
                  background: isCurrent ? 'transparent' : 'var(--accent)',
                  border: '1px solid var(--line)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <span className="display tabular" style={{ fontSize: 11, color: isCurrent ? 'var(--accent)' : '#000' }}>S{i + 1}</span>
                </div>
              </div>
            );
          })}
        </div>
      </ModulePanel>

      {/* Charts — 4 Volume + EF Trend */}
      <div className="r-charts" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
        <ChartCard code="MOD.VOL · total_km" data={VOLUME} unit="km" color="#FFFFFF" />
        <ChartCard code="MOD.VOL · skierg_km" data={VOL_SKI} unit="km" color="#6C68D7" />
        <ChartCard code="MOD.VOL · rower_km" data={VOL_ROWER} unit="km" color="#58ADF7" />
        <ChartCard code="MOD.VOL · run_km" data={VOL_RUN} unit="km" color="#39E75F" />
        <ChartCard code="MOD.VOL · bike_km" data={VOL_BIKE} unit="km" color="#FF6B9D" />
        <ChartCard code="MOD.VOL · nuoto_km" data={VOL_SWIM} unit="km" color="#00E5FF" min={0} max={Math.max(...VOL_SWIM) + 1} />
      </div>
      {/* Volume breakdown — stacked bar chart */}
      <ModulePanel code="MOD.VOLUME_BREAKDOWN · rower/ski/run/bike/swim">
        {(() => {
          var colors = { rower: '#58ADF7', ski: '#6C68D7', run: '#39E75F', bike: '#FF6B9D', swim: '#00E5FF' };
          var weeks = VOL_ROWER.length;
          var maxW = 0;
          for (var wi = 0; wi < weeks; wi++) {
            var tot = VOL_ROWER[wi] + VOL_SKI[wi] + VOL_RUN[wi] + VOL_BIKE[wi] + VOL_SWIM[wi];
            if (tot > maxW) maxW = tot;
          }
          return (
            <div>
              {/* Legend */}
              <div style={{ display: 'flex', gap: 20, marginBottom: 14, fontSize: 11, color: 'var(--fg-3)', letterSpacing: '0.1em', flexWrap: 'wrap' }}>
                {[
                  { l: 'ROWER', c: colors.rower, v: TOTALS.rower.toFixed(1) },
                  { l: 'SKIERG', c: colors.ski, v: TOTALS.ski.toFixed(1) },
                  { l: 'RUN', c: colors.run, v: TOTALS.run.toFixed(1) },
                  { l: 'BIKE', c: colors.bike, v: TOTALS.bike.toFixed(1) },
                  { l: 'NUOTO', c: colors.swim, v: TOTALS.swim.toFixed(1) },
                ].map(function(item) {
                  return (
                    <div key={item.l} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ width: 8, height: 8, background: item.c }} />
                      <span>{item.l}</span>
                      <span className="display tabular" style={{ color: 'var(--fg)', fontSize: 13 }}>{item.v}<span style={{ fontSize: 9, color: 'var(--fg-3)' }}> km</span></span>
                    </div>
                  );
                })}
              </div>
              {/* Bars */}
              <div style={{ display: 'flex', gap: 3, alignItems: 'flex-end', height: 180, position: 'relative' }}>
                {VOL_ROWER.map(function(_, i) {
                  var r = VOL_ROWER[i], s = VOL_SKI[i], n = VOL_RUN[i], bk = VOL_BIKE[i], sw = VOL_SWIM[i];
                  var tot = r + s + n + bk + sw;
                  var pct = maxW > 0 ? (tot / maxW) * 100 : 0;
                  var rPct = tot > 0 ? (r / tot) * 100 : 0;
                  var sPct = tot > 0 ? (s / tot) * 100 : 0;
                  var nPct = tot > 0 ? (n / tot) * 100 : 0;
                  var bPct = tot > 0 ? (bk / tot) * 100 : 0;
                  var swPct = tot > 0 ? (sw / tot) * 100 : 0;
                  var isCurrent = i === weeks - 1;
                  var tip = 'S' + (i + 1) + ' · ' + tot.toFixed(1) + 'km\nRow ' + r.toFixed(1) + ' · Ski ' + s.toFixed(1) + ' · Run ' + n.toFixed(1) + ' · Bike ' + bk.toFixed(1) + (sw > 0 ? ' · Nuoto ' + sw.toFixed(1) : '');
                  return (
                    <div key={i} title={tip} style={{
                      flex: 1, height: pct + '%', display: 'flex', flexDirection: 'column',
                      border: 'none',
                      minWidth: 0, cursor: 'pointer',
                    }}>
                      <div style={{ height: swPct + '%', background: colors.swim, minHeight: sw > 0 ? 2 : 0 }} />
                      <div style={{ height: bPct + '%', background: colors.bike, minHeight: bk > 0 ? 2 : 0 }} />
                      <div style={{ height: nPct + '%', background: colors.run, minHeight: n > 0 ? 2 : 0 }} />
                      <div style={{ height: sPct + '%', background: colors.ski, minHeight: s > 0 ? 2 : 0 }} />
                      <div style={{ height: rPct + '%', background: colors.rower, minHeight: r > 0 ? 2 : 0 }} />
                    </div>
                  );
                })}
              </div>
              {/* Week labels */}
              <div style={{ display: 'flex', gap: 3, marginTop: 6, fontSize: 9, color: 'var(--fg-3)' }}>
                {VOL_ROWER.map(function(_, i) {
                  return <div key={i} style={{ flex: 1, textAlign: 'center', letterSpacing: '0.05em' }}>{i === 0 ? 'S1' : i === weeks - 1 ? 'S' + weeks : ''}</div>;
                })}
              </div>
            </div>
          );
        })()}
      </ModulePanel>


      {/* Storico gare Hyrox */}
      <HyroxRaces />

      {/* Personal Bests & 1RMs */}
      <ModulePanel code="MOD.PERSONAL_BESTS · 1RM + erg tests" accent>
        <div className="r-grid r-grid-3" style={{ gap: 8 }}>
          {PBS.map(function(pb) {
            return (
              <div key={pb.station} style={{
                border: '1px solid var(--line)', background: 'var(--bg-3)', padding: 16,
              }}>
                <div style={{ fontSize: 10, color: 'var(--accent)', letterSpacing: '0.15em', marginBottom: 8 }}>{pb.station}</div>
                <div className="display tabular" style={{ fontSize: 32, lineHeight: 1 }}>{pb.value}</div>
                {pb.sub && <div style={{ fontSize: 10, color: 'var(--fg-3)', marginTop: 4, letterSpacing: '0.08em', opacity: 0.7 }}>{pb.sub}</div>}
                <div style={{ fontSize: 10, color: 'var(--fg-3)', marginTop: pb.sub ? 2 : 6, letterSpacing: '0.1em' }}>{pb.date}{pb.delta ? ' · ' + pb.delta : ''}</div>
              </div>
            );
          })}
        </div>
      </ModulePanel>

      {/* Body comp / athlete stats */}
      <div className="r-grid r-grid-3" style={{ gap: 12 }}>
        {[
          { code: 'BODY.WEIGHT', v: ATHLETE.weight, u: 'kg', sub: 'peso attuale' },
          { code: 'HEIGHT', v: ATHLETE.height, u: 'cm', sub: 'altezza' },
          { code: 'FCMAX', v: ATHLETE.hrmax, u: 'bpm', sub: 'frequenza cardiaca massima' },
        ].map((s) => (
          <ModulePanel key={s.code} code={s.code}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
              <span className="display tabular" style={{ fontSize: 48 }}>{s.v}</span>
              <span style={{ fontSize: 12, color: 'var(--fg-3)' }}>{s.u}</span>
            </div>
            <div style={{ fontSize: 11, color: 'var(--accent-2)', letterSpacing: '0.1em', marginTop: 6 }}>{s.sub}</div>
          </ModulePanel>
        ))}
      </div>
    </TelemetryChrome>
  );
}

function parseTime3(t) {
  if (t.includes('kg')) return 1;
  const [m, s] = t.split(':').map(Number);
  return m * 60 + s;
}

function BigStat({ code, v, u, sub, sparkData, highlight }) {
  const num = parseFloat(v);
  const animated = useCountUp(isNaN(num) ? 0 : num, 1400);
  const display = isNaN(num) ? v : (String(v).includes('.') ? animated.toFixed(2) : Math.round(animated));
  return (
    <div style={{
      border: '1px solid ' + (highlight ? 'var(--accent)' : 'var(--line)'),
      background: highlight ? 'oklch(88% 0.20 130 / 0.06)' : 'var(--bg-2)',
      padding: 18
    }}>
      <div style={{ fontSize: 11, color: highlight ? 'var(--accent)' : 'var(--fg-3)', letterSpacing: '0.18em', marginBottom: 10 }}>// {code}</div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
        <span className="display tabular" style={{ fontSize: 48, color: highlight ? 'var(--accent)' : 'var(--fg)', lineHeight: 1 }}>{display}</span>
        <span style={{ fontSize: 12, color: 'var(--fg-3)' }}>{u}</span>
      </div>
      {sparkData && <div style={{ marginTop: 8 }}><Sparkline data={sparkData} width={220} height={24} /></div>}
      <div style={{ fontSize: 10, color: 'var(--accent-2)', letterSpacing: '0.1em', marginTop: 8 }}>{sub}</div>
    </div>
  );
}

function ChartCard({ code, data, unit, min, max, color }) {
  var c = color || 'var(--accent)';
  const lo = min !== undefined ? min : Math.min(...data) - 4;
  const hi = max !== undefined ? max : Math.max(...data) + 4;
  const w = 520, h = 160;
  const stepX = w / (data.length - 1);
  const norm = (v) => h - ((v - lo) / (hi - lo)) * h;
  const path = 'M' + data.map((v, i) => i * stepX + ',' + norm(v)).join(' L');
  const area = path + ' L' + w + ',' + h + ' L0,' + h + ' Z';
  const id = code.replace(/\W/g, '');
  var total = data.reduce(function(a, b) { return a + b; }, 0);
  return (
    <ModulePanel code={code}>
      <svg viewBox={'0 0 ' + w + ' ' + h} width="100%" height={h} style={{ display: 'block' }}>
        <defs>
          <pattern id={'grid-' + id} width="40" height="32" patternUnits="userSpaceOnUse">
            <path d="M40 0H0V32" fill="none" stroke="var(--line)" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width={w} height={h} fill={'url(#grid-' + id + ')'} />
        <path d={area} fill={c} opacity="0.12" />
        <path d={path} stroke={c} strokeWidth="2" fill="none" />
        {data.map((v, i) => (
          <circle key={i} cx={i * stepX} cy={norm(v)} r={i === data.length - 1 ? 4 : 2}
            fill={i === data.length - 1 ? c : 'var(--fg)'} style={{ cursor: 'pointer' }}>
            <title>{'S' + (i + 1) + ': ' + (typeof v === 'number' ? (Number.isInteger(v) ? v : v.toFixed(1)) : v) + unit}</title>
          </circle>
        ))}
      </svg>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10, fontSize: 10, color: 'var(--fg-3)', letterSpacing: '0.1em' }}>
        <span>W1</span>
        <span>TOT {Math.round(total)}{unit} · LAST {typeof data[data.length - 1] === 'number' ? (Number.isInteger(data[data.length - 1]) ? data[data.length - 1] : data[data.length - 1].toFixed(1)) : data[data.length - 1]}{unit}</span>
        <span>W{data.length}</span>
      </div>
    </ModulePanel>
  );
}

// ── STORICO GARE HYROX — cronologico per formato · dati ufficiali results.hyrox.com
function HyroxRaces() {
  var RACES = window.TRAINING.RACES;
  if (!RACES || !RACES.length) return null;
  var FMT = {
    single: { label: 'SINGLES', c: '#FFB454' },
    doubles: { label: 'DOUBLES OPEN', c: '#39E75F' },
    doublesPro: { label: 'DOUBLES PRO', c: '#6C68D7' },
  };
  function secs(t) { var p = String(t).split(':').map(Number); return p.length === 3 ? p[0] * 3600 + p[1] * 60 + p[2] : p[0] * 60 + p[1]; }
  function mmss(sec) {
    var s = Math.abs(sec), m = Math.floor(s / 60), r = s % 60;
    return (sec < 0 ? '−' : sec > 0 ? '+' : '±') + m + ':' + (r < 10 ? '0' : '') + r;
  }
  var prev = {};
  var rows = RACES.map(function (r) {
    var d = prev[r.fmt] !== undefined ? r.t - prev[r.fmt] : null;
    prev[r.fmt] = r.t;
    return { r: r, delta: d };
  });
  var maxT = Math.max.apply(null, RACES.map(function (r) { return r.t; }));
  var th = { fontSize: 10, color: 'var(--fg-3)', letterSpacing: '0.12em', textAlign: 'left', padding: '8px 10px', borderBottom: '1px solid var(--line)', whiteSpace: 'nowrap' };
  var td = { fontSize: 12, padding: '10px', borderBottom: '1px solid var(--line)', whiteSpace: 'nowrap' };
  function stTot(r) { if (!r.st) return null; return Object.keys(r.st).reduce(function (a, k) { return a + secs(r.st[k]); }, 0); }
  function fmt(sec) { if (sec === null || sec === undefined) return '\u2014'; var m = Math.floor(sec / 60), x = sec % 60; return m + ':' + (x < 10 ? '0' : '') + x; }
  var LAB = [['ski', 'SkiErg 1000 m'], ['push', 'Sled Push 50 m'], ['pull', 'Sled Pull 50 m'], ['bbj', 'Burpee BJ 80 m'], ['row', 'Row 1000 m'], ['fc', 'Farmers 200 m'], ['lun', 'Lunges 100 m'], ['wb', 'Wall Balls 100']];

  function Serie(props) {
    var a = props.races;
    if (a.length < 2) return null;
    var first = a[0], last = a[a.length - 1];
    return (
      <ModulePanel code={props.code} title={props.title} sub={props.sub}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr>
              <th style={th}>SEGMENTO</th>
              {a.map(function (r) { return <th key={r.id} style={th}>{r.city.toUpperCase() + ' ' + r.d.slice(-4)}</th>; })}
              <th style={th}>{'Δ PRIMA → ULTIMA'}</th>
            </tr></thead>
            <tbody>
              <tr>
                <td style={Object.assign({}, td, { fontWeight: 700 })}>TOTALE</td>
                {a.map(function (r) { return <td key={r.id} style={Object.assign({}, td, { fontWeight: 700 })} className="display tabular">{r.time}</td>; })}
                <td style={Object.assign({}, td, { fontWeight: 700, color: (last.t - first.t) < 0 ? '#39E75F' : '#FF6B6B' })} className="tabular">{mmss(last.t - first.t)}</td>
              </tr>
              <tr>
                <td style={Object.assign({}, td, { color: 'var(--fg-3)', fontSize: 11 })}>Piazzamento giornata</td>
                {a.map(function (r) { return <td key={r.id} style={Object.assign({}, td, { fontSize: 11, color: 'var(--fg-2)' })}>{r.rank || '—'}</td>; })}
                <td style={Object.assign({}, td, { color: 'var(--fg-3)' })}>{'—'}</td>
              </tr>
              <tr>
                <td style={td}>Run total</td>
                {a.map(function (r) { return <td key={r.id} style={td} className="tabular">{r.runTot + ' '}<span style={{ color: 'var(--fg-3)', fontSize: 10 }}>{'(' + r.runTotR + '°)'}</span></td>; })}
                <td style={Object.assign({}, td, { color: (last.runTotS - first.runTotS) < 0 ? '#39E75F' : '#FF6B6B' })} className="tabular">{mmss(last.runTotS - first.runTotS)}</td>
              </tr>
              <tr>
                <td style={Object.assign({}, td, { fontWeight: 700 })}>Stazioni (totale)</td>
                {a.map(function (r) { return <td key={r.id} style={Object.assign({}, td, { fontWeight: 700 })} className="tabular">{fmt(stTot(r))}</td>; })}
                <td style={Object.assign({}, td, { fontWeight: 700, color: (stTot(last) - stTot(first)) < 0 ? '#39E75F' : '#FF6B6B' })} className="tabular">{mmss(stTot(last) - stTot(first))}</td>
              </tr>
              <tr>
                <td style={td}>Roxzone</td>
                {a.map(function (r) { return <td key={r.id} style={td} className="tabular">{r.rox || '—'}</td>; })}
                <td style={Object.assign({}, td, { color: (last.roxS - first.roxS) < 0 ? '#39E75F' : '#FF6B6B' })} className="tabular">{mmss(last.roxS - first.roxS)}</td>
              </tr>
              {LAB.map(function (L) {
                var d = secs(last.st[L[0]]) - secs(first.st[L[0]]);
                return (
                  <tr key={L[0]}>
                    <td style={td}>{L[1]}</td>
                    {a.map(function (r) {
                      return <td key={r.id} style={td} className="tabular">{r.st[L[0]] + ' '}<span style={{ color: 'var(--fg-3)', fontSize: 10 }}>{'(' + r.stR[L[0]] + '°)'}</span></td>;
                    })}
                    <td style={Object.assign({}, td, { color: d === 0 ? 'var(--fg-3)' : (d < 0 ? '#39E75F' : '#FF6B6B') })} className="tabular">{mmss(d)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div style={{ fontSize: 11, color: 'var(--fg-3)', marginTop: 14, lineHeight: 1.7, whiteSpace: 'pre-line' }}>{props.read}</div>
        </div>
      </ModulePanel>
    );
  }

  var armando = RACES.filter(function (r) { return r.fmt === 'doubles' && r.partner === 'Armando Tronca' && !r.noSplit; });
  var singoli = RACES.filter(function (r) { return r.fmt === 'single' && !r.noSplit; });

  return (
    <div>
      <ModulePanel code={'MOD.HYROX · storico_gare · ' + RACES.length + ' gare'} title="GARE HYROX" sub={'Dieci gare dal debutto di Torino, febbraio 2024, a oggi · tempi e piazzamenti ufficiali da results.hyrox.com · i tre formati NON sono confrontabili fra loro: ogni delta è calcolato solo contro la gara precedente dello stesso formato'} accent>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(' + RACES.length + ', 1fr)', gap: 6, alignItems: 'end', height: 200, marginBottom: 18 }}>
          {rows.map(function (x) {
            var r = x.r, f = FMT[r.fmt];
            var h = Math.round((r.t / maxT) * 130);
            return (
              <a key={r.id} href={r.href || 'storico.html'} style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', height: '100%' }}>
                <div className="display tabular" style={{ fontSize: 12, color: f.c, marginBottom: 5, textAlign: 'center' }}>{r.time}</div>
                {x.delta !== null && (
                  <div className="tabular" style={{ fontSize: 10, color: x.delta < 0 ? '#39E75F' : '#FF6B6B', marginBottom: 4, textAlign: 'center' }}>{mmss(x.delta)}</div>
                )}
                <div style={{ height: h, background: f.c, opacity: 0.85, border: '1px solid var(--line)' }} />
                <div style={{ fontSize: 10, color: 'var(--fg-3)', marginTop: 6, textAlign: 'center', letterSpacing: '0.04em' }}>{r.city.toUpperCase()}</div>
                <div style={{ fontSize: 9, color: 'var(--fg-3)', textAlign: 'center' }}>{r.d}</div>
              </a>
            );
          })}
        </div>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 14 }}>
          {Object.keys(FMT).map(function (k) {
            return (
              <span key={k} style={{ fontSize: 10, color: 'var(--fg-3)', letterSpacing: '0.1em', display: 'flex', alignItems: 'center', gap: 6 }}>
                <i style={{ width: 10, height: 10, background: FMT[k].c, display: 'inline-block' }} />{FMT[k].label}
              </span>
            );
          })}
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr>
              {['DATA', 'GARA', 'FORMATO', 'TEMPO', 'Δ STESSO FORMATO', 'GIORNATA', 'EVENTO', 'RUN TOT', 'STAZIONI', 'ROXZONE', 'FC MED'].map(function (h, i) {
                return <th key={i} style={th}>{h}</th>;
              })}
            </tr></thead>
            <tbody>
              {rows.map(function (x) {
                var r = x.r, f = FMT[r.fmt];
                return (
                  <tr key={r.id}>
                    <td style={td} className="tabular">{r.d}</td>
                    <td style={td}>
                      {r.href ? <a href={r.href} style={{ color: 'var(--accent)' }}>{r.city}</a> : r.city}
                      {r.partner && <span style={{ color: 'var(--fg-3)' }}>{' · ' + r.partner.split(' ')[0]}</span>}
                    </td>
                    <td style={Object.assign({}, td, { color: f.c, fontSize: 10, letterSpacing: '0.1em' })}>{f.label}</td>
                    <td style={Object.assign({}, td, { fontWeight: 700 })} className="display tabular">{r.time}</td>
                    <td style={Object.assign({}, td, { color: x.delta === null ? 'var(--fg-3)' : (x.delta < 0 ? '#39E75F' : '#FF6B6B') })} className="tabular">{x.delta === null ? '— prima del formato' : mmss(x.delta)}</td>
                    <td style={Object.assign({}, td, { fontSize: 11 })}>{r.rank || '—'}</td>
                    <td style={Object.assign({}, td, { fontSize: 11, color: 'var(--fg-3)' })}>{r.rankO || '—'}</td>
                    <td style={td} className="tabular">{r.runTot || '\u2014'}</td>
                    <td style={Object.assign({}, td, { fontWeight: 700 })} className="tabular">{fmt(stTot(r))}</td>
                    <td style={td} className="tabular">{r.rox || '—'}</td>
                    <td style={td} className="tabular">{r.hrMed || '—'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div style={{ fontSize: 10, color: 'var(--fg-3)', marginTop: 12, lineHeight: 1.7, borderTop: '1px solid var(--line)', paddingTop: 10 }}>
          {'GIORNATA = piazzamento nella propria divisione il giorno di gara · EVENTO = piazzamento sull\'intera manifestazione, quando dura più giorni. Sono due numeri diversi e non vanno mescolati.\nI tempi di stazione dei doubles sono DI COPPIA: misurano la squadra, non il singolo.'}
        </div>
      </ModulePanel>

      <Serie races={armando}
        code="MOD.HYROX · doubles_open_armando"
        title="LA LINEA PULITA: DOUBLES OPEN CON ARMANDO"
        sub={'Stessa categoria, stesso partner, stesse stazioni divise — le tre gare confrontabili una a una. Fra parentesi il piazzamento di segmento nella giornata.'}
        read={'In un anno il totale scende di 4:50, ma tutto il guadagno viene dalla CORSA: 5:11 tolti al run total, da 38:52 a 33:41, con il piazzamento di corsa che passa da 364° a 47°.\nLe stazioni nel complesso sono andate indietro: Sled Push +0:21, Sled Pull +0:39, Burpee BJ +0:19, Wall Balls +0:13.\nIl totale stazioni lo dice senza appello: 23:14 a Roma 2025, 22:35 a Bologna, 24:53 a Roma 2026 — un minuto e 39 secondi in più sugli attrezzi, mentre la corsa ne guadagnava cinque.\nBologna resta la gara meglio eseguita sulle stazioni (sei su otto dentro i primi 70, Row 22°); Roma 2026 la migliore di corsa e l\'unica col podio di categoria.'} />

      <Serie races={singoli}
        code="MOD.HYROX · singles"
        title="I SINGOLI"
        sub={'Cinque gare in singolo, ma solo quattro hanno gli split pubblicati. Qui i tempi di stazione sono suoi al 100%, ed è il confronto che dice davvero come sta la forza.'}
        read={'Cinque gare in singolo, dal 1:24:24 di Torino 2025 al 1:18:33 di Torino 2026: 5:51 tolti in un anno.\nIl totale stazioni racconta la storia meglio del tempo finale: 33:51 a Parigi, 33:46 a Rimini, poi 31:46 a Verona e 32:47 a Torino 2026. Il guadagno è tutto lì — il run total resta inchiodato fra 39:30 e 40:24 in tutte e quattro le gare cronometrate.\nIl balzo vero è Rimini→Verona (−3:22): Burpee BJ −1:04 e Lunges −1:08, con la corsa quasi ferma (−54″). Poi Verona→Torino riperde 49″ con le corse identiche (39:30 contro 39:32), tutto sugli attrezzi: Sled Pull +24″ e Wall Balls +16″.\nI Wall Balls sono il trend peggiore: 4:56 → 5:12 → 5:27 → 5:43, quarantasette secondi persi gara dopo gara.\nIl Sled Push non si muove da due anni: 3:16, 3:13, 3:11, 3:12 — e il 1185° posto di Parigi è il piazzamento peggiore di tutta la carriera.\nTorino 01/02/2025 non compare in tabella: results.hyrox.com non pubblica più l\'archivio di quella tappa, restano tempo e piazzamento dall\'app ufficiale.'} />
    </div>
  );
}

window.DashboardPage = DashboardPage;
