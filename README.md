# webclone-examples

Real-world clone projects built with [webclone-skill](https://github.com/chentianxiong123/webclone-skill).

Each directory is a complete project — original snapshot → extracted assets → final rebuild — so you can trace the full pipeline from source material to working output.

---

## Projects

### `baidu-translate/` — Baidu Translate (fanyi.baidu.com)

React SPA, 11 component blocks extracted.

```
baidu-translate/
├─ snapshots/          Original + modified snapshots (before/after)
├─ blocks/             Extracted component fragments (11 blocks)
│  ├─ nav, langbar, tabs, actionbar, float-fab
│  └─ input-area, result-area, model-selector
│  └─ right-panel, right-tabs, side-ads
├─ components/         Component mapping configs (class → semantic)
├─ scripts/            Workflow scripts (grab-dom, trigger-extract, apply, ...)
└─ gohx/               HTMX + Go migration stage
```

### `bilibili/` — Bilibili Homepage

Three-layer pipeline — snapshot → extract → Go + HTMX rebuild.

```
bilibili/
├─ static/             Original homepage snapshot (single index.html)
├─ extract/            Extracted assets (CSS, HTML, screenshot, grab scripts)
└─ htmx/               Final Go + HTMX rebuild (source only, binary ignored)
   ├─ main.go          Go backend serving HTMX fragments
   ├─ templates/       HTMX templates (layout, feed, card, ...)
   ├─ components/nav/  Reusable nav component
   ├─ static/          bili.css, htmx.min.js, override.css
   └─ data/feed.json   Sample feed data
```

---

## Related

- Main project: [webclone-skill](https://github.com/chentianxiong123/webclone-skill)
