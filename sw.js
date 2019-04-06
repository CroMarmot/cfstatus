importScripts('/cfstatus/_nuxt/workbox.4c4f5ca6.js')

workbox.precaching.precacheAndRoute([
  {
    "url": "/cfstatus/_nuxt/07d10da66b176690318b.js",
    "revision": "416d5b6ff18d48bf6b54f1d814d5fd60"
  },
  {
    "url": "/cfstatus/_nuxt/b4eb49908474a7643e90.js",
    "revision": "a2e9c4fb9ed4bb334c74b44194ca3a56"
  },
  {
    "url": "/cfstatus/_nuxt/d862692c900c128a3466.js",
    "revision": "8270cc2cc54608c63bbb4720aed85784"
  },
  {
    "url": "/cfstatus/_nuxt/e81db7ae9a2cdb22f8ca.js",
    "revision": "0d1e271d811f9d67419ee7e67532d4c4"
  },
  {
    "url": "/cfstatus/_nuxt/f091a041e577ceca8d0c.js",
    "revision": "fa77ca3d82ebf73a91f1ba6ff26d8710"
  },
  {
    "url": "/cfstatus/_nuxt/f0c9825101170ff92acd.js",
    "revision": "1d35a88440f8ad2130a51130a69880ed"
  }
], {
  "cacheId": "cfstatus",
  "directoryIndex": "/",
  "cleanUrls": false
})

workbox.clientsClaim()
workbox.skipWaiting()

workbox.routing.registerRoute(new RegExp('/cfstatus/_nuxt/.*'), workbox.strategies.cacheFirst({}), 'GET')

workbox.routing.registerRoute(new RegExp('/cfstatus/.*'), workbox.strategies.networkFirst({}), 'GET')
