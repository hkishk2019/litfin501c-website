/* =====================================================================
   render.js — turns the PANELS manifest into DOM.

   Layout rules:
   - Hero is always full-width on top.
   - Each secondary photo gets its OWN row paired with one text card
     (left or right alternates). No two photos ever share a horizontal.
   - The "Download Photo" dropdown lets the visitor add a personal
     handwritten note + signature, then downloads the hero with the
     inscription burned into the image (canvas).

   No framework, no build step. Reads window.PANELS from panels.js.
   ===================================================================== */

(function () {
    "use strict";

    /* ------------------------------------------------------------------ *
     *  DOM helpers
     * ------------------------------------------------------------------ */

    function el(tag, className, content) {
        const node = document.createElement(tag);
        if (className) node.className = className;
        if (content !== undefined) node.innerHTML = content;
        return node;
    }

    function svgChevron() {
        // CSS-only chevron via two borders, rotated by .pg-download[open].
        return el("span", "pg-download-chevron");
    }

    /* ------------------------------------------------------------------ *
     *  Per-panel rendering
     * ------------------------------------------------------------------ */

    function renderCard(card) {
        const node = el("aside", "pg-card");
        if (card.eyebrow) node.appendChild(el("div", "pg-card-eyebrow", card.eyebrow));

        if (card.list && Array.isArray(card.list)) {
            const ul = document.createElement("ul");
            ul.className = "pg-card-list";
            card.list.forEach(person => {
                const li = document.createElement("li");
                li.appendChild(el("span", "pg-card-list-name", person.name));
                li.appendChild(el("span", "pg-card-list-role", person.role));
                ul.appendChild(li);
            });
            node.appendChild(ul);
        } else {
            if (card.name) node.appendChild(el("h3", "pg-card-name", card.name));
            if (card.role) node.appendChild(el("p", "pg-card-role", card.role));
        }

        if (card.quote) {
            node.appendChild(el("div", "pg-card-rule"));
            node.appendChild(el("p", "pg-card-quote", `&ldquo;${card.quote}&rdquo;`));
        }
        return node;
    }

    function renderPhoto(photo) {
        const cls = "pg-stagger-photo" + (photo.halfWidth ? " pg-stagger-photo--half" : "");
        const wrap = el("figure", cls);
        const img = document.createElement("img");
        img.src = photo.src;
        img.alt = photo.alt || "";
        img.loading = "lazy";
        wrap.appendChild(img);
        return wrap;
    }

    /**
     * Build the staggered rows. Manifest gives a `secondaries` array of
     * { photo, card } pairs. For each pair we render one CSS-grid row,
     * alternating which side the photo sits on so the wall feels woven.
     *
     * Edge cases:
     *   - photo only -> .pg-stagger row with just the photo (no empty col)
     *   - card only  -> .pg-card-standalone, a centered narrow card
     *                   (skips the grid entirely so there's no blank column)
     */
    function renderStagger(panel) {
        const pairs = panel.secondaries;
        if (!pairs || pairs.length === 0) return null;

        const frag = document.createDocumentFragment();
        pairs.forEach((pair, i) => {
            // Card-only pair → render as a standalone centered card.
            if (!pair.photo && pair.card) {
                const wrap = el("div", "pg-standalone-card");
                wrap.appendChild(renderCard(pair.card));
                frag.appendChild(wrap);
                return;
            }
            // Photo-only pair → render as a single centered photo band.
            if (pair.photo && !pair.card) {
                const wrap = el("div", "pg-standalone-photo");
                wrap.appendChild(renderPhoto(pair.photo));
                frag.appendChild(wrap);
                return;
            }
            // Photo + card → 2-column staggered row, alternating side.
            const row = document.createElement("div");
            row.className = "pg-stagger" + (i % 2 === 1 ? " pg-stagger--reversed" : "");
            if (i % 2 === 1) {
                row.appendChild(renderCard(pair.card));
                row.appendChild(renderPhoto(pair.photo));
            } else {
                row.appendChild(renderPhoto(pair.photo));
                row.appendChild(renderCard(pair.card));
            }
            frag.appendChild(row);
        });
        return frag;
    }

    function renderHero(panel) {
        if (!panel.hero) {
            const placeholder = el("div", "pg-hero pg-hero--placeholder");
            placeholder.appendChild(el("span", "pg-placeholder-text", "Photographs to follow"));
            return placeholder;
        }
        const hero = el("figure", "pg-hero");
        const img = document.createElement("img");
        img.src = panel.hero;
        img.alt = panel.heroAlt || `${panel.title} — photograph`;
        img.loading = "lazy";
        // Tag for the download handler so it can find the right image.
        img.dataset.role = "hero";
        hero.appendChild(img);
        return hero;
    }

    /**
     * The "Download Photo" dropdown. Native <details>/<summary> handles the
     * open/close. The submit click triggers a canvas render of the hero
     * image with the user's note + signature in script type, then downloads.
     */
    function renderDownload(panel) {
        if (!panel.hero) return null; // nothing to download yet

        const details = document.createElement("details");
        details.className = "pg-download";

        const summary = document.createElement("summary");
        summary.appendChild(document.createTextNode("Download Photo"));
        summary.appendChild(svgChevron());
        details.appendChild(summary);

        const body = el("div", "pg-download-body");

        body.appendChild(el("label", "pg-download-label", "Add a personal note"));
        const note = document.createElement("textarea");
        note.className = "pg-download-textarea";
        note.placeholder = "with admiration";
        note.maxLength = 180;
        note.rows = 2;
        body.appendChild(note);
        body.appendChild(el("p", "pg-download-hint",
            "Optional. One line, in script — like a postcard inscription."));

        body.appendChild(el("label", "pg-download-label", "Sign as"));
        const sig = document.createElement("input");
        sig.type = "text";
        sig.className = "pg-download-input";
        sig.placeholder = "Your name";
        sig.maxLength = 60;
        body.appendChild(sig);

        const submit = el("button", "pg-download-submit", "Download");
        submit.type = "button";
        body.appendChild(submit);

        submit.addEventListener("click", () => {
            submit.disabled = true;
            submit.textContent = "Preparing…";
            generateInscribedImage(panel, note.value, sig.value)
                .then(blob => {
                    triggerDownload(blob, `${panel.id}-litfin501c.jpg`);
                })
                .catch(err => {
                    console.error("Download failed", err);
                    alert("Sorry — download failed. " + err.message);
                })
                .finally(() => {
                    submit.disabled = false;
                    submit.textContent = "Download";
                });
        });

        details.appendChild(body);
        return details;
    }

    function renderPanelHead(panel) {
        const head = el("div", "pg-panel-head");
        if (panel.eyebrow) head.appendChild(el("div", "pg-panel-eyebrow", panel.eyebrow));
        head.appendChild(el("h2", "pg-panel-title", panel.title));
        if (panel.subtitle) head.appendChild(el("p", "pg-panel-subtitle", panel.subtitle));
        const dl = renderDownload(panel);
        if (dl) head.appendChild(dl);
        return head;
    }

    function renderPanel(panel) {
        const section = el("section", "pg-panel");
        if (!panel.hero) section.classList.add("pg-panel--upcoming");
        section.id = `panel-${panel.id}`;

        section.appendChild(renderPanelHead(panel));
        section.appendChild(renderHero(panel));

        const stagger = renderStagger(panel);
        if (stagger) section.appendChild(stagger);

        return section;
    }

    /* ------------------------------------------------------------------ *
     *  Room rendering (light or dark themed band)
     * ------------------------------------------------------------------ */

    function renderRoomHeader(room) {
        const head = el("div", "pg-room-header");
        if (room.eyebrow) head.appendChild(el("div", "pg-room-header-eyebrow", room.eyebrow));
        head.appendChild(el("h2", "pg-room-header-title", room.title));
        if (room.subtitle) head.appendChild(el("p", "pg-room-header-sub", room.subtitle));
        return head;
    }

    function renderRoom(room) {
        const section = el("section", "pg-room " + room.themeClass);
        section.id = `room-${room.id}`;
        section.appendChild(renderRoomHeader(room));
        room.panels.forEach(panel => section.appendChild(renderPanel(panel)));
        return section;
    }

    /* ------------------------------------------------------------------ *
     *  Inscribed-photo download (canvas)
     * ------------------------------------------------------------------ */

    /**
     * Draw a QR code square at (x, y) with side length `size`.
     * Requires the global `qrcode` function from qrcode-generator CDN.
     * Returns true on success, false if the library isn't available.
     */
    function drawQROnCanvas(ctx, url, x, y, size, fgColor) {
        if (typeof qrcode === "undefined") return false;
        try {
            const qr = qrcode(0, "M");   // type 0 = auto, M = medium ECC
            qr.addData(url);
            qr.make();
            const n    = qr.getModuleCount();
            const cell = size / n;

            // White backing so QR sits clean on any background
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(x, y, size, size);

            ctx.fillStyle = fgColor || "#1a1a2e";
            for (let r = 0; r < n; r++) {
                for (let c = 0; c < n; c++) {
                    if (qr.isDark(r, c)) {
                        ctx.fillRect(
                            x + Math.floor(c * cell),
                            y + Math.floor(r * cell),
                            Math.ceil(cell),
                            Math.ceil(cell)
                        );
                    }
                }
            }
            return true;
        } catch (e) {
            return false;
        }
    }

    /** Set letterSpacing on a canvas context if the browser supports it. */
    function setLetterSpacing(ctx, val) {
        try { ctx.letterSpacing = val; } catch (_) { /* noop */ }
    }

    /**
     * Force Pinyon Script to actually download before we paint on canvas.
     * `document.fonts.load()` alone only works if the font is already in use
     * on the page; since we only use it inside Canvas we need to force it via
     * a hidden off-screen element as well.
     */
    function ensureScriptFontLoaded() {
        // 1. Off-screen DOM element so the browser fetches the font file.
        if (!document._pinyonProbe) {
            const probe = document.createElement("span");
            probe.style.cssText =
                "font-family:'Pinyon Script',serif;font-size:0px;" +
                "position:absolute;left:-9999px;visibility:hidden;";
            probe.textContent = "Ag";
            document.body.appendChild(probe);
            document._pinyonProbe = probe;
        }
        // 2. Promise-based readiness check (falls back silently if not supported).
        if (!document.fonts || !document.fonts.load) return Promise.resolve();
        return Promise.all([
            document.fonts.load("60px 'Pinyon Script'", "Ag"),
            document.fonts.load("48px 'Pinyon Script'", "Ag"),
        ]);
    }

    function loadImage(src) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = "anonymous"; // safe even though we serve same-origin
            img.onload = () => resolve(img);
            img.onerror = () => reject(new Error(`Could not load ${src}`));
            img.src = src;
        });
    }

    /**
     * Generates a Polaroid-style JPEG.
     *
     * Bottom strip layout (left → right):
     *   [personal note + signature in Pinyon Script]  ···  [conference info text | QR code]
     *
     * All dimensions are proportional to the photo width so the output
     * looks identical regardless of whether it comes from a 900 px thumb
     * or an 1800 px hero.
     *
     * Borders:
     *   sides & top : 5 % of photo width
     *   bottom strip: 22 % of photo width
     */
    function generateInscribedImage(panel, note, signature) {
        return Promise.all([loadImage(panel.hero), ensureScriptFontLoaded()])
            .then(([img]) => {
                const pW = img.naturalWidth;
                const pH = img.naturalHeight;

                const sideB   = Math.round(pW * 0.05);
                const topB    = Math.round(pW * 0.05);
                const bottomB = Math.round(pW * 0.22);

                const canvasW = pW + sideB * 2;
                const canvasH = pH + topB + bottomB;

                const canvas = document.createElement("canvas");
                canvas.width  = canvasW;
                canvas.height = canvasH;
                const ctx = canvas.getContext("2d");

                // ── White Polaroid background ──────────────────────────────
                ctx.fillStyle = "#ffffff";
                ctx.fillRect(0, 0, canvasW, canvasH);

                // ── Photo (untouched, natural size) ────────────────────────
                ctx.drawImage(img, sideB, topB, pW, pH);

                // Shared strip geometry
                const stripTop  = topB + pH;
                const stripMidY = stripTop + Math.round(bottomB / 2);

                // ── RIGHT SIDE: gold bar + conference text + QR ───────────
                // Design mirrors the MCA announcement card:
                //   [gold vertical bar] Chicago Litigation Finance
                //                       Conference 2026           (Playfair, dark navy)
                //                       May 1, 2026               (gold, Inter)
                //                       Museum of Contemporary Art, Chicago  (grey, Inter)
                //   then the QR code flush to the right border.

                const goldColor = "#c9a84c";

                // QR code — right side, vertically centred
                const qrSize = Math.round(bottomB * 0.70);
                const qrX    = canvasW - sideB - qrSize;
                const qrY    = stripTop + Math.round((bottomB - qrSize) / 2);
                drawQROnCanvas(ctx, "https://litfin501c.com", qrX, qrY, qrSize);

                // "Scan to view highlights" — centred under the QR code
                const fsScan = Math.max(10, Math.round(qrSize * 0.10));
                ctx.font         = `400 ${fsScan}px 'Inter', sans-serif`;
                ctx.fillStyle    = "#8a92a1";
                ctx.textAlign    = "center";
                ctx.textBaseline = "top";
                setLetterSpacing(ctx, "0.04em");
                ctx.fillText("Scan to view highlights", qrX + Math.round(qrSize / 2), qrY + qrSize + Math.round(fsScan * 0.4));

                // Gold vertical bar — starts at 50 % of canvas width
                const confLeft = Math.round(canvasW * 0.50);
                const barW     = Math.max(3, Math.round(pW * 0.003));
                const barH     = Math.round(bottomB * 0.74);
                const barTopY  = stripTop + Math.round((bottomB - barH) / 2);
                ctx.fillStyle  = goldColor;
                ctx.fillRect(confLeft, barTopY, barW, barH);

                // Text block starts just after the bar
                const textLeft = confLeft + barW + Math.round(pW * 0.012);

                const fsConf  = Math.round(pW * 0.020); // Playfair name lines
                const fsDate  = Math.round(pW * 0.016); // gold date
                const fsVenue = Math.round(pW * 0.013); // grey venue

                const vGap1 = Math.round(fsConf  * 0.18); // between the two name lines
                const vGap2 = Math.round(fsConf  * 0.38); // name → date
                const vGap3 = Math.round(fsDate  * 0.28); // date → venue

                const totalConfH = fsConf + vGap1 + fsConf + vGap2 + fsDate + vGap3 + fsVenue;
                let ty = stripMidY - Math.round(totalConfH / 2);

                ctx.textAlign    = "left";
                ctx.textBaseline = "top";
                ctx.shadowBlur   = 0;
                setLetterSpacing(ctx, "0em");

                // "Chicago Litigation Finance"
                ctx.font      = `500 ${fsConf}px 'Playfair Display', serif`;
                ctx.fillStyle = "#1a1a2e";
                ctx.fillText("Chicago Litigation Finance", textLeft, ty);
                ty += fsConf + vGap1;

                // "Conference 2026"
                ctx.fillText("Conference 2026", textLeft, ty);
                ty += fsConf + vGap2;

                // "May 1, 2026" in gold
                ctx.font      = `400 ${fsDate}px 'Inter', sans-serif`;
                ctx.fillStyle = goldColor;
                ctx.fillText("May 1, 2026", textLeft, ty);
                ty += fsDate + vGap3;

                // Venue in muted grey
                ctx.font      = `400 ${fsVenue}px 'Inter', sans-serif`;
                ctx.fillStyle = "#8a92a1";
                ctx.fillText("Museum of Contemporary Art, Chicago", textLeft, ty);

                // ── LEFT SIDE: personal note + signature ───────────────────
                const cleanNote = (note      || "").trim();
                const cleanSig  = (signature || "").trim();

                if (cleanNote || cleanSig) {
                    const textX    = sideB + Math.round(pW * 0.04);
                    // Available width: left margin to just before the gold bar
                    const maxTextW = confLeft - textX - Math.round(pW * 0.03);
                    const availH   = Math.round(bottomB * 0.76);
                    const MAX_NOTE_LINES = 3;

                    // Word-wrap helper — measures with whatever ctx.font is currently set
                    const wrapWords = (text, maxW, maxL) => {
                        const words = text.split(/\s+/).filter(Boolean);
                        const out = [];
                        let cur = "";
                        for (const w of words) {
                            const test = cur ? cur + " " + w : w;
                            if (ctx.measureText(test).width > maxW && cur) {
                                out.push(cur);
                                if (out.length >= maxL) break;
                                cur = w;
                            } else {
                                cur = test;
                            }
                        }
                        if (cur && out.length < maxL) out.push(cur);
                        return out;
                    };

                    // Measure line count at base size, then scale down if needed
                    let fontSize = Math.round(pW * 0.042);
                    ctx.font = `${fontSize}px "Pinyon Script", "Playfair Display", serif`;
                    const noteLines = cleanNote ? wrapWords(cleanNote, maxTextW, MAX_NOTE_LINES) : [];
                    const totalLines = noteLines.length + (cleanSig ? 1 : 0);

                    // Shrink font so all lines fit vertically inside the strip
                    if (totalLines > 1) {
                        const maxByHeight = Math.floor(availH / (totalLines * 1.55));
                        fontSize = Math.min(fontSize, maxByHeight);
                    }

                    const finalFont = `${fontSize}px "Pinyon Script", "Playfair Display", serif`;
                    ctx.font = finalFont;
                    // Re-wrap at final (possibly smaller) size
                    const finalNoteLines = cleanNote ? wrapWords(cleanNote, maxTextW, MAX_NOTE_LINES) : [];
                    const allLines = [...finalNoteLines, ...(cleanSig ? [cleanSig] : [])];
                    const lineH = Math.round(fontSize * 1.55);

                    ctx.textAlign    = "left";
                    ctx.textBaseline = "middle";
                    ctx.fillStyle    = "#2c2a26";
                    ctx.shadowColor  = "rgba(0,0,0,0.06)";
                    ctx.shadowBlur   = 3;
                    setLetterSpacing(ctx, "0em");

                    // Centre the block vertically in the strip
                    let ty = stripMidY - Math.round((allLines.length * lineH) / 2) + Math.round(lineH / 2);
                    for (const line of allLines) {
                        ctx.fillText(line, textX, ty);
                        ty += lineH;
                    }
                    ctx.shadowBlur = 0;
                }

                return canvasToBlob(canvas);
            });
    }

    function canvasToBlob(canvas) {
        return new Promise((resolve, reject) => {
            canvas.toBlob(blob => {
                if (blob) resolve(blob);
                else reject(new Error("Canvas export failed"));
            }, "image/jpeg", 0.92);
        });
    }

    function triggerDownload(blob, filename) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        // Revoke after a tick so Safari has time to consume the blob.
        setTimeout(() => URL.revokeObjectURL(url), 1000);
    }

    /* ------------------------------------------------------------------ *
     *  Boot
     * ------------------------------------------------------------------ */

    const root = document.getElementById("pg-root");
    if (!root || !window.PANELS_BY_ROOM) return;

    window.PANELS_BY_ROOM.forEach(room => {
        root.appendChild(renderRoom(room));
    });

    // Fade-in reveal for elements marked .pg-reveal when they enter the viewport.
    if ("IntersectionObserver" in window) {
        const revealObs = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add("is-visible");
                revealObs.unobserve(entry.target);
            });
        }, { threshold: 0.08 });
        document.querySelectorAll(".pg-reveal").forEach(el => revealObs.observe(el));
    } else {
        // Fallback for browsers without IntersectionObserver
        document.querySelectorAll(".pg-reveal").forEach(el => el.classList.add("is-visible"));
    }

    // Lightly highlight the room nav link as the user scrolls.
    const roomLinks = document.querySelectorAll(".pg-room-nav a[data-room]");
    if (roomLinks.length && "IntersectionObserver" in window) {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                const id = entry.target.id;
                roomLinks.forEach(a => {
                    a.classList.toggle("is-active", a.dataset.room === id);
                });
            });
        }, { rootMargin: "-40% 0% -50% 0%" });
        roomLinks.forEach(a => {
            const target = document.getElementById(a.dataset.room);
            if (target) observer.observe(target);
        });
    }
})();
