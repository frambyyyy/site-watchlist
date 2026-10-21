#!/usr/bin/env node
/* =========================================================
   Our Little Movie Night — optional tiny server (Node 18+, zero dependencies)

   The site works without it (just open index.html).
   Run it only if some posters are missing: it fetches them from TMDB
   using each film's exact TMDB id (read from Letterboxd), so there is
   no risk of mixing up films with the same title. The TMDB key stays
   here on the server, never in the browser.

   Config: a .env file next to this one (see .env.example)
     TMDB_READ_TOKEN   TMDB "API Read Access Token" (recommended)  ─┐ one of
     TMDB_API_KEY      TMDB "API Key" (v3)                          ─┘ the two
     PORT              default 5173
     HOST              default 127.0.0.1 (0.0.0.0 to open it from a phone on the same Wi-Fi)

   Run:  node server.js   →  http://localhost:5173
   ========================================================= */
"use strict";

const http = require("http");
const fs = require("fs");
const path = require("path");

const ROOT = __dirname;
loadDotEnv(path.join(ROOT, ".env"));

const PORT = Number(process.env.PORT) || 5173;
const HOST = process.env.HOST || "127.0.0.1";
const TMDB_TOKEN = (process.env.TMDB_READ_TOKEN || "").trim();
const TMDB_KEY = (process.env.TMDB_API_KEY || "").trim();
const HAS_TMDB = Boolean(TMDB_TOKEN || TMDB_KEY);

// Only these files are ever served (never .env or server.js).
const PUBLIC_FILES = new Set(["index.html", "style.css", "script.js", "watchlist.js", "us.jpg"]);
const MIME = {
  ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8", ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8", ".jpg": "image/jpeg",
};
const cache = new Map();

function loadDotEnv(file) {
  let text;
  try { text = fs.readFileSync(file, "utf8"); } catch { return; }
  for (const line of text.split(/\r?\n/)) {
    if (line.trim().startsWith("#")) continue;
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/i);
    if (m && !(m[1] in process.env)) process.env[m[1]] = m[2].replace(/^(['"])(.*)\1$/, "$2");
  }
}

async function posterFor(id) {
  const url = new URL(`https://api.themoviedb.org/3/movie/${id}`);
  const headers = { accept: "application/json" };
  if (TMDB_TOKEN) headers.authorization = "Bearer " + TMDB_TOKEN;
  else url.searchParams.set("api_key", TMDB_KEY);
  const res = await fetch(url, { headers, signal: AbortSignal.timeout(9000) });
  if (res.status === 404) return null;
  if (!res.ok) { const e = new Error("TMDB " + res.status); e.status = res.status; throw e; }
  const d = await res.json();
  return d.poster_path ? `https://image.tmdb.org/t/p/w500${d.poster_path}` : null;
}

function sendJSON(res, status, data) {
  res.writeHead(status, { "content-type": MIME[".json"], "cache-control": "no-store", "x-content-type-options": "nosniff" });
  res.end(JSON.stringify(data));
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, "http://localhost");
  if (req.method !== "GET" && req.method !== "HEAD") { res.writeHead(405); return res.end(); }

  if (url.pathname === "/api/health") return sendJSON(res, 200, { ok: true, tmdb: HAS_TMDB });

  if (url.pathname === "/api/poster") {
    if (!HAS_TMDB) return sendJSON(res, 503, { error: "no_tmdb_key" });
    const id = parseInt(url.searchParams.get("id") || "", 10);
    if (!(id > 0)) return sendJSON(res, 400, { error: "bad_id" });
    if (cache.has(id)) return sendJSON(res, 200, { poster: cache.get(id) });
    try {
      const poster = await posterFor(id);
      cache.set(id, poster);
      return sendJSON(res, 200, { poster });
    } catch (e) {
      console.error("[tmdb]", id, e.message);
      return sendJSON(res, 502, { error: e.status === 401 ? "tmdb_auth" : "tmdb_error" });
    }
  }

  let name = decodeURIComponent(url.pathname).replace(/^\/+/, "") || "index.html";
  if (!PUBLIC_FILES.has(name)) { res.writeHead(404, { "content-type": "text/plain" }); return res.end("Not found"); }
  fs.readFile(path.join(ROOT, name), (err, buf) => {
    if (err) { res.writeHead(404, { "content-type": "text/plain" }); return res.end("Not found"); }
    res.writeHead(200, { "content-type": MIME[path.extname(name)] || "application/octet-stream", "cache-control": "no-cache", "x-content-type-options": "nosniff" });
    res.end(buf);
  });
});

server.listen(PORT, HOST, () => {
  console.log(`\n  🎬💗  Our Little Movie Night  →  http://localhost:${PORT}\n`);
  console.log(HAS_TMDB ? "  TMDB: connected — missing posters will load.\n" : "  TMDB: no key in .env — the site works, missing posters stay as pink cards.\n");
});
