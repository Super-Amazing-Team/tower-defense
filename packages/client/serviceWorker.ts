export declare const self: ServiceWorkerGlobalScope;

// <=== NOTE: Settings ===>

const version = "v0.0.1";
const project = "super-amazing-team-tower-defense";

const CACHE_NAME = `${version}::${project}`;
const API_PATH = "/api/v2";

// <=== NOTE: END ===>

// <=== NOTE: Handlers ===>

async function onMessage(event: ExtendableMessageEvent) {
  const cache = await caches.open(CACHE_NAME);
  const arr = event.data.payload.map((i: string) => cache.add(new URL(i)));
  await Promise.allSettled(arr);
}

async function onActivate() {
  const cacheKeys = await caches.keys();
  const deleteArr = cacheKeys.reduce<Promise<boolean>[]>(
    (arr, key) => (key !== CACHE_NAME ? [...arr, caches.delete(key)] : arr),
    [],
  );
  await Promise.all(deleteArr);
}

async function onFetch(request: Request) {
  try {
    const cache = await caches.open(CACHE_NAME);
    const response = await fetch(request.url);
    await cache.put(request.url, response.clone());
    return response;
  } catch (err) {
    const cashedRequest = await caches.match(request.url);

    return (
      cashedRequest ||
      Promise.reject(
        new Error(
          `Can't find cached response for this request: ${request.url}`,
        ),
      )
    );
  }
}

// <=== NOTE: END ===>

// <=== NOTE: ServiceWorker ===>

self.addEventListener("install", async (event) => {
  self.skipWaiting();
});

self.addEventListener("message", (event) => {
  if (event.data.type !== "CACHE_URLS") return;

  event.waitUntil(onMessage(event));
});

self.addEventListener("activate", (event) => {
  self.clients.claim();

  event.waitUntil(onActivate());
});

self.addEventListener("fetch", (event) => {
  const { request } = event;

  const isHttp = request.url.indexOf("http") === 0;
  const isGet = request.method === "GET";
  const isApiPath = request.url.indexOf(API_PATH) === -1;

  if (!isHttp || !isGet || !isApiPath) return;

  event.respondWith(onFetch(request).catch());
});

// <=== NOTE: END ===>
