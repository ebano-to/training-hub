// HYDRATION LOG — Sweat rate tracking & rehydration targets
function HydrationPage() {
  var H = window.TRAINING.HYDRATION;
  var ATHLETE = window.TRAINING.ATHLETE;

  // ── Aggregates ──
  var totalSessions = H.length;
  var totalSweat = H.reduce(function(s, h) { return s + h.sweatTotal; }, 0);
  var avgSweatRate = Math.round(H.reduce(function(s, h) { return s + h.sweatRate; }, 0) / totalSessions);
  var totalRehydNeeded = H.reduce(function(s, h) { return s + h.rehydRemaining; }, 0);

  // ── Group by type ──
  var byType = {};
  H.forEach(function(h) {
    if (!byType[h.type]) byType[h.type] = { entries: [], totalSweat: 0, totalRate: 0 };
    byType[h.type].entries.push(h);
    byType[h.type].totalSweat += h.sweatTotal;
    byType[h.type].totalRate += h.sweatRate;
  });
  var typeKeys = Object.keys(byType);
  var typeColors = {
    'run': '#39E75F',
    'row': '#58ADF7',
    'ski': '#6C68D7',
    'run+row': '#FFB84D',
    'bike': '#FF6B9D',
    'hyrox': '#FF4444'
  };

  // ── Max sweat rate for bar scaling ──
  var maxRate = Math.max.apply(null, H.map(function(h) { return h.sweatRate; }));

  // ── Stat card ──
  function StatCard(props) {
    var anim = useCountUp(props.v, 1200);
    var display = props.decimal ? anim.toFixed(2) : Math.round(anim);
    return (
      <div style={{
        border: '1px solid ' + (props.accent ? 'var(--accent)' : 'var(--line)'),
        background: props.accent ? 'oklch(88% 0.20 200 / 0.06)' : 'var(--bg-2)',
        padding: 18
      }}>
        <div style={{ fontSize: 11, color: props.accent ? 'var(--accent)' : 'var(--fg-3)', letterSpacing: '0.18em', marginBottom: 10 }}>// {props.code}</div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
          <span className="display tabular" style={{ fontSize: 48, color: props.accent ? 'var(--accent)' : 'var(--fg)', lineHeight: 1 }}>{display}</span>
          <span style={{ fontSize: 14, color: 'var(--fg-3)' }}>{props.u}</span>
        </div>
        <div style={{ fontSize: 10, color: 'var(--accent-2)', letterSpacing: '0.1em', marginTop: 8 }}>{props.sub}</div>
      </div>
    );
  }

  // ── Table row ──
  function Row(props) {
    var h = props.h;
    var color = typeColors[h.type] || 'var(--fg)';
    return (
      <tr style={{ borderBottom: '1px solid var(--line)' }}>
        <td style={{ padding: '10px 8px', fontSize: 13, fontFamily: 'var(--mono)', whiteSpace: 'nowrap' }}>{h.label}</td>
        <td style={{ padding: '10px 8px' }}>
          <span style={{
            display: 'inline-block', padding: '2px 8px', fontSize: 10, letterSpacing: '0.12em',
            border: '1px solid ' + color, color: color, fontFamily: 'var(--mono)', textTransform: 'uppercase'
          }}>{h.type}</span>
        </td>
        <td style={{ padding: '10px 8px', fontSize: 12, color: 'var(--fg-2)' }}>{h.workout}</td>
        <td style={{ padding: '10px 8px', fontSize: 13, fontFamily: 'var(--mono)', textAlign: 'right' }}>{h.duration}'</td>
        <td style={{ padding: '10px 8px', fontSize: 13, fontFamily: 'var(--mono)', textAlign: 'right' }}>{h.weightPre.toFixed(1)}</td>
        <td style={{ padding: '10px 8px', fontSize: 13, fontFamily: 'var(--mono)', textAlign: 'right' }}>{h.weightPost.toFixed(1)}</td>
        <td style={{ padding: '10px 8px', fontSize: 13, fontFamily: 'var(--mono)', textAlign: 'right', color: 'var(--fg-3)' }}>{h.fluidIn}</td>
        <td style={{ padding: '10px 8px', fontFamily: 'var(--mono)', textAlign: 'right' }}>
          <span className="display tabular" style={{ fontSize: 15, color: 'var(--accent)' }}>{(h.sweatTotal / 1000).toFixed(2)}</span>
        </td>
        <td style={{ padding: '10px 8px', fontFamily: 'var(--mono)', textAlign: 'right' }}>
          <span className="display tabular" style={{ fontSize: 15 }}>{(h.sweatRate / 1000).toFixed(2)}</span>
        </td>
        <td style={{ padding: '10px 8px', fontFamily: 'var(--mono)', textAlign: 'right', color: '#58ADF7' }}>
          <span className="display tabular" style={{ fontSize: 15 }}>{(h.rehydRemaining / 1000).toFixed(2)}</span>
        </td>
      </tr>
    );
  }

  return (
    <TelemetryChrome active="HYDRATION">
      {/* ── TITLE ── */}
      <div style={{ border: '1px solid var(--line)', background: 'var(--bg-2)', padding: 24, marginBottom: 12 }}>
        <div style={{ fontSize: 11, color: 'var(--fg-3)', letterSpacing: '0.18em', marginBottom: 8 }}>
          // SWEAT_TRACKING · S{ATHLETE.programWeek} · {totalSessions} SESSIONS LOGGED
        </div>
        <div className="display r-display-hero" style={{ fontSize: 'var(--display-hero)', lineHeight: 0.9 }}>
          HYDRA<span style={{ color: 'var(--accent)' }}>TION.</span>
        </div>
        <div style={{ fontSize: 11, color: 'var(--fg-3)', letterSpacing: '0.1em', marginTop: 10 }}>
          Formula: sudorazione = (peso_pre − peso_post) + liquidi_assunti · reintegro = 150% sudorazione − già bevuti
        </div>
      </div>

      {/* ── TOP STATS ── */}
      <div className="r-grid r-grid-3" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 12 }}>
        <StatCard code="SESSIONS" v={totalSessions} u="" sub={'dal ' + H[0].label + ' al ' + H[H.length - 1].label} />
        <StatCard code="AVG.SWEAT_RATE" v={(avgSweatRate / 1000)} u="L/h" sub="media tutte le sessioni" decimal accent />
        <StatCard code="TOT.FLUID_LOST" v={(totalSweat / 1000)} u="L" sub="sudorazione totale cumulata" decimal />
      </div>

      {/* ── SESSION LOG TABLE ── */}
      <ModulePanel code="MOD.SESSION_LOG" title="Log Sessioni" sub={totalSessions + ' misurazioni registrate'}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--mono)', fontSize: 12 }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--accent)' }}>
                {['DATA', 'TIPO', 'WORKOUT', 'DUR', 'PRE kg', 'POST kg', 'BEVUTI ml', 'SUDORE L', 'RATE L/h', 'REINTEGRO L'].map(function(h) {
                  var align = ['DATA', 'TIPO', 'WORKOUT'].indexOf(h) >= 0 ? 'left' : 'right';
                  return (
                    <th key={h} style={{
                      padding: '8px 8px', textAlign: align, fontSize: 10,
                      letterSpacing: '0.15em', color: 'var(--fg-3)', fontWeight: 600
                    }}>{h}</th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {H.map(function(h, i) { return <Row key={i} h={h} />; })}
            </tbody>
            {/* ── TOTALS ROW ── */}
            <tfoot>
              <tr style={{ borderTop: '2px solid var(--line)' }}>
                <td colSpan="3" style={{ padding: '10px 8px', fontSize: 11, letterSpacing: '0.12em', color: 'var(--fg-3)' }}>MEDIA / TOTALE</td>
                <td style={{ padding: '10px 8px', fontSize: 13, fontFamily: 'var(--mono)', textAlign: 'right', color: 'var(--fg-3)' }}>
                  {Math.round(H.reduce(function(s, h) { return s + h.duration; }, 0) / totalSessions)}'
                </td>
                <td style={{ padding: '10px 8px', textAlign: 'right', color: 'var(--fg-3)' }}>—</td>
                <td style={{ padding: '10px 8px', textAlign: 'right', color: 'var(--fg-3)' }}>—</td>
                <td style={{ padding: '10px 8px', fontSize: 13, fontFamily: 'var(--mono)', textAlign: 'right', color: 'var(--fg-3)' }}>
                  {Math.round(H.reduce(function(s, h) { return s + h.fluidIn; }, 0))}
                </td>
                <td style={{ padding: '10px 8px', fontFamily: 'var(--mono)', textAlign: 'right' }}>
                  <span className="display tabular" style={{ fontSize: 15, color: 'var(--accent)' }}>{(totalSweat / 1000).toFixed(2)}</span>
                </td>
                <td style={{ padding: '10px 8px', fontFamily: 'var(--mono)', textAlign: 'right' }}>
                  <span className="display tabular" style={{ fontSize: 15 }}>{(avgSweatRate / 1000).toFixed(2)}</span>
                </td>
                <td style={{ padding: '10px 8px', fontFamily: 'var(--mono)', textAlign: 'right', color: '#58ADF7' }}>
                  <span className="display tabular" style={{ fontSize: 15 }}>{(totalRehydNeeded / 1000).toFixed(2)}</span>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </ModulePanel>

      {/* ── SWEAT RATE COMPARISON — horizontal bars ── */}
      <ModulePanel code="MOD.SWEAT_RATE" title="Sweat Rate per Sessione" sub="L/h · barre proporzionali al massimo registrato">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {H.map(function(h, i) {
            var pct = (h.sweatRate / maxRate) * 100;
            var color = typeColors[h.type] || 'var(--accent)';
            return (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: 11, letterSpacing: '0.08em' }}>
                  <span style={{ color: 'var(--fg-2)' }}>{h.label} · <span style={{ color: color }}>{h.type.toUpperCase()}</span> · {h.duration}'</span>
                  <span className="display tabular" style={{ fontSize: 15 }}>{(h.sweatRate / 1000).toFixed(2)} <span style={{ fontSize: 10, color: 'var(--fg-3)' }}>L/h</span></span>
                </div>
                <div style={{ height: 20, background: 'var(--bg)', border: '1px solid var(--line)', position: 'relative' }}>
                  <div style={{
                    height: '100%', width: pct + '%',
                    background: 'linear-gradient(90deg, ' + color + '33, ' + color + ')',
                    transition: 'width 1s ease'
                  }} />
                  {h.outdoor && (
                    <span style={{ position: 'absolute', right: 6, top: 2, fontSize: 9, color: 'var(--fg-3)', letterSpacing: '0.1em' }}>OUTDOOR</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </ModulePanel>

      {/* ── AVERAGES BY TYPE ── */}
      <ModulePanel code="MOD.TYPE_BREAKDOWN" title="Medie per Tipo" sub="sweat rate medio e sudorazione totale per disciplina" accent>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(' + typeKeys.length + ', 1fr)', gap: 12 }}>
          {typeKeys.map(function(type) {
            var group = byType[type];
            var avgRate = Math.round(group.totalRate / group.entries.length);
            var color = typeColors[type] || 'var(--fg)';
            var totalL = (group.totalSweat / 1000).toFixed(2);
            return (
              <div key={type} style={{
                border: '1px solid ' + color,
                background: 'var(--bg)',
                padding: 16,
                textAlign: 'center'
              }}>
                <div style={{ fontSize: 10, letterSpacing: '0.18em', color: color, marginBottom: 10, textTransform: 'uppercase' }}>{type}</div>
                <div className="display tabular" style={{ fontSize: 36, lineHeight: 1, color: 'var(--fg)' }}>{(avgRate / 1000).toFixed(2)}</div>
                <div style={{ fontSize: 11, color: 'var(--fg-3)', marginTop: 4 }}>L/h avg</div>
                <div style={{ marginTop: 12, paddingTop: 10, borderTop: '1px solid var(--line)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--fg-3)', letterSpacing: '0.08em' }}>
                    <span>SESSIONI</span>
                    <span className="display tabular" style={{ color: 'var(--fg)', fontSize: 13 }}>{group.entries.length}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--fg-3)', letterSpacing: '0.08em', marginTop: 4 }}>
                    <span>TOTALE</span>
                    <span className="display tabular" style={{ color: 'var(--fg)', fontSize: 13 }}>{totalL} L</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </ModulePanel>

      {/* ── WEIGHT DELTA CHART ── */}
      <ModulePanel code="MOD.WEIGHT_DELTA" title="Delta Peso" sub="variazione peso pre→post per sessione (kg persi)">
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 16, height: 120, padding: '0 8px' }}>
          {H.map(function(h, i) {
            var delta = h.weightPre - h.weightPost;
            var maxDelta = Math.max.apply(null, H.map(function(x) { return x.weightPre - x.weightPost; }));
            var pct = (delta / maxDelta) * 100;
            var color = typeColors[h.type] || 'var(--accent)';
            return (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <span className="display tabular" style={{ fontSize: 14, marginBottom: 4, color: color }}>{delta.toFixed(1)}</span>
                <div style={{
                  width: '100%', maxWidth: 60, height: (pct * 0.8) + '%', minHeight: 8,
                  background: 'linear-gradient(180deg, ' + color + ', ' + color + '44)',
                  border: '1px solid ' + color
                }} />
                <span style={{ fontSize: 9, color: 'var(--fg-3)', marginTop: 6, letterSpacing: '0.1em', textAlign: 'center' }}>{h.label}</span>
                <span style={{ fontSize: 8, color: typeColors[h.type], letterSpacing: '0.08em', textTransform: 'uppercase' }}>{h.type}</span>
              </div>
            );
          })}
        </div>
      </ModulePanel>

    </TelemetryChrome>
  );
}

window.HydrationPage = HydrationPage;
