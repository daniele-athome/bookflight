'use strict';

// Update cache names any time any of the cached files change.
const CACHE_NAME = 'static-cache-v1';

// List of files to cache.
// Minimum needed for offline page.
const FILES_TO_CACHE = [
    'offline.html',
    'style.css',

    'bootstrap/bootstrap.min.css',
    'bootstrap/bootstrap.min.js',

    'fontawesome/css/all.min.css',
    'fontawesome/webfonts/fa-solid-900.woff',
    'fontawesome/webfonts/fa-solid-900.woff2',
    'fontawesome/webfonts/fa-brands-400.ttf',
    'fontawesome/webfonts/fa-brands-400.svg',
    'fontawesome/webfonts/fa-regular-400.ttf',
    'fontawesome/webfonts/fa-regular-400.svg',
    'fontawesome/webfonts/fa-regular-400.woff',
    'fontawesome/webfonts/fa-solid-900.eot',
    'fontawesome/webfonts/fa-regular-400.eot',
    'fontawesome/webfonts/fa-solid-900.svg',
    'fontawesome/webfonts/fa-brands-400.woff',
    'fontawesome/webfonts/fa-brands-400.woff2',
    'fontawesome/webfonts/fa-brands-400.eot',
    'fontawesome/webfonts/fa-solid-900.ttf',
    'fontawesome/webfonts/fa-regular-400.woff2',
];

self.addEventListener('install', (evt) => {
    console.log('[ServiceWorker] Install');
    evt.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('[ServiceWorker] Pre-caching offline page');
            return cache.addAll(FILES_TO_CACHE);
        })
    );

    self.skipWaiting();
});

self.addEventListener('activate', (evt) => {
    console.log('[ServiceWorker] Activate');
    evt.waitUntil(
        caches.keys().then((keyList) => {
            return Promise.all(keyList.map((key) => {
                if (key !== CACHE_NAME) {
                    console.log('[ServiceWorker] Removing old cache', key);
                    return caches.delete(key);
                }
            }));
        })
    );

    self.clients.claim();
});

self.addEventListener('fetch', (evt) => {
    console.log('[ServiceWorker] Fetch', evt.request.url);
    if (evt.request.mode !== 'navigate') {
        // Not a page navigation, bail.
        return;
    }
    evt.respondWith(
        fetch(evt.request)
            .catch(() => {
                return caches.open(CACHE_NAME)
                    .then((cache) => {
                        return cache.match('offline.html');
                    });
            })
    );

});
