// LISTA SPESA — Piano Zappitelli · Telemetry style

var SPESA_DATA = [
  { code: 'FRUTTA_VERDURA', title: 'Frutta e Verdura', color: '#39E75F', items: [
    ['Fruttini (100% frutta, no zuccheri aggiunti)', '21 pz da 100g'],
    ['Spinaci surgelati', '400g (1 busta)'],
    ['Bietole', '400g'],
    ['Zucchine', '400g (4 medie)'],
    ['Peperoni misti', '300g (2 medi)'],
    ['Pomodori', '300g'],
    ['Broccoli', '200g (1 cespo)'],
    ['Fagiolini (anche surgelati)', '200g'],
    ['Finocchi', '200g (1 medio)'],
    ['Lattughino', '400g (2 buste)'],
    ['Limoni', '3-4'],
    ['Aglio', '1 testa'],
    ['Erbe fresche (basilico, prezzemolo, menta)', 'a piacere'],
  ]},
  { code: 'LATTICINI_FRESCO', title: 'Latticini e Fresco', color: '#FFB84D', items: [
    ['Latte parzialmente scremato', '1.5 L'],
    ['Yogurt Greco 0%', '7 × 150g'],
    ['Albume liquido', '800g (2 brick)'],
    ['Uova medie', '6'],
    ['Mozzarella light', '200g'],
    ['Ricotta light', '180g'],
    ['Fiocchi di latte', '200g'],
    ['Grana (per spuntino)', '90g'],
    ['Burro di arachidi', '140g'],
  ]},
  { code: 'PROTEINE_VEG', title: 'Proteine Vegetali', color: '#58ADF7', items: [
    ['Seitan', '110g (1 conf.)'],
    ['Tempeh', '110g (1 conf.)'],
    ['Tofu al naturale', '150g (1 conf.)'],
  ]},
  { code: 'LEGUMI', title: 'Legumi (barattolo/precotti)', color: '#39E75F', items: [
    ['Lenticchie precotte', '1 barattolo (400g)'],
    ['Ceci precotti', '1 barattolo (400g)'],
    ['Fagioli borlotti precotti', '1 barattolo (400g)'],
    ['Fagioli cannellini precotti', '1 barattolo (400g)'],
  ]},
  { code: 'CEREALI_PRIMI', title: 'Cereali, Pasta e Primi', color: '#FFB84D', items: [
    ['Pasta integrale', '300g'],
    ['Riso basmati', '150g'],
    ['Riso integrale (parboiled)', '150g'],
    ['Farro perlato', '150g'],
    ['Orzo perlato', '150g'],
    ['Quinoa', '150g'],
    ['Polenta Valsugana classica/integrale', '330g (1 conf.)'],
    ['Polenta Valsugana Taragna', '150g'],
    ['Polenta Valsugana 5 Cereali', '175g (1 conf.)'],
    ['Pure Pfanni 2×95g', '3 confezioni'],
    ['Fiocchi d\'avena integrali', '420g'],
    ['Gallette di mais', '~28 gallette'],
  ]},
  { code: 'CONDIMENTI', title: 'Condimenti e Dispensa', color: '#6b6b75', items: [
    ['Passata di pomodoro', '1 bottiglia piccola'],
    ['Salsa di soia', '1 bottiglietta'],
    ['Capperi', '1 vasetto piccolo'],
  ]},
];

var SPESA_STORAGE_KEY = 'spesa_zapp_2026';

