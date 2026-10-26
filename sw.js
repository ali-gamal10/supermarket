// الشبكة أولاً (التحديثات توصل فوراً)، ولو النت قطع تظهر آخر نسخة محفوظة
const CACHE='supermarket-v1';
const key=u=>{const x=new URL(u);x.search='';return x.href};
self.addEventListener('install',()=>self.skipWaiting());
self.addEventListener('activate',e=>e.waitUntil(
  caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{
  const r=e.request;
  if(r.method!=='GET'||new URL(r.url).origin!==location.origin)return;
  e.respondWith(
    fetch(r).then(res=>{
      if(res&&res.ok){const c=res.clone();caches.open(CACHE).then(ch=>ch.put(key(r.url),c)).catch(()=>{})}
      return res;
    }).catch(()=>caches.match(key(r.url)).then(m=>m||caches.match(key(self.registration.scope))))
  );
});
