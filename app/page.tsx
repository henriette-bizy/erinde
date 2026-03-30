"use client";
import React from "react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getCurrentUser } from "@/lib/storage";
import { Activity, Thermometer, Wind, BatteryLow, Brain, AlertTriangle } from "lucide-react";

export default function HomePage() {
  const [loggedIn, setLoggedIn] = useState(false);
  useEffect(() => { setLoggedIn(!!getCurrentUser()); }, []);

  return (
    <div style={{ minHeight: "100vh", background: "white" }}>
      {/* Nav */}
      <nav className="nav">
        <a href="/" className="logo">e<span>-RINDE</span></a>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <Link href="/education" className="btn-ghost">Education</Link>
          {loggedIn ? (
            <Link href="/dashboard" className="btn-primary">My Dashboard →</Link>
          ) : (
            <>
              <Link href="/auth/login" className="btn-ghost">Login / Register</Link>
              <Link href="/auth/register" className="btn-primary">Get Started</Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero */}
      <section style={{ maxWidth:1100, margin:"0 auto", padding:"80px 48px 64px", display:"grid", gridTemplateColumns:"1fr 420px", gap:80, alignItems:"center" }}>
        <div className="slide-up">
          <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:"var(--blue-light)", border:"1px solid var(--blue-mid)", borderRadius:999, padding:"5px 14px", fontSize:12, fontWeight:700, color:"var(--blue)", letterSpacing:0.5, marginBottom:24 }}>
            🌍 BUILT FOR AFRICA&apos;S COMMUNITIES
          </div>
          <h1 style={{ fontSize:52, fontWeight:800, color:"var(--text-dark)", lineHeight:1.1, marginBottom:20, letterSpacing:"-1px" }}>
            Early health<br/>
            <span style={{ color:"var(--blue)" }}>risk awareness</span><br/>
            at your fingertips.
          </h1>
          <p style={{ fontSize:17, color:"var(--text-mid)", lineHeight:1.75, marginBottom:36, maxWidth:480 }}>
            e-RINDE helps communities in rural and underserved areas check symptoms, understand risks, and know when to seek care — before it&apos;s too late.
          </p>
          <div style={{ display:"flex", gap:12, marginBottom:48 }}>
            <Link href="/auth/register" className="btn-primary" style={{ padding:"13px 28px", fontSize:15 }}>Start Free Assessment</Link>
            <Link href="#how" className="btn-outline" style={{ padding:"12px 24px", fontSize:15 }}>How it works</Link>
          </div>
          <div style={{ display:"flex", gap:36 }}>
            {[["100%","Free forever"],["< 5 min","Per assessment"],["3","Risk levels"]].map(([v,l])=>(
              <div key={l}>
                <div style={{ fontSize:22, fontWeight:800, color:"var(--blue)", letterSpacing:"-0.5px" }}>{v}</div>
                <div style={{ fontSize:13, color:"var(--text-light)", marginTop:2 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Mock UI card */}
        <div className="slide-up s2" style={{ position:"relative" }}>
          <div style={{ background:"white", borderRadius:20, border:"1px solid var(--border)", boxShadow:"0 20px 60px rgba(37,99,235,0.12)", padding:28 }}>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:20 }}>
              <div style={{ width:36, height:36, borderRadius:10, background:"var(--blue)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                <Activity size={18} color="white" strokeWidth={2} />
              </div>
              <div>
                <div style={{ fontWeight:700, fontSize:14, color:"var(--text-dark)" }}>Symptom Assessment</div>
                <div style={{ fontSize:12, color:"var(--text-light)" }}>Quick · Safe · Confidential</div>
              </div>
            </div>
            <div style={{ fontSize:12, fontWeight:600, color:"var(--text-light)", letterSpacing:1, marginBottom:10 }}>SELECT YOUR SYMPTOMS</div>
            {([{Icon:Thermometer,l:"Fever",on:true},{Icon:Wind,l:"Cough",on:true},{Icon:BatteryLow,l:"Fatigue",on:false},{Icon:Brain,l:"Headache",on:false}] as {Icon:React.ElementType;l:string;on:boolean}[]).map(s=>(
              <div key={s.l} style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 12px", borderRadius:10, marginBottom:6, background:s.on?"var(--blue-light)":"var(--bg)", border:`1px solid ${s.on?"var(--blue-mid)":"var(--border)"}` }}>
                <s.Icon size={18} color={s.on?"var(--blue)":"var(--text-mid)"} strokeWidth={1.8} />
                <span style={{ flex:1, fontSize:13, fontWeight:500, color:s.on?"var(--blue)":"var(--text-mid)" }}>{s.l}</span>
                {s.on && <div style={{ width:18, height:18, borderRadius:"50%", background:"var(--blue)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, color:"white", fontWeight:700 }}>✓</div>}
              </div>
            ))}
            <div style={{ marginTop:16, padding:"14px 16px", borderRadius:12, background:"var(--amber-light)", border:"1px solid #FDE68A", display:"flex", alignItems:"center", gap:12 }}>
              <AlertTriangle size={22} color="#D97706" strokeWidth={2} style={{ flexShrink:0 }} />
              <div>
                <div style={{ fontWeight:700, fontSize:13, color:"#D97706" }}>Moderate Risk Detected</div>
                <div style={{ fontSize:12, color:"#92400E" }}>Schedule a clinic visit within 2–3 days</div>
              </div>
            </div>
          </div>
          <div style={{ position:"absolute", top:-12, right:-12, background:"var(--blue)", color:"white", padding:"6px 14px", borderRadius:999, fontSize:11, fontWeight:700 }}>NOT A DIAGNOSIS</div>
        </div>
      </section>

      <hr className="divider" />

      {/* How it works */}
      <section id="how" style={{ background:"var(--bg)", padding:"72px 48px" }}>
        <div style={{ maxWidth:1000, margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:52 }}>
            <div style={{ fontSize:12, fontWeight:700, color:"var(--blue)", letterSpacing:1.5, marginBottom:10 }}>HOW IT WORKS</div>
            <h2 style={{ fontSize:34, fontWeight:800, color:"var(--text-dark)", letterSpacing:"-0.5px" }}>Three steps to clarity</h2>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:24 }}>
            {[
              { n:"01", icon:"📋", title:"Report Symptoms", desc:"Select from our icon-guided list. No medical knowledge needed." },
              { n:"02", icon:"🔬", title:"Risk Analysis",   desc:"Our engine scores your symptoms using evidence-based rules." },
              { n:"03", icon:"💊", title:"Get Guidance",    desc:"Receive plain-language next steps — self-care to urgent referral." },
            ].map((s,i)=>(
              <div key={s.n} className={`card s${i+1} slide-up`} style={{ textAlign:"center" }}>
                <div style={{ width:48, height:48, borderRadius:12, background:"var(--blue-light)", margin:"0 auto 14px", display:"flex", alignItems:"center", justifyContent:"center", fontSize:22 }}>{s.icon}</div>
                <div style={{ fontSize:11, fontWeight:700, color:"var(--blue)", letterSpacing:2, marginBottom:8 }}>STEP {s.n}</div>
                <h3 style={{ fontSize:17, fontWeight:700, color:"var(--text-dark)", marginBottom:8 }}>{s.title}</h3>
                <p style={{ fontSize:14, color:"var(--text-mid)", lineHeight:1.65 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <hr className="divider" />

      {/* CTA */}
      <section style={{ padding:"72px 48px", textAlign:"center", background:"white" }}>
        <div style={{ maxWidth:520, margin:"0 auto" }}>
          <h2 style={{ fontSize:32, fontWeight:800, color:"var(--text-dark)", marginBottom:14, letterSpacing:"-0.5px" }}>Ready to check your health?</h2>
          <p style={{ color:"var(--text-mid)", marginBottom:28, fontSize:15 }}>It&apos;s free, takes under 5 minutes, and could make all the difference.</p>
          <Link href="/auth/register" className="btn-primary" style={{ fontSize:15, padding:"13px 32px" }}>Create Free Account →</Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background:"var(--text-dark)", padding:"32px 48px", textAlign:"center" }}>
        <a href="/" className="logo" style={{ color:"white", fontSize:18, display:"inline-block", marginBottom:8 }}>e<span style={{ color:"var(--accent)" }}>-RINDE</span></a>
        <p style={{ fontSize:13, color:"#64748B", marginBottom:4 }}>Early Health Risk Awareness System · African Leadership University</p>
        <p style={{ fontSize:12, color:"#475569" }}>⚠️ Not a medical diagnostic tool. Always consult a qualified healthcare professional.</p>
      </footer>
    </div>
  );
}
