// ANALISI GARA — HYROX ROMA 24/09/2026 · Doubles Men
function GaraRomaPage() {
  var A = window.TRAINING.GARA_ROMA;

  var Sec = function (p) {
    return (
      <div style={{ marginBottom: 22 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 10, borderBottom: '1px solid var(--line-2)', paddingBottom: 6 }}>
          <span style={{ fontFamily: 'var(--display)', fontSize: 18, letterSpacing: '0.04em', color: 'var(--accent)' }}>{p.n}</span>
          <span style={{ fontFamily: 'var(--display)', fontSize: 18, letterSpacing: '0.04em' }}>{p.t}</span>
        </div>
        {p.children}
      </div>
    );
  };

  var P = function (p) {
    return <div style={{ fontSize: 12, color: 'var(--fg-2)', lineHeight: 1.75, marginBottom: 10, whiteSpace: 'pre-line', maxWidth: 900 }}>{p.children}</div>;
  };

  var Box = function (p) {
    var c = p.tone === 'warn' ? 'var(--warn)' : (p.tone === 'ok' ? 'var(--accent)' : 'var(--line)');
    return (
      <div style={{ border: '1px solid ' + c, borderLeft: '3px solid ' + c, background: 'var(--bg-2)', padding: '10px 14px', marginBottom: 12, maxWidth: 900 }}>
        {p.title && <div style={{ fontFamily: 'var(--display)', fontSize: 13, letterSpacing: '0.08em', color: c, marginBottom: 6 }}>{p.title}</div>}
        <div style={{ fontSize: 11.5, color: 'var(--fg-2)', lineHeight: 1.7, whiteSpace: 'pre-line' }}>{p.children}</div>
      </div>
    );
  };

  var Tab = function (p) {
    return (
      <div style={{ overflowX: 'auto', marginBottom: 14 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--mono)', fontSize: 11 }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--line)' }}>
              {p.h.map(function (x, i) {
                return <th key={i} style={{ textAlign: i === 0 ? 'left' : 'right', padding: '7px 8px', color: 'var(--fg-3)', letterSpacing: '0.1em', fontWeight: 600, whiteSpace: 'nowrap' }}>{x}</th>;
              })}
            </tr>
          </thead>
          <tbody>
            {p.r.map(function (row, ri) {
              var hi = p.hi && p.hi.indexOf(ri) >= 0;
              return (
                <tr key={ri} style={{ borderBottom: '1px solid var(--line-2)', background: hi ? 'rgba(184,255,87,0.07)' : 'transparent' }}>
                  {row.map(function (c, ci) {
                    return <td key={ci} style={{
                      textAlign: ci === 0 ? 'left' : 'right', padding: '6px 8px', whiteSpace: 'nowrap',
                      color: ci === 0 ? 'var(--accent)' : (hi ? '#fff' : 'var(--fg-2)'),
                      fontWeight: (ci === 0 || hi) ? 700 : 400
                    }}>{c}</td>;
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <TelemetryChrome active="STORICO">
      {/* HERO */}
      <div style={{ border: '1px solid var(--accent)', background: 'var(--bg-2)', padding: '18px 20px', marginBottom: 20 }}>
        <div style={{ fontSize: 10, color: 'var(--fg-3)', letterSpacing: '0.2em', marginBottom: 6 }}>// ANALISI_GARA · 24 SET 2026</div>
        <div className="display" style={{ fontSize: 34, lineHeight: 1, marginBottom: 8 }}>HYROX ROMA · 1:03:53</div>
        <div style={{ fontSize: 12, color: 'var(--fg-2)', letterSpacing: '0.04em' }}>
          Doubles Men con Attilio Armando Tronca · bib 105018 · start 10:50:02
        </div>
        <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap', marginTop: 14 }}>
          {[['TEMPO', '1:03:53'], ['DIVISIONE (gio)', '51°'], ['CATEGORIA 40-44', '3°'], ['OVERALL 5 GG', '213° · 10° AG'], ['FC MEDIA', '158,2'], ['FC MAX', '174']].map(function (x, i) {
            return (
              <div key={i}>
                <div style={{ fontSize: 9.5, color: 'var(--fg-3)', letterSpacing: '0.14em' }}>{x[0]}</div>
                <div className="display" style={{ fontSize: 20, lineHeight: 1.2 }}>{x[1]}</div>
              </div>
            );
          })}
        </div>
      </div>

      <Box title="COME LEGGERE QUESTA PAGINA">
        I dati vengono da tre fonti incrociate: il cronometraggio ufficiale Hyrox (workout summary + race replay), il FIT del Garmin e la ripartizione del lavoro col partner dichiarata da Federico.
        Il Garmin è partito allo start esatto della gara: la roxzone ricalcolata dai battiti fa 5:25, identica al dato ufficiale — l'allineamento è verificato, non stimato.
      </Box>

      <Sec n="01" t="I PIAZZAMENTI">
        <Box tone="warn" title="ATTENZIONE AL CRITERIO">
          I piazzamenti di stazione sono quelli DEL GIORNO, dentro la propria divisione (fonte: Rox Lyfe, «Leaderboard Explained»). Valgono quindi i numeri della vista “Doubles · Thursday”.
          La vista “Overall” mostra per le stazioni numeri molto migliori (SkiErg 14, Row 15, Run Total 9) su un insieme che Hyrox non documenta: l’ipotesi coerente è la categoria d’età, ma resta un’inferenza. Non vanno usati.
        </Box>
        <P>Metro di riferimento: il <b>51° posto complessivo</b> del giovedì. Sopra quella linea ci sono solo tre voci.</P>
        <Tab h={['SEGMENTO', 'RANK', 'VS 51°']} hi={[0, 1, 2]} r={[
          ['Best Run Lap', '41', 'meglio'],
          ['SkiErg 1000 m', '47', 'meglio'],
          ['Run Total', '47', 'meglio'],
          ['Row 1000 m', '62', 'peggio'],
          ['Wall Balls', '62', 'peggio'],
          ['Roxzone', '69', 'peggio'],
          ['Sandbag Lunges', '121', 'peggio'],
          ['Burpee Broad Jump', '132', 'peggio'],
          ['Farmers Carry', '132', 'peggio'],
          ['Sled Pull', '169', 'peggio'],
          ['Sled Push', '223', 'molto peggio'],
        ]} />
        <P>{'La corsa è il punto forte RELATIVO, non un’eccellenza assoluta: quattro posizioni sopra il complessivo. Lo Sled Push, 223° contro un 51°, è la voce che da sola pesa di più.\n\nIn doubles i tempi di stazione misurano la COPPIA, non il singolo. L’unico piazzamento individuale della tabella è quello della corsa.'}</P>
      </Sec>

      <Sec n="02" t="LA GARA SEGMENTO PER SEGMENTO">
        <Tab h={['#', 'SEGMENTO', 'TEMPO', 'DIST. GARMIN', 'RANK', 'FC MED', 'FC MAX']} hi={[9, 17, 18]} r={[
          ['—', 'RUN 1', '5:15', '1.323 m', '—', '163', '174'],
          ['01', 'SkiErg 1000 m', '3:47', '—', '47', '155,7', '171'],
          ['—', 'RUN 2', '3:41', '872 m', '—', '169', '172'],
          ['02', 'Sled Push 50 m', '1:55', '—', '223', '151,9', '167'],
          ['—', 'RUN 3', '3:57', '860 m', '—', '165', '169'],
          ['03', 'Sled Pull 50 m', '3:14', '—', '169', '152,8', '166'],
          ['—', 'RUN 4', '4:00', '857 m', '—', '165', '168'],
          ['04', 'Burpee BJ 80 m', '2:57', '—', '132', '157,4', '165'],
          ['—', 'RUN 5', '4:04', '870 m', '—', '163', '168'],
          ['05', 'Row 1000 m', '4:19', '—', '62', '145,4', '166'],
          ['—', 'RUN 6', '4:04', '907 m', '—', '158', '165'],
          ['06', 'Farmers Carry 200 m', '1:34', '—', '132', '151,2', '159'],
          ['—', 'RUN 7', '3:59', '894 m', '—', '164', '168'],
          ['07', 'Sandbag Lunges 100 m', '3:16', '—', '121', '151,0', '155'],
          ['—', 'RUN 8', '4:44', '1.008 m', '—', '158', '166'],
          ['08', 'Wall Balls', '3:51', '—', '62', '149,7', '164'],
          ['—', 'ROXZONE (totale)', '5:25', '—', '69', '—', '—'],
          ['—', 'RUN TOTAL', '33:41', '7.592 m', '47', '162,8', '174'],
          ['—', 'TOTALE GARA', '1:03:53', '—', '51° · 3° AG', '158,2', '174'],
        ]} />
        <Box title="DUE MISURE DI PACE — non confonderle">
          {'NOMINALE 4:12.6/km — 33:41 diviso gli 8×1.000 m ufficiali. È il “4:13” che mostra ROXFIT e il numero da usare SEMPRE per confronti tra gare e atleti.\nMISURATO 4:26.2/km — i 7.592 m rilevati dal Garmin. Serve solo a leggere la struttura interna della gara.\nScarto 408 m (5,1%): Hyrox certifica 8 km, il Garmin indoor stima dai passi e su un percorso a serpentina può sbagliare in entrambi i versi. Non è stabilibile quale sia esatto.'}
        </Box>
        <Box title="LE CORSE NON SONO TUTTE DA 1.000 m">
          {'Dai lap manuali: RUN 1 = 1.323 m (la più lunga) · RUN 2-7 = 857-907 m (media 877) · RUN 8 = 1.008 m.\nConfrontare i tempi grezzi tra corse diverse non ha senso: solo le 2-7 sono omogenee tra loro.\nMETODO: auto-lap Garmin ogni km + lap manuali premuti a ogni ingresso/uscita stazione. Una corsa può quindi essere spezzata in due lap; i lap con pace 15-35 min/km sono stazione + roxzone. I tempi così ricavati combaciano col cronometraggio ufficiale entro 1-3 secondi.'}
        </Box>
      </Sec>

      <Sec n="03" t="IL LAVORO DIVISO CON ARMANDO">
        <P>Senza questa ripartizione i tempi di stazione non dicono nulla sul singolo, e le frequenze di stazione comprendono i minuti di attesa del partner.</P>
        <Tab h={['#', 'STAZIONE', 'DIVISIONE', 'QUOTA FEDERICO']} r={[
          ['01', 'SkiErg 1000 m', '150 A · 150 F · 200 A · 200 F · 150 A · 150 F', '500 m'],
          ['02', 'Sled Push 50 m', '12,5 a testa, poi frazioni da 6,25', '~25 m'],
          ['03', 'Sled Pull 50 m', '12,5 A e poi alternati', '~25 m'],
          ['04', 'Burpee BJ 80 m', '3-4 salti a testa, aperto e chiuso da Armando', '~40 m'],
          ['05', 'Row 1000 m', '250 A · 500 F · 250 A', '500 m'],
          ['06', 'Farmers Carry 200 m', '100 A · 100 F', '100 m'],
          ['07', 'Sandbag Lunges 100 m', '~10 a testa · ultimi ~20 chiusi da Armando (crampi)', '~40 m'],
          ['08', 'Wall Balls 100', 'serie da 10 e 15 alternate', '~45 reps'],
        ]} hi={[4, 6]} />
        <Box title="IL ROW LETTO NEI BATTITI — profilo ogni 25 secondi">
          {'162,7 → 153,1 → 140,8 → 135,5 │ 136,5 → 140,6 → 145,4 → 148,6 │ 148,8 → 144,7 → 139,4\n  ← Armando 250 m →        ← FEDERICO 500 m →        ← Armando 250 m →\n\nSi entra a 162,7 con la coda della quinta corsa, la FC crolla di 27 battiti fino a 135,5 mentre rema Armando, risale di 12 durante i 500 m di Federico, riscende a 139,4 all’uscita.\nI suoi 500 m costano ~13 battiti sopra il minimo e non superano mai 150: è l’unico segmento della gara che resta sotto soglia.\nLe medie per frazione NON vanno confrontate tra loro: quella d’ingresso contiene sempre la discesa dalla corsa.'}
        </Box>
      </Sec>

      <Sec n="04" t="DOVE SI È ROTTA LA GARA — e non è il cuore">
        <P>{'Mattia aveva prescritto 4’25”/km sulle corse 1-5. Il pace medio è stato 4:12.6/km nominale: il passo che lui stesso aveva indicato come insostenibile su otto corse.\n\nMa la lettura “il cuore è crollato” è sbagliata. Efficienza = km/h per battito:'}</P>
        <Tab h={['CORSA', 'FC', 'PACE NOM.', 'EF NOM.', 'PACE GARMIN', 'EF GARMIN']} hi={[5, 7]} r={[
          ['RUN 1', '163 (picco 174)', '5:15', '0,0701', '3:58', '0,0928'],
          ['RUN 2', '169', '3:41', '0,0964', '4:13', '0,0841'],
          ['RUN 3', '165', '3:57', '0,0921', '4:36', '0,0792'],
          ['RUN 4', '165', '4:00', '0,0909', '4:40', '0,0779'],
          ['RUN 5', '163', '4:04', '0,0905', '4:40', '0,0787'],
          ['RUN 6', '158', '4:04', '0,0934 ▲', '4:29', '0,0847 ▲'],
          ['RUN 7', '164', '3:59', '0,0918', '4:27', '0,0821'],
          ['RUN 8', '158', '4:44', '0,0802 ▼', '4:42', '0,0809 ▼'],
        ]} />
        <Box tone="ok" title="LA SESTA CORSA È RECUPERO, NON CROLLO">
          {'Alla sesta la frequenza scende di cinque battiti e l’efficienza MIGLIORA in entrambe le letture. Alla settima risale a 164 e firma il miglior passo della seconda metà.\nCardiacamente il margine c’era fino alla fine: a 158 era undici battiti sotto il picco della corsa 2.'}
        </Box>
        <Box tone="warn" title="L’OTTAVA CORSA HA FIRMA PERIFERICA">
          {'È l’unico vero calo, e frequenza e velocità scendono INSIEME. Quando calano entrambe il limite non è il cuore che non dà sangue, ma il muscolo che non lo chiede più.\nIl punto di rottura sono i CRAMPI ai Sandbag Lunges, la stazione immediatamente precedente: Armando ha chiuso ~20 ripetizioni da solo.'}
        </Box>
        <P>{'Altro dato rilevante: NON c’è deriva cardiovascolare. In uno sforzo di un’ora sopra soglia, con caldo e disidratazione progressiva, la FC normalmente sale a parità di potenza. Qui è piatta e poi cala (163·169·165·165·163·158·164·158): il sistema cardiovascolare ha retto.\n\nLa prima corsa a 174 bpm su 177 di massimale — il 98% — è il vero peccato originale, ma non per ragioni cardiache: cinque minuti in quella zona significano attivazione glicolitica massiva e deplezione accelerata del glicogeno nelle fibre veloci. Quel conto si paga nel muscolo, quaranta minuti dopo.'}</P>
        <Box title="COSA NON SI PUÒ CONCLUDERE DA QUESTI DATI">
          {'Se i crampi derivino dal pacing aggressivo, da idratazione e sali, o da condizionamento insufficiente sui lunges. Tre cause, tre rimedi diversi, e la gara non permette di distinguerle.\nContesto: è il secondo episodio in un mese (31/08, run interrotta per crampo al femorale sinistro) in un atleta che non ne aveva storia. La letteratura recente sui crampi da esercizio ha ridimensionato la pista elettroliti a favore dell’alterazione del controllo neuromuscolare in muscoli affaticati che lavorano in posizione accorciata — che è esattamente il gesto dell’affondo con sacca dopo cinquanta minuti di corsa.'}
        </Box>
      </Sec>

      <Sec n="05" t="COSA PORTARE ALLA PROSSIMA GARA">
        <Box tone="ok" title="1 · IL COLLO DI BOTTIGLIA È MUSCOLARE, NON CARDIACO">
          {'Il cuore aveva margine fino all’ottava corsa. Quello che ha chiuso la gara sono i crampi ai lunges.\nPriorità: capire i crampi prima di ritoccare il pacing. Resta vero che 4:12.6/km medi sono il passo definito insostenibile su otto corse, e che le prime cinque sono state corse a 163-169 contro i 147-152 che lo stesso passo-gara produceva in allenamento (compromised 15/09) — ma la prova del nesso coi crampi non c’è.'}
        </Box>
        <Box title="2 · SLED PUSH E LUNGES: FORZA-RESISTENZA DEGLI ARTI INFERIORI">
          {'Le due stazioni peggiori sono entrambe spinta e tenuta delle gambe sotto carico esterno. Non è un caso.\nIl lavoro dei prossimi mesi non è più volume aerobico — quello è a posto — ma forza resistente specifica, e soprattutto quelle stazioni fatte in stato di fatica, non da freschi.'}
        </Box>
        <Box title="3 · IL ROW È DOVE RECUPERARE, NON DOVE RISPARMIARE">
          {'È l’unico segmento sotto soglia della gara: la FC scende comunque. In coppia si può valutare di prendersi una quota maggiore (700 m invece di 500) e liberare il partner per le stazioni dove Federico è più in difficoltà.'}
        </Box>
        <Box title="4 · REGISTRARE SUBITO, DOPO OGNI GARA">
          {'La ripartizione del lavoro col partner e la lunghezza reale delle corse. Senza, metà dei numeri non è interpretabile.'}
        </Box>
      </Sec>

      <div style={{ fontSize: 10.5, color: 'var(--fg-3)', letterSpacing: '0.06em', borderTop: '1px solid var(--line-2)', paddingTop: 12, marginTop: 8 }}>
        Fonti: results.hyrox.com (workout summary + race replay, viste Thursday e Overall) · FIT Garmin <code>FIT/hyrox_roma_24set2026/</code> · ripartizione doubles dichiarata da Federico · criterio dei rank da roxlyfe.com/leaderboard-explained.
        <br />Versione estesa in <code>dati/HYROX_ROMA_2026_ANALISI.md</code> · <a href="storico.html" style={{ color: 'var(--accent)' }}>← torna allo storico</a>
      </div>
    </TelemetryChrome>
  );
}
