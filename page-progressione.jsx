// PROGRESSIONE — ski/row: ancore Tier 1, tabelle per durata, intervalli, EF
function ProgressionePage() {
  const { PROG } = window.TRAINING;
  const [mach, setMach] = React.useState('row');
  const P = PROG[mach];

  const BAND_COL = { Z2: 'var(--accent)', Z3: 'oklch(75% 0.15 60)' };
  const PB_BG = 'oklch(88% 0.20 130 / 0.07)';
  const nTot = P.pd.reduce((a, r) => a + r.tot, 0);

  // ---- tabella di classe (continui e intervalli) ----
  const ClsTable = ({ cls, rows, second }) => {
    if (!rows.length) return null;
    const best = Math.max(...rows.map(r => r.w));
    const first = rows[0].w;
    return (
      <div style={{ border: '1px solid var(--line-2)', background: 'var(--bg-3)', padding: '12px 14px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
          <span className="display" style={{ fontSize: 16, letterSpacing: '0.04em' }}>{cls}</span>
          <span style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--fg-3)' }}>
            primo {first} W → best <span style={{ color: 'var(--accent)', fontWeight: 700 }}>{best} W</span>
            {best > first ? <span style={{ color: 'var(--accent)' }}> (+{Math.round((best - first) / first * 100)}%)</span> : null}
          </span>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 10.5, fontFamily: 'var(--mono)' }}>
          <thead>
            <tr style={{ color: 'var(--fg-3)', fontSize: 8.5, letterSpacing: '0.12em', textAlign: 'right' }}>
              <th style={{ textAlign: 'left', padding: '2px 4px' }}>DATA</th>
              <th style={{ textAlign: 'left', padding: '2px 4px' }}>{second}</th>
              <th style={{ padding: '2px 4px' }}>WATT</th>
              <th style={{ padding: '2px 4px' }}>PACE /500m</th>
              <th style={{ padding: '2px 4px' }}>S/M</th>
              <th style={{ padding: '2px 4px' }}>FC</th>
              <th style={{ padding: '2px 4px' }}></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} style={{ borderTop: '1px dashed var(--line-2)', background: r.cur ? 'oklch(88% 0.20 130 / 0.13)' : r.pb ? PB_BG : 'transparent', textAlign: 'right' }}>
                <td style={{ textAlign: 'left', padding: '3px 4px', color: 'var(--fg-3)' }}>{r.d}</td>
                <td style={{ textAlign: 'left', padding: '3px 4px', color: 'var(--fg-2)' }}>{r.struttura || r.pezzo}</td>
                <td style={{ padding: '3px 4px', color: r.pb ? 'var(--accent)' : 'var(--fg)', fontWeight: r.pb ? 700 : 400 }}>{r.w}</td>
                <td style={{ padding: '3px 4px', color: 'var(--fg-2)' }}>{r.pace}</td>
                <td style={{ padding: '3px 4px', color: 'var(--fg-3)' }}>{r.spm || '—'}</td>
                <td style={{ padding: '3px 4px', color: r.hr ? '#E0857E' : 'var(--fg-3)' }}>{r.hr || '—'}</td>
                <td style={{ padding: '3px 4px', fontSize: 8.5, letterSpacing: '0.1em', color: 'var(--accent)', whiteSpace: 'nowrap' }}>{r.cur ? '● BEST ATTUALE' : r.pb ? '▲' : ''}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  // ---- chart EF ----
  const CW = 760, padL = 46, padR = 16, padT = 14;
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

      {/* Continui, una tabella per durata */}
      <ModulePanel code="MOD.CONTINUI · una_tabella_per_durata">
        <div style={{ fontSize: 10, color: 'var(--fg-3)', marginBottom: 12, lineHeight: 1.6 }}>
          Solo pezzi CONTINUI, in ordine di tempo: leggi dall'alto in basso e i <span style={{ color: 'var(--accent)' }}>▲ BEST</span> ti
          dicono quando hai alzato l'asticella di quella durata; <span style={{ color: 'var(--accent)' }}>● BEST ATTUALE</span> è il detentore di oggi. La prima riga è solo il punto di partenza, mai un record. Watt e pace dal logbook C2 · le date con * sono lette
          dal FIT appena registrato, in attesa di controprova col prossimo riepilogo stagione.
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, alignItems: 'start' }}>
          {P.cls.map((c, i) => <ClsTable key={i} cls={'PEZZI ' + c.cls} rows={c.rows} second="PEZZO" />)}
        </div>
      </ModulePanel>

      {/* Intervalli, una tabella per durata di ripetuta */}
      <ModulePanel code="MOD.INTERVALLI · per_durata_della_ripetuta">
        <div style={{ fontSize: 10, color: 'var(--fg-3)', marginBottom: 12, lineHeight: 1.6 }}>
          Sedute a intervalli, raggruppate per durata della SINGOLA ripetuta. I watt sono la media del solo lavoro (i recuperi non contano).
          La struttura è scritta riga per riga: confronta strutture simili — a parità di watt, meno recupero = più forte. La colonna S/M dice a che colpi: stessi watt a colpi più bassi = colpo più potente.
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, alignItems: 'start' }}>
          {P.ints.map((c, i) => <ClsTable key={i} cls={c.cls} rows={c.rows} second="STRUTTURA" />)}
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
          EF = watt medi ÷ FC media, solo continui ≥20′ con fascia (la fascia c'è dal 30/09/25) · n = sedute nel mese: con n così
          piccoli il trend è indicativo — il giudizio vero sta nelle ancore · il caldo estivo alza la FC: i mesi recenti partono svantaggiati.
        </div>
      </ModulePanel>

      {/* Metodo */}
      <ModulePanel code="MOD.METODO · cosa_conta_e_cosa_no">
        <div style={{ fontSize: 11, color: 'var(--fg-2)', lineHeight: 1.9, whiteSpace: 'pre-line' }}>
          {'Fonte primaria: logbook Concept2 dal ' + PROG.firstDate + '; le sedute registrate dopo l\u2019ultimo export entrano SUBITO dai FIT (righe *) e il riepilogo successivo fa da controprova.\n' +
           'Impianto: profilo potenza-durata (best per classe di durata) + benchmark submassimali a FC fissa + test identici ripetuti — gli stessi tre strumenti del monitoraggio endurance standard.\n' +
           'Ancore Tier 1 = test identici ripetuti: sono le uniche righe da cui leggere «sono migliorato di X».\n' +
           'Continui e intervalli stanno in tabelle separate e non si confrontano mai tra loro.\n' +
           'Pace↔watt è una relazione fisica fissa (indipendente dal drag factor): i watt sono confrontabili sempre.\n' +
           'Aggregati mascherati esclusi: il «2k» ski del 07/02 era il 5×400 sommato.\n' +
           'EF sensibile a caldo, sonno e drift — trend, mai verdetti da singola seduta.\n' +
           'Prossime ancore: retest di fine blocco a fine agosto (row a DF 75, ski a DF 61).'}
        </div>
      </ModulePanel>
    </TelemetryChrome>
  );
}
