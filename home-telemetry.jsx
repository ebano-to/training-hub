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

      {/* SECONDARY LINK — HYDRATION */}
      <a href="hydration.html" style={{
        border: '1px solid var(--line)', background: 'var(--bg-2)', padding: '16px 20px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        transition: 'border-color .15s', textDecoration: 'none', marginBottom: 16
      }}
        onMouseEnter={function(e) { e.currentTarget.style.borderColor = 'var(--accent)'; }}
        onMouseLeave={function(e) { e.currentTarget.style.borderColor = 'var(--line)'; }}
      >
        <div>
          <div style={{ fontSize: 10, color: 'var(--fg-3)', letterSpacing: '0.18em' }}>// SWEAT_TRACKING</div>
          <div className="display" style={{ fontSize: 20, color: 'var(--fg)', marginTop: 4 }}>HYDRATION</div>
          <div style={{ fontSize: 11, color: 'var(--fg-3)', marginTop: 4 }}>{window.TRAINING.HYDRATION.length} sessioni · sweat rate & reintegro</div>
        </div>
        <Icon.arrow width="16" height="16" style={{ color: 'var(--fg-3)' }} />
      </a>

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

window.HomeTelemetry = HomeTelemetry;
