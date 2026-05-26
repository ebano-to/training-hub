// AGENDA — Telemetry style + week archive navigation
function AgendaPage() {
  const { ATHLETE, WEEK, WEEK_ARCHIVE } = window.TRAINING;
  const allWeeks = (WEEK_ARCHIVE || []).concat([{ id: 'S' + ATHLETE.programWeek, label: 'S' + ATHLETE.programWeek + ' · CORRENTE', range: '11 → 17 MAG 2026', programWeek: ATHLETE.programWeek, days: WEEK }]);
  const [weekIdx, setWeekIdx] = React.useState(allWeeks.length - 1);
  const currentWeekDays = allWeeks[weekIdx].days;
  const isCurrentWeek = weekIdx === allWeeks.length - 1;
  const todayNum = new Date().getDate();
  const todayDate = todayNum.toString();
  const todayIdx = isCurrentWeek ? currentWeekDays.findIndex((w) => parseInt(w.date, 10) === todayNum) : -1;
  const [selected, setSelected] = React.useState(todayIdx >= 0 ? todayIdx : 0);
  React.useEffect(function() {
    if (isCurrentWeek) {
      var ti = currentWeekDays.findIndex((w) => parseInt(w.date, 10) === todayNum);
      setSelected(ti >= 0 ? ti : 0);
    } else {
      setSelected(0);
    }
  }, [weekIdx]);
  const day = currentWeekDays[selected] || currentWeekDays[0];
  const kindColor = (k) => ({
    hyrox: '#FCEE4F', altro: '#4ECDC4', strength: 'oklch(80% 0.15 60)',
    run: '#39E75F', ski: '#6C68D7', row: '#58ADF7',
    bike: '#FF6B9D', rest: 'var(--fg-3)'
  }[k] || 'var(--fg-2)');

  function dayLabel(w) {
    if (w.done) return '✓ DONE';
    if (parseInt(w.date, 10) === todayNum) return '● OGGI';
    return '';
  }

  return (
    <TelemetryChrome active="AGENDA">
      {/* Week selector */}
      {allWeeks.length > 1 && (
        <div style={{ display: 'flex', gap: 4, marginBottom: 12, overflowX: 'auto', padding: '2px 0' }}>
          {allWeeks.map(function(wk, wi) {
            var isSel = wi === weekIdx;
            return (
              <button key={wk.id} onClick={function() { setWeekIdx(wi); }}
                style={{
                  background: isSel ? 'var(--accent)' : 'transparent',
                  color: isSel ? '#000' : 'var(--fg-3)',
                  border: '1px solid ' + (isSel ? 'var(--accent)' : 'var(--line)'),
                  padding: '6px 12px', fontFamily: 'var(--display)', fontSize: 11,
                  letterSpacing: '0.08em', fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap',
                }}>
                {wk.id}
              </button>
            );
          })}
        </div>
      )}

      {/* Title */}
      <div className="r-agenda-title" style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 16, marginBottom: 12 }}>
        <div style={{ border: '1px solid var(--line)', background: 'var(--bg-2)', padding: 24 }}>
          <div style={{ fontSize: 11, color: 'var(--fg-3)', letterSpacing: '0.18em', marginBottom: 8 }}>
            // WEEKLY_PLAN · {allWeeks[weekIdx].id}
          </div>
          <div className="display r-display-hero" style={{ fontSize: 'var(--display-hero)', lineHeight: 0.9 }}>
            AGENDA<span style={{ color: 'var(--accent)' }}>.</span>
          </div>
          <div style={{ fontSize: 11, color: 'var(--fg-3)', letterSpacing: '0.12em', marginTop: 12 }}>
            {allWeeks[weekIdx].range} · {currentWeekDays.filter((w) => w.done).length}/7 DONE · {Math.floor(currentWeekDays.reduce((a, b) => a + b.duration, 0) / 60)}h {currentWeekDays.reduce((a, b) => a + b.duration, 0) % 60}' planned
          </div>
        </div>
        <div style={{ border: '1px solid var(--line)', background: 'var(--bg-2)', padding: 20 }}>
          <div style={{ fontSize: 11, color: 'var(--fg-3)', letterSpacing: '0.18em', marginBottom: 12 }}>// WEEK_LOAD</div>
          {(() => {
            var maxDur = Math.max(...currentWeekDays.map(function(w) { return w.duration; }));
            return (
              <div style={{ display: 'flex', gap: 6, alignItems: 'flex-end', height: 80, marginBottom: 12 }}>
                {currentWeekDays.map((w, i) => {
                  var blocks = w.blocks || [];
                  var total = blocks.length || 1;
                  var doneCount = w.done ? total : blocks.filter(function(bl) { return bl.result && bl.result !== 'da fare'; }).length;
                  var donePct = (doneCount / total) * 100;
                  var barH = maxDur > 0 ? (w.duration / maxDur) * 100 : 0;
                  return (
                  <div key={i} style={{
                    flex: 1, height: barH + '%',
                    border: (w.done && doneCount === total) ? '1.5px solid var(--accent)' : '1px solid var(--line)',
                    minHeight: 4, overflow: 'hidden', display: 'flex', flexDirection: 'column',
                  }}>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <div style={{ flexGrow: total - doneCount, background: parseInt(w.date,10) === todayNum && doneCount === 0 ? 'transparent' : 'oklch(50% 0 0 / 0.3)' }} />
                      {doneCount > 0 && <div style={{ flexGrow: doneCount, background: 'var(--accent)' }} />}
                    </div>
                  </div>
                  );
                })}
              </div>
            );
          })()}
          <div style={{ display: 'flex', gap: 6, fontSize: 9, color: 'var(--fg-3)' }}>
            {currentWeekDays.map((w, i) => <div key={i} style={{ flex: 1, textAlign: 'center', letterSpacing: '0.1em' }}>{w.day}</div>)}
          </div>
          <div style={{ fontSize: 11, color: 'var(--fg-3)', letterSpacing: '0.12em', marginTop: 12 }}>
            min · {currentWeekDays.reduce((a, b) => a + b.duration, 0)} TOT
          </div>
        </div>
      </div>

      {/* Day strip */}
      <ModulePanel code="MOD.AGENDA · day_selector">
        <div className="r-grid r-grid-7" style={{ gap: 6 }}>
          {currentWeekDays.map((w, i) => (
            <button key={i} onClick={() => setSelected(i)}
              style={{
                background: i === selected ? 'var(--accent)' : 'var(--bg-3)',
                color: i === selected ? '#000' : 'var(--fg)',
                border: '1px solid ' + (i === selected ? 'var(--accent)' : 'var(--line)'),
                padding: '14px 12px', textAlign: 'left', cursor: 'pointer',
                fontFamily: 'var(--mono)'
              }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: i === selected ? '#000' : kindColor(w.kind), flexShrink: 0 }} />
                <span style={{ fontSize: 10, letterSpacing: '0.18em', opacity: 0.7 }}>{w.day}</span>
              </div>
              <div className="display tabular" style={{ fontSize: 32, lineHeight: 1, marginTop: 4 }}>{w.date}</div>
              <div style={{ fontSize: 9, marginTop: 8, letterSpacing: '0.1em' }}>
                {dayLabel(w)}
              </div>
            </button>
          ))}
        </div>
      </ModulePanel>

      {/* Selected session */}
      {(() => {
        var dayBlocks = day.blocks || [{ code: day.kind.slice(0, 3).toUpperCase(), t: day.title, d: day.sub, dur: day.duration + '\'' }];
        return (
          <div className="r-agenda-session" style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 12 }}>
            <div style={{ border: '1px solid var(--accent)', background: 'oklch(88% 0.20 130 / 0.04)', padding: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 16 }}>
                <div style={{ fontSize: 11, color: 'var(--accent)', letterSpacing: '0.18em' }}>
                  // SESSION_{day.day}_{day.date} · {day.kind.toUpperCase()} · {day.load} · {day.duration}'
                </div>
                <div style={{ fontSize: 11, color: 'var(--fg-3)' }}>
                  {dayBlocks.length} {dayBlocks.length === 1 ? 'LAVORO' : 'LAVORI'}
                </div>
              </div>
              <div className="display r-display-mega" style={{ fontSize: 'var(--display-mega)', lineHeight: 0.95, marginBottom: 8 }}>{day.title}</div>
              <div style={{ fontSize: 13, color: 'var(--fg-2)', marginBottom: 20, fontFamily: 'var(--sans)' }}>{day.sub}</div>

              <div style={{ borderTop: '1px dashed var(--line-2)' }}>
                {dayBlocks.map((b, i) => {
                  var isSkipped = b.result === 'SALTATO';
                  var isDone = b.result && b.result !== 'da fare' && !isSkipped;
                  var isTodo = !b.result || b.result === 'da fare';
                  var skipColor = 'oklch(55% 0.12 15)';
                  var codeKey = b.code.toLowerCase();
                  var strengthCodes = ['bsq','sp','dl','bench','push','pull','pesi'];
                  var isStrength = strengthCodes.indexOf(codeKey) >= 0;
                  var isHyrox = codeKey === 'cr' || codeKey === 'test';
                  var bikeCodes = ['bike','mtb','assault'];
                  var isBike = bikeCodes.indexOf(codeKey) >= 0;
                  var displayCode = isStrength ? 'STR' : isHyrox ? 'HYROX' : isBike ? 'BIKE' : b.code;
                  var blockColor = codeKey === 'row' ? '#58ADF7' : codeKey === 'ski' ? '#6C68D7' : codeKey === 'run' ? '#39E75F' : isBike ? '#FF6B9D' : isHyrox ? '#FCEE4F' : isStrength ? 'oklch(80% 0.15 60)' : 'var(--accent)';
                  return (
                  <div key={i} style={{
                    padding: '16px 0 16px 12px', borderBottom: '1px dashed var(--line-2)',
                    borderLeft: isDone ? '3px solid var(--accent)' : (isSkipped ? '3px solid ' + skipColor : '3px solid ' + blockColor),
                    background: isDone ? 'oklch(88% 0.20 130 / 0.06)' : (isSkipped ? 'oklch(55% 0.12 15 / 0.04)' : 'transparent'),
                    opacity: isSkipped ? 0.6 : 1,
                  }}>
                    <div className="r-block-row" style={{
                      display: 'grid', gridTemplateColumns: '60px 1fr 60px',
                      alignItems: 'center', gap: 16
                    }}>
                      <div style={{ fontSize: 12, letterSpacing: '0.15em', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
                        {isDone && <span style={{ color: 'var(--accent)', fontSize: 14 }}>✓</span>}
                        {isSkipped && <span style={{ color: skipColor, fontSize: 14 }}>✗</span>}
                        <span style={{ color: isDone ? 'var(--accent)' : (isSkipped ? skipColor : blockColor) }}>{displayCode}</span>
                      </div>
                      <div>
                        <div style={{ fontSize: 15, fontWeight: 700, fontFamily: 'var(--sans)', color: isDone ? 'var(--fg-2)' : (isSkipped ? 'var(--fg-3)' : 'var(--fg)'), textDecoration: isSkipped ? 'line-through' : 'none' }}>{b.t}</div>
                        <div style={{ fontSize: 12, color: 'var(--fg-2)', marginTop: 3 }}>{b.d}</div>
                      </div>
                      <div className="display tabular" style={{ fontSize: 22, textAlign: 'right', color: isDone ? 'var(--fg-3)' : (isSkipped ? 'var(--fg-3)' : 'var(--fg)') }}>{b.dur}</div>
                    </div>
                    {(b.ref || b.expect) && (
                      <div style={{ marginTop: 10, marginLeft: 76, display: 'grid', gap: 4 }}>
                        {b.ref && (
                          <div style={{ fontSize: 10, color: 'var(--fg-3)', letterSpacing: '0.05em', fontFamily: 'var(--mono)' }}>
                            <span style={{ color: 'oklch(75% 0.14 220)' }}>REF</span> {b.ref}
                          </div>
                        )}
                        {b.expect && (
                          <div style={{ fontSize: 10, color: 'var(--accent)', letterSpacing: '0.05em', fontFamily: 'var(--mono)' }}>
                            <span style={{ color: 'var(--accent)' }}>TGT</span> {b.expect}
                          </div>
                        )}
                      </div>
                    )}
                    {b.result && b.result !== 'da fare' && !isSkipped && (
                      <div style={{ marginTop: 8, marginLeft: 76, fontSize: 11, color: 'var(--accent)', fontFamily: 'var(--mono)', letterSpacing: '0.05em', padding: '6px 10px', background: 'oklch(88% 0.20 130 / 0.08)', border: '1px solid oklch(88% 0.20 130 / 0.15)' }}>
                        ✓ {b.result}
                      </div>
                    )}
                    {isSkipped && (
                      <div style={{ marginTop: 8, marginLeft: 76, fontSize: 11, color: skipColor, fontFamily: 'var(--mono)', letterSpacing: '0.1em', padding: '6px 10px', background: 'oklch(55% 0.12 15 / 0.06)', border: '1px solid oklch(55% 0.12 15 / 0.15)' }}>
                        ✗ SALTATO
                      </div>
                    )}
                    {b.gps && b.gps.length > 0 && (
                      <div style={{ marginTop: 10, marginLeft: 76 }}>
                        <AgendaRunMap gps={b.gps} />
                      </div>
                    )}
                    {(!b.result || b.result === 'da fare') && (
                      <div style={{ marginTop: 8, marginLeft: 76, fontSize: 11, color: blockColor, fontFamily: 'var(--mono)', letterSpacing: '0.1em', padding: '6px 10px', background: blockColor + '14', border: '1px solid ' + blockColor + '33' }}>
                        ◯ DA FARE
                      </div>
                    )}
                  </div>
                  );
                })}
              </div>
            </div>

            <div>
              <ModulePanel code="MOD.SESSION_INFO">
                {[
                  { l: 'LOAD', v: day.load },
                  { l: 'DUR_TOT', v: day.duration + '\'' },
                  { l: 'KIND', v: day.kind.toUpperCase() },
                  { l: 'LAVORI', v: dayBlocks.length },
                  { l: 'STATUS', v: (function() {
                    var done = dayBlocks.filter(function(bl) { return bl.result && bl.result !== 'da fare' && bl.result !== 'SALTATO'; }).length;
                    var skipped = dayBlocks.filter(function(bl) { return bl.result === 'SALTATO'; }).length;
                    if (done === dayBlocks.length) return '✓ DONE';
                    if (skipped === dayBlocks.length) return '✗ SALTATO';
                    if (done + skipped === dayBlocks.length) return done + ' DONE · ' + skipped + ' SKIP';
                    return done + '/' + dayBlocks.length + ' DONE';
                  })() },
                ].map((s) => (
                  <div key={s.l} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '8px 0', borderBottom: '1px dashed var(--line-2)' }}>
                    <div style={{ fontSize: 11, color: 'var(--fg-3)', letterSpacing: '0.12em' }}>{s.l}</div>
                    <div className="display tabular" style={{ fontSize: 18, color: 'var(--accent)' }}>{s.v}</div>
                  </div>
                ))}
              </ModulePanel>

            </div>
          </div>
        );
      })()}
    </TelemetryChrome>
  );
}
function AgendaRunMap({ gps }) {
  var mapRef = React.useRef(null);
  var containerRef = React.useRef(null);

  React.useEffect(function() {
    if (!containerRef.current || !window.L || mapRef.current) return;

    var lats = gps.map(function(p) { return p[0]; });
    var lons = gps.map(function(p) { return p[1]; });
    var bounds = [[Math.min.apply(null, lats), Math.min.apply(null, lons)],
                  [Math.max.apply(null, lats), Math.max.apply(null, lons)]];

    var map = L.map(containerRef.current, {
      zoomControl: true, scrollWheelZoom: false, attributionControl: false,
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', { maxZoom: 19 }).addTo(map);

    L.polyline(gps, { color: '#B8FF57', weight: 3, opacity: 0.9, lineCap: 'round', lineJoin: 'round' }).addTo(map);

    L.circleMarker(gps[0], { radius: 5, fillColor: '#B8FF57', fillOpacity: 1, color: '#000', weight: 2 }).addTo(map)
      .bindTooltip('START', { permanent: true, direction: 'right', className: 'map-tooltip', offset: [6, 0] });

    L.circleMarker(gps[gps.length - 1], { radius: 5, fillColor: '#ff5757', fillOpacity: 1, color: '#000', weight: 2 }).addTo(map)
      .bindTooltip('FINISH', { permanent: true, direction: 'right', className: 'map-tooltip', offset: [6, 0] });

    map.fitBounds(bounds, { padding: [20, 20] });
    mapRef.current = map;

    return function() { if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; } };
  }, [gps]);

  return (
    <div style={{ border: '1px solid var(--line)', overflow: 'hidden' }}>
      <div style={{ padding: '6px 10px', background: 'var(--bg-2)', borderBottom: '1px solid var(--line-2)', display: 'flex', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 9, color: 'var(--accent)', letterSpacing: '0.18em', fontWeight: 700 }}>// ROUTE_MAP</span>
        <span style={{ fontSize: 9, color: 'var(--fg-3)', letterSpacing: '0.1em' }}>{gps.length} pts</span>
      </div>
      <div ref={containerRef} style={{ height: 240, width: '100%', background: '#1a1a2e' }} />
      <style>{'.map-tooltip{background:rgba(0,0,0,0.85)!important;color:#B8FF57!important;border:1px solid #B8FF57!important;font-family:var(--mono)!important;font-size:9px!important;letter-spacing:0.15em!important;padding:3px 8px!important;border-radius:0!important;box-shadow:none!important}.map-tooltip:before{display:none!important}'}</style>
    </div>
  );
}

window.AgendaPage = AgendaPage;
