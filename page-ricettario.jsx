// RICETTARIO SETTIMANALE — Piano Zappitelli · Telemetry style

var RICETTARIO = [
  { day: 'LUNEDI', schema: 'A', kcal: 3000, color: '#39E75F', meals: [
    { type: 'PRANZO', name: 'Riso integrale al limone con frittata al curry',
      ing: 'Riso integrale 150g · Albume 400g · Spinaci 200g · EVO 10g',
      steps: [
        'Metti il riso integrale in acqua bollente salata con una scorza di limone. Cuoci 10 min.',
        'Schiaccia uno spicchio d\'aglio in padella antiaderente calda. Butta gli spinaci, sale, appassisci 2 min.',
        'Versa gli albumi sugli spinaci. Aggiungi curry (o curcuma + pepe nero), sale. Copri, fuoco medio 4 min — frittata dorata sotto.',
        'Scola il riso, spremi mezzo limone, EVO 10g a crudo. Taglia la frittata a spicchi e servi sopra.',
      ],
      tip: 'Il curry sulla frittata di albume toglie il sapore "di niente" tipico dell\'albume.' },
    { type: 'CENA', name: 'Polenta con ragu di lenticchie al rosmarino',
      ing: 'Polenta 150g · Lenticchie precotte 180g · Bietole 200g · EVO 10g',
      steps: [
        'Bolli 685ml d\'acqua salata, versa la polenta a pioggia mescolando. Fuoco basso, 8 min.',
        'Padella: aglio + rosmarino 30s. Lenticchie sciacquate, 3 cucchiai passata, peperoncino. 3-4 min, schiaccia un po\' col cucchiaio.',
        'Bietole a pezzi grossi con aglio, sale, goccia d\'aceto. 3 min.',
        'Polenta, ragu sopra, bietole di lato, EVO 10g a crudo.',
      ],
      tip: 'Schiacciare meta lenticchie col cucchiaio crea una cremina che veste la polenta.' },
  ]},
  { day: 'MARTEDI', schema: 'B', kcal: 3300, color: '#FFB84D', meals: [
    { type: 'PRANZO', name: 'Farro con seitan alla pizzaiola e peperoni',
      ing: 'Farro perlato 150g · Seitan 110g · Peperoni 200g · EVO 10g',
      steps: [
        'Farro perlato in acqua bollente salata, 10 min (resta al dente).',
        'Seitan a straccetti. Padella ben calda: rosola 2 min per lato, croccante e dorato. Togli.',
        'Stessa padella: peperoni a listarelle + aglio, sale, origano. 4 min fuoco vivo (croccanti).',
        'Rimetti seitan, 2 cucchiai passata, capperi. 1 min. Scola farro, EVO 10g, pizzaiola sopra.',
      ],
      tip: 'Padella ben calda: il seitan deve fare la crosticina, non bollire nel suo liquido.' },
    { type: 'CENA', name: 'Pure con caprese calda gratinata',
      ing: 'Pure Pfanni 150g polvere · Mozzarella light 200g · Pomodori 200g · EVO 10g',
      steps: [
        'Pure: 630ml a ebollizione, togli dal fuoco, 160ml fredda, versa 150g Pfanni, mescola, riposa 2 min.',
        'Pomodori a fette spesse in padella calda, sale, origano. 2 min per lato — caramellare.',
        'Mozzarella a fette sui pomodori caldi, copri 1 min — si ammorbidisce e fila.',
        'Pure come base, pomodori + mozzarella sopra. EVO 10g, pepe nero, basilico.',
      ],
      tip: 'Griglia i pomodori finche non fanno le righe scure — l\'origano tostato sul pomodoro caramellato vale il piatto.' },
  ]},
  { day: 'MERCOLEDI', schema: 'C', kcal: 3000, color: '#58ADF7', meals: [
    { type: 'PRANZO', name: 'Pasta e ceci risottata con broccoli e peperoncino',
      ing: 'Pasta integrale 150g · Ceci precotti 180g · Broccoli 200g · EVO 10g',
      steps: [
        'Cuoci la pasta. A 4 min dalla fine, butta i broccoli a cimette nella stessa pentola.',
        'Padella: aglio + peperoncino 30s. Meta ceci (90g), schiacciali con forchetta. 1 mestolo acqua di cottura.',
        'Aggiungi ceci interi rimasti.',
        'Scola pasta e broccoli (tieni acqua), versa in padella. Manteca 1 min a fuoco vivo. EVO 10g, pepe, prezzemolo.',
      ],
      tip: 'Schiacciare meta ceci e il segreto della risottatura — crea cremosita senza formaggio.' },
    { type: 'CENA', name: 'Polenta con uovo in camicia e fagiolini al limone',
      ing: 'Polenta 150g · Uova 3 medie · Fagiolini 200g · EVO 10g',
      steps: [
        'Polenta: 685ml acqua salata a bollore, versa 150g, mescola 8 min.',
        'Fagiolini in padella: sale, goccia d\'acqua, copri 4 min. Scoperchia, limone, pepe. Verdi e croccanti.',
        'Uova: padella antiaderente, rompi le 3 uova. Sale, pepe, coperchio, fuoco bassissimo 3 min. Tuorlo morbido.',
        'Polenta, uova sopra, fagiolini di lato. EVO 10g. Rompi il tuorlo sulla polenta.',
      ],
      tip: 'Il tuorlo morbido che cola sulla polenta calda diventa il condimento perfetto.' },
  ]},
  { day: 'GIOVEDI', schema: 'A', kcal: 3000, color: '#39E75F', meals: [
    { type: 'PRANZO', name: 'Orzotto alla curcuma con rotolo di frittata alle erbe',
      ing: 'Orzo perlato 150g · Albume 400g · Spinaci 200g · EVO 10g',
      steps: [
        'Orzo in acqua bollente salata con curcuma e pepe nero, 10 min. Scola lasciando umido.',
        'Spinaci in padella: appassisci 2 min con aglio. Togli e strizza.',
        'Stessa padella: albumi a crepe sottile. Sale, prezzemolo+erba cipollina. 3 min, gira, 1 min.',
        'Stendi frittata, spinaci sopra, arrotola. Taglia a rondelle 3cm. Orzotto sotto, rondelle sopra. EVO 10g.',
      ],
      tip: 'La frittata a crepe sottile arrotolata con gli spinaci e molto piu bella del solito blocco.' },
    { type: 'CENA', name: 'Pure con borlotti alla salvia e finocchi crudi',
      ing: 'Pure Pfanni 150g polvere · Borlotti precotti 180g · Finocchi 200g · EVO 10g',
      steps: [
        'Pure: 630ml bollente, togli, 160ml fredda, 150g Pfanni, mescola, riposa.',
        'Padella: 4-5 foglie salvia fresca, tosta 30s. Borlotti, sale, pepe, 2 cucchiai passata. 3 min, schiaccia un terzo.',
        'Finocchi affettati sottilissimi. Limone, sale, pepe rosa. Crudi e croccanti.',
        'Pure, borlotti alla salvia sopra, finocchi di lato. EVO 10g sui finocchi.',
      ],
      tip: 'I finocchi crudi sottili con limone bilanciano la pesantezza del pure — contrasto caldo/freddo.' },
  ]},
  { day: 'VENERDI', schema: 'B', kcal: 3300, color: '#FFB84D', meals: [
    { type: 'PRANZO', name: 'Bowl di quinoa con tempeh teriyaki e zucchine',
      ing: 'Quinoa 150g · Tempeh 110g · Zucchine 200g · EVO 10g',
      steps: [
        'Sciacqua la quinoa (toglie l\'amaro). Cuoci in acqua salata 12 min, scola, sgrana con forchetta.',
        'Tempeh a cubetti 1.5cm. Marinatura: 1 cucchiaino soia + 1 aceto di mele + zenzero + aglio in polvere.',
        'Padella ben calda: rosola tempeh 3 min per lato — scuro e croccante. Togli.',
        'Stessa padella: zucchine a mezzaluna, sale, timo, fuoco vivo 3 min. Bowl: quinoa, zucchine, tempeh. EVO 10g, limone.',
      ],
      tip: 'La marinatura express soia+aceto+zenzero trasforma il tempeh da cartone a qualcosa che vuoi rifare.' },
    { type: 'CENA', name: 'Polenta taragna con ricotta montata alle erbe e bietole',
      ing: 'Polenta taragna 150g · Ricotta light 180g · Bietole 200g · EVO 10g',
      steps: [
        'Polenta taragna: 685ml acqua salata a bollore, versa 150g, mescola 8 min.',
        'Ricotta (180g) + sale + pepe nero + erba cipollina + scorza di limone. Mescola con forchetta — soffice e cremosa.',
        'Bietole in padella: aglio, peperoncino, sale. 3 min fuoco vivo.',
        'Polenta calda, cucchiaiate di ricotta montata sopra, bietole di lato. EVO 10g.',
      ],
      tip: 'La ricotta montata con limone ed erbe e un altro mondo rispetto alla ricotta fredda dal vasetto.' },
  ]},
  { day: 'SABATO', schema: 'C', kcal: 3000, color: '#58ADF7', meals: [
    { type: 'PRANZO', name: 'Insalata tiepida di riso integrale e cannellini al basilico',
      ing: 'Riso integrale parboiled 150g · Cannellini precotti 180g · Insalata mista 200g · EVO 10g',
      steps: [
        'Riso integrale parboiled 10 min, scola e raffreddalo sotto acqua 10s — tiepido, non caldo.',
        'Ciotola: riso + cannellini sciacquati + limone + sale + pepe + basilico fresco + cipolla rossa tritata.',
        'Mescola, lascia insaporire 2 min.',
        'Insalata mista nel piatto, riso e cannellini sopra. EVO 10g, limone.',
      ],
      tip: 'Piatto estivo perfetto — basilico fresco con cannellini e limone e una combinazione che non ti aspetti.' },
    { type: 'CENA', name: 'Nido di pure con uova al tegamino e zucchine alla scapece',
      ing: 'Pure Pfanni 150g polvere · Uova 3 medie · Zucchine 200g · EVO 10g',
      steps: [
        'Zucchine a rondelle sottili. Padella caldissima: griglia singolo strato, 2 min per lato. Condisci subito: aceto, aglio a fettine, basilico, sale.',
        'Pure: 630ml bollente, 160ml fredda, 150g Pfanni, mescola.',
        'Stessa padella: 3 uova, sale, pepe, paprika affumicata. Coperchio, fuoco basso, 3 min. Tuorlo morbido.',
        'Pure a nido (avvallamento al centro), uova nel nido, zucchine alla scapece intorno. EVO 10g.',
      ],
      tip: 'La scapece (aceto+aglio+basilico) sulle zucchine le rende acide e profumate — spaccano col pure dolce.' },
  ]},
  { day: 'DOMENICA', schema: 'B', kcal: 3300, color: '#FFB84D', meals: [
    { type: 'PRANZO', name: 'Pasta integrale con tofu croccante e peperonata veloce',
      ing: 'Pasta integrale 150g · Tofu 150g · Peperoni+pomodori 200g · EVO 10g',
      steps: [
        'Pasta integrale 10 min. Tofu a cubetti 2cm, asciuga bene con carta.',
        'Padella caldissima: tofu senza niente, fuoco alto, 2 min per lato senza toccare. A fine: 1 cucchiaino soia, mescola 10s. Togli.',
        'Stessa padella: peperoni + pomodorini a meta + aglio + origano. 4 min fuoco vivo — pomodorini scoppiano.',
        'Scola pasta (tieni acqua), versa in peperonata, 1 min. Tofu sopra. EVO 10g, basilico.',
      ],
      tip: 'Il tofu va asciugato e cotto a fuoco ALTO senza muoverlo. La soia a fine cottura lo glassa.' },
    { type: 'CENA', name: 'Polenta 5 cereali con fiocchi di latte all\'erba cipollina e lattughino',
      ing: 'Polenta 5 cereali 150g · Fiocchi di latte 200g · Lattughino 200g · EVO 10g',
      steps: [
        'Polenta: 645ml acqua salata a bollore, versa 150g, mescola 8 min.',
        'Fiocchi di latte (200g) + pepe nero + erba cipollina + scorza di limone + paprika affumicata. Mescola delicatamente.',
        'Lattughino: lava, condisci con EVO 10g + limone + sale + pepe.',
        'Polenta nel piatto, fiocchi conditi sopra, lattughino fresco di lato.',
      ],
      tip: 'I fiocchi di latte con paprika affumicata e limone diventano quasi un formaggio spalmabile.' },
  ]},
];

