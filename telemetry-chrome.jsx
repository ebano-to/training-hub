// Shared chrome for Telemetry-style pages

function TelemetryChrome({ active, children }) {
  const { ATHLETE, RACE } = window.TRAINING;
  const cd = useCountdown(RACE.date);
  const [time, setTime] = React.useState(new Date().toLocaleTimeString('it-IT'));
  React.useEffect(() => {
    const id = setInterval(() => setTime(new Date().toLocaleTimeString('it-IT')), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="grid-bg tc-root" style={{ minHeight: '100%', background: 'var(--bg)', color: 'var(--fg)', fontFamily: 'var(--mono)' }}>
      {/* SYS BAR */}
      <div className="r-sysbar" style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '8px 16px', border: '1px solid var(--line)', background: 'var(--bg-2)',
        fontSize: 11, letterSpacing: '0.1em', color: 'var(--fg-3)', marginBottom: 12, gap: 12
      }}>
        <span>FS://TRAINING.SYS · v2.6.0 · RIMINI-PROTOCOL</span>
        <span className="r-sysbar-mid"><LiveDot /> &nbsp;UPLINK · {time}</span>
        <span>S{ATHLETE.programWeek} · T-{cd.days}D</span>
      </div>

      {/* TOP NAV */}
      <div className="r-topnav-inner" style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 16px', border: '1px solid var(--line)', background: 'var(--bg-2)', marginBottom: 16, gap: 16
      }}>
        <a href="index.html" style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
          <Avatar size={32} />
          <div>
            <div style={{ fontSize: 10, color: 'var(--fg-3)', letterSpacing: '0.18em' }}>// ATHLETE_ID 0x4F-2026</div>
            <div className="display" style={{ fontSize: 16, lineHeight: 1 }}>F.SIMONDI</div>
          </div>
        </a>
        <nav className="r-nav-tabs" style={{ display: 'flex', gap: 4 }}>
          {[['HUB', 'index.html'], ['AGENDA', 'agenda.html'], ['DASHBOARD', 'dashboard.html'], ['STORICO', 'storico.html']].map(([l, h]) => (
            <a key={l} href={h}
              style={{
                padding: '8px 14px',
                background: l === active ? 'var(--accent)' : 'transparent',
                color: l === active ? '#000' : 'var(--fg-2)',
                border: '1px solid ' + (l === active ? 'var(--accent)' : 'var(--line)'),
                fontFamily: 'var(--display)', fontSize: 13, letterSpacing: '0.06em', fontWeight: 700,
                transition: 'background .12s, color .12s', whiteSpace: 'nowrap'
              }}>{l}</a>
          ))}
        </nav>
        <div className="r-topnav-meta" style={{ fontSize: 11, color: 'var(--fg-3)', letterSpacing: '0.12em', textAlign: 'right' }}>
          <div>S{ATHLETE.programWeek} · {ATHLETE.weight}KG · {ATHLETE.height}CM</div>
        </div>
      </div>

      {children}

      {/* FOOT */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16, fontSize: 10, color: 'var(--fg-3)', letterSpacing: '0.15em' }}>
        <span>END_OF_FRAME · NOMINAL ✓</span>
        <span>federicosimondi.it/allenamenti · build 2026.04</span>
        <span>● ● ●</span>
      </div>
    </div>
  );
}

function ModulePanel({ code, title, sub, children, accent }) {
  return (
    <div style={{
      border: '1px solid ' + (accent ? 'var(--accent)' : 'var(--line)'),
      background: 'var(--bg-2)', padding: 20, marginBottom: 12
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: 11, color: accent ? 'var(--accent)' : 'var(--fg-3)', letterSpacing: '0.18em' }}>// {code}</div>
          {title && <div className="display" style={{ fontSize: 28, lineHeight: 1, marginTop: 6 }}>{title}</div>}
          {sub && <div style={{ fontSize: 11, color: 'var(--fg-3)', marginTop: 4 }}>{sub}</div>}
        </div>
      </div>
      {children}
    </div>
  );
}

window.TelemetryChrome = TelemetryChrome;
window.ModulePanel = ModulePanel;
