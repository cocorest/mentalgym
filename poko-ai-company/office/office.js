// ぽこAIカンパニー オフィス画面
// state.js を5秒ごとに読みなおして、画面を更新します（サーバー不要・ダブルクリックで開けます）。
(function () {
  "use strict";

  var DESKS = [
    { left: 30, bottom: 34 }, { left: 48, bottom: 34 }, { left: 66, bottom: 34 },
    { left: 39, bottom: 6 },  { left: 57, bottom: 6 },  { left: 75, bottom: 6 },
    { left: 84, bottom: 34 }, { left: 21, bottom: 6 }
  ];
  var QUICK = [
    { label: "☀️ 朝のぽこ便", text: "おはよう！朝のぽこ便をお願い" },
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

  // ---- どうぶつの絵 ----
  function ears(animal, c) {
    switch (animal) {
      case "rabbit": return '<ellipse cx="22" cy="10" rx="6" ry="16" fill="' + c + '"/><ellipse cx="42" cy="10" rx="6" ry="16" fill="' + c + '"/>' +
                            '<ellipse cx="22" cy="12" rx="3" ry="10" fill="#fff" opacity=".6"/><ellipse cx="42" cy="12" rx="3" ry="10" fill="#fff" opacity=".6"/>';
      case "cat":    return '<polygon points="12,24 18,4 30,18" fill="' + c + '"/><polygon points="52,24 46,4 34,18" fill="' + c + '"/>';
      case "chick":  return '<path d="M30 8 q2 -8 6 -2 q-2 2 -6 2z" fill="' + c + '"/>';
      case "bear":   return '<circle cx="16" cy="16" r="8" fill="' + c + '"/><circle cx="48" cy="16" r="8" fill="' + c + '"/>';
      default:       return '<circle cx="17" cy="16" r="7" fill="#5b4330"/><circle cx="47" cy="16" r="7" fill="#5b4330"/>'; // たぬき
    }
  }
  function face(animal) {
    var mask = animal === "tanuki" ? '<ellipse cx="24" cy="34" rx="8" ry="6" fill="#5b4330" opacity=".55"/><ellipse cx="40" cy="34" rx="8" ry="6" fill="#5b4330" opacity=".55"/>' : "";
    var mouth = animal === "chick" ? '<polygon points="29,40 35,40 32,45" fill="#f08a24"/>'
                                   : '<path d="M28 42 q4 4 8 0" stroke="#3b3a36" stroke-width="2" fill="none" stroke-linecap="round"/>';
    return mask + '<circle cx="24" cy="34" r="3" fill="#3b3a36"/><circle cx="40" cy="34" r="3" fill="#3b3a36"/>' +
           '<circle cx="18" cy="41" r="3" fill="#f6a5a5" opacity=".7"/><circle cx="46" cy="41" r="3" fill="#f6a5a5" opacity=".7"/>' + mouth;
  }
  function animalSvg(animal, color) {
    return '<svg viewBox="0 0 64 64" aria-hidden="true">' + ears(animal, color) +
           '<circle cx="32" cy="36" r="22" fill="' + color + '"/>' +
           '<ellipse cx="32" cy="42" rx="13" ry="10" fill="#fff" opacity=".45"/>' + face(animal) + '</svg>';
  }

  // ---- 位置 ----
  function wanderSpot() { return { left: 22 + Math.random() * 66, bottom: 4 + Math.random() * 26 }; }
  function spotFor(m, i, waitIndex) {
    if (m.status === "waiting") return { left: 25 + waitIndex * 9, bottom: 10 };
    if (m.status === "idle") return wanderSpot();
    var d = DESKS[i % DESKS.length];
    return { left: d.left, bottom: d.bottom + 4 };
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
        desk.className = "member"; desk.style.zIndex = 2;
        desk.innerHTML = '<div class="desk"></div>';
        place(desk, DESKS[i % DESKS.length]);
        box.appendChild(desk);
        el = document.createElement("div");
        box.appendChild(el);
        members[m.id] = el;
      }
      el.className = "member " + (m.status || "idle");
      el.innerHTML = (m.say ? '<div class="bubble">' + esc(m.say) + '</div>' : "") +
        '<span class="hand">✋</span><span class="zzz">Zz</span>' +
        animalSvg(m.animal || "tanuki", m.color || "#a07850") +
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
    }, "まだありません。「朝のぽこ便」で決めましょう");

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
