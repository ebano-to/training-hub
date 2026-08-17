// BADGE — Garmin challenge del mese + copertura rispetto al programma
function BadgePage() {
  const { BADGES } = window.TRAINING;
  const [filter, setFilter] = React.useState('ALL');
  const [sez, setSez] = React.useState('MENSILI');

  const ST = {
    done:  { l: 'PRESA', c: 'oklch(72% 0.13 250)' },
    auto:  { l: 'ARRIVA DA SOLO', c: 'var(--accent)' },
    plan:  { l: 'DA PIAZZARE', c: 'oklch(82% 0.16 85)' },
    push:  { l: 'SERVE VOLUME', c: 'oklch(70% 0.15 30)' },
    off:   { l: 'ALTRO SPORT', c: 'var(--fg-3)' },
    miss:  { l: 'MANCATA', c: 'oklch(60% 0.12 25)' },
  };
  const CAT = {
    RUN: '#39E75F', BIKE: '#FF6B9D', WALK: '#B388FF', SWIM: '#58ADF7',
    FIT: 'oklch(80% 0.15 60)', STEP: '#FCEE4F', REC: '#6C68D7', SOC: 'var(--fg-3)',
  };

  const today = new Date();
  const iso = (d) => d.toISOString().slice(0, 10);
  const todayIso = iso(today);
  const monthEnd = new Date(BADGES.monthEnd + 'T23:59:59');
  const daysLeft = Math.max(0, Math.ceil((monthEnd - today) / 86400000));

  // finestre datate ordinate — quelle ancora aperte per prime
  const windows = BADGES.items.filter((b) => b.d1 && b.d2).sort((a, b) => a.d1.localeCompare(b.d1));
  const winState = (b) => (todayIso > b.d2 ? 'past' : todayIso >= b.d1 ? 'now' : 'next');

  const items = filter === 'ALL' ? BADGES.items : BADGES.items.filter((b) => b.st === filter);
  const count = (k) => BADGES.items.filter((b) => b.st === k).length;

  // calendario del mese
  const y = 2026, mo = 7; // agosto = indice 7
  const firstDow = (new Date(y, mo, 1).getDay() + 6) % 7; // lunedì = 0
  const nDays = new Date(y, mo + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < firstDow; i++) cells.push(null);
  for (let d = 1; d <= nDays; d++) cells.push(d);
  const dayIso = (d) => `2026-08-${String(d).padStart(2, '0')}`;
  const badgesOn = (d) => windows.filter((b) => dayIso(d) >= b.d1 && dayIso(d) <= b.d2);

  return (
    <TelemetryChrome active="BADGE">
      {/* ══ TAB: MENSILI / GARMIN ══ */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
        {[['MENSILI', 'BADGE MENSILI'], ['GARMIN', 'BADGE GARMIN']].map(([k, l]) => (
          <button key={k} onClick={() => setSez(k)} style={{
            flex: 1, padding: '13px 18px', cursor: 'pointer',
            fontFamily: 'var(--display)', fontSize: 17, letterSpacing: '0.06em',
            background: sez === k ? 'var(--accent)' : 'var(--bg-2)',
            color: sez === k ? '#000' : 'var(--fg-2)',
            border: '1px solid ' + (sez === k ? 'var(--accent)' : 'var(--line)'),
          }}>{l}</button>
        ))}
      </div>
      <div style={{ display: sez === 'MENSILI' ? 'block' : 'none' }}>
      {/* Titolo */}
      <div className="r-agenda-title" style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 16, marginBottom: 12 }}>
        <div style={{ border: '1px solid var(--line)', background: 'var(--bg-2)', padding: 24 }}>
          <div style={{ fontSize: 11, color: 'var(--fg-3)', letterSpacing: '0.18em', marginBottom: 8 }}>
            // GARMIN_CHALLENGES · {BADGES.month}
          </div>
          <div className="display r-display-hero" style={{ fontSize: 'var(--display-hero)', lineHeight: 0.9 }}>
            BADGE<span style={{ color: 'var(--accent)' }}>.</span>
          </div>
          <div style={{ fontSize: 11, color: 'var(--fg-3)', letterSpacing: '0.12em', marginTop: 12 }}>
            {BADGES.items.length} SFIDE ISCRITTE · {daysLeft} GIORNI ALLA CHIUSURA · PROGRESSI AL {BADGES.snapshot}
          </div>
        </div>
        <div style={{ border: '1px solid var(--line)', background: 'var(--bg-2)', padding: 20 }}>
          <div style={{ fontSize: 11, color: 'var(--fg-3)', letterSpacing: '0.18em', marginBottom: 14 }}>// COPERTURA</div>
          {['plan', 'auto', 'push', 'off', 'done'].map((k) => (
            <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <span style={{ width: 8, height: 8, background: ST[k].c, flexShrink: 0 }} />
              <span style={{ fontSize: 10, color: 'var(--fg-3)', letterSpacing: '0.12em', flex: 1 }}>{ST[k].l}</span>
              <span className="display tabular" style={{ fontSize: 18, color: ST[k].c }}>{count(k)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Calendario finestre */}
      <ModulePanel code="MOD.BADGE · finestre_datate" accent>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, marginBottom: 14 }}>
          {['LUN', 'MAR', 'MER', 'GIO', 'VEN', 'SAB', 'DOM'].map((d) => (
            <div key={d} style={{ fontSize: 9, color: 'var(--fg-3)', letterSpacing: '0.14em', textAlign: 'center', paddingBottom: 4 }}>{d}</div>
          ))}
          {cells.map((d, i) => {
            if (d === null) return <div key={'e' + i} />;
            const bs = badgesOn(d);
            const isToday = dayIso(d) === todayIso;
            const isPast = dayIso(d) < todayIso;
            return (
              <div key={d} style={{
                border: '1px solid ' + (isToday ? 'var(--accent)' : bs.length ? 'var(--line-2)' : 'var(--line)'),
                background: isToday ? 'oklch(88% 0.20 130 / 0.10)' : bs.length ? 'var(--bg-3)' : 'transparent',
                padding: '6px 6px 8px', minHeight: 62, opacity: isPast && !isToday ? 0.4 : 1,
              }}>
                <div className="display tabular" style={{ fontSize: 16, lineHeight: 1, color: isToday ? 'var(--accent)' : 'var(--fg-2)' }}>{d}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2, marginTop: 4 }}>
                  {bs.map((b, j) => (
                    <div key={j} title={b.n + ' — ' + b.req} style={{
                      fontSize: 8, letterSpacing: '0.04em', lineHeight: 1.25,
                      color: CAT[b.cat] || 'var(--fg-2)', borderLeft: '2px solid ' + (CAT[b.cat] || 'var(--fg-2)'),
                      paddingLeft: 3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>{b.en.replace('August ', '').replace('Weekend ', 'WE ')}</div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, fontSize: 9, color: 'var(--fg-3)', letterSpacing: '0.1em', borderTop: '1px dashed var(--line-2)', paddingTop: 10 }}>
          {Object.keys(CAT).map((c) => (
            <span key={c} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{ width: 7, height: 7, background: CAT[c] }} />{c}
            </span>
          ))}
        </div>
      </ModulePanel>

      {/* Prossime finestre */}
      <ModulePanel code="MOD.BADGE · prossime_scadenze">
        <div style={{ display: 'grid', gap: 6 }}>
          {windows.map((b, i) => {
            const w = winState(b);
            const fin = b.st === 'done' || b.st === 'miss';
            const col = fin ? ST[b.st].c : w === 'now' ? 'var(--accent)' : w === 'past' ? 'var(--fg-3)' : (CAT[b.cat] || 'var(--fg-2)');
            return (
              <div key={i} style={{
                display: 'grid', gridTemplateColumns: '120px 1fr 110px', gap: 14, alignItems: 'center',
                padding: '10px 12px', borderLeft: '3px solid ' + col,
                background: w === 'now' && !fin ? 'oklch(88% 0.20 130 / 0.06)' : 'transparent',
                borderBottom: '1px dashed var(--line-2)', opacity: (w === 'past' && !fin) || b.st === 'miss' ? 0.45 : 1,
              }}>
                <div className="display tabular" style={{ fontSize: 15, color: col }}>{b.win}</div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, fontFamily: 'var(--sans)' }}>{b.n}</div>
                  <div style={{ fontSize: 11, color: 'var(--fg-2)', marginTop: 2 }}>{b.req}{b.tipo === 'singola' ? ' · una sola attività' : ''}</div>
                </div>
                <div style={{ fontSize: 9, letterSpacing: '0.12em', textAlign: 'right', color: col }}>
                  {fin ? ST[b.st].l : w === 'now' ? '● APERTA' : w === 'past' ? 'CHIUSA' : ST[b.st].l}
                </div>
              </div>
            );
          })}
        </div>
      </ModulePanel>

      {/* Filtri */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 12, flexWrap: 'wrap' }}>
        {[['ALL', 'TUTTE'], ['plan', ST.plan.l], ['auto', ST.auto.l], ['push', ST.push.l], ['off', ST.off.l], ['miss', ST.miss.l], ['done', ST.done.l]].map(([k, l]) => {
          const sel = filter === k;
          const c = k === 'ALL' ? 'var(--accent)' : ST[k].c;
          return (
            <button key={k} onClick={() => setFilter(k)} style={{
              background: sel ? c : 'transparent', color: sel ? '#000' : 'var(--fg-3)',
              border: '1px solid ' + (sel ? c : 'var(--line)'), padding: '6px 12px',
              fontFamily: 'var(--display)', fontSize: 11, letterSpacing: '0.08em', fontWeight: 700,
              cursor: 'pointer', whiteSpace: 'nowrap',
            }}>{l}{k !== 'ALL' ? ' · ' + count(k) : ' · ' + BADGES.items.length}</button>
          );
        })}
      </div>

      {/* Lista challenge */}
      <ModulePanel code={'MOD.BADGE · dettaglio · ' + items.length + ' voci'}>
        <div style={{ display: 'grid', gap: 10 }}>
          {items.map((b, i) => (
            <div key={i} style={{
              border: '1px solid var(--line)', borderLeft: '3px solid ' + ST[b.st].c,
              background: 'var(--bg-3)', padding: '14px 16px',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12, flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{
                    fontSize: 9, letterSpacing: '0.14em', fontWeight: 700, padding: '2px 6px',
                    color: CAT[b.cat] || 'var(--fg-2)', border: '1px solid ' + (CAT[b.cat] || 'var(--fg-2)'),
                  }}>{b.cat}</span>
                  <div>
                    <span style={{ fontSize: 15, fontWeight: 700, fontFamily: 'var(--sans)' }}>{b.n}</span>
                    <span style={{ fontSize: 10, color: 'var(--fg-3)', marginLeft: 8, fontFamily: 'var(--mono)' }}>{b.en}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span className="display tabular" style={{ fontSize: 13, color: 'var(--fg-3)' }}>{b.win}</span>
                  <span style={{ fontSize: 9, letterSpacing: '0.12em', color: ST[b.st].c, border: '1px solid ' + ST[b.st].c, padding: '2px 6px' }}>{ST[b.st].l}</span>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 8, flexWrap: 'wrap' }}>
                <span style={{
                  fontSize: 9, letterSpacing: '0.12em', padding: '2px 6px', fontWeight: 700,
                  color: b.tipo === 'singola' ? 'oklch(82% 0.16 85)' : 'var(--fg-3)',
                  border: '1px solid ' + (b.tipo === 'singola' ? 'oklch(82% 0.16 85)' : 'var(--line-2)'),
                }}>{b.tipo === 'singola' ? 'UNA SOLA ATTIVITÀ' : 'SI SOMMA'}</span>
                <span style={{ fontSize: 12, color: 'var(--fg-2)', fontFamily: 'var(--sans)' }}>{b.req}</span>
              </div>
              {b.prog && (
                <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 9, color: 'var(--fg-3)', letterSpacing: '0.14em' }}>AL {BADGES.snapshot.slice(0, 6)}</span>
                  <span className="display tabular" style={{ fontSize: 16, color: b.st === 'done' ? ST.done.c : 'var(--fg)' }}>{b.prog}</span>
                </div>
              )}
              <div style={{ marginTop: 10, display: 'grid', gap: 5 }}>
                <div style={{ fontSize: 10, color: 'var(--fg-3)', fontFamily: 'var(--mono)', letterSpacing: '0.04em' }}>
                  <span style={{ color: 'oklch(75% 0.14 220)' }}>DATI</span> {b.why}
                </div>
                <div style={{ fontSize: 10, color: 'var(--accent)', fontFamily: 'var(--mono)', letterSpacing: '0.04em' }}>
                  <span>PROPOSTA</span> {b.go}
                </div>
              </div>
            </div>
          ))}
        </div>
      </ModulePanel>

      {/* Stage trimestrali */}
      <ModulePanel code="MOD.BADGE · stage_trimestrali" title="STAGE 3" sub="01 LUG → 30 SET 2026">
        <div style={{ display: 'grid', gap: 8 }}>
          {BADGES.stages.map((s, i) => (
            <div key={i} style={{
              border: '1px solid var(--line)', borderLeft: '3px solid ' + ST[s.st].c,
              background: 'var(--bg-3)', padding: '12px 16px',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 14, fontWeight: 700, fontFamily: 'var(--sans)' }}>{s.n}</span>
                <span style={{ fontSize: 9, letterSpacing: '0.12em', color: ST[s.st].c, border: '1px solid ' + ST[s.st].c, padding: '2px 6px' }}>{ST[s.st].l}</span>
              </div>
              <div style={{ fontSize: 12, color: 'var(--fg-2)', marginTop: 6, fontFamily: 'var(--sans)' }}>{s.req}</div>
              {s.prog && <div className="display tabular" style={{ fontSize: 16, marginTop: 6 }}>{s.prog}</div>}
              <div style={{ fontSize: 10, color: 'var(--fg-3)', marginTop: 6, fontFamily: 'var(--mono)' }}>
                <span style={{ color: 'oklch(75% 0.14 220)' }}>DATI</span> {s.why}
              </div>
            </div>
          ))}
        </div>
      </ModulePanel>

      </div>

      {/* ══ SEZIONE BADGE GARMIN (catalogo permanente) ══ */}
      {sez === 'GARMIN' && (
        <ModulePanel code="MOD.BADGE · garmin_permanenti" title="CATALOGO PERMANENTE" sub="Senza scadenza · solo da prendere + ripetibili · ♻ ogni ripetizione ridà i punti · nomi in inglese: sul tuo Garmin appaiono tradotti · '(da verificare)' = requisito da confermare">
          <div style={{ display: 'grid', gap: 18 }}>
            {(BADGES.garmin || []).map((g, gi) => (
              <div key={gi}>
                <div style={{ fontSize: 11, letterSpacing: '0.16em', fontWeight: 700, color: 'var(--fg)', borderBottom: '1px solid var(--line)', paddingBottom: 6, marginBottom: 8 }}>
                  {g.cat}
                  {g.note && <span style={{ fontWeight: 400, fontSize: 10, color: 'var(--fg-3)', letterSpacing: 0, marginLeft: 10, textTransform: 'none' }}>{g.note}</span>}
                </div>
                <div style={{ display: 'grid', gap: 6 }}>
                  {g.items.map((b, bi) => (
                    <div key={bi} style={{
                      display: 'grid', gridTemplateColumns: '230px 54px 1fr 1fr', gap: 12, alignItems: 'baseline',
                      padding: '8px 10px', background: b.rep ? 'oklch(88% 0.20 130 / 0.06)' : 'var(--bg-3)',
                      borderLeft: '3px solid ' + (b.rep ? 'var(--accent)' : b.pt >= 8 ? 'oklch(82% 0.16 85)' : 'var(--line)'),
                    }}>
                      <div style={{ fontSize: 13, fontWeight: 700, fontFamily: 'var(--sans)' }}>
                        {b.rep ? '♻ ' : ''}{b.n}
                        {b.rep ? <span style={{ fontSize: 9, color: 'var(--fg-3)', fontWeight: 400 }}> ×{b.rep}</span> : null}
                      </div>
                      <div className="display tabular" style={{ fontSize: 14, fontWeight: 700, color: b.pt >= 8 ? 'var(--accent)' : 'var(--fg)' }}>{b.pt}pt</div>
                      <div style={{ fontSize: 11, color: 'var(--fg-2)', lineHeight: 1.5 }}>{b.req}</div>
                      <div style={{ fontSize: 11, color: b.tip === '—' ? 'var(--fg-3)' : 'var(--accent)', lineHeight: 1.5 }}>{b.tip}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </ModulePanel>
      )}

      <div style={{ fontSize: 9, color: 'var(--fg-3)', letterSpacing: '0.1em', padding: '0 4px 8px' }}>
        AGGIORNATO {BADGES.updated} · FONTI: {BADGES.sources.join(' · ')}
      </div>
    </TelemetryChrome>
  );
}

window.BadgePage = BadgePage;
