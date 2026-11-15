// 感想の保存・読み出し API（Cloudflare Workers + KV）
// GET  /api/comments?round=1   → { comments: [...] }（新しい順）
// POST /api/comments           → { comment }  body: { round, section, name, body, website }
// それ以外のパスは public/ のファイルを返します。

const MAX_PER_ROUND = 500;
const json = (data, status = 200) => new Response(JSON.stringify(data), {
  status, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
});

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (!url.pathname.endsWith('/api/comments')) return env.ASSETS.fetch(request);

    if (request.method === 'GET') {
      const round = Number(url.searchParams.get('round'));
      if (!Number.isInteger(round) || round < 1) return json({ error: '回の指定が正しくありません。' }, 400);
      const list = (await env.COMMENTS.get(`round:${round}`, 'json')) || [];
      return json({ comments: list.filter((c) => !c.hidden) });
    }

    if (request.method === 'POST') {
      let input;
      try { input = await request.json(); } catch { return json({ error: '送信内容を読み取れませんでした。' }, 400); }
      const round = Number(input.round);
      const body = String(input.body || '').trim().slice(0, 200);
      const name = String(input.name || '').trim().slice(0, 20) || '匿名';
      if (input.website) return json({ comment: null }); // スパム対策の隠し欄に入力があれば保存しない
      if (!Number.isInteger(round) || round < 1) return json({ error: '回の指定が正しくありません。' }, 400);
      if (!body) return json({ error: '感想を入力してください。' }, 400);

      const key = `round:${round}`;
      const list = (await env.COMMENTS.get(key, 'json')) || [];
      const comment = {
        id: crypto.randomUUID(),
        name,
        body,
        section: input.section === 'summary' ? 'summary' : 'archive',
        created_at: new Date().toISOString(),
      };
      list.unshift(comment);
      await env.COMMENTS.put(key, JSON.stringify(list.slice(0, MAX_PER_ROUND)));
      return json({ comment });
    }

    return json({ error: '対応していない操作です。' }, 405);
  },
};
