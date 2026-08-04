// PROGRESSIONE — ski/row: curva potenza-durata per epoca, EF, ancore Tier 1
function ProgressionePage() {
  const { PROG } = window.TRAINING;
  const [mach, setMach] = React.useState('row');
  const P = PROG[mach];

  const ERA_COL = ['oklch(45% 0.06 300)', 'oklch(50% 0.02 260)', 'var(--fg-3)', 'oklch(72% 0.10 250)', 'var(--accent)'];
  const BAND_COL = { Z2: 'var(--accent)', Z3: 'oklch(75% 0.15 60)' };
  const nTot = P.pd.reduce((a, r) => a + r.tot, 0);

  // ---- chart potenza-durata ----
  const DURS = P.pd[0].vals.map(v => v.min);
  const allW = P.pd.flatMap(r => r.vals.filter(v => v.w).map(v => v.w));
  const wMin = Math.floor((Math.min(...allW) - 15) / 20) * 20, wMax = Math.ceil((Math.max(...allW) + 15) / 20) * 20;
  const CW = 760, CH = 300, padL = 46, padR = 16, padT = 14, padB = 30;
  const x = i => padL + i * (CW - padL - padR) / (DURS.length - 1);
  const y = w => padT + (wMax - w) * (CH - padT - padB) / (wMax - wMin);

  const pdChart = (
    <svg viewBox={'0 0 ' + CW + ' ' + CH} width="100%" style={{ display: 'block' }}>
      {Array.from({ length: (wMax - wMin) / 20 + 1 }, (_, k) => wMin + k * 20).map(w => (
        <g key={w}>
          <line x1={padL} x2={CW - padR} y1={y(w)} y2={y(w)} stroke="var(--line)" strokeWidth="0.5" />
          <text x={padL - 6} y={y(w) + 3} textAnchor="end" fontSize="9" fill="var(--fg-3)" fontFamily="var(--mono)">{w}</text>
        </g>
      ))}
      {DURS.map((d, i) => (
        <text key={d} x={x(i)} y={CH - 10} textAnchor="middle" fontSize="10" fill="var(--fg-3)" fontFamily="var(--mono)">{d}′</text>
      ))}
      {P.pd.map((era, e) => {
        const pts = era.vals.map((v, i) => v.w ? [x(i), y(v.w), v.w, i] : null).filter(Boolean);
        if (!pts.length) return null;
        const path = pts.map((p, k) => (k ? 'L' : 'M') + p[0] + ' ' + p[1]).join(' ');
        return (
          <g key={e}>
            <path d={path} fill="none" stroke={ERA_COL[e]} strokeWidth={e === 4 ? 2.5 : 1.5} opacity={e === 4 ? 1 : 0.85} />
            {pts.map(p => (
              <g key={p[3]}>
                <circle cx={p[0]} cy={p[1]} r={e === 4 ? 4 : 2.5} fill={ERA_COL[e]} />
                {(e === 4 || e === 2) && <text x={p[0]} y={p[1] + (e === 4 ? -8 : 14)} textAnchor="middle" fontSize="10"
                  fill={ERA_COL[e]} fontFamily="var(--display)" fontWeight="700">{p[2]}</text>}
              </g>
            ))}
          </g>
        );
      })}
    </svg>
  );

  // tabella delta: primo dato documentato vs epoca corrente
  const pdRows = DURS.map((D, i) => {
    const cells = P.pd.map(era => era.vals[i]);
    const firstIdx = cells.findIndex(c => c && c.w);
    const last = cells[cells.length - 1];
    const first = firstIdx >= 0 ? cells[firstIdx] : null;
    let delta = null;
    if (first && first.w && last && last.w && firstIdx < cells.length - 1)
      delta = { v: last.w - first.w, p: (last.w - first.w) / first.w * 100 };
    return { D, cells, delta, firstIdx };
  });

  // ---- chart EF ----
  const MONTHS = [];
  for (let yy = 2025, mm = 5; yy < 2027 && !(yy === 2026 && mm > 8); mm === 12 ? (yy++, mm = 1) : mm++)
    MONTHS.push(yy + '-' + String(mm).padStart(2, '0'));
  const efAll = Object.values(P.ef).flatMap(pts => pts.map(p => p.ef));
  const hasEf = efAll.length > 0;
  const eMin = hasEf ? Math.floor(Math.min(...efAll) * 10) / 10 - 0.05 : 1;
  const eMax = hasEf ? Math.ceil(Math.max(...efAll) * 10) / 10 + 0.05 : 2;
  const EH = 230, epadB = 40;
  const ex = m => padL + MONTHS.indexOf(m) * (CW - padL - padR) / (MONTHS.length - 1);
  const ey = v => padT + (eMax - v) * (EH - padT - epadB) / (eMax - eMin);

  const efChart = hasEf && (
    <svg viewBox={'0 0 ' + CW + ' ' + EH} width="100%" style={{ display: 'block' }}>
      {[0, 1, 2, 3, 4].map(k => {
        const v = Math.round((eMin + k * (eMax - eMin) / 4) * 100) / 100;
        return (
          <g key={k}>
            <line x1={padL} x2={CW - padR} y1={ey(v)} y2={ey(v)} stroke="var(--line)" strokeWidth="0.5" />
            <text x={padL - 6} y={ey(v) + 3} textAnchor="end" fontSize="9" fill="var(--fg-3)" fontFamily="var(--mono)">{v.toFixed(2)}</text>
          </g>
        );
      })}
      {MONTHS.map((m, i) => i % 2 === 0 && (
        <text key={m} x={ex(m)} y={EH - 22} textAnchor="middle" fontSize="8.5" fill="var(--fg-3)" fontFamily="var(--mono)"
          transform={'rotate(-38 ' + ex(m) + ' ' + (EH - 22) + ')'}>{m.slice(2).replace('-', '/')}</text>
      ))}
      {Object.entries(P.ef).map(([band, pts]) => {
        if (!pts.length) return null;
        const path = pts.map((p, k) => (k ? 'L' : 'M') + ex(p.mth) + ' ' + ey(p.ef)).join(' ');
        return (
          <g key={band}>
            <path d={path} fill="none" stroke={BAND_COL[band]} strokeWidth="1.5" strokeDasharray="4 3" opacity="0.8" />
            {pts.map(p => (
              <g key={p.mth}>
                <circle cx={ex(p.mth)} cy={ey(p.ef)} r={2 + Math.min(p.n, 4)} fill={BAND_COL[band]} opacity="0.85" />
                <text x={ex(p.mth)} y={ey(p.ef) - 9} textAnchor="middle" fontSize="8" fill={BAND_COL[band]} fontFamily="var(--mono)">n{p.n}</text>
              </g>
            ))}
          </g>
        );
      })}
    </svg>
  );

  return (
    <TelemetryChrome active="PROGRESSI">
      {/* Titolo + switch macchina */}
      <div className="r-agenda-title" style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 16, marginBottom: 12 }}>
        <div style={{ border: '1px solid var(--line)', background: 'var(--bg-2)', padding: 24 }}>
          <div style={{ fontSize: 11, color: 'var(--fg-3)', letterSpacing: '0.18em', marginBottom: 8 }}>
            // PROGRESSIONE_ERG · dal {PROG.firstDate}
          </div>
          <div className="display r-display-hero" style={{ fontSize: 'var(--display-hero)', lineHeight: 0.9 }}>
            PROGRESSI<span style={{ color: 'var(--accent)' }}>.</span>
          </div>
          <div style={{ fontSize: 11, color: 'var(--fg-3)', letterSpacing: '0.12em', marginTop: 12 }}>
            {nTot} SEDUTE {mach.toUpperCase()} SUL LOGBOOK C2 · STESSO METRO 2025↔2026 · AGGIORNATO {PROG.built}
          </div>
        </div>
        <div style={{ border: '1px solid var(--line)', background: 'var(--bg-2)', padding: 20, display: 'flex', flexDirection: 'column', gap: 8, justifyContent: 'center' }}>
          {[['row', 'ROW — RowErg'], ['ski', 'SKI — SkiErg']].map(([k, l]) => (
            <button key={k} onClick={() => setMach(k)} style={{
              padding: '12px 16px', cursor: 'pointer', textAlign: 'left',
              background: mach === k ? 'var(--accent)' : 'transparent',
              color: mach === k ? '#000' : 'var(--fg-2)',
              border: '1px solid ' + (mach === k ? 'var(--accent)' : 'var(--line)'),
              fontFamily: 'var(--display)', fontSize: 15, fontWeight: 800, letterSpacing: '0.06em',
            }}>{l}</button>
          ))}
        </div>
      </div>

      {/* Ancore Tier 1 */}
      <ModulePanel code="MOD.ANCORE · test_identici_Tier1" accent>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {P.anchors.map((a, i) => (
            <div key={i} style={{ border: '1px solid var(--line-2)', background: 'var(--bg-3)', padding: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 700, fontFamily: 'var(--sans)', marginBottom: 10 }}>{a.name}</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 11, color: 'var(--fg-3)' }}>{a.base}</span>
                <span style={{ color: 'var(--fg-3)' }}>→</span>
                <span style={{ fontSize: 11, color: 'var(--fg-2)' }}>{a.last}</span>
              </div>
              <div className="display" style={{ fontSize: 26, color: 'var(--accent)', marginTop: 8 }}>{a.delta}</div>
              <div style={{ fontSize: 10, color: 'var(--fg-3)', marginTop: 6, lineHeight: 1.5 }}>{a.note}</div>
            </div>
          ))}
        </div>
      </ModulePanel>

      {/* Curva potenza-durata */}
      <ModulePanel code="MOD.PD · watt_su_durata_per_epoca">
        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 10, fontSize: 10, letterSpacing: '0.1em' }}>
          {P.pd.map((era, e) => (
            <span key={e} style={{ display: 'flex', alignItems: 'center', gap: 6, color: ERA_COL[e] }}>
              <span style={{ width: 14, height: 3, background: ERA_COL[e] }} />
              {era.era} · {era.n} continui / {era.tot}
            </span>
          ))}
        </div>
        {pdChart}
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 14, fontSize: 11, fontFamily: 'var(--mono)' }}>
          <thead>
            <tr style={{ color: 'var(--fg-3)', fontSize: 9, letterSpacing: '0.12em' }}>
              <th style={{ textAlign: 'left', padding: '4px 6px' }}>DURATA</th>
              {P.pd.map((era, e) => <th key={e} style={{ textAlign: 'right', padding: '4px 6px', color: ERA_COL[e] }}>{era.era}</th>)}
              <th style={{ textAlign: 'right', padding: '4px 6px' }}>Δ VS PRIMO DATO</th>
            </tr>
          </thead>
          <tbody>
            {pdRows.map(r => (
              <tr key={r.D} style={{ borderTop: '1px dashed var(--line-2)' }}>
                <td style={{ padding: '6px 6px', color: 'var(--fg-2)' }}>≥{r.D}′</td>
                {r.cells.map((c, e) => (
                  <td key={e} style={{ textAlign: 'right', padding: '6px 6px', color: e === P.pd.length - 1 ? 'var(--fg)' : 'var(--fg-2)' }}>
                    {c && c.w ? <span>{c.w} W <span style={{ color: 'var(--fg-3)', fontSize: 9 }}>{c.pace}</span></span> : <span style={{ color: 'var(--fg-3)' }}>—</span>}
                  </td>
                ))}
                <td style={{ textAlign: 'right', padding: '6px 6px' }}>
                  {r.delta ? <span style={{ color: r.delta.v >= 0 ? 'var(--accent)' : 'oklch(70% 0.15 30)', fontWeight: 600 }}>
                    {(r.delta.v >= 0 ? '+' : '−') + Math.abs(r.delta.v)} W ({(r.delta.v >= 0 ? '+' : '−') + Math.abs(r.delta.p).toFixed(0)}%)
                  </span> : <span style={{ color: 'var(--fg-3)' }}>—</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ fontSize: 10, color: 'var(--fg-3)', marginTop: 10, lineHeight: 1.6 }}>
          Solo pezzi continui del logbook C2 (intervalli esclusi) · inviluppo: miglior seduta con durata ≥ soglia ·
          una casella più bassa della precedente significa «non provato in quell'epoca», non «peggiorato».
        </div>
      </ModulePanel>

      {/* EF */}
      <ModulePanel code="MOD.EF · watt_per_battito_mediana_mensile">
        <div style={{ display: 'flex', gap: 14, marginBottom: 10, fontSize: 10, letterSpacing: '0.1em' }}>
          {Object.keys(P.ef).map(b => (
            <span key={b} style={{ display: 'flex', alignItems: 'center', gap: 6, color: BAND_COL[b] }}>
              <span style={{ width: 10, height: 10, borderRadius: 5, background: BAND_COL[b] }} />
              {b === 'Z2' ? 'Z2 (120-135 bpm)' : 'Z3 (136-149 bpm)'}
            </span>
          ))}
        </div>
        {efChart || <div style={{ fontSize: 11, color: 'var(--fg-3)' }}>Nessun continuo ≥20′ in banda con FC registrata.</div>}
        <div style={{ fontSize: 10, color: 'var(--fg-3)', marginTop: 10, lineHeight: 1.6 }}>
          EF = watt medi ÷ FC media, solo continui ≥20′ con fascia · n = sedute nel mese: con n così piccoli il trend è
          indicativo — il giudizio vero sta nelle ancore qui sopra · il caldo estivo alza la FC: i mesi recenti partono svantaggiati.
        </div>
      </ModulePanel>

      {/* Metodo */}
      <ModulePanel code="MOD.METODO · cosa_conta_e_cosa_no">
        <div style={{ fontSize: 11, color: 'var(--fg-2)', lineHeight: 1.9, whiteSpace: 'pre-line' }}>
          {'Fonte unica: logbook Concept2 dal ' + PROG.firstDate + ' — stesso metro per 2025 e 2026, niente confronti tra metodi diversi.\n' +
           'Ancore Tier 1 = test identici ripetuti: sono le uniche righe da cui leggere «sono migliorato di X».\n' +
           'Curva potenza-durata: solo sforzi continui — esclusi gli intervalli e gli aggregati mascherati (il «2k» ski del 07/02 era il 5×400 sommato).\n' +
           'Pace↔watt è una relazione fisica fissa (indipendente dal drag factor): i watt qui sono confrontabili sempre.\n' +
           'EF su banda FC: sensibile a caldo, sonno e drift — trend, mai verdetti da singola seduta.\n' +
           'Prossime ancore: retest di fine blocco a fine agosto (row a DF 75, ski a DF 61).'}
        </div>
      </ModulePanel>
    </TelemetryChrome>
  );
}