function SpesaPage() {
  var ATHLETE = window.TRAINING.ATHLETE;

  // ── State from localStorage ──
  var _s = React.useState(function() {
    try { return JSON.parse(localStorage.getItem(SPESA_STORAGE_KEY)) || {}; } catch(e) { return {}; }
  });
  var checked = _s[0];
  var setChecked = _s[1];

  function persist(next) {
    setChecked(next);
    try { localStorage.setItem(SPESA_STORAGE_KEY, JSON.stringify(next)); } catch(e) {}
  }

  function toggle(si, ii) {
    var k = si + '_' + ii;
    var next = Object.assign({}, checked);
    next[k] = !next[k];
    persist(next);
  }

  function resetAll() {
    if (confirm('Resettare tutta la lista?')) persist({});
  }

  // ── Counts ──
  var totalItems = 0;
  var checkedItems = 0;
  SPESA_DATA.forEach(function(sec, si) {
    sec.items.forEach(function(it, ii) {
      totalItems++;
      if (checked[si + '_' + ii]) checkedItems++;
    });
  });
  var pct = totalItems > 0 ? Math.round((checkedItems / totalItems) * 100) : 0;
  var allDone = pct === 100;

  return (
    <TelemetryChrome active="SPESA">
      {/* ── HERO ── */}
      <div style={{ border: '1px solid var(--line)', background: 'var(--bg-2)', padding: 24, marginBottom: 12 }}>
        <div style={{ fontSize: 11, color: 'var(--fg-3)', letterSpacing: '0.18em', marginBottom: 8 }}>
          // GROCERY_LIST · PIANO ZAPPITELLI · S{ATHLETE.programWeek}
        </div>
        <div className="display r-display-hero" style={{ fontSize: 'var(--display-hero)', lineHeight: 0.9 }}>
          LIS<span style={{ color: 'var(--accent)' }}>TA.</span>
        </div>
        <div style={{ fontSize: 11, color: 'var(--fg-3)', letterSpacing: '0.1em', marginTop: 10 }}>
          Clicca per spuntare · stato salvato nel browser
        </div>
      </div>

      {/* ── PROGRESS BAR ── */}
      <div style={{
        border: '1px solid ' + (allDone ? 'var(--accent)' : 'var(--line)'),
        background: 'var(--bg-2)', padding: 16, marginBottom: 12
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <div style={{ fontSize: 11, color: 'var(--fg-3)', letterSpacing: '0.18em' }}>// PROGRESS</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
            <span className="display tabular" style={{ fontSize: 32, color: allDone ? 'var(--accent)' : 'var(--fg)', lineHeight: 1 }}>{checkedItems}</span>
            <span style={{ fontSize: 14, color: 'var(--fg-3)' }}>/ {totalItems}</span>
            {allDone && <span style={{ fontSize: 11, color: 'var(--accent)', letterSpacing: '0.1em', marginLeft: 8 }}>TUTTO PRESO</span>}
          </div>
        </div>
        <div style={{ height: 8, background: 'var(--bg)', border: '1px solid var(--line)', position: 'relative' }}>
          <div style={{
            height: '100%', width: pct + '%',
            background: allDone
              ? 'var(--accent)'
              : 'linear-gradient(90deg, var(--accent-2), var(--accent))',
            transition: 'width 0.4s ease'
          }} />
        </div>
        <div style={{ fontSize: 10, color: 'var(--fg-3)', letterSpacing: '0.1em', marginTop: 6, textAlign: 'right' }}>
          {pct}%
        </div>
      </div>

      {/* ── SECTIONS ── */}
      {SPESA_DATA.map(function(sec, si) {
        var secChecked = 0;
        sec.items.forEach(function(it, ii) {
          if (checked[si + '_' + ii]) secChecked++;
        });
        var secDone = secChecked === sec.items.length;

        return (
          <div key={si} style={{
            border: '1px solid ' + (secDone ? sec.color + '66' : 'var(--line)'),
            background: 'var(--bg-2)', marginBottom: 12
          }}>
            {/* Section header */}
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '12px 16px', borderBottom: '1px solid var(--line)'
            }}>
              <div>
                <div style={{ fontSize: 10, color: sec.color, letterSpacing: '0.18em' }}>// {sec.code}</div>
                <div className="display" style={{ fontSize: 20, lineHeight: 1, marginTop: 4 }}>{sec.title}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                <span className="display tabular" style={{
                  fontSize: 22, color: secDone ? sec.color : 'var(--fg)', lineHeight: 1
                }}>{secChecked}</span>
                <span style={{ fontSize: 12, color: 'var(--fg-3)' }}>/{sec.items.length}</span>
              </div>
            </div>

            {/* Items */}
            {sec.items.map(function(it, ii) {
              var k = si + '_' + ii;
              var isChecked = !!checked[k];
              return (
                <div key={ii} onClick={function() { toggle(si, ii); }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '10px 16px',
                    borderBottom: ii < sec.items.length - 1 ? '1px solid var(--line)' : 'none',
                    cursor: 'pointer',
                    opacity: isChecked ? 0.35 : 1,
                    transition: 'opacity 0.2s',
                    background: isChecked ? 'rgba(255,255,255,0.01)' : 'transparent'
                  }}
                >
                  {/* Checkbox */}
                  <div style={{
                    width: 18, height: 18, flexShrink: 0,
                    border: '2px solid ' + (isChecked ? sec.color : 'var(--line-2)'),
                    background: isChecked ? sec.color : 'transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.15s',
                    fontSize: 11, color: '#000', fontWeight: 700
                  }}>
                    {isChecked ? '✓' : ''}
                  </div>
                  {/* Name */}
                  <span style={{
                    flex: 1, fontSize: 13, fontFamily: 'var(--sans)',
                    color: isChecked ? 'var(--fg-3)' : 'var(--fg-2)',
                    textDecoration: isChecked ? 'line-through' : 'none'
                  }}>{it[0]}</span>
                  {/* Qty */}
                  <span style={{
                    fontSize: 12, fontFamily: 'var(--mono)', color: 'var(--fg-3)',
                    whiteSpace: 'nowrap', letterSpacing: '0.04em'
                  }}>{it[1]}</span>
                </div>
              );
            })}
          </div>
        );
      })}

      {/* ── RESET BUTTON ── */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
        <button onClick={resetAll} style={{
          background: 'transparent',
          color: 'var(--warn)',
          border: '1px solid var(--warn)',
          padding: '8px 24px',
          fontFamily: 'var(--display)',
          fontSize: 13, fontWeight: 700, letterSpacing: '0.08em',
          cursor: 'pointer',
          transition: 'background 0.15s, color 0.15s'
        }}
        onMouseOver={function(e) { e.target.style.background = 'var(--warn)'; e.target.style.color = '#000'; }}
        onMouseOut={function(e) { e.target.style.background = 'transparent'; e.target.style.color = 'var(--warn)'; }}
        >RESET LISTA</button>
      </div>

      {/* ── NOTE ── */}
      <div style={{
        border: '1px solid var(--line)', background: 'var(--bg-2)',
        padding: 16, marginBottom: 12
      }}>
        <div style={{ fontSize: 10, color: 'var(--fg-3)', letterSpacing: '0.18em', marginBottom: 8 }}>// NOTE</div>
        <div style={{ fontSize: 11, color: 'var(--fg-3)', lineHeight: 1.7, fontFamily: 'var(--mono)' }}>
          Legumi: 60g secchi = 180g cotti. Barattolo da 400g = ne usi meta.<br/>
          Pure Pfanni: 150g polvere per volta = 1 busta (95g) + 55g dalla seconda. 3 cene = 3 conf.<br/>
          Polenta classica/integrale: 1 conf. da 330g basta per Lun+Mer (usi 300g).
        </div>
      </div>
    </TelemetryChrome>
  );
}

window.SpesaPage = SpesaPage;
