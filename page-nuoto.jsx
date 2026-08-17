// NUOTO — storia natatoria completa: piscina e acque libere
function NuotoPage() {
  const { HISTORY, TOTALS } = window.TRAINING;
  const swims = HISTORY.filter((h) => h.kind === 'swim');
  const pool = swims.filter((h) => h.filone === 'swim-piscina');
  const ow = swims.filter((h) => h.filone === 'swim-acquelibere');

  const paceSec = (p) => {
    if (!p) return null;
    const m = p.split(':');
    return parseInt(m[0], 10) * 60 + parseFloat(m[1]);
  };
  const distM = (d) => parseFloat((d || '0').replace(/\./g, '').replace(' m', ''));

  // best: pace migliore su sedute ≥500 m · distanza massima
  const bests = (list) => {
    let bp = null, bd = null;
    list.forEach((h) => {
      const dm = distM(h.m.dist), ps = paceSec(h.m.pace);
      if (dm >= 500 && ps && (!bp || ps < paceSec(bp.m.pace))) bp = h;
      if (!bd || dm > distM(bd.m.dist)) bd = h;
    });
    return { bp, bd };
  };
  const pb = bests(pool), ob = bests(ow);

  const totM = (list) => list.reduce((a, h) => a + distM(h.m.dist), 0);

  const Tab = ({ title, sub, list, best }) => (
    <ModulePanel code={'MOD.NUOTO · ' + title.toLowerCase().replace(/ /g, '_')} title={title} sub={sub}>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
          <thead>
            <tr style={{ color: 'var(--fg-3)', fontSize: 9, letterSpacing: '0.12em', textAlign: 'left' }}>
              {['DATA', 'DETTAGLIO', 'METRI', 'TEMPO', 'PACE /100M', 'FC', 'NOTE', ''].map((c, i) => (
                <th key={i} style={{ padding: '6px 10px', borderBottom: '1px solid var(--line)' }}>{c}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {list.map((h, i) => {
              const isBp = best.bp === h, isBd = best.bd === h;
              return (
                <tr key={i} style={{ borderBottom: '1px dashed var(--line-2)', background: isBp ? 'oklch(88% 0.20 130 / 0.07)' : 'transparent' }}>
                  <td className="display tabular" style={{ padding: '7px 10px', whiteSpace: 'nowrap' }}>{h.date}</td>
                  <td style={{ padding: '7px 10px', color: 'var(--fg-2)' }}>{h.m.lavoro}</td>
                  <td className="display tabular" style={{ padding: '7px 10px' }}>{h.m.dist}</td>
                  <td className="display tabular" style={{ padding: '7px 10px' }}>{h.m.dur}</td>
                  <td className="display tabular" style={{ padding: '7px 10px', color: isBp ? 'var(--accent)' : 'inherit', fontWeight: isBp ? 700 : 400 }}>{h.m.pace || '—'}</td>
                  <td className="display tabular" style={{ padding: '7px 10px', color: 'var(--fg-2)' }}>{h.m.fcMed ? h.m.fcMed + '/' + h.m.fcMax : '—'}</td>
                  <td style={{ padding: '7px 10px', fontSize: 10, color: 'var(--fg-3)', maxWidth: 260 }}>{(h.note || '').split('\n')[0]}</td>
                  <td style={{ padding: '7px 10px', fontSize: 10, whiteSpace: 'nowrap' }}>
                    {isBp && <span style={{ color: 'var(--accent)' }}>▲ PACE</span>}
                    {isBd && <span style={{ color: '#00E5FF', marginLeft: 6 }}>▲ DIST</span>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </ModulePanel>
  );

  return (
    <TelemetryChrome active="NUOTO">
      <div style={{ border: '1px solid var(--line)', background: 'var(--bg-2)', padding: 24, marginBottom: 12 }}>
        <div style={{ fontSize: 9, letterSpacing: '0.14em', color: 'var(--fg-3)' }}>// MOD.NUOTO · storia_completa</div>
        <h1 className="display" style={{ fontSize: 34, margin: '6px 0 2px' }}>NUOTO</h1>
        <div style={{ fontSize: 12, color: 'var(--fg-2)' }}>Tutta la storia natatoria dal 12 LUG 2023 · vasca e acque libere · pace sul tempo in movimento</div>
        <div style={{ display: 'flex', gap: 28, marginTop: 16, flexWrap: 'wrap' }}>
          {[
            ['TOTALE', (TOTALS.swim || 0).toFixed(3).replace('.', ',') + ' km'],
            ['SEDUTE', swims.length + ' (+ Steelman in gara)'],
            ['PISCINA', pool.length + ' · ' + Math.round(totM(pool) / 100) / 10 + ' km'],
            ['ACQUE LIBERE', ow.length + ' · ' + Math.round(totM(ow) / 100) / 10 + ' km'],
          ].map(([l, v], i) => (
            <div key={i}>
              <div style={{ fontSize: 9, letterSpacing: '0.12em', color: 'var(--fg-3)' }}>{l}</div>
              <div className="display tabular" style={{ fontSize: 22 }}>{v}</div>
            </div>
          ))}
        </div>
      </div>
      <Tab title="PISCINA" sub={'Vasca · ▲ pace migliore su sedute ≥500 m'} list={pool} best={pb} />
      <Tab title="ACQUE LIBERE" sub={'Mare e laghi · GPS sulle card dello storico quando presente'} list={ow} best={ob} />
      <div style={{ border: '1px dashed var(--line)', padding: '12px 16px', fontSize: 10, color: 'var(--fg-3)', fontFamily: 'var(--mono)' }}>
        METODO — Pace = tempo in movimento / 100 m (le soste in vasca sono escluse). FC dal sensore al polso: in acqua è meno affidabile della fascia.
        Lo Steelman H12 (22 MAG, 983 m in mare) è una gara: vive nella sua card dello storico e non entra nei km di allenamento.
        Le 5 sedute 2023 provengono da file TCX: dati essenziali, senza vasche e SWOLF.
      </div>
    </TelemetryChrome>
  );
}
