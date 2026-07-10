// DASHBOARD — Telemetry style + responsive
function DashboardPage() {
  const { ATHLETE, STATIONS, VOLUME, VOL_ROWER, VOL_SKI, VOL_RUN, VOL_BIKE, TOTALS, PBS } = window.TRAINING;
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
        <BigStat code="VOL.TOT" v={Math.round(totalKmAnim)} u="km" sub={'row ' + Math.round(TOTALS.rower) + ' · ski ' + Math.round(TOTALS.ski) + ' · run ' + Math.round(TOTALS.run) + ' · bike ' + Math.round(TOTALS.bike)} sparkData={VOLUME} />
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
      </div>
      {/* Volume breakdown — stacked bar chart */}
      <ModulePanel code="MOD.VOLUME_BREAKDOWN · rower/ski/run/bike">
        {(() => {
          var colors = { rower: '#58ADF7', ski: '#6C68D7', run: '#39E75F', bike: '#FF6B9D' };
          var weeks = VOL_ROWER.length;
          var maxW = 0;
          for (var wi = 0; wi < weeks; wi++) {
            var tot = VOL_ROWER[wi] + VOL_SKI[wi] + VOL_RUN[wi] + VOL_BIKE[wi];
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
                  var r = VOL_ROWER[i], s = VOL_SKI[i], n = VOL_RUN[i], bk = VOL_BIKE[i];
                  var tot = r + s + n + bk;
                  var pct = maxW > 0 ? (tot / maxW) * 100 : 0;
                  var rPct = tot > 0 ? (r / tot) * 100 : 0;
                  var sPct = tot > 0 ? (s / tot) * 100 : 0;
                  var nPct = tot > 0 ? (n / tot) * 100 : 0;
                  var bPct = tot > 0 ? (bk / tot) * 100 : 0;
                  var isCurrent = i === weeks - 1;
                  var tip = 'S' + (i + 1) + ' · ' + tot.toFixed(1) + 'km\nRow ' + r.toFixed(1) + ' · Ski ' + s.toFixed(1) + ' · Run ' + n.toFixed(1) + ' · Bike ' + bk.toFixed(1);
                  return (
                    <div key={i} title={tip} style={{
                      flex: 1, height: pct + '%', display: 'flex', flexDirection: 'column',
                      border: 'none',
                      minWidth: 0, cursor: 'pointer',
                    }}>
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

window.DashboardPage = DashboardPage;
