// © 2026 장선민 (github.com/sm-sarah). All rights reserved.
// [2026.11.13] works 자동 연결 서버(요청: "계속 자동연결하면 안돼?")
// - Google 비밀키(CLIENT_SECRET)는 여기(서버 환경 변수)에만 둔다. 브라우저에는 각 기기의 갱신용 열쇠(refresh token)만 있음.
// - 열쇠만으로는 토큰을 못 받고, 이 서버를 거쳐야 함. 서버는 works 주소에서 온 요청만 받고, 허용된 계정이 아니면 바로 취소함.
// - 서버는 아무것도 저장하지 않음(열쇠·토큰을 기록하지 않음).
// 환경 변수: CLIENT_ID, CLIENT_SECRET, ALLOWED_EMAILS(쉼표로 구분)
const functions = require('@google-cloud/functions-framework');

const ALLOWED_ORIGINS = ['https://sm-sarah.github.io'];
const allowedEmails = () => String(process.env.ALLOWED_EMAILS || '').split(',').map(s => s.trim().toLowerCase()).filter(Boolean);

functions.http('smAuth', async (req, res) => {
  const origin = req.get('Origin') || '';
  const okOrigin = ALLOWED_ORIGINS.includes(origin);
  if (okOrigin) { res.set('Access-Control-Allow-Origin', origin); res.set('Vary', 'Origin'); }
  if (req.method === 'OPTIONS') {
    res.set('Access-Control-Allow-Methods', 'GET, POST');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    res.set('Access-Control-Max-Age', '3600');
    return res.status(204).send('');
  }
  if (req.method === 'GET') return res.json({ ok: true });   // 개인웹이 서버가 살아있는지 확인용
  if (req.method !== 'POST' || !okOrigin) return res.status(403).json({ error: 'forbidden' });

  const body = req.body || {};
  const params = new URLSearchParams({ client_id: process.env.CLIENT_ID || '', client_secret: process.env.CLIENT_SECRET || '' });
  if (body.code) {
    params.set('grant_type', 'authorization_code');
    params.set('code', String(body.code));
    params.set('redirect_uri', 'postmessage');   // Google 로그인 창(팝업) 방식은 항상 postmessage
  } else if (body.refresh_token) {
    params.set('grant_type', 'refresh_token');
    params.set('refresh_token', String(body.refresh_token));
  } else {
    return res.status(400).json({ error: 'bad_request' });
  }

  try {
    const r = await fetch('https://oauth2.googleapis.com/token', { method: 'POST', body: params });
    const t = await r.json().catch(() => ({}));
    if (!r.ok || !t.access_token) return res.status(r.status === 400 ? 400 : 502).json({ error: t.error || 'token_failed' });

    // 허용된 계정인지 확인. 아니면 받은 권한을 바로 취소
    const u = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', { headers: { Authorization: 'Bearer ' + t.access_token } });
    const info = await u.json().catch(() => ({}));
    const email = String(info.email || '').toLowerCase();
    if (!email || !allowedEmails().includes(email)) {
      await fetch('https://oauth2.googleapis.com/revoke?token=' + encodeURIComponent(t.refresh_token || t.access_token), { method: 'POST' }).catch(() => {});
      return res.status(403).json({ error: 'not_allowed' });
    }

    const out = { access_token: t.access_token, expires_in: t.expires_in, scope: t.scope || '', email };
    if (body.code && t.refresh_token) out.refresh_token = t.refresh_token;
    return res.json(out);
  } catch (e) {
    return res.status(502).json({ error: 'server_error' });
  }
});
