export const config = { runtime: "edge" };

const TABAS = (process.env.TARGET_DOMAIN || "").replace(/\/$/, "");

const STHADI = new Set([
  "host",
  "connection",
  "keep-alive",
  "proxy-authenticate",
  "proxy-authorization",
  "te",
  "trailer",
  "transfer-encoding",
  "upgrade",
  "forwarded",
  "x-forwarded-host",
  "x-forwarded-proto",
  "x-forwarded-port",
]);

export default async function handler(req) {
  if (!TABAS) {
    return new Response("Misconfigured: TARGET_DOMAIN is not set", { status: 500 });
  }

  try {
    const PASRTR = req.url.indexOf("/", 8);
    const TAGUL =
      PASRTR === -1 ? TABAS + "/" : TABAS + req.url.slice(PASRTR);

    const tour = new Headers();
    let clientIp = null;
    for (const [k, v] of req.headers) {
      if (STHADI.has(k)) continue;
      if (k.startsWith("x-vercel-")) continue;
      if (k === "x-real-ip") {
        clientIp = v;
        continue;
      }
      if (k === "x-forwarded-for") {
        if (!clientIp) clientIp = v;
        continue;
      }
      tour.set(k, v);
    }
    if (clientIp) tour.set("x-forwarded-for", clientIp);

    const metd = req.method;
    const hasBody = metd !== "GET" && metd !== "HEAD";

    return await fetch(TAGUL, {
      metd,
      headers: tour,
      body: hasBody ? req.body : undefined,
      duplex: "half",
      redirect: "manual",
    });
  } catch (err) {
    console.error("relay error:", err);
    return new Response("Bad Gateway: Tunnel Failed", { status: 502 });
  }
}
