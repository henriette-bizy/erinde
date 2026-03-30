"use client";
import { useState } from "react";
import Link from "next/link";

const ARTICLES = [
  { id:1, category:"Prevention", emoji:"🛡️", title:"How to Prevent Malaria",
    summary:"Malaria is one of Africa's most common illnesses. Learn how to protect yourself and your family.",
    content:"Malaria is transmitted through the bites of infected female Anopheles mosquitoes. Prevention includes: sleeping under insecticide-treated bed nets (ITNs), using insect repellent, wearing long-sleeved clothing at night, eliminating standing water near your home, and taking antimalarial medication when prescribed by a doctor. Early symptoms include fever, chills, headache, and muscle aches. If you experience these after potential exposure, seek medical attention immediately.", tags:["malaria","prevention","mosquito"] },
  { id:2, category:"Symptoms", emoji:"🌡️", title:"Understanding Fever: When to Worry",
    summary:"Fever is one of the most common symptoms. Learn when it signals something serious.",
    content:"A fever is a body temperature above 38°C (100.4°F). It usually means your body is fighting an infection. Most fevers from viral infections resolve in 3–4 days. Seek medical attention if: the fever is above 39.5°C, it lasts more than 3 days, you have difficulty breathing, you have a severe headache or stiff neck, or you develop a rash. Stay hydrated, rest, and use paracetamol to reduce fever under a doctor's guidance.", tags:["fever","temperature","infection"] },
  { id:3, category:"Lifestyle", emoji:"💧", title:"The Importance of Hydration",
    summary:"Water is essential to every function in your body. Are you drinking enough?",
    content:"Dehydration is a common and preventable cause of illness. Adults should drink 8–10 glasses of water daily. Signs of dehydration: dark urine, dry mouth, dizziness, and fatigue. During illness, fever, or diarrhea, you lose more fluids and must drink even more. Oral Rehydration Salts (ORS) are especially useful for diarrhea and vomiting. Always use treated or boiled water in areas where water safety is uncertain.", tags:["hydration","water","health"] },
  { id:4, category:"Prevention", emoji:"🤲", title:"Hand Hygiene: Your First Defense",
    summary:"Proper handwashing prevents the spread of most common illnesses.",
    content:"Washing your hands with soap and water for at least 20 seconds is one of the most effective ways to prevent disease spread. Always wash: before eating, after using the toilet, after caring for a sick person, and after touching animals. When soap and water are unavailable, use an alcohol-based hand sanitizer with at least 60% alcohol. Teaching children proper hand hygiene is one of the best community health investments.", tags:["hygiene","prevention","hands"] },
  { id:5, category:"Treatment", emoji:"💊", title:"When to Take Antibiotics",
    summary:"Antibiotics are powerful but often misused. Here's what you need to know.",
    content:"Antibiotics only work against bacterial infections — NOT viral infections like the common cold or flu. Misuse leads to antibiotic resistance, making medicines less effective over time. ONLY take antibiotics prescribed by a qualified healthcare professional. Always complete the full course even if you feel better. Never share antibiotics or use leftover ones from a previous illness.", tags:["antibiotics","medication","treatment"] },
  { id:6, category:"Lifestyle", emoji:"😴", title:"Sleep and Health: Why Rest Matters",
    summary:"Quality sleep is essential for your immune system and overall health.",
    content:"Adults need 7–9 hours of quality sleep per night. Poor sleep weakens your immune system, making you more susceptible to illness. During sleep, your body repairs tissues, produces immune cells, and consolidates memory. To improve sleep: maintain a regular schedule, keep your room dark and cool, avoid screens 1 hour before bed, and exercise regularly (but not right before bed). Consult a healthcare provider if you consistently struggle to sleep.", tags:["sleep","rest","immunity"] },
];

const CATS = ["All","Prevention","Symptoms","Treatment","Lifestyle"];

