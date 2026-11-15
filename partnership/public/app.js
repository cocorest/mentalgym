(() => {
  const S = window.SEMINAR;
  const { rounds, course } = S;
  const app = document.getElementById('app');
  const toastEl = document.getElementById('toast');
  const STAMP_KEY = 'mentalgym-partnership-stamps';
  const API = 'api/comments';
  const FIRST_SHOWN = 5;
  let token = 0;

  // 小さな要素作成ヘルパー
  function el(tag, props, ...kids) {
    const node = document.createElement(tag);
    Object.entries(props || {}).forEach(([k, v]) => {
      if (v === false || v == null) return;
      if (k === 'class') node.className = v;
      else if (k === 'text') node.textContent = v;
      else if (k.startsWith('on')) node.addEventListener(k.slice(2), v);
      else node.setAttribute(k, v);
    });
    node.append(...kids.flat(Infinity).filter((k) => k != null && k !== false));
    return node;
  }

  const store = {
    get() {
      try { return new Set(JSON.parse(localStorage.getItem(STAMP_KEY)) || []); } catch { return new Set(); }
    },
    add(no) {
      const s = store.get();
      const fresh = !s.has(no);
      s.add(no);
      try { localStorage.setItem(STAMP_KEY, JSON.stringify([...s])); } catch {}
      return fresh;
    },
  };

  const isOpen = (r) => Boolean(r.youtube || r.summary);
  const oneLine = (t) => (t || '').replace(/\n/g, ' ');

  function ytId(v) {
    const t = (v || '').trim();
    if (/^[\w-]{11}$/.test(t)) return t;
    const m = t.match(/(?:v=|youtu\.be\/|\/live\/|\/embed\/|\/shorts\/)([\w-]{11})/);
    return m ? m[1] : '';
  }

  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.hidden = false;
    clearTimeout(toast.t);
    toast.t = setTimeout(() => { toastEl.hidden = true; }, 3200);
  }

  // 感想を送ったときに泡がはじける演出
  function bubbles(from) {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const r = from.getBoundingClientRect();
    for (let i = 0; i < 10; i += 1) {
      const b = el('span', { class: 'pop', 'aria-hidden': 'true' });
      const size = 8 + Math.random() * 16;
      Object.assign(b.style, {
        left: `${r.left + r.width / 2 + (Math.random() - 0.5) * 90}px`,
        top: `${r.top}px`, width: `${size}px`, height: `${size}px`,
        animationDelay: `${i * 40}ms`,
      });
      b.style.setProperty('--dx', `${(Math.random() - 0.5) * 80}px`);
      b.addEventListener('animationend', () => b.remove());
      document.body.append(b);
    }
  }

  function sea() {
    return document.createRange().createContextualFragment(`
      <svg class="sea" viewBox="0 0 140 120" aria-hidden="true">
        <path d="M20 66c10-26 44-40 72-30 10 4 16 2 22-6-1 12-6 18-12 22 8 8 12 18 12 28-8-8-16-10-24-8-18 6-40 4-54-2-6 8-16 10-24 8 6-3 9-7 8-12z" fill="url(#fin)"/>
        <circle cx="86" cy="52" r="2.4" fill="#0E2A3A"/>
        <path d="M60 40c4-10 12-16 20-16-4 6-6 12-4 18" fill="url(#fin)"/>
        <defs><linearGradient id="fin" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#BFE7EE"/><stop offset="1" stop-color="#6FB8C9"/></linearGradient></defs>
        <circle class="bub" cx="100" cy="30" r="4" />
        <circle class="bub b2" cx="110" cy="40" r="2.6" />
        <circle class="bub b3" cx="94" cy="20" r="2" />
      </svg>`);
  }

  const inline = (t) => t.split('**').map((p, i) => (i % 2 ? el('strong', { text: p }) : p));

  // 空行で段落。「」だけの段落は吹き出し、**太字だけ** の段落は大きな一文
  function rich(cls, text) {
    const paras = text.split(/\n{2,}/).map((b) => b.trim()).filter(Boolean);
    return el('div', { class: `rich ${cls || ''}`.trim() }, paras.map((p) => {
      const lines = p.split('\n').map((l) => l.trim());
      if (lines.every((l) => /^「[^「」]*」$/.test(l))) {
        return el('div', { class: 'quotes' }, lines.map((l) => el('p', { class: 'quote', text: l.slice(1, -1) })));
      }
      if (/^\*\*[^*]+\*\*$/.test(p)) return el('p', { class: 'pull', text: p.slice(2, -2) });
      return el('p', {}, inline(p));
    }));
  }

  function ctaButton(extraClass) {
    const label = course.url ? course.cta : `${course.cta}（準備中）`;
    return course.url
      ? el('a', { class: `cta ${extraClass || ''}`, href: course.url, target: '_blank', rel: 'noopener' }, label, ' →')
      : el('span', { class: `cta disabled ${extraClass || ''}`, 'aria-disabled': 'true' }, label);
  }

  // 各回ページに挟むコンパクトな告知（元ページの画像バナーに当たる部分）
  function banner() {
    return el('aside', { class: 'banner', 'aria-label': course.label },
      el('div', { class: 'banner-label', text: course.label }),
      el('div', { class: 'banner-name', text: course.name }),
      course.date ? el('div', { class: 'banner-date', text: course.date }) : null,
      el('a', { class: 'banner-more', href: '#offer', text: '詳しく見る ↓' }),
    );
  }

  // トップの販売ブロック
  function offer() {
    return el('section', { class: 'offer', id: 'offer', 'aria-labelledby': 'offer-title' },
      el('div', { class: 'eyebrow', text: 'MAIN COURSE' }),
      el('h2', { id: 'offer-title', class: 'offer-name', text: course.name }),
      course.date ? el('p', { class: 'offer-date', text: course.date }) : null,
      rich('offer-lead', course.lead),
      el('ul', { class: 'features' }, course.features.map((f) => el('li', { text: f }))),
      el('div', { class: 'price' },
        el('div', { class: 'price-num', text: course.price }),
        course.priceNote ? el('div', { class: 'price-note', text: course.priceNote }) : null,
        course.limit ? el('div', { class: 'price-limit', text: course.limit }) : null,
      ),
      ctaButton('big'),
    );
  }

  function top() {
    document.title = `${S.title}｜${S.brand}`;
    const stamps = store.get();
    const done = stamps.size >= rounds.length;
    app.replaceChildren(
      el('header', { class: 'hero' },
        el('div', { class: 'wrap hero-inner' },
          el('div', { class: 'brand', text: S.brand }),
          el('h1', {},
            el('small', { text: S.title }),
            el('span', { class: 'script', lang: 'en', text: 'Partnership' }),
          ),
          el('p', { class: 'catch', text: S.catch }),
          el('p', { class: 'promise', text: S.promise }),
          sea(),
        ),
      ),
      el('main', { class: 'wrap' },
        el('nav', { class: 'tickets', 'aria-label': '講座の回を選ぶ' }, rounds.map((r) => {
          const open = isOpen(r);
          const got = stamps.has(r.no);
          return el('a', {
            class: `ticket${open ? '' : ' locked'}`,
            href: `#${r.no}`,
            'aria-label': `${r.no}回目 ${oneLine(r.title)}${open ? '' : ' 準備中'}${got ? ' 感想送信済み' : ''}`,
          },
            el('div', { class: 'ticket-no', text: r.no }),
            el('div', { class: 'ticket-body' },
              el('div', { class: 'ticket-label', text: `${r.no}回目` }),
              el('div', { class: 'ticket-title', text: r.title }),
              r.date ? el('div', { class: 'ticket-date', text: r.date }) : null,
              el('span', { class: 'pill', text: open ? '見る' : '準備中' }),
            ),
            el('div', { class: 'ticket-stub' }, el('div', { class: `stamp${got ? ' on' : ''}`, text: '🐬' })),
          );
        })),
        el('p', { class: 'stamp-note' },
          done ? el('strong', { text: `全${rounds.length}回のスタンプが揃いました` }) : null,
          done ? '最後まで見てくださって、ありがとうございます。' : '感想を送ると、イルカのスタンプが押されます。',
        ),
        offer(),
        el('footer', { class: 'foot', text: `© ${S.brand}` }),
      ),
    );
  }

  function sayItem(c, fresh) {
    const d = new Date(c.created_at);
    return el('li', { class: `say${fresh ? ' new' : ''}` },
      el('div', { class: 'say-meta' },
        el('b', { text: c.name }),
        el('time', { datetime: c.created_at, text: `${d.getMonth() + 1}/${d.getDate()}` }),
      ),
      el('p', { text: c.body }),
    );
  }

  // 感想フォーム＋みんなの感想（動画の下と要約の下の2か所。一覧は共通）
  function voice(round, section, onPosted) {
    const id = `${section}-${round.no}`;
    const list = el('ul', { class: 'says' });
    const head = el('div', { class: 'voice-head' });
    const more = el('button', { class: 'more', type: 'button', hidden: true });
    const empty = el('p', { class: 'empty', text: '読み込んでいます…' });
    let all = [];
    let open = false;

    function paint(newId) {
      head.textContent = `みんなの感想（${all.length}件）`;
      empty.textContent = 'まだ感想はありません。最初のひとことをお待ちしています。';
      empty.hidden = all.length > 0;
      const shown = open ? all : all.slice(0, FIRST_SHOWN);
      list.replaceChildren(...shown.map((c) => sayItem(c, c.id === newId)));
      more.hidden = shown.length === all.length;
      more.textContent = `すべて見る（${all.length}件）`;
    }
    more.addEventListener('click', () => { open = true; paint(); });

    const err = el('p', { class: 'form-error', role: 'alert', hidden: true });
    const name = el('input', { id: `name-${id}`, type: 'text', maxlength: 20, placeholder: '匿名', autocomplete: 'nickname' });
    const body = el('textarea', { id: `body-${id}`, maxlength: 200, required: true, placeholder: '心に残ったことを、ひとことどうぞ' });
    const trap = el('input', { type: 'text', tabindex: '-1', autocomplete: 'off', name: 'website' });
    const send = el('button', { class: 'send', type: 'submit', text: '感想を送る' });

    async function submit(e) {
      e.preventDefault();
      err.hidden = true;
      if (!body.value.trim()) {
        err.textContent = '感想を入力してください。';
        err.hidden = false;
        body.focus();
        return;
      }
      send.disabled = true;
      send.textContent = '送信しています…';
      try {
        const res = await fetch(API, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ round: round.no, section, name: name.value, body: body.value, website: trap.value }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        if (data.comment) onPosted(data.comment);
        body.value = '';
        bubbles(send);
        toast(store.add(round.no)
          ? `ありがとうございます。${round.no}回目のスタンプが押されました🐬`
          : 'ありがとうございます。感想が届きました🐬');
      } catch (f) {
        err.textContent = f instanceof TypeError || !f.message
          ? '送信できませんでした。電波のよいところで、もう一度お試しください。'
          : f.message;
        err.hidden = false;
      } finally {
        send.disabled = false;
        send.textContent = '感想を送る';
      }
    }

    return {
      node: el('div', { class: 'voice' },
        el('form', { class: 'form', novalidate: true, onsubmit: submit },
          el('div', { class: 'form-title', text: 'ひとこと感想' }),
          el('div', { class: 'field' }, el('label', { for: name.id, text: 'お名前（空欄なら匿名になります）' }), name),
          el('div', { class: 'field' }, el('label', { for: body.id, text: '感想' }), body),
          el('div', { class: 'trap', 'aria-hidden': 'true' }, trap),
          err, send,
        ),
        head, empty, list, more,
      ),
      set(c) { all = c.slice(); paint(); },
      add(c) { all.unshift(c); paint(c.id); },
      fail() {
        head.textContent = 'みんなの感想';
        empty.textContent = '感想を読み込めませんでした。ページを開き直すと表示されることがあります。';
        empty.hidden = false;
      },
    };
  }

  const go = (id) => {
    const t = document.getElementById(id);
    if (!t) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    t.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  };

  function heading(eyebrow, text, id) {
    return el('div', {}, el('div', { class: 'eyebrow', text: eyebrow }), el('h2', { id, text }));
  }

  function archive(round, v) {
    const id = ytId(round.youtube);
    return el('section', { class: 'section', id: 'archive', 'aria-labelledby': 'archive-title' },
      heading('ARCHIVE', 'アーカイブ', 'archive-title'),
      el('div', { class: 'player' }, id
        ? el('iframe', {
          src: `https://www.youtube-nocookie.com/embed/${id}?rel=0&playsinline=1`,
          title: `${round.no}回目のアーカイブ動画`,
          loading: 'lazy',
          allow: 'accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen',
          allowfullscreen: true,
          referrerpolicy: 'strict-origin-when-cross-origin',
        })
        : el('div', { class: 'player-empty' }, el('span', { text: '▶', 'aria-hidden': 'true' }), '動画は準備中です')),
      v.node,
    );
  }

  function summary(round, v) {
    const s = round.summary;
    const pts = (s && s.points) || [];
    return el('section', { class: 'section', id: 'summary', 'aria-labelledby': 'summary-title' },
      heading('SUMMARY', '要約', 'summary-title'),
      s
        ? el('div', { class: 'letter' },
          s.heading ? el('p', { class: 'summary-heading', text: s.heading }) : null,
          pts.length ? el('nav', { class: 'toc', 'aria-label': 'この回のポイント' },
            el('p', { class: 'toc-title', text: `この回のポイント ${pts.length}つ` }),
            el('ol', {}, pts.map((p, i) => el('li', {},
              el('button', { type: 'button', onclick: () => go(`point-${i + 1}`) },
                el('span', { class: 'toc-no', text: i + 1 }), el('span', { text: p.title })),
            ))),
          ) : null,
          s.lead ? rich('lead', s.lead) : null,
          el('ol', { class: 'points' }, pts.map((p, i) => el('li', { class: 'point', id: `point-${i + 1}` },
            el('h3', {}, el('span', { text: p.title })), rich('', p.body)))),
          (s.blocks || []).map((b) => el('div', { class: 'work' }, el('h3', { text: b.title }), rich('', b.body))),
        )
        : el('p', { class: 'note', text: '要約は準備中です。もう少しお待ちください。' }),
      v.node,
    );
  }

  async function loadComments(no, t, voices) {
    try {
      const res = await fetch(`${API}?round=${no}`);
      if (!res.ok) throw new Error();
      const { comments } = await res.json();
      if (t === token) voices.forEach((v) => v.set(comments));
    } catch {
      if (t === token) voices.forEach((v) => v.fail());
    }
  }

  function roundPage(round) {
    const t = (token += 1);
    const open = isOpen(round);
    document.title = `${round.no}回目｜${S.title}`;
    const prev = rounds.find((r) => r.no === round.no - 1);
    const next = rounds.find((r) => r.no === round.no + 1);
    const posted = (c) => [va, vs].forEach((v) => v.add(c));
    const va = open ? voice(round, 'archive', posted) : null;
    const vs = open ? voice(round, 'summary', posted) : null;

    app.replaceChildren(
      el('nav', { class: 'bar', 'aria-label': '回の切り替え' },
        el('div', { class: 'wrap bar-inner' },
          el('a', { class: 'home', href: '#', text: 'トップ' }),
          el('div', { class: 'tabs' }, rounds.map((r) => el('a', {
            class: 'tab', href: `#${r.no}`, text: `${r.no}回目`, 'aria-current': r.no === round.no ? 'page' : false,
          }))),
        ),
      ),
      el('main', { class: 'wrap' },
        open
          ? [
            el('header', { class: 'round-head' },
              el('div', { class: 'round-no', text: `${S.title}　${round.no}回目` }),
              el('h1', { text: round.title }),
              round.date ? el('div', { class: 'round-date', text: round.date }) : null,
              el('div', { class: 'jump' },
                el('button', { type: 'button', class: 'jump-btn', onclick: () => go('archive') }, '▶ 動画を見る'),
                el('button', { type: 'button', class: 'jump-btn primary', onclick: () => go('summary') }, '要約を読む ↓'),
              ),
            ),
            round.summary ? el('button', { type: 'button', class: 'float-jump', hidden: true, onclick: () => go('summary') }, '要約へ ↓') : null,
            round.sample ? el('p', { class: 'sample', text: 'サンプル表示です。実際の内容に差し替えます。' }) : null,
            archive(round, va),
            el('div', { class: 'banner-slot' }, banner()),
            summary(round, vs),
          ]
          : el('div', { class: 'pending' },
            el('span', { class: 'pending-mark', text: '🐬', 'aria-hidden': 'true' }),
            el('div', { class: 'round-no', text: `${round.no}回目` }),
            el('h1', { class: 'pending-title', text: round.title }),
            round.date ? el('div', { class: 'round-date', text: round.date }) : null,
            el('p', { text: 'アーカイブは開催後に公開します。もう少しお待ちください。' }),
            banner(),
          ),
        el('div', { class: 'pager' },
          prev ? el('a', { href: `#${prev.no}`, text: `← ${prev.no}回目` }) : null,
          next ? el('a', { class: 'next', href: `#${next.no}`, text: `${next.no}回目 →` }) : null,
        ),
      ),
    );
    if (open) loadComments(round.no, t, [va, vs]);
  }

  // 要約がまだ画面に入っていない間だけ「要約へ」ボタンを出す
  let queued = false;
  window.addEventListener('scroll', () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      const b = document.querySelector('.float-jump');
      const s = document.getElementById('summary');
      if (b && s) b.hidden = !(window.scrollY > 240 && s.getBoundingClientRect().top > window.innerHeight * 0.7);
    });
  }, { passive: true });

  // トップ内の #offer へのリンクは、回ページから来た場合トップを描画してから移動
  function route() {
    token += 1;
    const hash = location.hash.slice(1);
    const round = rounds.find((r) => String(r.no) === hash);
    if (round) { roundPage(round); window.scrollTo(0, 0); return; }
    top();
    if (hash === 'offer') go('offer'); else window.scrollTo(0, 0);
  }

  window.addEventListener('hashchange', route);
  route();
})();
