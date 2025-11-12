export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname.replace(/^\/+|\/+$/g, ""); // availability/takapradalu
    const parts = path.split("/");
    if (parts[0] !== "availability" || parts.length !== 2) {
      return new Response(JSON.stringify({ error: "Use /availability/{apt}" }), {
        status: 400,
        headers: corsHeaders()
      });
    }
    const apt = parts[1];

    const map = {
      takapradalu: {
        airbnb: env.AIRBNB_TAKAPRADALU,
        booking: env.BOOKING_TAKAPRADALU
      },
      takalcastel: {
        airbnb: env.AIRBNB_TAKALCASTEL,
        booking: env.BOOKING_TAKALCASTEL
      },
      takamusica1: {
        airbnb: env.AIRBNB_TAKAMUSICA1,
        booking: env.BOOKING_TAKAMUSICA1
      },
      takamusica2: {
        airbnb: env.AIRBNB_TAKAMUSICA2,
        booking: env.BOOKING_TAKAMUSICA2
      }
    };

    const sources = map[apt];
    if (!sources) {
      return new Response(JSON.stringify({ error: "Unknown apartment" }), {
        status: 404,
        headers: corsHeaders()
      });
    }

    try {
      // Cache lato edge per 15 minuti
      const cacheKey = new Request(request.url, request);
      const cache = caches.default;
      let cached = await cache.match(cacheKey);
      if (cached) return new Response(cached.body, { ...cached, headers: corsHeaders(cached.headers) });

      const texts = await Promise.all([
        fetchSafe(sources.airbnb),
        fetchSafe(sources.booking)
      ]);

      const events = texts.flatMap(t => parseICS(t));
      const occupied = expandToDates(events); // array di YYYY-MM-DD

      const body = JSON.stringify({
        apt,
        occupied,
        updatedAt: new Date().toISOString(),
        counts: { events: events.length, days: occupied.length }
      });

      const resp = new Response(body, {
        status: 200,
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "Cache-Control": "public, max-age=900, s-maxage=900",
          ...corsHeaders()
        }
      });
      ctx.waitUntil(cache.put(cacheKey, resp.clone()));
      return resp;
    } catch (e) {
      return new Response(JSON.stringify({ error: e.message || "fetch error" }), {
        status: 500,
        headers: corsHeaders()
      });
    }
  }
};

function corsHeaders(extra = {}) {
  const h = new Headers(extra);
  h.set("Access-Control-Allow-Origin", "*");
  h.set("Access-Control-Allow-Methods", "GET, OPTIONS");
  h.set("Access-Control-Allow-Headers", "Content-Type");
  return h;
}

async function fetchSafe(u) {
  if (!u) return "";
  const r = await fetch(u);
  if (!r.ok) throw new Error(`Fetch failed ${r.status}`);
  return await r.text();
}

// Parsifica DTSTART/DTEND da ICS
function parseICS(text) {
  if (!text) return [];
  const lines = text.split(/\r?\n/);
  const events = [];
  let cur = null;
  for (let raw of lines) {
    const line = raw.trim();
    if (line === "BEGIN:VEVENT") cur = {};
    else if (line === "END:VEVENT") {
      if (cur.start && cur.end) events.push(cur);
      cur = null;
    } else if (cur) {
      if (line.startsWith("DTSTART")) {
        const m = line.match(/:(\d{8})/);
        if (m) cur.start = ymdToDate(m[1]);
      } else if (line.startsWith("DTEND")) {
        const m = line.match(/:(\d{8})/);
        if (m) cur.end = ymdToDate(m[1]); // standard iCal: end esclusivo (checkout)
      }
    }
  }
  return events;
}

function ymdToDate(ymd) {
  const y = ymd.slice(0, 4);
  const m = ymd.slice(4, 6);
  const d = ymd.slice(6, 8);
  // ISO senza timezone, interpretato come locale del worker (UTC)
  return new Date(`${y}-${m}-${d}T00:00:00Z`);
}

function expandToDates(events) {
  const set = new Set();
  for (const ev of events) {
    if (!ev.start || !ev.end) continue;
    const d = new Date(ev.start);
    while (d < ev.end) {
      set.add(d.toISOString().slice(0, 10));
      d.setUTCDate(d.getUTCDate() + 1);
    }
  }
  return Array.from(set).sort();
}