export default function EducationPage() {
  const [cat, setCat] = useState("All");
  const [article, setArticle] = useState<typeof ARTICLES[0]|null>(null);
  const [search, setSearch] = useState("");

  const filtered = ARTICLES.filter(a => {
    const mc = cat==="All" || a.category===cat;
    const ms = !search || a.title.toLowerCase().includes(search.toLowerCase()) || a.summary.toLowerCase().includes(search.toLowerCase());
    return mc && ms;
  });

  return (
    <div style={{ minHeight:"100vh", background:"var(--bg)" }}>
      <nav className="nav">
        <Link href="/" className="logo">e<span>-RINDE</span></Link>
        <div style={{ display:"flex", gap:8 }}>
          <Link href="/dashboard" className="btn-ghost">Dashboard</Link>
          <Link href="/assessment" className="btn-primary">Start Assessment</Link>
        </div>
      </nav>

      <div style={{ maxWidth:1060, margin:"0 auto", padding:"40px 32px" }}>
        <div className="slide-up" style={{ marginBottom:32 }}>
          <h1 style={{ fontSize:26, fontWeight:800, color:"var(--text-dark)", marginBottom:4, letterSpacing:"-0.5px" }}>Health Education</h1>
          <p style={{ color:"var(--text-mid)", fontSize:14 }}>Learn about common conditions, prevention, and healthy living</p>
        </div>

        {/* Filters */}
        <div style={{ display:"flex", gap:12, marginBottom:28, alignItems:"center", flexWrap:"wrap" }}>
          <input className="input-field" placeholder="🔍  Search articles…" value={search} onChange={e=>setSearch(e.target.value)} style={{ maxWidth:260 }} />
          <div style={{ display:"flex", gap:6 }}>
            {CATS.map(c=>(
              <button key={c} onClick={()=>setCat(c)} style={{ padding:"7px 16px", borderRadius:999, fontSize:13, fontWeight:600, cursor:"pointer", transition:"all 0.15s", background:cat===c?"var(--blue)":"white", color:cat===c?"white":"var(--text-mid)", border:`1px solid ${cat===c?"var(--blue)":"var(--border)"}` }}>{c}</button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:20 }}>
          {filtered.map((a,i)=>(
            <div key={a.id} className={`card s${(i%4)+1} slide-up`} onClick={()=>setArticle(a)}
              style={{ cursor:"pointer", borderTop:"3px solid var(--blue)", transition:"all 0.2s" }}
              onMouseEnter={e=>{ const el=e.currentTarget as HTMLDivElement; el.style.transform="translateY(-3px)"; el.style.boxShadow="var(--shadow)"; }}
              onMouseLeave={e=>{ const el=e.currentTarget as HTMLDivElement; el.style.transform=""; el.style.boxShadow=""; }}>
              <div style={{ fontSize:32, marginBottom:10 }}>{a.emoji}</div>
              <div style={{ fontSize:10, fontWeight:700, color:"var(--blue)", letterSpacing:1.5, marginBottom:6 }}>{a.category.toUpperCase()}</div>
              <h3 style={{ fontSize:16, fontWeight:700, color:"var(--text-dark)", marginBottom:8, letterSpacing:"-0.2px" }}>{a.title}</h3>
              <p style={{ fontSize:13, color:"var(--text-mid)", lineHeight:1.65 }}>{a.summary}</p>
              <div style={{ marginTop:14, fontSize:13, color:"var(--blue)", fontWeight:600 }}>Read more →</div>
            </div>
          ))}
        </div>

        {filtered.length===0 && (
          <div style={{ textAlign:"center", padding:"60px 0", color:"var(--text-mid)" }}>
            <div style={{ fontSize:44, marginBottom:10 }}>🔍</div>
            <p>No articles found. Try a different search or category.</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {article && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.4)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:100, padding:24 }} onClick={()=>setArticle(null)}>
          <div className="card fade-in" style={{ maxWidth:580, width:"100%", maxHeight:"80vh", overflowY:"auto", borderTop:"4px solid var(--blue)" }} onClick={e=>e.stopPropagation()}>
            <div style={{ fontSize:40, marginBottom:10 }}>{article.emoji}</div>
            <div style={{ fontSize:10, fontWeight:700, color:"var(--blue)", letterSpacing:1.5, marginBottom:6 }}>{article.category.toUpperCase()}</div>
            <h2 style={{ fontSize:22, fontWeight:800, color:"var(--text-dark)", marginBottom:14, letterSpacing:"-0.3px" }}>{article.title}</h2>
            <p style={{ color:"var(--text-mid)", lineHeight:1.8, fontSize:14, marginBottom:20 }}>{article.content}</p>
            <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:20 }}>
              {article.tags.map(t=><span key={t} style={{ padding:"3px 10px", background:"var(--blue-light)", borderRadius:999, fontSize:12, color:"var(--blue)" }}>#{t}</span>)}
            </div>
            <div style={{ display:"flex", gap:10 }}>
              <Link href="/assessment" className="btn-primary" style={{ fontSize:13 }}>Check Your Symptoms</Link>
              <button className="btn-ghost" onClick={()=>setArticle(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
