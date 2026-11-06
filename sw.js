const C = 'b13-v1', ASSETS = ['./', 'index.html', 'manifest.webmanifest', 'icons/b13_icon_192.png', 'icons/b13_icon_512.png'];
self.addEventListener('install', e => e.waitUntil(caches.open(C).then(c => Promise.all(ASSETS.map(a => c.add(a).catch(() => {})))).then(() => self.skipWaiting())));
self.addEventListener('activate', e => e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== C).map(k => caches.delete(k)))).then(() => self.clients.claim())));
self.addEventListener('fetch', e => {
  const r = e.request;
  if (r.method !== 'GET' || new URL(r.url).origin !== location.origin) return;   // never touch Supabase / CDN requests
  e.respondWith(fetch(r).then(res => { const cp = res.clone(); caches.open(C).then(c => c.put(r, cp)); return res; })
    .catch(() => caches.match(r).then(m => m || caches.match('index.html'))));
});
