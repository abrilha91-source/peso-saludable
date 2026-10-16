const C='ps-v3';
const A=['./','index.html','app.js','data.js','manifest.json','icon-192.png','icon-512.png','fonts/NotoSans-Regular.ttf','fonts/NotoSans-Bold.ttf',...['prensa','goblet','rdl','hip','femoral','extension','pecho','jalon','remo','hombro','biceps','triceps','plancha'].map(k=>`img/${k}.jpg`)];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(A)));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))));self.clients.claim()});
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request)))});
self.addEventListener('notificationclick',e=>{e.notification.close();e.waitUntil(clients.openWindow('./'))});
