// @ts-nocheck
"use client";
import { useState, useEffect, useRef } from "react";

const CK = <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>;
const ARR = <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>;

// CSS-only branch illustrations (gradient + emoji combo that works in artifacts)
const BRANCHES = [
  { name: "Elektriker", grad: "linear-gradient(135deg,#fef3c7,#fbbf24)", symbol: "⚡", color: "#92400e" },
  { name: "Grafikdesign", grad: "linear-gradient(135deg,#fce7f3,#ec4899)", symbol: "🎨", color: "#9d174d" },
  { name: "Fotografie", grad: "linear-gradient(135deg,#e0e7ff,#6366f1)", symbol: "📸", color: "#3730a3" },
  { name: "IT-Beratung", grad: "linear-gradient(135deg,#d1fae5,#10b981)", symbol: "💻", color: "#065f46" },
  { name: "Personal Training", grad: "linear-gradient(135deg,#fee2e2,#ef4444)", symbol: "💪", color: "#991b1b" },
  { name: "Catering", grad: "linear-gradient(135deg,#ffedd5,#f97316)", symbol: "🍽️", color: "#9a3412" },
  { name: "Gartenbau", grad: "linear-gradient(135deg,#d1fae5,#22c55e)", symbol: "🌿", color: "#166534" },
  { name: "Massage", grad: "linear-gradient(135deg,#ede9fe,#8b5cf6)", symbol: "💆", color: "#5b21b6" },
  { name: "Webentwicklung", grad: "linear-gradient(135deg,#dbeafe,#3b82f6)", symbol: "🌐", color: "#1e40af" },
  { name: "DJ & Events", grad: "linear-gradient(135deg,#fae8ff,#d946ef)", symbol: "🎵", color: "#86198f" },
  { name: "Reinigung", grad: "linear-gradient(135deg,#ccfbf1,#14b8a6)", symbol: "✨", color: "#115e59" },
  { name: "+ 20 weitere", grad: "linear-gradient(135deg,#f1f5f9,#94a3b8)", symbol: "→", color: "#334155" },
];

