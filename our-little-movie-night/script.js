/* =========================================================
   Our Little Movie Night — for Aylie, from Roro ♡
   App logic (vanilla JS, no dependencies)

   Sections:
     1. CONFIG & TEXTS   ← edit names and all visible copy here (EN + FR)
     2. Watchlist        ← loaded from watchlist.js (Aylie's Letterboxd watchlist)
     3. Utilities
     4. Storage          ← localStorage today, swappable for a DB later
     5. State
     6. i18n
     7. Sound
     8. Confetti
     9. Wheel (drawing + spin physics + winner math)
    10. Result dialog
    11. Watchlist grid
    12. History
    13. Extras (movie of the day, love notes, date night)
    14. Init
   ========================================================= */
(() => {
  "use strict";

  /* =========================================================
     1. CONFIG & TEXTS
     ========================================================= */
  const CONFIG = {
    // Our names — used everywhere {her} and {him} appear in the texts below.
    NAMES: { her: "Aylie", him: "Roro" },
    WATCHLIST_URL: "https://letterboxd.com/aylie_tbr/watchlist/",
    STORAGE_KEY: "olmn.aylie.v1",
    SPIN_MIN_MS: 5200,
    SPIN_MAX_MS: 6600,
    LOVE_NOTE_EVERY_MS: 25000,
    // Max sectors that still get a printed title (above that, the live ticker shows the name).
    MAX_LABELLED_SECTORS: 64,
    WHEEL_COLORS: ["#C74368", "#F4BFD2", "#69263F", "#F9DCE7", "#E06B8D", "#FFF8F3"],
  };

  const TEXTS = {
    en: {
      skip: "Skip to content",
      brand: "Our Little Movie Night",
      navWheel: "The Wheel", navWatchlist: "Our Watchlist", navHistory: "Movie History",
      eyebrow: "{her} & {him}'s tiny cinema club",
      heroTitle: "One wheel. Two hearts.<br><em>One movie.</em>",
      heroSubtitle: "Let fate pick tonight's movie date.",
      statWishlist: "films on {her}'s watchlist", statWheel: "on the wheel", statWatched: "watched together",
      spin: "Spin the wheel",
      spinning: "Spinning…",
      optSurprise: "Surprise Me (hide the titles)",
      optExcludeWatched: "Skip movies we've watched",
      optFavoritesOnly: "Favorites only",
      wheelEmptyNone: "The wheel is empty — the watchlist file (watchlist.js) couldn't be loaded.",
      wheelEmptyFiltered: "No film matches these wheel options. Turn one off, or put films back on the wheel.",
      surpriseTicker: "✨ it's a secret until it stops ✨",
      spinStatusStart: "The wheel is spinning.",
      spinStatusEnd: "The wheel stopped on {title}.",
      motdTitle: "Movie of the day",
      motdEmpty: "Put a few films back on the wheel and a daily pick will appear here.",
      motdPick: "Make it tonight's film",
      loveNoteNext: "another little note ♡",
      watchlistEyebrow: "every film {her} has been dreaming of",
      watchlistTitle: "Our Watchlist",
      watchlistCount: "{shown} of {total} films · {wheel} on the wheel",
      openHerWatchlist: "Open {her}'s watchlist on Letterboxd ↗",
      searchLabel: "Search films", searchPlaceholder: "Search a title or director…",
      filterYear: "Decade", filterGenre: "Genre", filterShow: "Show",
      anyDecade: "Any decade", anyGenre: "Any genre", noGenre: "No genre data",
      decade: "{d}s",
      showAll: "All films", showWheel: "On the wheel", showOff: "Off the wheel", showFav: "Our favorites",
      gridEmpty: "No film matches your search. Try another word ♡",
      gridEmptyAll: "The watchlist is empty.",
      onWheel: "On the wheel", offWheel: "Off the wheel",
      onWheelAria: "{title}: on the wheel. Press to remove it from the wheel.",
      offWheelAria: "{title}: off the wheel. Press to put it back on the wheel.",
      favAdd: "Add {title} to our favorites", favRemove: "Remove {title} from our favorites",
      watchedBadge: "Watched ♡",
      openLetterboxd: "Letterboxd ↗", searchLetterboxd: "Search on Letterboxd ↗",
      posterAlt: "Poster of {title}",
      minutes: "{h}h {m}", minutesOnly: "{m} min",
      directedBy: "by {name}",
      lbRating: "★ {r} on Letterboxd",
      historyEyebrow: "our little movie diary",
      historyTitle: "Movie Night History",
      historyCount: "{watched} watched together · {total} movie nights picked",
      historyEmpty: "No movie nights yet. Spin the wheel and press “Let's go!” to start our diary ♡",
      statusSelected: "Selected", statusWatched: "Watched", statusSkipped: "Skipped",
      markWatched: "We watched it ♡", markSkipped: "Skipped", markSelected: "Undo",
      historyDelete: "Delete this entry",
      resultConfirm: "Let's go! 🍿", resultRetry: "Spin again?", resultDiscover: "Discover the film", resultSearch: "Find it on Letterboxd",
      resultMessages: [
        "Tonight's movie date is decided! 🍿💕",
        "The wheel has spoken, {her} ♡",
        "Fate picked this one for us ✨",
        "Popcorn ready, {her}? It's this one! 🍿",
      ],
      confirmedToast: "“{title}” is tonight's film ♡ Added to our diary.",
      soundOn: "Sound on", soundOff: "Sound off",
      nightOn: "Date Night Mode on", nightOff: "Date Night Mode",
      langSwitch: "Passer en français",
      close: "Close",
      spinAria: "Spin the wheel",
      wheelAria: "Movie wheel with {n} films",
      photoAlt: "{her} and {him}",
      photoCaption: "{her} & {him} ♡",
      footer: "Made with love by {him}, for {her}. ♡",
      signature: "— {him}",
      tmdbCredit: "Posters from TMDB. This product uses TMDB images but is not endorsed or certified by TMDB.",
      lbCredit: "Watchlist, ratings & film details from Letterboxd. Not affiliated with Letterboxd.",
      loveNotes: [
        "{her}, any movie is a good movie if I'm watching it next to you.",
        "Reserved seats: yours, mine, and the popcorn in between.",
        "You pick the blanket, the wheel picks the film.",
        "My favorite plot twist is still meeting you, {her}.",
        "Five stars for the company, whatever the film.",
        "Lights down, hands held. Perfect.",
        "So many films on your list. I want to watch every single one with you.",
      ],
    },
    fr: {
      skip: "Aller au contenu",
      brand: "Our Little Movie Night",
      navWheel: "La roue", navWatchlist: "Notre watchlist", navHistory: "Notre journal",
      eyebrow: "le petit ciné-club d'{her} & {him}",
      heroTitle: "Une roue. Deux cœurs.<br><em>Un film.</em>",
      heroSubtitle: "Laissons le destin choisir le film de ce soir.",
      statWishlist: "films dans la watchlist d'{her}", statWheel: "sur la roue", statWatched: "vus ensemble",
      spin: "Choisis notre film",
      spinning: "Ça tourne…",
      optSurprise: "Surprise (titres cachés)",
      optExcludeWatched: "Ignorer les films déjà vus",
      optFavoritesOnly: "Favoris seulement",
      wheelEmptyNone: "La roue est vide : le fichier de la watchlist (watchlist.js) n'a pas pu être chargé.",
      wheelEmptyFiltered: "Aucun film ne correspond à ces options. Désactive-en une, ou remets des films sur la roue.",
      surpriseTicker: "✨ c'est une surprise jusqu'à l'arrêt ✨",
      spinStatusStart: "La roue tourne.",
      spinStatusEnd: "La roue s'est arrêtée sur {title}.",
      motdTitle: "Le film du jour",
      motdEmpty: "Remets quelques films sur la roue et une suggestion du jour apparaîtra ici.",
      motdPick: "C'est le film de ce soir",
      loveNoteNext: "un autre petit mot ♡",
      watchlistEyebrow: "tous les films dont {her} rêve",
      watchlistTitle: "Notre watchlist",
      watchlistCount: "{shown} sur {total} films · {wheel} sur la roue",
      openHerWatchlist: "Ouvrir la watchlist d'{her} sur Letterboxd ↗",
      searchLabel: "Rechercher un film", searchPlaceholder: "Un titre, un réalisateur…",
      filterYear: "Décennie", filterGenre: "Genre", filterShow: "Afficher",
      anyDecade: "Toutes", anyGenre: "Tous les genres", noGenre: "Pas de genres",
      decade: "Années {d}",
      showAll: "Tous les films", showWheel: "Sur la roue", showOff: "Hors de la roue", showFav: "Nos favoris",
      gridEmpty: "Aucun film ne correspond. Essaie un autre mot ♡",
      gridEmptyAll: "La watchlist est vide.",
      onWheel: "Sur la roue", offWheel: "Hors roue",
      onWheelAria: "{title} : sur la roue. Appuie pour le retirer de la roue.",
      offWheelAria: "{title} : hors de la roue. Appuie pour le remettre sur la roue.",
      favAdd: "Ajouter {title} à nos favoris", favRemove: "Retirer {title} de nos favoris",
      watchedBadge: "Vu ♡",
      openLetterboxd: "Letterboxd ↗", searchLetterboxd: "Chercher sur Letterboxd ↗",
      posterAlt: "Affiche de {title}",
      minutes: "{h} h {m}", minutesOnly: "{m} min",
      directedBy: "de {name}",
      lbRating: "★ {r} sur Letterboxd",
      historyEyebrow: "notre petit journal de films",
      historyTitle: "Nos soirées ciné",
      historyCount: "{watched} vus ensemble · {total} soirées choisies",
      historyEmpty: "Pas encore de soirée ciné. Fais tourner la roue et appuie sur « C'est parti ! » pour commencer notre journal ♡",
      statusSelected: "Choisi", statusWatched: "Vu", statusSkipped: "Passé",
      markWatched: "On l'a vu ♡", markSkipped: "Passé", markSelected: "Annuler",
      historyDelete: "Supprimer cette entrée",
      resultConfirm: "C'est parti ! 🍿", resultRetry: "On retente ?", resultDiscover: "Découvrir le film", resultSearch: "Le trouver sur Letterboxd",
      resultMessages: [
        "Le film de notre soirée est choisi ! 🍿💕",
        "La roue a parlé, {her} ♡",
        "Le destin a choisi celui-là pour nous ✨",
        "Popcorn prêt, {her} ? C'est celui-ci ! 🍿",
      ],
      confirmedToast: "« {title} » est le film de ce soir ♡ Ajouté à notre journal.",
      soundOn: "Son activé", soundOff: "Son coupé",
      nightOn: "Mode soirée activé", nightOff: "Mode soirée",
      langSwitch: "Switch to English",
      close: "Fermer",
      spinAria: "Faire tourner la roue",
      wheelAria: "Roue de {n} films",
      photoAlt: "{her} et {him}",
      photoCaption: "{her} & {him} ♡",
      footer: "Fait avec amour par {him}, pour {her}. ♡",
      signature: "— {him}",
      tmdbCredit: "Affiches : TMDB. Ce produit utilise des images TMDB mais n'est ni approuvé ni certifié par TMDB.",
      lbCredit: "Watchlist, notes et fiches films : Letterboxd. Sans lien avec Letterboxd.",
      loveNotes: [
        "{her}, n'importe quel film est un bon film si je le regarde à côté de toi.",
        "Places réservées : la tienne, la mienne, et le popcorn entre les deux.",
        "Tu choisis le plaid, la roue choisit le film.",
        "Mon rebondissement préféré, c'est toujours de t'avoir rencontrée, {her}.",
        "Cinq étoiles pour la compagnie, peu importe le film.",
        "Lumières éteintes, mains liées. Parfait.",
        "Tant de films sur ta liste. Je veux tous les regarder avec toi.",
      ],
    },
  };

  /* =========================================================
     2. Watchlist — Aylie's Letterboxd watchlist lives in
     watchlist.js (window.AYLIE_WATCHLIST). Every film there is
     real data read from Letterboxd: title, year, link, director,
     runtime, genres and average rating. Nothing is made up.
     ========================================================= */
  const WATCHLIST = Array.isArray(window.AYLIE_WATCHLIST) ? window.AYLIE_WATCHLIST : [];

  /* =========================================================
     3. Utilities
     ========================================================= */
  const $ = (sel, root = document) => root.querySelector(sel);
  const TAU = Math.PI * 2;
  const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const mod = (a, n) => ((a % n) + n) % n;

  /** Build a DOM element safely. Text always goes through textContent — never innerHTML. */
  function h(tag, attrs = {}, ...children) {
    const node = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) {
      if (v === undefined || v === null || v === false) continue;
      if (k === "class") node.className = v;
      else if (k === "text") node.textContent = v;
      else if (k.startsWith("on") && typeof v === "function") node.addEventListener(k.slice(2), v);
      else if (k === "dataset") Object.assign(node.dataset, v);
      else node.setAttribute(k, v === true ? "" : String(v));
    }
    for (const c of children.flat()) {
      if (c === null || c === undefined || c === false) continue;
      node.append(c instanceof Node ? c : document.createTextNode(String(c)));
    }
    return node;
  }
  function svgIcon(id, size = 16) {
    const ns = "http://www.w3.org/2000/svg";
    const s = document.createElementNS(ns, "svg");
    s.setAttribute("width", size); s.setAttribute("height", size); s.setAttribute("aria-hidden", "true");
    const u = document.createElementNS(ns, "use");
    u.setAttribute("href", "#" + id);
    s.append(u);
    return s;
  }

  /** Uniform random integer in [0, n) using the crypto RNG (no modulo bias). */
  function randomInt(n) {
    if (n <= 1) return 0;
    const max = Math.floor(0x100000000 / n) * n;
    const buf = new Uint32Array(1);
    let x;
    do { crypto.getRandomValues(buf); x = buf[0]; } while (x >= max);
    return x % n;
  }
  const randomFloat = () => randomInt(1e9) / 1e9;
  const uid = (p = "m") => p + "_" + Date.now().toString(36) + "_" + randomInt(1e9).toString(36);

  /** Lowercase, strip accents & punctuation, "&" → "and". Used for de-duplication. */
  function normTitle(s) {
    return String(s || "").normalize("NFD").replace(/[̀-ͯ]/g, "")
      .toLowerCase().replace(/&/g, " and ").replace(/[^a-z0-9]+/g, " ").trim();
  }
  function hashString(str) {
    let hsh = 2166136261;
    for (let i = 0; i < str.length; i++) { hsh ^= str.charCodeAt(i); hsh = Math.imul(hsh, 16777619); }
    return hsh >>> 0;
  }
  function parseYear(v) {
    const n = parseInt(String(v ?? "").trim(), 10);
    return Number.isFinite(n) && n >= 1870 && n <= 2100 ? n : null;
  }
  function cleanText(v, max = 300) {
    if (v === null || v === undefined) return "";
    return String(v).replace(/[\u0000-\u001f\u007f]/g, " ").replace(/\s+/g, " ").trim().slice(0, max);
  }
  /** Only accept http(s) links to Letterboxd. Everything else is dropped. */
  function safeLetterboxdUrl(v) {
    try {
      const u = new URL(String(v || "").trim());
      if (u.protocol !== "https:" && u.protocol !== "http:") return "";
      if (!/^(www\.)?letterboxd\.com$|^boxd\.it$/i.test(u.hostname)) return "";
      u.protocol = "https:";
      return u.href;
    } catch { return ""; }
  }
  /** Poster URLs: https only (TMDB images, or https URLs given in your own JSON). */
  function safeImageUrl(v) {
    try {
      const u = new URL(String(v || "").trim());
      return u.protocol === "https:" ? u.href : "";
    } catch { return ""; }
  }
  function debounce(fn, ms) { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); }; }

  /* =========================================================
     4. Storage — one place to swap localStorage for a real DB.
     Replace load()/save() with fetch() calls to an API later;
     the rest of the app only talks to Store.
     ========================================================= */
  const Store = {
    load() {
      try {
        const raw = localStorage.getItem(CONFIG.STORAGE_KEY);
        return raw ? JSON.parse(raw) : null;
      } catch (e) { console.warn("Could not read saved data:", e); return null; }
    },
    save(data) {
      try { localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(data)); return true; }
      catch (e) { console.warn("Could not save data:", e); return false; }
    },
  };


  /* =========================================================
     5. State
     ========================================================= */
  const defaultSettings = () => ({
    sound: true, night: false, surprise: false, excludeWatched: false, favoritesOnly: false,
    lang: (navigator.language || "en").toLowerCase().startsWith("fr") ? "fr" : "en",
  });

  function makeMovie(raw) {
    return {
      id: uid("m"),
      title: cleanText(raw.title, 200),
      year: parseYear(raw.year),
      director: cleanText(raw.director, 160) || "",
      runtime: Number.isFinite(+raw.runtime) && +raw.runtime > 0 && +raw.runtime < 1000 ? Math.round(+raw.runtime) : null,
      genres: Array.isArray(raw.genres) ? raw.genres.map((g) => cleanText(g, 40)).filter(Boolean).slice(0, 6) : [],
      poster: safeImageUrl(raw.poster),
      letterboxdUrl: safeLetterboxdUrl(raw.letterboxdUrl),
      letterboxdRating: Number.isFinite(+raw.letterboxdRating) && +raw.letterboxdRating > 0 && +raw.letterboxdRating <= 5 ? +(+raw.letterboxdRating).toFixed(2) : null,
      tmdbId: Number.isInteger(+raw.tmdbId) && +raw.tmdbId > 0 ? +raw.tmdbId : null,
      inWheel: true,
      favorite: false,
      addedAt: new Date().toISOString(),
    };
  }

  let state = Store.load();
  if (!state || !Array.isArray(state.movies)) state = { version: 2, movies: [], history: [] };
  state.settings = { ...defaultSettings(), ...(state.settings || {}) };
  state.history = Array.isArray(state.history) ? state.history : [];

  const save = () => Store.save(state);
  const movieKey = (m) => (m.letterboxdUrl ? "u:" + m.letterboxdUrl.replace(/\/+$/, "").toLowerCase() : "t:" + normTitle(m.title) + "|" + (m.year || ""));
  const findMovie = (id) => state.movies.find((m) => m.id === id);

  /**
   * Bring the saved data in line with watchlist.js on every visit.
   * Film details always come from the file; our own choices (favorites,
   * on/off the wheel, history) are kept for films that are still there.
   * So updating watchlist.js is all it takes to refresh the site.
   */
  function syncWatchlist() {
    const previous = new Map(state.movies.map((m) => [movieKey(m), m]));
    const seen = new Set();
    state.movies = [];
    for (const raw of WATCHLIST) {
      const fresh = makeMovie(raw);
      if (!fresh.title) continue;
      const key = movieKey(fresh);
      if (seen.has(key)) continue;
      seen.add(key);
      const old = previous.get(key);
      if (old) {
        fresh.id = old.id;
        fresh.inWheel = old.inWheel !== false;
        fresh.favorite = old.favorite === true;
        fresh.addedAt = old.addedAt || fresh.addedAt;
        if (!fresh.poster && old.poster) fresh.poster = old.poster; // keep a poster fetched earlier
      }
      state.movies.push(fresh);
    }
    save();
  }
  syncWatchlist();

  function watchedIds() {
    const set = new Set();
    for (const e of state.history) if (e.status === "watched" && e.movieId) set.add(e.movieId);
    return set;
  }

  /** Films eligible for the wheel, given the current options. */
  function wheelMovies() {
    const watched = watchedIds();
    const s = state.settings;
    return state.movies.filter((m) => m.inWheel && (!s.excludeWatched || !watched.has(m.id)) && (!s.favoritesOnly || m.favorite));
  }

  /* =========================================================
     6. i18n
     ========================================================= */
  function t(key, vars = {}) {
    const lang = TEXTS[state.settings.lang] ? state.settings.lang : "en";
    let s = TEXTS[lang][key] ?? TEXTS.en[key] ?? key;
    const all = { ...CONFIG.NAMES, ...vars };
    const fill = (str) => str.replace(/\{(\w+)\}/g, (_, k) => (all[k] ?? ""));
    if (Array.isArray(s)) return s.map(fill);
    return typeof s === "string" ? fill(s) : s;
  }
  function applyTexts() {
    document.documentElement.lang = state.settings.lang;
    document.querySelectorAll("[data-i18n]").forEach((el) => { el.textContent = t(el.dataset.i18n); });
    // Only our own static strings from TEXTS (never external data) use innerHTML.
    document.querySelectorAll("[data-i18n-html]").forEach((el) => { el.innerHTML = t(el.dataset.i18nHtml); });
    document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => { el.placeholder = t(el.dataset.i18nPlaceholder); });
    document.querySelectorAll("[data-i18n-alt]").forEach((el) => { el.alt = t(el.dataset.i18nAlt); });
    $("#langToggle").textContent = state.settings.lang === "fr" ? "EN" : "FR";
    $("#langToggle").setAttribute("aria-label", t("langSwitch"));
    $("#hubSpin").setAttribute("aria-label", t("spinAria"));
    $("#resultClose").setAttribute("aria-label", t("close"));
    updateSoundButton();
    updateNightButton();
  }

  /* =========================================================
     7. Sound — tiny synthesized ticks (Web Audio, no files)
     ========================================================= */
  const Sound = {
    ctx: null, lastTick: 0,
    ensure() {
      if (!state.settings.sound) return null;
      try {
        if (!this.ctx) this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        if (this.ctx.state === "suspended") this.ctx.resume();
      } catch { this.ctx = null; }
      return this.ctx;
    },
    tick(speed = 1) {
      const ctx = this.ensure();
      if (!ctx) return;
      const now = performance.now();
      if (now - this.lastTick < 38) return;
      this.lastTick = now;
      const t0 = ctx.currentTime;
      const osc = ctx.createOscillator(), gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(900 + 500 * Math.min(1, speed), t0);
      osc.frequency.exponentialRampToValueAtTime(420, t0 + 0.04);
      gain.gain.setValueAtTime(0.0001, t0);
      gain.gain.exponentialRampToValueAtTime(0.07, t0 + 0.004);
      gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.05);
      osc.connect(gain).connect(ctx.destination);
      osc.start(t0); osc.stop(t0 + 0.06);
    },
    chime() {
      const ctx = this.ensure();
      if (!ctx) return;
      const notes = [659.25, 783.99, 987.77, 1318.5]; // E5 G5 B5 E6
      notes.forEach((f, i) => {
        const t0 = ctx.currentTime + i * 0.11;
        const osc = ctx.createOscillator(), gain = ctx.createGain();
        osc.type = "sine"; osc.frequency.value = f;
        gain.gain.setValueAtTime(0.0001, t0);
        gain.gain.exponentialRampToValueAtTime(0.09, t0 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.7);
        osc.connect(gain).connect(ctx.destination);
        osc.start(t0); osc.stop(t0 + 0.75);
      });
    },
  };

  /* =========================================================
     8. Confetti — hearts, stars & sparkles on a canvas
     ========================================================= */
  const Confetti = {
    canvas: null, ctx: null, parts: [], raf: 0,
    burst() {
      if (prefersReducedMotion()) return;
      this.canvas = this.canvas || $("#confetti");
      this.ctx = this.ctx || this.canvas.getContext("2d");
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      this.canvas.width = innerWidth * dpr; this.canvas.height = innerHeight * dpr;
      this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const colors = ["#C74368", "#F4BFD2", "#69263F", "#E06B8D", "#C9A15A", "#FFFFFF", "#F9DCE7"];
      const shapes = ["heart", "heart", "star", "dot", "spark"];
      for (let i = 0; i < 150; i++) {
        const fromLeft = i % 2 === 0;
        this.parts.push({
          x: fromLeft ? -10 : innerWidth + 10, y: innerHeight * (0.55 + randomFloat() * 0.3),
          vx: (fromLeft ? 1 : -1) * (5 + randomFloat() * 9), vy: -(9 + randomFloat() * 10),
          size: 7 + randomFloat() * 9, rot: randomFloat() * TAU, vr: (randomFloat() - 0.5) * 0.3,
          color: colors[randomInt(colors.length)], shape: shapes[randomInt(shapes.length)], life: 0,
          wobble: randomFloat() * TAU,
        });
      }
      if (!this.raf) this.raf = requestAnimationFrame(() => this.step());
    },
    draw(p) {
      const c = this.ctx, s = p.size;
      c.save(); c.translate(p.x, p.y); c.rotate(p.rot); c.fillStyle = p.color;
      c.globalAlpha = Math.max(0, 1 - p.life / 190);
      c.beginPath();
      if (p.shape === "heart") {
        c.moveTo(0, s * 0.35);
        c.bezierCurveTo(-s, -s * 0.3, -s * 0.45, -s, 0, -s * 0.45);
        c.bezierCurveTo(s * 0.45, -s, s, -s * 0.3, 0, s * 0.35);
      } else if (p.shape === "star") {
        for (let k = 0; k < 10; k++) { const r = k % 2 ? s * 0.42 : s; const a = (k * Math.PI) / 5 - Math.PI / 2; c.lineTo(Math.cos(a) * r, Math.sin(a) * r); }
      } else if (p.shape === "spark") {
        c.moveTo(0, -s); c.quadraticCurveTo(0, 0, s, 0); c.quadraticCurveTo(0, 0, 0, s); c.quadraticCurveTo(0, 0, -s, 0); c.quadraticCurveTo(0, 0, 0, -s);
      } else c.arc(0, 0, s * 0.35, 0, TAU);
      c.closePath(); c.fill(); c.restore();
    },
    step() {
      const c = this.ctx;
      c.clearRect(0, 0, innerWidth, innerHeight);
      this.parts = this.parts.filter((p) => p.life < 190 && p.y < innerHeight + 40);
      for (const p of this.parts) {
        p.life++; p.vy += 0.28; p.vx *= 0.985; p.wobble += 0.1;
        p.x += p.vx + Math.sin(p.wobble) * 0.6; p.y += p.vy; p.rot += p.vr;
        this.draw(p);
      }
      if (this.parts.length) this.raf = requestAnimationFrame(() => this.step());
      else { this.raf = 0; c.clearRect(0, 0, innerWidth, innerHeight); }
    },
  };

  /* =========================================================
     9. Wheel
     Geometry convention (the important part!):
       - Sector i covers local angles [i·arc, (i+1)·arc), measured
         clockwise from 12 o'clock, on the un-rotated wheel.
       - The wheel is rotated clockwise by `rotation` radians.
       - The pointer is fixed at 12 o'clock, so the local angle
         under it is  (−rotation) mod 2π  →  index = floor(that / arc).
     The winner is drawn FIRST with crypto RNG, then the final
     rotation is computed so that formula lands on that index.
     After the animation we recompute the index from the final
     angle and use that — so result and pointer always agree.
     ========================================================= */

  /** CSS-style cubic-bezier easing: slow start (acceleration), long smooth deceleration. */
  function cubicBezier(p1x, p1y, p2x, p2y) {
    const cx = 3 * p1x, bx = 3 * (p2x - p1x) - cx, ax = 1 - cx - bx;
    const cy = 3 * p1y, by = 3 * (p2y - p1y) - cy, ay = 1 - cy - by;
    const sx = (u) => ((ax * u + bx) * u + cx) * u;
    const sy = (u) => ((ay * u + by) * u + cy) * u;
    const dx = (u) => (3 * ax * u + 2 * bx) * u + cx;
    const solve = (x) => {
      let u = x;
      for (let i = 0; i < 8; i++) {
        const e = sx(u) - x;
        if (Math.abs(e) < 1e-7) return u;
        const d = dx(u);
        if (Math.abs(d) < 1e-6) break;
        u -= e / d;
      }
      let lo = 0, hi = 1; u = x;
      for (let i = 0; i < 60; i++) { const v = sx(u); if (Math.abs(v - x) < 1e-7) break; if (v < x) lo = u; else hi = u; u = (lo + hi) / 2; }
      return u;
    };
    return (x) => (x <= 0 ? 0 : x >= 1 ? 1 : sy(solve(x)));
  }
  const spinEase = cubicBezier(0.32, 0, 0.1, 1);

  const Wheel = {
    canvas: null, ctx: null, image: null, size: 0, dpr: 1,
    items: [], rotation: 0, spinning: false, lastIndex: -1, pendingRefresh: false,

    init() {
      this.canvas = $("#wheelCanvas");
      this.ctx = this.canvas.getContext("2d");
      // Light bulbs around the frame
      const bulbs = $(".wheel-bulbs");
      const count = 24;
      for (let i = 0; i < count; i++) {
        const a = (i / count) * TAU;
        const span = document.createElement("span");
        span.style.left = 50 + 49.2 * Math.cos(a) + "%";
        span.style.top = 50 + 49.2 * Math.sin(a) + "%";
        span.style.animationDelay = (i % 2 ? -0.8 : 0) + "s";
        bulbs.append(span);
      }
      const ro = new ResizeObserver(() => this.resize());
      ro.observe(this.canvas);
      this.resize();
    },

    resize() {
      const css = this.canvas.getBoundingClientRect().width;
      if (!css) return;
      this.dpr = Math.min(window.devicePixelRatio || 1, 2.5);
      const px = Math.round(css * this.dpr);
      if (px === this.size) return;
      this.size = px;
      this.canvas.width = px; this.canvas.height = px;
      this.build();
    },

    /** Refresh the list of films on the wheel (deferred while spinning). */
    setItems(items) {
      if (this.spinning) { this.pendingRefresh = true; return; }
      this.items = items.slice();
      this.lastIndex = -1;
      this.build();
    },

    arc() { return TAU / Math.max(1, this.items.length); },

    indexAt(rotation) {
      const n = this.items.length;
      if (!n) return -1;
      return Math.floor(mod(-rotation, TAU) / this.arc()) % n;
    },

    colorFor(i, n) {
      const P = CONFIG.WHEEL_COLORS;
      // Avoid the last sector having the same colour as the first one.
      if (n > 1 && i === n - 1 && i % P.length === 0) return P[2];
      return P[i % P.length];
    },

    /** Pre-render the un-rotated wheel to an offscreen canvas (fast per-frame drawing). */
    build() {
      if (!this.size) return;
      const S = this.size, R = S / 2, n = this.items.length;
      const off = document.createElement("canvas");
      off.width = S; off.height = S;
      const c = off.getContext("2d");
      c.translate(R, R);
      const night = document.documentElement.dataset.theme === "night";

      if (!n) {
        c.fillStyle = night ? "#3A1A2B" : "#FFF1F5";
        c.beginPath(); c.arc(0, 0, R, 0, TAU); c.fill();
        c.setLineDash([S * 0.02, S * 0.02]); c.strokeStyle = night ? "rgba(249,220,231,.3)" : "rgba(199,67,104,.35)";
        c.lineWidth = S * 0.006; c.beginPath(); c.arc(0, 0, R * 0.8, 0, TAU); c.stroke();
        this.image = off; this.render(); return;
      }

      const arc = TAU / n;
      const surprise = state.settings.surprise;
      for (let i = 0; i < n; i++) {
        const a0 = -Math.PI / 2 + i * arc, a1 = a0 + arc;
        const color = this.colorFor(i, n);
        c.beginPath(); c.moveTo(0, 0); c.arc(0, 0, R, a0, a1); c.closePath();
        const g = c.createRadialGradient(0, 0, R * 0.2, 0, 0, R);
        g.addColorStop(0, shade(color, 0.12)); g.addColorStop(1, color);
        c.fillStyle = g; c.fill();
        if (n > 1) { c.strokeStyle = "rgba(255,255,255,.85)"; c.lineWidth = Math.max(1, S * 0.003); c.stroke(); }
      }

      // Labels
      const inner = R * 0.27, outer = R * 0.92, maxLen = outer - inner;
      const midArcLen = ((inner + outer) / 2) * arc;
      let fontPx = Math.min(R * 0.07, midArcLen * 0.5);
      const canLabel = n <= CONFIG.MAX_LABELLED_SECTORS && fontPx >= 8.5 * this.dpr;
      if (canLabel) {
        c.textBaseline = "middle";
        for (let i = 0; i < n; i++) {
          const mid = -Math.PI / 2 + (i + 0.5) * arc;
          const color = this.colorFor(i, n);
          // On the left half, flip the text so it never reads upside down.
          const flip = Math.cos(mid) < -0.001;
          c.save(); c.rotate(flip ? mid + Math.PI : mid);
          c.textAlign = flip ? "left" : "right";
          const x = flip ? -outer : outer;
          c.fillStyle = isDark(color) ? "#FFFFFF" : "#69263F";
          if (surprise) {
            c.font = `600 ${Math.round(fontPx * 1.2)}px Fraunces, Georgia, serif`;
            c.fillText("?", flip ? x + fontPx * 0.4 : x - fontPx * 0.4, 0);
          } else {
            c.font = `600 ${Math.round(fontPx)}px "DM Sans", system-ui, sans-serif`;
            c.fillText(fitText(c, this.items[i].title, maxLen), x, 0);
          }
          c.restore();
        }
      }

      // Outer ring + inner shine
      c.beginPath(); c.arc(0, 0, R - S * 0.004, 0, TAU);
      c.strokeStyle = "rgba(255,255,255,.9)"; c.lineWidth = S * 0.008; c.stroke();
      const shine = c.createRadialGradient(-R * 0.3, -R * 0.4, R * 0.05, 0, 0, R);
      shine.addColorStop(0, "rgba(255,255,255,.22)"); shine.addColorStop(0.55, "rgba(255,255,255,0)");
      c.fillStyle = shine; c.beginPath(); c.arc(0, 0, R, 0, TAU); c.fill();

      this.image = off;
      this.canvas.setAttribute("aria-label", t("wheelAria", { n }));
      this.render();
    },

    render() {
      if (!this.image) return;
      const c = this.ctx, S = this.size, R = S / 2;
      c.setTransform(1, 0, 0, 1, 0, 0);
      c.clearRect(0, 0, S, S);
      c.translate(R, R);
      c.rotate(this.rotation);
      c.drawImage(this.image, -R, -R);
      c.setTransform(1, 0, 0, 1, 0, 0);
    },

    /** Start a spin. Resolves with the winning film (or null if nothing to spin). */
    spin() {
      const n = this.items.length;
      if (this.spinning || !n) return Promise.resolve(null);
      this.spinning = true;

      // 1) Decide the winner in code (uniform, crypto RNG).
      const winner = randomInt(n);
      const arc = this.arc();
      // 2) Aim for a random point inside that sector (never on the edges).
      const jitter = (randomFloat() - 0.5) * 0.76; // ±38% of the sector
      const targetLocal = (winner + 0.5 + jitter) * arc;
      const reduced = prefersReducedMotion();
      const extraTurns = reduced ? 1 : 5 + randomInt(3);
      const start = this.rotation;
      const delta = mod(mod(-targetLocal, TAU) - mod(start, TAU), TAU);
      const end = start + extraTurns * TAU + delta;
      const duration = reduced ? 1200 : CONFIG.SPIN_MIN_MS + randomInt(CONFIG.SPIN_MAX_MS - CONFIG.SPIN_MIN_MS);

      return new Promise((resolve) => {
        const t0 = performance.now();
        let prevRot = start;
        const frame = (now) => {
          const p = Math.min(1, (now - t0) / duration);
          this.rotation = start + (end - start) * spinEase(p);
          this.render();
          const idx = this.indexAt(this.rotation);
          if (idx !== this.lastIndex) {
            this.lastIndex = idx;
            const speed = Math.abs(this.rotation - prevRot) / 0.35;
            Sound.tick(speed);
            onWheelTick(this.items[idx]);
          }
          prevRot = this.rotation;
          if (p < 1) requestAnimationFrame(frame);
          else {
            this.rotation = mod(end, TAU); // keep numbers small; same angle
            this.render();
            // 3) Read the result from the final angle — the pointer is the truth.
            const landed = this.indexAt(this.rotation);
            if (landed !== winner) console.warn("Wheel math mismatch", { winner, landed }); // should never happen
            const film = this.items[landed];
            this.spinning = false;
            if (this.pendingRefresh) { this.pendingRefresh = false; this.setItems(wheelMovies()); }
            resolve(film);
          }
        };
        requestAnimationFrame(frame);
      });
    },
  };

  function fitText(c, text, maxWidth) {
    if (c.measureText(text).width <= maxWidth) return text;
    let lo = 0, hi = text.length;
    while (lo < hi) {
      const mid = Math.ceil((lo + hi) / 2);
      if (c.measureText(text.slice(0, mid).trimEnd() + "…").width <= maxWidth) lo = mid; else hi = mid - 1;
    }
    return text.slice(0, lo).trimEnd() + "…";
  }
  function hexToRgb(hex) { const n = parseInt(hex.slice(1), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; }
  function isDark(hex) { const [r, g, b] = hexToRgb(hex); return 0.299 * r + 0.587 * g + 0.114 * b < 150; }
  function shade(hex, amt) {
    const [r, g, b] = hexToRgb(hex).map((v) => Math.round(v + (255 - v) * amt));
    return `rgb(${r},${g},${b})`;
  }

  let pointerTimer = 0;
  function onWheelTick(film) {
    const pointer = $(".pointer");
    if (!prefersReducedMotion() && performance.now() - pointerTimer > 70) {
      pointerTimer = performance.now();
      pointer.classList.remove("tick"); void pointer.offsetWidth; pointer.classList.add("tick");
    }
    if (!state.settings.surprise && film) $("#ticker").textContent = film.title + (film.year ? ` (${film.year})` : "");
  }

  async function doSpin() {
    if (Wheel.spinning) return;
    if (!Wheel.items.length) { refreshWheel(); return; }
    Sound.ensure(); // unlock audio on the user's gesture
    $("#resultDialog").open && $("#resultDialog").close();
    setSpinningUI(true);
    $("#ticker").textContent = state.settings.surprise ? t("surpriseTicker") : " ";
    $("#spinStatus").textContent = t("spinStatusStart");
    const film = await Wheel.spin();
    setSpinningUI(false);
    if (!film) return;
    $("#ticker").textContent = film.title + (film.year ? ` (${film.year})` : "");
    $("#spinStatus").textContent = t("spinStatusEnd", { title: film.title });
    Sound.chime();
    Confetti.burst();
    openResult(film);
  }

  function setSpinningUI(on) {
    $("#wheelFrame").classList.toggle("spinning", on);
    $("#spinBtn").disabled = on;
    $("#hubSpin").disabled = on;
    $("#resultRetry").disabled = on;
    ["#optSurprise", "#optExcludeWatched", "#optFavoritesOnly"].forEach((s) => { $(s).disabled = on; });
    $("#spinBtn").firstElementChild.textContent = on ? t("spinning") : t("spin");
  }

  function refreshWheel() {
    const items = wheelMovies();
    Wheel.setItems(items);
    const empty = $("#wheelEmpty");
    const none = !items.length;
    empty.hidden = !none;
    if (none) empty.textContent = state.movies.length ? t("wheelEmptyFiltered") : t("wheelEmptyNone");
    if (!Wheel.spinning) {
      $("#spinBtn").disabled = none;
      $("#hubSpin").disabled = none;
    }
    $("#ticker").textContent = state.settings.surprise ? t("surpriseTicker") : " ";
  }

  /* =========================================================
     10. Result dialog
     ========================================================= */
  let currentResult = null;

  function posterNode(movie, { eager = false } = {}) {
    const wrap = h("div", { class: "poster-wrap" });
    const fallback = () => h("div", { class: "poster-fallback", role: "img", "aria-label": t("posterAlt", { title: movie.title }) },
      svgIcon("i-film", 54), h("span", { text: movie.title }));
    if (movie.poster) {
      const img = h("img", {
        class: "poster", src: movie.poster, alt: t("posterAlt", { title: movie.title }),
        loading: eager ? "eager" : "lazy", decoding: "async", referrerpolicy: "no-referrer",
      });
      img.addEventListener("error", () => img.replaceWith(fallback()), { once: true });
      wrap.append(img);
    } else wrap.append(fallback());
    return wrap;
  }

  function formatRuntime(min) {
    if (!min) return "";
    const hh = Math.floor(min / 60), mm = min % 60;
    return hh ? t("minutes", { h: hh, m: String(mm).padStart(2, "0") }) : t("minutesOnly", { m: mm });
  }
  function letterboxdLink(m) {
    if (m.letterboxdUrl) return { href: m.letterboxdUrl, direct: true };
    if (m.tmdbId) return { href: `https://letterboxd.com/tmdb/${m.tmdbId}/`, direct: true };
    return { href: `https://letterboxd.com/search/films/${encodeURIComponent(m.title + (m.year ? " " + m.year : ""))}/`, direct: false };
  }

  function fillResult(movie) {
    $("#resultPoster").replaceChildren(posterNode(movie, { eager: true }));
    const msgs = t("resultMessages");
    $("#resultMessage").textContent = msgs[randomInt(msgs.length)];
    $("#resultTitle").textContent = movie.title;
    const meta = [];
    const li = (label, strong) => h("li", {}, strong ? h("strong", { text: strong }) : null, strong && label ? " " : null, label || null);
    if (movie.year) meta.push(li(null, String(movie.year)));
    if (movie.director) meta.push(li(t("directedBy", { name: movie.director })));
    if (movie.runtime) meta.push(li(formatRuntime(movie.runtime)));
    if (movie.letterboxdRating) meta.push(li(t("lbRating", { r: movie.letterboxdRating.toFixed(1) })));
    $("#resultMeta").replaceChildren(...meta);
    $("#resultGenres").textContent = movie.genres.length ? movie.genres.join(" · ") : "";
    const link = letterboxdLink(movie);
    $("#resultLink").href = link.href;
    $("#resultLink").firstElementChild.textContent = link.direct ? t("resultDiscover") : t("resultSearch");
  }

  function openResult(movie) {
    currentResult = movie;
    fillResult(movie);
    const dlg = $("#resultDialog");
    if (!dlg.open) dlg.showModal();
    $("#resultConfirm").focus();
  }

  function confirmResult() {
    const m = currentResult;
    if (!m) return;
    state.history.unshift({
      id: uid("h"), movieId: m.id, title: m.title, year: m.year, poster: m.poster,
      letterboxdUrl: letterboxdLink(m).href, date: new Date().toISOString(), status: "selected",
    });
    save();
    $("#resultDialog").close();
    toast(t("confirmedToast", { title: m.title }));
    renderAll();
  }

  /* =========================================================
     11. Watchlist grid
     ========================================================= */
  const filters = { q: "", decade: "", genre: "", show: "all" };

  function buildFilterOptions() {
    const decades = [...new Set(state.movies.map((m) => (m.year ? Math.floor(m.year / 10) * 10 : null)).filter(Boolean))].sort((a, b) => b - a);
    const sel = $("#filterDecade");
    sel.replaceChildren(h("option", { value: "", text: t("anyDecade") }), ...decades.map((d) => h("option", { value: d, text: t("decade", { d }) })));
    sel.value = decades.includes(+filters.decade) ? filters.decade : (filters.decade = "");
    const genres = [...new Set(state.movies.flatMap((m) => m.genres))].sort((a, b) => a.localeCompare(b));
    const gs = $("#filterGenre");
    gs.replaceChildren(h("option", { value: "", text: genres.length ? t("anyGenre") : t("noGenre") }), ...genres.map((g) => h("option", { value: g, text: g })));
    gs.disabled = !genres.length;
    gs.value = genres.includes(filters.genre) ? filters.genre : (filters.genre = "");
    $("#filterShow").value = filters.show;
  }

  function filteredMovies() {
    const q = normTitle(filters.q);
    return state.movies.filter((m) => {
      if (q && !normTitle(m.title + " " + m.director).includes(q)) return false;
      if (filters.decade && (!m.year || Math.floor(m.year / 10) * 10 !== +filters.decade)) return false;
      if (filters.genre && !m.genres.includes(filters.genre)) return false;
      if (filters.show === "wheel" && !m.inWheel) return false;
      if (filters.show === "off" && m.inWheel) return false;
      if (filters.show === "fav" && !m.favorite) return false;
      return true;
    });
  }

  function movieCard(m, watched) {
    const link = letterboxdLink(m);
    const favBtn = h("button", {
      class: "fav-btn", type: "button", "aria-pressed": m.favorite ? "true" : "false",
      "aria-label": m.favorite ? t("favRemove", { title: m.title }) : t("favAdd", { title: m.title }),
      dataset: { act: "fav", id: m.id },
    }, svgIcon("i-heart", 18));
    const badges = h("div", { class: "card-badges" }, watched ? h("span", { class: "badge badge-watched", text: t("watchedBadge") }) : null, favBtn);
    const extra = [];
    if (m.director) extra.push(h("span", { class: "ov-extra", text: m.director }));
    const facts = [formatRuntime(m.runtime), m.letterboxdRating ? t("lbRating", { r: m.letterboxdRating.toFixed(1) }) : ""].filter(Boolean).join(" · ");
    if (facts) extra.push(h("span", { class: "ov-extra", text: facts }));
    const overlay = h("div", { class: "poster-overlay" }, ...extra,
      h("a", { href: link.href, target: "_blank", rel: "noopener", text: link.direct ? t("openLetterboxd") : t("searchLetterboxd") }));
    const posterWrap = posterNode(m);
    posterWrap.append(badges, overlay);
    const wheelBtn = h("button", {
      class: "wheel-toggle", type: "button", "aria-pressed": m.inWheel ? "true" : "false",
      "aria-label": m.inWheel ? t("onWheelAria", { title: m.title }) : t("offWheelAria", { title: m.title }),
      dataset: { act: "wheel", id: m.id },
    }, m.inWheel ? svgIcon("i-check", 14) : svgIcon("i-wheel", 14), m.inWheel ? t("onWheel") : t("offWheel"));
    return h("li", { class: "movie-card" + (m.inWheel ? "" : " off") },
      posterWrap,
      h("div", { class: "movie-meta" }, h("h3", { text: m.title }), h("p", { text: [m.year, m.director].filter(Boolean).join(" · ") })),
      h("div", { style: "display:flex;gap:8px;align-items:center;flex-wrap:wrap" }, wheelBtn));
  }

  function renderGrid() {
    buildFilterOptions();
    const list = filteredMovies();
    const watched = watchedIds();
    $("#movieGrid").replaceChildren(...list.map((m) => movieCard(m, watched.has(m.id))));
    const empty = $("#gridEmpty");
    empty.hidden = list.length > 0;
    empty.textContent = state.movies.length ? t("gridEmpty") : t("gridEmptyAll");
    $("#watchlistCount").textContent = t("watchlistCount", { shown: list.length, total: state.movies.length, wheel: state.movies.filter((m) => m.inWheel).length });
  }

  function onGridClick(e) {
    const btn = e.target.closest("button[data-act]");
    if (!btn) return;
    const m = findMovie(btn.dataset.id);
    if (!m) return;
    if (btn.dataset.act === "fav") m.favorite = !m.favorite;
    else if (btn.dataset.act === "wheel") m.inWheel = !m.inWheel;
    save();
    const focusSel = `button[data-act="${btn.dataset.act}"][data-id="${m.id}"]`;
    renderAll();
    $(focusSel)?.focus(); // keep keyboard focus where it was
  }

  /* =========================================================
     12. History
     ========================================================= */
  function renderHistory() {
    const list = $("#historyList");
    const fmt = new Intl.DateTimeFormat(state.settings.lang === "fr" ? "fr-FR" : "en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
    list.replaceChildren(...state.history.map((e) => {
      const statusLabel = { selected: t("statusSelected"), watched: t("statusWatched"), skipped: t("statusSkipped") }[e.status] || e.status;
      const actions = [];
      if (e.status === "selected") {
        actions.push(h("button", { class: "btn btn-primary btn-sm", type: "button", dataset: { hact: "watched", id: e.id }, text: t("markWatched") }));
        actions.push(h("button", { class: "btn btn-ghost btn-sm", type: "button", dataset: { hact: "skipped", id: e.id }, text: t("markSkipped") }));
      } else {
        actions.push(h("button", { class: "btn btn-ghost btn-sm", type: "button", dataset: { hact: "selected", id: e.id }, text: t("markSelected") }));
      }
      const live = findMovie(e.movieId);
      const posterSrc = { title: e.title, poster: (live && live.poster) || e.poster };
      return h("li", { class: "history-item" },
        posterNode(posterSrc),
        h("div", { class: "history-body" },
          h("p", { class: "history-date", text: fmt.format(new Date(e.date)) }),
          h("h3", { text: e.title + (e.year ? ` (${e.year})` : "") }),
          h("div", { class: "history-row" },
            h("span", { class: "status status-" + e.status, text: statusLabel }),
            ...actions,
            h("button", { class: "history-del", type: "button", "aria-label": t("historyDelete"), title: t("historyDelete"), dataset: { hact: "delete", id: e.id } }, svgIcon("i-trash", 16)))));
    }));
    $("#historyEmpty").hidden = state.history.length > 0;
    const watchedCount = state.history.filter((e) => e.status === "watched").length;
    $("#historyCount").textContent = state.history.length ? t("historyCount", { watched: watchedCount, total: state.history.length }) : "";
  }

  function onHistoryClick(e) {
    const btn = e.target.closest("button[data-hact]");
    if (!btn) return;
    const entry = state.history.find((x) => x.id === btn.dataset.id);
    if (!entry) return;
    const act = btn.dataset.hact;
    if (act === "delete") state.history = state.history.filter((x) => x !== entry);
    else {
      entry.status = act;
      if (act === "watched") { entry.watchedAt = new Date().toISOString(); Confetti.burst(); }
    }
    save();
    renderAll();
  }

  /* =========================================================
     13. Extras
     ========================================================= */
  function todayKey() {
    const d = new Date();
    return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
  }
  function renderMovieOfTheDay() {
    const body = $("#motdBody");
    const watched = watchedIds();
    const pool = state.movies.filter((m) => m.inWheel && !watched.has(m.id)).sort((a, b) => (a.title + a.year).localeCompare(b.title + b.year));
    if (!pool.length) { body.replaceChildren(h("p", { class: "muted", text: t("motdEmpty") })); body.style.gridTemplateColumns = "1fr"; return; }
    body.style.gridTemplateColumns = "";
    const m = pool[hashString(todayKey()) % pool.length];
    const link = letterboxdLink(m);
    body.replaceChildren(
      posterNode(m),
      h("div", {},
        h("h3", { text: m.title }),
        h("p", { text: [m.year, m.director, formatRuntime(m.runtime)].filter(Boolean).join(" · ") }),
        h("div", { class: "motd-actions" },
          h("button", { class: "btn btn-primary btn-sm", type: "button", onclick: () => { Confetti.burst(); openResult(m); }, text: t("motdPick") }),
          h("a", { class: "btn btn-ghost btn-sm", href: link.href, target: "_blank", rel: "noopener", text: link.direct ? t("openLetterboxd") : t("searchLetterboxd") }))));
  }

  let noteIndex = -1, noteTimer = 0;
  function nextLoveNote() {
    const notes = t("loveNotes");
    if (!Array.isArray(notes) || !notes.length) return;
    let i = randomInt(notes.length);
    if (notes.length > 1 && i === noteIndex) i = (i + 1) % notes.length;
    noteIndex = i;
    const el = $("#loveNoteText");
    el.style.opacity = "0";
    setTimeout(() => { el.textContent = "“" + notes[i] + "”"; el.style.opacity = "1"; }, prefersReducedMotion() ? 0 : 250);
    clearInterval(noteTimer);
    noteTimer = setInterval(nextLoveNote, CONFIG.LOVE_NOTE_EVERY_MS);
  }

  function setupFairyLights() {
    const box = $(".fairy-lights");
    const colors = ["#FFD9A0", "#F4BFD2", "#FFFFFF", "#F27A9C", "#FFE7B8"];
    const count = Math.max(10, Math.round(innerWidth / 70));
    box.replaceChildren();
    for (let i = 0; i < count; i++) {
      const x = (i + 0.5) / count;
      const y = 26 * (1 - Math.pow(2 * x - 1, 2)) + 4; // follows the hanging wire
      const s = h("span");
      s.style.left = x * 100 + "%"; s.style.top = y + "px";
      s.style.setProperty("--c", colors[i % colors.length]);
      s.style.animationDelay = (-(i % 5) * 0.45) + "s";
      box.append(s);
    }
  }

  function applyNight() {
    document.documentElement.dataset.theme = state.settings.night ? "night" : "light";
    document.querySelector('meta[name="theme-color"]').content = state.settings.night ? "#1E0D16" : "#F9DCE7";
    updateNightButton();
    Wheel.build();
  }
  function updateNightButton() {
    const b = $("#nightToggle");
    b.setAttribute("aria-pressed", state.settings.night ? "true" : "false");
    b.setAttribute("aria-label", state.settings.night ? t("nightOn") : t("nightOff"));
    b.title = b.getAttribute("aria-label");
  }
  function updateSoundButton() {
    const b = $("#soundToggle");
    b.setAttribute("aria-pressed", state.settings.sound ? "true" : "false");
    b.setAttribute("aria-label", state.settings.sound ? t("soundOn") : t("soundOff"));
    b.title = b.getAttribute("aria-label");
    b.querySelector("use").setAttribute("href", state.settings.sound ? "#i-sound-on" : "#i-sound-off");
  }

  let toastTimer = 0;
  function toast(msg) {
    const el = $("#toast");
    el.textContent = msg;
    el.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove("show"), 3600);
  }


  /* =========================================================
     14. Init
     ========================================================= */
  function renderStats() {
    $("#statWishlist").textContent = state.movies.length;
    $("#statWheel").textContent = wheelMovies().length;
    $("#statWatched").textContent = state.history.filter((e) => e.status === "watched").length;
  }

  function renderAll() {
    renderStats();
    refreshWheel();
    renderGrid();
    renderHistory();
    renderMovieOfTheDay();
  }

  /**
   * Optional: when the site is opened through server.js with a TMDB key,
   * fetch posters still missing from watchlist.js, by exact TMDB id.
   * Opened as a plain file, this does nothing.
   */
  async function fetchMissingPosters() {
    if (!/^https?:$/.test(location.protocol)) return;
    try {
      const res = await fetch("/api/health", { headers: { accept: "application/json" } });
      if (!res.ok || !(await res.json()).tmdb) return;
    } catch { return; }
    const queue = state.movies.filter((m) => !m.poster && m.tmdbId);
    const renderSoon = debounce(renderAll, 500);
    const worker = async () => {
      while (queue.length) {
        const m = queue.shift();
        try {
          const res = await fetch("/api/poster?id=" + encodeURIComponent(m.tmdbId));
          if (!res.ok) continue;
          const p = safeImageUrl((await res.json()).poster);
          if (p.startsWith("https://image.tmdb.org/")) { m.poster = p; save(); renderSoon(); }
        } catch { /* keep the pink fallback */ }
      }
    };
    await Promise.all([worker(), worker(), worker()]);
  }

  function setupPhoto() {
    const img = $("#usPhoto");
    const box = img.closest(".polaroid-photo");
    const missing = () => box.classList.add("no-photo");
    if (img.complete && img.naturalWidth === 0) missing();
    img.addEventListener("error", missing, { once: true });
    img.addEventListener("load", () => box.classList.remove("no-photo"), { once: true });
  }

  function bindEvents() {
    $("#spinBtn").addEventListener("click", doSpin);
    $("#hubSpin").addEventListener("click", doSpin);
    $("#resultRetry").addEventListener("click", () => { $("#resultDialog").close(); doSpin(); });
    $("#resultConfirm").addEventListener("click", confirmResult);
    $("#resultClose").addEventListener("click", () => $("#resultDialog").close());
    // Click on the backdrop closes the dialog
    $("#resultDialog").addEventListener("click", (e) => { if (e.target === e.currentTarget) e.currentTarget.close(); });

    const bindToggle = (sel, key) => {
      const el = $(sel);
      el.checked = !!state.settings[key];
      el.addEventListener("change", () => { state.settings[key] = el.checked; save(); renderAll(); if (key === "surprise") Wheel.build(); });
    };
    bindToggle("#optSurprise", "surprise");
    bindToggle("#optExcludeWatched", "excludeWatched");
    bindToggle("#optFavoritesOnly", "favoritesOnly");

    $("#soundToggle").addEventListener("click", () => { state.settings.sound = !state.settings.sound; save(); updateSoundButton(); if (state.settings.sound) Sound.tick(); });
    $("#nightToggle").addEventListener("click", () => { state.settings.night = !state.settings.night; save(); applyNight(); });
    $("#langToggle").addEventListener("click", () => {
      state.settings.lang = state.settings.lang === "fr" ? "en" : "fr";
      save(); applyTexts(); Wheel.build(); renderAll(); nextLoveNote();
    });

    $("#movieGrid").addEventListener("click", onGridClick);
    $("#historyList").addEventListener("click", onHistoryClick);
    $("#searchInput").addEventListener("input", debounce((e) => { filters.q = e.target.value; renderGrid(); }, 150));
    $("#filterDecade").addEventListener("change", (e) => { filters.decade = e.target.value; renderGrid(); });
    $("#filterGenre").addEventListener("change", (e) => { filters.genre = e.target.value; renderGrid(); });
    $("#filterShow").addEventListener("change", (e) => { filters.show = e.target.value; renderGrid(); });
    $("#loveNoteNext").addEventListener("click", nextLoveNote);
    $("#herWatchlistLink").href = CONFIG.WATCHLIST_URL;

    // Highlight the nav link of the section in view
    const links = [...document.querySelectorAll(".main-nav a")];
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) links.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#" + en.target.id));
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    ["wheel", "watchlist", "history"].forEach((id) => io.observe(document.getElementById(id)));

    window.addEventListener("resize", debounce(setupFairyLights, 300));
    // Keep tabs in sync if the site is open twice
    window.addEventListener("storage", (e) => {
      if (e.key !== CONFIG.STORAGE_KEY || !e.newValue || Wheel.spinning) return;
      try { state = JSON.parse(e.newValue); state.settings = { ...defaultSettings(), ...state.settings }; renderAll(); } catch { /* ignore */ }
    });
  }

  function init() {
    applyTexts();
    applyNight();
    setupFairyLights();
    setupPhoto();
    Wheel.init();
    bindEvents();
    renderAll();
    nextLoveNote();
    // Redraw the wheel once the web fonts are ready, so titles use DM Sans.
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => Wheel.build());
    fetchMissingPosters();
  }

  // Expose a tiny API for debugging / tests in the console.
  window.OLMN = { state: () => state, Wheel, wheelMovies };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
