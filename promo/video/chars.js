// ぽこAIカンパニーのキャラクター（オフィス画面と同じ描き方）
(function () {
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


  var STAFF = {
    ellie:   { animal: "tanuki",  color: "#b48a6a", outfit: "#f3d4dc", acc: "ribbon",  accColor: "#c4687f" },
    tsumiki: { animal: "bear",    color: "#c9a88c", outfit: "#d8cbee", acc: "headset", accColor: "#a993cf" },
    kotoha:  { animal: "rabbit",  color: "#fbf4f1", outfit: "#eeb3c2", acc: "beret",   accColor: "#a993cf" },
    soropon: { animal: "hamster", color: "#efcfa6", outfit: "#f7e6d2", acc: "glasses", accColor: "" },
    yupin:   { animal: "cat",     color: "#d9d3dc", outfit: "#f6cdd7", acc: "scarf",   accColor: "#a993cf" }
  };
  window.pokoChar = function (id) { return animalSvg(STAFF[id]); };
  // data-char="ellie" の要素にキャラを描く
  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll("[data-char]").forEach(function (el) { el.innerHTML = animalSvg(STAFF[el.dataset.char]); });
  });
})();
