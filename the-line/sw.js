// The Line has moved to https://skepticowl.github.io/the-line/.
// An app installed from this old address still runs its offline copy, through the old
// service worker. When it checks for an update it gets this one instead, which throws
// that copy away, steps aside, and sends the open game to the new address.
const NEW = 'https://skepticowl.github.io/the-line/';

self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', (e) => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((k) => k.startsWith('the-line-')).map((k) => caches.delete(k)));
    await self.registration.unregister();
    const open = await self.clients.matchAll({ type: 'window' });
    for (const c of open) {
      const at = new URL(c.url);
      c.navigate(NEW + at.search + at.hash).catch(() => {});
    }
  })());
});
