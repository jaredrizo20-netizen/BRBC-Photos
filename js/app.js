/* ===================== STATE ===================== */
var TWEAK_DEFAULTS = {
  palette:   'azalea',
  header:    'minimal',
  density:   'compact',
  lbStyle:   'scoreboard',
  showStrip: false
};

var tweaks = Object.assign({}, TWEAK_DEFAULTS);
try { var _saved = JSON.parse(localStorage.getItem('brbc-spring-tweaks-v1') || 'null'); if (_saved) tweaks = Object.assign(tweaks, _saved); } catch(e){}

var view = 'leaderboard';
var scores = {};
try { var _ss = JSON.parse(localStorage.getItem('brbc-spring-scores-v1') || 'null'); if (_ss) scores = _ss; } catch(e){}

var modalTeam = null;
var modalHole = null;

/* ===================== HELPERS ===================== */
function teamKey(name) {
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

function getTeamScores(team) {
  return scores[teamKey(team)] || {};
}

function calcScore(team) {
  var ts = getTeamScores(team), total = 0, thru = 0;
  HOLES.forEach(function(h) {
    var s = ts['hole' + h.hole];
    if (s !== undefined) { total += (s - h.par); thru++; }
  });
  return { total: total, thru: thru };
}

function sortedTeams() {
  return TEAMS.slice().sort(function(a, b) {
    var sa = calcScore(a), sb = calcScore(b);
    if (sa.thru === 0 && sb.thru === 0) return TEAMS.indexOf(a) - TEAMS.indexOf(b);
    if (sa.thru === 0) return 1;
    if (sb.thru === 0) return -1;
    if (sa.total !== sb.total) return sa.total - sb.total;
    return sa.thru - sb.thru;
  });
}

function fmtScore(n) {
  if (n === 0) return 'E';
  return (n > 0 ? '+' : '') + n;
}

function holeCls(score, par) {
  var d = score - par;
  if (d <= -2) return 'eagle';
  if (d === -1) return 'birdie';
  if (d === 1)  return 'bogey';
  if (d >= 2)   return 'dbl';
  return '';
}

function getTeam(name) {
  return TEAM_DATA.find(function(t) { return t.name === name; });
}

/* ===================== SVG DECORATIONS ===================== */
function bloom(cx, cy, sc) {
  var s = sc * 7;
  var html = '<g transform="translate(' + cx + ',' + cy + ')">';
  for (var i = 0; i < 5; i++) {
    var a = (i * 72 - 90) * Math.PI / 180;
    var px = Math.cos(a) * s * 0.7;
    var py = Math.sin(a) * s * 0.7;
    html += '<circle cx="' + px.toFixed(2) + '" cy="' + py.toFixed(2) + '" r="' + s.toFixed(2) + '" fill="#F4D6DE" stroke="#E29CB0" stroke-width="0.8"/>';
  }
  html += '<circle cx="0" cy="0" r="' + (s * 0.6).toFixed(2) + '" fill="#E29CB0"/>';
  html += '<circle cx="0" cy="0" r="' + (s * 0.25).toFixed(2) + '" fill="#B85A75"/>';
  html += '</g>';
  return html;
}

function azaleaSprigSvg(side) {
  var flip = side === 'right' ? 'transform="scale(-1,1) translate(-120,0)"' : '';
  return '<svg class="sprig sprig--' + side + '" viewBox="0 0 120 200" width="58" height="96" aria-hidden="true">'
    + '<g ' + flip + '>'
    + '<path d="M10,8 C 30,40 40,80 28,130 C 22,160 30,180 50,196" stroke="#2C5F3F" stroke-width="2.2" fill="none" stroke-linecap="round"/>'
    + '<path d="M28,38 C 42,32 50,40 44,52 C 36,56 28,50 28,38 Z" fill="#3F7B57"/>'
    + '<path d="M22,82 C 8,80 4,68 14,60 C 24,60 28,72 22,82 Z" fill="#2C5F3F"/>'
    + '<path d="M30,118 C 46,114 52,124 44,134 C 34,138 26,130 30,118 Z" fill="#3F7B57"/>'
    + '<path d="M22,170 C 8,170 4,158 16,150 C 26,152 28,162 22,170 Z" fill="#2C5F3F"/>'
    + bloom(46, 22, 1.0)
    + bloom(38, 70, 0.85)
    + bloom(58, 100, 1.1)
    + bloom(34, 140, 0.9)
    + bloom(52, 178, 1.0)
    + '</g>'
    + '</svg>';
}

function footerAzaleaSvg() {
  return '<svg class="footer-azalea" viewBox="0 0 280 65" aria-hidden="true">'
    + '<path d="M8,48 C 55,36 100,52 140,42 C 180,32 225,50 272,40" stroke="#2C5F3F" stroke-width="2.2" fill="none" stroke-linecap="round"/>'
    + '<path d="M52,43 C 46,29 60,25 62,39 Z" fill="#3F7B57"/>'
    + '<path d="M108,47 C 100,33 116,29 116,43 Z" fill="#2C5F3F"/>'
    + '<path d="M178,40 C 172,26 186,22 186,36 Z" fill="#3F7B57"/>'
    + '<path d="M232,45 C 226,31 240,27 240,41 Z" fill="#2C5F3F"/>'
    + bloom(65, 24, 0.9)
    + bloom(125, 20, 1.0)
    + bloom(192, 16, 0.85)
    + bloom(248, 21, 0.95)
    + '</svg>';
}

/* ===================== RENDER: HEADER ===================== */
function renderHeader() {
  return '<div class="hdr-logo-wrap">'
    + azaleaSprigSvg('left')
    + '<img class="hdr-logo-img" src="BRBC_Spring_Classic_Logo.jpeg" alt="Brooks Rizo Booze Classic">'
    + azaleaSprigSvg('right')
    + '</div>';
}

/* ===================== RENDER: NAV ===================== */
function renderNav() {
  function tab(id, label) {
    return '<button class="nav-tab' + (view === id ? ' active' : '') + '" data-nav="' + id + '">' + label + '</button>';
  }
  return '<div class="nav">'
    + tab('leaderboard', 'Leaderboard')
    + tab('rules',       'Rules')
    + tab('rankings',    'Rankings')
    + tab('champions',   'Champions')
    + '</div>';
}

/* ===================== RENDER: LEADERBOARD ===================== */
function renderLeaderboard() {
  var teams = sortedTeams();

  var rows = [];
  var prev = null, prevPos = 0;
  teams.forEach(function(t, i) {
    var s = calcScore(t);
    var posLabel;
    if (s.thru === 0) {
      posLabel = '—';
    } else if (prev !== null && prev.total === s.total && prev.thru === s.thru) {
      posLabel = 'T' + prevPos;
    } else {
      prevPos = i + 1;
      var ties = teams.filter(function(x) { var sx = calcScore(x); return sx.thru > 0 && sx.total === s.total; }).length;
      posLabel = (ties > 1 ? 'T' : '') + prevPos;
    }
    prev = s;
    rows.push({ team: t, posLabel: posLabel, score: s });
  });

  var leaderRow = rows.find(function(r) { return r.score.thru > 0; });
  var leaderTotal = leaderRow ? leaderRow.score.total : null;

  var html = '<div class="section-head">'
    + '<div class="label">L · I · V · E</div>'
    + '<h2>Leaderboard</h2>'
    + '<div class="ornament"><span class="ornament-mark">❀</span></div>'
    + '</div>';

  html += '<div class="lb-wrap lb-style-' + tweaks.lbStyle + '"><div class="lb-board">';

  rows.forEach(function(r) {
    var t        = getTeam(r.team);
    var leader   = leaderTotal !== null && r.score.total === leaderTotal && r.score.thru > 0;
    var scoreCls = r.score.thru === 0 ? 'even' : (r.score.total < 0 ? 'under' : (r.score.total > 0 ? 'over' : 'even'));
    var scoreText = r.score.thru === 0 ? '—' : fmtScore(r.score.total);
    var thruText  = r.score.thru === 0 ? t.teeTime : (r.score.thru === 18 ? 'F' : 'thru ' + r.score.thru);

    html += '<div class="lb-row' + (leader ? ' leader' : '') + '" data-team="' + r.team + '">';
    html += '<span class="leader-pin">LEADER</span>';
    html += '<div class="lb-pos">' + r.posLabel + '</div>';
    html += '<div>'
      + '<div class="lb-team">' + r.team + ' <span class="tee">· ' + t.teeTime + '</span></div>'
      + '<div class="lb-players">' + t.players + '</div>'
      + '</div>';
    html += '<div>'
      + '<div class="lb-score ' + scoreCls + '">' + scoreText + '</div>'
      + '<div class="lb-thru">' + thruText + '</div>'
      + '</div>';

    if (tweaks.showStrip && r.score.thru > 0) {
      html += '<div class="lb-strip">';
      HOLES.forEach(function(h, idx) {
        var s = getTeamScores(r.team)['hole' + h.hole];
        if (idx === 9) html += '<div class="lb-cell gap">·</div>';
        html += s === undefined
          ? '<div class="lb-cell">·</div>'
          : '<div class="lb-cell ' + holeCls(s, h.par) + '">' + s + '</div>';
      });
      html += '</div>';
    }

    html += '</div>';
  });

  html += '</div></div>';
  return html;
}

/* ===================== RENDER: RULES ===================== */
function renderRules() {
  var holeDescriptions = {
    2:  'If <strong>any player</strong> hits into the water, the entire team shotguns.',
    3:  'If the team does <strong>not</strong> hit the green in regulation, everyone shotguns.',
    5:  'Par 3 closest-to-the-pin contest.',
    8:  'Everyone must <strong>finish a full drink</strong> on this hole.',
    11: 'If the team scores a <strong>bogey or worse</strong>, every member shotguns.',
    12: 'Par 3 closest-to-the-pin contest.',
    13: 'Longest drive in the fairway wins.',
    16: 'If the team does <strong>not</strong> hit the green in regulation, everyone shotguns.'
  };

  var html = '<div class="section-head">'
    + '<div class="label">F · O · R · M · A · T</div>'
    + '<h2>Rules of Play</h2>'
    + '<div class="ornament"><span class="ornament-mark">❀</span></div>'
    + '</div>'
    + '<div class="rules-wrap">';

  html += '<div class="rules-intro">'
    + '<span class="lead">FOUR-MAN SCRAMBLE</span>'
    + 'All players tee off each hole. Best drive is selected. '
    + 'All play from that spot. Repeat until holed out. '
    + 'Lowest team score takes the title.'
    + '</div>';

  html += '<div class="rules-section-title">House Rules</div>';
  html += '<div class="gen-rules">'
    + '<div class="gr-item"><span class="t">Shotgun Mulligan</span>Each player gets <strong style="color:var(--azalea-deep)">one</strong> shotgun mulligan per round — usable on any shot, including a putt.</div>'
    + '<div class="gr-item"><span class="t">Eagle Rule</span>If your team makes an eagle, select any team to shotgun. They must all shotgun and send a video to the group chat.</div>'
    + '</div>';

  html += '<div class="rules-section-title">Hole-by-Hole</div>';

  var specials = HOLES.filter(function(h) { return h.special; });
  html += '<div class="hbh-grid">';
  specials.forEach(function(h) {
    var parts = h.special.split('—');
    var title  = parts[0].trim();
    var detail = parts[1] ? parts[1].trim() : '';
    html += '<div class="hbh-card">'
      + '<div class="hbh-head">'
      +   '<div class="hbh-no">No. ' + h.hole + '</div>'
      +   '<div class="hbh-meta">Par ' + h.par + ' · ' + h.yards + 'Y</div>'
      + '</div>'
      + '<div class="hbh-title">' + title + (detail ? ' — ' + detail : '') + '</div>'
      + '<div class="hbh-body">' + (holeDescriptions[h.hole] || '') + '</div>'
      + '</div>';
  });
  html += '</div></div>';
  return html;
}

/* ===================== RENDER: RANKINGS ===================== */
function renderRankings() {
  var html = '<div class="section-head">'
    + '<div class="label">2 · 0 · 2 · 6</div>'
    + '<h2>Field Rankings</h2>'
    + '<div class="ornament"><span class="ornament-mark">❀</span></div>'
    + '</div>'
    + '<div class="rk-wrap">';

  html += '<div class="rk-banner">'
    + '<div class="rk-banner-title">The Captains</div>'
    + '<div class="rk-banner-sub">ODDS TO WIN</div>'
    + '</div>';

  CAPTAINS.forEach(function(c, i) {
    html += '<div class="rk-row captain">'
      + '<div>'
      +   '<div class="rk-cap-eyebrow">CAPTAIN · NO. ' + (i + 1) + '</div>'
      +   '<div class="rk-name">' + c.name + '</div>'
      +   '<div class="rk-meta">'
      +     '<span>Apps · ' + c.app + '</span>'
      +     '<span class="pip">❀</span>'
      +     '<span>Titles · ' + c.titles + '</span>'
      +     '<span class="pip">❀</span>'
      +     '<span>Ryder · ' + c.ryder + '</span>'
      +   '</div>'
      + '</div>'
      + '<div class="rk-hcp">' + c.odds + '<span class="lbl">ODDS</span></div>'
      + '</div>';
  });

  html += '<div class="rk-banner" style="margin-top:22px">'
    + '<div class="rk-banner-title">Player Rankings</div>'
    + '<div class="rk-banner-sub">FIELD OF TWENTY-FOUR</div>'
    + '</div>';

  PLAYERS.forEach(function(p) {
    html += '<div class="rk-row">'
      + '<div class="rk-num">' + p.rank + '</div>'
      + '<div>'
      +   '<div class="rk-name">' + p.name + '</div>'
      +   '<div class="rk-meta">'
      +     '<span>Apps · ' + p.app + '</span>'
      +     '<span class="pip">❀</span>'
      +     '<span>Titles · ' + p.titles + '</span>'
      +     '<span class="pip">❀</span>'
      +     '<span>Ryder · ' + p.ryder + '</span>'
      +   '</div>'
      + '</div>'
      + '<div class="rk-hcp">' + p.hcp + '<span class="lbl">HCP</span></div>'
      + '</div>';
  });

  html += '</div>';
  return html;
}

/* ===================== RENDER: CHAMPIONS ===================== */
function renderChampions() {
  var html = '<div class="section-head">'
    + '<div class="label">E · S · T · 2 · 0 · 1 · 9</div>'
    + '<h2>Hall of Champions</h2>'
    + '<div class="ornament"><span class="ornament-mark">❀</span></div>'
    + '</div>'
    + '<div class="ch-wrap">';

  var byYear = {}, years = [];
  CHAMPIONS.forEach(function(c) {
    if (!byYear[c.year]) { byYear[c.year] = []; years.push(c.year); }
    byYear[c.year].push(c);
  });

  years.forEach(function(y) {
    html += '<div class="ch-year-band">'
      + '<span class="ch-year-band-line"></span>'
      + '<span class="ch-year-band-year">' + y + '</span>'
      + '<span class="ch-year-band-line"></span>'
      + '</div>';
    byYear[y].forEach(function(c) {
      var isSpring = c.event === 'Spring Classic';
      html += '<div class="ch-card' + (isSpring ? ' is-spring' : ' is-fall') + '">';
      if (c.photo) {
        html += '<img class="ch-photo" src="' + c.photo + '" alt="Champions" crossorigin="anonymous" referrerpolicy="no-referrer" onerror="this.outerHTML=\'<div class=ch-photo-fallback>NO PHOTOGRAPH ON FILE</div>\'">';
      } else {
        html += '<div class="ch-photo-fallback">NO PHOTOGRAPH ON FILE</div>';
      }
      html += '<div class="ch-meta">'
        + '<div class="ch-event">' + c.event.toUpperCase() + ' CHAMPIONS</div>'
        + '<div class="ch-players">' + c.players.join(' · ') + '</div>'
        + '</div></div>';
    });
  });

  html += '</div>';
  return html;
}

/* ===================== RENDER: MODAL (SCORECARD) ===================== */
function renderModal() {
  var layer = document.getElementById('modal-layer');
  if (!layer) {
    layer = document.createElement('div');
    layer.id = 'modal-layer';
    document.body.appendChild(layer);
  }
  if (!modalTeam) { layer.innerHTML = ''; return; }

  var ts     = getTeamScores(modalTeam);
  var team   = getTeam(modalTeam);
  var totals = calcScore(modalTeam);

  var f9 = 0, f9thru = 0;
  var b9 = 0, b9thru = 0;
  HOLES.forEach(function(h) {
    var s = ts['hole' + h.hole];
    if (h.hole <= 9) { if (s !== undefined) { f9 += s; f9thru++; } }
    else             { if (s !== undefined) { b9 += s; b9thru++; } }
  });
  var f9rel = f9thru ? (f9 - HOLES.slice(0, f9thru).reduce(function(a, h) { return a + h.par; }, 0)) : null;
  var b9rel = b9thru ? (b9 - HOLES.slice(9, 9 + b9thru).reduce(function(a, h) { return a + h.par; }, 0)) : null;

  var html = '<div class="modal-back" data-modal-close="1">'
    + '<div class="modal-card sc-card">'
    +   '<button class="sc-x" data-modal-cancel="1" aria-label="Close">×</button>'
    +   '<div class="modal-eyebrow">SCORECARD</div>'
    +   '<div class="modal-title">' + modalTeam + '</div>'
    +   '<div class="modal-sub">' + team.players + '</div>'
    +   '<div class="sc-summary">'
    +     '<div class="sc-sum-cell"><div class="sc-sum-lbl">FRONT 9</div><div class="sc-sum-val">' + (f9rel === null ? '—' : fmtScore(f9rel)) + '</div></div>'
    +     '<div class="sc-sum-cell"><div class="sc-sum-lbl">BACK 9</div><div class="sc-sum-val">'  + (b9rel === null ? '—' : fmtScore(b9rel)) + '</div></div>'
    +     '<div class="sc-sum-cell"><div class="sc-sum-lbl">TOTAL</div><div class="sc-sum-val">'   + (totals.thru === 0 ? '—' : fmtScore(totals.total)) + '</div></div>'
    +   '</div>'
    +   '<div class="sc-card-rule"><span>CARD</span><em>HOLE-BY-HOLE</em></div>'
    +   '<div class="sc-rows">';

  HOLES.forEach(function(h) {
    var s      = ts['hole' + h.hole];
    var cls    = s !== undefined ? holeCls(s, h.par) : '';
    var isOpen = modalHole === h.hole;

    if (h.hole === 10) html += '<div class="sc-nine-break">— BACK 9 —</div>';

    html += '<div class="sc-row' + (isOpen ? ' is-open' : '') + '">'
      + '<div class="sc-row-head" data-pick-hole="' + h.hole + '">'
      +   '<div class="sc-h-no">' + h.hole + '</div>'
      +   '<div class="sc-h-meta">Par ' + h.par + ' · ' + h.yards + 'Y' + (h.special ? ' · <em>' + h.special.split('—')[0].trim() + '</em>' : '') + '</div>'
      +   (s !== undefined
            ? '<div class="sc-h-val has-score ' + cls + '"><span class="sc-mark">' + s + '</span></div>'
            : '<div class="sc-h-val">–</div>')
      + '</div>';

    if (isOpen) {
      html += '<div class="sc-h-pad">';
      [1,2,3,4,5,6,7,8,9].forEach(function(n) {
        var d    = n - h.par;
        var bcls = d <= -2 ? 'eagle' : d === -1 ? 'birdie' : d === 1 ? 'bogey' : d >= 2 ? 'dbl' : '';
        html += '<button class="sc-pad-btn ' + bcls + (s === n ? ' is-on' : '') + '" data-set-score="' + n + '">' + n + '</button>';
      });
      if (s !== undefined) {
        html += '<button class="sc-pad-btn sc-clear" data-clear-score="1">clear</button>';
      }
      html += '</div>';
    }
    html += '</div>';
  });

  html += '</div></div></div>';
  layer.innerHTML = html;
}

/* ===================== RENDER: TWEAKS PANEL ===================== */
function paletteSwatch(name, c1, c2, c3) {
  var on = tweaks.palette === name ? ' is-on' : '';
  return '<button class="tw-swatch' + on + '" data-tw-pal="' + name + '" title="' + name + '" style="grid-template-columns:1fr 1fr 1fr">'
    + '<span style="background:' + c1 + '"></span>'
    + '<span style="background:' + c2 + '"></span>'
    + '<span style="background:' + c3 + '"></span>'
    + '</button>';
}

function segment(label, key, options) {
  var html = '<div style="margin-bottom:10px"><label>' + label + '</label><div class="tw-segment">';
  options.forEach(function(o) {
    html += '<button data-tweak="' + key + '" data-tweak-val="' + o.v + '"' + (tweaks[key] === o.v ? ' class="is-on"' : '') + '>' + o.l + '</button>';
  });
  html += '</div></div>';
  return html;
}

function renderTweaksPanel() {
  var p    = document.getElementById('tw-panel');
  var html = '<button class="tw-close" data-tw-close="1">×</button>'
    + '<h3>Tweaks</h3>'
    + '<div class="tw-sub">SPRING · CLASSIC</div>'
    + '<div class="tw-section">'
    +   '<label>Palette</label>'
    +   '<div class="tw-swatches">'
    +     paletteSwatch('azalea', '#F6EFE0', '#2C5F3F', '#E29CB0')
    +     paletteSwatch('cream',  '#FBF5E2', '#3A6E48', '#A07E2C')
    +     paletteSwatch('green',  '#1F4D2E', '#C8A951', '#9CB48F')
    +   '</div>'
    + '</div>'
    + '<div class="tw-section">'
    +   segment('Header',            'header',    [{v:'badge',l:'Badge'},{v:'banner',l:'Banner'},{v:'minimal',l:'Minimal'}])
    + '</div>'
    + '<div class="tw-section">'
    +   segment('Leaderboard style', 'lbStyle',   [{v:'classic',l:'Classic'},{v:'scoreboard',l:'Board'},{v:'editorial',l:'Editorial'}])
    +   segment('Density',           'density',   [{v:'compact',l:'Compact'},{v:'comfortable',l:'Comfort'},{v:'spacious',l:'Spacious'}])
    +   segment('Hole-by-hole strip','showStrip',  [{v:true,l:'Show'},{v:false,l:'Hide'}])
    + '</div>';
  p.innerHTML = html;

  p.querySelectorAll('[data-tweak]').forEach(function(b) {
    b.addEventListener('click', function() {
      var v = b.getAttribute('data-tweak-val');
      if (v === 'true') v = true; else if (v === 'false') v = false;
      setTweak(b.getAttribute('data-tweak'), v);
    });
  });
  p.querySelectorAll('[data-tw-pal]').forEach(function(b) {
    b.addEventListener('click', function() { setTweak('palette', b.getAttribute('data-tw-pal')); });
  });
  p.querySelector('[data-tw-close="1"]').addEventListener('click', function() {
    p.classList.remove('is-open');
    try { window.parent.postMessage({ type: '__edit_mode_dismissed' }, '*'); } catch(e){}
  });
}

/* ===================== TWEAKS ===================== */
function applyTweaks() {
  document.body.setAttribute('data-palette', tweaks.palette);
  document.body.setAttribute('data-density',  tweaks.density);
  try { localStorage.setItem('brbc-spring-tweaks-v1', JSON.stringify(tweaks)); } catch(e){}
}

function setTweak(key, val) {
  tweaks[key] = val;
  applyTweaks();
  render();
  renderTweaksPanel();
  try { window.parent.postMessage({ type: '__edit_mode_set_keys', edits: tweaks }, '*'); } catch(e){}
}

/* ===================== EVENTS ===================== */
function attachEvents() {
  document.querySelectorAll('[data-nav]').forEach(function(b) {
    b.addEventListener('click', function() {
      view = b.getAttribute('data-nav');
      render();
      window.scrollTo(0, 0);
    });
  });
  document.querySelectorAll('.lb-row').forEach(function(r) {
    r.addEventListener('click', function() {
      modalTeam = r.getAttribute('data-team');
      modalHole = null;
      renderModal();
    });
  });
}

document.addEventListener('click', function(e) {
  var t = e.target;

  if (t.closest('[data-modal-close="1"]') && !t.closest('.modal-card')) {
    modalTeam = null; modalHole = null; renderModal(); return;
  }
  if (t.closest('[data-modal-cancel="1"]')) {
    modalTeam = null; modalHole = null; renderModal(); return;
  }

  var ph = t.closest('[data-pick-hole]');
  if (ph) {
    var newHole = parseInt(ph.getAttribute('data-pick-hole'), 10);
    modalHole = (modalHole === newHole) ? null : newHole;
    renderModal(); return;
  }

  if (t.closest('[data-clear-score="1"]')) {
    var k = teamKey(modalTeam);
    if (scores[k]) delete scores[k]['hole' + modalHole];
    try { localStorage.setItem('brbc-spring-scores-v1', JSON.stringify(scores)); } catch(e){}
    modalHole = null; renderModal(); render(); return;
  }

  var ss = t.closest('[data-set-score]');
  if (ss) {
    var v = parseInt(ss.getAttribute('data-set-score'), 10);
    var k2 = teamKey(modalTeam);
    if (!scores[k2]) scores[k2] = {};
    scores[k2]['hole' + modalHole] = v;
    try { localStorage.setItem('brbc-spring-scores-v1', JSON.stringify(scores)); } catch(e){}
    fbWrite(k2, modalHole, v);
    modalHole = null; renderModal(); render();
  }
});

/* Edit-mode postMessage protocol */
window.addEventListener('message', function(e) {
  var d = e.data;
  if (!d || !d.type) return;
  if (d.type === '__activate_edit_mode')   document.getElementById('tw-panel').classList.add('is-open');
  if (d.type === '__deactivate_edit_mode') document.getElementById('tw-panel').classList.remove('is-open');
});
try { window.parent.postMessage({ type: '__edit_mode_available' }, '*'); } catch(e){}

/* ===================== RENDER: MAIN ===================== */
function render() {
  var app  = document.getElementById('app');
  var html = renderHeader() + renderNav();
  if      (view === 'leaderboard') html += renderLeaderboard();
  else if (view === 'rules')       html += renderRules();
  else if (view === 'rankings')    html += renderRankings();
  else if (view === 'champions')   html += renderChampions();
  html += '<div class="footer">'
    + '<div class="footer-text">'
    +   '<div><span class="ornament-mark">❀</span> BROOKS RIZO BOOZE CLASSIC <span class="ornament-mark">❀</span></div>'
    +   '<div class="footer-spring"><span class="ornament-mark">❀</span> SPRING \'26 <span class="ornament-mark">❀</span></div>'
    + '</div>'
    + '<div class="footer-sprig">' + footerAzaleaSvg() + '</div>'
    + '</div>';
  app.innerHTML = html;
  attachEvents();
}

/* ===================== FIREBASE SYNC ===================== */
var DB_URL = 'https://brbc-spring-classic-default-rtdb.firebaseio.com';

function fbRead() {
  fetch(DB_URL + '/springClassic/scores.json')
    .then(function(r) { return r.json(); })
    .then(function(data) {
      if (data) {
        Object.keys(data).forEach(function(key) {
          if (data[key]) scores[key] = data[key];
        });
        render();
      }
    })
    .catch(function(e) { console.log('Firebase read error:', e); });
}

function fbWrite(key, hole, score) {
  fetch(DB_URL + '/springClassic/scores/' + key + '/hole' + hole + '.json', {
    method: 'PUT',
    body: JSON.stringify(score)
  }).catch(function(e) { console.log('Firebase write error:', e); });
}

function fbDelete(key, hole) {
  fetch(DB_URL + '/springClassic/scores/' + key + '/hole' + hole + '.json', {
    method: 'DELETE'
  }).catch(function(e) { console.log('Firebase delete error:', e); });
}

window._fbWrite  = fbWrite;
window._fbDelete = fbDelete;

/* ===================== INIT ===================== */
applyTweaks();
render();
renderTweaksPanel();
fbRead();
setInterval(fbRead, 10000);
