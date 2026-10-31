// ぽこAIカンパニー オフィス画面
// state.js を5秒ごとに読みなおして、画面を更新します（サーバー不要・ダブルクリックで開けます）。
(function () {
  "use strict";

  var DESKS = [
    { left: 40, bottom: 36 }, { left: 58, bottom: 36 }, { left: 76, bottom: 36 },
    { left: 49, bottom: 8 },  { left: 67, bottom: 8 },  { left: 85, bottom: 8 },
    { left: 92, bottom: 36 }, { left: 31, bottom: 8 }
  ];
  var QUICK = [
    { label: "☀️ 朝のエリー便", text: "おはよう！朝のエリー便をお願い" },
    { label: "📬 メールチェック", text: "メールをチェックして、返信が必要なものを教えて" },
    { label: "🧾 領収書", text: "領収書をつくりたい" },
    { label: "⏰ アラーム", text: "アラームをセットしたい" },
    { label: "✍️ 投稿を書く", text: "投稿文を書いて" },
    { label: "🌙 夜のひとやすみ", text: "今日おつかれさま。ふり返りをお願い" }
  ];

  var lastJson = "";
  var members = {};

  function $(id) { return document.getElementById(id); }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  // ---- どうぶつの絵（全身・洋服・小物つき） ----
  function shade(hex, amt) {
    var n = parseInt(hex.replace("#", ""), 16);
    var r = Math.max(0, Math.min(255, (n >> 16) + amt)), g = Math.max(0, Math.min(255, ((n >> 8) & 255) + amt)), b = Math.max(0, Math.min(255, (n & 255) + amt));
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  }
  function ears(animal, c) {
    var d = shade(c, -28), inner = "#f6c3cf";
    switch (animal) {
      case "rabbit":
        return '<ellipse cx="31" cy="12" rx="5.5" ry="15" fill="' + c + '" transform="rotate(-8 31 12)"/><ellipse cx="49" cy="12" rx="5.5" ry="15" fill="' + c + '" transform="rotate(8 49 12)"/>' +
               '<ellipse cx="31" cy="13" rx="2.6" ry="10" fill="' + inner + '" transform="rotate(-8 31 13)"/><ellipse cx="49" cy="13" rx="2.6" ry="10" fill="' + inner + '" transform="rotate(8 49 13)"/>';
      case "cat":
        return '<path d="M21 30 L24 10 L36 21 Z" fill="' + c + '"/><path d="M59 30 L56 10 L44 21 Z" fill="' + c + '"/>' +
               '<path d="M24.5 25 L25.5 15 L32 21 Z" fill="' + inner + '"/><path d="M55.5 25 L54.5 15 L48 21 Z" fill="' + inner + '"/>';
      case "bear":
        return '<circle cx="23" cy="22" r="8" fill="' + c + '"/><circle cx="57" cy="22" r="8" fill="' + c + '"/><circle cx="23" cy="22" r="4" fill="' + inner + '"/><circle cx="57" cy="22" r="4" fill="' + inner + '"/>';
      case "hamster":
        return '<circle cx="25" cy="22" r="6" fill="' + c + '"/><circle cx="55" cy="22" r="6" fill="' + c + '"/><circle cx="25" cy="22" r="3" fill="' + inner + '"/><circle cx="55" cy="22" r="3" fill="' + inner + '"/>';
      case "chick":
        return '<path d="M38 18 q-2 -8 3 -9 q-1 4 2 9 z" fill="' + d + '"/>';
      default: // tanuki
        return '<circle cx="24" cy="22" r="7" fill="' + d + '"/><circle cx="56" cy="22" r="7" fill="' + d + '"/><circle cx="24" cy="23" r="3.2" fill="' + shade(c, -55) + '"/><circle cx="56" cy="23" r="3.2" fill="' + shade(c, -55) + '"/>';
    }
  }
  function face(animal, c) {
    var eyeC = "#4a3a40";
    var mask = animal === "tanuki" ? '<ellipse cx="31" cy="41" rx="6.5" ry="5" fill="' + shade(c, -45) + '" opacity=".45"/><ellipse cx="49" cy="41" rx="6.5" ry="5" fill="' + shade(c, -45) + '" opacity=".45"/>' : "";
    var muzzle = animal === "chick" ? "" : '<ellipse cx="40" cy="47" rx="9" ry="6.5" fill="#fff" opacity=".6"/>';
    var eyes = '<ellipse cx="32" cy="41" rx="2.6" ry="3.4" fill="' + eyeC + '"/><ellipse cx="48" cy="41" rx="2.6" ry="3.4" fill="' + eyeC + '"/>' +
               '<circle cx="33" cy="39.8" r="1" fill="#fff"/><circle cx="49" cy="39.8" r="1" fill="#fff"/>' +
               '<path d="M29.6 38.6 l-2.6 -1.6 M29.9 40 l-2.9 -0.4" stroke="' + eyeC + '" stroke-width="1" stroke-linecap="round"/>' +
               '<path d="M50.4 38.6 l2.6 -1.6 M50.1 40 l2.9 -0.4" stroke="' + eyeC + '" stroke-width="1" stroke-linecap="round"/>';
    var blush = '<ellipse cx="26.5" cy="47" rx="4" ry="2.3" fill="#f4a3b5" opacity=".65"/><ellipse cx="53.5" cy="47" rx="4" ry="2.3" fill="#f4a3b5" opacity=".65"/>';
    var mouth = animal === "chick"
      ? '<path d="M37 46 L43 46 L40 50 Z" fill="#eea36a"/>'
      : '<ellipse cx="40" cy="45.3" rx="2" ry="1.4" fill="#7a5560"/><path d="M37.6 48 q1.2 1.4 2.4 0 q1.2 1.4 2.4 0" stroke="#7a5560" stroke-width="1" fill="none" stroke-linecap="round"/>';
    return mask + muzzle + eyes + blush + mouth;
  }
  function accessory(acc, color) {
    var c = color || "#c4687f";
    switch (acc) {
      case "ribbon":  return '<g transform="translate(55 22) rotate(18)"><path d="M0 0 L-9 -5 L-9 5 Z M0 0 L9 -5 L9 5 Z" fill="' + c + '"/><circle r="2.4" fill="' + shade(c, -25) + '"/></g>';
      case "glasses": return '<g fill="none" stroke="#8a6f5a" stroke-width="1.4"><circle cx="32" cy="41" r="5.4"/><circle cx="48" cy="41" r="5.4"/><path d="M37.4 41 h5.2"/></g>';
      case "beret":   return '<ellipse cx="34" cy="20" rx="16" ry="6" fill="' + c + '" transform="rotate(-12 34 20)"/><circle cx="33" cy="13.5" r="1.8" fill="' + shade(c, -25) + '"/>';
      case "scarf":   return '<path d="M27 57 q13 7 26 0 l0 4 q-13 7 -26 0 z" fill="' + c + '"/><path d="M47 60 l3 12 l5 -2 l-3 -11 z" fill="' + c + '"/>';
      case "headset": return '<path d="M19 38 q0 -24 21 -24 q21 0 21 24" fill="none" stroke="' + c + '" stroke-width="2.4"/><rect x="16" y="35" width="6" height="10" rx="3" fill="' + c + '"/><rect x="58" y="35" width="6" height="10" rx="3" fill="' + c + '"/><path d="M19 44 q2 8 12 8" fill="none" stroke="' + c + '" stroke-width="1.4"/>';
      case "pearl":   return '<circle cx="19.5" cy="47" r="2" fill="#fff" stroke="#e6d6c9"/><circle cx="60.5" cy="47" r="2" fill="#fff" stroke="#e6d6c9"/>';
      default: return "";
    }
  }
  function animalSvg(m) {
    var c = m.color || "#b48a6a", o = m.outfit || "#f3d4dc", animal = m.animal || "tanuki";
    var fur2 = shade(c, -18);
    var tail = animal === "tanuki"
      ? '<g transform="rotate(-25 58 84)"><ellipse cx="66" cy="80" rx="7" ry="12" fill="' + c + '"/><path d="M60 76 q6 -2 12 0 M59.5 82 q6.5 -2 13 0" stroke="' + shade(c, -45) + '" stroke-width="2.4" fill="none"/><ellipse cx="66" cy="69.5" rx="4" ry="3" fill="' + shade(c, -45) + '"/></g>'
      : "";
    return '<svg viewBox="0 0 80 100" aria-hidden="true">' + tail +
      // 足・しっぽ
      '<ellipse cx="33" cy="95" rx="5" ry="3.4" fill="' + fur2 + '"/><ellipse cx="47" cy="95" rx="5" ry="3.4" fill="' + fur2 + '"/>' +
      // 体（洋服）
      '<path d="M28 58 Q40 54 52 58 L59 90 Q40 97 21 90 Z" fill="' + o + '"/>' +
      '<path d="M40 62 L40 92" stroke="' + shade(o, -22) + '" stroke-width="1" opacity=".6"/>' +
      '<circle cx="40" cy="70" r="1.3" fill="#fff"/><circle cx="40" cy="78" r="1.3" fill="#fff"/>' +
      '<path d="M33 58 L40 65 L47 58 Z" fill="#fff"/>' +
      // うで
      '<ellipse cx="24" cy="72" rx="4.5" ry="10" fill="' + o + '" transform="rotate(14 24 72)"/><ellipse cx="56" cy="72" rx="4.5" ry="10" fill="' + o + '" transform="rotate(-14 56 72)"/>' +
      '<circle cx="22" cy="81" r="3.6" fill="' + c + '"/><circle cx="58" cy="81" r="3.6" fill="' + c + '"/>' +
      // 頭
      ears(animal, c) +
      '<circle cx="40" cy="38" r="21" fill="' + c + '"/>' +
      face(animal, c) + accessory(m.acc, m.accColor) +
      '</svg>';
  }

  // ---- 位置 ----
  function wanderSpot() { return { left: 34 + Math.random() * 58, bottom: 18 + Math.random() * 8 }; }
  function spotFor(m, i, waitIndex) {
    if (m.status === "waiting") return { left: 24 + waitIndex * 8, bottom: 6 };
    if (m.status === "idle") return wanderSpot();
    var d = DESKS[i % DESKS.length];
    return { left: d.left, bottom: d.bottom - 6 }; // 自分のデスクごと表示して、座っているように見せる
  }
  function place(el, p) { el.style.left = "calc(" + p.left + "% - 48px)"; el.style.bottom = p.bottom + "%"; }

  // ---- 描画 ----
  function renderStaff(state) {
    var box = $("staff");
    var seen = {};
    var waitIndex = 0;
    (state.staff || []).forEach(function (m, i) {
      seen[m.id] = true;
      var el = members[m.id];
      if (!el) {
        var desk = document.createElement("div");
        desk.className = "member deskonly";
        desk.innerHTML = '<div class="desk"></div>';
        place(desk, DESKS[i % DESKS.length]);
        box.appendChild(desk);
        el = document.createElement("div");
        el.deskEl = desk;
        box.appendChild(el);
        members[m.id] = el;
      }
      var seated = m.status === "working" || m.status === "resting";
      el.deskEl.style.visibility = seated ? "hidden" : "visible";
      el.className = "member " + (m.status || "idle") + (seated ? " seated" : "");
      el.innerHTML = (m.say ? '<div class="bubble">' + esc(m.say) + '</div>' : "") +
        '<span class="hand">✋</span><span class="zzz">Zz</span>' +
        animalSvg(m) + (seated ? '<div class="desk front"></div>' : "") +
        '<span class="tag">' + esc(m.name) + '<span class="role">｜' + esc(m.role) + '</span></span>';
      el.dataset.status = m.status || "idle";
      place(el, spotFor(m, i, m.status === "waiting" ? waitIndex++ : 0));
    });
  }

  function renderList(id, items, fn, emptyText) {
    var ul = $(id);
    if (!items || !items.length) { ul.innerHTML = '<li class="empty">' + emptyText + '</li>'; return; }
    ul.innerHTML = items.map(fn).join("");
  }

  function render(state) {
    var t = state.theme || {};
    var root = document.documentElement.style;
    ["main", "sub", "wall", "floor", "panel"].forEach(function (k) { if (t[k]) root.setProperty("--" + k, t[k]); });
    $("company").textContent = state.company || "ぽこAIカンパニー";
    document.title = (state.company || "ぽこAIカンパニー") + " オフィス";
    $("boss").textContent = state.boss || "社長";
    $("updated").textContent = state.updated || "";

    renderStaff(state);

    renderList("today", state.today, function (x) {
      return '<li class="' + (x.done ? "done" : "") + '">' + (x.done ? "✅ " : "⬜ ") + esc(x.text) + '</li>';
    }, "まだありません。「朝のエリー便」で決めましょう");

    var waiting = state.waiting || [];
    $("waitCount").textContent = waiting.length ? String(waiting.length) : "";
    renderList("waiting", waiting, function (x, i) {
      return '<li><b>' + esc(x.from || "") + '</b>：' + esc(x.text) +
        '<div class="actions">' +
        '<button class="btn" data-copy="「' + esc(x.text) + '」はOKです。進めてください">OK</button>' +
        '<button class="btn alt" data-copy="「' + esc(x.text) + '」をなおしてほしいです。">なおして</button>' +
        '<button class="btn alt" data-copy="「' + esc(x.text) + '」はいったん保留にしてください">保留</button>' +
        '</div></li>';
    }, "確認待ちはありません 🎉");

    renderList("outputs", (state.outputs || []).slice().reverse().slice(0, 10), function (x) {
      return '<li><button class="link" data-copy="' + esc(x.path) + '">' + esc(x.title || x.path) + '</button>' +
        (x.date ? ' <span class="time">' + esc(x.date) + '</span>' : "") + '</li>';
    }, "まだありません");

    renderList("log", (state.log || []).slice().reverse().slice(0, 8), function (x) {
      return '<li><span class="time">' + esc(x.time) + '</span><b>' + esc(x.who) + '</b> ' + esc(x.text) + '</li>';
    }, "まだありません");
  }

  // ---- コピー ----
  function toast(msg) {
    var el = $("toast"); el.textContent = msg; el.classList.add("show");
    clearTimeout(toast.t); toast.t = setTimeout(function () { el.classList.remove("show"); }, 2200);
  }
  function copy(text) {
    function fallback() {
      var ta = document.createElement("textarea"); ta.value = text; document.body.appendChild(ta);
      ta.select(); try { document.execCommand("copy"); } catch (e) {} document.body.removeChild(ta);
      toast("コピーしました。Claude に貼りつけてください");
    }
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(function () { toast("コピーしました。Claude に貼りつけてください"); }, fallback);
    } else { fallback(); }
  }
  document.addEventListener("click", function (e) {
    var b = e.target.closest("[data-copy]");
    if (b) copy(b.getAttribute("data-copy"));
  });

  // ---- 読み込み（state.js を入れなおす） ----
  function load() {
    window.POKO_STATE = null;
    var s = document.createElement("script");
    s.src = "state.js?t=" + Date.now();
    s.onload = function () {
      s.remove();
      var st = window.POKO_STATE;
      if (!st) return showError();
      hideError();
      var json = JSON.stringify(st);
      if (json !== lastJson) { lastJson = json; render(st); }
    };
    s.onerror = function () { s.remove(); showError(); };
    document.head.appendChild(s);
  }
  function showError() {
    if ($("err")) return;
    var d = document.createElement("div"); d.id = "err"; d.className = "error";
    d.textContent = "⚠️ オフィスの情報（state.js）が読み込めませんでした。Claude に「オフィス画面が表示されないので直して」と伝えてください。";
    document.querySelector("main").prepend(d);
  }
  function hideError() { var d = $("err"); if (d) d.remove(); }

  // 待機中の社員は、ときどき歩きまわる
  setInterval(function () {
    Object.keys(members).forEach(function (id) {
      var el = members[id];
      if (el.dataset.status === "idle" && Math.random() < .5) place(el, wanderSpot());
    });
  }, 4000);

  $("quick").innerHTML = QUICK.map(function (q, i) {
    return '<button class="btn ' + (i % 2 ? "alt" : "") + '" data-copy="' + esc(q.text) + '">' + esc(q.label) + '</button>';
  }).join("");

  load();
  setInterval(load, 5000);
})();