export default function LP() {
  const [sy, setSy] = useState(0);
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [faq, setFaq] = useState(null);
  const [bill, setBill] = useState("monatlich");
  const [ds, setDs] = useState(0);

  useEffect(() => { const h = () => setSy(window.scrollY); window.addEventListener("scroll", h, { passive: true }); return () => window.removeEventListener("scroll", h); }, []);
  useEffect(() => { const t = setInterval(() => setDs(s => (s + 1) % 4), 3500); return () => clearInterval(t); }, []);

  return (
    <div className="lp">
      <style>{CSS}</style>

      {/* ══ NAV ══ */}
      <nav className={`nav ${sy > 40 ? "nav-s" : ""}`}>
        <div className="nav-in">
          <div className="brand"><div className="logo-dot" /><span className="logo-t">RechnungsKI</span></div>
          <div className="nav-r">
            <a href="#how" className="nav-l">So geht's</a>
            <a href="#branchen" className="nav-l">Branchen</a>
            <a href="#features" className="nav-l">Features</a>
            <a href="#preise" className="nav-l">Preise</a>
            <button className="btn-p nav-cta">Kostenlos starten</button>
          </div>
        </div>
      </nav>

      {/* ══ HERO ══ */}
      <section className="hero">
        <div className="hero-art">
          <div className="ha-circle ha-c1" />
          <div className="ha-circle ha-c2" />
          <div className="ha-circle ha-c3" />
          <div className="ha-dots" />
        </div>
        <div className="hero-in">
          <div className="hero-left">
            <span className="hero-tag">Für Dienstleister · Handwerker · Freelancer</span>
            <h1 className="hero-h1">Professionelle<br />Rechnungen.<br /><span className="hero-accent">In unter 2 Minuten.</span></h1>
            <p className="hero-p">Die Rechnungssoftware mit KI-Vorschlägen für 30+ Branchen. §14-konform, PDF-Export, DATEV-ready. Schluss mit Papierkram.</p>
            <div className="hero-cta">
              {!sent ? <>
                <input className="hero-inp" placeholder="deine@email.de" value={email} onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === "Enter" && email.includes("@") && setSent(true)} />
                <button className="btn-p hero-btn" onClick={() => email.includes("@") && setSent(true)}>Kostenlos starten {ARR}</button>
              </> : <div className="hero-ok">Perfekt — check dein Postfach!</div>}
            </div>
            <div className="trust-row">{["Keine Kreditkarte", "5 Rechnungen gratis", "DSGVO-konform"].map((t, i) => <span key={i} className="trust-i">{CK} {t}</span>)}</div>
          </div>

          <div className="hero-right">
            <div className="mockup">
              <div className="mock-bar"><i /><i /><i /><span className="mock-url">app.rechnungski.de</span></div>
              <div className="mock-kpis">
                {[{ l: "Umsatz", v: "€ 47.380", c: "#059669" }, { l: "Offen", v: "€ 5.240", c: "#d97706" }, { l: "Kunden", v: "23", c: "#4f46e5" }].map((k, i) =>
                  <div key={i} className="mock-kpi" style={{ borderLeftColor: k.c }}>
                    <div className="mk-l">{k.l}</div><div className="mk-v">{k.v}</div>
                  </div>
                )}
              </div>
              <div className="mock-tbl">
                {[{ n: "Müller Bau GmbH", b: "€ 3.480", s: "Bezahlt", c: "#059669" }, { n: "Lisa Weber Design", b: "€ 1.250", s: "Offen", c: "#d97706" }, { n: "Schmidt IT", b: "€ 4.200", s: "Bezahlt", c: "#059669" }].map((r, i) =>
                  <div key={i} className="mock-tr">
                    <span className="mock-tn">{r.n}</span><span className="mock-tb">{r.b}</span>
                    <span className="mock-ts" style={{ background: `${r.c}14`, color: r.c }}>{r.s}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ BRANCHEN ══ */}
      <FS id="branchen">
        <section className="sec">
          <div className="sh"><span className="stag">30+ Branchen</span><h2 className="sh2">Eine App. Jede Branche.</h2><p className="sh-p">Handwerk, IT, Kreativ, Gesundheit, Events — RechnungsKI kennt deine Preise.</p></div>
          <div className="br-grid">
            {BRANCHES.map((b, i) => (
              <div key={i} className="br-card" style={{ background: b.grad }}>
                <span className="br-symbol">{b.symbol}</span>
                <span className="br-name" style={{ color: b.color }}>{b.name}</span>
              </div>
            ))}
          </div>
        </section>
      </FS>

      {/* ══ HOW IT WORKS ══ */}
      <FS id="how">
        <section className="sec how-sec">
          <div className="sh"><span className="stag">So funktioniert's</span><h2 className="sh2">4 Schritte. 2 Minuten. Fertig.</h2></div>
          <div className="how-grid">
            <div className="how-steps">
              {[
                { t: "Branche wählen", d: "30+ Branchen mit passenden KI-Preisen", ic: "🎯", col: "#4f46e5" },
                { t: "Positionen hinzufügen", d: "KI schlägt branchenübliche Preise vor", ic: "⚡", col: "#d97706" },
                { t: "Vorschau prüfen", d: "Professionelles Layout, §14-konform", ic: "👁️", col: "#059669" },
                { t: "PDF exportieren", d: "Download, drucken oder per Mail", ic: "📄", col: "#dc2626" },
              ].map((s, i) => (
                <div key={i} className={`how-step ${ds === i ? "how-a" : ""}`} onClick={() => setDs(i)}>
                  <div className="how-ico" style={{ background: ds === i ? s.col : "#e7e5e4", color: ds === i ? "#fff" : "#78716c" }}>{ds === i ? s.ic : i + 1}</div>
                  <div><div className="how-t">{s.t}</div><div className="how-d">{s.d}</div></div>
                  {ds === i && <div className="how-bar" style={{ background: s.col }} />}
                </div>
              ))}
            </div>
            <div className="how-vis">
              <div className="demo-scr">
                {ds === 0 && <DA><div className="dl">Branche wählen</div><div className="demo-br">{BRANCHES.slice(0, 6).map((b, i) => <div key={i} className={`demo-b ${i === 0 ? "demo-ba" : ""}`} style={{ background: i === 0 ? b.grad : undefined }}><span style={{ fontSize: 20 }}>{b.symbol}</span><span>{b.name}</span></div>)}</div></DA>}
                {ds === 1 && <DA><div className="dl">KI-Vorschläge: Webdesign</div><div className="demo-pos">{[["Website (One-Pager)", "1.500 €"], ["WordPress Setup", "800 €"], ["Wartung/Monat", "120 €"]].map(([n, p], i) => <div key={i} className="demo-pr" style={{ animationDelay: `${i * .1}s` }}><span>{n}</span><span className="demo-pp">{p}</span><span className="demo-pa">+ Hinzufügen</span></div>)}</div></DA>}
                {ds === 2 && <DA><div className="dl">Rechnungsvorschau</div><div className="demo-prev"><div className="dp-h"><div><div className="dp-bar" style={{ width: 70 }} /><div className="dp-bar" style={{ width: 110, marginTop: 4, opacity: .5 }} /></div><div className="dp-re">RECHNUNG</div></div><div className="dp-line" />{[["Website erstellen", "1.500,00 €"], ["WordPress Setup", "800,00 €"], ["Wartung (1 Mo.)", "120,00 €"]].map(([n, p], i) => <div key={i} className="dp-row"><span className="dp-desc">{n}</span><span className="dp-amt">{p}</span></div>)}<div className="dp-total"><span>Gesamt (brutto)</span><span>2.879,80 €</span></div></div></DA>}
                {ds === 3 && <DA><div className="dl">Fertig!</div><div className="demo-done"><div className="demo-di">{CK}</div><div className="demo-dt">PDF bereit zum Download</div><button className="btn-p" style={{ padding: "10px 24px", fontSize: 13 }}>Herunterladen</button></div></DA>}
              </div>
            </div>
          </div>
        </section>
      </FS>

      {/* ══ FEATURES ══ */}
      <FS id="features">
        <section className="sec">
          <div className="sh"><span className="stag">Features</span><h2 className="sh2">Was drin steckt</h2></div>
          <div className="fh-grid">
            <div className="fh-card">
              <div className="fh-visual fhv-mobile">
                <div className="fh-phone"><div className="fhp-bar" /><div className="fhp-kpis"><div className="fhp-kpi" style={{ borderLeftColor: "#059669" }}>€12k</div><div className="fhp-kpi" style={{ borderLeftColor: "#d97706" }}>€2k</div></div><div className="fhp-row" /><div className="fhp-row w70" /><div className="fhp-row w50" /></div>
              </div>
              <div className="fh-c"><h3>Mobil-optimiert</h3><p>Erstelle Rechnungen auf der Baustelle, im Café oder zwischen zwei Terminen. Jedes Gerät, jede Größe.</p></div>
            </div>
            <div className="fh-card">
              <div className="fh-visual fhv-ai">
                <div className="fhai-row"><span className="fhai-dot" style={{ background: "#059669" }} /><span>Website erstellen</span><span className="fhai-p">1.500 €</span></div>
                <div className="fhai-row"><span className="fhai-dot" style={{ background: "#4f46e5" }} /><span>Logo-Design</span><span className="fhai-p">500 €</span></div>
                <div className="fhai-row"><span className="fhai-dot" style={{ background: "#d97706" }} /><span>Wartung/Monat</span><span className="fhai-p">120 €</span></div>
              </div>
              <div className="fh-c"><h3>KI-Preisvorschläge</h3><p>Wähle deine Branche — die KI kennt Preise, Einheiten und Positionen. Ein Klick, fertig.</p></div>
            </div>
          </div>
          <div className="f-grid">
            {[
              { t: "§14 UStG-konform", d: "Automatische Validierung aller Pflichtangaben." },
              { t: "Angebote → Rechnungen", d: "Ein Klick konvertiert Angebote in Rechnungen." },
              { t: "DATEV CSV-Export", d: "Im richtigen Format für deinen Steuerberater." },
              { t: "Material & Arbeit getrennt", d: "Transparente Aufschlüsselung für Kunden." },
              { t: "3-Stufen-Mahnwesen", d: "Professionelle Mahntexte, 1 Klick versenden." },
              { t: "Logo & Branding", d: "Dein Logo auf jeder Rechnung." },
            ].map((f, i) => <div key={i} className="f-card"><h4>{f.t}</h4><p>{f.d}</p></div>)}
          </div>
        </section>
      </FS>

      {/* ══ VORHER / NACHHER ══ */}
      <FS>
        <section className="sec ba-sec">
          <div className="sh"><span className="stag">Warum wechseln?</span><h2 className="sh2">Vorher vs. Nachher</h2></div>
          <div className="ba-grid">
            <div className="ba-col ba-bef">
              <div className="ba-visual ba-vis-old">
                <div className="bao-paper" /><div className="bao-paper bao-p2" /><div className="bao-pen">✏️</div>
              </div>
              <h3 className="ba-tit">Ohne RechnungsKI</h3>
              <ul className="ba-list">{["Samstags 2-3 Stunden Rechnungen", "Word-Vorlage, manuell tippen", "MwSt von Hand ausrechnen", "Excel für alles", "Unsicher ob §14-konform"].map((t, i) => <li key={i}>{t}</li>)}</ul>
            </div>
            <div className="ba-div"><span className="ba-arr">→</span></div>
            <div className="ba-col ba-aft">
              <div className="ba-visual ba-vis-new">
                <div className="ban-screen"><div className="ban-bar" /><div className="ban-row" /><div className="ban-row w60" /><div className="ban-check">{CK}</div></div>
              </div>
              <h3 className="ba-tit ba-tit-g">Mit RechnungsKI</h3>
              <ul className="ba-list ba-list-g">{["2 Minuten, fertig", "KI schlägt Positionen vor", "MwSt automatisch", "Ein Dashboard für alles", "§14-Validierung warnt"].map((t, i) => <li key={i}>{t}</li>)}</ul>
            </div>
          </div>
        </section>
      </FS>

      {/* ══ PRICING ══ */}
      <FS id="preise">
        <section className="sec">
          <div className="sh">
            <span className="stag">Preise</span><h2 className="sh2">Einfach. Fair. Transparent.</h2>
            <div className="p-tog"><button className={`pt ${bill === "monatlich" ? "pta" : ""}`} onClick={() => setBill("monatlich")}>Monatlich</button><button className={`pt ${bill === "jaehrlich" ? "pta" : ""}`} onClick={() => setBill("jaehrlich")}>Jährlich <span className="pts">-20%</span></button></div>
          </div>
          <div className="p-grid">
            {[
              { n: "Free", p: 0, pj: 0, s: "Zum Ausprobieren", f: ["5 Rechnungen/Mo", "3 Kunden", "KI-Vorschläge", "MwSt-Automatik"] },
              { n: "Starter", p: 9.99, pj: 7.99, s: "Einzelunternehmer", f: ["50 Rechnungen", "25 Kunden", "Logo & Branding", "PDF-Export", "Angebote", "Material/Arbeit", "Rabatt"], pop: true },
              { n: "Pro", p: 24.99, pj: 19.99, s: "Wachsende Betriebe", f: ["500 Rechnungen", "Unbegr. Kunden", "Alles aus Starter", "3-Stufen-Mahnung", "DATEV Export", "§14 Validierung"] },
              { n: "Enterprise", p: 49.99, pj: 39.99, s: "Teams", f: ["Unbegrenzt", "Multi-User", "API-Zugang", "DATEV direkt", "PDF-Mailversand", "Eigener Support"] },
            ].map((pl, i) => (
              <div key={i} className={`pc ${pl.pop ? "pc-pop" : ""}`}>
                {pl.pop && <div className="pc-badge">EMPFOHLEN</div>}
                <div className="pc-name">{pl.n}</div>
                <div className="pc-pr"><span className="pc-num">{bill === "jaehrlich" ? pl.pj : pl.p}€</span><span className="pc-per">/Mo</span></div>
                <div className="pc-sub">{pl.s}</div>
                <div className="pc-feats">{pl.f.map((f, j) => <div key={j} className="pc-f">{CK} {f}</div>)}</div>
                <button className={pl.pop ? "btn-p pc-btn" : "pc-btn-o"}>{pl.p === 0 ? "Kostenlos starten" : "Auswählen"}</button>
              </div>
            ))}
          </div>
        </section>
      </FS>

      {/* ══ FAQ ══ */}
      <FS>
        <section className="sec faq-sec">
          <div className="sh"><h2 className="sh2">Häufige Fragen</h2></div>
          <div className="faq-l">
            {[
              { q: "Ist RechnungsKI §14 UStG-konform?", a: "Ja. Automatische Validierung aller Pflichtangaben: Name, Adresse, Steuernummer, fortlaufende Nummer, Datum, Steuersatz." },
              { q: "Für welche Branchen?", a: "30+ Branchen: Handwerk, IT, Kreativ, Beratung, Gesundheit, Events, Transport, Reinigung, Bildung und mehr." },
              { q: "DATEV-Export möglich?", a: "Ab dem Pro-Plan: 1-Klick CSV-Export im DATEV-Format." },
              { q: "Funktioniert es mobil?", a: "Ja. Vollständig responsive auf jedem Gerät." },
              { q: "Vertragsbindung?", a: "Nein. Monatlich kündbar. Jährlich: 20% sparen." },
              { q: "Was ist mit meinen Daten?", a: "DSGVO-konform, deutsche Server, keine Weitergabe an Dritte." },
            ].map((f, i) => (
              <div key={i} className="faq-i">
                <button className="faq-q" onClick={() => setFaq(faq === i ? null : i)}><span>{f.q}</span><span className={`faq-arr ${faq === i ? "faq-o" : ""}`}>▾</span></button>
                <div className={`faq-a ${faq === i ? "faq-ao" : ""}`}><p>{f.a}</p></div>
              </div>
            ))}
          </div>
        </section>
      </FS>

      {/* ══ CTA ══ */}
      <section className="cta-sec">
        <div className="cta-art"><div className="ha-circle ha-c1" /><div className="ha-circle ha-c2" /></div>
        <div className="cta-in">
          <h2 className="sh2 cta-h">Bereit loszulegen?</h2>
          <p className="cta-p">Kostenlos starten. Keine Kreditkarte. 30 Sekunden Setup.</p>
          <button className="btn-p cta-btn">Jetzt kostenlos starten {ARR}</button>
        </div>
      </section>

      {/* ══ FOOTER ══ */}
      <footer className="foot">
        <div className="foot-in">
          <div className="foot-left"><div className="brand"><div className="logo-dot" style={{ width: 22, height: 22 }} /><span className="logo-t" style={{ fontSize: 13 }}>RechnungsKI</span></div><p className="foot-desc">KI-Rechnungssoftware für Dienstleister.</p></div>
          <div className="foot-cols">{[{ t: "Produkt", l: ["Features", "Preise", "Changelog"] }, { t: "Rechtliches", l: ["Impressum", "Datenschutz", "AGB"] }, { t: "Support", l: ["Hilfe-Center", "Kontakt", "Status"] }].map((c, i) => <div key={i}><div className="fct">{c.t}</div>{c.l.map((l, j) => <a key={j} className="fcl">{l}</a>)}</div>)}</div>
        </div>
        <div className="foot-bot">© 2026 RechnungsKI · Made in Deutschland</div>
      </footer>
    </div>
  );
}

