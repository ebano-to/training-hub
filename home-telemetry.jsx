// Variant C — TECH TELEMETRY
// Cockpit / dashboard feel: monospace-heavy, terminal aesthetics,
// data-dense, gridded, real-time chrome (timestamps, system status).

function HomeTelemetry() {
  const { RACE, ATHLETE, WEEK, STATIONS, VOLUME, PBS } = window.TRAINING;
  const cd = useCountdown(RACE.date);
  const todayNum = new Date().getDate();
  const today = WEEK.find((w) => parseInt(w.date, 10) === todayNum) || WEEK.find((w) => w.today) || WEEK[0];

  // --- dati di sintesi per i moduli della home ---
  const HHMM = function (v) {
    var h = Math.floor(v), m = Math.round((v - h) * 60);
    return h + ':' + (m < 10 ? '0' : '') + m;
  };
  const ST = window.TRAINING.SETTIMANA_TIPO;
  const OGGI_SIGLA = ['DOM', 'LUN', 'MAR', 'MER', 'GIO', 'VEN', 'SAB'][new Date().getDay()];
  const G_OGGI = ST.giorni.find(function (g) { return g.d === OGGI_SIGLA; });
  const SETTIMANA_OGGI = (G_OGGI ? G_OGGI.slot : []).slice().sort(function (x, y) { return x.h - y.h; });
  const PRENOTA_N = ST.giorni.reduce(function (a2, g) { return a2 + g.slot.filter(function (x) { return x.prenota; }).length; }, 0);

  const BADGE_DONE = window.TRAINING.BADGES.items.filter(function (b) { return b.st === 'done'; }).length;
  const BADGE_VICINI = (function () {
    var out = [];
    window.TRAINING.BADGES.items.forEach(function (b) {
      if (b.st === 'done' || b.st === 'miss' || b.st === 'off') return;
      if (!b.prog) return;
      var m = String(b.prog).match(/(\d+)\s*%/);
      if (!m) return;
      out.push({ n: b.n, pct: parseInt(m[1], 10) });
    });
    out.sort(function (x, y) { return y.pct - x.pct; });
    return out.slice(0, 4);
  })();

  const CORPO = (function () {
    var B = window.TRAINING.BODY || [];
    if (!B.length) return { kg: 0, bf: 0, dKg: 0, dBf: 0, dKgL: '', dBfL: '', serieKg: [], serieBf: [] };
    var bf = B.filter(function (x) { return x.bf; });
    var last = B[B.length - 1], lb = bf[bf.length - 1], fb = bf[0];
    var dKg = last.kg - B[0].kg, dBf = lb.bf - fb.bf;
    var fmt = function (v) { return (v > 0 ? '+' : v < 0 ? '\u2212' : '') + Math.abs(v).toFixed(1).replace('.', ','); };
    return {
      kg: last.kg, bf: lb.bf, dKg: dKg, dBf: dBf,
      dKgL: fmt(dKg) + ' kg', dBfL: fmt(dBf) + ' pt',
      serieKg: B.map(function (x) { return x.kg; }),
      serieBf: bf.map(function (x) { return x.bf; }),
    };
  })();
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
        <span>FS://TRAINING.SYS · v2.8.0 · BEAT-ARMANDO-PROTOCOL</span>
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
              {RACE.titleMain} <span style={{ color: 'var(--accent)' }}>{RACE.titleAccent}</span>
            </div>
            <div style={{ fontSize: 13, color: 'var(--fg-2)' }}>
              {RACE.category} · {RACE.partner} · {RACE.city}{RACE.venue ? ' (' + RACE.venue + ')' : ''}
            </div>
            <div style={{ fontSize: 11, color: 'var(--fg-3)', marginTop: 6, letterSpacing: '0.04em' }}>
              Target: {RACE.target} — non un tempo, un distacco
              {RACE.targetTime && <span style={{ color: 'var(--accent)' }}>{'  ·  E sul cronometro: ' + RACE.targetTime}</span>}
              {RACE.targetTimeNote && <span>{' (' + RACE.targetTimeNote + ')'}</span>}
            </div>
            {RACE.mission && (
              <div style={{ marginTop: 12, paddingLeft: 12, borderLeft: '2px solid var(--accent)' }}>
                <div style={{ fontSize: 10, color: 'var(--accent)', letterSpacing: '0.2em', marginBottom: 4 }}>▸ {RACE.missionTitle}</div>
                <div style={{ fontSize: 12, color: 'var(--fg-2)', lineHeight: 1.5, fontFamily: 'var(--sans)', fontStyle: 'italic' }}>{RACE.mission}</div>
              </div>
            )}
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
            <div style={{ fontSize: 10, color: 'var(--accent)', letterSpacing: '0.12em', marginBottom: 4 }}>
              OGGI · {today.day} {today.date} · S{ATHLETE.programWeek}
            </div>
            <div style={{ fontSize: 13, fontWeight: 700, fontFamily: 'var(--sans)', color: 'var(--fg)', lineHeight: 1.3 }}>{today.title}</div>
            {today.sub && <div style={{ fontSize: 10, color: 'var(--fg-2)', marginTop: 4, lineHeight: 1.35 }}>{today.sub}</div>}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6, marginTop: 10 }}>
              {[['DURATA', today.duration + "'"], ['ZONA', today.load], ['BLOCCHI', today.blocks ? today.blocks.length : 1]].map(function (x) {
                return (
                  <div key={x[0]} style={{ border: '1px solid var(--line)', background: 'var(--bg)', padding: '6px 8px' }}>
                    <div style={{ fontSize: 8, color: 'var(--fg-3)', letterSpacing: '0.14em' }}>{x[0]}</div>
                    <div className="display tabular" style={{ fontSize: 17, lineHeight: 1.1 }}>{x[1]}</div>
                  </div>
                );
              })}
            </div>
            {today.blocks && today.blocks.length > 0 && (
              <div style={{ marginTop: 8, display: 'grid', gap: 3, minWidth: 0 }}>
                {today.blocks.map(function (bk, i) {
                  var fatto = bk.result && bk.result !== 'da fare';
                  return (
                    <div key={i} style={{ display: 'flex', gap: 6, alignItems: 'baseline', minWidth: 0 }}>
                      <span style={{ fontSize: 8, letterSpacing: '0.1em', color: fatto ? 'var(--accent)' : 'var(--fg-3)', minWidth: 46 }}>{bk.code}</span>
                      <span style={{ fontSize: 10, color: 'var(--fg-2)', lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', minWidth: 0, flex: 1 }}>{bk.t}</span>
                    </div>
                  );
                })}
              </div>
            )}
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

      {/* SECONDA FILA DI MODULI — stessa forma della prima */}
      <div className="r-grid r-grid-3" style={{ marginBottom: 16 }}>

        <ModuleCard
          code="MOD.04"
          title="SETTIMANA"
          sub="slot fissi · dove devo essere"
          metric={SETTIMANA_OGGI.length}
          metricLabel={'SLOT OGGI · ' + OGGI_SIGLA}
          href="settimana.html"
        >
          <div style={{ marginTop: 12, display: 'grid', gap: 4 }}>
            {SETTIMANA_OGGI.length === 0 && (
              <div style={{ fontSize: 12, color: 'var(--fg-3)', fontFamily: 'var(--sans)' }}>Nessuno slot fisso oggi.</div>
            )}
            {SETTIMANA_OGGI.map(function (sl, i) {
              var L = window.TRAINING.SETTIMANA_TIPO.luoghi[sl.p];
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, borderLeft: '3px solid ' + L.c, paddingLeft: 7 }}>
                  <span className="tabular" style={{ fontSize: 10, color: 'var(--fg-3)', minWidth: 72 }}>{HHMM(sl.h)}→{HHMM(sl.e)}</span>
                  <span style={{ fontSize: 11, color: 'var(--fg)', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{sl.n}</span>
                </div>
              );
            })}
          </div>
        </ModuleCard>

        <ModuleCard
          code="MOD.05"
          title="PROGRESSI"
          sub="personal best · erg e gare"
          metric={window.TRAINING.PBS.length}
          metricLabel="PB A REFERTO"
          href="progressione.html"
        >
          <div style={{ marginTop: 12, display: 'grid', gap: 5 }}>
            {window.TRAINING.PBS.slice(0, 6).map(function (pb, i) {
              return (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8, minWidth: 0 }}>
                  <span style={{ fontSize: 10, color: 'var(--fg-3)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', minWidth: 0, flex: 1 }}>{pb.station}</span>
                  <span style={{ flexShrink: 0, textAlign: 'right' }}>
                    <span className="display tabular" style={{ fontSize: 14, color: 'var(--fg)' }}>{pb.value}</span>
                    {pb.pace && <span className="tabular" style={{ fontSize: 9, color: 'var(--fg-3)', marginLeft: 6 }}>{pb.pace}</span>}
                  </span>
                </div>
              );
            })}
          </div>
        </ModuleCard>

        <ModuleCard
          code="MOD.06"
          title="BADGE"
          sub="garmin_challenges"
          metric={BADGE_DONE + '/' + window.TRAINING.BADGES.items.length}
          metricLabel="PRESE QUESTO MESE"
          href="badge.html"
        >
          <div style={{ marginTop: 12, display: 'grid', gap: 5 }}>
            <div style={{ fontSize: 10, color: 'var(--accent)', letterSpacing: '0.12em', marginBottom: 2 }}>I PIÙ VICINI</div>
            {BADGE_VICINI.map(function (b, i) {
              return (
                <div key={i}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8 }}>
                    <span style={{ fontSize: 10, color: 'var(--fg-2)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{b.n}</span>
                    <span className="tabular" style={{ fontSize: 11, color: 'var(--fg)', flexShrink: 0 }}>{b.pct}%</span>
                  </div>
                  <div style={{ height: 4, background: 'var(--bg-3)', marginTop: 3 }}>
                    <div style={{ width: b.pct + '%', height: '100%', background: 'var(--accent)' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </ModuleCard>

      </div>

      {/* TERZA FILA — CORPO / HYDRATION / STORICO già sopra */}
      <div className="r-grid r-grid-3" style={{ marginBottom: 16, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>

        <ModuleCard
          code="MOD.07"
          title="MASSA CORPOREA"
          sub="peso · massa grassa"
          metric={String(CORPO.kg).replace('.', ',') + 'kg'}
          metricLabel={'MASSA GRASSA ' + String(CORPO.bf).replace('.', ',') + '%'}
          href="corpo.html"
        >
          <div style={{ marginTop: 12, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
                <span style={{ fontSize: 9, color: '#58ADF7', letterSpacing: '0.12em' }}>PESO</span>
                <span className="tabular" style={{ fontSize: 10, color: CORPO.dKg < 0 ? '#39E75F' : 'var(--fg-3)' }}>{CORPO.dKgL}</span>
              </div>
              <Sparkline data={CORPO.serieKg} width={150} height={34} color="#58ADF7" />
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
                <span style={{ fontSize: 9, color: '#FF6B9D', letterSpacing: '0.12em' }}>MASSA GRASSA</span>
                <span className="tabular" style={{ fontSize: 10, color: CORPO.dBf < 0 ? '#39E75F' : 'var(--fg-3)' }}>{CORPO.dBfL}</span>
              </div>
              <Sparkline data={CORPO.serieBf} width={150} height={34} color="#FF6B9D" />
            </div>
          </div>
          <div style={{ fontSize: 9, color: 'var(--fg-3)', marginTop: 8, letterSpacing: '0.1em' }}>
            {window.TRAINING.BODY.length} MISURE INDEX S2 · {window.TRAINING.PLICO.length} PLICOMETRIE
          </div>
        </ModuleCard>

        <ModuleCard
          code="MOD.08"
          title="HYDRATION"
          sub="sweat_rate"
          metric={(window.TRAINING.HYDRATION.reduce(function (a2, h) { return a2 + h.sweatRate; }, 0) / window.TRAINING.HYDRATION.length / 1000).toFixed(2).replace('.', ',') + 'L/h'}
          metricLabel={'SUDORE MEDIO \u00b7 ' + window.TRAINING.HYDRATION.length + ' SESSIONI'}
          href="hydration.html"
        >
          <div style={{ marginTop: 12, display: 'grid', gap: 5 }}>
            {window.TRAINING.HYDRATION.slice(-4).reverse().map(function (h, i) {
              return (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8 }}>
                  <span style={{ fontSize: 10, color: 'var(--fg-3)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{h.label} · {h.type}</span>
                  <span className="tabular" style={{ fontSize: 12, color: 'var(--fg)', flexShrink: 0 }}>
                    {(h.sweatRate / 1000).toFixed(2).replace('.', ',')} L/h
                  </span>
                </div>
              );
            })}
          </div>
        </ModuleCard>

      </div>

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
        display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden',
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
      <div style={{ flex: 1, minWidth: 0 }}>{children}</div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 16, paddingTop: 12, borderTop: '1px dashed var(--line-2)' }}>
        <span className="display tabular" style={{ fontSize: 26, color: accent ? 'var(--accent)' : 'var(--fg)' }}>{metric}</span>
        <span style={{ fontSize: 10, color: 'var(--fg-3)', letterSpacing: '0.18em' }}>{metricLabel}</span>
      </div>
    </a>
  );
}

// ── COMPOSIZIONE CORPOREA — Garmin Index S2 + plicometria Zappitelli


window.HomeTelemetry = HomeTelemetry;
