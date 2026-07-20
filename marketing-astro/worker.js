// Canonical-host worker: redirect www + http variants to https://__DOMAIN__,
// then serve the static Astro build from ./dist via the ASSETS binding.
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.hostname === "www.__DOMAIN__" || url.protocol === "http:") {
      url.hostname = "__DOMAIN__";
      url.protocol = "https:";
      return Response.redirect(url.toString(), 301);
    }
    // Legacy sitemap location (next-sitemap era, still submitted in GSC).
    if (url.pathname === "/sitemap.xml") {
      url.pathname = "/sitemap-index.xml";
      return Response.redirect(url.toString(), 301);
    }
    return env.ASSETS.fetch(request);
  },
};
