// SETTIMANA TIPO — gli slot fissi della settimana su una timeline oraria vera.
// Il colore e' il LUOGO, non lo sport: serve a sapere dove devo essere e cosa prenotare.
function SettimanaPage() {
  const { SETTIMANA_TIPO } = window.TRAINING;
  const ST = SETTIMANA_TIPO;
  const L = ST.luoghi;

  const H0 = 7;    // prima ora mostrata
  const H1 = 21;   // ultima ora mostrata
  const ROW = 58;  // pixel per ora — 45' = 26 px utili, basta per nome + orario
  const H = (H1 - H0) * ROW;

  const ore = [];
  for (let h = H0; h <= H1; h++) ore.push(h);

  const oggi = ['DOM', 'LUN', 'MAR', 'MER', 'GIO', 'VEN', 'SAB'][new Date().getDay()];
  // la domenica e' riposo: non la disegno, le altre sei colonne respirano
  const GIORNI = ST.giorni.filter((g) => g.d !== 'DOM');

  const hhmm = (v) => {
    const h = Math.floor(v);
    const m = Math.round((v - h) * 60);
    return h + ':' + (m < 10 ? '0' : '') + m;
  };

  // conteggi utili
  const nPrenota = ST.giorni.reduce((a, g) => a + g.slot.filter((s) => s.prenota).length, 0);
  const nSlot = ST.giorni.reduce((a, g) => a + g.slot.length, 0);

  return (
    <TelemetryChrome active="SETTIMANA">
      {/* Titolo */}
      <div className="r-agenda-title" style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 16, marginBottom: 12 }}>
        <div style={{ border: '1px solid var(--line)', background: 'var(--bg-2)', padding: 24 }}>
          <div style={{ fontSize: 11, color: 'var(--fg-3)', letterSpacing: '0.18em', marginBottom: 8 }}>
            // WEEK_TEMPLATE · aggiornata {ST.updated}
          </div>
          <div className="display r-display-hero" style={{ fontSize: 'var(--display-hero)', lineHeight: 0.9 }}>
            SETTIMANA<span style={{ color: 'var(--accent)' }}>.</span>
          </div>
          <div style={{ fontSize: 11, color: 'var(--fg-3)', letterSpacing: '0.12em', marginTop: 12 }}>
            {nSlot} SLOT FISSI · {nPrenota} CLASSI DA PRENOTARE · SOLO GLI IMPEGNI, NON I LAVORI
          </div>
        </div>
        <div style={{ border: '1px solid var(--line)', background: 'var(--bg-2)', padding: 20 }}>
          <div style={{ fontSize: 11, color: 'var(--fg-3)', letterSpacing: '0.18em', marginBottom: 14 }}>// DOVE</div>
          {Object.keys(L).map((k) => (
            <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <span style={{ width: 10, height: 10, background: L[k].c, flexShrink: 0 }} />
              <span style={{ fontSize: 11, color: 'var(--fg-2)', letterSpacing: '0.12em', flex: 1 }}>{L[k].l}</span>
              <span className="display tabular" style={{ fontSize: 16, color: L[k].c }}>
                {ST.giorni.reduce((a, g) => a + g.slot.filter((s) => s.p === k).length, 0)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* TIMELINE */}
      <ModulePanel code="MOD.SETTIMANA · timeline_oraria" accent>
        <div style={{ display: 'grid', gridTemplateColumns: '54px repeat(6, 1fr)', gap: 4 }}>
          <div />
          {GIORNI.map((g) => (
            <div key={g.d} style={{
              fontSize: 11, letterSpacing: '0.14em', textAlign: 'center', paddingBottom: 6,
              color: g.d === oggi ? 'var(--accent)' : 'var(--fg-3)',
              fontWeight: g.d === oggi ? 700 : 400,
            }}>{g.d}</div>
          ))}

          {/* colonna ore */}
          <div style={{ position: 'relative', height: H }}>
            {ore.map((h) => (
              <div key={h} className="tabular" style={{
                position: 'absolute', top: (h - H0) * ROW - 6, right: 8,
                fontSize: 10, color: 'var(--fg-3)',
              }}>{h}:00</div>
            ))}
          </div>

          {/* colonne giorni */}
          {GIORNI.map((g) => (
            <div key={g.d} style={{
              position: 'relative', height: H,
              background: g.d === oggi ? 'oklch(88% 0.20 130 / 0.05)' : 'transparent',
              border: '1px solid ' + (g.d === oggi ? 'var(--accent)' : 'var(--line)'),
            }}>
              {/* righe delle ore */}
              {ore.map((h) => (
                <div key={h} style={{
                  position: 'absolute', top: (h - H0) * ROW, left: 0, right: 0, height: 1,
                  background: h % 2 === 0 ? 'var(--line-2)' : 'var(--line)', opacity: 0.5,
                }} />
              ))}
              {/* slot — chi si sovrappone va in corsie affiancate */}
              {(() => {
                const ord = g.slot.slice().sort((x, y) => x.h - y.h);
                const lane = [];
                const info = ord.map((s) => {
                  let k = 0;
                  while (k < lane.length && lane[k] > s.h + 0.001) k++;
                  lane[k] = s.e;
                  return { s, k };
                });
                const nLane = Math.max(1, lane.length);
                return info.map(({ s, k }, i) => {
                const col = L[s.p].c;
                const top = (s.h - H0) * ROW;
                const hgt = Math.max((s.e - s.h) * ROW - 3, 18);
                const w = 100 / nLane;
                return (
                  <div key={i} title={s.n + ' · ' + hhmm(s.h) + '→' + hhmm(s.e) + ' · ' + L[s.p].l + (s.istr ? ' · ' + s.istr : '')} style={{
                    position: 'absolute', top: top + 1, left: 'calc(' + (k * w) + '% + 2px)', width: 'calc(' + w + '% - 4px)', height: hgt,
                    background: 'color-mix(in oklch, ' + col + ' 18%, var(--bg-2))',
                    borderLeft: '3px solid ' + col,
                    padding: '4px 6px', overflow: 'hidden',
                    display: 'flex', flexDirection: 'column', gap: 1, minWidth: 0,
                  }}>
                    <div style={{
                      fontSize: 10, fontWeight: 700, letterSpacing: '0.02em', color: col, lineHeight: 1.1,
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>
                      {s.n}{s.prenota ? ' ●' : ''}
                    </div>
                    <div className="tabular" style={{
                      fontSize: 9, color: 'var(--fg-3)', lineHeight: 1.1,
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>
                      {hhmm(s.h)}→{hhmm(s.e)}
                    </div>
                    {s.istr && hgt > 60 && (
                      <div style={{
                        fontSize: 9, color: 'var(--fg-3)', lineHeight: 1.1, fontFamily: 'var(--sans)',
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      }}>{s.istr}</div>
                    )}
                  </div>
                );
                });
              })()}
            </div>
          ))}
        </div>
        <div style={{ borderTop: '1px dashed var(--line-2)', paddingTop: 10, marginTop: 12 }}>
          <div style={{ fontSize: 10, color: 'var(--fg-3)', letterSpacing: '0.12em', marginBottom: 8 }}>
            ● DA PRENOTARE SULL'APP VIRGIN
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {ST.giorni.map((g) => g.slot.filter((s) => s.prenota).map((s, i) => (
              <div key={g.d + i} style={{
                border: '1px solid ' + L.virgin.c, background: 'color-mix(in oklch, ' + L.virgin.c + ' 10%, var(--bg-2))',
                padding: '6px 10px', display: 'flex', alignItems: 'baseline', gap: 8,
              }}>
                <span style={{ fontSize: 10, letterSpacing: '0.12em', color: L.virgin.c, fontWeight: 700 }}>{g.d}</span>
                <span className="tabular" style={{ fontSize: 11, color: 'var(--fg)' }}>{hhmm(s.h)}</span>
                <span style={{ fontSize: 11, color: 'var(--fg)', fontFamily: 'var(--sans)', fontWeight: 600 }}>{s.n}</span>
                {s.istr && <span style={{ fontSize: 10, color: 'var(--fg-3)', fontFamily: 'var(--sans)' }}>{s.istr}</span>}
              </div>
            )))}
          </div>
        </div>
      </ModulePanel>

      {/* NOTE */}
      <ModulePanel code="MOD.SETTIMANA · promemoria">
        <div style={{ display: 'grid', gap: 8 }}>
          {ST.note.map((n, i) => (
            <div key={i} style={{
              border: '1px solid var(--line)', borderLeft: '3px solid var(--accent)',
              background: 'var(--bg-3)', padding: '10px 14px',
              fontSize: 12, color: 'var(--fg-2)', fontFamily: 'var(--sans)',
            }}>{n}</div>
          ))}
        </div>
      </ModulePanel>
    </TelemetryChrome>
  );
}
