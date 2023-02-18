export async function registerSW() {
  if (!process.env.SW_ENABLED) return;

  if (!("serviceWorker" in navigator)) {
    console.warn("Your browser boesn't support ServiceWorker");
    return;
  }

  async function onLoad() {
    try {
      const registration = await navigator.serviceWorker.register(
        "/serviceWorker.ts",
        { scope: "/" },
      );

      if (!registration.installing) return;

      const data = {
        type: "CACHE_URLS",
        payload: [
          window.location.href,
          ...performance.getEntriesByType("resource").map((r) => r.name),
        ],
      };

      registration.installing.postMessage(data);
    } catch (err) {
      console.warn("Service worker register fail: ", err);
    }
  }

  window.addEventListener("load", onLoad);
}
