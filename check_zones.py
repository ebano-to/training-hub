#!/usr/bin/env python3
"""
Guard zone HR per il training site di Federico.
Blocca il deploy se una card etichetta una zona con dei BPM incoerenti con
le zone lattato reali, o se trova una conversione %FCmax scritta alla lettera.

Zone lattato reali (FCmax 177):
  Z1 110-119 · Z2 120-135 · Z3 136-149 · Z4 150-156 · Z5 157-177
I sotto-livelli di Z2 (low/mid/top) devono comunque stare dentro 120-135.

Uso: python3 check_zones.py <data.jsx>   (exit 1 se trova violazioni)
"""
import sys, re

BANDS = {1: (110, 119), 2: (120, 135), 3: (136, 149), 4: (150, 156), 5: (157, 177)}
TOL = 1  # tolleranza ±1 bpm

def check(path):
    s = open(path, encoding='utf-8').read()
    violations = []

    # 1) conversione %FCmax scritta alla lettera: deve avere "bpm" subito dopo il valore
    #    (es. "63-65% = 112-115 bpm"). NON matcha i carichi tipo "75% = 118kg".
    for m in re.finditer(r'\d{1,3}\s*[-–]?\s*\d{0,3}\s*%\s*=\s*\d{2,3}(?:\s*[-–]\s*\d{2,3})?\s*bpm', s):
        ctx = m.group(0).replace('\n', ' ')
        violations.append(f"conversione %FCmax alla lettera vietata: «{ctx}»")

    # 2) zona etichettata con range bpm incoerente.
    # forma A: "Z2 low (120-125 bpm)" / "Z3 (136-149 bpm)" / "Z2 top (130-135 bpm)"
    for m in re.finditer(r'Z([1-5])(?:\s+(?:low|mid|top|basso|alto))?\s*\(\s*(\d{2,3})\s*[-–]\s*(\d{2,3})\s*bpm', s):
        z = int(m.group(1)); lo = int(m.group(2)); hi = int(m.group(3))
        blo, bhi = BANDS[z]
        if lo < blo - TOL or hi > bhi + TOL:
            violations.append(f"Z{z} etichettata {lo}-{hi} bpm ma la banda Z{z} è {blo}-{bhi}: «{m.group(0)}»")

    # forma B: "a 152 bpm (Z4)" — valore, poi bpm, poi SUBITO "(Z n)"
    for m in re.finditer(r'(\d{2,3})\s*bpm\s*\(\s*Z([1-5])\b', s):
        v = int(m.group(1)); z = int(m.group(2))
        blo, bhi = BANDS[z]
        if v < blo - TOL or v > bhi + TOL:
            violations.append(f"{v} bpm etichettato Z{z} ma la banda Z{z} è {blo}-{bhi}: «{m.group(0)}»")

    return violations

if __name__ == '__main__':
    path = sys.argv[1] if len(sys.argv) > 1 else 'data.jsx'
    v = check(path)
    if v:
        print(f"ABORT: {len(v)} violazione/i zone HR — deploy bloccato:")
        for x in v:
            print("  ✗", x)
        sys.exit(1)
    print("ZONE OK: nessuna incoerenza HR trovata")
    sys.exit(0)