function RicettarioPage() {
  var ATHLETE = window.TRAINING.ATHLETE;
  var totalMeals = RICETTARIO.reduce(function(s, d) { return s + d.meals.length; }, 0);

  // Expand/collapse state per day
  var _s = React.useState(function() {
    var init = {};
    RICETTARIO.forEach(function(d, i) { init[i] = true; });
    return init;
  });
  var expanded = _s[0];
  var setExpanded = _s[1];

  function toggleDay(i) {
    var next = Object.assign({}, expanded);
    next[i] = !next[i];
    setExpanded(next);
  }

  function expandAll() {
    var next = {};
    RICETTARIO.forEach(function(d, i) { next[i] = true; });
    setExpanded(next);
  }

  function collapseAll() {
    var next = {};
    RICETTARIO.forEach(function(d, i) { next[i] = false; });
    setExpanded(next);
  }

  return (
    <TelemetryChrome active="RICETTARIO">
      {/* ── HERO ── */}
      <div style={{ border: '1px solid var(--line)', background: 'var(--bg-2)', padding: 24, marginBottom: 12 }}>
        <div style={{ fontSize: 11, color: 'var(--fg-3)', letterSpacing: '0.18em', marginBottom: 8 }}>
          // MEAL_PLAN · PIANO ZAPPITELLI · S{ATHLETE.programWeek} · {totalMeals} PASTI
        </div>
        <div className="display r-display-hero" style={{ fontSize: 'var(--display-hero)', lineHeight: 0.9 }}>
          RICET<span style={{ color: 'var(--accent)' }}>TARIO.</span>
        </div>
        <div style={{ fontSize: 11, color: 'var(--fg-3)', letterSpacing: '0.1em', marginTop: 10 }}>
          Tutte ricette &le; 10 minuti · Solo 10g EVO per pasto · Niente parmigiano
        </div>
      </div>

      {/* ── DISPENSA ── */}
      <div style={{
        border: '1px solid var(--line)', background: 'var(--bg-2)', padding: 16, marginBottom: 12
      }}>
        <div style={{ fontSize: 10, color: 'var(--fg-3)', letterSpacing: '0.18em', marginBottom: 8 }}>// DISPENSA · CALORIE ZERO</div>
        <div style={{ fontSize: 12, color: 'var(--fg-2)', lineHeight: 1.6, fontFamily: 'var(--sans)' }}>
          Sale, pepe nero, peperoncino, aglio, cipolla in polvere, curcuma, paprika dolce/affumicata, curry, noce moscata, origano, rosmarino, timo, salvia, basilico, prezzemolo, erba cipollina, limone, aceto di mele, salsa di soia (1 cucchiaino), passata di pomodoro, senape, capperi.
        </div>
      </div>

      {/* ── EXPAND/COLLAPSE ── */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <button onClick={expandAll} style={{
          flex: 1, padding: '8px 0', background: 'transparent', color: 'var(--fg-3)',
          border: '1px solid var(--line)', fontFamily: 'var(--display)', fontSize: 12,
          letterSpacing: '0.08em', fontWeight: 700, cursor: 'pointer'
        }}>ESPANDI TUTTI</button>
        <button onClick={collapseAll} style={{
          flex: 1, padding: '8px 0', background: 'transparent', color: 'var(--fg-3)',
          border: '1px solid var(--line)', fontFamily: 'var(--display)', fontSize: 12,
          letterSpacing: '0.08em', fontWeight: 700, cursor: 'pointer'
        }}>COMPRIMI TUTTI</button>
      </div>

      {/* ── DAYS ── */}
      {RICETTARIO.map(function(day, di) {
        var isOpen = !!expanded[di];

        return (
          <div key={di} style={{
            border: '1px solid ' + (isOpen ? day.color + '44' : 'var(--line)'),
            background: 'var(--bg-2)', marginBottom: 12
          }}>
            {/* Day header — clickable */}
            <div onClick={function() { toggleDay(di); }} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '14px 16px', cursor: 'pointer', userSelect: 'none',
              borderBottom: isOpen ? '1px solid var(--line)' : 'none'
            }}>
              <div>
                <div style={{ fontSize: 10, color: day.color, letterSpacing: '0.18em' }}>
                  // SCHEMA {day.schema} · {day.kcal} KCAL
                </div>
                <div className="display" style={{ fontSize: 24, lineHeight: 1, marginTop: 4 }}>
                  {day.day}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 11, color: 'var(--fg-3)' }}>{day.meals.length} pasti</div>
                </div>
                <span style={{
                  fontSize: 18, color: day.color, transition: 'transform 0.2s',
                  transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)', display: 'inline-block'
                }}>&#9654;</span>
              </div>
            </div>

            {/* Meals — visible when expanded */}
            {isOpen && day.meals.map(function(meal, mi) {
              return (
                <div key={mi} style={{
                  padding: '16px 16px 20px',
                  borderBottom: mi < day.meals.length - 1 ? '1px solid var(--line)' : 'none'
                }}>
                  {/* Meal type badge */}
                  <div style={{ marginBottom: 10 }}>
                    <span style={{
                      display: 'inline-block', padding: '3px 10px', fontSize: 10,
                      letterSpacing: '0.14em', fontFamily: 'var(--mono)',
                      border: '1px solid ' + day.color, color: day.color
                    }}>{meal.type}</span>
                  </div>

                  {/* Meal name */}
                  <div className="display" style={{ fontSize: 18, lineHeight: 1.1, marginBottom: 10, color: 'var(--fg)' }}>
                    {meal.name}
                  </div>

                  {/* Ingredients */}
                  <div style={{
                    fontSize: 12, color: 'var(--fg-2)', fontFamily: 'var(--mono)',
                    padding: '8px 12px', background: 'var(--bg)', border: '1px solid var(--line)',
                    marginBottom: 12, letterSpacing: '0.02em'
                  }}>
                    {meal.ing}
                  </div>

                  {/* Steps */}
                  <div style={{ marginBottom: 10 }}>
                    {meal.steps.map(function(step, si) {
                      return (
                        <div key={si} style={{
                          display: 'flex', gap: 10, marginBottom: 8,
                          fontSize: 13, color: 'var(--fg-2)', lineHeight: 1.5, fontFamily: 'var(--sans)'
                        }}>
                          <span className="display tabular" style={{
                            fontSize: 14, color: day.color, flexShrink: 0, width: 20, textAlign: 'right'
                          }}>{si + 1}</span>
                          <span>{step}</span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Tip */}
                  <div style={{
                    fontSize: 11, color: 'var(--accent-2)', fontStyle: 'italic',
                    paddingLeft: 30, lineHeight: 1.5
                  }}>
                    {meal.tip}
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}

      {/* ── FOOTER NOTE ── */}
      <div style={{
        border: '1px solid var(--warn)', background: 'var(--bg-2)',
        padding: 14, marginBottom: 12, textAlign: 'center'
      }}>
        <div style={{ fontSize: 11, color: 'var(--warn)', letterSpacing: '0.1em', lineHeight: 1.7, fontFamily: 'var(--mono)' }}>
          NIENTE PARMIGIANO · Solo 10g EVO per pasto · Spezie, erbe, limone, aceto: liberi<br/>
          Legumi: precotti/barattolo (180g cotti = 60g secchi) — sciacquali sempre<br/>
          Pure Pfanni (2x95g): 150g polvere → 630ml bollente + 160ml fredda
        </div>
      </div>
    </TelemetryChrome>
  );
}

window.RicettarioPage = RicettarioPage;