function DA({ children }) { return <div className="da">{children}</div>; }
function FS({ children, id }) { const r = useRef(); const [v, setV] = useState(false); useEffect(() => { const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) setV(true); }, { threshold: .05 }); if (r.current) o.observe(r.current); return () => o.disconnect(); }, []); return <div ref={r} id={id} className={`fs ${v ? "fs-v" : ""}`}>{children}</div>; }

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
*{box-sizing:border-box;margin:0;padding:0}html{scroll-behavior:smooth}::selection{background:#4f46e5;color:#fff}
.lp{font-family:'Plus Jakarta Sans',sans-serif;background:#fafaf9;color:#1c1917;overflow-x:hidden}
@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
@keyframes slideR{from{opacity:0;transform:translateX(-12px)}to{opacity:1;transform:translateX(0)}}
@keyframes pop{from{opacity:0;transform:scale(.97)}to{opacity:1;transform:scale(1)}}
@keyframes barF{from{width:0}to{width:100%}}
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
.fs{opacity:0;transform:translateY(16px);transition:all .65s cubic-bezier(.16,1,.3,1)}.fs-v{opacity:1;transform:translateY(0)}
.da{animation:pop .3s ease}

/* NAV */
.nav{position:fixed;top:0;left:0;right:0;z-index:100;padding:0 24px;transition:all .3s}
.nav-s{background:rgba(250,250,249,.95);backdrop-filter:blur(20px);border-bottom:1px solid #e7e5e4;box-shadow:0 1px 4px rgba(0,0,0,.03)}
.nav-in{max-width:1100px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;height:58px}
.brand{display:flex;align-items:center;gap:8px}.logo-dot{width:28px;height:28px;border-radius:8px;background:linear-gradient(135deg,#4f46e5,#7c3aed)}
.logo-t{font-size:16px;font-weight:800;letter-spacing:-.02em}
.nav-r{display:flex;align-items:center;gap:20px}.nav-l{color:#78716c;text-decoration:none;font-size:13.5px;font-weight:500;transition:color .2s}.nav-l:hover{color:#1c1917}
.nav-cta{padding:7px 16px;font-size:12.5px}
.btn-p{display:inline-flex;align-items:center;gap:6px;padding:10px 22px;background:#4f46e5;color:#fff;border:none;border-radius:10px;font-size:14px;font-weight:600;cursor:pointer;font-family:inherit;transition:all .2s;box-shadow:0 2px 8px rgba(79,70,229,.25)}.btn-p:hover{background:#4338ca;transform:translateY(-1px);box-shadow:0 4px 16px rgba(79,70,229,.3)}

/* HERO */
.hero{position:relative;padding:100px 24px 60px;overflow:hidden;background:#f5f3ff}
.hero-art{position:absolute;inset:0;overflow:hidden;pointer-events:none}
.ha-circle{position:absolute;border-radius:50%;opacity:.15}
.ha-c1{width:500px;height:500px;top:-120px;right:-100px;background:radial-gradient(circle,#818cf8,transparent 70%)}
.ha-c2{width:400px;height:400px;bottom:-80px;left:-60px;background:radial-gradient(circle,#c084fc,transparent 70%)}
.ha-c3{width:300px;height:300px;top:40%;left:40%;background:radial-gradient(circle,#f472b6,transparent 70%);opacity:.08}
.ha-dots{position:absolute;inset:0;background-image:radial-gradient(#4f46e5 .8px,transparent .8px);background-size:24px 24px;opacity:.04}
.hero-in{position:relative;z-index:1;max-width:1100px;margin:0 auto;display:grid;grid-template-columns:1fr 1fr;gap:48px;align-items:center}
.hero-left{}
.hero-tag{display:inline-block;padding:5px 14px;background:#ede9fe;border-radius:20px;font-size:12px;font-weight:600;color:#5b21b6;margin-bottom:18px}
.hero-h1{font-size:clamp(28px,4.5vw,48px);font-weight:800;line-height:1.1;letter-spacing:-.04em;margin-bottom:16px;color:#1e1b4b}
.hero-accent{color:#4f46e5}
.hero-p{font-size:15px;color:#57534e;line-height:1.65;max-width:460px;margin-bottom:24px}
.hero-cta{display:flex;gap:8px;margin-bottom:16px;flex-wrap:wrap}
.hero-inp{padding:11px 16px;background:#fff;border:1px solid #d6d3d1;border-radius:10px;color:#1c1917;font-size:14px;width:230px;outline:none;font-family:inherit;transition:border .2s}.hero-inp:focus{border-color:#4f46e5}
.hero-btn{padding:11px 22px;font-size:14px}
.hero-ok{padding:11px 20px;background:#d1fae5;border-radius:10px;color:#065f46;font-weight:600;border:1px solid #a7f3d0}
.trust-row{display:flex;gap:14px;flex-wrap:wrap}.trust-i{display:flex;align-items:center;gap:5px;font-size:12px;color:#78716c}
.hero-right{display:flex;justify-content:center}
.mockup{background:#0f172a;border-radius:14px;width:100%;max-width:440px;overflow:hidden;box-shadow:0 24px 64px rgba(15,23,42,.2),0 0 0 1px rgba(15,23,42,.1)}
.mock-bar{display:flex;align-items:center;gap:6px;padding:10px 14px;background:#1e293b;border-bottom:1px solid #334155}
.mock-bar i{width:8px;height:8px;border-radius:50%;display:block}.mock-bar i:nth-child(1){background:#ef4444}.mock-bar i:nth-child(2){background:#eab308}.mock-bar i:nth-child(3){background:#22c55e}
.mock-url{margin-left:12px;font-size:10px;color:#64748b;font-family:monospace}
.mock-kpis{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;padding:12px}
.mock-kpi{background:#1e293b;border-radius:8px;padding:10px;border-left:3px solid}
.mk-l{font-size:9px;color:#94a3b8;text-transform:uppercase;letter-spacing:.05em}.mk-v{font-size:16px;font-weight:700;color:#f1f5f9;margin-top:2px}
.mock-tbl{padding:0 12px 12px}
.mock-tr{display:flex;justify-content:space-between;align-items:center;padding:8px 10px;border-bottom:1px solid #1e293b;font-size:12px;color:#e2e8f0}
.mock-tn{font-weight:600}.mock-tb{font-family:monospace;font-size:11px;color:#94a3b8}.mock-ts{font-size:9px;font-weight:600;padding:2px 7px;border-radius:12px}

/* SECTIONS */
.sec{max-width:1100px;margin:0 auto;padding:52px 24px}
.sh{text-align:center;margin-bottom:28px}
.stag{display:inline-block;font-size:11px;font-weight:700;color:#4f46e5;text-transform:uppercase;letter-spacing:.1em;margin-bottom:4px}
.sh2{font-size:clamp(22px,3vw,32px);font-weight:800;letter-spacing:-.03em}
.sh-p{font-size:14px;color:#78716c;max-width:420px;margin:4px auto 0;line-height:1.55}

/* BRANCHEN */
.br-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:10px}
.br-card{border-radius:14px;padding:24px 16px;display:flex;flex-direction:column;align-items:center;gap:8px;cursor:pointer;transition:all .3s;border:1px solid transparent}
.br-card:hover{transform:translateY(-3px);box-shadow:0 8px 24px rgba(0,0,0,.06);border-color:rgba(0,0,0,.05)}
.br-symbol{font-size:32px;line-height:1}
.br-name{font-size:13px;font-weight:700;text-align:center}

/* HOW */
.how-sec{background:#f5f5f4;border-radius:20px;padding:44px 28px}
.how-grid{display:grid;grid-template-columns:1fr 1fr;gap:28px;align-items:start}
.how-steps{display:flex;flex-direction:column;gap:4px}
.how-step{display:flex;align-items:center;gap:12px;padding:14px;border-radius:12px;cursor:pointer;transition:all .2s;position:relative;overflow:hidden;border:1px solid transparent}
.how-a{background:#fff;border-color:#e7e5e4;box-shadow:0 2px 8px rgba(0,0,0,.04)}
.how-ico{width:36px;height:36px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:700;flex-shrink:0;transition:all .2s}
.how-t{font-weight:700;font-size:14px;margin-bottom:1px}.how-d{font-size:12px;color:#78716c;line-height:1.4}
.how-bar{position:absolute;bottom:0;left:0;height:2px;animation:barF 3.5s linear}
.how-vis{position:sticky;top:80px}
.demo-scr{background:#0f172a;border-radius:14px;padding:22px;min-height:260px;box-shadow:0 16px 48px rgba(15,23,42,.12)}
.dl{font-size:11px;font-weight:700;color:#818cf8;text-transform:uppercase;letter-spacing:.07em;margin-bottom:12px}
.demo-br{display:grid;grid-template-columns:repeat(3,1fr);gap:6px}
.demo-b{display:flex;flex-direction:column;align-items:center;gap:6px;padding:12px 6px;border-radius:10px;background:#1e293b;border:1px solid #334155;cursor:pointer;font-size:11px;color:#94a3b8;font-weight:500;transition:all .2s}
.demo-ba{border-color:#4f46e5;color:#e0e7ff}
.demo-pos{display:flex;flex-direction:column;gap:6px}
.demo-pr{display:flex;justify-content:space-between;align-items:center;padding:10px 12px;background:#1e293b;border-radius:8px;border:1px solid #334155;font-size:13px;color:#e2e8f0;animation:slideR .4s ease both}
.demo-pp{font-weight:700;font-family:monospace;font-size:12px;color:#a5b4fc}.demo-pa{font-size:10px;color:#818cf8;font-weight:600}
.demo-prev{background:#1e293b;border-radius:10px;padding:16px;border:1px solid #334155}
.dp-h{display:flex;justify-content:space-between;margin-bottom:10px}.dp-bar{height:7px;background:#334155;border-radius:3px}
.dp-re{font-size:16px;font-weight:800;color:#818cf8}.dp-line{height:1px;background:#334155;margin:8px 0}
.dp-row{display:flex;justify-content:space-between;padding:5px 0;font-size:12px;color:#94a3b8}.dp-desc{color:#e2e8f0}.dp-amt{font-weight:600;color:#f1f5f9}
.dp-total{display:flex;justify-content:space-between;margin-top:10px;padding-top:8px;border-top:2px solid #334155;font-size:15px;font-weight:800;color:#818cf8}
.demo-done{display:flex;flex-direction:column;align-items:center;gap:10px;margin-top:14px;color:#e2e8f0}
.demo-di{width:48px;height:48px;border-radius:14px;background:#065f46;display:flex;align-items:center;justify-content:center}
.demo-dt{font-weight:700;font-size:15px}

/* FEATURES */
.fh-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px}
.fh-card{border-radius:16px;overflow:hidden;background:#fff;border:1px solid #e7e5e4;transition:all .3s}.fh-card:hover{transform:translateY(-3px);box-shadow:0 8px 24px rgba(0,0,0,.06)}
.fh-visual{height:180px;display:flex;align-items:center;justify-content:center}
.fhv-mobile{background:linear-gradient(135deg,#ede9fe,#ddd6fe)}
.fhv-ai{background:linear-gradient(135deg,#dbeafe,#bfdbfe);flex-direction:column;gap:6px;padding:24px}
.fh-phone{width:80px;border-radius:14px;background:#0f172a;border:2px solid #334155;padding:10px 7px;display:flex;flex-direction:column;gap:5px;animation:float 4s ease infinite}
.fhp-bar{height:4px;background:#334155;border-radius:2px}
.fhp-kpis{display:flex;gap:4px}.fhp-kpi{flex:1;background:#1e293b;border-radius:5px;border-left:2px solid;padding:5px 3px;font-size:8px;font-weight:700;color:#e2e8f0}
.fhp-row{height:5px;background:#1e293b;border-radius:2px}.w70{width:70%}.w60{width:60%}.w50{width:50%}
.fhai-row{display:flex;align-items:center;gap:8px;padding:8px 12px;background:rgba(255,255,255,.7);border-radius:8px;font-size:12px;font-weight:500;backdrop-filter:blur(4px)}
.fhai-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0}.fhai-p{margin-left:auto;font-weight:700;font-family:monospace;font-size:11px;color:#4f46e5}
.fh-c{padding:20px}.fh-c h3{font-size:17px;font-weight:700;margin-bottom:5px}.fh-c p{font-size:13px;color:#78716c;line-height:1.6}
.f-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}
.f-card{padding:18px;background:#fff;border:1px solid #e7e5e4;border-radius:12px;transition:all .3s}.f-card:hover{border-color:#c7d2fe;box-shadow:0 4px 16px rgba(79,70,229,.06)}
.f-card h4{font-size:13.5px;font-weight:700;margin-bottom:3px}.f-card p{font-size:12px;color:#78716c;line-height:1.5}

/* BEFORE/AFTER */
.ba-sec{background:#f5f5f4;border-radius:20px;padding:44px 28px}
.ba-grid{display:grid;grid-template-columns:1fr auto 1fr;gap:16px;align-items:stretch}
.ba-col{background:#fff;border-radius:14px;padding:22px;border:1px solid #e7e5e4;overflow:hidden}
.ba-visual{height:120px;border-radius:10px;margin-bottom:14px;display:flex;align-items:center;justify-content:center;position:relative}
.ba-vis-old{background:linear-gradient(135deg,#fef2f2,#fee2e2)}
.bao-paper{width:50px;height:64px;background:#fff;border:1px solid #fca5a5;border-radius:4px;transform:rotate(-5deg);position:absolute}
.bao-p2{transform:rotate(8deg);left:calc(50% + 10px);border-color:#fecaca}
.bao-pen{position:absolute;bottom:12px;right:20px;font-size:20px}
.ba-vis-new{background:linear-gradient(135deg,#ecfdf5,#d1fae5)}
.ban-screen{width:70px;border-radius:10px;background:#0f172a;padding:8px 6px;display:flex;flex-direction:column;gap:4px;animation:float 4s ease infinite}
.ban-bar{height:4px;background:#334155;border-radius:2px}.ban-row{height:5px;background:#1e293b;border-radius:2px}
.ban-check{position:absolute;bottom:10px;right:16px;width:28px;height:28px;border-radius:50%;background:#059669;display:flex;align-items:center;justify-content:center}
.ba-tit{font-size:15px;font-weight:700;margin-bottom:10px}.ba-tit-g{color:#059669}
.ba-list{list-style:none;display:flex;flex-direction:column;gap:6px}
.ba-list li{font-size:12.5px;color:#78716c;line-height:1.5;padding-left:18px;position:relative}
.ba-list li::before{content:"✗";position:absolute;left:0;color:#ef4444;font-weight:700;font-size:11px}
.ba-list-g li::before{content:"✓";color:#059669}.ba-list-g li{color:#1c1917;font-weight:500}
.ba-div{display:flex;align-items:center;justify-content:center}
.ba-arr{width:36px;height:36px;border-radius:50%;background:#4f46e5;color:#fff;display:flex;align-items:center;justify-content:center;font-size:16px;font-weight:700}

/* PRICING */
.p-tog{display:inline-flex;background:#fff;border-radius:8px;padding:3px;margin-top:8px;border:1px solid #e7e5e4}
.pt{padding:6px 14px;border-radius:6px;border:none;font-size:12px;font-weight:600;cursor:pointer;background:transparent;color:#78716c;font-family:inherit}.pta{background:#4f46e5;color:#fff}.pts{color:#34d399;font-size:10px;margin-left:3px}
.p-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-top:20px}
.pc{padding:22px;background:#fff;border:1px solid #e7e5e4;border-radius:14px;display:flex;flex-direction:column;position:relative;transition:all .3s}.pc:hover{box-shadow:0 8px 24px rgba(0,0,0,.05);transform:translateY(-2px)}
.pc-pop{border:2px solid #4f46e5;box-shadow:0 4px 16px rgba(79,70,229,.08)}
.pc-badge{position:absolute;top:-9px;left:50%;transform:translateX(-50%);background:#4f46e5;color:#fff;font-size:9px;font-weight:700;padding:2px 12px;border-radius:12px}
.pc-name{font-size:12px;font-weight:700;color:#4f46e5}.pc-pr{display:flex;align-items:baseline;gap:2px;margin:4px 0 2px}
.pc-num{font-size:28px;font-weight:800;letter-spacing:-.03em}.pc-per{font-size:11px;color:#78716c}.pc-sub{font-size:11px;color:#78716c;margin-bottom:12px}
.pc-feats{flex:1;display:flex;flex-direction:column;gap:5px;margin-bottom:14px}.pc-f{display:flex;align-items:center;gap:5px;font-size:12px;color:#44403c}
.pc-btn{width:100%;padding:9px;font-size:13px}.pc-btn-o{width:100%;padding:9px;border-radius:10px;border:1px solid #e7e5e4;background:#fafaf9;color:#1c1917;font-size:13px;font-weight:600;cursor:pointer;font-family:inherit;transition:all .2s}.pc-btn-o:hover{border-color:#4f46e5;background:#f5f3ff}

/* FAQ */
.faq-sec{max-width:620px}.faq-l{display:flex;flex-direction:column}.faq-i{border-bottom:1px solid #e7e5e4}
.faq-q{width:100%;padding:14px 0;background:none;border:none;color:#1c1917;display:flex;justify-content:space-between;align-items:center;cursor:pointer;font-size:14px;font-weight:600;text-align:left;font-family:inherit;transition:color .2s}.faq-q:hover{color:#4f46e5}
.faq-arr{transition:transform .25s;color:#a8a29e;font-size:12px}.faq-o{transform:rotate(180deg)}
.faq-a{max-height:0;overflow:hidden;transition:max-height .3s,padding .3s}.faq-ao{max-height:200px;padding:0 0 14px}.faq-a p{font-size:13px;color:#78716c;line-height:1.6}

/* CTA */
.cta-sec{position:relative;padding:64px 24px;text-align:center;overflow:hidden;background:#1e1b4b}
.cta-art{position:absolute;inset:0;overflow:hidden;pointer-events:none;opacity:.3}
.cta-in{position:relative;z-index:1}.cta-h{color:#fff!important;margin-bottom:8px}.cta-p{color:#a5b4fc;font-size:15px;margin-bottom:22px}.cta-btn{font-size:16px;padding:13px 30px;background:#fff;color:#4f46e5}.cta-btn:hover{background:#f5f3ff;box-shadow:0 4px 16px rgba(255,255,255,.2)}

/* FOOTER */
.foot{padding:28px 24px 18px;border-top:1px solid #e7e5e4}.foot-in{max-width:1100px;margin:0 auto;display:flex;justify-content:space-between;flex-wrap:wrap;gap:20px}
.foot-left{max-width:220px}.foot-desc{font-size:11px;color:#a8a29e;margin-top:4px}.foot-cols{display:flex;gap:36px}
.fct{font-size:10px;font-weight:700;color:#78716c;text-transform:uppercase;letter-spacing:.06em;margin-bottom:7px}
.fcl{display:block;font-size:12px;color:#a8a29e;margin-bottom:5px;cursor:pointer;text-decoration:none;transition:color .2s}.fcl:hover{color:#1c1917}
.foot-bot{max-width:1100px;margin:18px auto 0;padding-top:14px;border-top:1px solid #e7e5e4;text-align:center;font-size:10px;color:#d6d3d1}

@media(max-width:900px){.hero-in{grid-template-columns:1fr;text-align:center}.hero-left{display:flex;flex-direction:column;align-items:center}.hero-right{margin-top:20px}.br-grid{grid-template-columns:repeat(3,1fr)}}
@media(max-width:768px){.hero-h1{font-size:28px}.how-grid{grid-template-columns:1fr}.how-vis{position:static;margin-top:16px}.fh-grid,.ba-grid{grid-template-columns:1fr}.ba-div{transform:rotate(90deg)}.f-grid{grid-template-columns:1fr 1fr}.p-grid{grid-template-columns:1fr 1fr}.br-grid{grid-template-columns:repeat(3,1fr)}.foot-cols{gap:14px}.nav-l{display:none}}
@media(max-width:480px){.p-grid,.f-grid{grid-template-columns:1fr}.br-grid{grid-template-columns:repeat(2,1fr)}}
`;
