// Cloudflare Worker: يرفع PDF إلى Dropbox ويُنشئ المجلد تلقائيًا إذا كان غير موجود
export default {
  async fetch(request, env) {
    const allowed = [
      'https://YOUR_USER.github.io',
      'https://YOUR_USER.github.io/theeb-contracts',
    ];
    const origin = request.headers.get('Origin') || '';
    const cors = {
      'Access-Control-Allow-Origin': allowed.includes(origin) ? origin : allowed[0],
      'Access-Control-Allow-Methods': 'POST,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };
    if (request.method === 'OPTIONS') return new Response('', { headers: cors });
    if (request.method !== 'POST') return new Response('Method Not Allowed', { status: 405, headers: cors });

    try {
      const url = new URL(request.url);
      const name   = url.searchParams.get('name')   || `contract-${Date.now()}.pdf`;
      const folder = url.searchParams.get('folder') || '/TheebContracts';
      const path   = `${folder}/${name}`;
      const body   = await request.arrayBuffer();

      const access = await getAccessToken(env);
      await ensureFolder(access, folder); // 🔧 مهم: إنشاء المجلد إذا لسه مش موجود

      const uploadRes = await fetch('https://content.dropboxapi.com/2/files/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${access}`,
          'Dropbox-API-Arg': JSON.stringify({ path, mode: 'add', autorename: true, mute: false }),
          'Content-Type': 'application/octet-stream',
        },
        body,
      });
      const uploadJson = await uploadRes.json();
      if (!uploadRes.ok) throw new Error(`Upload error: ${uploadRes.status} ${JSON.stringify(uploadJson)}`);

      let sharedUrl = '';
      const shareRes = await fetch('https://api.dropboxapi.com/2/sharing/create_shared_link_with_settings', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${access}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: uploadJson.path_lower, settings: { requested_visibility: 'public' } }),
      });
      if (shareRes.ok) {
        const j = await shareRes.json();
        sharedUrl = j.url;
      } else {
        const listRes = await fetch('https://api.dropboxapi.com/2/sharing/list_shared_links', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${access}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ path: uploadJson.path_lower, direct_only: true }),
        });
        const lj = await listRes.json();
        sharedUrl = (lj.links && lj.links[0] && lj.links[0].url) || '';
      }
      if (sharedUrl) sharedUrl = sharedUrl.replace('?dl=0', '?dl=1');

      return new Response(JSON.stringify({ ok:true, path: uploadJson.path_display, url: sharedUrl }), {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...cors },
      });
    } catch (err) {
      return new Response(JSON.stringify({ ok:false, error: String(err.message || err) }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...cors },
      });
    }
  }
};

// الحصول على access token إما من Refresh Token أو من Access Token مباشر
async function getAccessToken(env){
  if (env.DROPBOX_REFRESH_TOKEN && env.DROPBOX_APP_KEY && env.DROPBOX_APP_SECRET) {
    const basic = btoa(`${env.DROPBOX_APP_KEY}:${env.DROPBOX_APP_SECRET}`);
    const resp = await fetch('https://api.dropboxapi.com/oauth2/token', {
      method: 'POST',
      headers: { 'Authorization': `Basic ${basic}`, 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ grant_type: 'refresh_token', refresh_token: env.DROPBOX_REFRESH_TOKEN }),
    });
    const j = await resp.json();
    if (!resp.ok) throw new Error(`Token error: ${resp.status} ${JSON.stringify(j)}`);
    return j.access_token;
  }
  if (env.DROPBOX_ACCESS_TOKEN) return env.DROPBOX_ACCESS_TOKEN;
  throw new Error('No Dropbox token configured (set REFRESH or ACCESS token)');
}

// تنشئ المجلد إن لم يكن موجودًا (تتجاهل خطأ "موجود بالفعل")
async function ensureFolder(access, folderPath){
  if (!folderPath || folderPath === '/' ) return;
  const res = await fetch('https://api.dropboxapi.com/2/files/create_folder_v2', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${access}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ path: folderPath, autorename: false }),
  });
  if (res.ok) return;
  if (res.status === 409) return; // غالبًا موجود بالفعل
  const j = await res.json().catch(()=>({}));
  throw new Error(`Folder create error: ${res.status} ${JSON.stringify(j)}`);
}
