// Variant C — TECH TELEMETRY
// Cockpit / dashboard feel: monospace-heavy, terminal aesthetics,
// data-dense, gridded, real-time chrome (timestamps, system status).

function HomeTelemetry() {
  const { RACE, ATHLETE, WEEK, STATIONS, VOLUME, PBS } = window.TRAINING;
  const cd = useCountdown(RACE.date);
  const todayNum = new Date().getDate();
  const today = WEEK.find((w) => parseInt(w.date, 10) === todayNum) || WEEK.find((w) => w.today) || WEEK[0];
  const [tick, setTick] = React.useState(0);
  React.useEffect(() => { const id = setInterval(() => setTick((t) => t + 1), 1000); return () => clearInterval(id); }, []);

  return (
    <div className="grid-bg tc-root" style={{ minHeight: '100%', background: 'var(--bg)', color: 'var(--fg)', fontFamily: 'var(--mono)' }}>
      {/* CHROME / SYS BAR */}
      <div className="r-sysbar" style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '8px 16px', border: '1px solid var(--line)', background: 'var(--bg-2)',
        fontSize: 11, letterSpacing: '0.1em', color: 'var(--fg-3)', marginBottom: 16, gap: 12
      }}>
        <span>FS://TRAINING.SYS · v2.7.0 · SUB60-PROTOCOL</span>
        <span className="r-sysbar-mid"><LiveDot /> &nbsp;UPLINK · {new Date().toLocaleTimeString('it-IT')}</span>
        <span>S{ATHLETE.programWeek} · T-{cd.days}D</span>
      </div>

      {/* RACE COUNTDOWN — HERO */}
      <div style={{ border: '1px solid var(--accent)', padding: 32, background: 'oklch(88% 0.20 130 / 0.06)', position: 'relative', marginBottom: 16 }}>
        <div style={{ position: 'absolute', top: 0, right: 0, padding: '4px 12px', background: 'var(--accent)', color: '#000', fontSize: 10, letterSpacing: '0.2em', fontWeight: 700 }}>
          ▲ PRIMARY TARGET
        </div>
        <div className="r-hero" style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 32, alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 11, color: 'var(--accent)', letterSpacing: '0.2em', marginBottom: 10 }}>
              // RACE_PROTOCOL · {RACE.date.toISOString().slice(0, 10)}
            </div>
            <div className="display r-display-hero" style={{ fontSize: 'var(--display-hero)', lineHeight: 0.92, marginBottom: 10 }}>
              ROAD TO SUB60' <span style={{ color: 'var(--accent)' }}>ROMA</span>
            </div>
            <div style={{ fontSize: 13, color: 'var(--fg-2)' }}>
              {RACE.category} · {RACE.partner} · {RACE.city}
            </div>
          </div>
          <div className="r-hero-countdown" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, auto)', gap: 18, paddingLeft: 32, borderLeft: '1px dashed var(--line-2)' }}>
            {[
              { l: 'D', v: pad(cd.days) },
              { l: 'H', v: pad(cd.hours) },
              { l: 'M', v: pad(cd.minutes) },
              { l: 'S', v: pad(cd.seconds), live: true },
            ].map((s) => (
              <div key={s.l} style={{ textAlign: 'center', minWidth: 96 }}>
                <div style={{ fontSize: 10, color: 'var(--fg-3)', letterSpacing: '0.18em', marginBottom: 6 }}>T-MINUS / {s.l}</div>
                <div className="display tabular r-display-mega" style={{ fontSize: 'var(--display-mega)', color: s.live ? 'var(--accent)' : 'var(--fg)', lineHeight: 0.95 }}>
                  {s.v}{s.live && <span style={{ animation: 'blink 1s infinite' }}>_</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ATHLETE STRIP */}
      <div className="r-athlete" style={{ border: '1px solid var(--line)', padding: 16, background: 'var(--bg-2)', marginBottom: 16, display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: 24, alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
          <Avatar size={48} />
          <div>
            <div className="display" style={{ fontSize: 20, lineHeight: 1 }}>F.SIMONDI</div>
            <div style={{ fontSize: 10, color: 'var(--fg-3)', marginTop: 4, letterSpacing: '0.15em' }}>// ATHLETE_ID 0x4F-2026 · M-40</div>
          </div>
        </div>
        <div className="r-athlete-stats" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, paddingLeft: 24, borderLeft: '1px dashed var(--line-2)' }}>
          <Kv k="PESO" v={ATHLETE.weight + 'kg'} />
          <Kv k="ALT" v={ATHLETE.height + 'cm'} />
          <Kv k="HRMAX" v={ATHLETE.hrmax + 'bpm'} />
        </div>
        <div style={{ fontSize: 11, color: 'var(--fg-3)', letterSpacing: '0.15em', textAlign: 'right' }}>
          S{ATHLETE.programWeek}
        </div>
      </div>

      {/* MODULE GRID */}
      <div className="r-grid r-grid-3" style={{ marginBottom: 16 }}>
        <ModuleCard
          code="MOD.01"
          title="AGENDA"
          sub="weekly_plan.run"
          metric={`${WEEK.filter((w) => w.done).length}/${WEEK.length}`}
          metricLabel="COMPLETATI"
          href="agenda.html"
        >
          <div style={{ marginTop: 12 }}>
            <div style={{ fontSize: 10, color: 'var(--accent)', letterSpacing: '0.12em', marginBottom: 4 }}>OGGI</div>
            <div style={{ fontSize: 13, fontWeight: 700, fontFamily: 'var(--sans)', color: 'var(--fg)', lineHeight: 1.3 }}>{today.title}</div>
            <div style={{ fontSize: 10, color: 'var(--fg-3)', marginTop: 3 }}>{today.duration}' · {today.load}</div>
          </div>
          <div style={{ display: 'flex', gap: 4, marginTop: 12 }}>
            {WEEK.map((w, i) => (
              <div key={i} style={{
                flex: 1, height: 28, background: w.done ? 'var(--accent)' : (parseInt(w.date,10) === todayNum ? 'transparent' : 'var(--bg-3)'),
                border: parseInt(w.date,10) === todayNum ? '1.5px solid var(--accent)' : '1px solid var(--line)',
                color: w.done ? '#000' : (parseInt(w.date,10) === todayNum ? 'var(--accent)' : 'var(--fg-3)'),
                fontSize: 9, fontWeight: 700, letterSpacing: '0.1em',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>{w.day}</div>
            ))}
          </div>
        </ModuleCard>
        <ModuleCard
          code="MOD.02"
          title="DASHBOARD"
          sub="volume · EF · stazioni"
          metric={Math.round(window.TRAINING.TOTALS.total) + 'km'}
          metricLabel="VOLUME TOTALE"
          href="dashboard.html"
        >
          <div style={{ marginTop: 12, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {[
              { l: 'TOTALE', d: VOLUME, c: '#FFFFFF', v: Math.round(window.TRAINING.TOTALS.total) },
              { l: 'ROWER', d: window.TRAINING.VOL_ROWER, c: '#58ADF7', v: Math.round(window.TRAINING.TOTALS.rower) },
              { l: 'SKIERG', d: window.TRAINING.VOL_SKI, c: '#6C68D7', v: Math.round(window.TRAINING.TOTALS.ski) },
              { l: 'RUN', d: window.TRAINING.VOL_RUN, c: '#39E75F', v: Math.round(window.TRAINING.TOTALS.run) },
              { l: 'BIKE', d: window.TRAINING.VOL_BIKE, c: '#FF6B9D', v: Math.round(window.TRAINING.TOTALS.bike) },
              { l: 'NUOTO', d: window.TRAINING.VOL_SWIM, c: '#00E5FF', v: Math.round(window.TRAINING.TOTALS.swim) },
            ].map(function(item) {
              return (
                <div key={item.l} style={{ padding: '6px 0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
                    <span style={{ fontSize: 9, color: item.c, letterSpacing: '0.12em' }}>{item.l}</span>
                    <span className="tabular" style={{ fontSize: 11, color: 'var(--fg)' }}>{item.v}km</span>
                  </div>
                  <Sparkline data={item.d} width={120} height={20} color={item.c} />
                </div>
              );
            })}
          </div>
        </ModuleCard>
        <ModuleCard
          code="MOD.03"
          title="STORICO"
          sub="archive.query"
          metric={window.TRAINING.HISTORY.length}
          metricLabel="SESSIONI"
          href="storico.html"
        >
          <div style={{ marginTop: 16, display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 3 }}>
            {Array.from({ length: 28 }).map(function(_, i) {
              var d = new Date(); d.setDate(d.getDate() - 27 + i);
              var dd = d.getDate(); var dayStr = (dd < 10 ? '0' + dd : '' + dd) + ' ' + ['GEN','FEB','MAR','APR','MAG','GIU','LUG','AGO','SET','OTT','NOV','DIC'][d.getMonth()];
              var daySessions = window.TRAINING.HISTORY.filter(function(h) { return h.date === dayStr; });
              var totalDur = daySessions.reduce(function(sum, h) { return sum + (h.dur || 0); }, 0);
              var kinds = {};
              daySessions.forEach(function(h) { kinds[h.kind] = true; });
              var kindCount = Object.keys(kinds).length;
              var bg = 'var(--bg-3)';
              if (totalDur > 0) {
                var alpha = Math.min(0.25 + totalDur / 200, 0.95);
                if (kinds.run && kindCount === 1) bg = 'oklch(75% 0.18 145 / ' + alpha + ')';
                else if (kinds.ski && kindCount === 1) bg = 'oklch(65% 0.18 290 / ' + alpha + ')';
                else if (kinds.row && kindCount === 1) bg = 'oklch(70% 0.15 230 / ' + alpha + ')';
                else if (kinds.strength && kindCount === 1) bg = 'oklch(80% 0.15 60 / ' + alpha + ')';
                else if (kinds.bike && kindCount === 1) bg = 'oklch(70% 0.18 350 / ' + alpha + ')';
                else bg = 'oklch(88% 0.20 130 / ' + alpha + ')';
              }
              var isToday = i === 27;
              return (
                <div key={i} title={dayStr + (totalDur > 0 ? ' · ' + totalDur + "' · " + daySessions.length + ' sess' : ' · rest')} style={{
                  aspectRatio: '1', background: bg,
                  border: isToday ? '1.5px solid var(--accent)' : '1px solid var(--line)'
                }} />
              );
            })}
          </div>
        </ModuleCard>
      </div>

      {/* SECONDARY LINKS — BADGE / PROGRESSI / HYDRATION */}
      <div className="r-grid r-grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 16 }}>
        {[
          ['badge.html', '// GARMIN_CHALLENGES', 'BADGE', window.TRAINING.BADGES.items.filter(function(b) { return b.st === 'done'; }).length + ' prese · mensili + catalogo'],
          ['progressione.html', '// SEI_MIGLIORATO?', 'PROGRESSI', 'erg dal 2025 · nuoto dal 2023'],
          ['hydration.html', '// SWEAT_TRACKING', 'HYDRATION', window.TRAINING.HYDRATION.length + ' sessioni · sweat rate'],
        ].map(function(item) {
          return (
            <a key={item[0]} href={item[0]} style={{
              border: '1px solid var(--line)', background: 'var(--bg-2)', padding: '16px 20px',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              transition: 'border-color .15s', textDecoration: 'none',
            }}
              onMouseEnter={function(e) { e.currentTarget.style.borderColor = 'var(--accent)'; }}
              onMouseLeave={function(e) { e.currentTarget.style.borderColor = 'var(--line)'; }}
            >
              <div>
                <div style={{ fontSize: 10, color: 'var(--fg-3)', letterSpacing: '0.18em' }}>{item[1]}</div>
                <div className="display" style={{ fontSize: 20, color: 'var(--fg)', marginTop: 4 }}>{item[2]}</div>
                <div style={{ fontSize: 11, color: 'var(--fg-3)', marginTop: 4 }}>{item[3]}</div>
              </div>
              <div style={{ fontSize: 18, color: 'var(--fg-3)' }}>→</div>
            </a>
          );
        })}
      </div>

      {/* COMPOSIZIONE CORPOREA */}
      <BodyComposition />

      {/* NUTRITION — SPESA + RICETTARIO (separati dal training) */}
      <div style={{ border: '1px solid #2D6A4F', padding: 16, marginBottom: 16 }}>
        <div style={{ fontSize: 10, color: '#2D6A4F', letterSpacing: '0.18em', marginBottom: 12 }}>// NUTRITION · Piano Zappitelli</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <a href="spesa.html" style={{
            border: '1px solid #2D6A4F', background: 'oklch(45% 0.12 160 / 0.08)', padding: '16px 20px',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            transition: 'background .15s', textDecoration: 'none'
          }}
            onMouseEnter={function(e) { e.currentTarget.style.background = 'oklch(45% 0.12 160 / 0.15)'; }}
            onMouseLeave={function(e) { e.currentTarget.style.background = 'oklch(45% 0.12 160 / 0.08)'; }}
          >
            <div>
              <div className="display" style={{ fontSize: 20, color: 'var(--fg)' }}>LISTA SPESA</div>
              <div style={{ fontSize: 11, color: 'var(--fg-3)', marginTop: 4 }}>Settimanale · checklist interattiva</div>
            </div>
            <Icon.arrow width="16" height="16" style={{ color: '#2D6A4F' }} />
          </a>
          <a href="ricettario.html" style={{
            border: '1px solid #2D6A4F', background: 'oklch(45% 0.12 160 / 0.08)', padding: '16px 20px',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            transition: 'background .15s', textDecoration: 'none'
          }}
            onMouseEnter={function(e) { e.currentTarget.style.background = 'oklch(45% 0.12 160 / 0.15)'; }}
            onMouseLeave={function(e) { e.currentTarget.style.background = 'oklch(45% 0.12 160 / 0.08)'; }}
          >
            <div>
              <div className="display" style={{ fontSize: 20, color: 'var(--fg)' }}>RICETTARIO</div>
              <div style={{ fontSize: 11, color: 'var(--fg-3)', marginTop: 4 }}>Ricette settimanali dettagliate</div>
            </div>
            <Icon.arrow width="16" height="16" style={{ color: '#2D6A4F' }} />
          </a>
        </div>
      </div>

      {/* TODAY BAR */}
      <div style={{ border: '1px solid var(--line)', background: 'var(--bg-2)', padding: 24, marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 16 }}>
          <div style={{ fontSize: 11, color: 'var(--accent)', letterSpacing: '0.18em' }}>
            // SESSION_TODAY · {today.day} {today.date} · S{ATHLETE.programWeek}
          </div>
          <div style={{ fontSize: 11, color: 'var(--fg-3)', letterSpacing: '0.15em' }}>{today.kind.toUpperCase()}</div>
        </div>
        <div className="r-today" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 200px', gap: 32, alignItems: 'center' }}>
          <div>
            <div className="display" style={{ fontSize: 40, lineHeight: 1 }}>{today.title}</div>
            <div style={{ fontSize: 13, color: 'var(--fg-2)', marginTop: 8 }}>{today.sub}</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
            <Kv k="DURATA" v={today.duration + '\''} big />
            <Kv k="ZONA" v={today.load} big />
            <Kv k="BLOCCHI" v={today.blocks ? today.blocks.length : 1} big />
          </div>
          <a href="agenda.html" style={{
            background: 'var(--accent)', color: '#000', padding: '16px 20px',
            fontFamily: 'var(--display)', fontSize: 18, letterSpacing: '0.05em', fontWeight: 700,
            display: 'flex', justifyContent: 'space-between', alignItems: 'center'
          }}>
            VEDI DETTAGLI <Icon.arrow width="16" height="16" />
          </a>
        </div>
      </div>

      {/* STATION GRID */}
      <div style={{ border: '1px solid var(--line)', background: 'var(--bg-2)', padding: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 16 }}>
          <div style={{ fontSize: 11, color: 'var(--fg-3)', letterSpacing: '0.18em' }}>// HX_STATIONS · pb_verona_2025 · <span style={{ color: 'var(--accent)' }}>1:17:44</span></div>
          <div style={{ fontSize: 11, color: 'var(--fg-3)' }}>9 STATIONS</div>
        </div>
        <div className="r-grid r-grid-9" style={{ gap: 8 }}>
          {STATIONS.map((s, i) => {
            return (
              <div key={s.code} style={{ border: '1px solid var(--line)', padding: 12, background: 'var(--bg-3)' }}>
                <div className="display" style={{ fontSize: 13, color: 'var(--accent)' }}>{s.code}</div>
                <div style={{ fontSize: 9, color: 'var(--fg-3)', marginTop: 4, height: 22, lineHeight: 1.2 }}>{s.name}</div>
                <div className="tabular" style={{ fontSize: 14, marginTop: 8, color: 'var(--fg)' }}>{s.pb}</div>
                <div className="tabular" style={{ fontSize: 10, color: 'var(--accent-2)', marginTop: 2 }}>PB VERONA</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* FOOTER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16, fontSize: 10, color: 'var(--fg-3)', letterSpacing: '0.15em' }}>
        <span>END_OF_FRAME · {tick} TICKS</span>
        <span>FS://TRAINING.SYS · ALL SYSTEMS NOMINAL ✓</span>
        <span>S{ATHLETE.programWeek} ● ● ●</span>
      </div>
    </div>
  );
}

function parseTime(t) {
  const [m, s] = t.split(':').map(Number);
  return m * 60 + s;
}

function Kv({ k, v, big }) {
  return (
    <div>
      <div style={{ fontSize: 9, color: 'var(--fg-3)', letterSpacing: '0.15em' }}>{k}</div>
      <div className={big ? 'display tabular' : 'tabular'} style={{ fontSize: big ? 22 : 13, color: 'var(--fg)' }}>{v}</div>
    </div>
  );
}

function ModuleCard({ code, title, sub, metric, metricLabel, href, accent, children }) {
  const [hov, setHov] = React.useState(false);
  return (
    <a href={href} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        border: hov ? '1px solid var(--accent)' : (accent ? '1px solid var(--accent)' : '1px solid var(--line)'),
        padding: 20, background: 'var(--bg-2)', cursor: 'pointer',
        display: 'flex', flexDirection: 'column',
        transition: 'border-color .15s, background .15s',
        boxShadow: hov ? '0 0 0 4px oklch(88% 0.20 130 / 0.1)' : 'none'
      }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontSize: 10, color: 'var(--accent)', letterSpacing: '0.2em' }}>// {code}</div>
          <div className="display" style={{ fontSize: 28, marginTop: 6 }}>{title}</div>
          <div style={{ fontSize: 11, color: 'var(--fg-3)', marginTop: 2 }}>{sub}</div>
        </div>
        <Icon.arrowDR width="16" height="16" style={{ color: 'var(--fg-3)', transition: 'transform .2s', transform: hov ? 'translate(2px,-2px)' : 'none' }} />
      </div>
      <div style={{ flex: 1 }}>{children}</div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 16, paddingTop: 12, borderTop: '1px dashed var(--line-2)' }}>
        <span className="display tabular" style={{ fontSize: 26, color: accent ? 'var(--accent)' : 'var(--fg)' }}>{metric}</span>
        <span style={{ fontSize: 10, color: 'var(--fg-3)', letterSpacing: '0.18em' }}>{metricLabel}</span>
      </div>
    </a>
  );
}

// ── COMPOSIZIONE CORPOREA — Garmin Index S2 + plicometria Zappitelli
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
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 9, color: 'var(--fg-3)', letterSpacing: '0.1em' }}>
          {(function () {
            var y0 = new Date(t0).getFullYear(), y1 = new Date(t1).getFullYear(), o = [];
            for (var y = y0; y <= y1; y++) o.push(y);
            return o.map(function (y) { return <span key={y}>{y}</span>; });
          })()}
        </div>
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

window.HomeTelemetry = HomeTelemetry;
