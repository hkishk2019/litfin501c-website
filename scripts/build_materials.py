#!/usr/bin/env python3
"""
Scan /materials/ and rebuild /materials.json.

Run from repo root:    python3 scripts/build_materials.py

Folder naming convention (must match bio panel label, optionally with topic suffix):
    <Panel Label> - <Topic>
e.g.  "Panel 1 - Antitrust & Complex Litigation"
      "Panel A - When Code Meets Claims (AI & LegalTech)"
      "Policy Panel - Rules of the Game"
      "Opening Panel - A Snapshot of Today's World Economy"

Output schema:
  [{ "folder":      "Panel 1 - Antitrust & Complex Litigation",
     "panel_short": "Panel 1",
     "panel_label": "Panel 1 \u2014 Antitrust & Complex Litigation",
     "bio_panel":   "Panel 1",
     "speakers":    [{ "name": "..." }, ...],     # alphabetical by last name
     "files":       [{ "name": "...pdf", "path": "...", "size_kb": 1234 }] }]
"""
import json, os, re

ROOT     = os.path.abspath(os.path.join(os.path.dirname(__file__), os.pardir))
MAT_DIR  = os.path.join(ROOT, 'materials')
BIO_PATH = os.path.join(ROOT, 'panelist_bios.json')
OUT_PATH = os.path.join(ROOT, 'materials.json')


def parse_folder_name(name):
    """'Panel 1 - Antitrust & Complex Litigation' ->
       ('Panel 1', 'Panel 1 — Antitrust & Complex Litigation')

       Also handles:
         'Policy Panel - Rules of the Game'
         'Opening Panel - ...'
         'Panel A - When Code Meets Claims (...)'
    """
    m = re.match(r'^(Opening Panel|Policy Panel|Panel\s+\S+)\s+-\s+(.+)$', name)
    if not m:
        return name, name
    short = m.group(1).strip()
    label = f'{short} \u2014 {m.group(2).strip()}'
    return short, label


def panel_sort_key(panel_short):
    """Display order: Opening, Panel 1..6, Policy, Panel A..F."""
    s = panel_short
    if s == 'Opening Panel':       return (0, 0, '')
    if s == 'Policy Panel':        return (2, 0, '')
    m = re.match(r'Panel\s+(\d+)$', s)
    if m: return (1, int(m.group(1)), '')
    m = re.match(r'Panel\s+([A-Z])$', s)
    if m: return (3, 0, m.group(1))
    return (4, 0, s)


def load_speakers_by_panel():
    with open(BIO_PATH) as f:
        bios = json.load(f)
    out = {}
    for p in bios:
        labels = p.get('panel') or []
        if isinstance(labels, str):
            labels = [labels]
        for lbl in labels:
            if lbl:
                out.setdefault(lbl, []).append({'name': p['name']})
    # Alphabetical by last name within each panel
    for arr in out.values():
        arr.sort(key=lambda s: (s['name'].split(' ')[-1].upper(), s['name']))
    return out


def scan():
    speakers_by_panel = load_speakers_by_panel()
    panels = []
    for entry in sorted(os.listdir(MAT_DIR)):
        full = os.path.join(MAT_DIR, entry)
        if not os.path.isdir(full):
            continue
        short, label = parse_folder_name(entry)
        files = []
        for f in sorted(os.listdir(full)):
            if f.startswith('.'):
                continue
            fpath = os.path.join(full, f)
            if not os.path.isfile(fpath):
                continue
            size_kb = round(os.path.getsize(fpath) / 1024)
            files.append({
                'name': f,
                'path': f'materials/{entry}/{f}',
                'size_kb': size_kb,
            })
        panels.append({
            'panel_short': short,
            'panel_label': label,
            'bio_panel':   short,
            'speakers':    speakers_by_panel.get(short, []),
            'folder':      entry,
            'files':       files,
        })

    panels.sort(key=lambda p: panel_sort_key(p['panel_short']))
    return panels


if __name__ == '__main__':
    data = scan()
    with open(OUT_PATH, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

    total_files = sum(len(p['files']) for p in data)
    total_kb    = sum(f['size_kb'] for p in data for f in p['files'])
    print(f'Scanned {len(data)} panels, {total_files} files, '
          f'total {total_kb / 1024:.1f} MB.')
    print(f'Wrote {OUT_PATH}\n')

    for p in data:
        print(f"  {p['panel_short']:14s} | speakers={len(p['speakers']):2d} | files={len(p['files']):2d}  | {p['folder']}")
